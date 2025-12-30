(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/web/app/monitor/page.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Monitor
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/material/Box/Box.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$Paper$2f$Paper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/material/Paper/Paper.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$Grid$2f$Grid$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/material/Grid/Grid.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/material/Typography/Typography.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$List$2f$List$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/material/List/List.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$ListItem$2f$ListItem$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/material/ListItem/ListItem.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$ListItemText$2f$ListItemText$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/material/ListItemText/ListItemText.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$Divider$2f$Divider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/material/Divider/Divider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$Button$2f$Button$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/material/Button/Button.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$TextField$2f$TextField$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/material/TextField/TextField.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$Chip$2f$Chip$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/material/Chip/Chip.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/lib/api-client.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
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
function toYMD(d) {
    const dt = new Date(d);
    if (isNaN(dt.getTime())) return '';
    return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
}
function Monitor() {
    _s();
    const today = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "Monitor.useMemo[today]": ()=>{
            const d = new Date();
            return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        }
    }["Monitor.useMemo[today]"], []);
    const [date, setDate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(today);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [groups, setGroups] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [usersCache, setUsersCache] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Monitor.useEffect": ()=>{
            load();
        }
    }["Monitor.useEffect"], [
        date
    ]);
    async function load() {
        setLoading(true);
        try {
            const res = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])('/assignments');
            const items = res || [];
            // filter by selected date: prefer assignment.scheduledAt, else workorder.start_date, startedAt, or createdAt
            let filtered = (items || []).filter((it)=>{
                const sched = it.scheduledAt || it.wo && it.wo.start_date || it.startedAt || it.createdAt || null;
                if (!sched) return false;
                return toYMD(sched) === date;
            });
            // also fetch work orders and include those scheduled for the date that are NOT deployed
            try {
                const woRes = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(`/work-orders?page=1&pageSize=2000`);
                const wos = woRes?.data ?? woRes ?? [];
                const extra = (wos || []).filter((wo)=>{
                    const s = wo.start_date || wo.raw?.start_date || null;
                    if (!s) return false;
                    const matchDate = toYMD(s) === date;
                    const isDeployed = String(wo.status || wo.raw && wo.raw.status || '').toUpperCase() === 'DEPLOYED';
                    return matchDate && !isDeployed;
                }).map((wo)=>{
                    // try to extract assigned technician names or nipp from raw.labours
                    const assignedNames = [];
                    try {
                        const labs = wo.raw && Array.isArray(wo.raw.labours) ? wo.raw.labours : wo.raw && Array.isArray(wo.raw.labors) ? wo.raw.labors : [];
                        for (const lab of labs){
                            const personils = lab && Array.isArray(lab.personils) ? lab.personils : lab && Array.isArray(lab.personnel) ? lab.personnel : [];
                            for (const p of personils){
                                const name = p?.personil?.name || p?.name || p?.personil?.displayName || null;
                                const nip = p?.nipp || p?.nip || p?.personil?.nip || null;
                                if (name) assignedNames.push(name);
                                else if (nip) assignedNames.push(String(nip));
                            }
                        }
                    } catch (e) {}
                    return {
                        id: `wo-${wo.id}`,
                        wo,
                        assigneeId: undefined,
                        scheduledAt: wo.start_date || wo.raw?.start_date || null,
                        task_name: null,
                        createdAt: wo.createdAt || null,
                        assignedNames,
                        deployed: false
                    };
                });
                // merge extra into filtered (avoid duplicates by workorder id)
                const existingWoIds = new Set(filtered.map((f)=>f.wo && f.wo.id ? String(f.wo.id) : f.id));
                for (const e of extra){
                    const wid = e.wo && e.wo.id ? String(e.wo.id) : e.id;
                    if (!existingWoIds.has(wid)) filtered.push(e);
                }
            } catch (e) {
                console.warn('failed to load workorders for monitor', e);
            }
            // load users for assignees
            const ids = Array.from(new Set(filtered.map((f)=>f.assigneeId).filter(Boolean)));
            const cache = {
                ...usersCache
            };
            for (const id of ids){
                if (!cache[id]) {
                    try {
                        const ures = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(`/users/${encodeURIComponent(id)}`);
                        cache[id] = ures?.data || ures || {
                            id
                        };
                    } catch (e) {
                        cache[id] = {
                            id
                        };
                    }
                }
            }
            setUsersCache(cache);
            // normalize workorder status and ensure assignedNames exists
            // treat READY / ASSIGNED the same as DEPLOYED for display purposes (badge differs)
            for (const it of filtered){
                const rawStatus = it.wo && (it.wo.status || it.wo.raw && it.wo.raw.status) || it.status || '';
                const norm = String(rawStatus || '').trim().toUpperCase();
                it.woStatus = norm || 'UNKNOWN';
                // show as deployed-like for these statuses so they appear in monitor
                it.deployed = norm === 'DEPLOYED' || norm === 'ASSIGNED' || norm.includes('READY');
                if (!Array.isArray(it.assignedNames)) it.assignedNames = [];
            }
            // group by assigneeId
            const byUser = {};
            for (const it of filtered){
                const aid = it.assigneeId || 'unassigned';
                if (!byUser[aid]) byUser[aid] = [];
                byUser[aid].push(it);
            }
            setGroups(byUser);
        } catch (e) {
            console.error('load monitor', e);
        } finally{
            setLoading(false);
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
        sx: {
            p: 2
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                sx: {
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        variant: "h5",
                        children: "Monitoring Teknisi"
                    }, void 0, false, {
                        fileName: "[project]/web/app/monitor/page.jsx",
                        lineNumber: 133,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        sx: {
                            display: 'flex',
                            gap: 1,
                            alignItems: 'center'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$TextField$2f$TextField$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                size: "small",
                                label: "Tanggal",
                                type: "date",
                                value: date,
                                onChange: (e)=>setDate(e.target.value),
                                InputLabelProps: {
                                    shrink: true
                                }
                            }, void 0, false, {
                                fileName: "[project]/web/app/monitor/page.jsx",
                                lineNumber: 135,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$Button$2f$Button$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                variant: "contained",
                                size: "small",
                                onClick: load,
                                children: "Refresh"
                            }, void 0, false, {
                                fileName: "[project]/web/app/monitor/page.jsx",
                                lineNumber: 136,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/web/app/monitor/page.jsx",
                        lineNumber: 134,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/web/app/monitor/page.jsx",
                lineNumber: 132,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$Grid$2f$Grid$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                container: true,
                spacing: 2,
                children: [
                    Object.keys(groups).length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$Grid$2f$Grid$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        item: true,
                        xs: 12,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$Paper$2f$Paper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            sx: {
                                p: 2
                            },
                            children: "No assignments for selected date."
                        }, void 0, false, {
                            fileName: "[project]/web/app/monitor/page.jsx",
                            lineNumber: 141,
                            columnNumber: 65
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/web/app/monitor/page.jsx",
                        lineNumber: 141,
                        columnNumber: 46
                    }, this),
                    Object.entries(groups).map(([aid, arr])=>{
                        const user = usersCache[aid] || {
                            id: aid,
                            name: aid
                        };
                        arr.sort((a, b)=>new Date(a.scheduledAt || a.wo?.start_date || a.createdAt).getTime() - new Date(b.scheduledAt || b.wo?.start_date || b.createdAt).getTime());
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$Grid$2f$Grid$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            item: true,
                            xs: 12,
                            md: 6,
                            lg: 4,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$Paper$2f$Paper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                sx: {
                                    p: 2
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        sx: {
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                        variant: "subtitle1",
                                                        children: user.name || user.displayName || user.email || aid
                                                    }, void 0, false, {
                                                        fileName: "[project]/web/app/monitor/page.jsx",
                                                        lineNumber: 150,
                                                        columnNumber: 27
                                                    }, this),
                                                    Array.isArray(arr[0]?.assignedNames) && arr[0].assignedNames.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                        variant: "caption",
                                                        sx: {
                                                            color: '#666'
                                                        },
                                                        children: arr[0].assignedNames.join(', ')
                                                    }, void 0, false, {
                                                        fileName: "[project]/web/app/monitor/page.jsx",
                                                        lineNumber: 152,
                                                        columnNumber: 29
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/web/app/monitor/page.jsx",
                                                lineNumber: 149,
                                                columnNumber: 25
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                sx: {
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 1
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$Chip$2f$Chip$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                        label: arr[0]?.woStatus || (arr[0]?.deployed ? 'DEPLOYED' : 'NOT DEPLOYED'),
                                                        size: "small",
                                                        color: arr[0]?.woStatus === 'DEPLOYED' ? 'success' : arr[0]?.woStatus === 'ASSIGNED' ? 'info' : (arr[0]?.woStatus || '').includes('READY') ? 'warning' : 'default'
                                                    }, void 0, false, {
                                                        fileName: "[project]/web/app/monitor/page.jsx",
                                                        lineNumber: 156,
                                                        columnNumber: 27
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                        variant: "caption",
                                                        children: [
                                                            arr.length,
                                                            " tugas"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/web/app/monitor/page.jsx",
                                                        lineNumber: 165,
                                                        columnNumber: 27
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/web/app/monitor/page.jsx",
                                                lineNumber: 155,
                                                columnNumber: 25
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/web/app/monitor/page.jsx",
                                        lineNumber: 148,
                                        columnNumber: 23
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$Divider$2f$Divider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        sx: {
                                            my: 1
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/web/app/monitor/page.jsx",
                                        lineNumber: 168,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$List$2f$List$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        dense: true,
                                        children: arr.map((it)=>{
                                            const t = it.scheduledAt || it.wo && it.wo.start_date || it.createdAt;
                                            const timeStr = t ? new Date(t).toLocaleTimeString([], {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            }) : '-';
                                            const doc = it.wo?.doc_no || it.wo && it.wo.id || '';
                                            const asset = it.wo?.asset_name || '';
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$ListItem$2f$ListItem$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                divider: true,
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$ListItemText$2f$ListItemText$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                    primary: `${timeStr} • ${doc}`,
                                                    secondary: `${asset} ${it.task_name ? '— ' + it.task_name : ''}`
                                                }, void 0, false, {
                                                    fileName: "[project]/web/app/monitor/page.jsx",
                                                    lineNumber: 177,
                                                    columnNumber: 25
                                                }, this)
                                            }, it.id, false, {
                                                fileName: "[project]/web/app/monitor/page.jsx",
                                                lineNumber: 176,
                                                columnNumber: 23
                                            }, this);
                                        })
                                    }, void 0, false, {
                                        fileName: "[project]/web/app/monitor/page.jsx",
                                        lineNumber: 169,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/web/app/monitor/page.jsx",
                                lineNumber: 147,
                                columnNumber: 15
                            }, this)
                        }, aid, false, {
                            fileName: "[project]/web/app/monitor/page.jsx",
                            lineNumber: 146,
                            columnNumber: 13
                        }, this);
                    })
                ]
            }, void 0, true, {
                fileName: "[project]/web/app/monitor/page.jsx",
                lineNumber: 140,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/web/app/monitor/page.jsx",
        lineNumber: 131,
        columnNumber: 5
    }, this);
}
_s(Monitor, "o0k3XPS1frn0ndrksHsuoAYFxbQ=");
_c = Monitor;
var _c;
__turbopack_context__.k.register(_c, "Monitor");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=web_app_monitor_page_jsx_0b15c8fe._.js.map