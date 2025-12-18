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
    function getAuthHeader() {
        try {
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            const token = (localStorage.getItem('token') || '').trim();
            return token ? {
                Authorization: `Bearer ${token}`
            } : {};
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/web/components/ShiftManager.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ShiftManager
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/lib/api-client.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
const SHIFT_DEFS = [
    {
        id: 1,
        label: 'Shift 1',
        time: '08:00 - 16:00'
    },
    {
        id: 2,
        label: 'Shift 2',
        time: '16:00 - 24:00'
    },
    {
        id: 3,
        label: 'Shift 3',
        time: '00:00 - 08:00'
    }
];
function Badge({ children, color = '#ddd' }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        style: {
            display: 'inline-block',
            background: color,
            color: '#fff',
            padding: '6px 10px',
            borderRadius: 999,
            fontSize: 13
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/web/components/ShiftManager.jsx",
        lineNumber: 13,
        columnNumber: 5
    }, this);
}
_c = Badge;
function ShiftManager() {
    _s();
    const [sites, setSites] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [site, setSite] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [users, setUsers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [groups, setGroups] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [assignments, setAssignments] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [groupName, setGroupName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [selectedUsers, setSelectedUsers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(new Set());
    const [techQuery, setTechQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [selectedDate, setSelectedDate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(new Date().toISOString().slice(0, 10));
    const [selectedGroupToAssign, setSelectedGroupToAssign] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [selectedShift, setSelectedShift] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(1);
    // load sites (deriving from users' vendor_cabang) and users for selected site
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ShiftManager.useEffect": ()=>{
            loadSites();
        }
    }["ShiftManager.useEffect"], []);
    // reload groups whenever selected site changes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ShiftManager.useEffect": ()=>{
            loadGroups();
        }
    }["ShiftManager.useEffect"], [
        site
    ]);
    async function loadSites() {
        try {
            const res = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])('/users?page=1&pageSize=1000');
            const rows = (res?.data ?? res) || [];
            // users may store site in different fields depending on source: prefer `site`, fall back to `vendor_cabang`
            const uniqueSites = Array.from(new Set(rows.map((r)=>r.site || r.vendor_cabang || ''))).filter(Boolean);
            setSites(uniqueSites);
            if (!site && uniqueSites[0]) setSite(uniqueSites[0]);
        } catch (err) {
            console.error('load sites', err);
        }
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ShiftManager.useEffect": ()=>{
            if (site) loadUsers(site);
        }
    }["ShiftManager.useEffect"], [
        site
    ]);
    async function loadUsers(siteFilter) {
        try {
            const res = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(`/users?page=1&pageSize=1000&site=${encodeURIComponent(siteFilter)}`);
            const rows = (res?.data ?? res) || [];
            // only technicians are selectable
            setUsers(rows.filter((u)=>(u.role || '').toLowerCase() === 'technician'));
        } catch (err) {
            console.error('load users', err);
        }
    }
    async function loadGroups() {
        try {
            const url = site ? `/shift-groups?site=${encodeURIComponent(site)}` : '/shift-groups';
            const res = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(url);
            const rows = (res?.data ?? res) || [];
            setGroups(rows);
        } catch (err) {
            console.error('load groups', err);
        }
    }
    async function loadAssignments() {
        try {
            const url = `/shift-assignments?date=${selectedDate}` + (site ? `&site=${encodeURIComponent(site)}` : '');
            const res = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(url);
            const rows = (res?.data ?? res) || [];
            setAssignments(rows);
        } catch (err) {
            console.error('load assignments', err);
            setAssignments([]);
        }
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ShiftManager.useEffect": ()=>{
            loadAssignments();
        }
    }["ShiftManager.useEffect"], [
        selectedDate,
        site
    ]);
    function toggleUserSelection(id) {
        const s = new Set(selectedUsers);
        if (s.has(id)) s.delete(id);
        else s.add(id);
        setSelectedUsers(s);
    }
    async function createGroup() {
        if (!groupName || selectedUsers.size === 0) return alert('Please enter a group name and choose at least one technician');
        const payload = {
            name: groupName,
            members: Array.from(selectedUsers),
            site
        };
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])('/shift-groups', {
                method: 'POST',
                body: payload
            });
            setGroupName('');
            setSelectedUsers(new Set());
            await loadGroups();
            alert('Group created');
        } catch (err) {
            console.error('create group', err);
            alert('Failed to create group');
        }
    }
    async function assignGroup() {
        if (!selectedGroupToAssign) return alert('Select a group to assign');
        const payload = {
            date: selectedDate,
            shift: selectedShift,
            groupId: selectedGroupToAssign,
            site
        };
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])('/shift-assignments', {
                method: 'POST',
                body: payload
            });
            await loadAssignments();
            alert('Assigned');
        } catch (err) {
            console.error('assign', err);
            alert('Failed to assign');
        }
    }
    // Edit group UI state
    const [editGroupId, setEditGroupId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [editGroupName, setEditGroupName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [editGroupSelectedUsers, setEditGroupSelectedUsers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(new Set());
    function startEditGroup(g) {
        setEditGroupId(g.id);
        setEditGroupName(g.name || '');
        setEditGroupSelectedUsers(new Set(g.members || []));
    }
    function toggleEditUserSelection(id) {
        const s = new Set(editGroupSelectedUsers);
        if (s.has(id)) s.delete(id);
        else s.add(id);
        setEditGroupSelectedUsers(s);
    }
    function cancelEditGroup() {
        setEditGroupId('');
        setEditGroupName('');
        setEditGroupSelectedUsers(new Set());
    }
    async function saveEditGroup() {
        if (!editGroupId) return;
        try {
            const payload = {
                name: editGroupName,
                members: Array.from(editGroupSelectedUsers),
                site
            };
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(`/shift-groups/${editGroupId}`, {
                method: 'PUT',
                body: payload
            });
            await loadGroups();
            await loadAssignments();
            cancelEditGroup();
            alert('Group updated');
        } catch (err) {
            console.error('save edit group', err);
            alert('Failed to update group');
        }
    }
    const groupsById = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ShiftManager.useMemo[groupsById]": ()=>{
            const m = {};
            groups.forEach({
                "ShiftManager.useMemo[groupsById]": (g)=>m[g.id] = g
            }["ShiftManager.useMemo[groupsById]"]);
            return m;
        }
    }["ShiftManager.useMemo[groupsById]"], [
        groups
    ]);
    const usersById = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ShiftManager.useMemo[usersById]": ()=>{
            const m = {};
            users.forEach({
                "ShiftManager.useMemo[usersById]": (u)=>{
                    m[u.id] = u;
                }
            }["ShiftManager.useMemo[usersById]"]);
            return m;
        }
    }["ShiftManager.useMemo[usersById]"], [
        users
    ]);
    const assignmentMap = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ShiftManager.useMemo[assignmentMap]": ()=>{
            const m = {};
            assignments.forEach({
                "ShiftManager.useMemo[assignmentMap]": (a)=>{
                    const key = a.shift;
                    if (!m[key]) m[key] = [];
                    m[key].push(a);
                }
            }["ShiftManager.useMemo[assignmentMap]"]);
            return m;
        }
    }["ShiftManager.useMemo[assignmentMap]"], [
        assignments
    ]);
    // assignments grouped by date for calendar view
    const assignmentsByDate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ShiftManager.useMemo[assignmentsByDate]": ()=>{
            const m = {};
            assignments.forEach({
                "ShiftManager.useMemo[assignmentsByDate]": (a)=>{
                    if (!a || !a.date) return;
                    if (!m[a.date]) m[a.date] = [];
                    m[a.date].push(a);
                }
            }["ShiftManager.useMemo[assignmentsByDate]"]);
            return m;
        }
    }["ShiftManager.useMemo[assignmentsByDate]"], [
        assignments
    ]);
    // view mode: 'schedule' (list per shift) or 'calendar' (month view)
    const [viewMode, setViewMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('schedule');
    // calendar month state (based on selectedDate)
    const [calendarMonth, setCalendarMonth] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "ShiftManager.useState": ()=>{
            const d = new Date(selectedDate);
            return new Date(d.getFullYear(), d.getMonth(), 1);
        }
    }["ShiftManager.useState"]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ShiftManager.useEffect": ()=>{
            const d = new Date(selectedDate);
            setCalendarMonth(new Date(d.getFullYear(), d.getMonth(), 1));
        }
    }["ShiftManager.useEffect"], [
        selectedDate
    ]);
    function prevMonth() {
        setCalendarMonth((m)=>new Date(m.getFullYear(), m.getMonth() - 1, 1));
    }
    function nextMonth() {
        setCalendarMonth((m)=>new Date(m.getFullYear(), m.getMonth() + 1, 1));
    }
    function buildMonthDays(monthStart) {
        const startDay = new Date(monthStart);
        const firstDow = startDay.getDay(); // 0=Sun..6=Sat
        // normalize to Monday-first if desired; keep Sunday-first here
        const days = [];
        // Backfill previous month days
        for(let i = 0; i < firstDow; i++){
            const dt = new Date(startDay.getFullYear(), startDay.getMonth(), i - firstDow + 1);
            days.push({
                date: dt,
                inMonth: false
            });
        }
        // current month
        const month = startDay.getMonth();
        for(let d = 1; d <= 31; d++){
            const dt = new Date(startDay.getFullYear(), month, d);
            if (dt.getMonth() !== month) break;
            days.push({
                date: dt,
                inMonth: true
            });
        }
        // fill to complete weeks (multiple of 7)
        while(days.length % 7 !== 0){
            const last = days[days.length - 1].date;
            const dt = new Date(last.getFullYear(), last.getMonth(), last.getDate() + 1);
            days.push({
                date: dt,
                inMonth: false
            });
        }
        return days;
    }
    const monthDays = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ShiftManager.useMemo[monthDays]": ()=>buildMonthDays(calendarMonth)
    }["ShiftManager.useMemo[monthDays]"], [
        calendarMonth
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            display: 'flex',
            gap: 20
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    width: 420
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            marginBottom: 12
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                style: {
                                    display: 'block',
                                    marginBottom: 6
                                },
                                children: "Site"
                            }, void 0, false, {
                                fileName: "[project]/web/components/ShiftManager.jsx",
                                lineNumber: 236,
                                columnNumber: 11
                            }, this),
                            sites.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    padding: 12,
                                    border: '1px dashed #eee',
                                    borderRadius: 6,
                                    color: '#666'
                                },
                                children: "Tidak ada site terdaftar. Pastikan pengguna memiliki field `site` pada profil mereka."
                            }, void 0, false, {
                                fileName: "[project]/web/components/ShiftManager.jsx",
                                lineNumber: 238,
                                columnNumber: 13
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                value: site,
                                onChange: (e)=>setSite(e.target.value),
                                style: {
                                    width: '100%',
                                    padding: 8
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "",
                                        children: "-- pilih site --"
                                    }, void 0, false, {
                                        fileName: "[project]/web/components/ShiftManager.jsx",
                                        lineNumber: 243,
                                        columnNumber: 15
                                    }, this),
                                    sites.map((s)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: s,
                                            children: s
                                        }, s, false, {
                                            fileName: "[project]/web/components/ShiftManager.jsx",
                                            lineNumber: 244,
                                            columnNumber: 31
                                        }, this))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/web/components/ShiftManager.jsx",
                                lineNumber: 242,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/web/components/ShiftManager.jsx",
                        lineNumber: 235,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            border: '1px solid #eee',
                            padding: 12,
                            borderRadius: 8,
                            marginBottom: 12,
                            background: '#fff'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                style: {
                                    marginTop: 0
                                },
                                children: "Create Group"
                            }, void 0, false, {
                                fileName: "[project]/web/components/ShiftManager.jsx",
                                lineNumber: 250,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    marginBottom: 8
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    placeholder: "Group name",
                                    value: groupName,
                                    onChange: (e)=>setGroupName(e.target.value),
                                    style: {
                                        width: '100%',
                                        padding: 8
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/web/components/ShiftManager.jsx",
                                    lineNumber: 252,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/web/components/ShiftManager.jsx",
                                lineNumber: 251,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    maxHeight: 260,
                                    overflow: 'auto',
                                    border: '1px solid #f2f2f2',
                                    padding: 8
                                },
                                children: [
                                    users.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            color: '#777'
                                        },
                                        children: "No technicians for this site"
                                    }, void 0, false, {
                                        fileName: "[project]/web/components/ShiftManager.jsx",
                                        lineNumber: 256,
                                        columnNumber: 36
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            marginBottom: 8
                                        },
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            placeholder: "Cari teknisi (nama atau NIPP)",
                                            value: techQuery,
                                            onChange: (e)=>setTechQuery(e.target.value),
                                            style: {
                                                width: '100%',
                                                padding: 8
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/web/components/ShiftManager.jsx",
                                            lineNumber: 258,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/web/components/ShiftManager.jsx",
                                        lineNumber: 257,
                                        columnNumber: 13
                                    }, this),
                                    users.filter((u)=>{
                                        if (!techQuery) return true;
                                        const q = techQuery.toLowerCase();
                                        return (u.name || '').toLowerCase().includes(q) || String(u.nipp || '').includes(q);
                                    }).map((u)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            style: {
                                                display: 'flex',
                                                gap: 8,
                                                alignItems: 'center',
                                                padding: '6px 4px'
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "checkbox",
                                                    checked: selectedUsers.has(u.id),
                                                    onChange: ()=>toggleUserSelection(u.id)
                                                }, void 0, false, {
                                                    fileName: "[project]/web/components/ShiftManager.jsx",
                                                    lineNumber: 266,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            style: {
                                                                fontWeight: 700
                                                            },
                                                            children: u.name || u.nipp || u.email
                                                        }, void 0, false, {
                                                            fileName: "[project]/web/components/ShiftManager.jsx",
                                                            lineNumber: 268,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            style: {
                                                                fontSize: 12,
                                                                color: '#666'
                                                            },
                                                            children: [
                                                                u.nipp,
                                                                " • ",
                                                                u.role
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/web/components/ShiftManager.jsx",
                                                            lineNumber: 269,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/web/components/ShiftManager.jsx",
                                                    lineNumber: 267,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, u.id, true, {
                                            fileName: "[project]/web/components/ShiftManager.jsx",
                                            lineNumber: 265,
                                            columnNumber: 15
                                        }, this))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/web/components/ShiftManager.jsx",
                                lineNumber: 255,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    marginTop: 8,
                                    textAlign: 'right'
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: createGroup,
                                    style: {
                                        padding: '8px 12px'
                                    },
                                    children: "Create"
                                }, void 0, false, {
                                    fileName: "[project]/web/components/ShiftManager.jsx",
                                    lineNumber: 276,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/web/components/ShiftManager.jsx",
                                lineNumber: 275,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/web/components/ShiftManager.jsx",
                        lineNumber: 249,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            border: '1px solid #eee',
                            padding: 12,
                            borderRadius: 8,
                            marginBottom: 12,
                            background: '#fff'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                style: {
                                    marginTop: 0
                                },
                                children: "Existing Groups"
                            }, void 0, false, {
                                fileName: "[project]/web/components/ShiftManager.jsx",
                                lineNumber: 281,
                                columnNumber: 11
                            }, this),
                            groups.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    color: '#666'
                                },
                                children: "No groups created yet."
                            }, void 0, false, {
                                fileName: "[project]/web/components/ShiftManager.jsx",
                                lineNumber: 283,
                                columnNumber: 13
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'grid',
                                    gap: 8
                                },
                                children: groups.map((g)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            padding: 8,
                                            border: '1px solid #f1f1f1',
                                            borderRadius: 6
                                        },
                                        children: editGroupId === g.id ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'space-between'
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            value: editGroupName,
                                                            onChange: (e)=>setEditGroupName(e.target.value),
                                                            style: {
                                                                flex: 1,
                                                                padding: 8,
                                                                marginRight: 8
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "[project]/web/components/ShiftManager.jsx",
                                                            lineNumber: 291,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            style: {
                                                                color: '#666',
                                                                fontSize: 12
                                                            },
                                                            children: [
                                                                g.site || '',
                                                                " • ",
                                                                g.members?.length || 0,
                                                                " members"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/web/components/ShiftManager.jsx",
                                                            lineNumber: 292,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/web/components/ShiftManager.jsx",
                                                    lineNumber: 290,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        marginTop: 8,
                                                        maxHeight: 180,
                                                        overflow: 'auto',
                                                        border: '1px solid #f8f8f8',
                                                        padding: 8
                                                    },
                                                    children: users.filter((u)=>(u.role || '').toLowerCase() === 'technician').map((u)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            style: {
                                                                display: 'flex',
                                                                gap: 8,
                                                                alignItems: 'center',
                                                                padding: '4px 0'
                                                            },
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "checkbox",
                                                                    checked: editGroupSelectedUsers.has(u.id),
                                                                    onChange: ()=>toggleEditUserSelection(u.id)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/web/components/ShiftManager.jsx",
                                                                    lineNumber: 297,
                                                                    columnNumber: 29
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            style: {
                                                                                fontWeight: 700
                                                                            },
                                                                            children: u.name || u.nipp || u.email
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/web/components/ShiftManager.jsx",
                                                                            lineNumber: 299,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            style: {
                                                                                fontSize: 12,
                                                                                color: '#666'
                                                                            },
                                                                            children: u.nipp
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/web/components/ShiftManager.jsx",
                                                                            lineNumber: 300,
                                                                            columnNumber: 31
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/web/components/ShiftManager.jsx",
                                                                    lineNumber: 298,
                                                                    columnNumber: 29
                                                                }, this)
                                                            ]
                                                        }, u.id, true, {
                                                            fileName: "[project]/web/components/ShiftManager.jsx",
                                                            lineNumber: 296,
                                                            columnNumber: 27
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/web/components/ShiftManager.jsx",
                                                    lineNumber: 294,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        marginTop: 8,
                                                        textAlign: 'right'
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: saveEditGroup,
                                                            style: {
                                                                padding: '6px 10px',
                                                                marginRight: 8
                                                            },
                                                            children: "Save"
                                                        }, void 0, false, {
                                                            fileName: "[project]/web/components/ShiftManager.jsx",
                                                            lineNumber: 306,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: cancelEditGroup,
                                                            style: {
                                                                padding: '6px 10px'
                                                            },
                                                            children: "Cancel"
                                                        }, void 0, false, {
                                                            fileName: "[project]/web/components/ShiftManager.jsx",
                                                            lineNumber: 307,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/web/components/ShiftManager.jsx",
                                                    lineNumber: 305,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/web/components/ShiftManager.jsx",
                                            lineNumber: 289,
                                            columnNumber: 21
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'space-between'
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            style: {
                                                                fontWeight: 700
                                                            },
                                                            children: g.name
                                                        }, void 0, false, {
                                                            fileName: "[project]/web/components/ShiftManager.jsx",
                                                            lineNumber: 313,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            style: {
                                                                color: '#666',
                                                                fontSize: 12
                                                            },
                                                            children: [
                                                                g.site || '',
                                                                " • ",
                                                                g.members?.length || 0,
                                                                " members"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/web/components/ShiftManager.jsx",
                                                            lineNumber: 314,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/web/components/ShiftManager.jsx",
                                                    lineNumber: 312,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        marginTop: 8
                                                    },
                                                    children: (g.members || []).map((id)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            style: {
                                                                fontSize: 13
                                                            },
                                                            children: usersById[id]?.name || usersById[id]?.nipp || id
                                                        }, id, false, {
                                                            fileName: "[project]/web/components/ShiftManager.jsx",
                                                            lineNumber: 318,
                                                            columnNumber: 27
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/web/components/ShiftManager.jsx",
                                                    lineNumber: 316,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        marginTop: 8,
                                                        textAlign: 'right'
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>startEditGroup(g),
                                                            style: {
                                                                padding: '6px 10px',
                                                                marginRight: 8
                                                            },
                                                            children: "Edit"
                                                        }, void 0, false, {
                                                            fileName: "[project]/web/components/ShiftManager.jsx",
                                                            lineNumber: 322,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: async ()=>{
                                                                if (!confirm(`Hapus grup "${g.name}"? Ini juga akan menghapus penugasan shift yang terkait.`)) return;
                                                                try {
                                                                    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(`/shift-groups/${g.id}`, {
                                                                        method: 'DELETE'
                                                                    });
                                                                    await loadGroups();
                                                                    await loadAssignments();
                                                                    alert('Group deleted');
                                                                } catch (err) {
                                                                    console.error('delete group', err);
                                                                    alert('Failed to delete group');
                                                                }
                                                            },
                                                            style: {
                                                                padding: '6px 10px'
                                                            },
                                                            children: "Delete"
                                                        }, void 0, false, {
                                                            fileName: "[project]/web/components/ShiftManager.jsx",
                                                            lineNumber: 323,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/web/components/ShiftManager.jsx",
                                                    lineNumber: 321,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/web/components/ShiftManager.jsx",
                                            lineNumber: 311,
                                            columnNumber: 21
                                        }, this)
                                    }, g.id, false, {
                                        fileName: "[project]/web/components/ShiftManager.jsx",
                                        lineNumber: 287,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/web/components/ShiftManager.jsx",
                                lineNumber: 285,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/web/components/ShiftManager.jsx",
                        lineNumber: 280,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            border: '1px solid #eee',
                            padding: 12,
                            borderRadius: 8,
                            background: '#fff'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                style: {
                                    marginTop: 0
                                },
                                children: "Assign Group to Shift"
                            }, void 0, false, {
                                fileName: "[project]/web/components/ShiftManager.jsx",
                                lineNumber: 344,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    gap: 8,
                                    marginBottom: 8
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "date",
                                        value: selectedDate,
                                        onChange: (e)=>setSelectedDate(e.target.value),
                                        style: {
                                            padding: 8
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/web/components/ShiftManager.jsx",
                                        lineNumber: 346,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        value: selectedShift,
                                        onChange: (e)=>setSelectedShift(Number(e.target.value)),
                                        style: {
                                            padding: 8
                                        },
                                        children: SHIFT_DEFS.map((s)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: s.id,
                                                children: [
                                                    s.label,
                                                    " — ",
                                                    s.time
                                                ]
                                            }, s.id, true, {
                                                fileName: "[project]/web/components/ShiftManager.jsx",
                                                lineNumber: 348,
                                                columnNumber: 36
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/web/components/ShiftManager.jsx",
                                        lineNumber: 347,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/web/components/ShiftManager.jsx",
                                lineNumber: 345,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    marginBottom: 8
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                    value: selectedGroupToAssign,
                                    onChange: (e)=>setSelectedGroupToAssign(e.target.value),
                                    style: {
                                        width: '100%',
                                        padding: 8
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: "",
                                            children: "-- pilih grup --"
                                        }, void 0, false, {
                                            fileName: "[project]/web/components/ShiftManager.jsx",
                                            lineNumber: 354,
                                            columnNumber: 15
                                        }, this),
                                        groups.map((g)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: g.id,
                                                children: [
                                                    g.name,
                                                    " (",
                                                    g.members?.length || 0,
                                                    ")"
                                                ]
                                            }, g.id, true, {
                                                fileName: "[project]/web/components/ShiftManager.jsx",
                                                lineNumber: 355,
                                                columnNumber: 32
                                            }, this))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/web/components/ShiftManager.jsx",
                                    lineNumber: 353,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/web/components/ShiftManager.jsx",
                                lineNumber: 352,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    textAlign: 'right'
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: assignGroup,
                                    style: {
                                        padding: '8px 12px'
                                    },
                                    children: "Assign"
                                }, void 0, false, {
                                    fileName: "[project]/web/components/ShiftManager.jsx",
                                    lineNumber: 359,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/web/components/ShiftManager.jsx",
                                lineNumber: 358,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/web/components/ShiftManager.jsx",
                        lineNumber: 343,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/web/components/ShiftManager.jsx",
                lineNumber: 234,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    flex: 1
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            marginBottom: 12,
                            display: 'flex',
                            gap: 12,
                            alignItems: 'center'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                style: {
                                    margin: 0
                                },
                                children: viewMode === 'calendar' ? 'Calendar' : `Schedule — ${selectedDate}`
                            }, void 0, false, {
                                fileName: "[project]/web/components/ShiftManager.jsx",
                                lineNumber: 366,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    marginLeft: 12,
                                    display: 'flex',
                                    gap: 8
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setViewMode('schedule'),
                                        style: {
                                            padding: '6px 10px',
                                            background: viewMode === 'schedule' ? '#e6f0ff' : undefined
                                        },
                                        children: "Schedule"
                                    }, void 0, false, {
                                        fileName: "[project]/web/components/ShiftManager.jsx",
                                        lineNumber: 368,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setViewMode('calendar'),
                                        style: {
                                            padding: '6px 10px',
                                            background: viewMode === 'calendar' ? '#e6f0ff' : undefined
                                        },
                                        children: "Calendar"
                                    }, void 0, false, {
                                        fileName: "[project]/web/components/ShiftManager.jsx",
                                        lineNumber: 369,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/web/components/ShiftManager.jsx",
                                lineNumber: 367,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    marginLeft: 'auto',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 8
                                },
                                children: viewMode === 'calendar' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: prevMonth,
                                            style: {
                                                padding: '6px 10px'
                                            },
                                            children: "◀"
                                        }, void 0, false, {
                                            fileName: "[project]/web/components/ShiftManager.jsx",
                                            lineNumber: 374,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                minWidth: 200,
                                                textAlign: 'center',
                                                fontWeight: 700
                                            },
                                            children: calendarMonth.toLocaleString(undefined, {
                                                month: 'long',
                                                year: 'numeric'
                                            })
                                        }, void 0, false, {
                                            fileName: "[project]/web/components/ShiftManager.jsx",
                                            lineNumber: 375,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: nextMonth,
                                            style: {
                                                padding: '6px 10px'
                                            },
                                            children: "▶"
                                        }, void 0, false, {
                                            fileName: "[project]/web/components/ShiftManager.jsx",
                                            lineNumber: 376,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "date",
                                    value: selectedDate,
                                    onChange: (e)=>setSelectedDate(e.target.value)
                                }, void 0, false, {
                                    fileName: "[project]/web/components/ShiftManager.jsx",
                                    lineNumber: 379,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/web/components/ShiftManager.jsx",
                                lineNumber: 371,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/web/components/ShiftManager.jsx",
                        lineNumber: 365,
                        columnNumber: 9
                    }, this),
                    viewMode === 'calendar' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'grid',
                            gap: 8
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(7, 1fr)',
                                    gap: 4,
                                    marginBottom: 4,
                                    textAlign: 'center',
                                    color: '#555'
                                },
                                children: [
                                    'Sun',
                                    'Mon',
                                    'Tue',
                                    'Wed',
                                    'Thu',
                                    'Fri',
                                    'Sat'
                                ].map((d)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontWeight: 700
                                        },
                                        children: d
                                    }, d, false, {
                                        fileName: "[project]/web/components/ShiftManager.jsx",
                                        lineNumber: 386,
                                        columnNumber: 69
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/web/components/ShiftManager.jsx",
                                lineNumber: 385,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(7, 1fr)',
                                    gap: 8
                                },
                                children: monthDays.map(({ date, inMonth })=>{
                                    const dStr = date.toISOString().slice(0, 10);
                                    const dayAssigns = assignmentsByDate[dStr] || [];
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        onClick: ()=>{
                                            setSelectedDate(dStr);
                                            setViewMode('schedule');
                                        },
                                        style: {
                                            minHeight: 120,
                                            padding: 8,
                                            borderRadius: 6,
                                            background: inMonth ? '#fff' : '#fafafa',
                                            border: '1px solid #eee',
                                            cursor: 'pointer'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center'
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            fontWeight: 700
                                                        },
                                                        children: date.getDate()
                                                    }, void 0, false, {
                                                        fileName: "[project]/web/components/ShiftManager.jsx",
                                                        lineNumber: 395,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            fontSize: 11,
                                                            color: '#999'
                                                        },
                                                        children: dStr === new Date().toISOString().slice(0, 10) ? 'Today' : ''
                                                    }, void 0, false, {
                                                        fileName: "[project]/web/components/ShiftManager.jsx",
                                                        lineNumber: 396,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/web/components/ShiftManager.jsx",
                                                lineNumber: 394,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    marginTop: 8,
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    gap: 6
                                                },
                                                children: SHIFT_DEFS.map((s)=>{
                                                    const sAssigns = dayAssigns.filter((a)=>Number(a.shift) === s.id);
                                                    return sAssigns.length === 0 ? null : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            gap: 4
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    fontSize: 12,
                                                                    color: '#444',
                                                                    fontWeight: 600
                                                                },
                                                                children: s.label
                                                            }, void 0, false, {
                                                                fileName: "[project]/web/components/ShiftManager.jsx",
                                                                lineNumber: 403,
                                                                columnNumber: 29
                                                            }, this),
                                                            sAssigns.map((sa)=>{
                                                                const group = groupsById[sa.groupId];
                                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Badge, {
                                                                        color: "#2563eb",
                                                                        children: group ? group.name : `Group ${sa.groupId}`
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/web/components/ShiftManager.jsx",
                                                                        lineNumber: 406,
                                                                        columnNumber: 56
                                                                    }, this)
                                                                }, sa.id, false, {
                                                                    fileName: "[project]/web/components/ShiftManager.jsx",
                                                                    lineNumber: 406,
                                                                    columnNumber: 39
                                                                }, this);
                                                            })
                                                        ]
                                                    }, s.id, true, {
                                                        fileName: "[project]/web/components/ShiftManager.jsx",
                                                        lineNumber: 402,
                                                        columnNumber: 27
                                                    }, this);
                                                })
                                            }, void 0, false, {
                                                fileName: "[project]/web/components/ShiftManager.jsx",
                                                lineNumber: 398,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, dStr, true, {
                                        fileName: "[project]/web/components/ShiftManager.jsx",
                                        lineNumber: 393,
                                        columnNumber: 19
                                    }, this);
                                })
                            }, void 0, false, {
                                fileName: "[project]/web/components/ShiftManager.jsx",
                                lineNumber: 388,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/web/components/ShiftManager.jsx",
                        lineNumber: 384,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'grid',
                            gap: 12
                        },
                        children: SHIFT_DEFS.map((s)=>{
                            const assigns = assignmentMap[s.id] || [];
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    border: '1px solid #eee',
                                    borderRadius: 8,
                                    padding: 12,
                                    background: '#fff',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontWeight: 800
                                                },
                                                children: [
                                                    s.label,
                                                    " ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            fontWeight: 400,
                                                            color: '#666',
                                                            marginLeft: 8
                                                        },
                                                        children: s.time
                                                    }, void 0, false, {
                                                        fileName: "[project]/web/components/ShiftManager.jsx",
                                                        lineNumber: 424,
                                                        columnNumber: 61
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/web/components/ShiftManager.jsx",
                                                lineNumber: 424,
                                                columnNumber: 19
                                            }, this),
                                            assigns.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    marginTop: 6
                                                },
                                                children: assigns.map((ass)=>{
                                                    const group = groupsById[ass.groupId];
                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            marginTop: 8
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Badge, {
                                                                color: "#2563eb",
                                                                children: group ? group.name : `Group ${ass.groupId}`
                                                            }, void 0, false, {
                                                                fileName: "[project]/web/components/ShiftManager.jsx",
                                                                lineNumber: 431,
                                                                columnNumber: 29
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    marginTop: 6,
                                                                    color: '#444'
                                                                },
                                                                children: [
                                                                    (group?.members || []).slice(0, 5).map((id)=>{
                                                                        const u = usersById[id] || {
                                                                            name: id
                                                                        };
                                                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            style: {
                                                                                fontSize: 13
                                                                            },
                                                                            children: u.name || u.nipp || id
                                                                        }, id, false, {
                                                                            fileName: "[project]/web/components/ShiftManager.jsx",
                                                                            lineNumber: 435,
                                                                            columnNumber: 40
                                                                        }, this);
                                                                    }),
                                                                    group?.members && group.members.length > 5 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        style: {
                                                                            fontSize: 12,
                                                                            color: '#666'
                                                                        },
                                                                        children: [
                                                                            "+",
                                                                            group.members.length - 5,
                                                                            " more"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/web/components/ShiftManager.jsx",
                                                                        lineNumber: 437,
                                                                        columnNumber: 78
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/web/components/ShiftManager.jsx",
                                                                lineNumber: 432,
                                                                columnNumber: 29
                                                            }, this)
                                                        ]
                                                    }, ass.id, true, {
                                                        fileName: "[project]/web/components/ShiftManager.jsx",
                                                        lineNumber: 430,
                                                        columnNumber: 27
                                                    }, this);
                                                })
                                            }, void 0, false, {
                                                fileName: "[project]/web/components/ShiftManager.jsx",
                                                lineNumber: 426,
                                                columnNumber: 21
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    marginTop: 6,
                                                    color: '#777'
                                                },
                                                children: "Not assigned"
                                            }, void 0, false, {
                                                fileName: "[project]/web/components/ShiftManager.jsx",
                                                lineNumber: 444,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/web/components/ShiftManager.jsx",
                                        lineNumber: 423,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            textAlign: 'right'
                                        },
                                        children: assigns.map((ass)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    marginBottom: 12
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            fontSize: 13,
                                                            color: '#666'
                                                        },
                                                        children: `assigned by ${ass.created_by || '—'}`
                                                    }, void 0, false, {
                                                        fileName: "[project]/web/components/ShiftManager.jsx",
                                                        lineNumber: 451,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            marginTop: 8
                                                        },
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: async ()=>{
                                                                if (!confirm('Remove assignment?')) return;
                                                                try {
                                                                    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(`/shift-assignments/${ass.id}`, {
                                                                        method: 'DELETE'
                                                                    });
                                                                    await loadAssignments();
                                                                    alert('Removed');
                                                                } catch (err) {
                                                                    console.error(err);
                                                                    alert('Failed');
                                                                }
                                                            },
                                                            children: "Remove"
                                                        }, void 0, false, {
                                                            fileName: "[project]/web/components/ShiftManager.jsx",
                                                            lineNumber: 453,
                                                            columnNumber: 25
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/web/components/ShiftManager.jsx",
                                                        lineNumber: 452,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, ass.id, true, {
                                                fileName: "[project]/web/components/ShiftManager.jsx",
                                                lineNumber: 450,
                                                columnNumber: 21
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/web/components/ShiftManager.jsx",
                                        lineNumber: 448,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, s.id, true, {
                                fileName: "[project]/web/components/ShiftManager.jsx",
                                lineNumber: 422,
                                columnNumber: 15
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/web/components/ShiftManager.jsx",
                        lineNumber: 418,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/web/components/ShiftManager.jsx",
                lineNumber: 364,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/web/components/ShiftManager.jsx",
        lineNumber: 233,
        columnNumber: 5
    }, this);
}
_s(ShiftManager, "u/CqW2pYxzQnN/8BeMe1XqWd+ig=");
_c1 = ShiftManager;
var _c, _c1;
__turbopack_context__.k.register(_c, "Badge");
__turbopack_context__.k.register(_c1, "ShiftManager");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/web/app/shifts/page.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Page
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$components$2f$ShiftManager$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/components/ShiftManager.jsx [app-client] (ecmascript)");
'use client';
;
;
;
function Page() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            padding: 20,
            fontFamily: 'Inter, system-ui, -apple-system, Roboto, "Helvetica Neue", Arial'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                style: {
                    marginTop: 0
                },
                children: "Shift Management"
            }, void 0, false, {
                fileName: "[project]/web/app/shifts/page.jsx",
                lineNumber: 8,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                style: {
                    color: '#555'
                },
                children: "Create technician groups and assign them to daily shifts per site."
            }, void 0, false, {
                fileName: "[project]/web/app/shifts/page.jsx",
                lineNumber: 9,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$components$2f$ShiftManager$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/web/app/shifts/page.jsx",
                lineNumber: 10,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/web/app/shifts/page.jsx",
        lineNumber: 7,
        columnNumber: 5
    }, this);
}
_c = Page;
var _c;
__turbopack_context__.k.register(_c, "Page");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=web_118dce23._.js.map