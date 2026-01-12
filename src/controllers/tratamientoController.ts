import { Request, Response } from "express";
import Tratamiento, { ITratamiento } from "../models/Tratamiento";
import User from "../models/User";
import Pastilla from "../models/Pastilla";

// ============================
// ASIGNAR TRATAMIENTO
// ============================
export const crearTratamiento = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      usuarioId,
      pastillaId,
      dosis,
      frecuencia,
      horaInicio,
      fechaInicio,
      fechaFin,
    } = req.body;

    // 1. Validar que existan Usuario y Pastilla
    const usuario = await User.findById(usuarioId);
    if (!usuario) {
      res
        .status(404)
        .json({ success: false, message: "Usuario no encontrado" });
      return;
    }

    const pastilla = await Pastilla.findById(pastillaId);
    if (!pastilla) {
      res
        .status(404)
        .json({ success: false, message: "Pastilla no encontrada" });
      return;
    }

    // 2. Crear Tratamiento
    const nuevoTratamiento: ITratamiento = new Tratamiento({
      usuario: usuarioId,
      pastilla: pastillaId,
      dosis,
      frecuencia,
      horaInicio: horaInicio || "08:00", // Default a las 08:00 si no se proporciona
      fechaInicio: fechaInicio ? new Date(fechaInicio) : new Date(),
      fechaFin: fechaFin ? new Date(fechaFin) : undefined,
    });

    // El middleware pre-save calculará automáticamente intervaloHoras y horarios
    const tratamientoGuardado = await nuevoTratamiento.save();

    // 3. Responder con datos populados (opcional, para ver nombres en la respuesta)
    await tratamientoGuardado.populate(["usuario", "pastilla"]);

    res.status(201).json({
      success: true,
      message: "Tratamiento asignado exitosamente",
      data: tratamientoGuardado,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: "Error al crear tratamiento",
      error: error.message,
    });
  }
};

// ============================
// VER TRATAMIENTOS DE UN USUARIO
// ============================
export const obtenerTratamientosPorUsuario = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { usuarioId } = req.params;

    // Solo traer tratamientos NO borrados
    const tratamientos = await Tratamiento.find({
      usuario: usuarioId,
      deletedAt: null,
    })
      .populate("pastilla", "nombre descripcion") // Traer datos de la pastilla
      .populate("usuario", "nombre email"); // Traer datos del usuario

    res.status(200).json({
      success: true,
      count: tratamientos.length,
      data: tratamientos,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error al obtener tratamientos",
      error: error.message,
    });
  }
};

// ============================
// OBTENER TODOS LOS TRATAMIENTOS
// ============================
export const obtenerTratamientos = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Solo traer tratamientos activos y no borrados
    const tratamientos = await Tratamiento.find({
      estado: { $in: ["activo", "suspendido"] },
      deletedAt: null,
    })
      .populate("pastilla", "nombre descripcion")
      .populate("usuario", "nombre email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tratamientos.length,
      data: tratamientos,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error al obtener tratamientos",
      error: error.message,
    });
  }
};

// ============================
// OBTENER TRATAMIENTO POR ID
// ============================
export const obtenerTratamientoPorId = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const tratamiento = await Tratamiento.findOne({ _id: id, deletedAt: null })
      .populate("pastilla", "nombre descripcion")
      .populate("usuario", "nombre email");

    if (!tratamiento) {
      res.status(404).json({
        success: false,
        message: "Tratamiento no encontrado",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: tratamiento,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error al obtener el tratamiento",
      error: error.message,
    });
  }
};

// ============================
// ELIMINAR TRATAMIENTO (Baja Lógica/Física)
// ============================
export const eliminarTratamiento = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { hard } = req.query; // ?hard=true para baja física

    let tratamientoEliminado;

    if (hard === "true") {
      // Baja Física: Eliminar permanentemente
      tratamientoEliminado = await Tratamiento.findByIdAndDelete(id);
    } else {
      // Baja Lógica: Marcar como borrado
      tratamientoEliminado = await Tratamiento.findByIdAndUpdate(
        id,
        { deletedAt: new Date() },
        { new: true }
      );
    }

    if (!tratamientoEliminado) {
      res.status(404).json({
        success: false,
        message: "Tratamiento no encontrado",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message:
        hard === "true"
          ? "Tratamiento eliminado permanentemente"
          : "Tratamiento eliminado lógicamente",
      data: tratamientoEliminado,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error al eliminar el tratamiento",
      error: error.message,
    });
  }
};

// ============================
// CAMBIAR ESTADO DEL TRATAMIENTO
// ============================
export const cambiarEstadoTratamiento = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    // Validar que el estado sea válido
    const estadosValidos = ["activo", "finalizado", "suspendido", "cancelado"];
    if (!estadosValidos.includes(estado)) {
      res.status(400).json({
        success: false,
        message: `Estado inválido. Debe ser uno de: ${estadosValidos.join(
          ", "
        )}`,
      });
      return;
    }

    const tratamientoActualizado = await Tratamiento.findByIdAndUpdate(
      id,
      { estado },
      { new: true, runValidators: true }
    )
      .populate("pastilla", "nombre descripcion")
      .populate("usuario", "nombre email");

    if (!tratamientoActualizado) {
      res.status(404).json({
        success: false,
        message: "Tratamiento no encontrado",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: `Estado cambiado a: ${estado}`,
      data: tratamientoActualizado,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error al cambiar el estado del tratamiento",
      error: error.message,
    });
  }
};

// ============================
// Actualizar tratamiento
// ============================

export const actualizarTratamiento = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { dosis, frecuencia, horaInicio, fechaInicio, fechaFin } = req.body;
    const tratamiento = await Tratamiento.findById(id);
    if (!tratamiento) {
      res
        .status(404)
        .json({ success: false, message: "Tratamiento no encontrado" });
      return;
    }
    // Actualizamos los campos
    if (dosis) tratamiento.dosis = dosis;
    if (frecuencia) tratamiento.frecuencia = frecuencia;
    if (horaInicio) tratamiento.horaInicio = horaInicio;
    if (fechaInicio) tratamiento.fechaInicio = new Date(fechaInicio);
    if (fechaFin !== undefined)
      tratamiento.fechaFin = fechaFin ? new Date(fechaFin) : undefined;
    // Al usar tratamiento.save(), se activará tu middleware pre-save
    // que recalcula automáticamente los horarios e intervalos.
    const actualizado = await tratamiento.save();
    res.status(200).json({
      success: true,
      message: "Tratamiento actualizado correctamente",
      data: actualizado,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error al actualizar el tratamiento",
      error: error.message,
    });
  }
};

// ============================
// MARCAR DOSIS COMO TOMADA
// ============================
export const marcarDosisComoPendiente = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params; // ID del tratamiento
    const { hora } = req.body; // Hora de la dosis (ej: "08:00")

    if (!hora) {
      res.status(400).json({
        success: false,
        message: "La hora de la dosis es requerida",
      });
      return;
    }

    // Buscar el tratamiento
    const tratamiento = await Tratamiento.findOne({ _id: id, deletedAt: null });

    if (!tratamiento) {
      res.status(404).json({
        success: false,
        message: "Tratamiento no encontrado",
      });
      return;
    }

    // Buscar el horario específico
    const horarioIndex = tratamiento.horarios.findIndex((h) => h.hora === hora);

    if (horarioIndex === -1) {
      res.status(404).json({
        success: false,
        message: `No se encontró una dosis programada para las ${hora}`,
      });
      return;
    }

    // Marcar como tomado
    tratamiento.horarios[horarioIndex].tomado = true;
    tratamiento.horarios[horarioIndex].ultimaToma = new Date();

    await tratamiento.save();

    res.status(200).json({
      success: true,
      message: `Dosis de las ${hora} marcada como tomada`,
      data: tratamiento,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error al marcar la dosis como tomada",
      error: error.message,
    });
  }
};

// ============================
// RESETEAR DOSIS DIARIAS (Para cron job)
// ============================
export const resetearDosisDelDia = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Obtener todos los tratamientos activos
    const tratamientos = await Tratamiento.find({
      estado: "activo",
      deletedAt: null,
    });

    let tratamientosActualizados = 0;

    for (const tratamiento of tratamientos) {
      // Resetear todos los horarios
      tratamiento.horarios.forEach((h) => {
        h.tomado = false;
      });

      await tratamiento.save();
      tratamientosActualizados++;
    }

    res.status(200).json({
      success: true,
      message: `Se resetearon ${tratamientosActualizados} tratamientos para el nuevo día`,
      count: tratamientosActualizados,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error al resetear las dosis del día",
      error: error.message,
    });
  }
};
