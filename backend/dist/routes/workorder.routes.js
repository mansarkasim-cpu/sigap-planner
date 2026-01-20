"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/workorder.routes.ts
const express_1 = require("express");
const ctrl = __importStar(require("../controllers/workOrderController"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// daftar paginated & search: GET /api/work-orders?q=&page=&pageSize=
router.get('/', ctrl.listWorkOrdersPaginated);
// tambah dari SIGAP (existing)
router.post('/add', ctrl.fetchAndCreateFromSigap);
router.post('/fetch-and-create', ctrl.fetchAndCreateFromSigap);
// generate daily checklist work orders for all master alat
router.post('/generate-daily', auth_1.authMiddleware, ctrl.generateDailyWorkOrders);
router.delete('/:id', auth_1.authMiddleware, ctrl.deleteWorkOrderHandler);
// update start/end date: PATCH /api/work-orders/:id
// protect date edits and record who changed them
router.patch('/:id', auth_1.authMiddleware, ctrl.updateWorkOrderDates);
// get date-change history
router.get('/:id/date-history', auth_1.authMiddleware, ctrl.getWorkOrderDateHistory);
router.get('/:id', ctrl.getWorkOrderById);
router.post('/:id/deploy', auth_1.authMiddleware, ctrl.deployWorkOrder);
router.post('/:id/undeploy', auth_1.authMiddleware, ctrl.undeployWorkOrder);
exports.default = router;
