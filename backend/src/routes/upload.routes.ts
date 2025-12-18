// filepath: backend/src/routes/upload.routes.ts
import { Router, Request, Response } from "express";
import AWS from "aws-sdk";
import crypto from "crypto";
import { authMiddleware } from "../middleware/auth";
import { createRealisasi, submitPendingRealisasi, listPendingRealisasi, approvePendingRealisasi } from "../dto/realisasi.dto";

const router = Router();

const s3 = new AWS.S3({
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
router.post("/upload/presign", authMiddleware, async (req: Request, res: Response) => {
  try {
    const { filename, contentType } = req.body || {};
    if (!filename) return res.status(400).json({ code: "VALIDATION_ERROR", message: "filename required" });

    const ext = filename.includes(".") ? filename.substring(filename.lastIndexOf(".")) : "";
    const key = `uploads/${Date.now()}_${crypto.randomBytes(6).toString("hex")}${ext || ""}`;

    const params: AWS.S3.Types.PutObjectRequest = {
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
  } catch (err) {
    console.error("presign error", err);
    return res.status(500).json({ code: "INTERNAL_ERROR", message: "Failed to generate presigned url" });
  }
});

// expose realisasi endpoint here for simplicity
router.post('/realisasi', authMiddleware, async (req, res) => createRealisasi(req as any, res as any));

// submit a realisasi for lead-shift approval (technician submits)
router.post('/realisasi/submit', authMiddleware, async (req, res) => submitPendingRealisasi(req as any, res as any));

// list pending realisasi for lead-shift (role protected)
router.get('/realisasi/pending', authMiddleware, async (req, res) => listPendingRealisasi(req as any, res as any));

// approve pending realisasi (lead shift) -> creates Realisasi and completes WO
router.post('/realisasi/:id/approve', authMiddleware, async (req, res) => approvePendingRealisasi(req as any, res as any));

export default router;