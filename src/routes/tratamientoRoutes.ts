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
import { validate } from "../middlewares/validate.middleware";
import {
  crearTratamientoSchema,
  actualizarTratamientoSchema,
} from "../validations/tratamiento.validation";

const router = Router();

// /api/tratamientos
router.post("/", validate(crearTratamientoSchema), crearTratamiento);
router.get("/", obtenerTratamientos);
router.get("/usuario/:usuarioId", obtenerTratamientosPorUsuario);
router.put(
  "/:id",
  validate(actualizarTratamientoSchema),
  actualizarTratamiento,
);
router.get("/:id", obtenerTratamientoPorId);
router.patch("/:id/estado", cambiarEstadoTratamiento);
router.patch("/:id/marcar-dosis", marcarDosisComoPendiente);
router.post("/resetear-dosis", resetearDosisDelDia);
router.delete("/:id", eliminarTratamiento);

export default router;
