@'
# ☕ Proyecto Cafetería Británico

Sistema web de gestión de pedidos y panel de administración para la Cafetería Británico. Diseñado para automatizar el registro de compras, visualización de menú e integración de pagos mediante código QR (Yape).

---

## 🚀 Tecnologías Utilizadas

* **Backend:** Node.js, Express.js
* **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
* **Gestión de variables:** dotenv
* **Control de versiones:** Git & GitHub

---

## 📂 Estructura del Proyecto

```text
Proyecto Cafetería Británico/
├── cafeteria-britanico-backend/   # Servidor API REST con Node.js y Express
│   ├── .env                       # Variables de entorno (puerto, configuraciones)
│   ├── .gitignore
│   ├── package.json
│   ├── package-lock.json
│   └── server.js                  # Punto de entrada del servidor
└── cafeteria-britanico-frontend/  # Interfaz de usuario y panel administrativo
    ├── img/
    │   └── qr-yape.png            # QR de pago digital
    ├── panel.html                 # Vista del panel de administración
    └── pedido.html                # Vista para clientes y toma de pedidos