import mongoose, { Document, Schema } from 'mongoose';

// ============================
// 1. INTERFAZ
// ============================
export interface IPastilla extends Document {
  nombre: string;
  descripcion: string;
  // Opcional: podrías querer 'stock' o 'fabricante' aquí en el futuro
  createdAt: Date;
  updatedAt: Date;
}

// ============================
// 2. ESQUEMA
// ============================
const PastillaSchema: Schema = new Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true,
    unique: true, // Evitar "Ibuprofeno" duplicado
    maxlength: [100, 'El nombre no puede exceder 100 caracteres']
  },
  descripcion: {
    type: String,
    required: [false, 'La descripción es opcional'], // Lo cambié a opcional por flexibilidad
    trim: true,
    maxlength: [500, 'La descripción no puede exceder 500 caracteres']
  }
}, {
  timestamps: true
});

// ============================
// 3. EXPORTAR
// ============================
export default mongoose.model<IPastilla>('Pastilla', PastillaSchema);