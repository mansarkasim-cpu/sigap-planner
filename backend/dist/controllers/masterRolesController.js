"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listRoles = void 0;
// Central list of known application roles. Keep in sync with frontend ROLE_OPTIONS.
const ROLES = ['admin', 'planner', 'technician', 'terminal'];
function listRoles(req, res) {
    try {
        return res.json({ data: ROLES });
    }
    catch (err) {
        console.error('listRoles error', err);
        return res.status(500).json({ message: 'Failed to list roles' });
    }
}
exports.listRoles = listRoles;
exports.default = { listRoles };
