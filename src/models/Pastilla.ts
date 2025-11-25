import mongoose, { Document, Schema } from 'mongoose';

// ============================
// INTERFACE DE TIPOS
// ============================

// Interface para el documento en MongoDB
export interface IPastilla extends Document {
  nombre: string;
  descripcion: string;
  dosis: string;
  frecuencia: number; // veces por día
  fechaInicio: Date;
  fechaFin?: Date; // opcional
  activo: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ============================
// ESQUEMA DE MONGOOSE
// ============================

const PastillaSchema: Schema = new Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true,
    maxlength: [100, 'El nombre no puede exceder 100 caracteres']
  },
  descripcion: {
    type: String,
    required: [true, 'La descripción es obligatoria'],
    trim: true,
    maxlength: [500, 'La descripción no puede exceder 500 caracteres']
  },
  dosis: {
    type: String,
    required: [true, 'La dosis es obligatoria'],
    trim: true,
    maxlength: [50, 'La dosis no puede exceder 50 caracteres']
  },
  frecuencia: {
    type: Number,
    required: [true, 'La frecuencia es obligatoria'],
    min: [1, 'La frecuencia mínima es 1 vez al día'],
    max: [10, 'La frecuencia máxima es 10 veces al día']
  },
  fechaInicio: {
    type: Date,
    required: [true, 'La fecha de inicio es obligatoria'],
    default: Date.now
  },
  fechaFin: {
    type: Date,
    required: false
  },
  activo: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true // Añade createdAt y updatedAt automáticamente
});

// ============================
// EXPORTAR MODELO
// ============================

export default mongoose.model<IPastilla>('Pastilla', PastillaSchema);