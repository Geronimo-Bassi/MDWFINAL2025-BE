import { Request, Response, NextFunction } from "express";
import { AnySchema } from "joi";

export const validate = (schema: AnySchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errorMessages = error.details.map((detail) => detail.message);
      return res.status(400).json({
        status: "error",
        message: "Error de validación",
        errors: errorMessages,
      });
    }

    next();
  };
};
