import { Router } from "express";
import Usuario from "../controller/usuario.controller.js";

const router = Router();

router.get("/", Usuario.getUsuario);
router.post("/", Usuario.postUsuario);
router.put("/", Usuario.putUsuario);
router.delete("/", Usuario.deleteUsuario);

export default router;