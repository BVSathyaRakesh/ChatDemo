import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async (): Promise<void> => {
    try {
        const mongoUri = process.env.MONGO_URI;

        if (!mongoUri) {
            throw new Error("MONGO_URI is not defined in environment variables");
        }

        if (mongoose.connection.readyState === 1) {
            console.log("Already connected to MongoDB");
            return;
        }

        await mongoose.connect(mongoUri);
        console.log("MongoDB connected successfully");
    } catch (error) {
         console.error("MongoDB connection error:", error);
         throw error;
     }
};

export default connectDB;