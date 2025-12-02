import { Router } from "express";
import Index from "../controller/index.controller.js";
import { verifyToken } from "../middleware/token.middleware.js";

const route = Router();

// Todas las rutas requieren autenticación
route.use("/tournament", verifyToken, Index )

export default route;