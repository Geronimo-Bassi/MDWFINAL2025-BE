import Joi from "joi";

export const pillSchema = Joi.object({
  nombre: Joi.string().min(2).max(100).required().messages({
    "string.empty": "El nombre de la pastilla es obligatorio",
    "string.min": "El nombre debe tener al menos 2 caracteres",
    "any.required": "El nombre es un campo requerido",
  }),
  descripcion: Joi.string().max(500).allow("", null).optional().messages({
    "string.max": "La descripción no puede exceder los 500 caracteres",
  }),
});
