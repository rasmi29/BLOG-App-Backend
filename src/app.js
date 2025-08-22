//import express
import express from "express";

//create server
const app = express();

//json & form parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//router imports
import authRouter from "./routes/auth.routes.js"

//routing
app.use("/api/v1/auth", authRouter);

//export app
export default app;