(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/web/lib/api-client.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// lib/api-client.ts
__turbopack_context__.s([
    "default",
    ()=>apiClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/web/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
const API_BASE = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
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
    const headers = {
        'Accept': 'application/json',
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
        // Network-level error (CORS, DNS, connection refused, etc)
        const e = new Error(err.message || 'Network error');
        e.detail = err;
        e.url = url;
        throw e;
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/web/components/GanttChart.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>GanttChart
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/lib/api-client.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
const rowHeight = 44;
const labelWidth = 300;
const gutter = 12;
const minBarWidthPx = 4;
function isoToMs(val) {
    if (!val) return null;
    const n = Date.parse(val);
    return isNaN(n) ? null : n;
}
function niceTime(ms) {
    if (!ms) return '-';
    const d = new Date(ms);
    return d.toLocaleString();
}
function dateInputToDayStart(dateStr) {
    // local midnight
    return new Date(`${dateStr}T00:00:00`);
}
const WORK_TYPE_COLORS = {
    'Preventive Maintenance': '#16a34a',
    'Corrective Maintenance': '#fb923c',
    'Breakdown': '#ef4444',
    'PM': '#10b981',
    'CM': '#f97316',
    'Default': '#3b82f6'
};
const STATUS_COLORS = {
    'Draft': '#9ca3af',
    'Posted': '#06b6d4',
    'Completed': '#10b981',
    'In Progress': '#f59e0b',
    'Cancelled': '#ef4444'
};
function pickColorForWork(w) {
    const status = w.raw && (w.raw.doc_status || w.raw.status || w.raw.state) || null;
    if (status && typeof status === 'string' && STATUS_COLORS[status]) return STATUS_COLORS[status];
    const wt = (w.work_type || w.raw && (w.raw.work_type || w.raw.type_work) || '').toString();
    if (wt && WORK_TYPE_COLORS[wt]) return WORK_TYPE_COLORS[wt];
    // try shorthand
    if (wt && WORK_TYPE_COLORS[wt.toUpperCase()]) return WORK_TYPE_COLORS[wt.toUpperCase()];
    return WORK_TYPE_COLORS['Default'];
}
function GanttChart({ pageSize = 2000 }) {
    _s();
    const [items, setItems] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const todayIsoDate = new Date().toISOString().slice(0, 10);
    const [selectedDate, setSelectedDate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(todayIsoDate);
    const [scale, setScale] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(1);
    const [selected, setSelected] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const containerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [containerWidth, setContainerWidth] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(900);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "GanttChart.useEffect": ()=>{
            const el = containerRef.current;
            if (!el) return;
            setContainerWidth(el.clientWidth || 900);
            const ro = new ResizeObserver({
                "GanttChart.useEffect": ()=>setContainerWidth(el.clientWidth || 900)
            }["GanttChart.useEffect"]);
            ro.observe(el);
            return ({
                "GanttChart.useEffect": ()=>ro.disconnect()
            })["GanttChart.useEffect"];
        }
    }["GanttChart.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "GanttChart.useEffect": ()=>{
            load();
        }
    }["GanttChart.useEffect"], []);
    async function load() {
        setLoading(true);
        setError(null);
        try {
            const res = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(`/work-orders?q=&page=1&pageSize=${pageSize}`);
            const rows = res?.data ?? res;
            const mapped = (rows || []).map((r)=>({
                    ...r,
                    start_date: r.start_date ?? null,
                    end_date: r.end_date ?? null,
                    description: r.description ?? r.raw?.description ?? null
                }));
            setItems(mapped);
        } catch (err) {
            console.error('load gantt', err);
            setError(err?.body?.message || err?.message || 'Gagal memuat data');
        } finally{
            setLoading(false);
        }
    }
    const { dayStartMs, dayEndMs } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "GanttChart.useMemo": ()=>{
            const ds = dateInputToDayStart(selectedDate);
            const de = new Date(ds.getTime() + 24 * 60 * 60 * 1000);
            return {
                dayStartMs: ds.getTime(),
                dayEndMs: de.getTime()
            };
        }
    }["GanttChart.useMemo"], [
        selectedDate
    ]);
    const totalMs = 24 * 60 * 60 * 1000;
    // compute timelineWidth deterministically: use available container width minus label
    const available = Math.max(300, containerWidth - labelWidth - gutter - 20);
    const timelineWidth = available;
    const svgWidth = labelWidth + gutter + timelineWidth + 8;
    const pxPerMs = timelineWidth / totalMs * scale;
    function msToX(ms) {
        return labelWidth + gutter + Math.round((ms - dayStartMs) * pxPerMs);
    }
    function clampBarWidth(x1, x2) {
        return Math.max(minBarWidthPx, x2 - x1);
    }
    const tickStepMs = 30 * 60 * 1000;
    const ticks = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "GanttChart.useMemo[ticks]": ()=>{
            const out = [];
            const startTick = Math.floor(dayStartMs / tickStepMs) * tickStepMs;
            for(let t = startTick; t <= dayEndMs; t += tickStepMs)out.push(t);
            return out;
        }
    }["GanttChart.useMemo[ticks]"], [
        dayStartMs,
        dayEndMs
    ]);
    const validItems = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "GanttChart.useMemo[validItems]": ()=>{
            const filtered = items.filter({
                "GanttChart.useMemo[validItems].filtered": (it)=>{
                    const s = isoToMs(it.start_date);
                    const e = isoToMs(it.end_date);
                    if (s == null && e == null) return false;
                    const start = s ?? e ?? null;
                    const end = e ?? s ?? null;
                    if (start == null || end == null) return false;
                    return !(end <= dayStartMs || start >= dayEndMs);
                }
            }["GanttChart.useMemo[validItems].filtered"]);
            return filtered.sort({
                "GanttChart.useMemo[validItems]": (a, b)=>{
                    const sa = isoToMs(a.start_date) ?? 0;
                    const sb = isoToMs(b.start_date) ?? 0;
                    return sa - sb;
                }
            }["GanttChart.useMemo[validItems]"]);
        }
    }["GanttChart.useMemo[validItems]"], [
        items,
        dayStartMs,
        dayEndMs
    ]);
    const nowMs = Date.now();
    const showNow = nowMs >= dayStartMs && nowMs <= dayEndMs;
    const nowX = showNow ? msToX(nowMs) : null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            padding: 18,
            fontFamily: 'Inter, system-ui, -apple-system, Roboto, "Helvetica Neue", Arial'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    marginBottom: 12
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        style: {
                            margin: 0
                        },
                        children: "Gantt Chart — Work Orders (per-hari)"
                    }, void 0, false, {
                        fileName: "[project]/web/components/GanttChart.tsx",
                        lineNumber: 163,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            marginLeft: 'auto',
                            display: 'flex',
                            gap: 8,
                            alignItems: 'center'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                style: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 8
                                },
                                children: [
                                    "Tanggal:",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "date",
                                        value: selectedDate,
                                        onChange: (e)=>setSelectedDate(e.target.value),
                                        style: {
                                            marginLeft: 8,
                                            padding: '6px 8px',
                                            borderRadius: 6,
                                            border: '1px solid #ddd'
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/web/components/GanttChart.tsx",
                                        lineNumber: 167,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/web/components/GanttChart.tsx",
                                lineNumber: 165,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setScale((s)=>Math.max(0.5, s * 0.9)),
                                children: "Zoom -"
                            }, void 0, false, {
                                fileName: "[project]/web/components/GanttChart.tsx",
                                lineNumber: 169,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setScale((s)=>Math.min(4, s * 1.1)),
                                children: "Zoom +"
                            }, void 0, false, {
                                fileName: "[project]/web/components/GanttChart.tsx",
                                lineNumber: 170,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: load,
                                children: "Refresh"
                            }, void 0, false, {
                                fileName: "[project]/web/components/GanttChart.tsx",
                                lineNumber: 171,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/web/components/GanttChart.tsx",
                        lineNumber: 164,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/web/components/GanttChart.tsx",
                lineNumber: 162,
                columnNumber: 7
            }, this),
            loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: "Loading..."
            }, void 0, false, {
                fileName: "[project]/web/components/GanttChart.tsx",
                lineNumber: 175,
                columnNumber: 19
            }, this),
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    color: 'red'
                },
                children: error
            }, void 0, false, {
                fileName: "[project]/web/components/GanttChart.tsx",
                lineNumber: 176,
                columnNumber: 17
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                ref: containerRef,
                style: {
                    overflowX: 'auto',
                    border: '1px solid #eee',
                    borderRadius: 8
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        display: 'flex',
                        minWidth: Math.max(900, svgWidth)
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                width: labelWidth,
                                borderRight: '1px solid #f0f0f0',
                                background: '#fafafa'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        padding: '10px 12px',
                                        fontWeight: 700
                                    },
                                    children: "Work Order"
                                }, void 0, false, {
                                    fileName: "[project]/web/components/GanttChart.tsx",
                                    lineNumber: 182,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        height: 8
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/web/components/GanttChart.tsx",
                                    lineNumber: 183,
                                    columnNumber: 13
                                }, this),
                                validItems.map((w, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            height: rowHeight,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                            padding: '6px 12px',
                                            borderBottom: '1px solid #f1f1f1',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: 13,
                                                    fontWeight: 700
                                                },
                                                children: w.doc_no ?? w.id
                                            }, void 0, false, {
                                                fileName: "[project]/web/components/GanttChart.tsx",
                                                lineNumber: 196,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    marginTop: 4,
                                                    color: '#666',
                                                    fontSize: 12
                                                },
                                                children: [
                                                    w.asset_name ?? '',
                                                    " ",
                                                    w.work_type ? ` • ${w.work_type}` : ''
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/web/components/GanttChart.tsx",
                                                lineNumber: 197,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, w.id, true, {
                                        fileName: "[project]/web/components/GanttChart.tsx",
                                        lineNumber: 185,
                                        columnNumber: 15
                                    }, this))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/web/components/GanttChart.tsx",
                            lineNumber: 181,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                flex: '1 0 auto',
                                minWidth: 600,
                                position: 'relative'
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                width: svgWidth,
                                height: Math.max(140, validItems.length * rowHeight + 80),
                                children: [
                                    validItems.map((w, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                            x: labelWidth + gutter,
                                            y: idx * rowHeight + 40,
                                            width: svgWidth - labelWidth - gutter,
                                            height: rowHeight,
                                            fill: idx % 2 === 0 ? '#ffffff' : '#fbfbfb'
                                        }, 'bg' + w.id, false, {
                                            fileName: "[project]/web/components/GanttChart.tsx",
                                            lineNumber: 207,
                                            columnNumber: 17
                                        }, this)),
                                    ticks.map((t, i)=>{
                                        const x = msToX(t);
                                        const showLabel = (t - dayStartMs) % (60 * 60 * 1000) === 0; // hourly label
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                    x1: x,
                                                    y1: 30,
                                                    x2: x,
                                                    y2: 30 + Math.max(20, validItems.length * rowHeight + 40),
                                                    stroke: "#e7e7e7"
                                                }, void 0, false, {
                                                    fileName: "[project]/web/components/GanttChart.tsx",
                                                    lineNumber: 222,
                                                    columnNumber: 21
                                                }, this),
                                                showLabel && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                                    x: x + 4,
                                                    y: 20,
                                                    fontSize: 11,
                                                    fill: "#333",
                                                    children: new Date(t).toLocaleTimeString([], {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })
                                                }, void 0, false, {
                                                    fileName: "[project]/web/components/GanttChart.tsx",
                                                    lineNumber: 223,
                                                    columnNumber: 35
                                                }, this)
                                            ]
                                        }, 'tick' + i, true, {
                                            fileName: "[project]/web/components/GanttChart.tsx",
                                            lineNumber: 221,
                                            columnNumber: 19
                                        }, this);
                                    }),
                                    showNow && nowX !== null && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                            x1: nowX,
                                            y1: 30,
                                            x2: nowX,
                                            y2: 30 + Math.max(20, validItems.length * rowHeight + 40),
                                            stroke: "#8b5cf6",
                                            strokeWidth: 2,
                                            strokeDasharray: "6,4"
                                        }, void 0, false, {
                                            fileName: "[project]/web/components/GanttChart.tsx",
                                            lineNumber: 231,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/web/components/GanttChart.tsx",
                                        lineNumber: 230,
                                        columnNumber: 17
                                    }, this),
                                    validItems.map((w, idx)=>{
                                        const sMsRaw = isoToMs(w.start_date);
                                        const eMsRaw = isoToMs(w.end_date);
                                        const sMs = Math.max(sMsRaw, dayStartMs);
                                        const eMs = Math.min(eMsRaw, dayEndMs);
                                        if (!sMsRaw || !eMsRaw) return null;
                                        if (eMs <= sMs) return null;
                                        const x1 = msToX(sMs);
                                        const x2 = msToX(eMs);
                                        const width = clampBarWidth(x1, x2);
                                        const y = idx * rowHeight + 40 + 6;
                                        const rx = 6;
                                        const color = pickColorForWork(w);
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                                            style: {
                                                cursor: 'pointer'
                                            },
                                            onClick: ()=>setSelected(w),
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                    x: x1,
                                                    y: y,
                                                    rx: rx,
                                                    ry: rx,
                                                    width: width,
                                                    height: rowHeight - 12,
                                                    fill: color,
                                                    opacity: 0.98
                                                }, void 0, false, {
                                                    fileName: "[project]/web/components/GanttChart.tsx",
                                                    lineNumber: 252,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("foreignObject", {
                                                    x: x1 + 8,
                                                    y: y + 6,
                                                    width: Math.max(40, width - 16),
                                                    height: rowHeight - 24,
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        xmlns: "http://www.w3.org/1999/xhtml",
                                                        style: {
                                                            fontSize: 12,
                                                            color: '#fff',
                                                            fontWeight: 700,
                                                            lineHeight: '14px',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            whiteSpace: 'nowrap'
                                                        },
                                                        children: w.asset_name ?? w.work_type ?? ''
                                                    }, void 0, false, {
                                                        fileName: "[project]/web/components/GanttChart.tsx",
                                                        lineNumber: 254,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/web/components/GanttChart.tsx",
                                                    lineNumber: 253,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, 'bar' + w.id, true, {
                                            fileName: "[project]/web/components/GanttChart.tsx",
                                            lineNumber: 251,
                                            columnNumber: 19
                                        }, this);
                                    })
                                ]
                            }, void 0, true, {
                                fileName: "[project]/web/components/GanttChart.tsx",
                                lineNumber: 204,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/web/components/GanttChart.tsx",
                            lineNumber: 203,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/web/components/GanttChart.tsx",
                    lineNumber: 179,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/web/components/GanttChart.tsx",
                lineNumber: 178,
                columnNumber: 7
            }, this),
            selected && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: 'fixed',
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.36)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 9999
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        background: '#fff',
                        width: 720,
                        maxHeight: '80%',
                        overflowY: 'auto',
                        borderRadius: 8,
                        padding: 16
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            style: {
                                marginTop: 0
                            },
                            children: selected.doc_no
                        }, void 0, false, {
                            fileName: "[project]/web/components/GanttChart.tsx",
                            lineNumber: 273,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                    children: "Asset:"
                                }, void 0, false, {
                                    fileName: "[project]/web/components/GanttChart.tsx",
                                    lineNumber: 274,
                                    columnNumber: 18
                                }, this),
                                " ",
                                selected.asset_name
                            ]
                        }, void 0, true, {
                            fileName: "[project]/web/components/GanttChart.tsx",
                            lineNumber: 274,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                    children: "Type:"
                                }, void 0, false, {
                                    fileName: "[project]/web/components/GanttChart.tsx",
                                    lineNumber: 275,
                                    columnNumber: 18
                                }, this),
                                " ",
                                selected.work_type
                            ]
                        }, void 0, true, {
                            fileName: "[project]/web/components/GanttChart.tsx",
                            lineNumber: 275,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                    children: "Start:"
                                }, void 0, false, {
                                    fileName: "[project]/web/components/GanttChart.tsx",
                                    lineNumber: 276,
                                    columnNumber: 18
                                }, this),
                                " ",
                                niceTime(isoToMs(selected.start_date))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/web/components/GanttChart.tsx",
                            lineNumber: 276,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                    children: "End:"
                                }, void 0, false, {
                                    fileName: "[project]/web/components/GanttChart.tsx",
                                    lineNumber: 277,
                                    columnNumber: 18
                                }, this),
                                " ",
                                niceTime(isoToMs(selected.end_date))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/web/components/GanttChart.tsx",
                            lineNumber: 277,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                marginTop: 12
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
                                style: {
                                    whiteSpace: 'pre-wrap',
                                    background: '#f7f7f7',
                                    padding: 8,
                                    borderRadius: 6
                                },
                                children: selected.description ?? JSON.stringify(selected.raw ?? selected, null, 2)
                            }, void 0, false, {
                                fileName: "[project]/web/components/GanttChart.tsx",
                                lineNumber: 279,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/web/components/GanttChart.tsx",
                            lineNumber: 278,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                textAlign: 'right',
                                marginTop: 8
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setSelected(null),
                                style: {
                                    padding: '8px 12px',
                                    borderRadius: 6
                                },
                                children: "Close"
                            }, void 0, false, {
                                fileName: "[project]/web/components/GanttChart.tsx",
                                lineNumber: 282,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/web/components/GanttChart.tsx",
                            lineNumber: 281,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/web/components/GanttChart.tsx",
                    lineNumber: 272,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/web/components/GanttChart.tsx",
                lineNumber: 268,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/web/components/GanttChart.tsx",
        lineNumber: 161,
        columnNumber: 5
    }, this);
}
_s(GanttChart, "JDYr581Wk45Qw+2U8z4F6riJFYQ=");
_c = GanttChart;
var _c;
__turbopack_context__.k.register(_c, "GanttChart");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=web_0c08fd1b._.js.map