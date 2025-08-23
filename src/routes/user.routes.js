import { Router } from "express";
import { getMyProfile } from "../controllers/user.controller.js";
import isLoggedIn from "../middlewares/isLogin.middleware.js";


const router = Router();

router.get("/profile",isLoggedIn,getMyProfile);


export default router;
