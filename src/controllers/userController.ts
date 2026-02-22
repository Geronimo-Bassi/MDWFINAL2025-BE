import { Request, Response } from "express";
import User, { IUser } from "../models/User";

// ============================
// CREAR USUARIO
// ============================
export const crearUsuario = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { firebaseUid, nombre, apellido, email, telefono, fechaNacimiento } =
      req.body;
    // Verificar si ya existe
    const existeUsuario = await User.findOne({ email });
    if (existeUsuario) {
      res.status(400).json({
        success: false,
        message: "El email ya está registrado",
      });
      return;
    }
    const nuevoUsuario: IUser = new User({
      firebaseUid,
      nombre,
      apellido,
      email,
      telefono,
      fechaNacimiento: fechaNacimiento ? new Date(fechaNacimiento) : undefined,
    });
    const usuarioGuardado = await nuevoUsuario.save();
    res.status(201).json({
      success: true,
      message: "Usuario creado exitosamente",
      data: usuarioGuardado,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error al crear usuario",
      error: error.message,
    });
  }
};
// ============================
// OBTENER USUARIOS
// ============================
export const obtenerUsuarios = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const usuarios = await User.find();

    res.status(200).json({
      success: true,
      count: usuarios.length,
      data: usuarios,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error al obtener usuarios",
      error: error.message,
    });
  }
};

// ============================
// OBTENER USUARIO POR ID (MongoDB ObjectId)
// ============================
export const obtenerUsuarioPorId = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    const usuario = await User.findById(id);

    if (!usuario) {
      res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: usuario,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error al obtener usuario",
      error: error.message,
    });
  }
};

// ============================
// OBTENER USUARIO POR FIREBASE UID
// ============================
export const obtenerUsuarioPorFirebaseUid = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { firebaseUid } = req.params;

    const usuario = await User.findOne({ firebaseUid });

    if (!usuario) {
      res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: usuario,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error al obtener usuario por Firebase UID",
      error: error.message,
    });
  }
};


export const actualizarFirebaseUid = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { email, firebaseUid } = req.body;

    if (!email || !firebaseUid) {
      res.status(400).json({
        success: false,
        message: "Email y firebaseUid son requeridos",
      });
      return;
    }

    const usuario = await User.findOneAndUpdate(
      { email },
      { firebaseUid },
      { new: true, runValidators: true },
    );

    if (!usuario) {
      res.status(404).json({
        success: false,
        message: "Usuario no encontrado con ese email",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Firebase UID actualizado exitosamente",
      data: usuario,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error al actualizar Firebase UID",
      error: error.message,
    });
  }
};
