import mongoose, { Document, Schema } from "mongoose";

// ============================
// 1. INTERFAZ
// ============================
export interface IPastilla extends Document {
  nombre: string;
  descripcion: string;
  deletedAt?: Date | null; // Campo para baja lógica
  createdAt: Date;
  updatedAt: Date;
}

// ============================
// 2. ESQUEMA
// ============================
const PastillaSchema: Schema = new Schema(
  {
    nombre: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
      unique: true, // Evitar "Ibuprofeno" duplicado
      maxlength: [100, "El nombre no puede exceder 100 caracteres"],
    },
    descripcion: {
      type: String,
      required: [false, "La descripción es opcional"],
      trim: true,
      maxlength: [500, "La descripción no puede exceder 500 caracteres"],
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// ============================
// 3. EXPORTAR
// ============================
export default mongoose.model<IPastilla>("Pastilla", PastillaSchema);
