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
"[project]/web/components/TimelineGantt.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>TimelineGantt
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$react$2d$calendar$2d$timeline$2f$dist$2f$react$2d$calendar$2d$timeline$2e$es$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/react-calendar-timeline/dist/react-calendar-timeline.es.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$moment$2f$moment$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/moment/moment.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/lib/api-client.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
// import 'react-calendar-timeline/lib/Timeline.css';
if (typeof document !== "undefined" && !document.querySelector('link[href*="react-calendar-timeline"]')) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/react-calendar-timeline@0.30.0/lib/Timeline.css";
    document.head.appendChild(link);
}
;
;
function pickColorForWork(w) {
    const wt = (w.work_type || w.raw && (w.raw.work_type || w.raw.type_work) || '').toString().toLowerCase();
    const status = (w.raw && (w.raw.doc_status || w.raw.status || w.raw.state) || '').toString().toLowerCase();
    if (status.includes('completed')) return '#10b981';
    if (status.includes('draft')) return '#9ca3af';
    if (wt.includes('preventive') || wt === 'pm') return '#16a34a';
    if (wt.includes('corrective') || wt === 'cm') return '#f97316';
    if (wt.includes('breakdown') || wt.includes('failure')) return '#ef4444';
    return '#3b82f6';
}
function TimelineGantt({ pageSize = 2000 }) {
    _s();
    const [itemsRaw, setItemsRaw] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [selectedDate, setSelectedDate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$moment$2f$moment$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])().format('YYYY-MM-DD'));
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [selectedItem, setSelectedItem] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const refTimeline = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TimelineGantt.useEffect": ()=>{
            load();
        }
    }["TimelineGantt.useEffect"], []);
    async function load() {
        setLoading(true);
        try {
            const res = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(`/work-orders?q=&page=1&pageSize=${pageSize}`);
            const rows = res?.data ?? res;
            const mapped = (rows || []).map((r)=>({
                    ...r,
                    start_date: r.start_date ?? null,
                    end_date: r.end_date ?? null,
                    description: r.description ?? r.raw?.description ?? '',
                    status: (r.raw && (r.raw.doc_status || r.raw.status || r.raw.state)) ?? null
                }));
            setItemsRaw(mapped);
        } catch (err) {
            console.error('load timeline', err);
        } finally{
            setLoading(false);
        }
    }
    // day window (local)
    const dayStart = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "TimelineGantt.useMemo[dayStart]": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$moment$2f$moment$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(selectedDate + ' 00:00:00')
    }["TimelineGantt.useMemo[dayStart]"], [
        selectedDate
    ]);
    const visibleTimeStart = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "TimelineGantt.useMemo[visibleTimeStart]": ()=>dayStart.valueOf()
    }["TimelineGantt.useMemo[visibleTimeStart]"], [
        dayStart
    ]);
    const visibleTimeEnd = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "TimelineGantt.useMemo[visibleTimeEnd]": ()=>dayStart.clone().add(24, 'hours').valueOf()
    }["TimelineGantt.useMemo[visibleTimeEnd]"], [
        dayStart
    ]);
    // groups: each WO its own group (y-axis) — we want ordering by start_date ascending
    const groups = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "TimelineGantt.useMemo[groups]": ()=>{
            // filter items intersecting day and sort by start_date
            const filtered = itemsRaw.filter({
                "TimelineGantt.useMemo[groups].filtered": (i)=>{
                    const s = i.start_date ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$moment$2f$moment$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(i.start_date).valueOf() : null;
                    const e = i.end_date ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$moment$2f$moment$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(i.end_date).valueOf() : null;
                    if (!s && !e) return false;
                    const start = s ?? e;
                    const end = e ?? s;
                    return !(end <= visibleTimeStart || start >= visibleTimeEnd);
                }
            }["TimelineGantt.useMemo[groups].filtered"]).sort({
                "TimelineGantt.useMemo[groups].filtered": (a, b)=>{
                    const sa = a.start_date ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$moment$2f$moment$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(a.start_date).valueOf() : 0;
                    const sb = b.start_date ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$moment$2f$moment$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(b.start_date).valueOf() : 0;
                    return sa - sb;
                }
            }["TimelineGantt.useMemo[groups].filtered"]);
            return filtered.map({
                "TimelineGantt.useMemo[groups]": (it, idx)=>({
                        id: it.id,
                        title: `${it.doc_no ?? it.id} — ${it.asset_name ?? ''}`,
                        index: idx
                    })
            }["TimelineGantt.useMemo[groups]"]);
        }
    }["TimelineGantt.useMemo[groups]"], [
        itemsRaw,
        visibleTimeStart,
        visibleTimeEnd
    ]);
    // items for timeline: clamp to day window
    const items = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "TimelineGantt.useMemo[items]": ()=>{
            const map = new Map(groups.map({
                "TimelineGantt.useMemo[items]": (g)=>[
                        g.id,
                        g
                    ]
            }["TimelineGantt.useMemo[items]"]));
            const arr = [];
            groups.forEach({
                "TimelineGantt.useMemo[items]": (g)=>{
                    const it = itemsRaw.find({
                        "TimelineGantt.useMemo[items].it": (x)=>x.id === g.id
                    }["TimelineGantt.useMemo[items].it"]);
                    if (!it) return;
                    const sRaw = it.start_date ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$moment$2f$moment$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(it.start_date).valueOf() : null;
                    const eRaw = it.end_date ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$moment$2f$moment$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(it.end_date).valueOf() : null;
                    const s = Math.max(sRaw ?? eRaw ?? visibleTimeStart, visibleTimeStart);
                    const e = Math.min(eRaw ?? sRaw ?? visibleTimeEnd, visibleTimeEnd);
                    if (e <= s) return;
                    arr.push({
                        id: it.id,
                        group: it.id,
                        title: `${it.doc_no}`,
                        start_time: s,
                        end_time: e,
                        itemProps: {
                            'data-wo': it.id,
                            style: {
                                background: pickColorForWork(it),
                                color: '#fff',
                                borderRadius: '4px',
                                border: '1px solid rgba(0,0,0,0.12)'
                            }
                        },
                        canMove: false,
                        canResize: false,
                        canChangeGroup: false,
                        meta: it
                    });
                }
            }["TimelineGantt.useMemo[items]"]);
            return arr;
        }
    }["TimelineGantt.useMemo[items]"], [
        groups,
        itemsRaw,
        visibleTimeStart,
        visibleTimeEnd
    ]);
    // Now indicator: compute if now in range and left position handled by TimelineMarkers/TodayMarker
    const showNow = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "TimelineGantt.useMemo[showNow]": ()=>{
            const now = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$moment$2f$moment$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])();
            return now.isBetween(dayStart, dayStart.clone().add(24, 'hours'), null, '[]');
        }
    }["TimelineGantt.useMemo[showNow]"], [
        dayStart
    ]);
    // click handler
    function onItemSelect(itemId) {
        const it = itemsRaw.find((i)=>String(i.id) === String(itemId));
        if (it) setSelectedItem(it);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            padding: 12
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    gap: 8,
                    alignItems: 'center',
                    marginBottom: 12
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        children: [
                            "Tanggal:",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "date",
                                value: selectedDate,
                                onChange: (e)=>setSelectedDate(e.target.value),
                                style: {
                                    marginLeft: 8,
                                    padding: '6px 8px'
                                }
                            }, void 0, false, {
                                fileName: "[project]/web/components/TimelineGantt.tsx",
                                lineNumber: 147,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/web/components/TimelineGantt.tsx",
                        lineNumber: 145,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: load,
                        disabled: loading,
                        style: {
                            marginLeft: 8
                        },
                        children: "Refresh"
                    }, void 0, false, {
                        fileName: "[project]/web/components/TimelineGantt.tsx",
                        lineNumber: 155,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            marginLeft: 'auto',
                            color: '#666'
                        },
                        children: [
                            items.length,
                            " items"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/web/components/TimelineGantt.tsx",
                        lineNumber: 156,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/web/components/TimelineGantt.tsx",
                lineNumber: 144,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$react$2d$calendar$2d$timeline$2f$dist$2f$react$2d$calendar$2d$timeline$2e$es$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    ref: refTimeline,
                    groups: groups,
                    items: items,
                    defaultTimeStart: visibleTimeStart,
                    defaultTimeEnd: visibleTimeEnd,
                    visibleTimeStart: visibleTimeStart,
                    visibleTimeEnd: visibleTimeEnd,
                    //   defaultTimeStart={moment(visibleTimeStart)}
                    //   defaultTimeEnd={moment(visibleTimeEnd)}
                    //   visibleTimeStart={visibleTimeStart}
                    //   visibleTimeEnd={visibleTimeEnd}
                    canMove: false,
                    canResize: false,
                    stackItems: false,
                    itemHeightRatio: 0.7,
                    minZoom: 1000 * 60 * 30,
                    maxZoom: 1000 * 60 * 60 * 24,
                    onItemSelect: onItemSelect,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$react$2d$calendar$2d$timeline$2f$dist$2f$react$2d$calendar$2d$timeline$2e$es$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TimelineMarkers"], {
                        children: showNow && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$react$2d$calendar$2d$timeline$2f$dist$2f$react$2d$calendar$2d$timeline$2e$es$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TodayMarker"], {
                            date: (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$moment$2f$moment$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])()
                        }, void 0, false, {
                            fileName: "[project]/web/components/TimelineGantt.tsx",
                            lineNumber: 182,
                            columnNumber: 37
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/web/components/TimelineGantt.tsx",
                        lineNumber: 181,
                        columnNumber: 21
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/web/components/TimelineGantt.tsx",
                    lineNumber: 160,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/web/components/TimelineGantt.tsx",
                lineNumber: 159,
                columnNumber: 13
            }, this),
            selectedItem && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: 'fixed',
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        width: 720,
                        background: '#fff',
                        padding: 16,
                        borderRadius: 8
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            children: selectedItem.doc_no
                        }, void 0, false, {
                            fileName: "[project]/web/components/TimelineGantt.tsx",
                            lineNumber: 193,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                    children: "Asset:"
                                }, void 0, false, {
                                    fileName: "[project]/web/components/TimelineGantt.tsx",
                                    lineNumber: 194,
                                    columnNumber: 30
                                }, this),
                                " ",
                                selectedItem.asset_name
                            ]
                        }, void 0, true, {
                            fileName: "[project]/web/components/TimelineGantt.tsx",
                            lineNumber: 194,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                    children: "Type:"
                                }, void 0, false, {
                                    fileName: "[project]/web/components/TimelineGantt.tsx",
                                    lineNumber: 195,
                                    columnNumber: 30
                                }, this),
                                " ",
                                selectedItem.work_type
                            ]
                        }, void 0, true, {
                            fileName: "[project]/web/components/TimelineGantt.tsx",
                            lineNumber: 195,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                    children: "Start:"
                                }, void 0, false, {
                                    fileName: "[project]/web/components/TimelineGantt.tsx",
                                    lineNumber: 196,
                                    columnNumber: 30
                                }, this),
                                " ",
                                selectedItem.start_date
                            ]
                        }, void 0, true, {
                            fileName: "[project]/web/components/TimelineGantt.tsx",
                            lineNumber: 196,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                    children: "End:"
                                }, void 0, false, {
                                    fileName: "[project]/web/components/TimelineGantt.tsx",
                                    lineNumber: 197,
                                    columnNumber: 30
                                }, this),
                                " ",
                                selectedItem.end_date
                            ]
                        }, void 0, true, {
                            fileName: "[project]/web/components/TimelineGantt.tsx",
                            lineNumber: 197,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
                            style: {
                                marginTop: 8,
                                background: '#f7f7f7',
                                padding: 8
                            },
                            children: JSON.stringify(selectedItem.raw ?? selectedItem, null, 2)
                        }, void 0, false, {
                            fileName: "[project]/web/components/TimelineGantt.tsx",
                            lineNumber: 198,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                textAlign: 'right',
                                marginTop: 8
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setSelectedItem(null),
                                children: "Close"
                            }, void 0, false, {
                                fileName: "[project]/web/components/TimelineGantt.tsx",
                                lineNumber: 200,
                                columnNumber: 29
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/web/components/TimelineGantt.tsx",
                            lineNumber: 199,
                            columnNumber: 25
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/web/components/TimelineGantt.tsx",
                    lineNumber: 192,
                    columnNumber: 21
                }, this)
            }, void 0, false, {
                fileName: "[project]/web/components/TimelineGantt.tsx",
                lineNumber: 189,
                columnNumber: 17
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/web/components/TimelineGantt.tsx",
        lineNumber: 143,
        columnNumber: 9
    }, this);
}
_s(TimelineGantt, "KFoLefc0ZWIPUvlNq8GHhi0F1ko=");
_c = TimelineGantt;
var _c;
__turbopack_context__.k.register(_c, "TimelineGantt");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=web_cca27475._.js.map