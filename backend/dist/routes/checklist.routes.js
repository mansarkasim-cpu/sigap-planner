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
const ctrl = __importStar(require("../controllers/checklistController"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Mobile submission: POST /api/mobile/checklists (requires auth as technician/planner/admin)
router.post('/mobile/checklists', auth_1.authMiddleware, (0, auth_1.requireRole)(['technician', 'planner', 'admin']), ctrl.submitChecklist);
// Mobile listing for technicians: GET /api/mobile/checklists (technician/planner/admin)
router.get('/mobile/checklists', auth_1.authMiddleware, (0, auth_1.requireRole)(['technician', 'planner', 'admin']), ctrl.listMobileChecklists);
// Mobile detail for technicians
router.get('/mobile/checklists/:id', auth_1.authMiddleware, (0, auth_1.requireRole)(['technician', 'planner', 'admin']), ctrl.getMobileChecklistById);
// Admin/listing: GET /api/checklists (only planner/admin)
router.get('/checklists', auth_1.authMiddleware, (0, auth_1.requireRole)(['planner', 'admin']), ctrl.listChecklists);
router.get('/checklists/:id', auth_1.authMiddleware, (0, auth_1.requireRole)(['planner', 'admin']), ctrl.getChecklistById);
exports.default = router;
