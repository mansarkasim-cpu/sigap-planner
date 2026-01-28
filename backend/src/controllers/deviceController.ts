import { Request, Response } from 'express';
import { AppDataSource } from '../ormconfig';
import { DeviceToken } from '../entities/DeviceToken';
import { User } from '../entities/User';

const repo = () => AppDataSource.getRepository(DeviceToken);
const userRepo = () => AppDataSource.getRepository(User);

// POST /api/device-tokens
export async function registerDeviceToken(req: Request, res: Response) {
  try {
    const user = (req as any).user;
    const { token, platform } = req.body || {};
    if (!token) return res.status(400).json({ message: 'token required' });

    let u = undefined;
    if (user && user.id) {
      u = await userRepo().findOneBy({ id: user.id });
    }

    // Upsert by token
    let existing = await repo().findOne({ where: { token } as any });
    if (existing) {
      existing.platform = platform ?? existing.platform;
      existing.user = u ?? existing.user;
      const saved = await repo().save(existing);
      return res.json({ message: 'updated', data: saved });
    }

    const ent = repo().create({ token, platform, user: u } as any);
    const saved = await repo().save(ent as any);
    return res.status(201).json({ message: 'created', data: saved });
  } catch (err) {
    console.error('registerDeviceToken error', err);
    return res.status(500).json({ message: 'Failed to register device token' });
  }
}

// Optional: remove token
export async function removeDeviceToken(req: Request, res: Response) {
  try {
    const { token } = req.body || {};
    if (!token) return res.status(400).json({ message: 'token required' });
    const existing = await repo().findOne({ where: { token } as any });
    if (!existing) return res.status(404).json({ message: 'Not found' });
    await repo().remove(existing);
    return res.json({ message: 'deleted' });
  } catch (err) {
    console.error('removeDeviceToken error', err);
    return res.status(500).json({ message: 'Failed to remove device token' });
  }
}
