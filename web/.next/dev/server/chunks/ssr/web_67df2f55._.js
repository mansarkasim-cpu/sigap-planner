module.exports = [
"[project]/web/lib/api-client.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// lib/api-client.ts
__turbopack_context__.s([
    "default",
    ()=>apiClient
]);
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
async function handleResp(res) {
    const text = await res.text();
    let data;
    try {
        data = text ? JSON.parse(text) : undefined;
    } catch  {
        data = text;
    }
    if (!res.ok) {
        const err = new Error(data?.message || res.statusText || 'API error');
        err.status = res.status;
        err.body = data;
        throw err;
    }
    return data;
}
async function apiClient(path, opts = {}) {
    const url = path.startsWith('http') ? path : `${API_BASE}${path.startsWith('/') ? '' : '/'}${path}`;
    function getAuthHeader() {
        try {
            if ("TURBOPACK compile-time truthy", 1) return {};
            //TURBOPACK unreachable
            ;
            const token = undefined;
        } catch (e) {
            return {};
        }
    }
    const headers = {
        'Accept': 'application/json',
        ...getAuthHeader(),
        ...opts.headers || {}
    };
    let body;
    if (opts.body !== undefined) {
        headers['Content-Type'] = 'application/json';
        body = JSON.stringify(opts.body);
    }
    try {
        const res = await fetch(url, {
            credentials: 'include',
            ...opts,
            headers,
            body
        });
        return await handleResp(res);
    } catch (err) {
        // If the error already comes from `handleResp` it may contain HTTP error details
        // (status, body). Preserve those properties when rethrowing so callers can
        // inspect `err.status` / `err.body` instead of losing them behind a wrapper.
        if (err && err.body !== undefined) {
            // ensure url is available on the propagated error
            try {
                err.url = url;
            } catch (_) {}
            throw err;
        }
        // Network-level error (CORS, DNS, connection refused, etc)
        const e = new Error(err?.message || 'Network error');
        e.detail = err;
        e.url = url;
        throw e;
    }
}
}),
"[project]/web/components/WorkOrderForm.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>WorkOrderForm
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/lib/api-client.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
function WorkOrderForm({ onCreated }) {
    const [id, setId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [message, setMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    async function handleSubmit(e) {
        e.preventDefault();
        setMessage(null);
        if (!id.trim()) return setMessage('Masukkan id SIGAP');
        setLoading(true);
        try {
            const res = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])('/work-orders/add', {
                method: 'POST',
                body: {
                    id: id.trim()
                }
            });
            setMessage('Work order tersimpan: ' + (res?.data?.doc_no || res?.data?.id || 'OK'));
            setId('');
            onCreated?.();
        } catch (err) {
            console.error('add error', err);
            setMessage('Error: ' + (err.body?.detail || err.body?.message || err.message || 'gagal'));
        } finally{
            setLoading(false);
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
        onSubmit: handleSubmit,
        style: {
            display: 'flex',
            gap: 8,
            alignItems: 'center',
            marginBottom: 16
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                value: id,
                onChange: (e)=>setId(e.target.value),
                placeholder: "Masukkan id SIGAP (contoh: 1656)",
                disabled: loading,
                style: {
                    padding: '8px 10px',
                    minWidth: 260
                }
            }, void 0, false, {
                fileName: "[project]/web/components/WorkOrderForm.tsx",
                lineNumber: 32,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "submit",
                disabled: loading,
                style: {
                    padding: '8px 12px'
                },
                children: loading ? 'Mengambil...' : 'Ambil & Simpan'
            }, void 0, false, {
                fileName: "[project]/web/components/WorkOrderForm.tsx",
                lineNumber: 39,
                columnNumber: 7
            }, this),
            message && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    marginLeft: 12
                },
                children: message
            }, void 0, false, {
                fileName: "[project]/web/components/WorkOrderForm.tsx",
                lineNumber: 42,
                columnNumber: 19
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/web/components/WorkOrderForm.tsx",
        lineNumber: 31,
        columnNumber: 5
    }, this);
}
}),
"[project]/web/components/WorkOrderList.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>WorkOrderList
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/lib/api-client.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
function WorkOrderList({ onRefreshRequested }) {
    // format stored dates (possibly SQL 'YYYY-MM-DD HH:mm:ss' without timezone)
    function formatUtcDisplay(raw) {
        if (!raw) return '-';
        const s = String(raw).trim();
        // try SQL datetime 'YYYY-MM-DD HH:mm:ss' or 'YYYY-MM-DDTHH:mm:ss'
        const sqlRx = /^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2})(?::(\d{2}))?)?$/;
        const m = sqlRx.exec(s);
        let dt = null;
        if (m) {
            const [, yy, mm, dd, hh = '00', mi = '00', ss = '00'] = m;
            // Interpret stored value as UTC (no timezone conversion)
            dt = new Date(Date.UTC(Number(yy), Number(mm) - 1, Number(dd), Number(hh), Number(mi), Number(ss)));
        } else {
            // try parsing as ISO / fallback
            const parsed = new Date(s);
            if (!isNaN(parsed.getTime())) {
                // use UTC values
                dt = parsed;
            } else {
                return '-';
            }
        }
        const pad = (n)=>String(n).padStart(2, '0');
        return `${pad(dt.getUTCDate())}/${pad(dt.getUTCMonth() + 1)}/${dt.getUTCFullYear()} ${pad(dt.getUTCHours())}:${pad(dt.getUTCMinutes())}`;
    }
    const [list, setList] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [locations, setLocations] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [locationFilter, setLocationFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [statuses, setStatuses] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [statusFilter, setStatusFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [page, setPage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(1);
    const [pageSize] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(10);
    const [total, setTotal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [q, setQ] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [editing, setEditing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [editLoading, setEditLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [taskModal, setTaskModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        open: false,
        wo: null
    });
    const [technicians, setTechnicians] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [techQuery, setTechQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [selectedAssignees, setSelectedAssignees] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({});
    const [currentUser, setCurrentUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(undefined);
    async function load(p = page, query = q, location = locationFilter) {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();
            if (query) params.set('q', query);
            params.set('page', String(p));
            params.set('pageSize', String(pageSize));
            if (location) params.set('location', location);
            const res = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(`/work-orders?${params.toString()}`);
            const data = Array.isArray(res) ? res : res?.data ?? [];
            const meta = res && typeof res === 'object' && !Array.isArray(res) ? res.meta ?? {
                page: p,
                pageSize,
                total: 0
            } : {
                page: p,
                pageSize,
                total: 0
            };
            const listData = Array.isArray(data) ? data : [];
            // derive available locations from returned (unfiltered) data
            const allListData = listData;
            const locs = Array.from(new Set(allListData.map((w)=>(w.vendor_cabang ?? w.raw?.vendor_cabang ?? '').toString().trim()).filter(Boolean)));
            const sts = Array.from(new Set(allListData.map((w)=>(w.status ?? w.raw?.status ?? 'NEW').toString().trim()).filter(Boolean)));
            setStatuses(sts);
            setLocations(locs);
            // apply client-side filtering by location (case-insensitive) so filter works
            let displayed = allListData;
            console.debug('test ', allListData);
            if (location) {
                const low = location.toString().toLowerCase().trim();
                displayed = allListData.filter((w)=>{
                    const v = (w.vendor_cabang ?? w.raw?.vendor_cabang ?? '').toString().toLowerCase().trim();
                    return v === low;
                });
            }
            // apply client-side filtering by status if requested
            if (statusFilter) {
                const sf = statusFilter.toString().toLowerCase().trim();
                displayed = displayed.filter((w)=>{
                    const s = (w.status ?? w.raw?.status ?? 'NEW').toString().toLowerCase().trim();
                    return s === sf;
                });
            }
            setList(displayed);
            setTotal(typeof meta.total === 'number' ? meta.total : 0);
        } catch (err) {
            console.error('load work orders', err);
            setError(err?.body?.message || err?.message || 'Gagal memuat');
        } finally{
            setLoading(false);
        }
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        load(1, q);
        setPage(1);
    }, [
        q,
        locationFilter,
        statusFilter
    ]);
    // expose the refresh function to parent via callback (so WorkOrderForm can trigger it)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (typeof onRefreshRequested === 'function') {
            onRefreshRequested(async ()=>{
                await load(1, q, locationFilter);
                setPage(1);
            });
        }
    // we intentionally omit onRefreshRequested from deps to only register once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    function onPrev() {
        if (page > 1) {
            setPage((p)=>{
                const np = p - 1;
                load(np);
                return np;
            });
        }
    }
    function onNext() {
        const maxPage = Math.ceil(total / pageSize);
        if (page < maxPage) {
            setPage((p)=>{
                const np = p + 1;
                load(np);
                return np;
            });
        }
    }
    function openEdit(w) {
        setEditing(w);
    }
    function openTaskModal(w) {
        console.debug('[openTaskModal]');
        console.debug('workorder:', w);
        // Require start_date on work order. If missing, prompt user to fill dates first.
        if (!w.start_date) {
            alert('Work Order belum memiliki Start Date. Isi Start Date dan End Date terlebih dahulu.');
            setEditing(w);
            return;
        }
        // reset technician search and selections when opening modal
        setTechQuery('');
        setTechnicians([]);
        setSelectedAssignees({});
        setTaskModal({
            open: true,
            wo: w
        });
        // load technicians (users with role=technician) and workorder detail (assignments)
        (async ()=>{
            let filteredTechs = [];
            try {
                // determine workorder site/location (use vendor_cabang or raw.site)
                const woSiteRaw = w.vendor_cabang ?? w.raw?.vendor_cabang ?? w.raw?.site ?? '';
                const woSite = String(woSiteRaw || '').toLowerCase().trim();
                // determine assignment date/time from workorder start_date (must exist)
                // parse stored start_date robustly and interpret SQL datetimes without timezone as UTC
                const pad = (n)=>String(n).padStart(2, '0');
                function parseToUtcDate(val) {
                    if (!val) return null;
                    const s = String(val).trim();
                    const sqlRx = /^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2})(?::(\d{2}))?)?$/;
                    const m = sqlRx.exec(s);
                    if (m) {
                        const [, yy, mm, dd, hh = '00', mi = '00', ss = '00'] = m;
                        return new Date(Date.UTC(Number(yy), Number(mm) - 1, Number(dd), Number(hh), Number(mi), Number(ss)));
                    }
                    const parsed = new Date(s);
                    if (!isNaN(parsed.getTime())) return parsed;
                    return null;
                }
                const sdUtc = parseToUtcDate(String(w.start_date));
                if (!sdUtc) {
                    alert('Start Date tidak valid. Isi Start Date yang benar terlebih dahulu.');
                    setEditing(w);
                    return;
                }
                const assignDate = `${sdUtc.getUTCFullYear()}-${pad(sdUtc.getUTCMonth() + 1)}-${pad(sdUtc.getUTCDate())}`;
                const assignTime = `${pad(sdUtc.getUTCHours())}:${pad(sdUtc.getUTCMinutes())}`;
                console.debug('[openTaskModal] assignDate/time (local)', {
                    assignDate,
                    assignTime,
                    raw: w.start_date
                });
                const schedUrl = `/scheduled-technicians?date=${encodeURIComponent(assignDate)}&time=${encodeURIComponent(assignTime)}` + (woSite ? `&site=${encodeURIComponent(woSite)}` : '');
                console.debug(schedUrl);
                try {
                    console.debug('[openTaskModal] fetching scheduled technicians', {
                        schedUrl
                    });
                    const sched = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(schedUrl);
                    console.debug(sched);
                    const schedRows = Array.isArray(sched) ? sched : sched?.data ?? [];
                    console.debug('[openTaskModal] scheduled-technicians response', {
                        count: Array.isArray(schedRows) ? schedRows.length : 0
                    });
                    if (schedRows && schedRows.length > 0) {
                        filteredTechs = schedRows;
                        console.debug('[openTaskModal] using scheduled-technicians sample', schedRows.slice(0, 5));
                    } else {
                        // fallback: load site-filtered technicians
                        // console.log('[openTaskModal] scheduled-technicians empty — falling back to /users?role=technician');
                        // const techs = await apiClient('/users?role=technician');
                        // const list = Array.isArray(techs) ? techs : (techs?.data ?? []);
                        // console.log('[openTaskModal] /users?role=technician response', { count: Array.isArray(list) ? list.length : 0 });
                        // if (woSite) {
                        //   filteredTechs = list.filter((t: any) => {
                        //     const tSite = String(t.site ?? t.vendor_cabang ?? t.location ?? '').toLowerCase().trim();
                        //     return tSite === woSite;
                        //   });
                        //   console.log('[openTaskModal] after site-filtering technicians', { count: filteredTechs.length });
                        // } else {
                        //   filteredTechs = list;
                        // }
                        filteredTechs = schedRows;
                    }
                } catch (e) {
                    console.warn('scheduled-technicians fetch failed, falling back', e);
                    const techs = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])('/users?role=technician');
                    const list = Array.isArray(techs) ? techs : techs?.data ?? [];
                    console.debug('[openTaskModal] fallback /users?role=technician response', {
                        count: Array.isArray(list) ? list.length : 0
                    });
                    filteredTechs = list;
                }
                console.debug('[openTaskModal] final filteredTechs', {
                    count: filteredTechs.length,
                    sample: filteredTechs.slice(0, 5)
                });
                setTechnicians(filteredTechs);
            } catch (e) {
                console.warn('Failed to load technicians from shift assignments', e);
                setTechnicians([]);
                filteredTechs = [];
            }
            // load full workorder detail to get existing assignments and tasks
            try {
                const res = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(`/work-orders/${encodeURIComponent(w.id)}`);
                const woDetail = res?.data ?? res;
                // load tasks for this work order (fallback to raw.activities if no tasks)
                try {
                    console.debug('[openTaskModal] fetching tasks for workorder', {
                        workOrderId: w.id
                    });
                    const tasksRes = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(`/work-orders/${encodeURIComponent(w.id)}/tasks`);
                    const tasks = Array.isArray(tasksRes) ? tasksRes : tasksRes?.data ?? [];
                    console.debug('[openTaskModal] tasks fetch result', {
                        count: Array.isArray(tasks) ? tasks.length : 0,
                        sample: tasks.slice(0, 5)
                    });
                    // attach tasks to woDetail for modal rendering
                    woDetail.tasks = tasks;
                } catch (e) {
                    console.debug('[openTaskModal] /tasks fetch failed, falling back to raw.activities', e);
                    // fallback: map raw.activities -> tasks for display
                    const acts = Array.isArray(woDetail.raw?.activities) ? woDetail.raw.activities : [];
                    woDetail.tasks = acts.map((act, idx)=>({
                            id: `raw-${idx}`,
                            name: act.task_name || act.name || `Task ${idx + 1}`,
                            duration_min: act.task_duration
                        }));
                }
                // update modal workorder with full details (assignments)
                setTaskModal({
                    open: true,
                    wo: woDetail
                });
                // build selectedAssignees from task.assignments for each task (tasks came from /work-orders/:id/tasks)
                const nextSelected = {};
                const taskRows = Array.isArray(woDetail.tasks) ? woDetail.tasks : [];
                // only pre-check assignments whose assignee is present in the filtered technician list
                const techIds = new Set((Array.isArray(filteredTechs) ? filteredTechs : []).map((t)=>String(t.id)));
                console.debug('[openTaskModal] building selectedAssignees from task.assignments', {
                    taskCount: taskRows.length,
                    techIdsCount: techIds.size
                });
                for (const t of taskRows){
                    const key = String(t.id ?? t.task_id ?? t.external_id ?? '');
                    if (!key) continue;
                    const assigns = Array.isArray(t.assignments) ? t.assignments : [];
                    const keeps = [];
                    for (const a of assigns){
                        const assId = String(a?.user?.id ?? a.user_id ?? a.userId ?? '');
                        if (!assId) continue;
                        if (!techIds.has(assId)) {
                            console.debug('[openTaskModal] skipping assignment because assignee not in filtered technicians', {
                                assId,
                                key
                            });
                            continue;
                        }
                        if (!keeps.includes(assId)) keeps.push(assId);
                    }
                    if (keeps.length > 0) nextSelected[key] = keeps;
                }
                console.debug('[openTaskModal] selectedAssignees prepared', nextSelected);
                setSelectedAssignees(nextSelected);
            } catch (err) {
                console.warn('Failed to load workorder detail', err);
            }
            // load current user info (auth status)
            try {
                const me = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])('/auth/me');
                setCurrentUser(me?.data ?? me);
            } catch (err) {
                // if unauthorized or error, mark as not authenticated
                setCurrentUser(null);
            }
        })();
    }
    function closeTaskModal() {
        setTaskModal({
            open: false,
            wo: null
        });
        // reset tech query so checklist isn't filtered on next open
        setTechQuery('');
        // refresh work order list so changes made in the modal are reflected
        try {
            load(page, q);
        } catch (e) {
            console.warn('Failed to refresh work order list after closing modal', e);
        }
    }
    async function saveEdit(id, start_date, end_date) {
        setEditLoading(true);
        try {
            const body = {};
            if (start_date !== undefined) body.start_date = start_date || null;
            if (end_date !== undefined) body.end_date = end_date || null;
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(`/work-orders/${encodeURIComponent(id)}`, {
                method: 'PATCH',
                body
            });
            load(page, q);
            setEditing(null);
        } catch (err) {
            console.error('save edit', err);
            alert('Gagal menyimpan: ' + (err?.body?.message || err?.message));
        } finally{
            setEditLoading(false);
        }
    }
    function toInputDatetime(iso) {
        if (!iso) return '';
        const d = new Date(iso);
        if (isNaN(d.getTime())) return '';
        const pad = (n)=>String(n).padStart(2, '0');
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    }
    function parseDdMMyyyyToIso(input) {
        if (!input) return null;
        const s = input.toString().trim();
        // expect 'dd/mm/yyyy HH:MM' or 'dd/mm/yyyy'
        const rx = /^(\d{2})\/(\d{2})\/(\d{4})(?:[ T](\d{2}):(\d{2}))?$/;
        const m = rx.exec(s);
        if (!m) return null;
        const dd = parseInt(m[1], 10);
        const mm = parseInt(m[2], 10);
        const yyyy = parseInt(m[3], 10);
        const hh = m[4] ? parseInt(m[4], 10) : 0;
        const mi = m[5] ? parseInt(m[5], 10) : 0;
        const dt = new Date(Date.UTC(yyyy, mm - 1, dd, hh, mi, 0));
        if (isNaN(dt.getTime())) return null;
        return dt.toISOString();
    }
    function getColorForStatus(s) {
        const k = (s || '').toString().toUpperCase();
        switch(k){
            case 'ASSIGNED':
                return '#0ea5e9'; // blue
            case 'DEPLOYED':
                return '#06b6d4'; // teal
            case 'READY_TO_DEPLOY':
                return '#7c3aed'; // purple
            case 'IN_PROGRESS':
                return '#f97316'; // orange
            case 'IN-PROGRESS':
                return '#f97316';
            case 'COMPLETED':
                return '#10b981'; // green
            case 'NEW':
                return '#64748b'; // gray
            case 'OPEN':
                return '#64748b';
            case 'CANCELLED':
                return '#ef4444';
            case 'CLOSED':
                return '#334155';
            default:
                return '#6b7280';
        }
    }
    function shouldShowAssignColumn(wo) {
        const s = (wo?.status ?? wo?.raw?.status ?? '').toString().toUpperCase().replace(/[-\s]/g, '_');
        return !(s === 'IN_PROGRESS' || s === 'COMPLETED');
    }
    function renderStatusBadge(s) {
        const color = getColorForStatus(s);
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            style: {
                display: 'inline-block',
                padding: '4px 8px',
                borderRadius: 999,
                background: color,
                color: 'white',
                fontSize: 12,
                fontWeight: 600
            },
            children: String(s).replace('_', ' ')
        }, void 0, false, {
            fileName: "[project]/web/components/WorkOrderList.tsx",
            lineNumber: 390,
            columnNumber: 7
        }, this);
    }
    async function handleDeploy(woId) {
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(`/work-orders/${encodeURIComponent(woId)}/deploy`, {
                method: 'POST'
            });
            // refresh modal and list
            const woRes = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(`/work-orders/${encodeURIComponent(woId)}`);
            const woDetail = woRes?.data ?? woRes;
            const tasksRes = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(`/work-orders/${encodeURIComponent(woId)}/tasks`);
            const tasks = Array.isArray(tasksRes) ? tasksRes : tasksRes?.data ?? [];
            setTaskModal((prev)=>({
                    ...prev || {},
                    wo: {
                        ...prev?.wo || {},
                        ...woDetail,
                        tasks
                    }
                }));
            load(page, q);
        } catch (e) {
            console.error('deploy failed', e);
            alert('Deploy gagal: ' + (e?.message || e));
        }
    }
    async function handleUndeploy(woId) {
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(`/work-orders/${encodeURIComponent(woId)}/undeploy`, {
                method: 'POST'
            });
            const woRes = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(`/work-orders/${encodeURIComponent(woId)}`);
            const woDetail = woRes?.data ?? woRes;
            const tasksRes = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(`/work-orders/${encodeURIComponent(woId)}/tasks`);
            const tasks = Array.isArray(tasksRes) ? tasksRes : tasksRes?.data ?? [];
            setTaskModal((prev)=>({
                    ...prev || {},
                    wo: {
                        ...prev?.wo || {},
                        ...woDetail,
                        tasks
                    }
                }));
            load(page, q);
        } catch (e) {
            console.error('undeploy failed', e);
            alert('Undeploy gagal: ' + (e?.message || e));
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    gap: 8,
                    marginBottom: 12,
                    alignItems: 'center'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                        value: locationFilter,
                        onChange: (e)=>{
                            setLocationFilter(e.target.value);
                        },
                        style: {
                            padding: 8
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: "",
                                children: "Semua Lokasi"
                            }, void 0, false, {
                                fileName: "[project]/web/components/WorkOrderList.tsx",
                                lineNumber: 431,
                                columnNumber: 11
                            }, this),
                            locations.map((loc)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: loc,
                                    children: loc
                                }, loc, false, {
                                    fileName: "[project]/web/components/WorkOrderList.tsx",
                                    lineNumber: 433,
                                    columnNumber: 13
                                }, this))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/web/components/WorkOrderList.tsx",
                        lineNumber: 430,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                        value: statusFilter,
                        onChange: (e)=>{
                            setStatusFilter(e.target.value);
                        },
                        style: {
                            padding: 8
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: "",
                                children: "Semua Status"
                            }, void 0, false, {
                                fileName: "[project]/web/components/WorkOrderList.tsx",
                                lineNumber: 438,
                                columnNumber: 11
                            }, this),
                            statuses.map((s)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: s,
                                    children: s
                                }, s, false, {
                                    fileName: "[project]/web/components/WorkOrderList.tsx",
                                    lineNumber: 440,
                                    columnNumber: 13
                                }, this))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/web/components/WorkOrderList.tsx",
                        lineNumber: 437,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        placeholder: "Search doc_no / asset / desc",
                        value: q,
                        onChange: (e)=>setQ(e.target.value),
                        style: {
                            flex: 1,
                            padding: 8
                        }
                    }, void 0, false, {
                        fileName: "[project]/web/components/WorkOrderList.tsx",
                        lineNumber: 444,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>load(1, q),
                        disabled: loading,
                        style: {
                            padding: '8px 12px'
                        },
                        children: "Search"
                    }, void 0, false, {
                        fileName: "[project]/web/components/WorkOrderList.tsx",
                        lineNumber: 445,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/web/components/WorkOrderList.tsx",
                lineNumber: 429,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    marginBottom: 8
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>load(1, q),
                        disabled: loading,
                        children: "Refresh"
                    }, void 0, false, {
                        fileName: "[project]/web/components/WorkOrderList.tsx",
                        lineNumber: 449,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            marginLeft: 12
                        },
                        children: [
                            total,
                            " item"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/web/components/WorkOrderList.tsx",
                        lineNumber: 450,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/web/components/WorkOrderList.tsx",
                lineNumber: 448,
                columnNumber: 7
            }, this),
            loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: "Loading..."
            }, void 0, false, {
                fileName: "[project]/web/components/WorkOrderList.tsx",
                lineNumber: 453,
                columnNumber: 18
            }, this) : null,
            error ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    color: 'red'
                },
                children: error
            }, void 0, false, {
                fileName: "[project]/web/components/WorkOrderList.tsx",
                lineNumber: 454,
                columnNumber: 16
            }, this) : null,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    overflowX: 'auto'
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                    style: {
                        width: '100%',
                        borderCollapse: 'collapse'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        style: {
                                            textAlign: 'left',
                                            padding: 8,
                                            borderBottom: '1px solid #ccc'
                                        },
                                        children: "Doc No"
                                    }, void 0, false, {
                                        fileName: "[project]/web/components/WorkOrderList.tsx",
                                        lineNumber: 460,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        style: {
                                            textAlign: 'left',
                                            padding: 8,
                                            borderBottom: '1px solid #ccc'
                                        },
                                        children: "Jenis Work Order"
                                    }, void 0, false, {
                                        fileName: "[project]/web/components/WorkOrderList.tsx",
                                        lineNumber: 461,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        style: {
                                            textAlign: 'left',
                                            padding: 8,
                                            borderBottom: '1px solid #ccc'
                                        },
                                        children: "Start"
                                    }, void 0, false, {
                                        fileName: "[project]/web/components/WorkOrderList.tsx",
                                        lineNumber: 462,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        style: {
                                            textAlign: 'left',
                                            padding: 8,
                                            borderBottom: '1px solid #ccc'
                                        },
                                        children: "End"
                                    }, void 0, false, {
                                        fileName: "[project]/web/components/WorkOrderList.tsx",
                                        lineNumber: 463,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        style: {
                                            textAlign: 'left',
                                            padding: 8,
                                            borderBottom: '1px solid #ccc'
                                        },
                                        children: "Asset"
                                    }, void 0, false, {
                                        fileName: "[project]/web/components/WorkOrderList.tsx",
                                        lineNumber: 464,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        style: {
                                            textAlign: 'left',
                                            padding: 8,
                                            borderBottom: '1px solid #ccc'
                                        },
                                        children: "Status"
                                    }, void 0, false, {
                                        fileName: "[project]/web/components/WorkOrderList.tsx",
                                        lineNumber: 465,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        style: {
                                            textAlign: 'left',
                                            padding: 8,
                                            borderBottom: '1px solid #ccc'
                                        },
                                        children: "Location"
                                    }, void 0, false, {
                                        fileName: "[project]/web/components/WorkOrderList.tsx",
                                        lineNumber: 466,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        style: {
                                            textAlign: 'left',
                                            padding: 8,
                                            borderBottom: '1px solid #ccc'
                                        },
                                        children: "Desc"
                                    }, void 0, false, {
                                        fileName: "[project]/web/components/WorkOrderList.tsx",
                                        lineNumber: 467,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        style: {
                                            textAlign: 'left',
                                            padding: 8,
                                            borderBottom: '1px solid #ccc'
                                        },
                                        children: "Progress"
                                    }, void 0, false, {
                                        fileName: "[project]/web/components/WorkOrderList.tsx",
                                        lineNumber: 468,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        style: {
                                            textAlign: 'left',
                                            padding: 8,
                                            borderBottom: '1px solid #ccc'
                                        },
                                        children: "Action"
                                    }, void 0, false, {
                                        fileName: "[project]/web/components/WorkOrderList.tsx",
                                        lineNumber: 469,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/web/components/WorkOrderList.tsx",
                                lineNumber: 459,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/web/components/WorkOrderList.tsx",
                            lineNumber: 458,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                            children: list.map((w)=>{
                                const activities = w.raw?.activities ?? [];
                                const statusRaw = (w.status ?? w.raw?.status ?? 'NEW').toString();
                                const statusNorm = statusRaw.toUpperCase().replace(/[-\s]/g, '_');
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            style: {
                                                padding: 8,
                                                borderBottom: '1px solid #eee'
                                            },
                                            children: w.doc_no ?? w.id
                                        }, void 0, false, {
                                            fileName: "[project]/web/components/WorkOrderList.tsx",
                                            lineNumber: 479,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            style: {
                                                padding: 8,
                                                borderBottom: '1px solid #eee'
                                            },
                                            children: w.work_type ?? w.type_work ?? w.raw?.work_type ?? w.raw?.type_work ?? '-'
                                        }, void 0, false, {
                                            fileName: "[project]/web/components/WorkOrderList.tsx",
                                            lineNumber: 480,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            style: {
                                                padding: 8,
                                                borderBottom: '1px solid #eee'
                                            },
                                            children: formatUtcDisplay(w.start_date)
                                        }, void 0, false, {
                                            fileName: "[project]/web/components/WorkOrderList.tsx",
                                            lineNumber: 481,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            style: {
                                                padding: 8,
                                                borderBottom: '1px solid #eee'
                                            },
                                            children: formatUtcDisplay(w.end_date)
                                        }, void 0, false, {
                                            fileName: "[project]/web/components/WorkOrderList.tsx",
                                            lineNumber: 482,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            style: {
                                                padding: 8,
                                                borderBottom: '1px solid #eee'
                                            },
                                            children: w.asset_name ?? '-'
                                        }, void 0, false, {
                                            fileName: "[project]/web/components/WorkOrderList.tsx",
                                            lineNumber: 483,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            style: {
                                                padding: 8,
                                                borderBottom: '1px solid #eee'
                                            },
                                            children: renderStatusBadge(w.status ?? w.raw?.status ?? 'NEW')
                                        }, void 0, false, {
                                            fileName: "[project]/web/components/WorkOrderList.tsx",
                                            lineNumber: 484,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            style: {
                                                padding: 8,
                                                borderBottom: '1px solid #eee'
                                            },
                                            children: w.vendor_cabang ?? w.raw?.vendor_cabang ?? '-'
                                        }, void 0, false, {
                                            fileName: "[project]/web/components/WorkOrderList.tsx",
                                            lineNumber: 487,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            style: {
                                                padding: 8,
                                                borderBottom: '1px solid #eee',
                                                maxWidth: 200,
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            },
                                            children: w.description ?? '-'
                                        }, void 0, false, {
                                            fileName: "[project]/web/components/WorkOrderList.tsx",
                                            lineNumber: 488,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            style: {
                                                padding: 8,
                                                borderBottom: '1px solid #eee',
                                                width: 160
                                            },
                                            children: statusNorm === 'IN_PROGRESS' && typeof w.progress === 'number' ? (()=>{
                                                const prog = Math.max(0, Math.min(1, w.progress || 0));
                                                const statusColor = getColorForStatus(statusRaw);
                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        gap: 6
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            style: {
                                                                fontSize: 12,
                                                                fontWeight: 700
                                                            },
                                                            children: [
                                                                Math.round(prog * 100),
                                                                "%"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/web/components/WorkOrderList.tsx",
                                                            lineNumber: 496,
                                                            columnNumber: 29
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            style: {
                                                                height: 10,
                                                                background: '#f1f5f9',
                                                                borderRadius: 6,
                                                                overflow: 'hidden'
                                                            },
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    width: `${Math.round(prog * 100)}%`,
                                                                    height: '100%',
                                                                    background: statusColor
                                                                }
                                                            }, void 0, false, {
                                                                fileName: "[project]/web/components/WorkOrderList.tsx",
                                                                lineNumber: 498,
                                                                columnNumber: 31
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/web/components/WorkOrderList.tsx",
                                                            lineNumber: 497,
                                                            columnNumber: 29
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/web/components/WorkOrderList.tsx",
                                                    lineNumber: 495,
                                                    columnNumber: 27
                                                }, this);
                                            })() : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    color: '#777'
                                                },
                                                children: "-"
                                            }, void 0, false, {
                                                fileName: "[project]/web/components/WorkOrderList.tsx",
                                                lineNumber: 504,
                                                columnNumber: 23
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/web/components/WorkOrderList.tsx",
                                            lineNumber: 489,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            style: {
                                                padding: 8,
                                                borderBottom: '1px solid #eee',
                                                display: 'flex',
                                                gap: 6
                                            },
                                            children: [
                                                Array.isArray(activities) && activities.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>openTaskModal(w),
                                                    style: {
                                                        padding: '4px 8px',
                                                        fontSize: '0.9em'
                                                    },
                                                    children: [
                                                        "Lihat Task (",
                                                        activities.length,
                                                        ")"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/web/components/WorkOrderList.tsx",
                                                    lineNumber: 509,
                                                    columnNumber: 23
                                                }, this),
                                                !(statusNorm === 'IN_PROGRESS' || statusNorm === 'COMPLETED' || statusNorm === 'DEPLOYED') && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>openEdit(w),
                                                    style: {
                                                        padding: '4px 8px',
                                                        fontSize: '0.9em'
                                                    },
                                                    children: "Edit Dates"
                                                }, void 0, false, {
                                                    fileName: "[project]/web/components/WorkOrderList.tsx",
                                                    lineNumber: 514,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/web/components/WorkOrderList.tsx",
                                            lineNumber: 507,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, w.id, true, {
                                    fileName: "[project]/web/components/WorkOrderList.tsx",
                                    lineNumber: 478,
                                    columnNumber: 17
                                }, this);
                            })
                        }, void 0, false, {
                            fileName: "[project]/web/components/WorkOrderList.tsx",
                            lineNumber: 472,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/web/components/WorkOrderList.tsx",
                    lineNumber: 457,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/web/components/WorkOrderList.tsx",
                lineNumber: 456,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    marginTop: 12,
                    display: 'flex',
                    gap: 8,
                    alignItems: 'center'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: onPrev,
                        disabled: page <= 1,
                        children: "Prev"
                    }, void 0, false, {
                        fileName: "[project]/web/components/WorkOrderList.tsx",
                        lineNumber: 525,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            "Page ",
                            page,
                            " / ",
                            Math.max(1, Math.ceil(total / pageSize))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/web/components/WorkOrderList.tsx",
                        lineNumber: 526,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: onNext,
                        disabled: page >= Math.max(1, Math.ceil(total / pageSize)),
                        children: "Next"
                    }, void 0, false, {
                        fileName: "[project]/web/components/WorkOrderList.tsx",
                        lineNumber: 527,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/web/components/WorkOrderList.tsx",
                lineNumber: 524,
                columnNumber: 7
            }, this),
            taskModal.open && taskModal.wo && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: 'fixed',
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 2000,
                    padding: 16
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        background: 'white',
                        padding: 16,
                        width: '95%',
                        maxWidth: 900,
                        borderRadius: 8,
                        maxHeight: '86vh',
                        overflow: 'auto',
                        boxShadow: '0 6px 30px rgba(0,0,0,0.2)'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start',
                                gap: 12,
                                marginBottom: 12
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        flex: 1
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            style: {
                                                marginTop: 0,
                                                marginBottom: 6,
                                                fontSize: 20
                                            },
                                            children: [
                                                "Task - ",
                                                taskModal.wo.doc_no ?? taskModal.wo.id
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/web/components/WorkOrderList.tsx",
                                            lineNumber: 539,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                color: '#666',
                                                fontSize: 13
                                            },
                                            children: taskModal.wo.description
                                        }, void 0, false, {
                                            fileName: "[project]/web/components/WorkOrderList.tsx",
                                            lineNumber: 540,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/web/components/WorkOrderList.tsx",
                                    lineNumber: 538,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        textAlign: 'right',
                                        minWidth: 180
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                fontSize: 13,
                                                marginBottom: 8
                                            },
                                            children: currentUser === undefined ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    color: '#666'
                                                },
                                                children: "Checking auth..."
                                            }, void 0, false, {
                                                fileName: "[project]/web/components/WorkOrderList.tsx",
                                                lineNumber: 545,
                                                columnNumber: 21
                                            }, this) : currentUser === null ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    color: '#c00'
                                                },
                                                children: "Not authenticated"
                                            }, void 0, false, {
                                                fileName: "[project]/web/components/WorkOrderList.tsx",
                                                lineNumber: 547,
                                                columnNumber: 21
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            fontWeight: 700
                                                        },
                                                        children: currentUser.name || currentUser.username || currentUser.email
                                                    }, void 0, false, {
                                                        fileName: "[project]/web/components/WorkOrderList.tsx",
                                                        lineNumber: 550,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            color: '#666',
                                                            fontSize: 12
                                                        },
                                                        children: [
                                                            currentUser.email,
                                                            " — ",
                                                            currentUser.role ?? currentUser.type
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/web/components/WorkOrderList.tsx",
                                                        lineNumber: 551,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/web/components/WorkOrderList.tsx",
                                                lineNumber: 549,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/web/components/WorkOrderList.tsx",
                                            lineNumber: 543,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                display: 'flex',
                                                gap: 8,
                                                justifyContent: 'flex-end'
                                            },
                                            children: [
                                                taskModal.wo?.status === 'READY_TO_DEPLOY' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>handleDeploy(taskModal.wo.id),
                                                    style: {
                                                        padding: '6px 10px',
                                                        background: '#7c3aed',
                                                        color: 'white',
                                                        borderRadius: 6
                                                    },
                                                    children: "Deploy"
                                                }, void 0, false, {
                                                    fileName: "[project]/web/components/WorkOrderList.tsx",
                                                    lineNumber: 557,
                                                    columnNumber: 21
                                                }, this),
                                                taskModal.wo?.status === 'DEPLOYED' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>handleUndeploy(taskModal.wo.id),
                                                    style: {
                                                        padding: '6px 10px',
                                                        background: '#ef4444',
                                                        color: 'white',
                                                        borderRadius: 6
                                                    },
                                                    children: "Undeploy"
                                                }, void 0, false, {
                                                    fileName: "[project]/web/components/WorkOrderList.tsx",
                                                    lineNumber: 560,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: closeTaskModal,
                                                    style: {
                                                        padding: '6px 10px'
                                                    },
                                                    children: "Close"
                                                }, void 0, false, {
                                                    fileName: "[project]/web/components/WorkOrderList.tsx",
                                                    lineNumber: 562,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/web/components/WorkOrderList.tsx",
                                            lineNumber: 555,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/web/components/WorkOrderList.tsx",
                                    lineNumber: 542,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/web/components/WorkOrderList.tsx",
                            lineNumber: 537,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                marginBottom: 8
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                style: {
                                    width: '100%',
                                    borderCollapse: 'collapse',
                                    tableLayout: 'fixed'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("colgroup", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("col", {
                                                style: {
                                                    width: '50px'
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/web/components/WorkOrderList.tsx",
                                                lineNumber: 570,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("col", {}, void 0, false, {
                                                fileName: "[project]/web/components/WorkOrderList.tsx",
                                                lineNumber: 571,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("col", {
                                                style: {
                                                    width: '110px'
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/web/components/WorkOrderList.tsx",
                                                lineNumber: 572,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("col", {
                                                style: {
                                                    width: '340px'
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/web/components/WorkOrderList.tsx",
                                                lineNumber: 573,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/web/components/WorkOrderList.tsx",
                                        lineNumber: 569,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                            style: {
                                                background: '#f5f5f5'
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    style: {
                                                        textAlign: 'left',
                                                        padding: 12,
                                                        borderBottom: '1px solid #ddd'
                                                    },
                                                    children: "No"
                                                }, void 0, false, {
                                                    fileName: "[project]/web/components/WorkOrderList.tsx",
                                                    lineNumber: 577,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    style: {
                                                        textAlign: 'left',
                                                        padding: 12,
                                                        borderBottom: '1px solid #ddd'
                                                    },
                                                    children: "Task Name"
                                                }, void 0, false, {
                                                    fileName: "[project]/web/components/WorkOrderList.tsx",
                                                    lineNumber: 578,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    style: {
                                                        textAlign: 'left',
                                                        padding: 12,
                                                        borderBottom: '1px solid #ddd',
                                                        textAlignLast: 'right'
                                                    },
                                                    children: "Duration (min)"
                                                }, void 0, false, {
                                                    fileName: "[project]/web/components/WorkOrderList.tsx",
                                                    lineNumber: 579,
                                                    columnNumber: 21
                                                }, this),
                                                shouldShowAssignColumn(taskModal.wo) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    style: {
                                                        textAlign: 'left',
                                                        padding: 12,
                                                        borderBottom: '1px solid #ddd'
                                                    },
                                                    children: "Assign technicians"
                                                }, void 0, false, {
                                                    fileName: "[project]/web/components/WorkOrderList.tsx",
                                                    lineNumber: 581,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/web/components/WorkOrderList.tsx",
                                            lineNumber: 576,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/web/components/WorkOrderList.tsx",
                                        lineNumber: 575,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                        children: Array.isArray(taskModal.wo.tasks) && taskModal.wo.tasks.map((act, idx)=>{
                                            const taskKey = act.id ?? act.task_id ?? String(idx);
                                            const selected = selectedAssignees[taskKey] || [];
                                            // robust detection for whether task has realisasi
                                            function taskHasRealisasi(t) {
                                                try {
                                                    // 1) task-local explicit lists (common patterns)
                                                    const lists = [
                                                        'realisasi',
                                                        'realisasis',
                                                        'realisasi_list',
                                                        'realisasi_entries',
                                                        'realisasiItems',
                                                        'realisasi_items',
                                                        'realisasiEntries'
                                                    ];
                                                    for (const k of lists){
                                                        const v = t[k];
                                                        if (Array.isArray(v) && v.length > 0) return true;
                                                    }
                                                    // 2) assignment records that are attached directly to the task (if present)
                                                    if (Array.isArray(t.assignments)) {
                                                        for (const a of t.assignments){
                                                            if (Array.isArray(a.realisasi) && a.realisasi.length > 0) return true;
                                                            if ((a.realisasi_count || a.realisasiCount || a.realisasiTotal) > 0) return true;
                                                            const s = (a.status || a.state || '').toString().toUpperCase();
                                                            if (s.includes('COMP') || s.includes('VERIF') || s.includes('DONE') || s.includes('APPROV')) return true;
                                                        }
                                                    }
                                                    // 3) workorder-level assignments: some data models store realisasi on a separate `assignment` table
                                                    const woAssigns = Array.isArray(taskModal.wo?.assignments) ? taskModal.wo.assignments : [];
                                                    if (woAssigns.length > 0) {
                                                        for (const a of woAssigns){
                                                            // match by explicit task_id first, then by name fallback
                                                            const aTaskId = a.task_id ?? a.taskId ?? a.task?.id ? String(a.task_id ?? a.taskId ?? a.task?.id) : null;
                                                            const tId = t.id ?? t.task_id ?? t.external_id ? String(t.id ?? t.task_id ?? t.external_id) : null;
                                                            if (aTaskId && tId && aTaskId === tId) {
                                                                if (Array.isArray(a.realisasi) && a.realisasi.length > 0) return true;
                                                                if ((a.realisasi_count || a.realisasiCount || a.realisasiTotal) > 0) return true;
                                                                const s = (a.status || a.state || '').toString().toUpperCase();
                                                                if (s.includes('COMP') || s.includes('VERIF') || s.includes('DONE') || s.includes('APPROV')) return true;
                                                            }
                                                            // name-based fallback (older rows)
                                                            const aName = (a.task_name || a.taskName || a.task?.name || '').toString().trim().toLowerCase();
                                                            const tName = (t.name || t.task_name || t.taskName || '').toString().trim().toLowerCase();
                                                            if (aName && tName && aName === tName) {
                                                                if (Array.isArray(a.realisasi) && a.realisasi.length > 0) return true;
                                                                if ((a.realisasi_count || a.realisasiCount || a.realisasiTotal) > 0) return true;
                                                                const s2 = (a.status || a.state || '').toString().toUpperCase();
                                                                if (s2.includes('COMP') || s2.includes('VERIF') || s2.includes('DONE') || s2.includes('APPROV')) return true;
                                                            }
                                                        }
                                                    }
                                                    // 4) task-level flags and timestamps
                                                    if (t.completed === true || t.is_completed === true || String(t.status || '').toUpperCase().includes('COMP')) return true;
                                                    if (t.completed_at || t.realisasi_at || t.approved_at) return true;
                                                } catch (e) {
                                                // ignore
                                                }
                                                return false;
                                            }
                                            const hasRealisasi = taskHasRealisasi(act) || Boolean(act.has_realisasi || act.realisasi_count);
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                style: {
                                                    borderBottom: '1px solid #f1f1f1'
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        style: {
                                                            padding: 12,
                                                            verticalAlign: 'top'
                                                        },
                                                        children: act.task_number ?? idx + 1
                                                    }, void 0, false, {
                                                        fileName: "[project]/web/components/WorkOrderList.tsx",
                                                        lineNumber: 645,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        style: {
                                                            padding: 12,
                                                            verticalAlign: 'top'
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    display: 'flex',
                                                                    gap: 8,
                                                                    alignItems: 'center'
                                                                },
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        style: {
                                                                            fontWeight: 700
                                                                        },
                                                                        children: act.name ?? act.task_name ?? '-'
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/web/components/WorkOrderList.tsx",
                                                                        lineNumber: 648,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    hasRealisasi ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        style: {
                                                                            background: '#10b981',
                                                                            color: 'white',
                                                                            padding: '2px 8px',
                                                                            borderRadius: 999,
                                                                            fontSize: 12,
                                                                            fontWeight: 600
                                                                        },
                                                                        children: "Realisasi ✓"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/web/components/WorkOrderList.tsx",
                                                                        lineNumber: 650,
                                                                        columnNumber: 31
                                                                    }, this) : (()=>{
                                                                        const pendingCount = Number(act.pending_realisasi_count || act.pendingCount || 0);
                                                                        const hasPending = Boolean(act.has_pending || pendingCount > 0);
                                                                        if (hasPending) {
                                                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                style: {
                                                                                    background: '#f59e0b',
                                                                                    color: 'white',
                                                                                    padding: '2px 8px',
                                                                                    borderRadius: 999,
                                                                                    fontSize: 12,
                                                                                    fontWeight: 600
                                                                                },
                                                                                children: [
                                                                                    "Pending",
                                                                                    pendingCount ? ` (${pendingCount})` : ''
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/web/components/WorkOrderList.tsx",
                                                                                lineNumber: 656,
                                                                                columnNumber: 42
                                                                            }, this);
                                                                        }
                                                                        // explicit 'Belum Realisasi' state when neither realisasi nor pending exist
                                                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            style: {
                                                                                background: '#64748b',
                                                                                color: 'white',
                                                                                padding: '2px 8px',
                                                                                borderRadius: 999,
                                                                                fontSize: 12,
                                                                                fontWeight: 600
                                                                            },
                                                                            children: "Belum Realisasi"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/web/components/WorkOrderList.tsx",
                                                                            lineNumber: 659,
                                                                            columnNumber: 40
                                                                        }, this);
                                                                    })()
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/web/components/WorkOrderList.tsx",
                                                                lineNumber: 647,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    fontSize: 12,
                                                                    color: '#888',
                                                                    marginTop: 6
                                                                },
                                                                children: [
                                                                    "ID: ",
                                                                    act.id ?? '-'
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/web/components/WorkOrderList.tsx",
                                                                lineNumber: 663,
                                                                columnNumber: 27
                                                            }, this),
                                                            Array.isArray(act.assignments) && act.assignments.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    marginTop: 8,
                                                                    display: 'flex',
                                                                    gap: 8,
                                                                    flexWrap: 'wrap'
                                                                },
                                                                children: act.assignments.map((asgn)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        style: {
                                                                            background: '#eef2ff',
                                                                            padding: '4px 8px',
                                                                            borderRadius: 6,
                                                                            display: 'flex',
                                                                            gap: 8,
                                                                            alignItems: 'center'
                                                                        },
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                style: {
                                                                                    fontSize: 13,
                                                                                    fontWeight: 600
                                                                                },
                                                                                children: asgn.user?.name ?? asgn.user?.nipp ?? asgn.user?.email ?? asgn.assigned_to ?? 'Unknown'
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/web/components/WorkOrderList.tsx",
                                                                                lineNumber: 669,
                                                                                columnNumber: 35
                                                                            }, this),
                                                                            currentUser && ![
                                                                                'DEPLOYED',
                                                                                'IN_PROGRESS'
                                                                            ].includes((taskModal.wo?.status ?? '').toString()) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                onClick: async ()=>{
                                                                                    try {
                                                                                        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(`/tasks/${encodeURIComponent(act.id)}/assign/${encodeURIComponent(asgn.id)}`, {
                                                                                            method: 'DELETE'
                                                                                        });
                                                                                    } catch (err) {
                                                                                        // some servers expect /tasks/:id/assign/:assignId via task routes; try that as fallback
                                                                                        try {
                                                                                            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(`/tasks/${encodeURIComponent(act.id)}/assign/${encodeURIComponent(asgn.id)}`, {
                                                                                                method: 'DELETE'
                                                                                            });
                                                                                        } catch (e) {
                                                                                            console.error('unassign failed', e);
                                                                                            alert('Unassign failed');
                                                                                            return;
                                                                                        }
                                                                                    }
                                                                                    // refresh workorder detail and tasks for this workorder
                                                                                    try {
                                                                                        const woRes = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(`/work-orders/${encodeURIComponent(taskModal.wo?.id)}`);
                                                                                        const woDetail = woRes?.data ?? woRes;
                                                                                        const tasksRes = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(`/work-orders/${encodeURIComponent(taskModal.wo?.id)}/tasks`);
                                                                                        const tasks = Array.isArray(tasksRes) ? tasksRes : tasksRes?.data ?? [];
                                                                                        setTaskModal((prev)=>({
                                                                                                ...prev || {},
                                                                                                wo: {
                                                                                                    ...prev?.wo || {},
                                                                                                    ...woDetail,
                                                                                                    tasks
                                                                                                }
                                                                                            }));
                                                                                    } catch (e) {
                                                                                        console.warn('refresh workorder after unassign failed', e);
                                                                                    }
                                                                                },
                                                                                style: {
                                                                                    background: 'transparent',
                                                                                    border: 'none',
                                                                                    color: '#c00',
                                                                                    cursor: 'pointer'
                                                                                },
                                                                                children: "Unassign"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/web/components/WorkOrderList.tsx",
                                                                                lineNumber: 671,
                                                                                columnNumber: 37
                                                                            }, this)
                                                                        ]
                                                                    }, asgn.id, true, {
                                                                        fileName: "[project]/web/components/WorkOrderList.tsx",
                                                                        lineNumber: 668,
                                                                        columnNumber: 33
                                                                    }, this))
                                                            }, void 0, false, {
                                                                fileName: "[project]/web/components/WorkOrderList.tsx",
                                                                lineNumber: 666,
                                                                columnNumber: 29
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/web/components/WorkOrderList.tsx",
                                                        lineNumber: 646,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        style: {
                                                            padding: 12,
                                                            verticalAlign: 'top',
                                                            textAlign: 'right'
                                                        },
                                                        children: act.duration_min ?? act.task_duration ?? '-'
                                                    }, void 0, false, {
                                                        fileName: "[project]/web/components/WorkOrderList.tsx",
                                                        lineNumber: 695,
                                                        columnNumber: 25
                                                    }, this),
                                                    shouldShowAssignColumn(taskModal.wo) ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        style: {
                                                            padding: 12,
                                                            verticalAlign: 'top'
                                                        },
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            style: {
                                                                display: 'flex',
                                                                flexDirection: 'column',
                                                                gap: 8
                                                            },
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    placeholder: "Cari teknisi (nama / email / id)",
                                                                    value: techQuery,
                                                                    onChange: (e)=>setTechQuery(e.target.value),
                                                                    style: {
                                                                        width: '100%',
                                                                        padding: 8,
                                                                        border: '1px solid #eee',
                                                                        borderRadius: 6
                                                                    }
                                                                }, void 0, false, {
                                                                    fileName: "[project]/web/components/WorkOrderList.tsx",
                                                                    lineNumber: 699,
                                                                    columnNumber: 31
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    style: {
                                                                        maxHeight: '36vh',
                                                                        minHeight: 120,
                                                                        overflowY: 'auto',
                                                                        overflowX: 'hidden',
                                                                        border: '1px solid #eee',
                                                                        padding: 8,
                                                                        borderRadius: 6,
                                                                        background: '#fff'
                                                                    },
                                                                    children: (()=>{
                                                                        const q = (techQuery || '').toString().toLowerCase().trim();
                                                                        const filtered = technicians.filter((t)=>{
                                                                            if (!q) return true;
                                                                            const name = (t.name || '').toString().toLowerCase();
                                                                            const email = (t.email || '').toString().toLowerCase();
                                                                            const idS = (t.id || '').toString().toLowerCase();
                                                                            return name.includes(q) || email.includes(q) || idS.includes(q);
                                                                        });
                                                                        if (!filtered || filtered.length === 0) {
                                                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                style: {
                                                                                    color: '#666',
                                                                                    fontSize: 13,
                                                                                    padding: 8
                                                                                },
                                                                                children: "No technicians found"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/web/components/WorkOrderList.tsx",
                                                                                lineNumber: 717,
                                                                                columnNumber: 44
                                                                            }, this);
                                                                        }
                                                                        return filtered.map((t)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                                style: {
                                                                                    display: 'flex',
                                                                                    gap: 8,
                                                                                    alignItems: 'center',
                                                                                    padding: '6px 4px',
                                                                                    borderRadius: 4
                                                                                },
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                        type: "checkbox",
                                                                                        checked: selected.includes(t.id),
                                                                                        onChange: (e)=>{
                                                                                            const next = new Set(selected);
                                                                                            if (e.target.checked) next.add(t.id);
                                                                                            else next.delete(t.id);
                                                                                            setSelectedAssignees((prev)=>({
                                                                                                    ...prev,
                                                                                                    [taskKey]: Array.from(next)
                                                                                                }));
                                                                                        }
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/web/components/WorkOrderList.tsx",
                                                                                        lineNumber: 721,
                                                                                        columnNumber: 39
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                        style: {
                                                                                            fontSize: 13
                                                                                        },
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                style: {
                                                                                                    fontWeight: 700
                                                                                                },
                                                                                                children: t.name || t.nipp || t.email
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/web/components/WorkOrderList.tsx",
                                                                                                lineNumber: 727,
                                                                                                columnNumber: 41
                                                                                            }, this),
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                style: {
                                                                                                    fontSize: 12,
                                                                                                    color: '#666'
                                                                                                },
                                                                                                children: [
                                                                                                    t.nipp || '',
                                                                                                    " ",
                                                                                                    t.email ? `• ${t.email}` : ''
                                                                                                ]
                                                                                            }, void 0, true, {
                                                                                                fileName: "[project]/web/components/WorkOrderList.tsx",
                                                                                                lineNumber: 728,
                                                                                                columnNumber: 41
                                                                                            }, this)
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/web/components/WorkOrderList.tsx",
                                                                                        lineNumber: 726,
                                                                                        columnNumber: 39
                                                                                    }, this)
                                                                                ]
                                                                            }, t.id, true, {
                                                                                fileName: "[project]/web/components/WorkOrderList.tsx",
                                                                                lineNumber: 720,
                                                                                columnNumber: 37
                                                                            }, this));
                                                                    })()
                                                                }, void 0, false, {
                                                                    fileName: "[project]/web/components/WorkOrderList.tsx",
                                                                    lineNumber: 706,
                                                                    columnNumber: 31
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    style: {
                                                                        display: 'flex',
                                                                        gap: 8,
                                                                        justifyContent: 'flex-start'
                                                                    },
                                                                    children: currentUser === undefined ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        disabled: true,
                                                                        style: {
                                                                            opacity: 0.7
                                                                        },
                                                                        children: "Checking..."
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/web/components/WorkOrderList.tsx",
                                                                        lineNumber: 737,
                                                                        columnNumber: 35
                                                                    }, this) : currentUser === null ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                onClick: ()=>{
                                                                                    window.location.href = '/login';
                                                                                },
                                                                                style: {
                                                                                    background: '#2b7cff',
                                                                                    color: 'white'
                                                                                },
                                                                                children: "Login to assign"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/web/components/WorkOrderList.tsx",
                                                                                lineNumber: 740,
                                                                                columnNumber: 37
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                onClick: ()=>{
                                                                                    setSelectedAssignees((prev)=>({
                                                                                            ...prev,
                                                                                            [taskKey]: []
                                                                                        }));
                                                                                },
                                                                                children: "Clear"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/web/components/WorkOrderList.tsx",
                                                                                lineNumber: 741,
                                                                                columnNumber: 37
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true) : ![
                                                                        'DEPLOYED',
                                                                        'IN_PROGRESS'
                                                                    ].includes((taskModal.wo?.status ?? '').toString()) ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                onClick: async ()=>{
                                                                                    const ass = selectedAssignees[taskKey] || [];
                                                                                    if (!ass || ass.length === 0) {
                                                                                        alert('Pilih minimal 1 teknisi');
                                                                                        return;
                                                                                    }
                                                                                    try {
                                                                                        const unique = Array.from(new Set(ass));
                                                                                        for (const uid of unique){
                                                                                            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(`/tasks/${encodeURIComponent(act.id ?? act.task_id ?? String(idx))}/assign`, {
                                                                                                method: 'POST',
                                                                                                body: {
                                                                                                    userId: uid,
                                                                                                    assignedBy: currentUser?.id
                                                                                                }
                                                                                            });
                                                                                        }
                                                                                        alert('Assignment created');
                                                                                        try {
                                                                                            const woRes = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(`/work-orders/${encodeURIComponent(taskModal.wo?.id)}`);
                                                                                            const woDetail = woRes?.data ?? woRes;
                                                                                            const tasksRes = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(`/work-orders/${encodeURIComponent(taskModal.wo?.id)}/tasks`);
                                                                                            const tasks = Array.isArray(tasksRes) ? tasksRes : tasksRes?.data ?? [];
                                                                                            setTaskModal((prev)=>({
                                                                                                    ...prev || {},
                                                                                                    wo: {
                                                                                                        ...prev?.wo || {},
                                                                                                        ...woDetail,
                                                                                                        tasks
                                                                                                    }
                                                                                                }));
                                                                                        } catch (e) {
                                                                                            console.warn('refresh tasks after assign failed', e);
                                                                                        }
                                                                                        load(page, q);
                                                                                    } catch (err) {
                                                                                        console.error('assign error', err);
                                                                                        alert(err?.body?.message || err?.message || 'Assignment failed');
                                                                                    }
                                                                                },
                                                                                children: "Assign"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/web/components/WorkOrderList.tsx",
                                                                                lineNumber: 745,
                                                                                columnNumber: 37
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                onClick: ()=>{
                                                                                    setSelectedAssignees((prev)=>({
                                                                                            ...prev,
                                                                                            [taskKey]: []
                                                                                        }));
                                                                                },
                                                                                children: "Clear"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/web/components/WorkOrderList.tsx",
                                                                                lineNumber: 767,
                                                                                columnNumber: 37
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        disabled: true,
                                                                        style: {
                                                                            opacity: 0.6
                                                                        },
                                                                        children: "Deployed"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/web/components/WorkOrderList.tsx",
                                                                        lineNumber: 770,
                                                                        columnNumber: 35
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/web/components/WorkOrderList.tsx",
                                                                    lineNumber: 735,
                                                                    columnNumber: 31
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/web/components/WorkOrderList.tsx",
                                                            lineNumber: 698,
                                                            columnNumber: 29
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/web/components/WorkOrderList.tsx",
                                                        lineNumber: 697,
                                                        columnNumber: 27
                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        style: {
                                                            padding: 12,
                                                            verticalAlign: 'top'
                                                        }
                                                    }, void 0, false, {
                                                        fileName: "[project]/web/components/WorkOrderList.tsx",
                                                        lineNumber: 776,
                                                        columnNumber: 27
                                                    }, this)
                                                ]
                                            }, idx, true, {
                                                fileName: "[project]/web/components/WorkOrderList.tsx",
                                                lineNumber: 644,
                                                columnNumber: 23
                                            }, this);
                                        })
                                    }, void 0, false, {
                                        fileName: "[project]/web/components/WorkOrderList.tsx",
                                        lineNumber: 585,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/web/components/WorkOrderList.tsx",
                                lineNumber: 568,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/web/components/WorkOrderList.tsx",
                            lineNumber: 567,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/web/components/WorkOrderList.tsx",
                    lineNumber: 536,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/web/components/WorkOrderList.tsx",
                lineNumber: 532,
                columnNumber: 9
            }, this),
            editing && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: 'fixed',
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.4)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        background: 'white',
                        padding: 20,
                        width: 480,
                        borderRadius: 8
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            children: [
                                "Edit Dates — ",
                                editing.doc_no ?? editing.id
                            ]
                        }, void 0, true, {
                            fileName: "[project]/web/components/WorkOrderList.tsx",
                            lineNumber: 795,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 8
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    children: [
                                        "Start Date & Time (dd/mm/yyyy HH24:mi)",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "text",
                                            defaultValue: formatUtcDisplay(editing.start_date),
                                            id: "startInput",
                                            placeholder: "dd/mm/yyyy HH:MM",
                                            style: {
                                                width: '100%',
                                                padding: 6,
                                                marginTop: 4
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/web/components/WorkOrderList.tsx",
                                            lineNumber: 800,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                fontSize: 12,
                                                color: '#666',
                                                marginTop: 6
                                            },
                                            children: [
                                                "Current: ",
                                                formatUtcDisplay(editing.start_date)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/web/components/WorkOrderList.tsx",
                                            lineNumber: 801,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/web/components/WorkOrderList.tsx",
                                    lineNumber: 798,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    children: [
                                        "End Date & Time (dd/mm/yyyy HH24:mi)",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "text",
                                            defaultValue: formatUtcDisplay(editing.end_date),
                                            id: "endInput",
                                            placeholder: "dd/mm/yyyy HH:MM",
                                            style: {
                                                width: '100%',
                                                padding: 6,
                                                marginTop: 4
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/web/components/WorkOrderList.tsx",
                                            lineNumber: 806,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                fontSize: 12,
                                                color: '#666',
                                                marginTop: 6
                                            },
                                            children: [
                                                "Current: ",
                                                formatUtcDisplay(editing.end_date)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/web/components/WorkOrderList.tsx",
                                            lineNumber: 807,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/web/components/WorkOrderList.tsx",
                                    lineNumber: 804,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/web/components/WorkOrderList.tsx",
                            lineNumber: 797,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                marginTop: 12,
                                display: 'flex',
                                justifyContent: 'flex-end',
                                gap: 8
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setEditing(null),
                                    disabled: editLoading,
                                    children: "Cancel"
                                }, void 0, false, {
                                    fileName: "[project]/web/components/WorkOrderList.tsx",
                                    lineNumber: 812,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>{
                                        const startVal = document.getElementById('startInput').value;
                                        const endVal = document.getElementById('endInput').value;
                                        const sIso = startVal ? parseDdMMyyyyToIso(startVal) : null;
                                        const eIso = endVal ? parseDdMMyyyyToIso(endVal) : null;
                                        if (startVal && !sIso || endVal && !eIso) {
                                            alert('Tanggal tidak valid. Gunakan format dd/mm/yyyy HH:MM');
                                            return;
                                        }
                                        saveEdit(editing.id, sIso, eIso);
                                    },
                                    disabled: editLoading,
                                    children: editLoading ? 'Saving...' : 'Save'
                                }, void 0, false, {
                                    fileName: "[project]/web/components/WorkOrderList.tsx",
                                    lineNumber: 813,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/web/components/WorkOrderList.tsx",
                            lineNumber: 811,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/web/components/WorkOrderList.tsx",
                    lineNumber: 794,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/web/components/WorkOrderList.tsx",
                lineNumber: 790,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/web/components/WorkOrderList.tsx",
        lineNumber: 428,
        columnNumber: 5
    }, this);
}
}),
"[project]/web/app/work-orders/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Page
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$components$2f$WorkOrderForm$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/components/WorkOrderForm.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$components$2f$WorkOrderList$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/components/WorkOrderList.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
'use client';
;
;
;
;
function Page() {
    // expose refresh function from list via ref
    const refreshRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const WorkOrderListAny = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$components$2f$WorkOrderList$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        style: {
            padding: 24,
            fontFamily: 'Inter, system-ui, -apple-system, Roboto, "Helvetica Neue", Arial'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                style: {
                    marginBottom: 12
                },
                children: "Work Orders"
            }, void 0, false, {
                fileName: "[project]/web/app/work-orders/page.tsx",
                lineNumber: 14,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                style: {
                    marginBottom: 20
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$components$2f$WorkOrderForm$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                    onCreated: ()=>refreshRef.current?.()
                }, void 0, false, {
                    fileName: "[project]/web/app/work-orders/page.tsx",
                    lineNumber: 17,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/web/app/work-orders/page.tsx",
                lineNumber: 16,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(WorkOrderListAny, {
                    onRefreshRequested: (fn)=>{
                        return refreshRef.current = fn;
                    }
                }, void 0, false, {
                    fileName: "[project]/web/app/work-orders/page.tsx",
                    lineNumber: 21,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/web/app/work-orders/page.tsx",
                lineNumber: 20,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/web/app/work-orders/page.tsx",
        lineNumber: 13,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=web_67df2f55._.js.map