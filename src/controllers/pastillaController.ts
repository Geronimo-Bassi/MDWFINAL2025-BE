import { Request, Response } from "express";
import Pastilla, { IPastilla } from "../models/Pastilla";

// ============================
// CREAR PASTILLA
// ============================

export const crearPastilla = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { nombre, descripcion } = req.body;

    // Crear nueva pastilla (Solo catálogo genérico)
    const nuevaPastilla: IPastilla = new Pastilla({
      nombre,
      descripcion,
    });

    // Guardar en la base de datos
    const pastillaGuardada = await nuevaPastilla.save();

    res.status(201).json({
      success: true,
      message: "Pastilla creada exitosamente",
      data: pastillaGuardada,
    });
  } catch (error: any) {
    // Manejo de error por duplicados (código 11000 en Mongo)
    if (error.code === 11000) {
      res.status(400).json({
        success: false,
        message: "Ya existe una pastilla con ese nombre",
        error: error.message,
      });
      return;
    }

    res.status(400).json({
      success: false,
      message: "Error al crear la pastilla",
      error: error.message,
    });
  }
};

// ============================
// OBTENER TODAS LAS PASTILLAS
// ============================

export const obtenerPastillas = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Solo traer pastillas NO borradas (deletedAt: null)
    const pastillas = await Pastilla.find({ deletedAt: null }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      message: "Pastillas obtenidas exitosamente",
      count: pastillas.length,
      data: pastillas,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error al obtener las pastillas",
      error: error.message,
    });
  }
};

// ============================
// OBTENER PASTILLA POR ID
// ============================

export const obtenerPastillaPorId = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const pastilla = await Pastilla.findOne({ _id: id, deletedAt: null });

    if (!pastilla) {
      res.status(404).json({
        success: false,
        message: "Pastilla no encontrada",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Pastilla obtenida exitosamente",
      data: pastilla,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error al obtener la pastilla",
      error: error.message,
    });
  }
};

// ============================
// ACTUALIZAR PASTILLA
// ============================

export const actualizarPastilla = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const datosActualizacion = req.body;

    const pastillaActualizada = await Pastilla.findByIdAndUpdate(
      id,
      datosActualizacion,
      { new: true, runValidators: true }
    );

    if (!pastillaActualizada) {
      res.status(404).json({
        success: false,
        message: "Pastilla no encontrada",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Pastilla actualizada exitosamente",
      data: pastillaActualizada,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: "Error al actualizar la pastilla",
      error: error.message,
    });
  }
};

// ============================
// ELIMINAR PASTILLA
// ============================

export const eliminarPastilla = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { hard } = req.query; // ?hard=true para baja física

    let pastillaEliminada;

    if (hard === "true") {
      // Baja Física: Eliminar permanentemente
      pastillaEliminada = await Pastilla.findByIdAndDelete(id);
    } else {
      // Baja Lógica: Marcar como borrado
      pastillaEliminada = await Pastilla.findByIdAndUpdate(
        id,
        { deletedAt: new Date() },
        { new: true }
      );
    }

    if (!pastillaEliminada) {
      res.status(404).json({
        success: false,
        message: "Pastilla no encontrada",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message:
        hard === "true"
          ? "Pastilla eliminada permanentemente"
          : "Pastilla eliminada lógicamente",
      data: pastillaEliminada,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error al eliminar la pastilla",
      error: error.message,
    });
  }
};
