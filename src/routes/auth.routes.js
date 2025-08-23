import { Router } from "express";
import {
    registerUser,
    verifyEmail,
    loginUser,
    logoutUser,
    resendVerificationEmail,
    forgotPassword,
    resetPassword,
} from "../controllers/auth.controller.js";
import validate from "../middlewares/validator.middleware.js";
import {
    userRegistrationValidator,
    userLoginValidator,
    emailValidator
} from "../validators/validator.js";
import isLoggedIn from "../middlewares/isLogin.middleware.js";

const router = Router();

router.post("/register", userRegistrationValidator(), validate, registerUser);
router.get("/verify", verifyEmail);
router.post("/login", userLoginValidator(), validate, loginUser);
router.get("/logout", isLoggedIn, logoutUser);
router.get("/resendVerificationMail",emailValidator(),validate, resendVerificationEmail);
router.post("/forgotPassword",emailValidator(),validate,forgotPassword);
router.post("/resetPassword",resetPassword);

export default router;
