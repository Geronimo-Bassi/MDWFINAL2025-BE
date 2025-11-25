import { Router } from 'express';
import {
  crearPastilla,
  obtenerPastillas,
  obtenerPastillaPorId,
  actualizarPastilla,
  eliminarPastilla
} from '../controllers/pastillaController';

// ============================
// CREAR ROUTER
// ============================

const router = Router();

// ============================
// DEFINIR RUTAS
// ============================

// GET /api/pastillas - Obtener todas las pastillas
router.get('/', obtenerPastillas);

// POST /api/pastillas - Crear nueva pastilla
router.post('/', crearPastilla);

// GET /api/pastillas/:id - Obtener pastilla por ID
router.get('/:id', obtenerPastillaPorId);

// PUT /api/pastillas/:id - Actualizar pastilla
router.put('/:id', actualizarPastilla);

// DELETE /api/pastillas/:id - Eliminar pastilla
router.delete('/:id', eliminarPastilla);

// ============================
// EXPORTAR ROUTER
// ============================

export default router;