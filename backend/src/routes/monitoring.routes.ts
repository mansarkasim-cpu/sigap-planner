import { Router } from 'express';
import { authMiddleware, requireRole } from '../middleware/auth';
import * as ctrl from '../controllers/monitoringController';

const router = Router();

// Weekly monitoring (admin/planner)
router.get('/monitoring/daily-weekly', authMiddleware, requireRole(['planner','admin']), ctrl.weeklyChecklistStatus);
// Equipment hour meter listing and creation
router.get('/monitor/equipment-hour-meter', authMiddleware, requireRole(['planner','admin']), ctrl.listEquipmentHourMeter);
router.post('/monitor/equipment-hour-meter', authMiddleware, requireRole(['planner','admin']), ctrl.createEquipmentHourMeter);

export default router;
