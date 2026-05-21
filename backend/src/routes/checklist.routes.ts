import { Router } from 'express';
import * as ctrl from '../controllers/checklistController';
import { authMiddleware, requireRole } from '../middleware/auth';

const router = Router();

// Mobile submission: POST /api/mobile/checklists (requires auth as technician/planner/admin)
router.post('/mobile/checklists', authMiddleware, requireRole(['technician','planner','admin']), ctrl.submitChecklist);

// Mobile listing for technicians: GET /api/mobile/checklists (technician/planner/admin)
router.get('/mobile/checklists', authMiddleware, requireRole(['technician','planner','admin']), ctrl.listMobileChecklists);

// Mobile detail for technicians
router.get('/mobile/checklists/:id', authMiddleware, requireRole(['technician','planner','admin']), ctrl.getMobileChecklistById);

// Admin/listing: GET /api/checklists (only planner/admin)
router.get('/checklists', authMiddleware, requireRole(['planner','admin']), ctrl.listChecklists);
// Findings report: GET /api/checklists/findings (planner/admin)
router.get('/checklists/findings', authMiddleware, requireRole(['planner','admin']), ctrl.listChecklistFindings);
// Allow terminal role to view checklist detail (read-only, for monitoring page)
router.get('/checklists/:id', authMiddleware, requireRole(['planner','admin','terminal']), ctrl.getChecklistById);

export default router;
