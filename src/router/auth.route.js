import { Router } from "express";
import {login} from "../controller/auth.controller.js";

const route = Router();

route.post("/login", login);

export default route;