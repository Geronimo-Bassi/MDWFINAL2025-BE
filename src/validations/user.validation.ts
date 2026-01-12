import Joi from "joi";

export const registerSchema = Joi.object({
  nombre: Joi.string().min(2).max(50).required().messages({
    "string.empty": "El nombre es obligatorio",
    "string.min": "El nombre debe tener al menos 2 caracteres",
    "any.required": "El nombre es un campo requerido",
  }),
  apellido: Joi.string().min(2).max(50).optional().allow("").messages({
    "string.min": "El apellido debe tener al menos 2 caracteres",
  }),
  email: Joi.string().email().required().messages({
    "string.empty": "El email es obligatorio",
    "string.email": "Debe ser un email válido",
    "any.required": "El email es un campo requerido",
  }),
  telefono: Joi.string()
    .pattern(/^\+[1-9]\d{1,14}$/)
    .optional()
    .allow("")
    .messages({
      "string.pattern.base":
        "El teléfono debe incluir código de país (ej: +5491112345678)",
    }),
  fechaNacimiento: Joi.date().optional().allow("").messages({
    "date.base": "Debe ser una fecha válida",
  }),
}).unknown(true); // Allow unknown fields to be stripped

export const updateSchema = Joi.object({
  nombre: Joi.string().min(2).max(50).optional().messages({
    "string.empty": "El nombre no puede estar vacío",
    "string.min": "El nombre debe tener al menos 2 caracteres",
  }),
  email: Joi.string().email().optional().messages({
    "string.empty": "El email no puede estar vacío",
    "string.email": "Debe ser un email válido",
  }),

  apellido: Joi.string().optional(),
  telefono: Joi.string()
    .pattern(/^\+[1-9]\d{1,14}$/)
    .optional()
    .messages({
      "string.pattern.base":
        "El teléfono debe incluir código de país (ej: +5491112345678)",
    }),
  fechaNacimiento: Joi.date().optional(),
}).unknown(true); // Allow any additional fields
