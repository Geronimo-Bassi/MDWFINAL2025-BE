import mongoose, { Document, Schema } from "mongoose";
export interface IUser extends Document {
  nombre: string;
  apellido?: string;
  email: string;
  telefono?: string;
  fechaNacimiento?: Date;
  estado: "activo" | "inactivo" | "bloqueado";
  createdAt: Date;
  updatedAt: Date;
}
const UserSchema: Schema = new Schema(
  {
    nombre: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
    },
    apellido: {
      // NUEVO
      type: String,
      required: false,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "El email es obligatorio"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    telefono: {
      type: String,
      required: false,
      trim: true,
      match: [
        /^\+[1-9]\d{1,14}$/,
        "Formato de teléfono inválido (debe incluir código de país, ej: +5491112345678)",
      ],
    },
    fechaNacimiento: {
      type: Date,
      required: false,
    },
    estado: {
      type: String,
      enum: ["activo", "inactivo", "bloqueado"],
      default: "activo",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
export default mongoose.model<IUser>("User", UserSchema);
