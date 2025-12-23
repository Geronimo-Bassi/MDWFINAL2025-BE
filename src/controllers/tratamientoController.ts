import { Request, Response } from 'express';
import Tratamiento, { ITratamiento } from '../models/Tratamiento';
import User from '../models/User';
import Pastilla from '../models/Pastilla';

// ============================
// ASIGNAR TRATAMIENTO
// ============================
export const crearTratamiento = async (req: Request, res: Response): Promise<void> => {
    try {
        const { usuarioId, pastillaId, dosis, frecuencia, fechaInicio, fechaFin } = req.body;

        // 1. Validar que existan Usuario y Pastilla
        const usuario = await User.findById(usuarioId);
        if (!usuario) {
            res.status(404).json({ success: false, message: 'Usuario no encontrado' });
            return;
        }

        const pastilla = await Pastilla.findById(pastillaId);
        if (!pastilla) {
            res.status(404).json({ success: false, message: 'Pastilla no encontrada' });
            return;
        }

        // 2. Crear Tratamiento
        const nuevoTratamiento: ITratamiento = new Tratamiento({
            usuario: usuarioId,
            pastilla: pastillaId,
            dosis,
            frecuencia,
            fechaInicio: fechaInicio ? new Date(fechaInicio) : new Date(),
            fechaFin: fechaFin ? new Date(fechaFin) : undefined
        });

        const tratamientoGuardado = await nuevoTratamiento.save();

        // 3. Responder con datos populados (opcional, para ver nombres en la respuesta)
        await tratamientoGuardado.populate(['usuario', 'pastilla']);

        res.status(201).json({
            success: true,
            message: 'Tratamiento asignado exitosamente',
            data: tratamientoGuardado
        });

    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: 'Error al crear tratamiento',
            error: error.message
        });
    }
};

// ============================
// VER TRATAMIENTOS DE UN USUARIO
// ============================
export const obtenerTratamientosPorUsuario = async (req: Request, res: Response): Promise<void> => {
    try {
        const { usuarioId } = req.params;

        const tratamientos = await Tratamiento.find({ usuario: usuarioId })
            .populate('pastilla', 'nombre descripcion') // Traer datos de la pastilla
            .populate('usuario', 'nombre email');       // Traer datos del usuario

        res.status(200).json({
            success: true,
            count: tratamientos.length,
            data: tratamientos
        });

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener tratamientos',
            error: error.message
        });
    }
};
