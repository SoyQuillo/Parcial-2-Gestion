import { Router } from "express";
import Apuesta from "../controller/apuesta.controller.js";

const router = Router();

router.get("/", Apuesta.getApuesta);
router.post("/", Apuesta.postApuesta);
router.put("/", Apuesta.putApuesta);

export default router;