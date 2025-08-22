//import mongoose
import mongoose from "mongoose";

//create a function for connecting to database
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("✅ Mongodb connected");
    } catch (error) {
        console.error("mongo db connection error", error);
        process.exit(1);
    }
};

//export function
export default connectDB;