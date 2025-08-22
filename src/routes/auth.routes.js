import { Router } from "express";
import { registerUser, verifyEmail, loginUser, logoutUser } from "../controllers/auth.controllers.js";
import validate from "../middlewares/validator.middleware.js";
import { userRegistrationValidator,userLoginValidator } from "../validators/validator.js";
import isLoggedIn from "../middlewares/isLogin.middleware.js";


const router = Router();

router.post("/register",userRegistrationValidator(),validate, registerUser);
router.get("/verify", verifyEmail);
router.post("/login",userLoginValidator(),validate, loginUser);
router.get("/logout",isLoggedIn, logoutUser);

export default router;
