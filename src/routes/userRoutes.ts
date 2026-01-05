import { Router } from "express";
import { crearUsuario, obtenerUsuarios } from "../controllers/userController";
import { validate } from "../middlewares/validate.middleware";
import { registerSchema } from "../validations/user.validation";

const router = Router();

// /api/users
router.post("/", validate(registerSchema), crearUsuario);
router.get("/", obtenerUsuarios);

export default router;
