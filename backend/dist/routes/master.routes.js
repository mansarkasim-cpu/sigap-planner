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
const hubCtrl = __importStar(require("../controllers/masterHubController"));
const siteCtrl = __importStar(require("../controllers/masterSiteController"));
const jenisCtrl = __importStar(require("../controllers/masterJenisAlatController"));
const alatCtrl = __importStar(require("../controllers/masterAlatController"));
const qCtrl = __importStar(require("../controllers/masterQuestionController"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Hubs (protected)
router.get('/master/hubs', auth_1.authMiddleware, (0, auth_1.requireRole)(['admin', 'technician']), hubCtrl.listHubs);
router.get('/master/hubs/:id', auth_1.authMiddleware, (0, auth_1.requireRole)(['admin', 'technician']), hubCtrl.getHub);
router.post('/master/hubs', auth_1.authMiddleware, (0, auth_1.requireRole)(['admin']), hubCtrl.createHub);
router.patch('/master/hubs/:id', auth_1.authMiddleware, (0, auth_1.requireRole)(['admin']), hubCtrl.updateHub);
router.delete('/master/hubs/:id', auth_1.authMiddleware, (0, auth_1.requireRole)(['admin']), hubCtrl.deleteHub);
// Sites (protected)
router.get('/master/sites', auth_1.authMiddleware, (0, auth_1.requireRole)(['admin', 'technician']), siteCtrl.listSites);
router.get('/master/sites/:id', auth_1.authMiddleware, (0, auth_1.requireRole)(['admin', 'technician']), siteCtrl.getSite);
router.post('/master/sites', auth_1.authMiddleware, (0, auth_1.requireRole)(['admin']), siteCtrl.createSite);
router.patch('/master/sites/:id', auth_1.authMiddleware, (0, auth_1.requireRole)(['admin']), siteCtrl.updateSite);
router.delete('/master/sites/:id', auth_1.authMiddleware, (0, auth_1.requireRole)(['admin']), siteCtrl.deleteSite);
// Jenis Alat (protected)
router.get('/master/jenis-alat', auth_1.authMiddleware, (0, auth_1.requireRole)(['admin', 'technician']), jenisCtrl.listJenis);
router.get('/master/jenis-alat/:id', auth_1.authMiddleware, (0, auth_1.requireRole)(['admin', 'technician']), jenisCtrl.getJenis);
router.post('/master/jenis-alat', auth_1.authMiddleware, (0, auth_1.requireRole)(['admin']), jenisCtrl.createJenis);
router.patch('/master/jenis-alat/:id', auth_1.authMiddleware, (0, auth_1.requireRole)(['admin']), jenisCtrl.updateJenis);
router.delete('/master/jenis-alat/:id', auth_1.authMiddleware, (0, auth_1.requireRole)(['admin']), jenisCtrl.deleteJenis);
// Alat (protected)
router.get('/master/alats', auth_1.authMiddleware, (0, auth_1.requireRole)(['admin', 'technician']), alatCtrl.listAlats);
router.get('/master/alats/:id', auth_1.authMiddleware, (0, auth_1.requireRole)(['admin', 'technician']), alatCtrl.getAlat);
router.post('/master/alats', auth_1.authMiddleware, (0, auth_1.requireRole)(['admin']), alatCtrl.createAlat);
router.patch('/master/alats/:id', auth_1.authMiddleware, (0, auth_1.requireRole)(['admin']), alatCtrl.updateAlat);
router.delete('/master/alats/:id', auth_1.authMiddleware, (0, auth_1.requireRole)(['admin']), alatCtrl.deleteAlat);
// Questions & Options (protected)
router.get('/master/questions', auth_1.authMiddleware, (0, auth_1.requireRole)(['admin', 'technician']), qCtrl.listQuestions);
router.get('/master/questions/:id', auth_1.authMiddleware, (0, auth_1.requireRole)(['admin', 'technician']), qCtrl.getQuestion);
router.post('/master/questions', auth_1.authMiddleware, (0, auth_1.requireRole)(['admin']), qCtrl.createQuestion);
router.patch('/master/questions/:id', auth_1.authMiddleware, (0, auth_1.requireRole)(['admin']), qCtrl.updateQuestion);
router.delete('/master/questions/:id', auth_1.authMiddleware, (0, auth_1.requireRole)(['admin']), qCtrl.deleteQuestion);
router.post('/master/options', auth_1.authMiddleware, (0, auth_1.requireRole)(['admin']), qCtrl.createOption);
router.patch('/master/options/:id', auth_1.authMiddleware, (0, auth_1.requireRole)(['admin']), qCtrl.updateOption);
router.delete('/master/options/:id', auth_1.authMiddleware, (0, auth_1.requireRole)(['admin']), qCtrl.deleteOption);
// allow listing options (used by mobile client to fetch options per question)
router.get('/master/options', auth_1.authMiddleware, (0, auth_1.requireRole)(['admin', 'technician']), qCtrl.listOptions);
exports.default = router;
