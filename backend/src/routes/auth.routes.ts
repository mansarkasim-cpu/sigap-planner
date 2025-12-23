import { Router } from "express";
import { registerHandler, loginHandler, meHandler, changePasswordHandler } from "../controllers/authController";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.post("/auth/register", registerHandler);
router.post("/auth/login", loginHandler);
router.get("/auth/me", authMiddleware, meHandler);
router.patch('/auth/me/password', authMiddleware, changePasswordHandler);

export default router;