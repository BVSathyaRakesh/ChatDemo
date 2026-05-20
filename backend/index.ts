import express from "express";
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from "./config/db.js";
import authRoutes from './routes/auth.routes.js'
import { initializeSocket } from "./socket/socket.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors({
    origin: ["chat-demo-ten-azure.vercel.app"],
    methods: ["POST", "GET"],
    credentials: true
  }));
  
app.use("/api/auth", authRoutes)



app.get("/",(req,res) => {
    res.send("Server is running");
})

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

//listen to socket events
initializeSocket(server);

connectDB().then(()=>{
    console.log("Database Connected");
    server.listen(PORT, () => {
        console.log("Server is running on port", PORT);
    })
}).catch((error) =>{
    console.log("Failed to start the server due to database connection error", error);
})


