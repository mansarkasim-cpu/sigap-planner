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
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const ctrl = __importStar(require("../controllers/pmController"));
const rulesCtrl = __importStar(require("../controllers/pmRulesController"));
const historyCtrl = __importStar(require("../controllers/pmHistoryController"));
const router = (0, express_1.Router)();
// GET /api/pm/calendar?limit=
router.get('/pm/calendar', auth_1.authMiddleware, (0, auth_1.requireRole)(['planner', 'admin']), ctrl.getPMCalendar);
// POST /api/pm/run -> trigger worker manually
router.post('/pm/run', auth_1.authMiddleware, (0, auth_1.requireRole)(['planner', 'admin']), ctrl.runPmNow);
// Assign/unassign workorder to equipment_status for PM schedule
router.post('/pm/equipment-status/:alat_id/assign-workorder', auth_1.authMiddleware, (0, auth_1.requireRole)(['planner', 'admin']), ctrl.assignWorkOrder);
router.post('/pm/equipment-status/:alat_id/unassign-workorder', auth_1.authMiddleware, (0, auth_1.requireRole)(['planner', 'admin']), ctrl.unassignWorkOrder);
router.get('/pm/equipment-status/:alat_id/workorders', auth_1.authMiddleware, (0, auth_1.requireRole)(['planner', 'admin']), ctrl.getWorkOrdersForAlat);
// PM rules CRUD
router.get('/pm/rules', auth_1.authMiddleware, (0, auth_1.requireRole)(['planner', 'admin']), rulesCtrl.listPmRules);
router.post('/pm/rules', auth_1.authMiddleware, (0, auth_1.requireRole)(['planner', 'admin']), rulesCtrl.createPmRule);
router.get('/pm/rules/:id', auth_1.authMiddleware, (0, auth_1.requireRole)(['planner', 'admin']), rulesCtrl.getPmRule);
router.patch('/pm/rules/:id', auth_1.authMiddleware, (0, auth_1.requireRole)(['planner', 'admin']), rulesCtrl.updatePmRule);
router.delete('/pm/rules/:id', auth_1.authMiddleware, (0, auth_1.requireRole)(['planner', 'admin']), rulesCtrl.deletePmRule);
// PM history: list (planner/admin) and create (technician/planner/admin)
router.get('/pm/history', auth_1.authMiddleware, (0, auth_1.requireRole)(['planner', 'admin']), historyCtrl.listPmHistory);
router.post('/pm/history', auth_1.authMiddleware, (0, auth_1.requireRole)(['technician', 'planner', 'admin']), historyCtrl.createPmHistory);
exports.default = router;
