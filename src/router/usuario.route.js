import { Router } from "express";
import Usuario from "../controller/usuario.controller.js";
import { usuarioActualizarSaldo, usuarioEliminar } from "../validator/usuario.validator.js";

const router = Router();

router.get("/", Usuario.getUsuario);
router.post("/", Usuario.postUsuario);
router.put("/", usuarioActualizarSaldo, Usuario.putUsuario);
router.delete("/", usuarioEliminar, Usuario.deleteUsuario);

export default router;