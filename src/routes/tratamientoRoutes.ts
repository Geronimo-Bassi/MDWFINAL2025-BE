import { Router } from "express";
import {
  crearTratamiento,
  obtenerTratamientosPorUsuario,
  obtenerTratamientos,
  obtenerTratamientoPorId,
  eliminarTratamiento,
  cambiarEstadoTratamiento,
  marcarDosisComoPendiente,
  resetearDosisDelDia,
  actualizarTratamiento,
} from "../controllers/tratamientoController";

const router = Router();

// /api/tratamientos
router.post("/", crearTratamiento);
router.get("/", obtenerTratamientos);
router.get("/usuario/:usuarioId", obtenerTratamientosPorUsuario);
router.put("/:id", actualizarTratamiento);
router.get("/:id", obtenerTratamientoPorId);
router.patch("/:id/estado", cambiarEstadoTratamiento);
router.patch("/:id/marcar-dosis", marcarDosisComoPendiente);
router.post("/resetear-dosis", resetearDosisDelDia);
router.delete("/:id", eliminarTratamiento);

export default router;
