import { Router } from "express";
import { changePassword, deactivateAccount, getMyProfile, getUserByUsername } from "../controllers/user.controller.js";
import isLoggedIn from "../middlewares/isLogin.middleware.js";
import { newPasswordValidator } from "../validators/validator.js";
import validate from "../middlewares/validator.middleware.js";


const router = Router();

router.get("/profile",isLoggedIn,getMyProfile);
router.get("/username/:username",getUserByUsername);
router.patch("/changePassword",isLoggedIn,newPasswordValidator(),validate,changePassword);
router.patch("/deactivate",isLoggedIn,deactivateAccount)


export default router;
