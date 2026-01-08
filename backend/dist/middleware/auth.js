"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function authMiddleware(req, res, next) {
    const auth = req.headers.authorization || "";
    const parts = auth.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
        return res.status(401).json({ code: "UNAUTHORIZED", message: "Missing or invalid Authorization header" });
    }
    const token = parts[1];
    try {
        const secret = process.env.JWT_SECRET || "change_this_secret";
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        // attach user info to request
        req.user = decoded;
        next();
    }
    catch (err) {
        return res.status(401).json({ code: "UNAUTHORIZED", message: "Invalid token" });
    }
}
exports.authMiddleware = authMiddleware;
// middleware factory to require one of allowed roles
function requireRole(allowedRoles = []) {
    return (req, res, next) => {
        const user = req.user;
        if (!user)
            return res.status(401).json({ code: 'UNAUTHORIZED', message: 'Authentication required' });
        const role = (user.role || '').toString();
        if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
            return res.status(403).json({ code: 'FORBIDDEN', message: 'Insufficient role/permission' });
        }
        next();
    };
}
exports.requireRole = requireRole;
