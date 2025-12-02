import { Router } from "express";
import { login, verifyOTP } from "../controller/auth.controller.js";

const route = Router();

route.post("/login", login);
route.post("/verify-otp", verifyOTP);

export default route;