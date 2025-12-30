module.exports = [
"[project]/web/components/GanttChart.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// components/GanttChart.tsx
__turbopack_context__.s([
    "default",
    ()=>GanttChart
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/styled-jsx/style.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/lib/api-client.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$Box$2f$Box$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/material/Box/Box.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$Button$2f$Button$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/material/Button/Button.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$IconButton$2f$IconButton$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/material/IconButton/IconButton.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$TextField$2f$TextField$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/material/TextField/TextField.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$Select$2f$Select$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/material/Select/Select.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$MenuItem$2f$MenuItem$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/material/MenuItem/MenuItem.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$FormControl$2f$FormControl$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/material/FormControl/FormControl.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$InputLabel$2f$InputLabel$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/material/InputLabel/InputLabel.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$Paper$2f$Paper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/material/Paper/Paper.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$Tooltip$2f$Tooltip$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/material/Tooltip/Tooltip.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$Typography$2f$Typography$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/material/Typography/Typography.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$Chip$2f$Chip$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/material/Chip/Chip.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$ZoomOut$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/icons-material/ZoomOut.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$ZoomIn$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/icons-material/ZoomIn.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$Refresh$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/icons-material/Refresh.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$Fullscreen$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/icons-material/Fullscreen.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$FullscreenExit$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/icons-material/FullscreenExit.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$Close$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/icons-material/Close.js [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
const rowHeight = 44;
const labelWidth = 300;
const gutter = 12;
const minBarWidthPx = 4;
function isoToMs(val) {
    if (!val) return null;
    // If string is date-only (YYYY-MM-DD), parse as local midnight to avoid UTC offset issues
    if (/^\d{4}-\d{2}-\d{2}$/.test(val)) {
        const d = new Date(`${val}T00:00:00`);
        const n = d.getTime();
        return isNaN(n) ? null : n;
    }
    // If string is datetime without timezone (e.g. "YYYY-MM-DDTHH:mm:ss" or "YYYY-MM-DD HH:mm:ss"),
    // parse components and treat them as backend-local time. Many backends send naive datetimes
    // (no TZ) — assume backend uses UTC+8 and subtract that offset to get UTC ms.
    if (/^\d{4}-\d{2}-\d{2}[T\s]\d{2}:\d{2}(:\d{2}(\.\d+)?)?$/.test(val) && !/[Z+-]\d{2}:?\d{2}$/.test(val) && !/Z$/.test(val)) {
        // normalize separator to T
        const norm = val.replace(' ', 'T');
        const m = norm.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d+))?)?$/);
        if (m) {
            const year = parseInt(m[1], 10);
            const month = parseInt(m[2], 10) - 1;
            const day = parseInt(m[3], 10);
            const hour = parseInt(m[4], 10);
            const minute = parseInt(m[5], 10);
            const second = m[6] ? parseInt(m[6], 10) : 0;
            const ms = m[7] ? Math.round(Number('0.' + m[7]) * 1000) : 0;
            // Adjust this offset if your backend uses a different timezone
            const BACKEND_TZ_OFFSET_HOURS = 8;
            const nUtc = Date.UTC(year, month, day, hour, minute, second, ms) - BACKEND_TZ_OFFSET_HOURS * 60 * 60 * 1000;
            return isNaN(nUtc) ? null : nUtc;
        }
    }
    const n = Date.parse(val);
    return isNaN(n) ? null : n;
}
function niceTime(ms) {
    if (!ms) return '-';
    const d = new Date(ms);
    return d.toLocaleString();
}
// Format ms to dd/mm/yyyy HH24:mi using UTC getters to avoid local TZ differences
function formatDdMmYyyyHHMM(ms) {
    if (!ms) return '-';
    // display with +8h offset (backend local timezone) on the frontend
    const BACKEND_TZ_OFFSET_HOURS = 8;
    const d = new Date(ms + BACKEND_TZ_OFFSET_HOURS * 60 * 60 * 1000);
    const pad = (n)=>n.toString().padStart(2, '0');
    const dd = pad(d.getUTCDate());
    const mm = pad(d.getUTCMonth() + 1);
    const yyyy = d.getUTCFullYear();
    const hh = pad(d.getUTCHours());
    const mi = pad(d.getUTCMinutes());
    return `${dd}/${mm}/${yyyy} ${hh}:${mi}`;
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
    'ASSIGNED': '#1e40af',
    'DEPLOYED': '#db2777',
    'READY_TO_DEPLOY': '#7c3aed',
    'IN_PROGRESS': '#f97316',
    'COMPLETED': '#10b981',
    'PREPARATION': '#64748b',
    'NEW': '#64748b',
    'OPEN': '#64748b',
    'CANCELLED': '#ef4444',
    'CLOSED': '#334155'
};
// preferred legend order for statuses
const STATUS_ORDER = [
    'PREPARATION',
    'ASSIGNED',
    'READY_TO_DEPLOY',
    'DEPLOYED',
    'IN_PROGRESS',
    'COMPLETED'
];
// simple hex -> rgb helper and luminance check for label text color
function hexToRgbStatic(hex) {
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
function isDarkColor(hex) {
    const rgb = hexToRgbStatic(hex) || {
        r: 0,
        g: 0,
        b: 0
    };
    const lum = 0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b;
    return lum < 140;
}
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
    const [items, setItems] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [sites, setSites] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [site, setSite] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const todayIsoDate = new Date().toISOString().slice(0, 10);
    const [selectedDate, setSelectedDate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(todayIsoDate);
    const [scale, setScale] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(1);
    const [selected, setSelected] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    // displayMode: 'both' | 'planned' | 'actual'
    const [displayMode, setDisplayMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('both');
    const containerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const svgWrapperRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [containerWidth, setContainerWidth] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(900);
    const [isFullscreen, setIsFullscreen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const selectedDateLabel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        try {
            const d = dateInputToDayStart(selectedDate);
            const pad = (n)=>n.toString().padStart(2, '0');
            return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
        } catch (e) {
            return selectedDate;
        }
    }, [
        selectedDate
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const el = svgWrapperRef.current ?? containerRef.current;
        if (!el) return;
        setContainerWidth(el.clientWidth || 900);
        const ro = new ResizeObserver(()=>setContainerWidth(el.clientWidth || 900));
        ro.observe(el);
        return ()=>ro.disconnect();
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        load();
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        loadSites();
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        load();
    }, [
        site
    ]);
    // Auto-refresh: call `load()` every 60 seconds without recreating the interval.
    const loadRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        loadRef.current = load;
    }, [
        load
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const AUTO_REFRESH_MS = 60 * 1000; // 1 minute
        const id = setInterval(()=>{
            try {
                if (loadRef.current) loadRef.current();
            } catch (e) {
                console.warn('Gantt auto-refresh failed', e);
            }
        }, AUTO_REFRESH_MS);
        return ()=>clearInterval(id);
    }, [
        site,
        selectedDate,
        pageSize
    ]);
    async function load() {
        setLoading(true);
        setError(null);
        try {
            const url = `/work-orders?q=&page=1&pageSize=${pageSize}` + (site ? `&site=${encodeURIComponent(site)}` : '');
            const res = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(url);
            const rows = res?.data ?? res;
            const mapped = (rows || []).map((r)=>({
                    ...r,
                    start_date: r.start_date ?? null,
                    end_date: r.end_date ?? null,
                    description: r.description ?? r.raw?.description ?? null
                }));
            // fetch realisasi summary for each workorder in parallel (small batches)
            try {
                await Promise.all(mapped.map(async (m)=>{
                    try {
                        const rr = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(`/work-orders/${encodeURIComponent(String(m.id))}/realisasi`);
                        m.realisasi = rr?.data ?? rr;
                    } catch (e) {
                        m.realisasi = null;
                    }
                }));
            } catch (e) {
            // ignore per-item failures
            }
            setItems(mapped);
            // debug: log loaded items for troubleshooting
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            // detailed debug: show start/end values and parsed timestamps
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
        } catch (err) {
            console.error('load gantt', err);
            setError(err?.body?.message || err?.message || 'Gagal memuat data');
        } finally{
            setLoading(false);
        }
    }
    async function loadSites() {
        try {
            const res = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])('/users?page=1&pageSize=1000');
            const rows = (res?.data ?? res) || [];
            const uniqueSites = Array.from(new Set(rows.map((r)=>(r.site || r.vendor_cabang || '').toString()))).filter(Boolean);
            setSites(uniqueSites);
        } catch (err) {
            console.error('load sites for gantt', err);
        }
    }
    const { dayStartMs, dayEndMs } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const ds = dateInputToDayStart(selectedDate);
        const de = new Date(ds.getTime() + 24 * 60 * 60 * 1000);
        return {
            dayStartMs: ds.getTime(),
            dayEndMs: de.getTime()
        };
    }, [
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
    const ticks = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const out = [];
        const startTick = Math.floor(dayStartMs / tickStepMs) * tickStepMs;
        for(let t = startTick; t <= dayEndMs; t += tickStepMs)out.push(t);
        return out;
    }, [
        dayStartMs,
        dayEndMs
    ]);
    const validItems = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const debugReasons = [];
        const filtered = items.filter((it)=>{
            const s = isoToMs(it.start_date);
            const e = isoToMs(it.end_date);
            const rec = {
                id: it.id ?? it.doc_no,
                rawStart: it.start_date,
                rawEnd: it.end_date,
                s,
                e
            };
            if (s == null && e == null) {
                rec.passes = false;
                rec.reason = 'no start and end';
                debugReasons.push(rec);
                return false;
            }
            const start = s ?? e ?? null;
            const end = e ?? s ?? null;
            rec.start = start;
            rec.end = end;
            if (start == null || end == null) {
                rec.passes = false;
                rec.reason = 'start or end null after fallback';
                debugReasons.push(rec);
                return false;
            }
            if (end <= dayStartMs) {
                rec.passes = false;
                rec.reason = `ends before or at dayStart (${end} <= ${dayStartMs})`;
                debugReasons.push(rec);
                return false;
            }
            if (start >= dayEndMs) {
                rec.passes = false;
                rec.reason = `starts at/after dayEnd (${start} >= ${dayEndMs})`;
                debugReasons.push(rec);
                return false;
            }
            rec.passes = true;
            rec.reason = 'in range';
            debugReasons.push(rec);
            return true;
        });
        // sort by start time
        const sorted = filtered.sort((a, b)=>{
            const sa = isoToMs(a.start_date) ?? 0;
            const sb = isoToMs(b.start_date) ?? 0;
            return sa - sb;
        });
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        return sorted;
    }, [
        items,
        dayStartMs,
        dayEndMs
    ]);
    // debug: log validItems when they change so we can inspect filtering
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if ("TURBOPACK compile-time truthy", 1) return;
        //TURBOPACK unreachable
        ;
    }, [
        validItems
    ]);
    // rows are simply the valid items (no shift grouping)
    const rows = validItems;
    const nowMs = Date.now();
    const showNow = nowMs >= dayStartMs && nowMs <= dayEndMs;
    const nowX = showNow ? msToX(nowMs) : null;
    // Compute svg height; when fullscreen make it fill viewport height
    const svgHeight = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : Math.max(140, validItems.length * rowHeight + 80);
    // Fullscreen handling
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        function onFsChange() {
            const doc = document;
            const fsElem = doc.fullscreenElement ?? doc.webkitFullscreenElement ?? doc.mozFullScreenElement ?? doc.msFullscreenElement;
            setIsFullscreen(Boolean(fsElem));
        }
        document.addEventListener('fullscreenchange', onFsChange);
        document.addEventListener('webkitfullscreenchange', onFsChange);
        document.addEventListener('mozfullscreenchange', onFsChange);
        document.addEventListener('MSFullscreenChange', onFsChange);
        return ()=>{
            document.removeEventListener('fullscreenchange', onFsChange);
            document.removeEventListener('webkitfullscreenchange', onFsChange);
            document.removeEventListener('mozfullscreenchange', onFsChange);
            document.removeEventListener('MSFullscreenChange', onFsChange);
        };
    }, []);
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            padding: 18,
            fontFamily: 'Inter, system-ui, -apple-system, Roboto, "Helvetica Neue", Arial'
        },
        className: "jsx-98a0eb5974c95edc",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                style: {
                    position: 'sticky',
                    top: 0,
                    zIndex: 30
                },
                className: "jsx-98a0eb5974c95edc",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$Paper$2f$Paper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                    elevation: 1,
                    style: {
                        background: '#f7fafc',
                        padding: 12,
                        borderBottom: '1px solid #eee'
                    },
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$Box$2f$Box$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 2,
                        flexWrap: "wrap",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$Box$2f$Box$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                sx: {
                                    minWidth: 0,
                                    pr: 2
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$Typography$2f$Typography$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    variant: "h6",
                                    component: "h2",
                                    sx: {
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    },
                                    children: "Gantt Chart — Work Orders (per-hari)"
                                }, void 0, false, {
                                    fileName: "[project]/web/components/GanttChart.tsx",
                                    lineNumber: 410,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/web/components/GanttChart.tsx",
                                lineNumber: 409,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$Box$2f$Box$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                sx: {
                                    flexWrap: 'wrap'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$Box$2f$Box$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        sx: {
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1,
                                            background: '#ffffff',
                                            padding: '6px',
                                            borderRadius: 1,
                                            boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.03)'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$TextField$2f$TextField$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                label: "Tanggal",
                                                type: "date",
                                                size: "small",
                                                value: selectedDate,
                                                onChange: (e)=>setSelectedDate(e.target.value),
                                                InputLabelProps: {
                                                    shrink: true
                                                },
                                                sx: {
                                                    width: 160
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/web/components/GanttChart.tsx",
                                                lineNumber: 415,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$FormControl$2f$FormControl$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                size: "small",
                                                sx: {
                                                    minWidth: 160
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$InputLabel$2f$InputLabel$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                        id: "gantt-site-label",
                                                        children: "Site"
                                                    }, void 0, false, {
                                                        fileName: "[project]/web/components/GanttChart.tsx",
                                                        lineNumber: 426,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$Select$2f$Select$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                        labelId: "gantt-site-label",
                                                        label: "Site",
                                                        value: site,
                                                        onChange: (e)=>setSite(e.target.value),
                                                        renderValue: (v)=>v || '-- All sites --',
                                                        sx: {
                                                            minWidth: 140
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$MenuItem$2f$MenuItem$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                                value: "",
                                                                children: "-- All sites --"
                                                            }, void 0, false, {
                                                                fileName: "[project]/web/components/GanttChart.tsx",
                                                                lineNumber: 435,
                                                                columnNumber: 21
                                                            }, this),
                                                            sites.map((s)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$MenuItem$2f$MenuItem$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                                    value: s,
                                                                    children: s
                                                                }, s, false, {
                                                                    fileName: "[project]/web/components/GanttChart.tsx",
                                                                    lineNumber: 436,
                                                                    columnNumber: 37
                                                                }, this))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/web/components/GanttChart.tsx",
                                                        lineNumber: 427,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/web/components/GanttChart.tsx",
                                                lineNumber: 425,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$FormControl$2f$FormControl$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                size: "small",
                                                sx: {
                                                    minWidth: 180
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$InputLabel$2f$InputLabel$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                        id: "gantt-show-label",
                                                        children: "Show"
                                                    }, void 0, false, {
                                                        fileName: "[project]/web/components/GanttChart.tsx",
                                                        lineNumber: 441,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$Select$2f$Select$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                        labelId: "gantt-show-label",
                                                        label: "Show",
                                                        value: displayMode,
                                                        onChange: (e)=>setDisplayMode(String(e.target.value)),
                                                        sx: {
                                                            minWidth: 160
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$MenuItem$2f$MenuItem$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                                value: "both",
                                                                children: "Planned + Actual"
                                                            }, void 0, false, {
                                                                fileName: "[project]/web/components/GanttChart.tsx",
                                                                lineNumber: 449,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$MenuItem$2f$MenuItem$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                                value: "planned",
                                                                children: "Planned only"
                                                            }, void 0, false, {
                                                                fileName: "[project]/web/components/GanttChart.tsx",
                                                                lineNumber: 450,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$MenuItem$2f$MenuItem$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                                value: "actual",
                                                                children: "Actual only"
                                                            }, void 0, false, {
                                                                fileName: "[project]/web/components/GanttChart.tsx",
                                                                lineNumber: 451,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/web/components/GanttChart.tsx",
                                                        lineNumber: 442,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/web/components/GanttChart.tsx",
                                                lineNumber: 440,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/web/components/GanttChart.tsx",
                                        lineNumber: 414,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$Box$2f$Box$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        sx: {
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 0.5
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$Tooltip$2f$Tooltip$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                title: "Zoom out",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$IconButton$2f$IconButton$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                    size: "small",
                                                    onClick: ()=>setScale((s)=>Math.max(0.5, s * 0.9)),
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$ZoomOut$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                                        fileName: "[project]/web/components/GanttChart.tsx",
                                                        lineNumber: 458,
                                                        columnNumber: 98
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/web/components/GanttChart.tsx",
                                                    lineNumber: 458,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/web/components/GanttChart.tsx",
                                                lineNumber: 457,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$Tooltip$2f$Tooltip$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                title: "Zoom in",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$IconButton$2f$IconButton$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                    size: "small",
                                                    onClick: ()=>setScale((s)=>Math.min(4, s * 1.1)),
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$ZoomIn$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                                        fileName: "[project]/web/components/GanttChart.tsx",
                                                        lineNumber: 461,
                                                        columnNumber: 96
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/web/components/GanttChart.tsx",
                                                    lineNumber: 461,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/web/components/GanttChart.tsx",
                                                lineNumber: 460,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$Tooltip$2f$Tooltip$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                title: "Refresh",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$IconButton$2f$IconButton$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                    size: "small",
                                                    onClick: load,
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$Refresh$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                                        fileName: "[project]/web/components/GanttChart.tsx",
                                                        lineNumber: 464,
                                                        columnNumber: 59
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/web/components/GanttChart.tsx",
                                                    lineNumber: 464,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/web/components/GanttChart.tsx",
                                                lineNumber: 463,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$Tooltip$2f$Tooltip$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                title: isFullscreen ? 'Exit fullscreen' : 'Fullscreen',
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$IconButton$2f$IconButton$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                    size: "small",
                                                    onClick: toggleFullscreen,
                                                    children: isFullscreen ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$FullscreenExit$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                                        fileName: "[project]/web/components/GanttChart.tsx",
                                                        lineNumber: 468,
                                                        columnNumber: 37
                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$Fullscreen$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                                        fileName: "[project]/web/components/GanttChart.tsx",
                                                        lineNumber: 468,
                                                        columnNumber: 62
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/web/components/GanttChart.tsx",
                                                    lineNumber: 467,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/web/components/GanttChart.tsx",
                                                lineNumber: 466,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/web/components/GanttChart.tsx",
                                        lineNumber: 456,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/web/components/GanttChart.tsx",
                                lineNumber: 413,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/web/components/GanttChart.tsx",
                        lineNumber: 408,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/web/components/GanttChart.tsx",
                    lineNumber: 407,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/web/components/GanttChart.tsx",
                lineNumber: 406,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$Box$2f$Box$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                display: "flex",
                gap: 1,
                alignItems: "center",
                flexWrap: "wrap",
                sx: {
                    mt: 1,
                    mb: 2
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$Typography$2f$Typography$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        sx: {
                            fontWeight: 700,
                            mr: 1
                        },
                        children: "Status colors:"
                    }, void 0, false, {
                        fileName: "[project]/web/components/GanttChart.tsx",
                        lineNumber: 484,
                        columnNumber: 9
                    }, this),
                    STATUS_ORDER.map((status)=>{
                        const color = STATUS_COLORS[status] || '#999';
                        const textColor = isDarkColor(color) ? '#ffffff' : '#000000';
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$Chip$2f$Chip$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            label: status.replace(/_/g, ' '),
                            size: "small",
                            sx: {
                                backgroundColor: color,
                                color: textColor,
                                fontWeight: 700
                            }
                        }, status, false, {
                            fileName: "[project]/web/components/GanttChart.tsx",
                            lineNumber: 489,
                            columnNumber: 13
                        }, this);
                    }),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$Box$2f$Box$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        sx: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            ml: 1
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$Box$2f$Box$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                sx: {
                                    width: 14,
                                    height: 14,
                                    backgroundColor: '#0f172a',
                                    borderRadius: 0.5,
                                    opacity: 0.12
                                }
                            }, void 0, false, {
                                fileName: "[project]/web/components/GanttChart.tsx",
                                lineNumber: 498,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$Typography$2f$Typography$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                sx: {
                                    fontSize: 13,
                                    color: '#333'
                                },
                                children: "Realisasi (actual)"
                            }, void 0, false, {
                                fileName: "[project]/web/components/GanttChart.tsx",
                                lineNumber: 499,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/web/components/GanttChart.tsx",
                        lineNumber: 497,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/web/components/GanttChart.tsx",
                lineNumber: 483,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                children: [
                    isFullscreen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$Box$2f$Box$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        display: "flex",
                        gap: 1,
                        alignItems: "center",
                        sx: {
                            mt: 1,
                            mb: 2,
                            position: 'sticky',
                            top: 0,
                            zIndex: 40,
                            background: '#fff',
                            padding: '8px',
                            borderBottom: '1px solid #eee'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$Box$2f$Box$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                sx: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    flexWrap: 'wrap'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$Typography$2f$Typography$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        sx: {
                                            fontWeight: 700,
                                            mr: 1
                                        },
                                        children: "Status colors:"
                                    }, void 0, false, {
                                        fileName: "[project]/web/components/GanttChart.tsx",
                                        lineNumber: 528,
                                        columnNumber: 15
                                    }, this),
                                    STATUS_ORDER.map((status)=>{
                                        const color = STATUS_COLORS[status] || '#999';
                                        const textColor = isDarkColor(color) ? '#ffffff' : '#000000';
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$Chip$2f$Chip$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                            label: status.replace(/_/g, ' '),
                                            size: "small",
                                            sx: {
                                                backgroundColor: color,
                                                color: textColor,
                                                fontWeight: 700
                                            }
                                        }, status + '-fs', false, {
                                            fileName: "[project]/web/components/GanttChart.tsx",
                                            lineNumber: 533,
                                            columnNumber: 19
                                        }, this);
                                    }),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$Box$2f$Box$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        sx: {
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1,
                                            ml: 1
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$Box$2f$Box$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                sx: {
                                                    width: 14,
                                                    height: 14,
                                                    backgroundColor: '#0f172a',
                                                    borderRadius: 0.5,
                                                    opacity: 0.12
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/web/components/GanttChart.tsx",
                                                lineNumber: 542,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$Typography$2f$Typography$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                sx: {
                                                    fontSize: 13,
                                                    color: '#333'
                                                },
                                                children: "Realisasi (actual)"
                                            }, void 0, false, {
                                                fileName: "[project]/web/components/GanttChart.tsx",
                                                lineNumber: 543,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/web/components/GanttChart.tsx",
                                        lineNumber: 541,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/web/components/GanttChart.tsx",
                                lineNumber: 527,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$Box$2f$Box$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                sx: {
                                    marginLeft: 'auto',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$Typography$2f$Typography$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        sx: {
                                            fontSize: 13,
                                            color: '#444',
                                            fontWeight: 700
                                        },
                                        children: "Tanggal"
                                    }, void 0, false, {
                                        fileName: "[project]/web/components/GanttChart.tsx",
                                        lineNumber: 548,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$Typography$2f$Typography$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        sx: {
                                            fontSize: 13,
                                            color: '#111'
                                        },
                                        children: selectedDateLabel
                                    }, void 0, false, {
                                        fileName: "[project]/web/components/GanttChart.tsx",
                                        lineNumber: 549,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/web/components/GanttChart.tsx",
                                lineNumber: 547,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/web/components/GanttChart.tsx",
                        lineNumber: 526,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        ref: containerRef,
                        style: {
                            overflowX: 'auto',
                            height: isFullscreen ? '100%' : undefined
                        },
                        className: "jsx-98a0eb5974c95edc",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'flex',
                                minWidth: Math.max(900, svgWidth)
                            },
                            className: "jsx-98a0eb5974c95edc",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        width: labelWidth,
                                        borderRight: '1px solid #f0f0f0',
                                        background: '#fafafa'
                                    },
                                    className: "jsx-98a0eb5974c95edc",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                padding: '10px 12px',
                                                fontWeight: 700
                                            },
                                            className: "jsx-98a0eb5974c95edc",
                                            children: "Work Order"
                                        }, void 0, false, {
                                            fileName: "[project]/web/components/GanttChart.tsx",
                                            lineNumber: 557,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                height: 8
                                            },
                                            className: "jsx-98a0eb5974c95edc"
                                        }, void 0, false, {
                                            fileName: "[project]/web/components/GanttChart.tsx",
                                            lineNumber: 558,
                                            columnNumber: 15
                                        }, this),
                                        validItems.map((w, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            fontSize: 13,
                                                            fontWeight: 700
                                                        },
                                                        className: "jsx-98a0eb5974c95edc",
                                                        children: w.asset_name ?? ''
                                                    }, void 0, false, {
                                                        fileName: "[project]/web/components/GanttChart.tsx",
                                                        lineNumber: 571,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            marginTop: 4,
                                                            color: '#666',
                                                            fontSize: 12
                                                        },
                                                        className: "jsx-98a0eb5974c95edc",
                                                        children: [
                                                            w.doc_no ?? w.id,
                                                            " ",
                                                            w.work_type ? ` • ${w.work_type}` : ''
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/web/components/GanttChart.tsx",
                                                        lineNumber: 572,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, w.id, true, {
                                                fileName: "[project]/web/components/GanttChart.tsx",
                                                lineNumber: 560,
                                                columnNumber: 17
                                            }, this))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/web/components/GanttChart.tsx",
                                    lineNumber: 556,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        flex: '1 0 auto',
                                        minWidth: 600,
                                        position: 'relative',
                                        background: '#fff',
                                        height: isFullscreen ? '100%' : svgHeight
                                    },
                                    className: "jsx-98a0eb5974c95edc",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        width: svgWidth,
                                        height: svgHeight,
                                        style: {
                                            width: isFullscreen ? '100%' : undefined,
                                            height: isFullscreen ? '100%' : undefined
                                        },
                                        className: "jsx-98a0eb5974c95edc",
                                        children: [
                                            validItems.map((r, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                    x: 0,
                                                    y: idx * rowHeight + 40,
                                                    width: svgWidth,
                                                    height: rowHeight,
                                                    fill: idx % 2 === 0 ? '#ffffff' : '#fbfbfb',
                                                    className: "jsx-98a0eb5974c95edc"
                                                }, 'bg' + idx, false, {
                                                    fileName: "[project]/web/components/GanttChart.tsx",
                                                    lineNumber: 582,
                                                    columnNumber: 19
                                                }, this)),
                                            ticks.map((t, i)=>{
                                                const x = msToX(t);
                                                // show major label every 2 hours; minor ticks remain every 30 minutes
                                                const showLabel = (t - dayStartMs) % (2 * 60 * 60 * 1000) === 0;
                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                                                    className: "jsx-98a0eb5974c95edc",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                            x1: x,
                                                            y1: 30,
                                                            x2: x,
                                                            y2: 30 + Math.max(20, svgHeight - 40),
                                                            stroke: "#e7e7e7",
                                                            className: "jsx-98a0eb5974c95edc"
                                                        }, void 0, false, {
                                                            fileName: "[project]/web/components/GanttChart.tsx",
                                                            lineNumber: 598,
                                                            columnNumber: 23
                                                        }, this),
                                                        showLabel && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
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
                                                            lineNumber: 599,
                                                            columnNumber: 37
                                                        }, this)
                                                    ]
                                                }, 'tick' + i, true, {
                                                    fileName: "[project]/web/components/GanttChart.tsx",
                                                    lineNumber: 597,
                                                    columnNumber: 21
                                                }, this);
                                            }),
                                            showNow && nowX !== null && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                                                className: "jsx-98a0eb5974c95edc",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
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
                                                    lineNumber: 607,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/web/components/GanttChart.tsx",
                                                lineNumber: 606,
                                                columnNumber: 19
                                            }, this),
                                            validItems.map((w, idx)=>{
                                                const sMsRaw = isoToMs(w.start_date);
                                                const eMsRaw = isoToMs(w.end_date);
                                                const realStartMsRaw = isoToMs(w.realisasi?.actualStart);
                                                const realEndMsRaw = isoToMs(w.realisasi?.actualEnd);
                                                if (sMsRaw == null || eMsRaw == null) return null;
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
                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                                                    style: {
                                                        cursor: 'pointer'
                                                    },
                                                    onClick: ()=>setSelected(w),
                                                    className: "jsx-98a0eb5974c95edc",
                                                    children: [
                                                        displayMode !== 'actual' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
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
                                                            lineNumber: 687,
                                                            columnNumber: 25
                                                        }, this),
                                                        realStartMsRaw != null && realEndMsRaw != null && displayMode !== 'planned' && (()=>{
                                                            const rs = Math.max(realStartMsRaw, dayStartMs);
                                                            const re = Math.min(realEndMsRaw, dayEndMs);
                                                            if (re <= rs) return null;
                                                            const rx1 = msToX(rs);
                                                            const rx2 = msToX(re);
                                                            const rwidth = clampBarWidth(rx1, rx2);
                                                            const ry = y + 6; // inset slightly
                                                            const rheight = Math.max(6, rowHeight - 24);
                                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                                        x: rx1,
                                                                        y: ry,
                                                                        rx: 3,
                                                                        ry: 3,
                                                                        width: rwidth,
                                                                        height: rheight,
                                                                        fill: "#0f172a",
                                                                        opacity: 0.12,
                                                                        className: "jsx-98a0eb5974c95edc"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/web/components/GanttChart.tsx",
                                                                        lineNumber: 702,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                                        x: rx1,
                                                                        y: ry,
                                                                        rx: 3,
                                                                        ry: 3,
                                                                        width: rwidth,
                                                                        height: rheight,
                                                                        fill: "none",
                                                                        stroke: "#0f172a",
                                                                        strokeWidth: 1,
                                                                        opacity: 0.22,
                                                                        className: "jsx-98a0eb5974c95edc"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/web/components/GanttChart.tsx",
                                                                        lineNumber: 703,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                ]
                                                            }, void 0, true);
                                                        })(),
                                                        statusNorm === 'IN_PROGRESS' && progressVal !== null && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
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
                                                                    lineNumber: 711,
                                                                    columnNumber: 27
                                                                }, this),
                                                                (()=>{
                                                                    const progWidth = Math.max(minBarWidthPx, width * progressVal);
                                                                    const pctText = Math.round(progressVal * 100) + '%';
                                                                    if (progWidth > 28) {
                                                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                                                            x: x1 + 6,
                                                                            y: y + (rowHeight - 12) / 2 + 4,
                                                                            fontSize: 12,
                                                                            fill: progressTextColorInside,
                                                                            fontWeight: 700,
                                                                            className: "jsx-98a0eb5974c95edc",
                                                                            children: pctText
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/web/components/GanttChart.tsx",
                                                                            lineNumber: 717,
                                                                            columnNumber: 38
                                                                        }, this);
                                                                    }
                                                                    // outside label
                                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                                                        x: x2 + 6,
                                                                        y: y + (rowHeight - 12) / 2 + 4,
                                                                        fontSize: 12,
                                                                        fill: color,
                                                                        fontWeight: 700,
                                                                        className: "jsx-98a0eb5974c95edc",
                                                                        children: pctText
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/web/components/GanttChart.tsx",
                                                                        lineNumber: 720,
                                                                        columnNumber: 36
                                                                    }, this);
                                                                })()
                                                            ]
                                                        }, void 0, true)
                                                    ]
                                                }, 'bar' + w.id, true, {
                                                    fileName: "[project]/web/components/GanttChart.tsx",
                                                    lineNumber: 684,
                                                    columnNumber: 21
                                                }, this);
                                            })
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/web/components/GanttChart.tsx",
                                        lineNumber: 579,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/web/components/GanttChart.tsx",
                                    lineNumber: 578,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/web/components/GanttChart.tsx",
                            lineNumber: 554,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/web/components/GanttChart.tsx",
                        lineNumber: 553,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/web/components/GanttChart.tsx",
                lineNumber: 504,
                columnNumber: 7
            }, this),
            selected && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            style: {
                                marginTop: 0
                            },
                            className: "jsx-98a0eb5974c95edc",
                            children: selected.doc_no
                        }, void 0, false, {
                            fileName: "[project]/web/components/GanttChart.tsx",
                            lineNumber: 740,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "jsx-98a0eb5974c95edc",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                    className: "jsx-98a0eb5974c95edc",
                                    children: "Asset:"
                                }, void 0, false, {
                                    fileName: "[project]/web/components/GanttChart.tsx",
                                    lineNumber: 741,
                                    columnNumber: 18
                                }, this),
                                " ",
                                selected.asset_name
                            ]
                        }, void 0, true, {
                            fileName: "[project]/web/components/GanttChart.tsx",
                            lineNumber: 741,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "jsx-98a0eb5974c95edc",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                    className: "jsx-98a0eb5974c95edc",
                                    children: "Type:"
                                }, void 0, false, {
                                    fileName: "[project]/web/components/GanttChart.tsx",
                                    lineNumber: 742,
                                    columnNumber: 18
                                }, this),
                                " ",
                                selected.work_type
                            ]
                        }, void 0, true, {
                            fileName: "[project]/web/components/GanttChart.tsx",
                            lineNumber: 742,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "jsx-98a0eb5974c95edc",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                    className: "jsx-98a0eb5974c95edc",
                                    children: "Start:"
                                }, void 0, false, {
                                    fileName: "[project]/web/components/GanttChart.tsx",
                                    lineNumber: 743,
                                    columnNumber: 18
                                }, this),
                                " ",
                                formatDdMmYyyyHHMM(isoToMs(selected.start_date))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/web/components/GanttChart.tsx",
                            lineNumber: 743,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "jsx-98a0eb5974c95edc",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                    className: "jsx-98a0eb5974c95edc",
                                    children: "End:"
                                }, void 0, false, {
                                    fileName: "[project]/web/components/GanttChart.tsx",
                                    lineNumber: 744,
                                    columnNumber: 18
                                }, this),
                                " ",
                                formatDdMmYyyyHHMM(isoToMs(selected.end_date))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/web/components/GanttChart.tsx",
                            lineNumber: 744,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "jsx-98a0eb5974c95edc",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                    className: "jsx-98a0eb5974c95edc",
                                    children: "Actual Start:"
                                }, void 0, false, {
                                    fileName: "[project]/web/components/GanttChart.tsx",
                                    lineNumber: 745,
                                    columnNumber: 18
                                }, this),
                                " ",
                                formatDdMmYyyyHHMM(isoToMs(selected.realisasi?.actualStart))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/web/components/GanttChart.tsx",
                            lineNumber: 745,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "jsx-98a0eb5974c95edc",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                    className: "jsx-98a0eb5974c95edc",
                                    children: "Actual End:"
                                }, void 0, false, {
                                    fileName: "[project]/web/components/GanttChart.tsx",
                                    lineNumber: 746,
                                    columnNumber: 18
                                }, this),
                                " ",
                                formatDdMmYyyyHHMM(isoToMs(selected.realisasi?.actualEnd))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/web/components/GanttChart.tsx",
                            lineNumber: 746,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                marginTop: 12
                            },
                            className: "jsx-98a0eb5974c95edc",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
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
                                lineNumber: 748,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/web/components/GanttChart.tsx",
                            lineNumber: 747,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                textAlign: 'right',
                                marginTop: 8
                            },
                            className: "jsx-98a0eb5974c95edc",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$Button$2f$Button$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                variant: "contained",
                                size: "small",
                                startIcon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$Close$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                    fileName: "[project]/web/components/GanttChart.tsx",
                                    lineNumber: 751,
                                    columnNumber: 67
                                }, void 0),
                                onClick: ()=>setSelected(null),
                                children: "Close"
                            }, void 0, false, {
                                fileName: "[project]/web/components/GanttChart.tsx",
                                lineNumber: 751,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/web/components/GanttChart.tsx",
                            lineNumber: 750,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/web/components/GanttChart.tsx",
                    lineNumber: 739,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/web/components/GanttChart.tsx",
                lineNumber: 735,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                id: "98a0eb5974c95edc",
                children: ".gantt-svg-wrapper.gantt-fs-fallback.jsx-98a0eb5974c95edc{z-index:99999;background:#fff;padding:18px;inset:0;width:100vw!important;height:100vh!important;position:fixed!important}"
            }, void 0, false, void 0, this)
        ]
    }, void 0, true, {
        fileName: "[project]/web/components/GanttChart.tsx",
        lineNumber: 405,
        columnNumber: 5
    }, this);
}
function LegendItem({ color, label, showBox = true }) {
    const textColor = isDarkColor(color) ? '#ffffff' : '#000000';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$Box$2f$Box$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
        display: "flex",
        alignItems: "center",
        gap: 1,
        sx: {
            background: '#fff',
            padding: '6px 8px',
            borderRadius: 1,
            boxShadow: '0 1px 4px rgba(0,0,0,0.03)'
        },
        children: [
            showBox && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$Box$2f$Box$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                sx: {
                    width: 14,
                    height: 14,
                    backgroundColor: color,
                    borderRadius: 0.5
                }
            }, void 0, false, {
                fileName: "[project]/web/components/GanttChart.tsx",
                lineNumber: 776,
                columnNumber: 19
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$Typography$2f$Typography$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                sx: {
                    fontSize: 13,
                    color: '#333'
                },
                children: label
            }, void 0, false, {
                fileName: "[project]/web/components/GanttChart.tsx",
                lineNumber: 777,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/web/components/GanttChart.tsx",
        lineNumber: 775,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=web_components_GanttChart_tsx_7488b913._.js.map