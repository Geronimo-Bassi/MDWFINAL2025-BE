import { Router } from "express";
import {
  crearUsuario,
  obtenerUsuarios,
  obtenerUsuarioPorId,
  obtenerUsuarioPorFirebaseUid,
  actualizarFirebaseUid,
} from "../controllers/userController";
import { validate } from "../middlewares/validate.middleware";
import { registerSchema } from "../validations/user.validation";

const router = Router();

// /api/users
router.post("/", validate(registerSchema), crearUsuario);
router.get("/", obtenerUsuarios);
router.get("/firebase/:firebaseUid", obtenerUsuarioPorFirebaseUid); // Debe ir ANTES de /:id
router.get("/:id", obtenerUsuarioPorId);
router.patch("/firebase-uid", actualizarFirebaseUid); // Actualizar Firebase UID

export default router;
