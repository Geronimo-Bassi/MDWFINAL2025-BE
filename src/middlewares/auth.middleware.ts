import { Request, Response, NextFunction } from "express";
import { auth } from "../config/firebase.config";

// Extender la interfaz Request para incluir el usuario autenticado
declare global {
  namespace Express {
    interface Request {
      user?: {
        uid: string;
        email?: string;
        name?: string;
      };
    }
  }
}

export const verifyFirebaseToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // Obtener el token del header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        success: false,
        message: "No se proporcionó un token de autenticación",
      });
      return;
    }

    // Extraer el token (remover "Bearer ")
    const token = authHeader.split("Bearer ")[1];

    if (!token) {
      res.status(401).json({
        success: false,
        message: "Token inválido",
      });
      return;
    }

    // Verificar el token con Firebase Admin SDK
    const decodedToken = await auth.verifyIdToken(token);

    // Agregar la información del usuario al request
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      name: decodedToken.name,
    };

    // Continuar con el siguiente middleware/controlador
    next();
  } catch (error: any) {
    console.error("Error al verificar token:", error.message);

    // Manejar diferentes tipos de errores
    if (error.code === "auth/id-token-expired") {
      res.status(401).json({
        success: false,
        message: "El token ha expirado",
      });
      return;
    }

    if (error.code === "auth/argument-error") {
      res.status(401).json({
        success: false,
        message: "Token inválido o malformado",
      });
      return;
    }

    res.status(401).json({
      success: false,
      message: "Error al verificar el token de autenticación",
      error: error.message,
    });
  }
};
