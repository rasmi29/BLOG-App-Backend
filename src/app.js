//import express
import express from "express";

//create server
const app = express();

//json & form parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//router imports


//routing


//export app
export default app;