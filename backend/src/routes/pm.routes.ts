import { Router } from 'express';
import { authMiddleware, requireRole } from '../middleware/auth';
import * as ctrl from '../controllers/pmController';
import * as rulesCtrl from '../controllers/pmRulesController';
import * as historyCtrl from '../controllers/pmHistoryController';

const router = Router();

// GET /api/pm/calendar?limit=
router.get('/pm/calendar', authMiddleware, requireRole(['planner','admin']), ctrl.getPMCalendar);

// POST /api/pm/run -> trigger worker manually
router.post('/pm/run', authMiddleware, requireRole(['planner','admin']), ctrl.runPmNow);

// Assign/unassign workorder to equipment_status for PM schedule
router.post('/pm/equipment-status/:alat_id/assign-workorder', authMiddleware, requireRole(['planner','admin']), ctrl.assignWorkOrder);
router.post('/pm/equipment-status/:alat_id/unassign-workorder', authMiddleware, requireRole(['planner','admin']), ctrl.unassignWorkOrder);
router.get('/pm/equipment-status/:alat_id/workorders', authMiddleware, requireRole(['planner','admin']), ctrl.getWorkOrdersForAlat);

// PM rules CRUD
router.get('/pm/rules', authMiddleware, requireRole(['planner','admin']), rulesCtrl.listPmRules);
router.post('/pm/rules', authMiddleware, requireRole(['planner','admin']), rulesCtrl.createPmRule);
router.get('/pm/rules/:id', authMiddleware, requireRole(['planner','admin']), rulesCtrl.getPmRule);
router.patch('/pm/rules/:id', authMiddleware, requireRole(['planner','admin']), rulesCtrl.updatePmRule);
router.delete('/pm/rules/:id', authMiddleware, requireRole(['planner','admin']), rulesCtrl.deletePmRule);

// PM history: list (planner/admin) and create (technician/planner/admin)
router.get('/pm/history', authMiddleware, requireRole(['planner','admin']), historyCtrl.listPmHistory);
router.post('/pm/history', authMiddleware, requireRole(['technician','planner','admin']), historyCtrl.createPmHistory);

export default router;
