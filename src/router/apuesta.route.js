import { Router } from "express";
import Apuesta from "../controller/apuesta.controller.js";
import { apuestaActualizarEstado } from "../validator/apuesta.validator.js";
import { verifyToken } from "../middleware/token.middleware.js";

const router = Router();

// Todas las rutas requieren autenticación
router.use(verifyToken);

router.get("/", Apuesta.getApuesta);
router.post("/", Apuesta.postApuesta);
router.put("/", apuestaActualizarEstado, Apuesta.putApuesta);

export default router;