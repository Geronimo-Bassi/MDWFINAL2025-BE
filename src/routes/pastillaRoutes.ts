import { Router } from "express";
import {
  crearPastilla,
  obtenerPastillas,
  obtenerPastillaPorId,
  actualizarPastilla,
  eliminarPastilla,
} from "../controllers/pastillaController";
import { validate } from "../middlewares/validate.middleware";
import { pillSchema } from "../validations/pill.validation";

const router = Router();

// GET /api/pastillas - Obtener todas las pastillas
router.get("/", obtenerPastillas);

// POST /api/pastillas - Crear nueva pastilla
router.post("/", validate(pillSchema), crearPastilla);

// GET /api/pastillas/:id - Obtener pastilla por ID
router.get("/:id", obtenerPastillaPorId);

// PUT /api/pastillas/:id - Actualizar pastilla
router.put("/:id", validate(pillSchema), actualizarPastilla);

// DELETE /api/pastillas/:id - Eliminar pastilla
router.delete("/:id", eliminarPastilla);

export default router;
