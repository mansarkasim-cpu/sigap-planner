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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ctrl = __importStar(require("../controllers/userController"));
const importCtrl = __importStar(require("../controllers/userImportController"));
const multer_1 = __importDefault(require("multer"));
const os_1 = __importDefault(require("os"));
const upload = (0, multer_1.default)({ dest: os_1.default.tmpdir() });
const router = (0, express_1.Router)();
// GET /api/users
router.get('/', ctrl.listUsers);
// GET /api/users/:id
router.get('/:id', ctrl.getUserById);
// POST /api/users
router.post('/', ctrl.createUser);
// POST /api/users/import - upload Excel/CSV to import users
router.post('/import', upload.single('file'), importCtrl.importUsersFromFile);
// PATCH /api/users/:id
router.patch('/:id', ctrl.updateUser);
// DELETE /api/users/:id
router.delete('/:id', ctrl.deleteUser);
// Optional helper: sync sites from workorders
router.post('/_sync/sites-from-workorders', ctrl.syncUserSitesFromWorkOrders);
exports.default = router;
