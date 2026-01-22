import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { AppDataSource } from '../ormconfig';
import { User } from '../entities/User';

const repo = () => AppDataSource.getRepository(User);

export async function listUsers(req: Request, res: Response) {
  try {
    // support lookup by numeric NIPP: GET /api/users?nipp=1960324618
    if (req.query.nipp) {
      const nipp = String(req.query.nipp || '');
      if (nipp) {
        const u = await repo().findOneBy({ nipp });
        if (!u) return res.json({ data: [] });
        return res.json({ data: [u] });
      }
    }
    const q = (req.query.q as string) || '';
    const page = Math.max(Number(req.query.page || 1), 1);
    const pageSize = Math.max(Number(req.query.pageSize || 10), 1);

    if (req.query.page || req.query.q || req.query.role) {
      const qb = repo().createQueryBuilder('u');
      if (q) {
        qb.where('u.name ILIKE :q OR u.email ILIKE :q OR u.site ILIKE :q', { q: `%${q}%` });
      }
      if (req.query.role) {
        qb.andWhere('u.role = :role', { role: String(req.query.role) });
      }
      if (req.query.site) {
        qb.andWhere('u.site = :site', { site: String(req.query.site) });
      }
      qb.orderBy('u.name', 'ASC');
      qb.skip((page - 1) * pageSize).take(pageSize);
      const [rows, total] = await qb.getManyAndCount();
      return res.json({ data: rows, meta: { page, pageSize, total } });
    }

    const rows = await repo().find({ order: { name: 'ASC' } });
    return res.json(rows);
  } catch (err) {
    console.error('listUsers error', err);
    return res.status(500).json({ message: 'Failed to list users' });
  }
}

export async function getUserById(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const u = await repo().findOneBy({ id });
    if (!u) return res.status(404).json({ message: 'User not found' });
    return res.json({ data: u });
  } catch (err) {
    console.error('getUserById error', err);
    return res.status(500).json({ message: 'Failed to get user' });
  }
}

export async function createUser(req: Request, res: Response) {
  try {
    const { name, email, role, site, nipp } = req.body || {};
    if (!name || !nipp) return res.status(400).json({ message: 'name and nipp required' });

    // validate nipp format (numeric, <=15)
    if (!/^[0-9]{1,15}$/.test(String(nipp))) return res.status(400).json({ message: 'NIPP must be numeric and at most 15 digits' });

    // check uniqueness of nipp (email is optional)
    const existsNipp = await repo().findOneBy({ nipp });
    if (existsNipp) return res.status(409).json({ message: 'NIPP already exists' });
    if (email) {
      const existsEmail = await repo().findOneBy({ email });
      if (existsEmail) return res.status(409).json({ message: 'Email already exists' });
    }

    // hash password if provided
    const hashed = password ? await bcrypt.hash(String(password), 10) : undefined;
    const u = repo().create({ name, email: email ?? undefined, password: hashed, role: role || 'technician', site, nipp } as any);
    const saved = await repo().save(u as any);
    return res.status(201).json({ message: 'created', data: saved });
  } catch (err: any) {
    console.error('createUser error', err);
    return res.status(500).json({ message: 'Failed to create user', detail: err.message || err });
  }
}

export async function updateUser(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const { name, email, password, role, site, nipp } = req.body || {};
    const u = await repo().findOneBy({ id });
    if (!u) return res.status(404).json({ message: 'User not found' });

    if (email && email !== u.email) {
      const exists = await repo().findOneBy({ email });
      if (exists) return res.status(409).json({ message: 'Email already used' });
    }

    if (nipp && nipp !== u.nipp) {
      const existsN = await repo().findOneBy({ nipp });
      if (existsN) return res.status(409).json({ message: 'NIPP already used' });
    }

    u.name = name ?? u.name;
    u.email = email ?? u.email;
    // Do NOT modify password on user update here. Password changes
    // should be performed via a dedicated endpoint or admin action.
    u.role = role ?? u.role;
    u.site = site ?? u.site;
    u.nipp = nipp ?? u.nipp;

    const saved = await repo().save(u);
    return res.json({ message: 'updated', data: saved });
  } catch (err: any) {
    console.error('updateUser error', err);
    return res.status(500).json({ message: 'Failed to update user', detail: err.message || err });
  }
}

export async function deleteUser(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const u = await repo().findOneBy({ id });
    if (!u) return res.status(404).json({ message: 'User not found' });
    await repo().remove(u);
    return res.json({ message: 'deleted' });
  } catch (err) {
    console.error('deleteUser error', err);
    return res.status(500).json({ message: 'Failed to delete user' });
  }
}

export async function resetPassword(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const { password } = req.body || {};
    if (!password) return res.status(400).json({ message: 'password required' });

    const u = await repo().findOneBy({ id });
    if (!u) return res.status(404).json({ message: 'User not found' });

    const hashed = await bcrypt.hash(String(password), 10);
    u.password = hashed;
    const saved = await repo().save(u);
    return res.json({ message: 'password reset', data: { id: saved.id } });
  } catch (err: any) {
    console.error('resetPassword error', err);
    return res.status(500).json({ message: 'Failed to reset password', detail: err.message || err });
  }
}

export async function syncUserSitesFromWorkOrders(req: Request, res: Response) {
  // Optional helper: copy vendor_cabang from work_orders.raw -> user.site by matching email/name
  // This is a best-effort helper and should be tailored for your data model.
  try {
    // NOTE: keep simple: not implemented here — can be added on request
    return res.status(501).json({ message: 'Not implemented — ask to implement sync logic' });
  } catch (err) {
    console.error('syncUserSitesFromWorkOrders error', err);
    return res.status(500).json({ message: 'Failed to sync sites' });
  }
}
