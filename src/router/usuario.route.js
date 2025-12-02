import { Router } from "express";
import Usuario from "../controller/usuario.controller.js";
import { usuarioActualizarSaldo, usuarioEliminar } from "../validator/usuario.validator.js";
import { verifyToken } from "../middleware/token.middleware.js";

const router = Router();

// Todas las rutas requieren autenticación
router.use(verifyToken);

router.get("/", Usuario.getUsuario);
router.post("/", Usuario.postUsuario);
router.put("/", usuarioActualizarSaldo, Usuario.putUsuario);
router.delete("/", usuarioEliminar, Usuario.deleteUsuario);

export default router;