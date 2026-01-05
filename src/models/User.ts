import mongoose, { Document, Schema } from "mongoose";
export interface IUser extends Document {
  nombre: string;
  apellido?: string; // NUEVO - opcional
  email: string;
  password?: string;
  fechaNacimiento?: Date; // NUEVO - opcional
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
    password: {
      type: String,
      required: false,
    },
    fechaNacimiento: {
      // NUEVO
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
