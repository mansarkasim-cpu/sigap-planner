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

// middleware factory to require one of allowed roles
export function requireRole(allowedRoles: string[] = []) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user as JwtPayload | undefined;
    if (!user) return res.status(401).json({ code: 'UNAUTHORIZED', message: 'Authentication required' });
    const role = (user.role || '').toString();
    if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
      return res.status(403).json({ code: 'FORBIDDEN', message: 'Insufficient role/permission' });
    }
    next();
  };
}