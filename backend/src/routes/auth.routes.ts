import { Router } from "express";
import { registerHandler, loginHandler, meHandler } from "../controllers/authController";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.post("/auth/register", registerHandler);
router.post("/auth/login", loginHandler);
router.get("/auth/me", authMiddleware, meHandler);

export default router;