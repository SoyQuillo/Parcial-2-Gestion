import { Router } from "express";
import Apuesta from "../controller/apuesta.controller.js";
import { apuestaActualizarEstado } from "../validator/apuesta.validator.js";

const router = Router();

router.get("/", Apuesta.getApuesta);
router.post("/", Apuesta.postApuesta);
router.put("/", apuestaActualizarEstado, Apuesta.putApuesta);

export default router;