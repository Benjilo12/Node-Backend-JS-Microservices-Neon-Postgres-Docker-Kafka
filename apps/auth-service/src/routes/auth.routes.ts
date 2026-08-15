import { Router } from "express";
import { validateBody } from "shared";
import { loginSchema, registerSchema } from "../schemas/auth.schemas.js";
import * as authController from "../controllers/auth.controller.js";

const router = Router();

//* Route for user registration */
router.post("/register", validateBody(registerSchema), authController.register);

//* Route for user login */
router.post("/login", validateBody(loginSchema), authController.login);

//* Route to get the authenticated user's information */
router.get("/me", authController.getMe);

export default router;
