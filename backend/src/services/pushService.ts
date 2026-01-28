import { AppDataSource } from '../ormconfig';
import { DeviceToken } from '../entities/DeviceToken';
import { User } from '../entities/User';
import admin from 'firebase-admin';
import fs from 'fs';

let initialized = false;

function initFirebase() {
  if (initialized) return;
  try {
    const keyJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON || '';
    if (!keyJson) {
      console.warn('FIREBASE_SERVICE_ACCOUNT_JSON not set; pushNotify will be no-op');
      return;
    }
    let cred: any;
    try {
      cred = JSON.parse(keyJson);
    } catch (e) {
      // keyJson may be a path
      if (fs.existsSync(keyJson)) {
        cred = JSON.parse(fs.readFileSync(keyJson, 'utf8'));
      } else {
        console.warn('Invalid FIREBASE_SERVICE_ACCOUNT_JSON content/path');
        return;
      }
    }
    admin.initializeApp({ credential: admin.credential.cert(cred) });
    initialized = true;
  } catch (e) {
    console.warn('Failed to initialize firebase admin:', e);
  }
}

async function tokensForUserId(userId: string) {
  const dtRepo = AppDataSource.getRepository(DeviceToken);
  if (!userId) {
    const rows = await dtRepo.find();
    return rows.map(r => r.token);
  }
  // special keywords
  if (userId === 'lead_shift') {
    const userRepo = AppDataSource.getRepository(User);
    const leads = await userRepo.find({ where: { role: 'lead_shift' } as any });
    if (leads.length === 0) return [];
    const userIds = leads.map(u => u.id);
    const tokens = await dtRepo.createQueryBuilder('d')
      .where('d.user_id IN (:...ids)', { ids: userIds })
      .getMany();
    return tokens.map(t => t.token);
  }
  // assume userId is uuid
  const tokens = await dtRepo.find({ where: { user: { id: userId } as any } as any });
  return tokens.map(t => t.token);
}

export async function pushNotify(userId: string, message: string) {
  try {
    initFirebase();
    if (!initialized) {
      console.log(`pushNotify (not initialized) -> user:${userId} msg:${message}`);
      return;
    }
    const tokens = await tokensForUserId(userId);
    if (!tokens || tokens.length === 0) {
      // No device tokens for this user — nothing to send.
      // Return silently to avoid noisy logs when many users lack tokens.
      return;
    }
    const payload: admin.messaging.MulticastMessage = {
      tokens,
      notification: {
        title: 'SIGAP',
        body: message,
      },
      android: {
        notification: {
          channelId: 'high_alerts',
          sound: 'ship_horn',
        },
      },
      data: { source: 'sigap-backend' },
    };
    try {
      const resp = await admin.messaging().sendMulticast(payload);
      console.log('pushNotify sent:', resp.successCount, 'successes,', resp.failureCount, 'failures');
      if (resp.failureCount && resp.failureCount > 0) {
        resp.responses.forEach((r, idx) => {
          if (!r.success) {
            console.warn('Failed token:', tokens[idx], r.error?.message);
          }
        });
      }
    } catch (e: any) {
      // Some environments/proxies may return an HTML 404 for the /batch endpoint
      // used by sendMulticast. Fall back to sending individual messages so
      // devices that can receive will still get notified.
      console.warn('pushNotify - sendMulticast failed, falling back to individual sends:', e?.message || e);
      try {
        const sendPromises = tokens.map((t) =>
          admin.messaging().send({ 
            token: t, 
            notification: payload.notification as any, 
            android: payload.android as any,
            data: payload.data as any 
          })
            .then(() => ({ token: t, success: true }))
            .catch((err) => ({ token: t, success: false, error: err }))
        );
        const results = await Promise.all(sendPromises);
        const successCount = results.filter((r) => r.success).length;
        const failureCount = results.length - successCount;
        console.log('pushNotify fallback sent:', successCount, 'successes,', failureCount, 'failures');
        results.forEach((r) => {
          if (!r.success) console.warn('Failed token (fallback):', r.token, r.error?.message || r.error);
        });
      } catch (ee) {
        console.error('pushNotify fallback error', ee);
      }
    }
  } catch (err) {
    console.error('pushNotify error', err);
  }
}