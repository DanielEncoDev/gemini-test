# Gemini Server

Servidor que utiliza la API de Google Gemini para procesar y analizar descripciones de incidentes, proporcionando respuestas estructuradas en formato JSON.

## 🚀 Características

- Procesamiento de descripciones de incidentes usando IA generativa
- Autenticación mediante JWT
- Respuestas estructuradas en formato JSON
- Validación de datos de entrada
- Manejo de errores robusto

## 🛠️ Tecnologías Utilizadas

- Node.js
- Express.js
- Firebase Vertex AI (Gemini)
- JWT para autenticación
- Jest para pruebas unitarias

## 📋 Prerrequisitos

- Node.js (v14 o superior)
- npm o yarn
- Cuenta de Google Cloud con acceso a Vertex AI
- Credenciales de Firebase

## 🔧 Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/DanielEncoDev/gemini-test.git
cd gemini-server
```

2. Instalar dependencias:
```bash
npm install
```

3. Crear archivo `.env` en la raíz del proyecto con las siguientes variables:
```env
# Firebase Config
API_KEY=tu_api_key
AUTH_DOMAIN=tu_auth_domain
PROJECT_ID=tu_project_id
STORAGE_BUCKET=tu_storage_bucket
MESSAGING_SENDER_ID=tu_messaging_sender_id
APP_ID=tu_app_id
MEASUREMENT_ID=tu_measurement_id

# JWT
JWT_SECRET=tu_jwt_secret
```

## 🚀 Uso

1. Iniciar el servidor en modo desarrollo:
```bash
npm run dev
```

2. Iniciar el servidor en modo producción:
```bash
npm start
```

3. Ejecutar pruebas:
```bash
npm test
```

## 📝 API Endpoints

### POST /api/auth/login
Autenticación de usuario.

**Request Body:**
```json
{
    "email": "usuario@ejemplo.com",
    "password": "contraseña"
}
```

**Response:**
```json
{
    "token": "jwt_token",
    "user": "usuario"
}
```

### POST /api/gemini
Procesa una descripción de incidente.

**Headers:**
```
Authorization: <jwt_token>
```

**Request Body:**
```json
{
    "message": "Se me prende fuego mi casa, no hay nadie dentro"
}
```

**Response:**
```json
{
    "date": "2024-03-20",
    "location": "domicilio titular",
    "description": "House fire",
    "injuries": false,
    "owner": true,
    "complete": true,
    "question": ""
}
```

## 🔍 Decisiones Técnicas

### 1. Elección de Vertex AI (Gemini)
- Se eligió Vertex AI por su integración nativa con Firebase para poder generar respuestas estructuradas tipo JSON (application/json)
- El modelo Gemini 2.0 Flash ofrece excelente rendimiento para tareas de procesamiento de texto
- La configuración de temperatura en 0.2 asegura respuestas consistentes y estructuradas

### 2. Estructura del Proyecto
```
gemini-server/
├── controllers/     # Lógica de negocio
├── routes/         # Definición de rutas
├── services/       # Servicios externos
├── __tests__/      # Pruebas unitarias
└── config/         # Configuraciones
```

### 3. Autenticación
- Implementación de JWT para autenticación stateless
- Middleware de validación de token para proteger rutas sensibles
- Extracción del nombre de usuario desde el email para simplificación

### 4. Manejo de Datos
- Esquema JSON definido para estandarizar respuestas
- Validación de datos de entrada
- Manejo de errores con mensajes descriptivos

## 🧪 Pruebas

El proyecto incluye pruebas unitarias para:
- Controlador de autenticación
- Servicio de Gemini
- Validación de respuestas

Para ejecutar las pruebas:
```bash
npm test
```

## 🔒 Seguridad

- Tokens JWT para autenticación
- Variables de entorno para credenciales sensibles
- Validación de datos de entrada
- Manejo seguro de errores

## 📦 Dependencias Principales

- express: ^4.21.2
- firebase: ^11.4.0
- jsonwebtoken: ^9.0.2
- jest: ^29.7.0 (dev)

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. 

## 👥 Authors

    - @danielencodev 