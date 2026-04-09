import { Router } from 'express';
import { authMiddleware, requireRole } from '../middleware/auth';
import * as ctrl from '../controllers/monitoringController';

const router = Router();

// Weekly monitoring (admin/planner)
router.get('/monitoring/daily-weekly', authMiddleware, requireRole(['planner','admin']), ctrl.weeklyChecklistStatus);
// Equipment hour meter listing and creation
// Allow technicians to list/create their equipment hour meter entries as well
router.get('/monitor/equipment-hour-meter', authMiddleware, requireRole(['planner','admin','technician']), ctrl.listEquipmentHourMeter);
router.post('/monitor/equipment-hour-meter', authMiddleware, requireRole(['planner','admin','technician']), ctrl.createEquipmentHourMeter);

export default router;
