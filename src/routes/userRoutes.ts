import { Router } from 'express';
import { crearUsuario, obtenerUsuarios } from '../controllers/userController';

const router = Router();

// /api/users
router.post('/', crearUsuario);
router.get('/', obtenerUsuarios);

export default router;
