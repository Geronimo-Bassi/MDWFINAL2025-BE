// CRITICAL: Load environment variables FIRST, before any other imports
import dotenv from "dotenv";
dotenv.config();

import express, { Application, Request, Response } from "express";
import cors from "cors";
import pastillaRoutes from "./routes/pastillaRoutes";
import userRoutes from "./routes/userRoutes";
import tratamientoRoutes from "./routes/tratamientoRoutes";

// Crear instancia de Express
const app: Application = express();

// ============================
// MIDDLEWARES
// ============================
const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL || "",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (
        allowedOrigins.indexOf(origin) !== -1 ||
        allowedOrigins.includes("*")
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
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
