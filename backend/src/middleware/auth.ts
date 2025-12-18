// filepath: backend/src/middleware/auth.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
  id?: string;
  nipp?: string;
  email?: string;
  role?: string;
  [key: string]: any;
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization || "";
  const parts = auth.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({ code: "UNAUTHORIZED", message: "Missing or invalid Authorization header" });
  }
  const token = parts[1];
  try {
    const secret = process.env.JWT_SECRET || "change_this_secret";
    const decoded = jwt.verify(token, secret) as JwtPayload;
    // attach user info to request
    (req as any).user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ code: "UNAUTHORIZED", message: "Invalid token" });
  }
}