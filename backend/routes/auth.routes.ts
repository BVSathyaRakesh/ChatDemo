import { Router } from "express";
import { registerUser, loginUser, getCurrentUser } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

// POST /api/auth/register - Register new user
router.post("/register", registerUser);

// POST /api/auth/login - Login user
router.post("/login", loginUser);

// GET /api/auth/me - Get current user (protected)
router.get("/me", authMiddleware, getCurrentUser);

export default router;