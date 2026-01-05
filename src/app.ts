import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import pastillaRoutes from "./routes/pastillaRoutes";
import userRoutes from "./routes/userRoutes";
import tratamientoRoutes from "./routes/tratamientoRoutes";

// Cargar variables de entorno
dotenv.config();

// Crear instancia de Express
const app: Application = express();

// ============================
// MIDDLEWARES
// ============================
app.use(
  cors({
    origin: "http://localhost:5173", // Puerto del frontend (Vite)
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Parsear JSON en el body de las peticiones
app.use(express.json());

// Parsear datos de formularios (URL encoded)
app.use(express.urlencoded({ extended: true }));

// ============================
// RUTAS ESPECÍFICAS
// ============================

// Ruta raíz para verificar que el servidor funciona
app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "🚀 API de PillApp funcionando correctamente",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    endpoints: {
      pastillas: "/api/pastillas",
      users: "/api/users",
      tratamientos: "/api/tratamientos",
    },
  });
});

// Ruta de health check (para verificar el estado del servidor)
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "OK",
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
});

// ============================
// RUTAS DE LA API
// ============================

app.use("/api/pastillas", pastillaRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tratamientos", tratamientoRoutes);

// ============================
// MANEJO DE RUTAS NO ENCONTRADAS (DEBE IR AL FINAL)
// ============================

// Middleware para rutas no encontradas (404)
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Ruta no encontrada: ${req.originalUrl}`,
    availableRoutes: [
      "GET /",
      "GET /health",
      "/api/pastillas",
      "/api/users",
      "/api/tratamientos",
    ],
  });
});

// ============================
// EXPORTAR APP
// ============================

export default app;
