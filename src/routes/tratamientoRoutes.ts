import { Router } from "express";
import {
  crearTratamiento,
  obtenerTratamientosPorUsuario,
  obtenerTratamientos,
  obtenerTratamientoPorId,
  eliminarTratamiento,
  cambiarEstadoTratamiento,
} from "../controllers/tratamientoController";

const router = Router();

// /api/tratamientos
router.post("/", crearTratamiento);
router.get("/", obtenerTratamientos);
router.get("/usuario/:usuarioId", obtenerTratamientosPorUsuario);
router.get("/:id", obtenerTratamientoPorId);
router.patch("/:id/estado", cambiarEstadoTratamiento);
router.delete("/:id", eliminarTratamiento);

export default router;
