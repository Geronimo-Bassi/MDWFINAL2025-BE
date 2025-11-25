import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// ============================
// CONFIGURACIÓN DE CONEXIÓN
// ============================

const connectDB = async (): Promise<void> => {
  try {
    // Conectar a MongoDB Atlas
    const conn = await mongoose.connect(process.env.MONGODB_URI as string);
    
    console.log('╔════════════════════════════════════════╗');
    console.log('║   🗄️  MongoDB conectado exitosamente  ║');
    console.log('╚════════════════════════════════════════╝');
    console.log(`📊 Host: ${conn.connection.host}`);
    console.log(`🏷️  Base de datos: ${conn.connection.name}`);
    console.log('════════════════════════════════════════');
    
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error);
    process.exit(1); // Cerrar aplicación si no puede conectar
  }
};

// ============================
// EVENTOS DE CONEXIÓN
// ============================

// Evento cuando se conecta
mongoose.connection.on('connected', () => {
  console.log('🔗 Mongoose conectado a MongoDB Atlas');
});

// Evento cuando hay error
mongoose.connection.on('error', (err) => {
  console.error('❌ Error en la conexión de Mongoose:', err);
});

// Evento cuando se desconecta
mongoose.connection.on('disconnected', () => {
  console.log('🔌 Mongoose desconectado de MongoDB Atlas');
});

// ============================
// EXPORTAR FUNCIÓN
// ============================

export default connectDB;