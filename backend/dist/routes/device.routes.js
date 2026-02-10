"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const deviceController_1 = require("../controllers/deviceController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Register device token for current authenticated user
router.post('/device-tokens', auth_1.authMiddleware, deviceController_1.registerDeviceToken);
// Remove device token (optional)
router.delete('/device-tokens', auth_1.authMiddleware, deviceController_1.removeDeviceToken);
exports.default = router;
