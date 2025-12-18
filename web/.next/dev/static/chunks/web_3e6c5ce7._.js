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
"[project]/web/components/GanttCombined.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>GanttCombined
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/lib/api-client.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$moment$2f$moment$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/moment/moment.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
// color mapping for bars
const BAR_COLORS = {
    PM: '#4ade80',
    CM: '#fb923c',
    BD: '#ef4444',
    DEFAULT: '#60a5fa'
};
// badge colors
const STATUS_COLORS = {
    'Waiting For Submitted': '#84cc16',
    'Waiting For Submit Running': '#f97316',
    'Waiting For Approval': '#3b82f6',
    'Work Order Completed': '#10b981',
    'Waiting For Good Issue': '#fde047',
    'Waiting For Input Realization': '#8b5cf6',
    DEFAULT: '#e5e7eb'
};
// utility color selector
function chooseBarColor(type = '') {
    if (!type) return BAR_COLORS.DEFAULT;
    const key = type.toUpperCase();
    if (key.includes('PM')) return BAR_COLORS.PM;
    if (key.includes('CM')) return BAR_COLORS.CM;
    if (key.includes('BD') || key.includes('BREAK')) return BAR_COLORS.BD;
    return BAR_COLORS.DEFAULT;
}
function chooseStatusColor(status = '') {
    if (!status) return STATUS_COLORS.DEFAULT;
    const s = status.trim();
    return STATUS_COLORS[s] ?? STATUS_COLORS.DEFAULT;
}
function GanttCombined() {
    _s();
    const leftRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const rightRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [rows, setRows] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [selectedDate, setSelectedDate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$moment$2f$moment$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])().format('YYYY-MM-DD'));
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "GanttCombined.useEffect": ()=>{
            loadRows();
        }
    }["GanttCombined.useEffect"], []);
    async function loadRows() {
        setLoading(true);
        try {
            const res = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(`/work-orders?page=1&pageSize=2000`);
            const data = res?.data ?? [];
            const mapped = data.map((r)=>{
                const sd = r.start_date ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$moment$2f$moment$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(r.start_date) : null;
                const ed = r.end_date ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$moment$2f$moment$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(r.end_date) : null;
                let duration = null;
                if (sd && ed) duration = ed.diff(sd, 'hours');
                return {
                    id: r.id,
                    doc_no: r.doc_no ?? '',
                    asset_name: r.asset_name ?? '',
                    work_type: r.work_type ?? r.raw?.work_type ?? '',
                    status: r.raw?.doc_status ?? '',
                    start_date: r.start_date,
                    end_date: r.end_date,
                    duration_hour: duration,
                    raw: r
                };
            });
            setRows(mapped);
        } finally{
            setLoading(false);
        }
    }
    // sync scroll left & right
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "GanttCombined.useEffect": ()=>{
            const L = leftRef.current;
            const R = rightRef.current;
            if (!L || !R) return;
            const handler = {
                "GanttCombined.useEffect.handler": ()=>{
                    R.scrollTop = L.scrollTop;
                }
            }["GanttCombined.useEffect.handler"];
            L.addEventListener('scroll', handler);
            return ({
                "GanttCombined.useEffect": ()=>L.removeEventListener('scroll', handler)
            })["GanttCombined.useEffect"];
        }
    }["GanttCombined.useEffect"], []);
    const hours = Array.from({
        length: 24
    }, (_, i)=>i);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            display: 'flex',
            height: '80vh',
            border: '1px solid #e5e7eb',
            borderRadius: 12,
            overflow: 'hidden'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                ref: leftRef,
                style: {
                    width: '320px',
                    overflowY: 'auto',
                    background: '#fafafa',
                    borderRight: '1px solid #eee'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            padding: '16px',
                            borderBottom: '1px solid #e5e7eb',
                            background: '#fff'
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            style: {
                                margin: 0
                            },
                            children: "WO Number"
                        }, void 0, false, {
                            fileName: "[project]/web/components/GanttCombined.tsx",
                            lineNumber: 120,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/web/components/GanttCombined.tsx",
                        lineNumber: 119,
                        columnNumber: 9
                    }, this),
                    rows.map((r, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                padding: '12px 16px',
                                minHeight: 80,
                                borderBottom: '1px solid #eee'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        fontWeight: 600
                                    },
                                    children: r.doc_no
                                }, void 0, false, {
                                    fileName: "[project]/web/components/GanttCombined.tsx",
                                    lineNumber: 127,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        fontSize: '0.85rem',
                                        color: '#555'
                                    },
                                    children: r.asset_name
                                }, void 0, false, {
                                    fileName: "[project]/web/components/GanttCombined.tsx",
                                    lineNumber: 131,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        display: 'inline-block',
                                        marginTop: 6,
                                        padding: '3px 10px',
                                        borderRadius: 20,
                                        fontSize: '0.75rem',
                                        color: '#fff',
                                        background: chooseStatusColor(r.status)
                                    },
                                    children: r.status || 'Unknown'
                                }, void 0, false, {
                                    fileName: "[project]/web/components/GanttCombined.tsx",
                                    lineNumber: 136,
                                    columnNumber: 13
                                }, this),
                                r.duration_hour != null && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        marginTop: 6,
                                        fontSize: '0.8rem',
                                        color: '#333'
                                    },
                                    children: [
                                        "Realization: ",
                                        r.duration_hour,
                                        " h"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/web/components/GanttCombined.tsx",
                                    lineNumber: 150,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, r.id, true, {
                            fileName: "[project]/web/components/GanttCombined.tsx",
                            lineNumber: 125,
                            columnNumber: 11
                        }, this))
                ]
            }, void 0, true, {
                fileName: "[project]/web/components/GanttCombined.tsx",
                lineNumber: 116,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            height: 50,
                            borderBottom: '1px solid #eee',
                            display: 'flex',
                            alignItems: 'center',
                            paddingLeft: 10,
                            background: '#fff'
                        },
                        children: hours.map((h)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    width: `${100 / 24}%`,
                                    textAlign: 'center',
                                    fontSize: '0.8rem'
                                },
                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$moment$2f$moment$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])().hour(h).format('HH.00')
                            }, h, false, {
                                fileName: "[project]/web/components/GanttCombined.tsx",
                                lineNumber: 166,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/web/components/GanttCombined.tsx",
                        lineNumber: 164,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        ref: rightRef,
                        style: {
                            flex: 1,
                            overflowY: 'auto',
                            position: 'relative'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    display: 'flex'
                                },
                                children: hours.map((h)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            flex: 1,
                                            borderLeft: '1px solid #f1f1f1'
                                        }
                                    }, h, false, {
                                        fileName: "[project]/web/components/GanttCombined.tsx",
                                        lineNumber: 178,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/web/components/GanttCombined.tsx",
                                lineNumber: 176,
                                columnNumber: 11
                            }, this),
                            (()=>{
                                const now = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$moment$2f$moment$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])();
                                const selectedStart = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$moment$2f$moment$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(selectedDate + ' 00:00');
                                const selectedEnd = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$moment$2f$moment$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(selectedDate + ' 23:59');
                                if (now.isBetween(selectedStart, selectedEnd)) {
                                    const hour = now.hour() + now.minute() / 60;
                                    const leftPct = hour / 24 * 100;
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            position: 'absolute',
                                            top: 0,
                                            bottom: 0,
                                            left: `${leftPct}%`,
                                            borderLeft: '2px dashed purple',
                                            zIndex: 5
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/web/components/GanttCombined.tsx",
                                        lineNumber: 192,
                                        columnNumber: 17
                                    }, this);
                                }
                                return null;
                            })(),
                            rows.map((r, idx)=>{
                                const s = r.start_date ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$moment$2f$moment$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(r.start_date) : null;
                                const e = r.end_date ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$moment$2f$moment$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(r.end_date) : null;
                                if (!s || !e) return null;
                                const startHour = s.hour() + s.minute() / 60;
                                const endHour = e.hour() + e.minute() / 60;
                                const leftPct = startHour / 24 * 100;
                                const widthPct = (endHour - startHour) / 24 * 100;
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        position: 'relative',
                                        height: 80,
                                        borderBottom: '1px solid #f5f5f5'
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            position: 'absolute',
                                            top: '22px',
                                            left: `${leftPct}%`,
                                            width: `${widthPct}%`,
                                            height: '36px',
                                            background: chooseBarColor(r.work_type || ''),
                                            borderRadius: 18,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: '#fff',
                                            fontWeight: 600,
                                            fontSize: '0.8rem',
                                            zIndex: 3,
                                            boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
                                        },
                                        children: r.doc_no
                                    }, void 0, false, {
                                        fileName: "[project]/web/components/GanttCombined.tsx",
                                        lineNumber: 220,
                                        columnNumber: 17
                                    }, this)
                                }, r.id, false, {
                                    fileName: "[project]/web/components/GanttCombined.tsx",
                                    lineNumber: 217,
                                    columnNumber: 15
                                }, this);
                            })
                        ]
                    }, void 0, true, {
                        fileName: "[project]/web/components/GanttCombined.tsx",
                        lineNumber: 173,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/web/components/GanttCombined.tsx",
                lineNumber: 161,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/web/components/GanttCombined.tsx",
        lineNumber: 113,
        columnNumber: 5
    }, this);
}
_s(GanttCombined, "dQSj+WUKfJ0ZmeUgfh57Aj0Mr0Y=");
_c = GanttCombined;
var _c;
__turbopack_context__.k.register(_c, "GanttCombined");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=web_3e6c5ce7._.js.map