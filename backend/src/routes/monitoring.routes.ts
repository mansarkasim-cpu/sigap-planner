import { Router } from 'express';
import { authMiddleware, requireRole } from '../middleware/auth';
import * as ctrl from '../controllers/monitoringController';

const router = Router();

// Weekly monitoring (admin/planner)
router.get('/monitoring/daily-weekly', authMiddleware, requireRole(['planner','admin']), ctrl.weeklyChecklistStatus);

export default router;
