"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// filepath: backend/src/routes/upload.routes.ts
const express_1 = require("express");
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const crypto_1 = __importDefault(require("crypto"));
const auth_1 = require("../middleware/auth");
const realisasi_dto_1 = require("../dto/realisasi.dto");
const router = (0, express_1.Router)();
const s3 = new aws_sdk_1.default.S3({
    endpoint: process.env.S3_ENDPOINT,
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
    s3ForcePathStyle: process.env.S3_FORCE_PATH_STYLE === "true" || true,
    signatureVersion: "v4",
});
const BUCKET = process.env.S3_BUCKET || "sigap-uploads";
/**
 * POST /api/upload/presign
 * body: { filename, contentType }
 * returns: { url, key, expiresIn, publicUrl? }
 */
router.post("/upload/presign", auth_1.authMiddleware, async (req, res) => {
    try {
        const { filename, contentType } = req.body || {};
        if (!filename)
            return res.status(400).json({ code: "VALIDATION_ERROR", message: "filename required" });
        const ext = filename.includes(".") ? filename.substring(filename.lastIndexOf(".")) : "";
        const key = `uploads/${Date.now()}_${crypto_1.default.randomBytes(6).toString("hex")}${ext || ""}`;
        const params = {
            Bucket: BUCKET,
            Key: key,
            ContentType: contentType || "application/octet-stream",
        };
        const expiresSeconds = 60 * 5; // 5 minutes
        const url = await s3.getSignedUrlPromise("putObject", { ...params, Expires: expiresSeconds });
        // If using MinIO with path-style and public access, you may compute public URL
        let publicUrl = undefined;
        if (process.env.S3_PUBLIC_BASE) {
            publicUrl = `${process.env.S3_PUBLIC_BASE}/${key}`;
        }
        return res.json({ url, key, expiresIn: expiresSeconds, publicUrl });
    }
    catch (err) {
        console.error("presign error", err);
        return res.status(500).json({ code: "INTERNAL_ERROR", message: "Failed to generate presigned url" });
    }
});
// expose realisasi endpoint here for simplicity
router.post('/realisasi', auth_1.authMiddleware, async (req, res) => (0, realisasi_dto_1.createRealisasi)(req, res));
// submit a realisasi for lead-shift approval (technician submits)
router.post('/realisasi/submit', auth_1.authMiddleware, async (req, res) => (0, realisasi_dto_1.submitPendingRealisasi)(req, res));
// list pending realisasi for lead-shift (role protected)
router.get('/realisasi/pending', auth_1.authMiddleware, async (req, res) => (0, realisasi_dto_1.listPendingRealisasi)(req, res));
// approve pending realisasi (lead shift) -> creates Realisasi and completes WO
router.post('/realisasi/:id/approve', auth_1.authMiddleware, async (req, res) => (0, realisasi_dto_1.approvePendingRealisasi)(req, res));
exports.default = router;
