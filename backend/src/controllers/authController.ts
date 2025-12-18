import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import { AppDataSource } from "../ormconfig";
import { User } from "../entities/User";

const JWT_SECRET = process.env.JWT_SECRET || "change_this_secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

type UserRegisterBody = {
  name?: string;
  email?: string;
  password?: string;
  role?: string;
  nipp?: string;
//   city?: string;
//   location?: { lat?: number; lon?: number; address?: string };
};

export async function registerHandler(req: Request, res: Response) {
  try {
    const body = (req.body || {}) as UserRegisterBody;
    const { name, email, password, role, nipp } = body;

    // require name, nipp and password for registration
    if (!name || !nipp || !password) {
      return res.status(400).json({ code: "VALIDATION_ERROR", message: "name, nipp and password are required" });
    }

    const repo = AppDataSource.getRepository(User);
    // ensure nipp uniqueness and format
    if (!/^[0-9]{1,15}$/.test(String(nipp))) return res.status(400).json({ code: 'VALIDATION_ERROR', message: 'NIPP must be numeric and at most 15 digits' });
    const existingN = await repo.findOne({ where: { nipp } as any });
    if (existingN) return res.status(409).json({ code: 'CONFLICT', message: 'NIPP already registered' });

    const hashed = await bcrypt.hash(password, 10);

    const user = repo.create({
      name,
      email: email ?? undefined,
      nipp,
      password: hashed,
      role: role ?? "technician",
    } as any);

    const saved = await repo.save(user as any);

    // Return safe user object (no password)
    const savedUser = saved as any;
    const out = {
      id: savedUser.id,
      name: savedUser.name,
      nipp: savedUser.nipp,
      email: savedUser.email,
      role: savedUser.role,
    };

    return res.status(201).json(out);
  } catch (err) {
    console.error("register error:", err);
    return res.status(500).json({ code: "INTERNAL_ERROR", message: "Failed to register user" });
  }
}

export async function loginHandler(req: Request, res: Response) {
  try {
    const { nipp, password } = req.body || {};
    if (!nipp || !password) {
      return res.status(400).json({ code: "VALIDATION_ERROR", message: "nipp and password required" });
    }
    if (!/^[0-9]{1,15}$/.test(String(nipp))) return res.status(400).json({ code: 'VALIDATION_ERROR', message: 'NIPP must be numeric and at most 15 digits' });

    const repo = AppDataSource.getRepository(User);
    const user = await repo.findOne({ where: { nipp } as any });
    if (!user || !user.password) {
      return res.status(401).json({ code: "UNAUTHORIZED", message: "Invalid credentials" });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ code: "UNAUTHORIZED", message: "Invalid credentials" });

    const payload = { id: user.id, nipp: user.nipp, role: user.role };
    const signOptions: SignOptions = { expiresIn: JWT_EXPIRES_IN as any };
    const accessToken = jwt.sign(payload, JWT_SECRET as string, signOptions);

    const outUser = {
      id: user.id,
      username: user.name,
      nipp: user.nipp,
      email: user.email,
      city: (user as any).city ?? null,
      location: (user as any).location ?? null,
      role: user.role,
    };

    return res.json({ accessToken, user: outUser });
  } catch (err) {
    console.error("login error:", err);
    return res.status(500).json({ code: "INTERNAL_ERROR", message: "Internal server error" });
  }
}

export async function meHandler(req: Request, res: Response) {
  try {
    const reqUser = (req as any).user;
    if (!reqUser?.id) return res.status(401).json({ code: "UNAUTHORIZED", message: "Missing token" });

    const repo = AppDataSource.getRepository(User);
    const user = await repo.findOne({ where: { id: reqUser.id } as any });
    if (!user) return res.status(404).json({ code: "NOT_FOUND", message: "User not found" });

    return res.json({
      id: user.id,
      username: user.name,
      nipp: user.nipp,
      email: user.email,
      city: (user as any).city ?? null,
      location: (user as any).location ?? null,
      role: user.role,
    });
  } catch (err) {
    console.error("me error:", err);
    return res.status(500).json({ code: "INTERNAL_ERROR", message: "Internal server error" });
  }
}