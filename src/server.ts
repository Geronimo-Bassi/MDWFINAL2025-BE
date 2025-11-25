import app from './app';
import connectDB from './config/database';

// ============================
// CONFIGURACIÓN DEL PUERTO
// ============================

// Obtener el puerto desde las variables de entorno o usar 3000 por defecto
const PORT = process.env.PORT || 3000;

// ============================
// INICIAR APLICACIÓN
// ============================

const startServer = async () => {
  try {
    // 1. Conectar a MongoDB Atlas
    console.log('🔄 Conectando a MongoDB Atlas...');
    await connectDB();
    
    // 2. Iniciar servidor Express
    app.listen(PORT, () => {
      console.log('╔════════════════════════════════════════╗');
      console.log('║   🚀 Servidor iniciado exitosamente   ║');
      console.log('╚════════════════════════════════════════╝');
      console.log(`📡 Servidor corriendo en: http://localhost:${PORT}`);
      console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
      console.log(`⏰ Fecha: ${new Date().toLocaleString()}`);
      console.log('════════════════════════════════════════');
      console.log('💡 Presiona CTRL + C para detener el servidor');
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ Error iniciando la aplicación:', error);
    process.exit(1);
  }
};

// ============================
// MANEJO DE ERRORES
// ============================

// Capturar errores no controlados
process.on('unhandledRejection', (err: Error) => {
  console.error('❌ Error no controlado (Promise rechazado):', err.message);
  console.error(err);
  // Cerrar el servidor de forma elegante
  process.exit(1);
});

process.on('uncaughtException', (err: Error) => {
  console.error('❌ Error no capturado (Excepción):', err.message);
  console.error(err);
  // Cerrar el servidor de forma elegante
  process.exit(1);
});

// ============================
// EJECUTAR APLICACIÓN
// ============================

startServer();