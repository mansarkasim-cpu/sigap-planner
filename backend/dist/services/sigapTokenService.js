"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.forceRefreshToken = exports.getSigapToken = void 0;
// src/services/sigapTokenService.ts
const axios_1 = __importDefault(require("axios"));
const cache = { token: null, expiresAt: 0 };
let refreshing = null;
// Env config
const AUTH_URL = process.env.SIGAP_AUTH_TOKEN_URL || '';
const AUTH_METHOD = (process.env.SIGAP_AUTH_METHOD || 'client_credentials').toLowerCase();
const CLIENT_ID = process.env.SIGAP_CLIENT_ID || '';
const CLIENT_SECRET = process.env.SIGAP_CLIENT_SECRET || '';
const AUTH_USERNAME = process.env.SIGAP_AUTH_USERNAME || '';
const AUTH_PASSWORD = process.env.SIGAP_AUTH_PASSWORD || '';
const TOKEN_FIELD = process.env.SIGAP_TOKEN_FIELD || 'access_token'; // default field name
const EXPIRES_FIELD = process.env.SIGAP_TOKEN_EXPIRES_IN_FIELD || 'expires_in';
const AUTO_REFRESH = (process.env.SIGAP_TOKEN_AUTO_REFRESH || 'false').toLowerCase() === 'true';
// helper: try decode jwt exp (returns epoch seconds or null)
function decodeJwtExp(jwt) {
    try {
        const parts = jwt.split('.');
        if (parts.length < 2)
            return null;
        const payloadB64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
        // add padding
        const pad = payloadB64.length % 4;
        const padded = payloadB64 + (pad ? '='.repeat(4 - pad) : '');
        const json = Buffer.from(padded, 'base64').toString('utf8');
        const obj = JSON.parse(json);
        if (typeof obj.exp === 'number')
            return obj.exp;
        return null;
    }
    catch (err) {
        return null;
    }
}
function isTokenValid() {
    return !!cache.token && Date.now() + 5000 < cache.expiresAt; // 5s margin
}
/**
 * Build auth request for various methods and parse response.
 */
async function requestNewToken() {
    if (!AUTH_URL)
        throw new Error('SIGAP_AUTH_TOKEN_URL not configured');
    // 1) client_credentials (OAuth2)
    if (AUTH_METHOD === 'client_credentials') {
        const body = new URLSearchParams();
        body.append('grant_type', 'client_credentials');
        if (process.env.SIGAP_TOKEN_SCOPE)
            body.append('scope', process.env.SIGAP_TOKEN_SCOPE);
        const authHeader = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
        const resp = await axios_1.default.post(AUTH_URL, body.toString(), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: `Basic ${authHeader}`,
            },
            timeout: 10000,
        });
        const data = resp.data || {};
        const token = data[TOKEN_FIELD] ?? (data.data && data.data.token) ?? data.access_token;
        const expiresIn = data[EXPIRES_FIELD] ?? (data.data && data.data.expires_in);
        if (!token)
            throw new Error('Auth response missing token field');
        return { token, expiresInSec: expiresIn ? Number(expiresIn) : undefined };
    }
    // 2) password grant
    if (AUTH_METHOD === 'password') {
        const body = new URLSearchParams();
        body.append('grant_type', 'password');
        body.append('username', AUTH_USERNAME);
        body.append('password', AUTH_PASSWORD);
        if (process.env.SIGAP_TOKEN_SCOPE)
            body.append('scope', process.env.SIGAP_TOKEN_SCOPE);
        const resp = await axios_1.default.post(AUTH_URL, body.toString(), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            timeout: 10000,
        });
        const data = resp.data || {};
        const token = data[TOKEN_FIELD] ?? (data.data && data.data.token) ?? data.access_token;
        const expiresIn = data[EXPIRES_FIELD] ?? (data.data && data.data.expires_in);
        if (!token)
            throw new Error('Auth response missing token field');
        return { token, expiresInSec: expiresIn ? Number(expiresIn) : undefined };
    }
    // 3) custom: allow SIGAP-style wrapper { status, message, data: { token: '...' } }
    if (AUTH_METHOD === 'custom') {
        // SIGAP custom body and headers can be provided via env in JSON form
        const rawBody = process.env.SIGAP_AUTH_CUSTOM_BODY || '{}';
        const rawHeaders = process.env.SIGAP_AUTH_CUSTOM_HEADERS || '{}';
        let bodyObj = {};
        let headersObj = {};
        try {
            bodyObj = JSON.parse(rawBody);
            headersObj = JSON.parse(rawHeaders);
        }
        catch (err) {
            throw new Error('Invalid JSON in SIGAP_AUTH_CUSTOM_BODY or SIGAP_AUTH_CUSTOM_HEADERS');
        }
        const resp = await axios_1.default.post(AUTH_URL, bodyObj, { headers: headersObj, timeout: 10000 });
        const data = resp.data || {};
        // try multiple common locations:
        //  - data.token   (as in your example)
        //  - token at top-level
        //  - data.access_token
        //  - access_token top-level
        const token = (data && (data.data && data.data.token)) ||
            (data && data.token) ||
            (data && (data.data && data.data.access_token)) ||
            (data && data.access_token) ||
            (data && data[TOKEN_FIELD]);
        // expires could be in various places too
        const expiresIn = (data && (data.data && data.data[EXPIRES_FIELD])) ||
            (data && data[EXPIRES_FIELD]) ||
            null;
        if (!token) {
            // include response snapshot for debugging
            throw new Error('Auth response missing token field; resp=' + JSON.stringify(data));
        }
        return { token, expiresInSec: expiresIn ? Number(expiresIn) : undefined };
    }
    throw new Error(`Unsupported SIGAP_AUTH_METHOD: ${AUTH_METHOD}`);
}
/**
 * Get token (cached). If expired and AUTO_REFRESH enabled => refresh automatically.
 */
async function getSigapToken() {
    // If static token provided and auto-refresh disabled -> return static
    const staticToken = process.env.SIGAP_BEARER_TOKEN;
    if (staticToken && !AUTO_REFRESH)
        return staticToken;
    if (isTokenValid())
        return cache.token;
    if (refreshing)
        return refreshing;
    refreshing = (async () => {
        try {
            // If no auth url configured and static token exists, fallback
            if (!AUTH_URL) {
                if (staticToken)
                    return staticToken;
                throw new Error('No SIGAP_AUTH_TOKEN_URL configured for auto-refresh and no static token present');
            }
            const { token, expiresInSec } = await requestNewToken();
            // If expiresInSec provided by auth response, use it. Otherwise try decode JWT exp.
            let expiresAt = 0;
            if (expiresInSec && Number.isFinite(expiresInSec)) {
                expiresAt = Date.now() + expiresInSec * 1000;
            }
            else {
                // try decode jwt exp claim
                const jwtExp = decodeJwtExp(token); // epoch seconds
                if (jwtExp && Number.isFinite(jwtExp)) {
                    expiresAt = jwtExp * 1000;
                }
                else {
                    // fallback default lifetime (10 minutes)
                    expiresAt = Date.now() + 10 * 60 * 1000;
                }
            }
            cache.token = token;
            cache.expiresAt = expiresAt;
            return token;
        }
        finally {
            refreshing = null;
        }
    })();
    return refreshing;
}
exports.getSigapToken = getSigapToken;
/** force refresh */
async function forceRefreshToken() {
    cache.token = null;
    cache.expiresAt = 0;
    return getSigapToken();
}
exports.forceRefreshToken = forceRefreshToken;
