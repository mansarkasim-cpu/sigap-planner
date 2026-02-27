"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pushNotify = void 0;
const ormconfig_1 = require("../ormconfig");
const DeviceToken_1 = require("../entities/DeviceToken");
const User_1 = require("../entities/User");
const ShiftGroup_1 = require("../entities/ShiftGroup");
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const fs_1 = __importDefault(require("fs"));
async function removeStaleToken(token) {
    try {
        const dtRepo = ormconfig_1.AppDataSource.getRepository(DeviceToken_1.DeviceToken);
        await dtRepo.delete({ token });
        console.log('pushNotify: removed stale device token', token);
    }
    catch (e) {
        console.warn('pushNotify: failed to remove stale token', token, e);
    }
}
let initialized = false;
function initFirebase() {
    if (initialized)
        return;
    try {
        const keyJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON || '';
        if (!keyJson) {
            console.warn('FIREBASE_SERVICE_ACCOUNT_JSON not set; pushNotify will be no-op');
            return;
        }
        let cred;
        try {
            cred = JSON.parse(keyJson);
        }
        catch (e) {
            // keyJson may be a path
            if (fs_1.default.existsSync(keyJson)) {
                cred = JSON.parse(fs_1.default.readFileSync(keyJson, 'utf8'));
            }
            else {
                console.warn('Invalid FIREBASE_SERVICE_ACCOUNT_JSON content/path');
                return;
            }
        }
        firebase_admin_1.default.initializeApp({ credential: firebase_admin_1.default.credential.cert(cred) });
        initialized = true;
    }
    catch (e) {
        console.warn('Failed to initialize firebase admin:', e);
    }
}
async function tokensForUserId(userId) {
    const dtRepo = ormconfig_1.AppDataSource.getRepository(DeviceToken_1.DeviceToken);
    if (!userId) {
        const rows = await dtRepo.find();
        console.log('pushNotify: tokensForUserId called with empty userId -> returning all tokens count=', rows.length);
        return rows.map(r => r.token);
    }
    // special keywords
    if (userId === 'lead_shift') {
        const userRepo = ormconfig_1.AppDataSource.getRepository(User_1.User);
        const shiftRepo = ormconfig_1.AppDataSource.getRepository(ShiftGroup_1.ShiftGroup);
        // gather leaders declared via shift_group.leader
        const groups = await shiftRepo.find();
        const leaderIdsFromGroups = groups
            .map(g => g.leader)
            .filter((v) => !!v && v.toString().trim() !== '');
        // also keep legacy role-based leads for compatibility
        const leads = await userRepo.find({ where: { role: 'lead_shift' } });
        const leaderIdsFromRole = leads.map(u => u.id).filter((v) => !!v);
        const userIds = Array.from(new Set([...leaderIdsFromGroups, ...leaderIdsFromRole]));
        console.log('pushNotify: resolving lead_shift users, fromGroups=', leaderIdsFromGroups.length, 'fromRole=', leaderIdsFromRole.length, 'total=', userIds.length);
        if (userIds.length === 0)
            return [];
        const tokens = await dtRepo.createQueryBuilder('d')
            .where('d.user_id IN (:...ids)', { ids: userIds })
            .getMany();
        const tokenList = tokens.map(t => t.token);
        console.log('pushNotify: tokens for lead_shift count=', tokenList.length, 'tokens=', tokenList);
        return tokenList;
    }
    // assume userId is uuid
    const tokens = await dtRepo.find({ where: { user: { id: userId } } });
    const tokenList = tokens.map(t => t.token);
    // Log token count and a masked preview for debugging (do not print full tokens in production)
    const masked = tokenList.map(t => (typeof t === 'string' ? (t.length > 16 ? `${t.slice(0, 8)}...${t.slice(-8)}` : t) : String(t)));
    console.log('pushNotify: tokens for user', userId, 'count=', tokenList.length, 'tokens(masked)=', masked);
    return tokenList;
}
async function pushNotify(userId, message) {
    try {
        initFirebase();
        if (!initialized) {
            console.log(`pushNotify (not initialized) -> user:${userId} msg:${message}`);
            return;
        }
        const tokens = await tokensForUserId(userId);
        console.log('pushNotify: sending to user=', userId, 'tokenCount=', Array.isArray(tokens) ? tokens.length : 0);
        if (!tokens || tokens.length === 0) {
            // No device tokens for this user — nothing to send.
            // Return silently to avoid noisy logs when many users lack tokens.
            return;
        }
        const payload = {
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
            const resp = await firebase_admin_1.default.messaging().sendMulticast(payload);
            console.log('pushNotify sent:', resp.successCount, 'successes,', resp.failureCount, 'failures');
            if (resp.failureCount && resp.failureCount > 0) {
                resp.responses.forEach((r, idx) => {
                    if (!r.success) {
                        const err = r.error || {};
                        const errCode = err?.code || err?.errorInfo?.code || (err && err.errorInfo && err.errorInfo.code) || '';
                        console.warn('Failed token:', tokens[idx], r.error?.message, errCode);
                        if (String(errCode).includes('registration-token-not-registered') || String(r.error?.message).includes('Requested entity was not found')) {
                            removeStaleToken(tokens[idx]);
                        }
                    }
                });
            }
        }
        catch (e) {
            // Some environments/proxies may return an HTML 404 for the /batch endpoint
            // used by sendMulticast. Fall back to sending individual messages so
            // devices that can receive will still get notified.
            console.warn('pushNotify - sendMulticast failed, falling back to individual sends:', e?.message || e);
            try {
                const sendPromises = tokens.map((t) => firebase_admin_1.default.messaging().send({
                    token: t,
                    notification: payload.notification,
                    android: payload.android,
                    data: payload.data
                })
                    .then(() => ({ token: t, success: true }))
                    .catch((err) => ({ token: t, success: false, error: err })));
                const results = await Promise.all(sendPromises);
                const successCount = results.filter((r) => r.success).length;
                const failureCount = results.length - successCount;
                console.log('pushNotify fallback sent:', successCount, 'successes,', failureCount, 'failures');
                results.forEach((r) => {
                    if (!r.success) {
                        const err = r.error || {};
                        const errCode = err?.code || err?.errorInfo?.code || (err && err.errorInfo && err.errorInfo.code) || '';
                        console.warn('Failed token (fallback):', r.token, r.error?.message || r.error, errCode);
                        if (String(errCode).includes('registration-token-not-registered') || String(r.error?.message).includes('Requested entity was not found')) {
                            removeStaleToken(r.token);
                        }
                    }
                });
            }
            catch (ee) {
                console.error('pushNotify fallback error', ee);
            }
        }
    }
    catch (err) {
        console.error('pushNotify error', err);
    }
}
exports.pushNotify = pushNotify;
