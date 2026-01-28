import { Router } from 'express';
import { registerDeviceToken, removeDeviceToken } from '../controllers/deviceController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Register device token for current authenticated user
router.post('/device-tokens', authMiddleware, registerDeviceToken);

// Remove device token (optional)
router.delete('/device-tokens', authMiddleware, removeDeviceToken);

export default router;
