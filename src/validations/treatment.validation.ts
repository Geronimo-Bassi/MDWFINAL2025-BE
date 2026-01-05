import Joi from "joi";
export const registerSchema = Joi.object({
  nombre: Joi.string().min(2).max(50).required().messages({
    "string.empty": "El nombre es obligatorio",
    "string.min": "El nombre debe tener al menos 2 caracteres",
    "any.required": "El nombre es un campo requerido",
  }),
  apellido: Joi.string().min(2).max(50).optional().allow("", null).messages({
    "string.min": "El apellido debe tener al menos 2 caracteres",
  }),
  email: Joi.string().email().required().messages({
    "string.empty": "El email es obligatorio",
    "string.email": "Debe ser un email válido",
    "any.required": "El email es un campo requerido",
  }),
  password: Joi.string().min(6).optional().allow("", null).messages({
    "string.min": "La contraseña debe tener al menos 6 caracteres",
  }),
  fechaNacimiento: Joi.string().optional().allow("", null).messages({
    "string.base": "Debe ser una fecha válida",
  }),
});
