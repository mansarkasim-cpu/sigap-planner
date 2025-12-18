(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/web/components/GanttChart.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// components/GanttChart.tsx
__turbopack_context__.s([
    "default",
    ()=>GanttChart
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/styled-jsx/style.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/lib/api-client.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
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
    return new Date(`${dateStr}T00:00:00`);
}
const WORK_TYPE_COLORS = {
    'Preventive Maintenance': '#16a34a',
    'Corrective Maintenance': '#fb923c',
    'Breakdown': '#ef4444',
    'PM': '#16a34a',
    'CM': '#fb923c',
    'Default': '#3b82f6'
};
const STATUS_COLORS = {
    'ASSIGNED': '#0ea5e9',
    'DEPLOYED': '#06b6d4',
    'READY_TO_DEPLOY': '#7c3aed',
    'IN_PROGRESS': '#f97316',
    'COMPLETED': '#10b981',
    'NEW': '#64748b',
    'OPEN': '#64748b',
    'CANCELLED': '#ef4444',
    'CLOSED': '#334155'
};
// preferred legend order for statuses
const STATUS_ORDER = [
    'NEW',
    'ASSIGNED',
    'READY_TO_DEPLOY',
    'DEPLOYED',
    'IN_PROGRESS',
    'COMPLETED'
];
function pickColorForWork(w) {
    // prefer top-level status if present (set by backend), fallback to raw payload fields
    const statusRaw = w.status || w.raw && (w.raw.doc_status || w.raw.status || w.raw.state) || null;
    if (statusRaw && typeof statusRaw === 'string') {
        const k = statusRaw.toString().toUpperCase().replace(/[-\s]/g, '_');
        if (STATUS_COLORS[k]) return STATUS_COLORS[k];
    }
    const wt = (w.work_type || w.raw && (w.raw.work_type || w.raw.type_work) || '').toString();
    if (wt && WORK_TYPE_COLORS[wt]) return WORK_TYPE_COLORS[wt];
    if (wt && WORK_TYPE_COLORS[wt.toUpperCase()]) return WORK_TYPE_COLORS[wt.toUpperCase()];
    return WORK_TYPE_COLORS['Default'];
}
function GanttChart({ pageSize = 2000 }) {
    _s();
    const [items, setItems] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [sites, setSites] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [site, setSite] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const todayIsoDate = new Date().toISOString().slice(0, 10);
    const [selectedDate, setSelectedDate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(todayIsoDate);
    const [scale, setScale] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(1);
    const [selected, setSelected] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const containerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const svgWrapperRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [containerWidth, setContainerWidth] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(900);
    const [isFullscreen, setIsFullscreen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "GanttChart.useEffect": ()=>{
            const el = svgWrapperRef.current ?? containerRef.current;
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
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "GanttChart.useEffect": ()=>{
            loadSites();
        }
    }["GanttChart.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "GanttChart.useEffect": ()=>{
            load();
        }
    }["GanttChart.useEffect"], [
        site
    ]);
    // Auto-refresh: call `load()` every 60 seconds without recreating the interval.
    const loadRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "GanttChart.useEffect": ()=>{
            loadRef.current = load;
        }
    }["GanttChart.useEffect"], [
        load
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "GanttChart.useEffect": ()=>{
            const AUTO_REFRESH_MS = 60 * 1000; // 1 minute
            const id = setInterval({
                "GanttChart.useEffect.id": ()=>{
                    try {
                        if (loadRef.current) loadRef.current();
                    } catch (e) {
                        console.warn('Gantt auto-refresh failed', e);
                    }
                }
            }["GanttChart.useEffect.id"], AUTO_REFRESH_MS);
            return ({
                "GanttChart.useEffect": ()=>clearInterval(id)
            })["GanttChart.useEffect"];
        }
    }["GanttChart.useEffect"], [
        site,
        selectedDate,
        pageSize
    ]);
    async function load() {
        setLoading(true);
        setError(null);
        try {
            const url = `/work-orders?q=&page=1&pageSize=${pageSize}` + (site ? `&site=${encodeURIComponent(site)}` : '');
            const res = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(url);
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
    async function loadSites() {
        try {
            const res = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])('/users?page=1&pageSize=1000');
            const rows = (res?.data ?? res) || [];
            const uniqueSites = Array.from(new Set(rows.map((r)=>(r.site || r.vendor_cabang || '').toString()))).filter(Boolean);
            setSites(uniqueSites);
            if (!site && uniqueSites[0]) setSite(uniqueSites[0]);
        } catch (err) {
            console.error('load sites for gantt', err);
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
    const available = Math.max(300, containerWidth - labelWidth - gutter - 20);
    const timelineWidth = available;
    const svgWidth = gutter + timelineWidth + 8;
    const pxPerMs = timelineWidth / totalMs * scale;
    function msToX(ms) {
        return gutter + Math.round((ms - dayStartMs) * pxPerMs);
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
            // sort by start time
            const sorted = filtered.sort({
                "GanttChart.useMemo[validItems].sorted": (a, b)=>{
                    const sa = isoToMs(a.start_date) ?? 0;
                    const sb = isoToMs(b.start_date) ?? 0;
                    return sa - sb;
                }
            }["GanttChart.useMemo[validItems].sorted"]);
            return sorted;
        }
    }["GanttChart.useMemo[validItems]"], [
        items,
        dayStartMs,
        dayEndMs
    ]);
    // rows are simply the valid items (no shift grouping)
    const rows = validItems;
    const nowMs = Date.now();
    const showNow = nowMs >= dayStartMs && nowMs <= dayEndMs;
    const nowX = showNow ? msToX(nowMs) : null;
    // Compute svg height; when fullscreen make it fill viewport height
    const svgHeight = ("TURBOPACK compile-time value", "object") !== 'undefined' && isFullscreen ? Math.max(140, window.innerHeight - 160) : Math.max(140, validItems.length * rowHeight + 80);
    // Fullscreen handling
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "GanttChart.useEffect": ()=>{
            function onFsChange() {
                const doc = document;
                const fsElem = doc.fullscreenElement ?? doc.webkitFullscreenElement ?? doc.mozFullScreenElement ?? doc.msFullscreenElement;
                setIsFullscreen(Boolean(fsElem));
            }
            document.addEventListener('fullscreenchange', onFsChange);
            document.addEventListener('webkitfullscreenchange', onFsChange);
            document.addEventListener('mozfullscreenchange', onFsChange);
            document.addEventListener('MSFullscreenChange', onFsChange);
            return ({
                "GanttChart.useEffect": ()=>{
                    document.removeEventListener('fullscreenchange', onFsChange);
                    document.removeEventListener('webkitfullscreenchange', onFsChange);
                    document.removeEventListener('mozfullscreenchange', onFsChange);
                    document.removeEventListener('MSFullscreenChange', onFsChange);
                }
            })["GanttChart.useEffect"];
        }
    }["GanttChart.useEffect"], []);
    async function toggleFullscreen() {
        const el = svgWrapperRef.current ?? containerRef.current;
        if (!el) return;
        const doc = document;
        const isFs = doc.fullscreenElement || doc.webkitFullscreenElement || doc.mozFullScreenElement || doc.msFullscreenElement;
        try {
            if (!isFs) {
                if (el.requestFullscreen) await el.requestFullscreen();
                else if (el.webkitRequestFullscreen) await el.webkitRequestFullscreen();
                else el.classList.add('gantt-fs-fallback');
            } else {
                if (doc.exitFullscreen) await doc.exitFullscreen();
                else if (doc.webkitExitFullscreen) await doc.webkitExitFullscreen();
                else el.classList.remove('gantt-fs-fallback');
            }
        } catch (e) {
            // fallback toggle class
            el.classList.toggle('gantt-fs-fallback');
            setIsFullscreen((f)=>!f);
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            padding: 18,
            fontFamily: 'Inter, system-ui, -apple-system, Roboto, "Helvetica Neue", Arial'
        },
        className: "jsx-98a0eb5974c95edc",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                style: {
                    position: 'sticky',
                    top: 0,
                    zIndex: 30,
                    background: '#f7fafc',
                    padding: '8px 0',
                    borderBottom: '1px solid #eee'
                },
                className: "jsx-98a0eb5974c95edc",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 8,
                        marginBottom: 6,
                        width: '100%'
                    },
                    className: "jsx-98a0eb5974c95edc",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                                width: '100%'
                            },
                            className: "jsx-98a0eb5974c95edc",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                style: {
                                    margin: 0,
                                    fontSize: 20,
                                    whiteSpace: 'nowrap',
                                    marginRight: 12
                                },
                                className: "jsx-98a0eb5974c95edc",
                                children: "Gantt Chart — Work Orders (per-hari)"
                            }, void 0, false, {
                                fileName: "[project]/web/components/GanttChart.tsx",
                                lineNumber: 254,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/web/components/GanttChart.tsx",
                            lineNumber: 253,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                                justifyContent: 'flex-end',
                                width: '100%'
                            },
                            className: "jsx-98a0eb5974c95edc",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    style: {
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 8
                                    },
                                    className: "jsx-98a0eb5974c95edc",
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
                                            },
                                            className: "jsx-98a0eb5974c95edc"
                                        }, void 0, false, {
                                            fileName: "[project]/web/components/GanttChart.tsx",
                                            lineNumber: 260,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/web/components/GanttChart.tsx",
                                    lineNumber: 258,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    style: {
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 8
                                    },
                                    className: "jsx-98a0eb5974c95edc",
                                    children: [
                                        "Site:",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                            value: site,
                                            onChange: (e)=>setSite(e.target.value),
                                            style: {
                                                marginLeft: 8,
                                                padding: '6px 8px',
                                                borderRadius: 6,
                                                border: '1px solid #ddd'
                                            },
                                            className: "jsx-98a0eb5974c95edc",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "",
                                                    className: "jsx-98a0eb5974c95edc",
                                                    children: "-- All sites --"
                                                }, void 0, false, {
                                                    fileName: "[project]/web/components/GanttChart.tsx",
                                                    lineNumber: 266,
                                                    columnNumber: 17
                                                }, this),
                                                sites.map((s)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: s,
                                                        className: "jsx-98a0eb5974c95edc",
                                                        children: s
                                                    }, s, false, {
                                                        fileName: "[project]/web/components/GanttChart.tsx",
                                                        lineNumber: 267,
                                                        columnNumber: 33
                                                    }, this))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/web/components/GanttChart.tsx",
                                            lineNumber: 265,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/web/components/GanttChart.tsx",
                                    lineNumber: 263,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setScale((s)=>Math.max(0.5, s * 0.9)),
                                    className: "jsx-98a0eb5974c95edc",
                                    children: "Zoom -"
                                }, void 0, false, {
                                    fileName: "[project]/web/components/GanttChart.tsx",
                                    lineNumber: 271,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setScale((s)=>Math.min(4, s * 1.1)),
                                    className: "jsx-98a0eb5974c95edc",
                                    children: "Zoom +"
                                }, void 0, false, {
                                    fileName: "[project]/web/components/GanttChart.tsx",
                                    lineNumber: 272,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: load,
                                    className: "jsx-98a0eb5974c95edc",
                                    children: "Refresh"
                                }, void 0, false, {
                                    fileName: "[project]/web/components/GanttChart.tsx",
                                    lineNumber: 273,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: toggleFullscreen,
                                    className: "jsx-98a0eb5974c95edc",
                                    children: isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'
                                }, void 0, false, {
                                    fileName: "[project]/web/components/GanttChart.tsx",
                                    lineNumber: 274,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/web/components/GanttChart.tsx",
                            lineNumber: 257,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/web/components/GanttChart.tsx",
                    lineNumber: 252,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/web/components/GanttChart.tsx",
                lineNumber: 251,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    gap: 8,
                    alignItems: 'center',
                    marginBottom: 12,
                    flexWrap: 'wrap'
                },
                className: "jsx-98a0eb5974c95edc",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontWeight: 700,
                            marginRight: 8
                        },
                        className: "jsx-98a0eb5974c95edc",
                        children: "Status colors:"
                    }, void 0, false, {
                        fileName: "[project]/web/components/GanttChart.tsx",
                        lineNumber: 286,
                        columnNumber: 9
                    }, this),
                    STATUS_ORDER.map((status)=>{
                        const color = STATUS_COLORS[status] || '#999';
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(LegendItem, {
                            color: color,
                            label: status.replace(/_/g, ' ')
                        }, status, false, {
                            fileName: "[project]/web/components/GanttChart.tsx",
                            lineNumber: 289,
                            columnNumber: 18
                        }, this);
                    })
                ]
            }, void 0, true, {
                fileName: "[project]/web/components/GanttChart.tsx",
                lineNumber: 285,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                ref: svgWrapperRef,
                style: {
                    border: '1px solid #eee',
                    overflow: 'auto',
                    background: isFullscreen ? '#fff' : undefined,
                    height: isFullscreen ? '100vh' : undefined,
                    padding: isFullscreen ? 18 : undefined,
                    // when fullscreen, make wrapper fixed to fully cover viewport (fallback and ensure no black bars)
                    position: isFullscreen ? 'fixed' : undefined,
                    left: isFullscreen ? 0 : undefined,
                    top: isFullscreen ? 0 : undefined,
                    right: isFullscreen ? 0 : undefined,
                    bottom: isFullscreen ? 0 : undefined,
                    width: isFullscreen ? '100vw' : undefined,
                    zIndex: isFullscreen ? 99999 : undefined,
                    borderRadius: isFullscreen ? 0 : 8,
                    boxSizing: 'border-box'
                },
                className: "jsx-98a0eb5974c95edc" + " " + "gantt-svg-wrapper",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    ref: containerRef,
                    style: {
                        overflowX: 'auto',
                        height: isFullscreen ? '100%' : undefined
                    },
                    className: "jsx-98a0eb5974c95edc",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            minWidth: Math.max(900, svgWidth)
                        },
                        className: "jsx-98a0eb5974c95edc",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    width: labelWidth,
                                    borderRight: '1px solid #f0f0f0',
                                    background: '#fafafa'
                                },
                                className: "jsx-98a0eb5974c95edc",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            padding: '10px 12px',
                                            fontWeight: 700
                                        },
                                        className: "jsx-98a0eb5974c95edc",
                                        children: "Work Order"
                                    }, void 0, false, {
                                        fileName: "[project]/web/components/GanttChart.tsx",
                                        lineNumber: 319,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            height: 8
                                        },
                                        className: "jsx-98a0eb5974c95edc"
                                    }, void 0, false, {
                                        fileName: "[project]/web/components/GanttChart.tsx",
                                        lineNumber: 320,
                                        columnNumber: 15
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
                                            className: "jsx-98a0eb5974c95edc",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        fontSize: 13,
                                                        fontWeight: 700
                                                    },
                                                    className: "jsx-98a0eb5974c95edc",
                                                    children: w.doc_no ?? w.id
                                                }, void 0, false, {
                                                    fileName: "[project]/web/components/GanttChart.tsx",
                                                    lineNumber: 333,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        marginTop: 4,
                                                        color: '#666',
                                                        fontSize: 12
                                                    },
                                                    className: "jsx-98a0eb5974c95edc",
                                                    children: [
                                                        w.asset_name ?? '',
                                                        " ",
                                                        w.work_type ? ` • ${w.work_type}` : ''
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/web/components/GanttChart.tsx",
                                                    lineNumber: 334,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, w.id, true, {
                                            fileName: "[project]/web/components/GanttChart.tsx",
                                            lineNumber: 322,
                                            columnNumber: 17
                                        }, this))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/web/components/GanttChart.tsx",
                                lineNumber: 318,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    flex: '1 0 auto',
                                    minWidth: 600,
                                    position: 'relative',
                                    background: '#fff',
                                    height: isFullscreen ? '100%' : svgHeight
                                },
                                className: "jsx-98a0eb5974c95edc",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    width: svgWidth,
                                    height: svgHeight,
                                    style: {
                                        width: isFullscreen ? '100%' : undefined,
                                        height: isFullscreen ? '100%' : undefined
                                    },
                                    className: "jsx-98a0eb5974c95edc",
                                    children: [
                                        validItems.map((r, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                x: 0,
                                                y: idx * rowHeight + 40,
                                                width: svgWidth,
                                                height: rowHeight,
                                                fill: idx % 2 === 0 ? '#ffffff' : '#fbfbfb',
                                                className: "jsx-98a0eb5974c95edc"
                                            }, 'bg' + idx, false, {
                                                fileName: "[project]/web/components/GanttChart.tsx",
                                                lineNumber: 344,
                                                columnNumber: 19
                                            }, this)),
                                        ticks.map((t, i)=>{
                                            const x = msToX(t);
                                            // show major label every 2 hours; minor ticks remain every 30 minutes
                                            const showLabel = (t - dayStartMs) % (2 * 60 * 60 * 1000) === 0;
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                                                className: "jsx-98a0eb5974c95edc",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                        x1: x,
                                                        y1: 30,
                                                        x2: x,
                                                        y2: 30 + Math.max(20, svgHeight - 40),
                                                        stroke: "#e7e7e7",
                                                        className: "jsx-98a0eb5974c95edc"
                                                    }, void 0, false, {
                                                        fileName: "[project]/web/components/GanttChart.tsx",
                                                        lineNumber: 360,
                                                        columnNumber: 23
                                                    }, this),
                                                    showLabel && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                                        x: x + 4,
                                                        y: 20,
                                                        fontSize: 11,
                                                        fill: "#333",
                                                        className: "jsx-98a0eb5974c95edc",
                                                        children: new Date(t).toLocaleTimeString([], {
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                            hour12: false
                                                        })
                                                    }, void 0, false, {
                                                        fileName: "[project]/web/components/GanttChart.tsx",
                                                        lineNumber: 361,
                                                        columnNumber: 37
                                                    }, this)
                                                ]
                                            }, 'tick' + i, true, {
                                                fileName: "[project]/web/components/GanttChart.tsx",
                                                lineNumber: 359,
                                                columnNumber: 21
                                            }, this);
                                        }),
                                        showNow && nowX !== null && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                                            className: "jsx-98a0eb5974c95edc",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                x1: nowX,
                                                y1: 30,
                                                x2: nowX,
                                                y2: 30 + Math.max(20, svgHeight - 40),
                                                stroke: "#8b5cf6",
                                                strokeWidth: 2,
                                                strokeDasharray: "6,4",
                                                className: "jsx-98a0eb5974c95edc"
                                            }, void 0, false, {
                                                fileName: "[project]/web/components/GanttChart.tsx",
                                                lineNumber: 369,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/web/components/GanttChart.tsx",
                                            lineNumber: 368,
                                            columnNumber: 19
                                        }, this),
                                        validItems.map((w, idx)=>{
                                            const sMsRaw = isoToMs(w.start_date);
                                            const eMsRaw = isoToMs(w.end_date);
                                            if (!sMsRaw || !eMsRaw) return null;
                                            const sMs = Math.max(sMsRaw, dayStartMs);
                                            const eMs = Math.min(eMsRaw, dayEndMs);
                                            if (eMs <= sMs) return null;
                                            const x1 = msToX(sMs);
                                            const x2 = msToX(eMs);
                                            const width = clampBarWidth(x1, x2);
                                            const y = idx * rowHeight + 40 + 6;
                                            const rx = 6;
                                            // bar color reflects status or work-type (original behavior)
                                            const color = pickColorForWork(w);
                                            // determine status normalized
                                            const statusNorm = (w.status || w.raw && (w.raw.status || w.raw.doc_status) || '').toString().toUpperCase().replace(/[-\s]/g, '_');
                                            // progress value: prefer top-level `progress` (0..1) then raw.progress; accept 0..1 or 0..100
                                            let progressVal = null;
                                            const pRaw = w.progress ?? w.raw?.progress ?? null;
                                            if (typeof pRaw === 'number') {
                                                if (pRaw > 1) progressVal = Math.max(0, Math.min(1, pRaw / 100));
                                                else progressVal = Math.max(0, Math.min(1, pRaw));
                                            }
                                            // helper: determine readable text color for a background hex color
                                            function hexToRgb(hex) {
                                                if (!hex) return null;
                                                const h = hex.replace('#', '').trim();
                                                if (h.length === 3) {
                                                    const r = parseInt(h[0] + h[0], 16);
                                                    const g = parseInt(h[1] + h[1], 16);
                                                    const b = parseInt(h[2] + h[2], 16);
                                                    return {
                                                        r,
                                                        g,
                                                        b
                                                    };
                                                }
                                                if (h.length === 6) {
                                                    const r = parseInt(h.substring(0, 2), 16);
                                                    const g = parseInt(h.substring(2, 4), 16);
                                                    const b = parseInt(h.substring(4, 6), 16);
                                                    return {
                                                        r,
                                                        g,
                                                        b
                                                    };
                                                }
                                                return null;
                                            }
                                            function isDark(hex) {
                                                const rgb = hexToRgb(hex) || {
                                                    r: 0,
                                                    g: 0,
                                                    b: 0
                                                };
                                                // luminance approximation
                                                const lum = 0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b;
                                                return lum < 140;
                                            }
                                            // helper: darken a hex color by a fraction (0..1)
                                            function darkenHex(hex, frac = 0.22) {
                                                try {
                                                    const rgb = hexToRgb(hex);
                                                    if (!rgb) return hex;
                                                    const r = Math.max(0, Math.min(255, Math.round(rgb.r * (1 - frac))));
                                                    const g = Math.max(0, Math.min(255, Math.round(rgb.g * (1 - frac))));
                                                    const b = Math.max(0, Math.min(255, Math.round(rgb.b * (1 - frac))));
                                                    const toHex = (n)=>n.toString(16).padStart(2, '0');
                                                    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
                                                } catch (e) {
                                                    return hex;
                                                }
                                            }
                                            // use a darker variant of the bar color for the progress overlay
                                            const progressColor = darkenHex(color, 0.22);
                                            const progressTextColorInside = isDark(progressColor) ? '#ffffff' : '#000000';
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                                                style: {
                                                    cursor: 'pointer'
                                                },
                                                onClick: ()=>setSelected(w),
                                                className: "jsx-98a0eb5974c95edc",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                        x: x1,
                                                        y: y,
                                                        rx: rx,
                                                        ry: rx,
                                                        width: width,
                                                        height: rowHeight - 12,
                                                        fill: color,
                                                        opacity: 0.98,
                                                        className: "jsx-98a0eb5974c95edc"
                                                    }, void 0, false, {
                                                        fileName: "[project]/web/components/GanttChart.tsx",
                                                        lineNumber: 446,
                                                        columnNumber: 23
                                                    }, this),
                                                    statusNorm === 'IN_PROGRESS' && progressVal !== null && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                                x: x1,
                                                                y: y,
                                                                rx: rx,
                                                                ry: rx,
                                                                width: Math.max(minBarWidthPx, width * progressVal),
                                                                height: rowHeight - 12,
                                                                fill: progressColor,
                                                                opacity: 0.72,
                                                                className: "jsx-98a0eb5974c95edc"
                                                            }, void 0, false, {
                                                                fileName: "[project]/web/components/GanttChart.tsx",
                                                                lineNumber: 451,
                                                                columnNumber: 27
                                                            }, this),
                                                            (()=>{
                                                                const progWidth = Math.max(minBarWidthPx, width * progressVal);
                                                                const pctText = Math.round(progressVal * 100) + '%';
                                                                if (progWidth > 28) {
                                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                                                        x: x1 + 6,
                                                                        y: y + (rowHeight - 12) / 2 + 4,
                                                                        fontSize: 12,
                                                                        fill: progressTextColorInside,
                                                                        fontWeight: 700,
                                                                        className: "jsx-98a0eb5974c95edc",
                                                                        children: pctText
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/web/components/GanttChart.tsx",
                                                                        lineNumber: 457,
                                                                        columnNumber: 38
                                                                    }, this);
                                                                }
                                                                // outside label
                                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                                                    x: x2 + 6,
                                                                    y: y + (rowHeight - 12) / 2 + 4,
                                                                    fontSize: 12,
                                                                    fill: color,
                                                                    fontWeight: 700,
                                                                    className: "jsx-98a0eb5974c95edc",
                                                                    children: pctText
                                                                }, void 0, false, {
                                                                    fileName: "[project]/web/components/GanttChart.tsx",
                                                                    lineNumber: 460,
                                                                    columnNumber: 36
                                                                }, this);
                                                            })()
                                                        ]
                                                    }, void 0, true)
                                                ]
                                            }, 'bar' + w.id, true, {
                                                fileName: "[project]/web/components/GanttChart.tsx",
                                                lineNumber: 444,
                                                columnNumber: 21
                                            }, this);
                                        })
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/web/components/GanttChart.tsx",
                                    lineNumber: 341,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/web/components/GanttChart.tsx",
                                lineNumber: 340,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/web/components/GanttChart.tsx",
                        lineNumber: 316,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/web/components/GanttChart.tsx",
                    lineNumber: 315,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/web/components/GanttChart.tsx",
                lineNumber: 294,
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
                className: "jsx-98a0eb5974c95edc",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        background: '#fff',
                        width: 720,
                        maxHeight: '80%',
                        overflowY: 'auto',
                        borderRadius: 8,
                        padding: 16
                    },
                    className: "jsx-98a0eb5974c95edc",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            style: {
                                marginTop: 0
                            },
                            className: "jsx-98a0eb5974c95edc",
                            children: selected.doc_no
                        }, void 0, false, {
                            fileName: "[project]/web/components/GanttChart.tsx",
                            lineNumber: 480,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "jsx-98a0eb5974c95edc",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                    className: "jsx-98a0eb5974c95edc",
                                    children: "Asset:"
                                }, void 0, false, {
                                    fileName: "[project]/web/components/GanttChart.tsx",
                                    lineNumber: 481,
                                    columnNumber: 18
                                }, this),
                                " ",
                                selected.asset_name
                            ]
                        }, void 0, true, {
                            fileName: "[project]/web/components/GanttChart.tsx",
                            lineNumber: 481,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "jsx-98a0eb5974c95edc",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                    className: "jsx-98a0eb5974c95edc",
                                    children: "Type:"
                                }, void 0, false, {
                                    fileName: "[project]/web/components/GanttChart.tsx",
                                    lineNumber: 482,
                                    columnNumber: 18
                                }, this),
                                " ",
                                selected.work_type
                            ]
                        }, void 0, true, {
                            fileName: "[project]/web/components/GanttChart.tsx",
                            lineNumber: 482,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "jsx-98a0eb5974c95edc",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                    className: "jsx-98a0eb5974c95edc",
                                    children: "Start:"
                                }, void 0, false, {
                                    fileName: "[project]/web/components/GanttChart.tsx",
                                    lineNumber: 483,
                                    columnNumber: 18
                                }, this),
                                " ",
                                niceTime(isoToMs(selected.start_date))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/web/components/GanttChart.tsx",
                            lineNumber: 483,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "jsx-98a0eb5974c95edc",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                    className: "jsx-98a0eb5974c95edc",
                                    children: "End:"
                                }, void 0, false, {
                                    fileName: "[project]/web/components/GanttChart.tsx",
                                    lineNumber: 484,
                                    columnNumber: 18
                                }, this),
                                " ",
                                niceTime(isoToMs(selected.end_date))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/web/components/GanttChart.tsx",
                            lineNumber: 484,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                marginTop: 12
                            },
                            className: "jsx-98a0eb5974c95edc",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
                                style: {
                                    whiteSpace: 'pre-wrap',
                                    background: '#f7f7f7',
                                    padding: 8,
                                    borderRadius: 6
                                },
                                className: "jsx-98a0eb5974c95edc",
                                children: selected.description ?? JSON.stringify(selected.raw ?? selected, null, 2)
                            }, void 0, false, {
                                fileName: "[project]/web/components/GanttChart.tsx",
                                lineNumber: 486,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/web/components/GanttChart.tsx",
                            lineNumber: 485,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                textAlign: 'right',
                                marginTop: 8
                            },
                            className: "jsx-98a0eb5974c95edc",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setSelected(null),
                                style: {
                                    padding: '8px 12px',
                                    borderRadius: 6
                                },
                                className: "jsx-98a0eb5974c95edc",
                                children: "Close"
                            }, void 0, false, {
                                fileName: "[project]/web/components/GanttChart.tsx",
                                lineNumber: 489,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/web/components/GanttChart.tsx",
                            lineNumber: 488,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/web/components/GanttChart.tsx",
                    lineNumber: 479,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/web/components/GanttChart.tsx",
                lineNumber: 475,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                id: "98a0eb5974c95edc",
                children: ".gantt-svg-wrapper.gantt-fs-fallback.jsx-98a0eb5974c95edc{z-index:99999;background:#fff;padding:18px;inset:0;width:100vw!important;height:100vh!important;position:fixed!important}"
            }, void 0, false, void 0, this)
        ]
    }, void 0, true, {
        fileName: "[project]/web/components/GanttChart.tsx",
        lineNumber: 250,
        columnNumber: 5
    }, this);
}
_s(GanttChart, "Kg4/XAUhgPeSztv2p6rUSQKFHVU=");
_c = GanttChart;
function LegendItem({ color, label, showBox = true }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: '#fff',
            padding: '6px 8px',
            borderRadius: 8,
            boxShadow: '0 1px 4px rgba(0,0,0,0.03)'
        },
        children: [
            showBox && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    width: 14,
                    height: 14,
                    background: color,
                    borderRadius: 3
                }
            }, void 0, false, {
                fileName: "[project]/web/components/GanttChart.tsx",
                lineNumber: 513,
                columnNumber: 19
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    fontSize: 13,
                    color: '#333'
                },
                children: label
            }, void 0, false, {
                fileName: "[project]/web/components/GanttChart.tsx",
                lineNumber: 514,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/web/components/GanttChart.tsx",
        lineNumber: 512,
        columnNumber: 5
    }, this);
}
_c1 = LegendItem;
var _c, _c1;
__turbopack_context__.k.register(_c, "GanttChart");
__turbopack_context__.k.register(_c1, "LegendItem");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/web/components/GanttChart.tsx [app-client] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/web/components/GanttChart.tsx [app-client] (ecmascript)"));
}),
"[project]/web/node_modules/next/dist/compiled/client-only/index.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

}),
"[project]/web/node_modules/styled-jsx/dist/index/index.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/web/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
__turbopack_context__.r("[project]/web/node_modules/next/dist/compiled/client-only/index.js [app-client] (ecmascript)");
var React = __turbopack_context__.r("[project]/web/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
function _interopDefaultLegacy(e) {
    return e && typeof e === 'object' && 'default' in e ? e : {
        'default': e
    };
}
var React__default = /*#__PURE__*/ _interopDefaultLegacy(React);
/*
Based on Glamor's sheet
https://github.com/threepointone/glamor/blob/667b480d31b3721a905021b26e1290ce92ca2879/src/sheet.js
*/ function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
var isProd = typeof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"] !== "undefined" && __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env && ("TURBOPACK compile-time value", "development") === "production";
var isString = function(o) {
    return Object.prototype.toString.call(o) === "[object String]";
};
var StyleSheet = /*#__PURE__*/ function() {
    function StyleSheet(param) {
        var ref = param === void 0 ? {} : param, _name = ref.name, name = _name === void 0 ? "stylesheet" : _name, _optimizeForSpeed = ref.optimizeForSpeed, optimizeForSpeed = _optimizeForSpeed === void 0 ? isProd : _optimizeForSpeed;
        invariant$1(isString(name), "`name` must be a string");
        this._name = name;
        this._deletedRulePlaceholder = "#" + name + "-deleted-rule____{}";
        invariant$1(typeof optimizeForSpeed === "boolean", "`optimizeForSpeed` must be a boolean");
        this._optimizeForSpeed = optimizeForSpeed;
        this._serverSheet = undefined;
        this._tags = [];
        this._injected = false;
        this._rulesCount = 0;
        var node = typeof window !== "undefined" && document.querySelector('meta[property="csp-nonce"]');
        this._nonce = node ? node.getAttribute("content") : null;
    }
    var _proto = StyleSheet.prototype;
    _proto.setOptimizeForSpeed = function setOptimizeForSpeed(bool) {
        invariant$1(typeof bool === "boolean", "`setOptimizeForSpeed` accepts a boolean");
        invariant$1(this._rulesCount === 0, "optimizeForSpeed cannot be when rules have already been inserted");
        this.flush();
        this._optimizeForSpeed = bool;
        this.inject();
    };
    _proto.isOptimizeForSpeed = function isOptimizeForSpeed() {
        return this._optimizeForSpeed;
    };
    _proto.inject = function inject() {
        var _this = this;
        invariant$1(!this._injected, "sheet already injected");
        this._injected = true;
        if (typeof window !== "undefined" && this._optimizeForSpeed) {
            this._tags[0] = this.makeStyleTag(this._name);
            this._optimizeForSpeed = "insertRule" in this.getSheet();
            if (!this._optimizeForSpeed) {
                if ("TURBOPACK compile-time truthy", 1) {
                    console.warn("StyleSheet: optimizeForSpeed mode not supported falling back to standard mode.");
                }
                this.flush();
                this._injected = true;
            }
            return;
        }
        this._serverSheet = {
            cssRules: [],
            insertRule: function(rule, index) {
                if (typeof index === "number") {
                    _this._serverSheet.cssRules[index] = {
                        cssText: rule
                    };
                } else {
                    _this._serverSheet.cssRules.push({
                        cssText: rule
                    });
                }
                return index;
            },
            deleteRule: function(index) {
                _this._serverSheet.cssRules[index] = null;
            }
        };
    };
    _proto.getSheetForTag = function getSheetForTag(tag) {
        if (tag.sheet) {
            return tag.sheet;
        }
        // this weirdness brought to you by firefox
        for(var i = 0; i < document.styleSheets.length; i++){
            if (document.styleSheets[i].ownerNode === tag) {
                return document.styleSheets[i];
            }
        }
    };
    _proto.getSheet = function getSheet() {
        return this.getSheetForTag(this._tags[this._tags.length - 1]);
    };
    _proto.insertRule = function insertRule(rule, index) {
        invariant$1(isString(rule), "`insertRule` accepts only strings");
        if (typeof window === "undefined") {
            if (typeof index !== "number") {
                index = this._serverSheet.cssRules.length;
            }
            this._serverSheet.insertRule(rule, index);
            return this._rulesCount++;
        }
        if (this._optimizeForSpeed) {
            var sheet = this.getSheet();
            if (typeof index !== "number") {
                index = sheet.cssRules.length;
            }
            // this weirdness for perf, and chrome's weird bug
            // https://stackoverflow.com/questions/20007992/chrome-suddenly-stopped-accepting-insertrule
            try {
                sheet.insertRule(rule, index);
            } catch (error) {
                if ("TURBOPACK compile-time truthy", 1) {
                    console.warn("StyleSheet: illegal rule: \n\n" + rule + "\n\nSee https://stackoverflow.com/q/20007992 for more info");
                }
                return -1;
            }
        } else {
            var insertionPoint = this._tags[index];
            this._tags.push(this.makeStyleTag(this._name, rule, insertionPoint));
        }
        return this._rulesCount++;
    };
    _proto.replaceRule = function replaceRule(index, rule) {
        if (this._optimizeForSpeed || typeof window === "undefined") {
            var sheet = typeof window !== "undefined" ? this.getSheet() : this._serverSheet;
            if (!rule.trim()) {
                rule = this._deletedRulePlaceholder;
            }
            if (!sheet.cssRules[index]) {
                // @TBD Should we throw an error?
                return index;
            }
            sheet.deleteRule(index);
            try {
                sheet.insertRule(rule, index);
            } catch (error) {
                if ("TURBOPACK compile-time truthy", 1) {
                    console.warn("StyleSheet: illegal rule: \n\n" + rule + "\n\nSee https://stackoverflow.com/q/20007992 for more info");
                }
                // In order to preserve the indices we insert a deleteRulePlaceholder
                sheet.insertRule(this._deletedRulePlaceholder, index);
            }
        } else {
            var tag = this._tags[index];
            invariant$1(tag, "old rule at index `" + index + "` not found");
            tag.textContent = rule;
        }
        return index;
    };
    _proto.deleteRule = function deleteRule(index) {
        if (typeof window === "undefined") {
            this._serverSheet.deleteRule(index);
            return;
        }
        if (this._optimizeForSpeed) {
            this.replaceRule(index, "");
        } else {
            var tag = this._tags[index];
            invariant$1(tag, "rule at index `" + index + "` not found");
            tag.parentNode.removeChild(tag);
            this._tags[index] = null;
        }
    };
    _proto.flush = function flush() {
        this._injected = false;
        this._rulesCount = 0;
        if (typeof window !== "undefined") {
            this._tags.forEach(function(tag) {
                return tag && tag.parentNode.removeChild(tag);
            });
            this._tags = [];
        } else {
            // simpler on server
            this._serverSheet.cssRules = [];
        }
    };
    _proto.cssRules = function cssRules() {
        var _this = this;
        if (typeof window === "undefined") {
            return this._serverSheet.cssRules;
        }
        return this._tags.reduce(function(rules, tag) {
            if (tag) {
                rules = rules.concat(Array.prototype.map.call(_this.getSheetForTag(tag).cssRules, function(rule) {
                    return rule.cssText === _this._deletedRulePlaceholder ? null : rule;
                }));
            } else {
                rules.push(null);
            }
            return rules;
        }, []);
    };
    _proto.makeStyleTag = function makeStyleTag(name, cssString, relativeToTag) {
        if (cssString) {
            invariant$1(isString(cssString), "makeStyleTag accepts only strings as second parameter");
        }
        var tag = document.createElement("style");
        if (this._nonce) tag.setAttribute("nonce", this._nonce);
        tag.type = "text/css";
        tag.setAttribute("data-" + name, "");
        if (cssString) {
            tag.appendChild(document.createTextNode(cssString));
        }
        var head = document.head || document.getElementsByTagName("head")[0];
        if (relativeToTag) {
            head.insertBefore(tag, relativeToTag);
        } else {
            head.appendChild(tag);
        }
        return tag;
    };
    _createClass(StyleSheet, [
        {
            key: "length",
            get: function get() {
                return this._rulesCount;
            }
        }
    ]);
    return StyleSheet;
}();
function invariant$1(condition, message) {
    if (!condition) {
        throw new Error("StyleSheet: " + message + ".");
    }
}
function hash(str) {
    var _$hash = 5381, i = str.length;
    while(i){
        _$hash = _$hash * 33 ^ str.charCodeAt(--i);
    }
    /* JavaScript does bitwise operations (like XOR, above) on 32-bit signed
   * integers. Since we want the results to be always positive, convert the
   * signed int to an unsigned by doing an unsigned bitshift. */ return _$hash >>> 0;
}
var stringHash = hash;
var sanitize = function(rule) {
    return rule.replace(/\/style/gi, "\\/style");
};
var cache = {};
/**
 * computeId
 *
 * Compute and memoize a jsx id from a basedId and optionally props.
 */ function computeId(baseId, props) {
    if (!props) {
        return "jsx-" + baseId;
    }
    var propsToString = String(props);
    var key = baseId + propsToString;
    if (!cache[key]) {
        cache[key] = "jsx-" + stringHash(baseId + "-" + propsToString);
    }
    return cache[key];
}
/**
 * computeSelector
 *
 * Compute and memoize dynamic selectors.
 */ function computeSelector(id, css) {
    var selectoPlaceholderRegexp = /__jsx-style-dynamic-selector/g;
    // Sanitize SSR-ed CSS.
    // Client side code doesn't need to be sanitized since we use
    // document.createTextNode (dev) and the CSSOM api sheet.insertRule (prod).
    if (typeof window === "undefined") {
        css = sanitize(css);
    }
    var idcss = id + css;
    if (!cache[idcss]) {
        cache[idcss] = css.replace(selectoPlaceholderRegexp, id);
    }
    return cache[idcss];
}
function mapRulesToStyle(cssRules, options) {
    if (options === void 0) options = {};
    return cssRules.map(function(args) {
        var id = args[0];
        var css = args[1];
        return /*#__PURE__*/ React__default["default"].createElement("style", {
            id: "__" + id,
            // Avoid warnings upon render with a key
            key: "__" + id,
            nonce: options.nonce ? options.nonce : undefined,
            dangerouslySetInnerHTML: {
                __html: css
            }
        });
    });
}
var StyleSheetRegistry = /*#__PURE__*/ function() {
    function StyleSheetRegistry(param) {
        var ref = param === void 0 ? {} : param, _styleSheet = ref.styleSheet, styleSheet = _styleSheet === void 0 ? null : _styleSheet, _optimizeForSpeed = ref.optimizeForSpeed, optimizeForSpeed = _optimizeForSpeed === void 0 ? false : _optimizeForSpeed;
        this._sheet = styleSheet || new StyleSheet({
            name: "styled-jsx",
            optimizeForSpeed: optimizeForSpeed
        });
        this._sheet.inject();
        if (styleSheet && typeof optimizeForSpeed === "boolean") {
            this._sheet.setOptimizeForSpeed(optimizeForSpeed);
            this._optimizeForSpeed = this._sheet.isOptimizeForSpeed();
        }
        this._fromServer = undefined;
        this._indices = {};
        this._instancesCounts = {};
    }
    var _proto = StyleSheetRegistry.prototype;
    _proto.add = function add(props) {
        var _this = this;
        if (undefined === this._optimizeForSpeed) {
            this._optimizeForSpeed = Array.isArray(props.children);
            this._sheet.setOptimizeForSpeed(this._optimizeForSpeed);
            this._optimizeForSpeed = this._sheet.isOptimizeForSpeed();
        }
        if (typeof window !== "undefined" && !this._fromServer) {
            this._fromServer = this.selectFromServer();
            this._instancesCounts = Object.keys(this._fromServer).reduce(function(acc, tagName) {
                acc[tagName] = 0;
                return acc;
            }, {});
        }
        var ref = this.getIdAndRules(props), styleId = ref.styleId, rules = ref.rules;
        // Deduping: just increase the instances count.
        if (styleId in this._instancesCounts) {
            this._instancesCounts[styleId] += 1;
            return;
        }
        var indices = rules.map(function(rule) {
            return _this._sheet.insertRule(rule);
        }) // Filter out invalid rules
        .filter(function(index) {
            return index !== -1;
        });
        this._indices[styleId] = indices;
        this._instancesCounts[styleId] = 1;
    };
    _proto.remove = function remove(props) {
        var _this = this;
        var styleId = this.getIdAndRules(props).styleId;
        invariant(styleId in this._instancesCounts, "styleId: `" + styleId + "` not found");
        this._instancesCounts[styleId] -= 1;
        if (this._instancesCounts[styleId] < 1) {
            var tagFromServer = this._fromServer && this._fromServer[styleId];
            if (tagFromServer) {
                tagFromServer.parentNode.removeChild(tagFromServer);
                delete this._fromServer[styleId];
            } else {
                this._indices[styleId].forEach(function(index) {
                    return _this._sheet.deleteRule(index);
                });
                delete this._indices[styleId];
            }
            delete this._instancesCounts[styleId];
        }
    };
    _proto.update = function update(props, nextProps) {
        this.add(nextProps);
        this.remove(props);
    };
    _proto.flush = function flush() {
        this._sheet.flush();
        this._sheet.inject();
        this._fromServer = undefined;
        this._indices = {};
        this._instancesCounts = {};
    };
    _proto.cssRules = function cssRules() {
        var _this = this;
        var fromServer = this._fromServer ? Object.keys(this._fromServer).map(function(styleId) {
            return [
                styleId,
                _this._fromServer[styleId]
            ];
        }) : [];
        var cssRules = this._sheet.cssRules();
        return fromServer.concat(Object.keys(this._indices).map(function(styleId) {
            return [
                styleId,
                _this._indices[styleId].map(function(index) {
                    return cssRules[index].cssText;
                }).join(_this._optimizeForSpeed ? "" : "\n")
            ];
        }) // filter out empty rules
        .filter(function(rule) {
            return Boolean(rule[1]);
        }));
    };
    _proto.styles = function styles(options) {
        return mapRulesToStyle(this.cssRules(), options);
    };
    _proto.getIdAndRules = function getIdAndRules(props) {
        var css = props.children, dynamic = props.dynamic, id = props.id;
        if (dynamic) {
            var styleId = computeId(id, dynamic);
            return {
                styleId: styleId,
                rules: Array.isArray(css) ? css.map(function(rule) {
                    return computeSelector(styleId, rule);
                }) : [
                    computeSelector(styleId, css)
                ]
            };
        }
        return {
            styleId: computeId(id),
            rules: Array.isArray(css) ? css : [
                css
            ]
        };
    };
    /**
   * selectFromServer
   *
   * Collects style tags from the document with id __jsx-XXX
   */ _proto.selectFromServer = function selectFromServer() {
        var elements = Array.prototype.slice.call(document.querySelectorAll('[id^="__jsx-"]'));
        return elements.reduce(function(acc, element) {
            var id = element.id.slice(2);
            acc[id] = element;
            return acc;
        }, {});
    };
    return StyleSheetRegistry;
}();
function invariant(condition, message) {
    if (!condition) {
        throw new Error("StyleSheetRegistry: " + message + ".");
    }
}
var StyleSheetContext = /*#__PURE__*/ React.createContext(null);
StyleSheetContext.displayName = "StyleSheetContext";
function createStyleRegistry() {
    return new StyleSheetRegistry();
}
function StyleRegistry(param) {
    var configuredRegistry = param.registry, children = param.children;
    var rootRegistry = React.useContext(StyleSheetContext);
    var ref = React.useState({
        "StyleRegistry.useState[ref]": function() {
            return rootRegistry || configuredRegistry || createStyleRegistry();
        }
    }["StyleRegistry.useState[ref]"]), registry = ref[0];
    return /*#__PURE__*/ React__default["default"].createElement(StyleSheetContext.Provider, {
        value: registry
    }, children);
}
function useStyleRegistry() {
    return React.useContext(StyleSheetContext);
}
// Opt-into the new `useInsertionEffect` API in React 18, fallback to `useLayoutEffect`.
// https://github.com/reactwg/react-18/discussions/110
var useInsertionEffect = React__default["default"].useInsertionEffect || React__default["default"].useLayoutEffect;
var defaultRegistry = typeof window !== "undefined" ? createStyleRegistry() : undefined;
function JSXStyle(props) {
    var registry = defaultRegistry ? defaultRegistry : useStyleRegistry();
    // If `registry` does not exist, we do nothing here.
    if (!registry) {
        return null;
    }
    if (typeof window === "undefined") {
        registry.add(props);
        return null;
    }
    useInsertionEffect({
        "JSXStyle.useInsertionEffect": function() {
            registry.add(props);
            return ({
                "JSXStyle.useInsertionEffect": function() {
                    registry.remove(props);
                }
            })["JSXStyle.useInsertionEffect"];
        // props.children can be string[], will be striped since id is identical
        }
    }["JSXStyle.useInsertionEffect"], [
        props.id,
        String(props.dynamic)
    ]);
    return null;
}
JSXStyle.dynamic = function(info) {
    return info.map(function(tagInfo) {
        var baseId = tagInfo[0];
        var props = tagInfo[1];
        return computeId(baseId, props);
    }).join(" ");
};
exports.StyleRegistry = StyleRegistry;
exports.createStyleRegistry = createStyleRegistry;
exports.style = JSXStyle;
exports.useStyleRegistry = useStyleRegistry;
}),
"[project]/web/node_modules/styled-jsx/style.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = __turbopack_context__.r("[project]/web/node_modules/styled-jsx/dist/index/index.js [app-client] (ecmascript)").style;
}),
]);

//# sourceMappingURL=web_1b61c159._.js.map