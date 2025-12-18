import express from "express";
import bodyParser from "body-parser";
import woRoutes from "./routes/wo";
import assignmentRoutes from "./routes/assignment.routes";
import realisasiRoutes from "./routes/upload.routes"; // adjust if filename differs
import authRoutes from "./routes/auth.routes";
import swaggerRoutes from "./routes/swagger.routes"; // mount swagger UI
import workOrderRoutes from './routes/workorder.routes';
import userRoutes from './routes/user.routes';
import shiftRoutes from './routes/shift.routes';
import taskRoutes from './routes/task.routes';
import * as dotenv from "dotenv";
dotenv.config();

const app = express();

// src/index.ts (snippet — paste setelah `const app = express();`)
import cors from 'cors';
// allow origin from env or default to localhost:3000
// In development, allow dynamic origin (reflect incoming origin) so web/emulator requests are accepted.
const FRONTEND_ORIGIN = process.env.NODE_ENV !== 'production'
  ? true
  : (process.env.FRONTEND_URL || 'http://localhost:3000');

app.use(bodyParser.json({ limit: "20mb" }));
app.use(bodyParser.urlencoded({ extended: true }));

// enable CORS
app.use(cors({
  origin: FRONTEND_ORIGIN,    // or '*' for development only
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  credentials: true,          // allow cookies if needed
  allowedHeaders: ['Content-Type','Authorization','X-Requested-With','Accept']
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
app.use("/api", authRoutes);
app.use("/api", woRoutes);
app.use("/api", assignmentRoutes);
app.use("/api", realisasiRoutes);
app.use('/api/work-orders', workOrderRoutes);
app.use('/api/users', userRoutes);
app.use('/api', shiftRoutes);
app.use('/api', taskRoutes);

// Mount swagger UI at /api/docs
app.use("/api/docs", swaggerRoutes);

// static uploads (dev)
import path from "path";
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// handle preflight for all routes (optional but safe)
app.options('*', cors());

app.use((err: any, req: any, res: any, next: any) => {
  console.error(err);
  const code = err.code || "INTERNAL_ERROR";
  res.status(err.status || 500).json({ code, message: err.message || "Internal error", details: err.details || null });
});

// simple request logger for debugging
app.use((req, res, next) => {
  console.log(`[INCOMING] ${req.method} ${req.originalUrl} - from ${req.ip} - origin: ${req.headers.origin}`);
  next();
});

export default app;