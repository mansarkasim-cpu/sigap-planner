export const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

function getAuthHeader() {
  const token = (typeof window !== "undefined" && localStorage.getItem("token")) || "";
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * Generic API fetch wrapper.
 * - auto-prefixes API_BASE
 * - sets JSON headers unless body is FormData
 */
export async function apiFetch(path, options = {}) {
  const url = path.startsWith("http") ? path : `${API_BASE}${path.startsWith("/") ? "" : "/"}${path}`;
  const headers = Object.assign({}, getAuthHeader(), options.headers || {});

  const init = Object.assign({}, options);

  // don't override Content-Type for FormData
  if (!(init.body instanceof FormData)) {
    headers["Accept"] = "application/json";
    if (init.body && typeof init.body === "object") {
      headers["Content-Type"] = "application/json";
      init.body = JSON.stringify(init.body);
    }
  }

  init.headers = headers;

  const res = await fetch(url, init);
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }
  if (!res.ok) {
    const err = new Error(data?.message || `Request failed: ${res.status}`);
    err.status = res.status;
    err.payload = data;
    throw err;
  }
  return data;
}

/**
 * Upload file using presigned URL flow:
 * 1) request presigned URL from backend
 * 2) PUT file to presigned URL
 * Returns { key, url }
 */
export async function uploadFilePresign(file, opts = {}) {
  const filename = opts.filename || file.name;
  const contentType = opts.contentType || file.type || "application/octet-stream";

  const presign = await apiFetch("/upload/presign", {
    method: "POST",
    body: { filename, contentType },
  });

  if (!presign || !presign.url) throw new Error("Presign failed");

  // Direct upload to S3-compatible presigned URL
  const putRes = await fetch(presign.url, {
    method: "PUT",
    headers: {
      "Content-Type": contentType,
      // Some providers require x-amz-acl etc; presign should include policy
    },
    body: file,
  });

  if (!putRes.ok) throw new Error(`Upload failed: ${putRes.status}`);

  return { key: presign.key || filename, url: presign.publicUrl || presign.url };
}