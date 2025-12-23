// lib/api-client.ts
export type ApiOptions = Omit<RequestInit, 'body'> & { body?: any };

export type ApiLog = {
  id: string;
  ts: number;
  method: string;
  url: string;
  reqBody?: any;
  resStatus?: number;
  resBody?: any;
  error?: string;
  durationMs?: number;
};

function getApiLogs(): ApiLog[] {
  try {
    // @ts-ignore
    return (typeof window !== 'undefined' && window.__apiLogs) ? window.__apiLogs.slice() : [];
  } catch (_) { return []; }
}

function clearApiLogs() {
  try {
    // @ts-ignore
    if (typeof window !== 'undefined') window.__apiLogs = [];
  } catch (_) {}
}

// Prefer explicit public API URL from environment. In browser, fallback to
// window.location.origin + '/api' so Next.js apps that proxy API under same
// origin work without needing an env var. As last resort (server-side dev)
// fallback to localhost:4000/api.
export const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

async function handleResp(res: Response) {
  const text = await res.text();
  let data;
  try { data = text ? JSON.parse(text) : undefined; } catch { data = text; }
  if (!res.ok) {
    const err: any = new Error(data?.message || res.statusText || 'API error');
    err.status = res.status;
    err.body = data;
    throw err;
  }
  return data;
}

export default async function apiClient(path: string, opts?: RequestInit) {
  // resolve base URL with robust fallbacks to avoid "Failed to fetch" in prod
  const resolvedBase = API_BASE
    || (typeof window !== 'undefined' ? `${window.location.origin}/api` : 'http://localhost:4000/api');
  const url = path.startsWith('http') ? path : `${resolvedBase}${path.startsWith('/') ? '' : '/'}${path}`;

  function getAuthHeader(): Record<string,string> {
    try {
      if (typeof window === 'undefined') return {};
      const token = (localStorage.getItem('token') || '').trim();
      return token ? { Authorization: `Bearer ${token}` } : {};
    } catch (e) {
      return {};
    }
  }

  // normalize options
  const init: RequestInit = { ...(opts || {}) };

  // ensure headers object
  // include auth header from localStorage by default, but allow explicit headers in `opts` to override
  const headers = Object.assign({}, getAuthHeader(), (init.headers as Record<string,string>) || {});

  // if body is a plain object (not string / FormData / Blob), stringify it and set JSON header
  const isFormData = typeof FormData !== 'undefined' && init.body instanceof FormData;
  const isBlob = typeof Blob !== 'undefined' && init.body instanceof Blob;
  if (init.body != null && typeof init.body !== 'string' && !isFormData && !isBlob) {
      headers['Content-Type'] = headers['Content-Type'] || 'application/json';
      init.body = JSON.stringify(init.body) as unknown as BodyInit;
  } else {
      // if body already a string, don't re-stringify; ensure Content-Type if not set and body exists
      if (init.body != null && typeof init.body === 'string') {
          headers['Content-Type'] = headers['Content-Type'] || 'application/json';
      }
  }

  init.headers = headers;

  let res: Response | undefined;
  // prepare logging
  const startTs = Date.now();
  const logEntry: ApiLog = { id: String(startTs) + '-' + Math.random().toString(36).slice(2,8), ts: startTs, method: (init.method || 'GET').toString().toUpperCase(), url, reqBody: undefined };
  try {
    try { logEntry.reqBody = init.body ? (typeof init.body === 'string' ? JSON.parse(init.body as string) : init.body) : undefined; } catch (_) { logEntry.reqBody = init.body; }
    // ensure window log buffer
    try {
      // @ts-ignore
      if (typeof window !== 'undefined') window.__apiLogs = window.__apiLogs || [];
    } catch (_) {}
    // console log request
    try { console.debug('[api] ->', logEntry.method, url, logEntry.reqBody ? { body: logEntry.reqBody } : {}); } catch (_) {}

    // emit loading start (maintain a counter on window to support concurrent requests)
    try {
      if (typeof window !== 'undefined') {
        // @ts-ignore
        window.__apiLoadingCounter = (window.__apiLoadingCounter || 0) + 1;
        // @ts-ignore
        window.dispatchEvent(new CustomEvent('api-loading', { detail: { count: window.__apiLoadingCounter } }));
      }
    } catch (_) {}
    res = await fetch(url, {
      credentials: 'include',
      ...opts,
      headers,
      body: init.body,
    });
    const result = await handleResp(res);
    logEntry.resStatus = res.status;
    logEntry.resBody = result;
    logEntry.durationMs = Date.now() - startTs;
    try {
      // @ts-ignore
      if (typeof window !== 'undefined') {
        // @ts-ignore
        window.__apiLogs.push(logEntry);
        // cap logs
        // @ts-ignore
        if (window.__apiLogs.length > 200) window.__apiLogs.shift();
      }
    } catch (_) {}
    try { console.debug('[api] <-', logEntry.method, url, { status: logEntry.resStatus, durationMs: logEntry.durationMs }); } catch (_) {}
    return result;
  } catch (err: any) {
    // log error info
    try {
      if (err && (err as any).body !== undefined) {
        logEntry.resStatus = (err as any).status;
        logEntry.resBody = (err as any).body;
        logEntry.error = err.message;
      } else {
        logEntry.error = err?.message || String(err);
      }
      logEntry.durationMs = Date.now() - startTs;
      try {
        // @ts-ignore
        if (typeof window !== 'undefined') {
          // @ts-ignore
          window.__apiLogs.push(logEntry);
          // @ts-ignore
          if (window.__apiLogs.length > 200) window.__apiLogs.shift();
        }
      } catch (_) {}
      try { console.debug('[api] x<-', logEntry.method, url, { error: logEntry.error }); } catch (_) {}
    } catch (_) {}

    // If the error already comes from `handleResp` it may contain HTTP error details
    if (err && (err as any).body !== undefined) {
      try { (err as any).url = url; } catch (_) {}
      throw err;
    }
    const e: any = new Error(err?.message || 'Network error');
    e.detail = err;
    e.url = url;
    throw e;
  } finally {
    try {
      if (typeof window !== 'undefined') {
        // @ts-ignore
        window.__apiLoadingCounter = Math.max(0, (window.__apiLoadingCounter || 1) - 1);
        // @ts-ignore
        window.dispatchEvent(new CustomEvent('api-loading', { detail: { count: window.__apiLoadingCounter } }));
      }
    } catch (_) {}
  }
}

// Convenience named export compatible with existing frontend imports
export async function apiFetch(path: string, opts?: ApiOptions) {
  return apiClient(path, opts as RequestInit);
}

// Upload file using presigned URL flow (returns { key, url })
async function uploadFilePresign(file: File | Blob, opts?: { filename?: string; contentType?: string }) {
  const filename = opts?.filename || (file instanceof File ? file.name : 'file');
  const contentType = opts?.contentType || (file instanceof File ? file.type || 'application/octet-stream' : 'application/octet-stream');

  const presign = await apiFetch('/upload/presign', { method: 'POST', body: { filename, contentType } });
  if (!presign || !presign.url) throw new Error('Presign failed');

  const putRes = await fetch(presign.url, {
    method: 'PUT',
    headers: { 'Content-Type': contentType },
    body: file as BodyInit,
  });

  if (!putRes.ok) throw new Error(`Upload failed: ${putRes.status}`);
  return { key: presign.key || filename, url: presign.publicUrl || presign.url };
}

// Explicit named export list to help static analyzers resolve exports
export { uploadFilePresign, getApiLogs, clearApiLogs };
