import { Router } from "express";
import { registerUser, loginUser } from "../controllers/auth.controller.js";

const router = Router();

// POST /api/auth/register - Register new user
router.post("/register", registerUser);

// POST /api/auth/login - Login user
router.post("/login", loginUser);

export default router;