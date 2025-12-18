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
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const wo_1 = __importDefault(require("./routes/wo"));
const assignment_routes_1 = __importDefault(require("./routes/assignment.routes"));
const upload_routes_1 = __importDefault(require("./routes/upload.routes")); // adjust if filename differs
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const swagger_routes_1 = __importDefault(require("./routes/swagger.routes")); // mount swagger UI
const workorder_routes_1 = __importDefault(require("./routes/workorder.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const shift_routes_1 = __importDefault(require("./routes/shift.routes"));
const task_routes_1 = __importDefault(require("./routes/task.routes"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const app = (0, express_1.default)();
// src/index.ts (snippet — paste setelah `const app = express();`)
const cors_1 = __importDefault(require("cors"));
// allow origin from env or default to localhost:3000
// In development, allow dynamic origin (reflect incoming origin) so web/emulator requests are accepted.
const FRONTEND_ORIGIN = process.env.NODE_ENV !== 'production'
    ? true
    : (process.env.FRONTEND_URL || 'http://localhost:3000');
app.use(body_parser_1.default.json({ limit: "20mb" }));
app.use(body_parser_1.default.urlencoded({ extended: true }));
// enable CORS
app.use((0, cors_1.default)({
    origin: FRONTEND_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));
// Basic root for /api to avoid "Cannot GET /api"
app.get("/api", (req, res) => {
    return res.json({
        status: "ok",
        api: "/api",
        docs: "/api/docs",
    });
});
// Mount API routers
app.use("/api", auth_routes_1.default);
app.use("/api", wo_1.default);
app.use("/api", assignment_routes_1.default);
app.use("/api", upload_routes_1.default);
app.use('/api/work-orders', workorder_routes_1.default);
app.use('/api/users', user_routes_1.default);
app.use('/api', shift_routes_1.default);
app.use('/api', task_routes_1.default);
// Mount swagger UI at /api/docs
app.use("/api/docs", swagger_routes_1.default);
// static uploads (dev)
const path_1 = __importDefault(require("path"));
app.use("/uploads", express_1.default.static(path_1.default.join(process.cwd(), "uploads")));
// handle preflight for all routes (optional but safe)
app.options('*', (0, cors_1.default)());
app.use((err, req, res, next) => {
    console.error(err);
    const code = err.code || "INTERNAL_ERROR";
    res.status(err.status || 500).json({ code, message: err.message || "Internal error", details: err.details || null });
});
// simple request logger for debugging
app.use((req, res, next) => {
    console.log(`[INCOMING] ${req.method} ${req.originalUrl} - from ${req.ip} - origin: ${req.headers.origin}`);
    next();
});
exports.default = app;
