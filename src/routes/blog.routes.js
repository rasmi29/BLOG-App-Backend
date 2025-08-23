import { Router } from "express";
import isLoggedIn from "../middlewares/isLogin.middleware.js";
import { createBlog } from "../controllers/blog.controller.js";


const router = Router();

router.post("/create",isLoggedIn,createBlog)


export default router;