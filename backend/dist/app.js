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
const checklist_routes_1 = __importDefault(require("./routes/checklist.routes"));
const master_routes_1 = __importDefault(require("./routes/master.routes"));
const monitoring_routes_1 = __importDefault(require("./routes/monitoring.routes"));
const device_routes_1 = __importDefault(require("./routes/device.routes"));
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
// Handle Private Network Access preflight (Chrome PNA). When the browser
// requests access to a more-private address space (e.g. loopback), it will
// include the `Access-Control-Request-Private-Network` header on the OPTIONS
// preflight. Respond with `Access-Control-Allow-Private-Network: true` to
// permit the request. Also expose header for actual responses.
app.use((req, res, next) => {
    try {
        const acrpn = req.headers['access-control-request-private-network'];
        if (req.method === 'OPTIONS' && acrpn) {
            res.setHeader('Access-Control-Allow-Private-Network', 'true');
        }
        // include on all responses as a fallback
        res.setHeader('Access-Control-Expose-Headers', (res.getHeader('Access-Control-Expose-Headers') || '') + ', Access-Control-Allow-Private-Network');
    }
    catch (e) {
        // ignore header-setting errors
    }
    next();
});
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
app.use('/api', checklist_routes_1.default);
app.use('/api', master_routes_1.default);
app.use('/api', monitoring_routes_1.default);
app.use('/api', device_routes_1.default);
// Mount swagger UI at /api/docs
app.use("/api/docs", swagger_routes_1.default);
// static uploads (dev)
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// Serve uploads from a configurable directory. In production the process
// cwd may differ from the source tree; prefer explicit `UPLOADS_DIR` env var
// but fall back to several sensible locations (project-level `uploads` or
// `upload`, or compiled `dist/../uploads`). This registers both `/uploads`
// and `/upload` so existing links work.
const UPLOADS_DIR_ENV = process.env.UPLOADS_DIR || '';
// Prefer a top-level `uploads` under the current working directory. When the
// server is started from the `backend` folder, `process.cwd()` already points
// to `.../backend`, so using `path.join(process.cwd(),'backend','uploads')`
// can incorrectly produce `backend/backend/uploads`. Try several sensible
// locations with `cwd/uploads` first.
const cwd = process.cwd();
const uploadsCandidates = [
    UPLOADS_DIR_ENV,
    path_1.default.join(cwd, 'uploads'),
    path_1.default.join(cwd, 'backend', 'uploads'),
    path_1.default.join(__dirname, '..', 'uploads'),
    path_1.default.join(cwd, 'upload'),
    path_1.default.join(__dirname, '..', 'upload'),
].map(p => (p || '').toString());
const uploadsDirFound = uploadsCandidates.find((p) => p && fs_1.default.existsSync(p));
// Fallback to `cwd/uploads` when nothing exists yet; create folder so static serving works
const defaultUploads = path_1.default.join(cwd, 'uploads');
const finalUploadsDir = uploadsDirFound || (UPLOADS_DIR_ENV || defaultUploads);
try {
    fs_1.default.mkdirSync(finalUploadsDir, { recursive: true });
}
catch (e) { /* ignore */ }
// Log final uploads dir for debugging static file serving
console.log('finalUploadsDir=', finalUploadsDir);
app.use('/uploads', express_1.default.static(finalUploadsDir));
app.use('/upload', express_1.default.static(finalUploadsDir));
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
// Temporary debug endpoint: echo request body/headers to verify POST handling
app.post('/api/echo', (req, res) => {
    res.json({ ok: true, method: req.method, url: req.originalUrl, headers: req.headers, body: req.body || null });
});
// Temporary debug endpoint: list registered routes for quick inspection
app.get('/api/_routes', (req, res) => {
    try {
        const routes = [];
        const stack = app._router && app._router.stack ? app._router.stack : [];
        stack.forEach((layer) => {
            if (layer.route && layer.route.path) {
                routes.push({ path: layer.route.path, methods: layer.route.methods });
            }
            else if (layer.name === 'router' && layer.handle && layer.handle.stack) {
                layer.handle.stack.forEach((r) => {
                    if (r.route && r.route.path)
                        routes.push({ path: r.route.path, methods: r.route.methods });
                });
            }
        });
        res.json({ routes });
    }
    catch (e) {
        res.status(500).json({ error: String(e) });
    }
});
exports.default = app;
