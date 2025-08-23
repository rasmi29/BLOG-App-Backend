//import express
import express from "express";

//create server
const app = express();

//json & form parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//router imports
import authRouter from "./routes/auth.routes.js"
import userRouter from "./routes/user.routes.js"
import blogRouter from "./routes/blog.routes.js"

//routing
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/blog", blogRouter);

//export app
export default app; 