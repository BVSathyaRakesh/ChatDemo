import express from "express";
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from "../config/db.js";
import authRoutes from '../routes/auth.routes.js'

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors({
    origin: ["https://chat-demo-git-main-bvrakesh540s-projects.vercel.app", "http://localhost:3000"],
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true
}));

// Connect to database on cold start
let dbConnected = false;
const initDB = async () => {
    if (!dbConnected) {
        try {
            await connectDB();
            dbConnected = true;
            console.log("Database Connected");
        } catch (error) {
            console.error("Database connection error:", error);
        }
    }
};

// Middleware to ensure DB is connected before handling requests
app.use(async (req, res, next) => {
    await initDB();
    next();
});

app.use("/api/auth", authRoutes)

app.get("/",(req,res) => {
    res.send("Server is running");
})

app.get("/api",(req,res) => {
    res.json({ message: "API is running", status: "ok" });
});

// Export for Vercel serverless
export default app;
