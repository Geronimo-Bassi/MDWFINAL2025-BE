import { Request, Response } from 'express';
import Pastilla, { IPastilla } from '../models/Pastilla';

// ============================
// CREAR PASTILLA
// ============================

export const crearPastilla = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nombre, descripcion, dosis, frecuencia, fechaInicio, fechaFin } = req.body;

    // Crear nueva pastilla
    const nuevaPastilla: IPastilla = new Pastilla({
      nombre,
      descripcion,
      dosis,
      frecuencia,
      fechaInicio: fechaInicio ? new Date(fechaInicio) : new Date(),
      fechaFin: fechaFin ? new Date(fechaFin) : undefined,
      activo: true
    });

    // Guardar en la base de datos
    const pastillaGuardada = await nuevaPastilla.save();

    res.status(201).json({
      success: true,
      message: 'Pastilla creada exitosamente',
      data: pastillaGuardada
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: 'Error al crear la pastilla',
      error: error.message
    });
  }
};

// ============================
// OBTENER TODAS LAS PASTILLAS
// ============================

export const obtenerPastillas = async (req: Request, res: Response): Promise<void> => {
  try {
    const pastillas = await Pastilla.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Pastillas obtenidas exitosamente',
      count: pastillas.length,
      data: pastillas
    });

  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener las pastillas',
      error: error.message
    });
  }
};

// ============================
// OBTENER PASTILLA POR ID
// ============================

export const obtenerPastillaPorId = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const pastilla = await Pastilla.findById(id);

    if (!pastilla) {
      res.status(404).json({
        success: false,
        message: 'Pastilla no encontrada'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Pastilla obtenida exitosamente',
      data: pastilla
    });

  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener la pastilla',
      error: error.message
    });
  }
};

// ============================
// ACTUALIZAR PASTILLA
// ============================

export const actualizarPastilla = async (req: Request, res: Response): Promise<void> => {
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
        message: 'Pastilla no encontrada'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Pastilla actualizada exitosamente',
      data: pastillaActualizada
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: 'Error al actualizar la pastilla',
      error: error.message
    });
  }
};

// ============================
// ELIMINAR PASTILLA
// ============================

export const eliminarPastilla = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const pastillaEliminada = await Pastilla.findByIdAndDelete(id);

    if (!pastillaEliminada) {
      res.status(404).json({
        success: false,
        message: 'Pastilla no encontrada'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Pastilla eliminada exitosamente',
      data: pastillaEliminada
    });

  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar la pastilla',
      error: error.message
    });
  }
};