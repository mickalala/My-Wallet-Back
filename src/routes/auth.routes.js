import { Router } from "express";
import { cadastro,login } from "../controllers/auth.controllers.js";

const authRouter = Router();
authRouter.post("/cadastro", cadastro)
authRouter.post("/", login)

export default authRouter
