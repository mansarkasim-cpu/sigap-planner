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
"[project]/web/components/VisTimelineGantt.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// components/VisTimelineGantt.tsx
__turbopack_context__.s([
    "default",
    ()=>VisTimelineGantt
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/lib/api-client.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
// color mapping explicit for legend
const LEGEND_COLORS = {
    PM: '#16a34a',
    CM: '#fb923c',
    'B/D': '#ef4444',
    DEFAULT: '#3b82f6'
};
function pickColor(w) {
    const wt = (w.work_type || w.raw && (w.raw.work_type || w.raw.type_work) || '').toString().toLowerCase();
    const status = (w.raw && (w.raw.doc_status || w.raw.status || w.raw.state) || '').toString().toLowerCase();
    // priority on recognized keywords
    if (/(breakdown|failure|bd)/i.test(wt) || status.includes('breakdown') || status.includes('failure')) return LEGEND_COLORS['B/D'];
    if (/preventive|pm/i.test(wt)) return LEGEND_COLORS['PM'];
    if (/corrective|cm/i.test(wt)) return LEGEND_COLORS['CM'];
    // fallback
    return LEGEND_COLORS['DEFAULT'];
}
function toDate(iso) {
    if (!iso) return null;
    const d = new Date(iso);
    return isNaN(d.getTime()) ? null : d;
}
function VisTimelineGantt({ pageSize = 2000 }) {
    _s();
    const containerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const tlRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const customNowIdRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [itemsRaw, setItemsRaw] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [selectedDate, setSelectedDate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(new Date().toISOString().slice(0, 10));
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [selected, setSelected] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // inject vis CSS once
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "VisTimelineGantt.useEffect": ()=>{
            const cssHref = 'https://unpkg.com/vis-timeline@latest/dist/vis-timeline-graph2d.min.css';
            if (!document.querySelector(`link[href="${cssHref}"]`)) {
                const l = document.createElement('link');
                l.rel = 'stylesheet';
                l.href = cssHref;
                document.head.appendChild(l);
            }
        }
    }["VisTimelineGantt.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "VisTimelineGantt.useEffect": ()=>{
            load();
        }
    }["VisTimelineGantt.useEffect"], []);
    async function load() {
        setLoading(true);
        try {
            const res = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(`/work-orders?q=&page=1&pageSize=${pageSize}`);
            const rows = res?.data ?? res;
            const mapped = (rows || []).map((r)=>({
                    ...r,
                    start_date: r.start_date ?? null,
                    end_date: r.end_date ?? null,
                    description: r.description ?? r.raw?.description ?? ''
                }));
            setItemsRaw(mapped);
        } catch (e) {
            console.error('load', e);
        } finally{
            setLoading(false);
        }
    }
    function buildDataForDay(dateStr) {
        const dayStart = new Date(`${dateStr}T00:00:00`).getTime();
        const dayEnd = dayStart + 24 * 60 * 60 * 1000;
        const filtered = itemsRaw.filter((it)=>{
            const s = toDate(it.start_date)?.getTime() ?? null;
            const e = toDate(it.end_date)?.getTime() ?? null;
            if (s === null && e === null) return false;
            const start = s ?? e;
            const end = e ?? s;
            return !(end <= dayStart || start >= dayEnd);
        }).sort((a, b)=>{
            const sa = toDate(a.start_date)?.getTime() ?? 0;
            const sb = toDate(b.start_date)?.getTime() ?? 0;
            return sa - sb;
        });
        // groups: one group per asset_name (if multiple WO per asset, they stack under same asset)
        // But original required y-axis = work order. We'll keep one group per workorder but label shows asset/work_type
        const groups = filtered.map((it)=>({
                id: String(it.id),
                content: `${it.asset_name ?? ''} ${it.work_type ? '• ' + it.work_type : ''}`.trim()
            }));
        const items = filtered.map((it)=>{
            const sRaw = toDate(it.start_date)?.getTime() ?? null;
            const eRaw = toDate(it.end_date)?.getTime() ?? null;
            const start = Math.max(sRaw ?? eRaw ?? dayStart, dayStart);
            const end = Math.min(eRaw ?? sRaw ?? dayEnd, dayEnd);
            // content: remove WO number — show asset_name or work_type
            const content = it.asset_name ? it.asset_name : it.work_type ?? '';
            return {
                id: String(it.id),
                group: String(it.id),
                start: new Date(start),
                end: new Date(end),
                content: content,
                className: `wo-${String(it.id)}`,
                _raw: it
            };
        });
        return {
            groups,
            items,
            dayStart,
            dayEnd
        };
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "VisTimelineGantt.useEffect": ()=>{
            let mounted = true;
            async function mount() {
                if (!containerRef.current) return;
                const visUrl = 'https://unpkg.com/vis-timeline@latest/dist/vis-timeline-graph2d.min.js';
                if (!window.vis) {
                    await new Promise({
                        "VisTimelineGantt.useEffect.mount": (resolve, reject)=>{
                            const already = document.querySelector(`script[src="${visUrl}"]`);
                            if (already) return setTimeout({
                                "VisTimelineGantt.useEffect.mount": ()=>resolve()
                            }["VisTimelineGantt.useEffect.mount"], 120);
                            const s = document.createElement('script');
                            s.src = visUrl;
                            s.async = true;
                            s.onload = ({
                                "VisTimelineGantt.useEffect.mount": ()=>resolve()
                            })["VisTimelineGantt.useEffect.mount"];
                            s.onerror = ({
                                "VisTimelineGantt.useEffect.mount": ()=>reject(new Error('Failed to load vis-timeline'))
                            })["VisTimelineGantt.useEffect.mount"];
                            document.body.appendChild(s);
                        }
                    }["VisTimelineGantt.useEffect.mount"]);
                }
                const vis = window.vis;
                if (!vis || !vis.Timeline) {
                    console.error('vis not available');
                    return;
                }
                containerRef.current.innerHTML = '';
                const { groups, items, dayStart, dayEnd } = buildDataForDay(selectedDate);
                const DataSet = vis.DataSet;
                const groupsDs = new DataSet(groups);
                const itemsDs = new DataSet(items);
                const options = {
                    stack: false,
                    start: new Date(dayStart),
                    end: new Date(dayEnd),
                    min: new Date(dayStart),
                    max: new Date(dayEnd),
                    zoomMin: 30 * 60 * 1000,
                    zoomMax: 24 * 60 * 60 * 1000,
                    orientation: 'top',
                    editable: false,
                    // configure time axis grid: scale per hour
                    // timeAxis supported format in newer vis: use 'timeAxis' option
                    timeAxis: {
                        scale: 'hour',
                        step: 1
                    }
                };
                // instantiate
                const timeline = new vis.Timeline(containerRef.current, itemsDs, groupsDs, options);
                tlRef.current = timeline;
                // add NOW marker if in day
                const now = Date.now();
                if (now >= dayStart && now <= dayEnd) {
                    const id = 'now-marker';
                    timeline.addCustomTime(new Date(), id);
                    setTimeout({
                        "VisTimelineGantt.useEffect.mount": ()=>{
                            const el = containerRef.current.querySelector('.vis-custom-time');
                            if (el) {
                                el.style.borderLeft = '2px dashed #ef4444';
                                el.style.height = '100%';
                            }
                        }
                    }["VisTimelineGantt.useEffect.mount"], 80);
                    customNowIdRef.current = id;
                } else {
                    customNowIdRef.current = null;
                }
                // color items by pickColor
                items.forEach({
                    "VisTimelineGantt.useEffect.mount": (it)=>{
                        const raw = it._raw;
                        const color = pickColor(raw);
                        addCssRule(`.vis-item.wo-${it.id} .vis-item-content`, `background:${color} !important; color:#fff !important; border-radius:6px;`);
                    }
                }["VisTimelineGantt.useEffect.mount"]);
                // select handler -> open modal
                timeline.on('select', {
                    "VisTimelineGantt.useEffect.mount": (props)=>{
                        if (!props.items || props.items.length === 0) return;
                        const id = String(props.items[0]);
                        const row = items.find({
                            "VisTimelineGantt.useEffect.mount.row": (it)=>String(it.id) === id
                        }["VisTimelineGantt.useEffect.mount.row"]);
                        if (row && row._raw) setSelected(row._raw);
                    }
                }["VisTimelineGantt.useEffect.mount"]);
            }
            mount().catch({
                "VisTimelineGantt.useEffect": (err)=>console.error(err)
            }["VisTimelineGantt.useEffect"]);
            return ({
                "VisTimelineGantt.useEffect": ()=>{
                    try {
                        const t = tlRef.current?.timeline || tlRef.current;
                        if (t && typeof t.destroy === 'function') t.destroy();
                    } catch (e) {}
                }
            })["VisTimelineGantt.useEffect"];
        }
    }["VisTimelineGantt.useEffect"], [
        itemsRaw,
        selectedDate
    ]);
    // helper to inject css
    function addCssRule(selector, rule) {
        const id = 'vis-dynamic-styles';
        let ss = document.getElementById(id);
        if (!ss) {
            ss = document.createElement('style');
            ss.id = id;
            document.head.appendChild(ss);
        }
        ss.appendChild(document.createTextNode(`${selector} { ${rule} }`));
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            padding: 12
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    marginBottom: 12,
                    background: '#fff',
                    padding: 12,
                    borderRadius: 8,
                    boxShadow: '0 6px 18px rgba(0,0,0,0.04)'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        style: {
                            margin: 0
                        },
                        children: "Gantt (Vis Timeline)"
                    }, void 0, false, {
                        fileName: "[project]/web/components/VisTimelineGantt.tsx",
                        lineNumber: 246,
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
                                            padding: '6px 8px',
                                            borderRadius: 6,
                                            border: '1px solid #ddd'
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/web/components/VisTimelineGantt.tsx",
                                        lineNumber: 251,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/web/components/VisTimelineGantt.tsx",
                                lineNumber: 249,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>load(),
                                style: {
                                    padding: '6px 10px',
                                    borderRadius: 6,
                                    border: 'none',
                                    background: '#2563eb',
                                    color: '#fff'
                                },
                                children: "Refresh"
                            }, void 0, false, {
                                fileName: "[project]/web/components/VisTimelineGantt.tsx",
                                lineNumber: 254,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/web/components/VisTimelineGantt.tsx",
                        lineNumber: 248,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/web/components/VisTimelineGantt.tsx",
                lineNumber: 242,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    gap: 12,
                    alignItems: 'center',
                    marginBottom: 10
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(LegendItem, {
                        color: LEGEND_COLORS.PM,
                        label: "PM (Preventive Maintenance)"
                    }, void 0, false, {
                        fileName: "[project]/web/components/VisTimelineGantt.tsx",
                        lineNumber: 262,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(LegendItem, {
                        color: LEGEND_COLORS.CM,
                        label: "CM (Corrective Maintenance)"
                    }, void 0, false, {
                        fileName: "[project]/web/components/VisTimelineGantt.tsx",
                        lineNumber: 263,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(LegendItem, {
                        color: LEGEND_COLORS['B/D'],
                        label: "B/D (Breakdown / Failure)"
                    }, void 0, false, {
                        fileName: "[project]/web/components/VisTimelineGantt.tsx",
                        lineNumber: 264,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/web/components/VisTimelineGantt.tsx",
                lineNumber: 261,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                ref: containerRef,
                style: {
                    border: '1px solid #eee',
                    borderRadius: 8,
                    minHeight: 380,
                    overflow: 'auto'
                }
            }, void 0, false, {
                fileName: "[project]/web/components/VisTimelineGantt.tsx",
                lineNumber: 267,
                columnNumber: 7
            }, this),
            selected && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: 'fixed',
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.45)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 99999
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        background: '#fff',
                        width: 720,
                        maxHeight: '80%',
                        overflowY: 'auto',
                        borderRadius: 10,
                        padding: 16
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            style: {
                                marginTop: 0
                            },
                            children: selected.asset_name
                        }, void 0, false, {
                            fileName: "[project]/web/components/VisTimelineGantt.tsx",
                            lineNumber: 276,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                    children: "Work Type:"
                                }, void 0, false, {
                                    fileName: "[project]/web/components/VisTimelineGantt.tsx",
                                    lineNumber: 277,
                                    columnNumber: 18
                                }, this),
                                " ",
                                selected.work_type
                            ]
                        }, void 0, true, {
                            fileName: "[project]/web/components/VisTimelineGantt.tsx",
                            lineNumber: 277,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                    children: "Start:"
                                }, void 0, false, {
                                    fileName: "[project]/web/components/VisTimelineGantt.tsx",
                                    lineNumber: 278,
                                    columnNumber: 18
                                }, this),
                                " ",
                                selected.start_date
                            ]
                        }, void 0, true, {
                            fileName: "[project]/web/components/VisTimelineGantt.tsx",
                            lineNumber: 278,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                    children: "End:"
                                }, void 0, false, {
                                    fileName: "[project]/web/components/VisTimelineGantt.tsx",
                                    lineNumber: 279,
                                    columnNumber: 18
                                }, this),
                                " ",
                                selected.end_date
                            ]
                        }, void 0, true, {
                            fileName: "[project]/web/components/VisTimelineGantt.tsx",
                            lineNumber: 279,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                marginTop: 12
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
                                style: {
                                    background: '#f7f7f7',
                                    padding: 10,
                                    borderRadius: 6
                                },
                                children: JSON.stringify(selected.raw ?? selected, null, 2)
                            }, void 0, false, {
                                fileName: "[project]/web/components/VisTimelineGantt.tsx",
                                lineNumber: 281,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/web/components/VisTimelineGantt.tsx",
                            lineNumber: 280,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                textAlign: 'right'
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setSelected(null),
                                style: {
                                    padding: '6px 10px',
                                    borderRadius: 6
                                },
                                children: "Close"
                            }, void 0, false, {
                                fileName: "[project]/web/components/VisTimelineGantt.tsx",
                                lineNumber: 284,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/web/components/VisTimelineGantt.tsx",
                            lineNumber: 283,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/web/components/VisTimelineGantt.tsx",
                    lineNumber: 275,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/web/components/VisTimelineGantt.tsx",
                lineNumber: 271,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/web/components/VisTimelineGantt.tsx",
        lineNumber: 241,
        columnNumber: 5
    }, this);
}
_s(VisTimelineGantt, "k7iKQJX17et9o30E6HVgheHegIg=");
_c = VisTimelineGantt;
// small legend component
function LegendItem({ color, label }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            display: 'flex',
            alignItems: 'center',
            gap: 8
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    width: 14,
                    height: 14,
                    background: color,
                    borderRadius: 3,
                    boxShadow: '0 1px 0 rgba(0,0,0,0.05)'
                }
            }, void 0, false, {
                fileName: "[project]/web/components/VisTimelineGantt.tsx",
                lineNumber: 297,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                style: {
                    color: '#333'
                },
                children: label
            }, void 0, false, {
                fileName: "[project]/web/components/VisTimelineGantt.tsx",
                lineNumber: 298,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/web/components/VisTimelineGantt.tsx",
        lineNumber: 296,
        columnNumber: 5
    }, this);
}
_c1 = LegendItem;
var _c, _c1;
__turbopack_context__.k.register(_c, "VisTimelineGantt");
__turbopack_context__.k.register(_c1, "LegendItem");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=web_28d7d70c._.js.map