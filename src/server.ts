import app from "./app";
import connectDB from "./config/database";
import notificationScheduler from "./services/notification.scheduler";

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // 1. Conectar a MongoDB Atlas
    console.log("Conectando a MongoDB Atlas...");
    await connectDB();

    // 2. Iniciar notification scheduler
    notificationScheduler.start();

    // 3. Iniciar servidor Express
    app.listen(PORT, () => {
      console.log("Servidor iniciado exitosamente");
      console.log(`Servidor corriendo en: http://localhost:${PORT}`);
      console.log(`Entorno: ${process.env.NODE_ENV || "development"}`);
      console.log(`Fecha: ${new Date().toLocaleString()}`);
      console.log("Presiona CTRL + C para detener el servidor");
      console.log("");
    });
  } catch (error) {
    console.error("Error iniciando la aplicación:", error);
    process.exit(1);
  }
};

process.on("unhandledRejection", (err: Error) => {
  console.error("Error no controlado (Promise rechazado):", err.message);
  console.error(err);

  process.exit(1);
});

process.on("uncaughtException", (err: Error) => {
  console.error("Error no capturado (Excepción):", err.message);
  console.error(err);

  process.exit(1);
});

startServer();
