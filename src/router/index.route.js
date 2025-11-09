import { Router } from "express";
import TournametRoute from "./tournament.route.js";
import ApuestaRoute from "./apuesta.route.js";
import UsuarioRoute from "./usuario.route.js";
import EventoRoute from "./evento.route.js";
import AuthRoute from "./auth.route.js"
const router = Router();

router.use(TournametRoute);
router.use('/apuesta', ApuestaRoute);
router.use('/usuario' ,UsuarioRoute);
router.use('/evento' ,EventoRoute);
router.use('/auth' , AuthRoute);

export default router;