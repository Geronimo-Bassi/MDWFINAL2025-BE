import Joi from "joi";

// Schema para crear un tratamiento
export const crearTratamientoSchema = Joi.object({
  nombre: Joi.string().min(3).max(100).required().messages({
    "string.empty": "El nombre del tratamiento es obligatorio",
    "string.min": "El nombre debe tener al menos 3 caracteres",
    "string.max": "El nombre no puede exceder 100 caracteres",
    "any.required": "El nombre es un campo requerido",
  }),
  usuarioId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.empty": "El ID del usuario es obligatorio",
      "string.pattern.base": "El ID del usuario debe ser un ObjectId válido",
      "any.required": "El usuario es un campo requerido",
    }),
  pastillaId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.empty": "El ID de la pastilla es obligatorio",
      "string.pattern.base": "El ID de la pastilla debe ser un ObjectId válido",
      "any.required": "La pastilla es un campo requerido",
    }),
  dosis: Joi.string().min(1).max(50).required().messages({
    "string.empty": "La dosis es obligatoria",
    "string.min": "La dosis debe tener al menos 1 carácter",
    "any.required": "La dosis es un campo requerido",
  }),
  frecuencia: Joi.number().integer().min(1).max(24).required().messages({
    "number.base": "La frecuencia debe ser un número",
    "number.min": "La frecuencia debe ser al menos 1 vez al día",
    "number.max": "La frecuencia no puede ser mayor a 24 veces al día",
    "any.required": "La frecuencia es un campo requerido",
  }),
  horaInicio: Joi.string()
    .pattern(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/)
    .required()
    .messages({
      "string.empty": "La hora de inicio es obligatoria",
      "string.pattern.base":
        "Formato de hora inválido (debe ser HH:mm, ej: 08:00)",
      "any.required": "La hora de inicio es un campo requerido",
    }),
  fechaInicio: Joi.date().optional().messages({
    "date.base": "La fecha de inicio debe ser una fecha válida",
  }),
  fechaFin: Joi.date().optional().messages({
    "date.base": "La fecha de fin debe ser una fecha válida",
  }),
  estado: Joi.string()
    .valid("activo", "finalizado", "suspendido", "cancelado")
    .optional()
    .messages({
      "any.only":
        "El estado debe ser: activo, finalizado, suspendido o cancelado",
    }),
});

// Schema para actualizar un tratamiento
export const actualizarTratamientoSchema = Joi.object({
  nombre: Joi.string().min(3).max(100).optional().messages({
    "string.empty": "El nombre del tratamiento no puede estar vacío",
    "string.min": "El nombre debe tener al menos 3 caracteres",
    "string.max": "El nombre no puede exceder 100 caracteres",
  }),
  dosis: Joi.string().min(1).max(50).optional().messages({
    "string.empty": "La dosis no puede estar vacía",
    "string.min": "La dosis debe tener al menos 1 carácter",
  }),
  frecuencia: Joi.number().integer().min(1).max(24).optional().messages({
    "number.base": "La frecuencia debe ser un número",
    "number.min": "La frecuencia debe ser al menos 1 vez al día",
    "number.max": "La frecuencia no puede ser mayor a 24 veces al día",
  }),
  horaInicio: Joi.string()
    .pattern(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/)
    .optional()
    .messages({
      "string.pattern.base":
        "Formato de hora inválido (debe ser HH:mm, ej: 08:00)",
    }),
  fechaFin: Joi.date().optional().messages({
    "date.base": "La fecha de fin debe ser una fecha válida",
  }),
  estado: Joi.string()
    .valid("activo", "finalizado", "suspendido", "cancelado")
    .optional()
    .messages({
      "any.only":
        "El estado debe ser: activo, finalizado, suspendido o cancelado",
    }),
});
