# Backend del proyecto MDWFINAL 2025

Este repositorio contiene la API REST encargada de gestionar los usuarios, sus tratamientos médicos y los recordatorios para la toma de pastillas del trabajo práctico final de Diseño Web.

## Tecnologías utilizadas

- Node.js & Express: Para el servidor web.
- TypeScript: Tipado estático.
- MongoDB (Mongoose): Base de datos NoSQL para almacenar tratamientos y usuarios.
- Firebase Admin: Autenticación de usuarios y envío de notificaciones push.
- Twilio: Integración de alertas vía SMS/WhatsApp.

## Estructura del proyecto

El código fuente se encuentra en el directorio `/src`:

- `/controllers`: Lógica de negocio de la aplicación.
- `/routes`: Definición de endpoints (ej: `/api/tratamientos`).
- `/models`: Esquemas de datos para MongoDB.
- `/middlewares`: Interceptores de Express (validaciones, autenticación).
- `/services`: Lógica de integración con servicios externos.
- `/validations`: Esquemas de validación de datos de entrada (Joi).

## Scripts de package.json

- `npm run dev`: Inicia el servidor de desarrollo con autorecarga.
- `npm run build`: Transpila TypeScript a JavaScript en `/dist`.
- `npm start`: Inicia la aplicación en producción.
