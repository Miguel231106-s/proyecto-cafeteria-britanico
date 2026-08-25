require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

app.get('/', (req, res) => {
  res.send('Servidor de la cafetería funcionando 🎉');
});

app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ conectado: true, hora_servidor: result.rows[0].now });
  } catch (error) {
    res.status(500).json({ conectado: false, error: error.message });
  }
});



// Obtener todos los productos disponibles
app.get('/productos', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM productos WHERE disponible = true ORDER BY id'
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



// Crear un nuevo pedido
app.post('/pedidos', async (req, res) => {
  const { nombre_alumno, hora_recojo, metodo_pago, comprobante_url, codigo_operacion, items } = req.body;

  if (!nombre_alumno || !hora_recojo || !metodo_pago || !items || items.length === 0) {
    return res.status(400).json({ error: 'Faltan datos del pedido' });
  }

  if (metodo_pago === 'yape' && !codigo_operacion) {
    return res.status(400).json({ error: 'Falta el código de operación de Yape' });
  }

  // Efectivo se confirma directo (se paga en persona). Yape queda pendiente de revisión.
  const estadoPago = metodo_pago === 'efectivo' ? 'confirmado' : 'por_verificar';

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    let montoTotal = 0;
    const itemsConPrecio = [];

    for (const item of items) {
      const productoResult = await client.query(
        'SELECT precio FROM productos WHERE id = $1',
        [item.producto_id]
      );
      if (productoResult.rows.length === 0) {
        throw new Error(`Producto ${item.producto_id} no existe`);
      }
      const precio = parseFloat(productoResult.rows[0].precio);
      montoTotal += precio * item.cantidad;
      itemsConPrecio.push({ ...item, precio_unitario: precio });
    }

    const pedidoResult = await client.query(
      `INSERT INTO pedidos (nombre_alumno, hora_recojo, metodo_pago, comprobante_url, codigo_operacion, estado_pago, monto_total)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      [nombre_alumno, hora_recojo, metodo_pago, comprobante_url || null, codigo_operacion || null, estadoPago, montoTotal]
    );
    const pedidoId = pedidoResult.rows[0].id;

    for (const item of itemsConPrecio) {
      await client.query(
        `INSERT INTO pedido_items (pedido_id, producto_id, cantidad, precio_unitario)
         VALUES ($1, $2, $3, $4)`,
        [pedidoId, item.producto_id, item.cantidad, item.precio_unitario]
      );
    }

    await client.query('COMMIT');
    res.status(201).json({ pedido_id: pedidoId, monto_total: montoTotal, estado_pago: estadoPago });

  } catch (error) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
});



// Obtener todos los pedidos con sus productos (para el panel de las trabajadoras)
app.get('/pedidos', async (req, res) => {
  try {
    const pedidosResult = await pool.query(
      `SELECT * FROM pedidos ORDER BY creado_en DESC`
    );

    // Para cada pedido, traemos sus items con el nombre del producto
    const pedidosConItems = await Promise.all(
      pedidosResult.rows.map(async (pedido) => {
        const itemsResult = await pool.query(
          `SELECT pi.cantidad, pi.precio_unitario, p.nombre
           FROM pedido_items pi
           JOIN productos p ON p.id = pi.producto_id
           WHERE pi.pedido_id = $1`,
          [pedido.id]
        );
        return { ...pedido, items: itemsResult.rows };
      })
    );

    res.json(pedidosConItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Confirmar que el pago de un pedido fue verificado (para pagos Yape)
app.patch('/pedidos/:id/pago', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `UPDATE pedidos SET estado_pago = 'confirmado' WHERE id = $1 RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});