import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './User';
import { IPastilla } from './Pastilla';

// ============================
// 1. INTERFAZ
// ============================
export interface ITratamiento extends Document {
    usuario: IUser['_id'];  // Referencia al ID del Usuario
    pastilla: IPastilla['_id']; // Referencia al ID de la Pastilla
    dosis: string;
    frecuencia: number; // veces al día
    fechaInicio: Date;
    fechaFin?: Date;
    activo: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// ============================
// 2. ESQUEMA
// ============================
const TratamientoSchema: Schema = new Schema({
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'User', // <-- Esto conecta con el modelo 'User'
        required: [true, 'El tratamiento debe asignarse a un usuario']
    },
    pastilla: {
        type: Schema.Types.ObjectId,
        ref: 'Pastilla', // <-- Esto conecta con el modelo 'Pastilla'
        required: [true, 'El tratamiento debe tener una pastilla asignada']
    },
    dosis: {
        type: String,
        required: [true, 'La dosis es obligatoria (ej: "500mg")'],
        trim: true
    },
    frecuencia: {
        type: Number,
        required: [true, 'La frecuencia es obligatoria'],
        min: 1,
        max: 24
    },
    fechaInicio: {
        type: Date,
        default: Date.now,
        required: true
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
    timestamps: true
});

// ============================
// 3. EXPORTAR
// ============================
export default mongoose.model<ITratamiento>('Tratamiento', TratamientoSchema);
