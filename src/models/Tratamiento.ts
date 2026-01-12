import mongoose, { Document, Schema } from "mongoose";
import { IUser } from "./User";
import { IPastilla } from "./Pastilla";

export interface IHorario {
  hora: string;
  tomado: boolean;
  ultimaToma?: Date;
}

export interface ITratamiento extends Document {
  usuario: IUser["_id"];
  pastilla: IPastilla["_id"];
  dosis: string;
  frecuencia: number;
  horaInicio: string;
  intervaloHoras: number;
  horarios: IHorario[];
  fechaInicio: Date;
  fechaFin?: Date;
  activo: boolean;
  estado: "activo" | "finalizado" | "suspendido" | "cancelado";
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const HorarioSchema: Schema = new Schema(
  {
    hora: {
      type: String,
      required: true,
      match: [
        /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/,
        "Formato de hora inválido (debe ser HH:mm)",
      ],
    },
    tomado: {
      type: Boolean,
      default: false,
    },
    ultimaToma: {
      type: Date,
      required: false,
    },
  },
  { _id: false }
);

const TratamientoSchema: Schema = new Schema(
  {
    usuario: {
      type: Schema.Types.ObjectId,
      ref: "User", // <-- Esto conecta con el modelo 'User'
      required: [true, "El tratamiento debe asignarse a un usuario"],
    },
    pastilla: {
      type: Schema.Types.ObjectId,
      ref: "Pastilla", // <-- Esto conecta con el modelo 'Pastilla'
      required: [true, "El tratamiento debe tener una pastilla asignada"],
    },
    dosis: {
      type: String,
      required: [true, 'La dosis es obligatoria (ej: "500mg")'],
      trim: true,
    },
    frecuencia: {
      type: Number,
      required: [true, "La frecuencia es obligatoria"],
      min: 1,
      max: 24,
    },
    horaInicio: {
      type: String,
      required: [true, "La hora de inicio es obligatoria"],
      match: [
        /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/,
        "Formato de hora inválido (debe ser HH:mm)",
      ],
      default: "08:00",
    },
    intervaloHoras: {
      type: Number,
      required: false, // Se calcula automáticamente
    },
    horarios: {
      type: [HorarioSchema],
      default: [],
    },
    fechaInicio: {
      type: Date,
      default: Date.now,
      required: true,
    },
    fechaFin: {
      type: Date,
      required: false,
    },
    activo: {
      type: Boolean,
      default: true,
    },
    estado: {
      type: String,
      enum: ["activo", "finalizado", "suspendido", "cancelado"],
      default: "activo",
      required: true,
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

TratamientoSchema.pre("save", function (this: ITratamiento, next) {
  // Solo calcular si es un documento nuevo o si cambió la frecuencia/horaInicio
  if (
    this.isNew ||
    this.isModified("frecuencia") ||
    this.isModified("horaInicio")
  ) {
    // Calcular intervalo entre tomas
    this.intervaloHoras = 24 / this.frecuencia;

    // Generar array de horarios
    const horarios: IHorario[] = [];
    const [horaInicial, minutoInicial] = this.horaInicio.split(":").map(Number);

    for (let i = 0; i < this.frecuencia; i++) {
      const totalMinutos =
        horaInicial * 60 + minutoInicial + i * this.intervaloHoras * 60;
      const hora = Math.floor(totalMinutos / 60) % 24;
      const minuto = Math.floor(totalMinutos % 60);

      horarios.push({
        hora: `${String(hora).padStart(2, "0")}:${String(minuto).padStart(
          2,
          "0"
        )}`,
        tomado: false,
        ultimaToma: undefined,
      });
    }

    this.horarios = horarios;
  }

  next();
});

export default mongoose.model<ITratamiento>("Tratamiento", TratamientoSchema);
