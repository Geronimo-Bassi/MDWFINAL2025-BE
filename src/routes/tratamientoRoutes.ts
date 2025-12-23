import { Router } from 'express';
import { crearTratamiento, obtenerTratamientosPorUsuario } from '../controllers/tratamientoController';

const router = Router();

// /api/tratamientos
router.post('/', crearTratamiento);
router.get('/usuario/:usuarioId', obtenerTratamientosPorUsuario);

export default router;
