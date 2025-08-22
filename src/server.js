//import modules
import app from "./app.js";
import dotenv from "dotenv";
import connectDB from "./config/database.js";

dotenv.config({
    path: "./.env",
});

const PORT = process.env.PORT || 8000;

//global error handler middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    return res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error",
        errors: err.errors || []
    });
});


//connect database and run server
connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`💻 server is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Mongodb connection error", error);
        process.exit(1);
    });