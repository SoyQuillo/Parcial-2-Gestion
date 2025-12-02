import { Router } from "express";
import UsuarioRoute from "./usuario.route.js";
import AuthRoute from "./auth.route.js"
const router = Router();

router.use('/usuario' ,UsuarioRoute);
router.use('/auth' , AuthRoute);

export default router;