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

##⚙️ Configuración e Instalación
1. Clonar el repositorio
Bash
git clone [https://github.com/Miguel231106-s/proyecto-cafeter-a-brit-nico.git](https://github.com/Miguel231106-s/proyecto-cafeter-a-brit-nico.git)
cd "Proyecto Cafetería Británico"
2. Configurar el Backend
Navega a la carpeta del servidor:

Bash
cd cafeteria-britanico-backend
Instala las dependencias necesarias:

Bash
npm install
Crea un archivo .env en la raíz de cafeteria-britanico-backend con las siguientes variables:

Fragmento de código
PORT=3000
Inicia el servidor:

Bash
node server.js
3. Ejecutar el Frontend
Abre directamente los archivos pedido.html o panel.html en tu navegador web de preferencia (o utiliza la extensión Live Server en VS Code).

##📱 Funcionalidades
Módulo de Pedidos (pedido.html): Selección de productos, resumen de compra y visualización de QR Yape para realizar el pago.

Panel de Control (panel.html): Monitoreo y gestión en tiempo real de los pedidos realizados.

Servidor backend (server.js): API para gestionar y procesar las peticiones del sistema.
'@ | Out-File -FilePath "README.md" -Encoding utf8
