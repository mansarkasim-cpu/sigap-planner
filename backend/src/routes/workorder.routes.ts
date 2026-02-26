// src/routes/workorder.routes.ts
import { Router } from 'express';
import * as ctrl from '../controllers/workOrderController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// daftar paginated & search: GET /api/work-orders?q=&page=&pageSize=
router.get('/', ctrl.listWorkOrdersPaginated);

// Gantt optimized endpoint: GET /api/work-orders/gantt?start=&end=&site=&work_type=&type_work=
router.get('/gantt', ctrl.listWorkOrdersForGantt);

// GET /api/work-orders/completed-with-realisasi?start=&end=&page=&pageSize=
router.get('/completed-with-realisasi', ctrl.listCompletedWorkOrdersWithRealisasi);

// tambah dari SIGAP (existing)
router.post('/add', ctrl.fetchAndCreateFromSigap);
router.post('/fetch-and-create', ctrl.fetchAndCreateFromSigap);

// generate daily checklist work orders for all master alat
router.post('/generate-daily', authMiddleware, ctrl.generateDailyWorkOrders);
router.delete('/:id', authMiddleware, ctrl.deleteWorkOrderHandler);

// update start/end date: PATCH /api/work-orders/:id
// protect date edits and record who changed them
router.patch('/:id', authMiddleware, ctrl.updateWorkOrderDates);

// get date-change history
router.get('/:id/date-history', authMiddleware, ctrl.getWorkOrderDateHistory);

router.get('/:id', ctrl.getWorkOrderById); 
router.post('/:id/deploy', authMiddleware, ctrl.deployWorkOrder);
router.post('/:id/undeploy', authMiddleware, ctrl.undeployWorkOrder);

export default router;
