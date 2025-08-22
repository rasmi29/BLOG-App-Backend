import { Router } from "express";
import { registerUser, verifyEmail, loginUser } from "../controllers/auth.controllers.js";
import validate from "../middlewares/validator.middleware.js";
import { userRegistrationValidator } from "../validators/validator.js";


const router = Router();

router.post("/register",userRegistrationValidator(),validate, registerUser);
router.get("/verify", verifyEmail);
router.get("/login", loginUser);

export default router;
