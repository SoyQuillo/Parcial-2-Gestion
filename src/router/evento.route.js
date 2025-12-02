import { Router } from "express";
import Evento from "../controller/evento.controller.js";
import { eventoActualizarCuota } from "../validator/evento.validator.js";
import { verifyToken } from "../middleware/token.middleware.js";

const router = Router();

// Todas las rutas requieren autenticación
router.use(verifyToken);

router.get("/", Evento.getEvento);
router.post("/", Evento.postEvento);
router.put("/", eventoActualizarCuota, Evento.putEvento);
router.delete("/", Evento.deleteEvento);

export default router;