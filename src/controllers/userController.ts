import { Request, Response } from "express";
import User, { IUser } from "../models/User";

// ============================
// CREAR USUARIO
// ============================
export const crearUsuario = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { nombre, apellido, email, telefono, fechaNacimiento } = req.body;
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
  res: Response
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
