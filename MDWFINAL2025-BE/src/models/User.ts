import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    nombre: string;
    email: string;
    password?: string;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'El email es obligatorio'],
        unique: true, // Importante: no puede haber dos usuarios con el mismo email
        trim: true,
        lowercase: true // Guarda siempre en minúsculas para evitar problemas de login
    },
    password: {
        type: String,
        required: [false, 'La contraseña es requerida si te registras con correo'],

    }
}, {
    timestamps: true
});

export default mongoose.model<IUser>('User', UserSchema);
