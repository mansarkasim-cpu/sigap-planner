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
    
    console.log('🔹 registerDeviceToken called');
    console.log(`   token: ${token ? token.substring(0, 20) + '...' : 'NULL'}`);
    console.log(`   platform: ${platform}`);
    console.log(`   user from JWT: ${user ? JSON.stringify({id: user.id, nipp: user.nipp, role: user.role}) : 'NULL'}`);
    
    if (!token) {
      console.log('❌ No token provided');
      return res.status(400).json({ message: 'token required' });
    }

    let u = undefined;
    if (user && user.id) {
      u = await userRepo().findOneBy({ id: user.id });
      if (u) {
        console.log(`✓ User found in database: ${u.name} (${u.nipp})`);
      } else {
        console.log(`❌ User NOT found in database with id: ${user.id}`);
      }
    } else {
      console.log('⚠️  No user info in JWT');
    }

    // Upsert by token
    let existing = await repo().findOne({ where: { token } as any });
    if (existing) {
      console.log('ℹ️  Token already exists, updating...');
      existing.platform = platform ?? existing.platform;
      existing.user = u ?? existing.user;
      const saved = await repo().save(existing);
      console.log(`✓ Device token updated: id=${saved.id}, user_id=${saved.user?.id ?? 'NULL'}`);
      return res.json({ message: 'updated', data: saved });
    }

    const ent = repo().create({ token, platform, user: u } as any);
    const saved = await repo().save(ent as any);
    console.log(`✓ Device token created: id=${saved.id}, platform=${saved.platform}, user_id=${saved.user?.id ?? 'NULL'}`);
    return res.status(201).json({ message: 'created', data: saved });
  } catch (err) {
    console.error('❌ registerDeviceToken error', err);
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
