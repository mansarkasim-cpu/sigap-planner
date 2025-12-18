module.exports = [
"[project]/web/components/WorkOrderForm.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>WorkOrderForm
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/lib/api-client.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$TextField$2f$TextField$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__TextField$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/material/TextField/TextField.js [app-ssr] (ecmascript) <export default as TextField>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$Button$2f$Button$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Button$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/material/Button/Button.js [app-ssr] (ecmascript) <export default as Button>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$Stack$2f$Stack$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Stack$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/material/Stack/Stack.js [app-ssr] (ecmascript) <export default as Stack>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$Paper$2f$Paper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Paper$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/material/Paper/Paper.js [app-ssr] (ecmascript) <export default as Paper>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$Alert$2f$Alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Alert$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/material/Alert/Alert.js [app-ssr] (ecmascript) <export default as Alert>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$InputAdornment$2f$InputAdornment$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__InputAdornment$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/material/InputAdornment/InputAdornment.js [app-ssr] (ecmascript) <export default as InputAdornment>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$Save$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/icons-material/Save.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$Bolt$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/icons-material/Bolt.js [app-ssr] (ecmascript)");
'use client';
;
;
;
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$Paper$2f$Paper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Paper$3e$__["Paper"], {
        elevation: 2,
        sx: {
            p: 2,
            mb: 2
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
            onSubmit: handleSubmit,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$Stack$2f$Stack$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Stack$3e$__["Stack"], {
                direction: "row",
                spacing: 2,
                alignItems: "center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$TextField$2f$TextField$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__TextField$3e$__["TextField"], {
                        value: id,
                        onChange: (e)=>setId(e.target.value),
                        placeholder: "Masukkan id SIGAP (contoh: 1656)",
                        disabled: loading,
                        size: "small",
                        variant: "outlined",
                        sx: {
                            minWidth: 320
                        },
                        InputProps: {
                            startAdornment: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$InputAdornment$2f$InputAdornment$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__InputAdornment$3e$__["InputAdornment"], {
                                position: "start",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$Bolt$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    color: "primary"
                                }, void 0, false, {
                                    fileName: "[project]/web/components/WorkOrderForm.tsx",
                                    lineNumber: 48,
                                    columnNumber: 19
                                }, void 0)
                            }, void 0, false, {
                                fileName: "[project]/web/components/WorkOrderForm.tsx",
                                lineNumber: 47,
                                columnNumber: 17
                            }, void 0)
                        }
                    }, void 0, false, {
                        fileName: "[project]/web/components/WorkOrderForm.tsx",
                        lineNumber: 37,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$Button$2f$Button$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Button$3e$__["Button"], {
                        type: "submit",
                        variant: "contained",
                        color: "primary",
                        startIcon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$Save$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                            fileName: "[project]/web/components/WorkOrderForm.tsx",
                            lineNumber: 58,
                            columnNumber: 24
                        }, void 0),
                        disabled: loading,
                        sx: {
                            whiteSpace: 'nowrap'
                        },
                        children: loading ? 'Mengambil...' : 'Ambil & Simpan'
                    }, void 0, false, {
                        fileName: "[project]/web/components/WorkOrderForm.tsx",
                        lineNumber: 54,
                        columnNumber: 11
                    }, this),
                    message && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$Alert$2f$Alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Alert$3e$__["Alert"], {
                        severity: message.startsWith('Error') ? 'error' : 'success',
                        sx: {
                            ml: 1
                        },
                        children: message
                    }, void 0, false, {
                        fileName: "[project]/web/components/WorkOrderForm.tsx",
                        lineNumber: 66,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/web/components/WorkOrderForm.tsx",
                lineNumber: 36,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/web/components/WorkOrderForm.tsx",
            lineNumber: 35,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/web/components/WorkOrderForm.tsx",
        lineNumber: 34,
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
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$Box$2f$Box$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/material/Box/Box.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$Paper$2f$Paper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/material/Paper/Paper.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$TextField$2f$TextField$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/material/TextField/TextField.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$Autocomplete$2f$Autocomplete$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/material/Autocomplete/Autocomplete.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$Select$2f$Select$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/material/Select/Select.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$MenuItem$2f$MenuItem$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/material/MenuItem/MenuItem.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$Button$2f$Button$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/material/Button/Button.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$Dialog$2f$Dialog$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/material/Dialog/Dialog.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$DialogTitle$2f$DialogTitle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/material/DialogTitle/DialogTitle.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$DialogContent$2f$DialogContent$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/material/DialogContent/DialogContent.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$DialogActions$2f$DialogActions$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/material/DialogActions/DialogActions.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$Stack$2f$Stack$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/material/Stack/Stack.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$Table$2f$Table$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/material/Table/Table.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$TableBody$2f$TableBody$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/material/TableBody/TableBody.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$TableCell$2f$TableCell$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/material/TableCell/TableCell.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$TableContainer$2f$TableContainer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/material/TableContainer/TableContainer.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$TableHead$2f$TableHead$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/material/TableHead/TableHead.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$TableRow$2f$TableRow$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/material/TableRow/TableRow.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$Chip$2f$Chip$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/material/Chip/Chip.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$Checkbox$2f$Checkbox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/material/Checkbox/Checkbox.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$LinearProgress$2f$LinearProgress$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/material/LinearProgress/LinearProgress.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$Typography$2f$Typography$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/material/Typography/Typography.js [app-ssr] (ecmascript)");
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
;
;
;
function WorkOrderList({ onRefreshRequested }) {
    // format stored dates (possibly SQL 'YYYY-MM-DD HH:mm:ss' without timezone)
    function formatUtcDisplay(raw) {
        if (!raw) return '-';
        const s = String(raw).trim();
        // If stored as SQL-like 'YYYY-MM-DD HH:mm:ss' return the same local datetime
        const sqlRx = /^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2})(?::(\d{2}))?)?$/;
        const m = sqlRx.exec(s);
        const pad = (n)=>String(n).padStart(2, '0');
        if (m) {
            const [, yyyy, mm, dd, hh = '00', mi = '00'] = m;
            return `${pad(Number(dd))}/${pad(Number(mm))}/${yyyy} ${pad(Number(hh))}:${pad(Number(mi))}`;
        }
        // fallback: parse ISO and show local components (best-effort)
        const parsed = new Date(s);
        if (isNaN(parsed.getTime())) return '-';
        return `${pad(parsed.getDate())}/${pad(parsed.getMonth() + 1)}/${parsed.getFullYear()} ${pad(parsed.getHours())}:${pad(parsed.getMinutes())}`;
    }
    const [list, setList] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [locations, setLocations] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [locationFilter, setLocationFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [statuses, setStatuses] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [selectedStatuses, setSelectedStatuses] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [page, setPage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(1);
    const [pageSize] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(10);
    const [total, setTotal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [q, setQ] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [editing, setEditing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [editLoading, setEditLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [editNote, setEditNote] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [dateHistory, setDateHistory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [taskModal, setTaskModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        open: false,
        wo: null
    });
    const [technicians, setTechnicians] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [techQuery, setTechQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [selectedAssignees, setSelectedAssignees] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({});
    const [currentUser, setCurrentUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(undefined);
    const [editStartInput, setEditStartInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [editEndInput, setEditEndInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
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
            // apply client-side filtering by selected statuses (if any)
            if (selectedStatuses && selectedStatuses.length > 0) {
                const normSet = new Set(selectedStatuses.map((s)=>s.toString().toUpperCase().replace(/[-\s]/g, '_')));
                displayed = displayed.filter((w)=>{
                    const sRaw = (w.status ?? w.raw?.status ?? 'NEW').toString();
                    const sNorm = sRaw.toString().toUpperCase().replace(/[-\s]/g, '_');
                    return normSet.has(sNorm);
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
        selectedStatuses
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
        setEditNote('');
        setEditStartInput(toInputDatetime(w.start_date));
        setEditEndInput(toInputDatetime(w.end_date));
        // load date history for this workorder (if authenticated)
        (async ()=>{
            try {
                const h = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(`/work-orders/${encodeURIComponent(w.id)}/date-history`);
                const rows = h?.data ?? h;
                if (Array.isArray(rows)) setDateHistory(rows);
                else setDateHistory([]);
            } catch (e) {
                setDateHistory([]);
            }
        })();
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
                        // interpret stored value as UTC, then shift to backend-local (+8h) for assignment calculations
                        const BASE = new Date(Date.UTC(Number(yy), Number(mm) - 1, Number(dd), Number(hh), Number(mi), Number(ss)));
                        const BACKEND_TZ_OFFSET_HOURS = 0;
                        return new Date(BASE.getTime() + BACKEND_TZ_OFFSET_HOURS * 60 * 60 * 1000);
                    }
                    const parsed = new Date(s);
                    if (!isNaN(parsed.getTime())) {
                        const BACKEND_TZ_OFFSET_HOURS = 0;
                        return new Date(parsed.getTime() + BACKEND_TZ_OFFSET_HOURS * 60 * 60 * 1000);
                    }
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
            // accept ISO strings (from datetime-local) or null
            if (start_date !== undefined) body.start_date = start_date || null;
            if (end_date !== undefined) body.end_date = end_date || null;
            if (editNote && editNote.trim().length) body.note = editNote.trim();
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
        const s = String(iso).trim();
        const rx = /^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2})(?::(\d{2}))?)?$/;
        const m = rx.exec(s);
        const pad = (n)=>String(n).padStart(2, '0');
        if (m) {
            const [, yyyy, mm, dd, hh = '00', mi = '00'] = m;
            return `${yyyy}-${mm}-${dd}T${pad(Number(hh))}:${pad(Number(mi))}`;
        }
        const parsed = new Date(s);
        if (isNaN(parsed.getTime())) return '';
        return `${parsed.getFullYear()}-${pad(parsed.getMonth() + 1)}-${pad(parsed.getDate())}T${pad(parsed.getHours())}:${pad(parsed.getMinutes())}`;
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
    const STATUS_OPTIONS = [
        'NEW',
        'ASSIGNED',
        'READY TO DEPLOY',
        'DEPLOYED',
        'IN PROGRESS',
        'COMPLETED'
    ];
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
            lineNumber: 446,
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$Box$2f$Box$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        sx: {
                            display: 'flex',
                            gap: 2,
                            flexWrap: 'wrap',
                            mb: 2
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$Select$2f$Select$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                value: locationFilter,
                                onChange: (e)=>setLocationFilter(String(e.target.value)),
                                displayEmpty: true,
                                size: "small",
                                sx: {
                                    minWidth: 180
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$MenuItem$2f$MenuItem$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        value: "",
                                        children: "Semua Lokasi"
                                    }, void 0, false, {
                                        fileName: "[project]/web/components/WorkOrderList.tsx",
                                        lineNumber: 494,
                                        columnNumber: 15
                                    }, this),
                                    locations.map((s)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$MenuItem$2f$MenuItem$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                            value: s,
                                            children: s
                                        }, s, false, {
                                            fileName: "[project]/web/components/WorkOrderList.tsx",
                                            lineNumber: 496,
                                            columnNumber: 17
                                        }, this))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/web/components/WorkOrderList.tsx",
                                lineNumber: 487,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$Select$2f$Select$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                multiple: true,
                                displayEmpty: true,
                                size: "small",
                                value: selectedStatuses,
                                onChange: (e)=>setSelectedStatuses(typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value),
                                renderValue: (selected)=>selected && selected.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$Box$2f$Box$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        sx: {
                                            display: 'flex',
                                            gap: 1,
                                            flexWrap: 'wrap'
                                        },
                                        children: selected.map((val)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$Chip$2f$Chip$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                label: val,
                                                size: "small"
                                            }, val, false, {
                                                fileName: "[project]/web/components/WorkOrderList.tsx",
                                                lineNumber: 510,
                                                columnNumber: 23
                                            }, void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/web/components/WorkOrderList.tsx",
                                        lineNumber: 508,
                                        columnNumber: 19
                                    }, void 0) : 'Semua Status',
                                sx: {
                                    minWidth: 220
                                },
                                children: STATUS_OPTIONS.map((opt)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$MenuItem$2f$MenuItem$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        value: opt,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$Checkbox$2f$Checkbox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                checked: selectedStatuses.indexOf(opt) > -1
                                            }, void 0, false, {
                                                fileName: "[project]/web/components/WorkOrderList.tsx",
                                                lineNumber: 519,
                                                columnNumber: 19
                                            }, this),
                                            opt
                                        ]
                                    }, opt, true, {
                                        fileName: "[project]/web/components/WorkOrderList.tsx",
                                        lineNumber: 518,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/web/components/WorkOrderList.tsx",
                                lineNumber: 500,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$TextField$2f$TextField$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                placeholder: "Search doc_no / asset / desc",
                                value: q,
                                onChange: (e)=>setQ(e.target.value),
                                size: "small",
                                sx: {
                                    flex: 1,
                                    minWidth: 240
                                }
                            }, void 0, false, {
                                fileName: "[project]/web/components/WorkOrderList.tsx",
                                lineNumber: 525,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$Button$2f$Button$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                variant: "contained",
                                color: "primary",
                                size: "small",
                                onClick: ()=>load(1, q),
                                disabled: loading,
                                children: "Search"
                            }, void 0, false, {
                                fileName: "[project]/web/components/WorkOrderList.tsx",
                                lineNumber: 533,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$Button$2f$Button$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                variant: "outlined",
                                size: "small",
                                onClick: ()=>load(1, q),
                                disabled: loading,
                                children: "Refresh"
                            }, void 0, false, {
                                fileName: "[project]/web/components/WorkOrderList.tsx",
                                lineNumber: 534,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$Box$2f$Box$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                sx: {
                                    alignSelf: 'center',
                                    ml: 'auto',
                                    color: 'text.secondary'
                                },
                                children: [
                                    total,
                                    " item"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/web/components/WorkOrderList.tsx",
                                lineNumber: 536,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/web/components/WorkOrderList.tsx",
                        lineNumber: 486,
                        columnNumber: 11
                    }, this),
                    loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$Typography$2f$Typography$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        variant: "body2",
                        children: "Loading..."
                    }, void 0, false, {
                        fileName: "[project]/web/components/WorkOrderList.tsx",
                        lineNumber: 539,
                        columnNumber: 22
                    }, this) : null,
                    error ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$Typography$2f$Typography$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        variant: "body2",
                        color: "error",
                        children: error
                    }, void 0, false, {
                        fileName: "[project]/web/components/WorkOrderList.tsx",
                        lineNumber: 540,
                        columnNumber: 20
                    }, this) : null
                ]
            }, void 0, true, {
                fileName: "[project]/web/components/WorkOrderList.tsx",
                lineNumber: 485,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    overflowX: 'auto'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$TableContainer$2f$TableContainer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        component: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$Paper$2f$Paper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"],
                        sx: {
                            mb: 2
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$Table$2f$Table$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            size: "small",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$TableHead$2f$TableHead$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$TableRow$2f$TableRow$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$TableCell$2f$TableCell$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                children: "Doc No"
                                            }, void 0, false, {
                                                fileName: "[project]/web/components/WorkOrderList.tsx",
                                                lineNumber: 548,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$TableCell$2f$TableCell$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                children: "Jenis Work Order"
                                            }, void 0, false, {
                                                fileName: "[project]/web/components/WorkOrderList.tsx",
                                                lineNumber: 549,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$TableCell$2f$TableCell$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                children: "Start"
                                            }, void 0, false, {
                                                fileName: "[project]/web/components/WorkOrderList.tsx",
                                                lineNumber: 550,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$TableCell$2f$TableCell$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                children: "End"
                                            }, void 0, false, {
                                                fileName: "[project]/web/components/WorkOrderList.tsx",
                                                lineNumber: 551,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$TableCell$2f$TableCell$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                children: "Asset"
                                            }, void 0, false, {
                                                fileName: "[project]/web/components/WorkOrderList.tsx",
                                                lineNumber: 552,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$TableCell$2f$TableCell$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                children: "Status"
                                            }, void 0, false, {
                                                fileName: "[project]/web/components/WorkOrderList.tsx",
                                                lineNumber: 553,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$TableCell$2f$TableCell$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                children: "Location"
                                            }, void 0, false, {
                                                fileName: "[project]/web/components/WorkOrderList.tsx",
                                                lineNumber: 554,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$TableCell$2f$TableCell$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                children: "Description"
                                            }, void 0, false, {
                                                fileName: "[project]/web/components/WorkOrderList.tsx",
                                                lineNumber: 555,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$TableCell$2f$TableCell$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                children: "Progress"
                                            }, void 0, false, {
                                                fileName: "[project]/web/components/WorkOrderList.tsx",
                                                lineNumber: 556,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$TableCell$2f$TableCell$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                children: "Action"
                                            }, void 0, false, {
                                                fileName: "[project]/web/components/WorkOrderList.tsx",
                                                lineNumber: 557,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/web/components/WorkOrderList.tsx",
                                        lineNumber: 547,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/web/components/WorkOrderList.tsx",
                                    lineNumber: 546,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$TableBody$2f$TableBody$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    children: list.map((w)=>{
                                        const activities = w.raw?.activities ?? [];
                                        const statusRaw = (w.status ?? w.raw?.status ?? 'NEW').toString();
                                        const statusNorm = statusRaw.toUpperCase().replace(/[-\s]/g, '_');
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$TableRow$2f$TableRow$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                            hover: true,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$TableCell$2f$TableCell$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                    children: w.doc_no ?? w.id
                                                }, void 0, false, {
                                                    fileName: "[project]/web/components/WorkOrderList.tsx",
                                                    lineNumber: 567,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$TableCell$2f$TableCell$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                    children: w.work_type ?? w.type_work ?? w.raw?.work_type ?? w.raw?.type_work ?? '-'
                                                }, void 0, false, {
                                                    fileName: "[project]/web/components/WorkOrderList.tsx",
                                                    lineNumber: 568,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$TableCell$2f$TableCell$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                    children: formatUtcDisplay(w.start_date)
                                                }, void 0, false, {
                                                    fileName: "[project]/web/components/WorkOrderList.tsx",
                                                    lineNumber: 569,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$TableCell$2f$TableCell$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                    children: formatUtcDisplay(w.end_date)
                                                }, void 0, false, {
                                                    fileName: "[project]/web/components/WorkOrderList.tsx",
                                                    lineNumber: 570,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$TableCell$2f$TableCell$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                    children: w.asset_name ?? '-'
                                                }, void 0, false, {
                                                    fileName: "[project]/web/components/WorkOrderList.tsx",
                                                    lineNumber: 571,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$TableCell$2f$TableCell$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                    children: renderStatusBadge(w.status ?? w.raw?.status ?? 'NEW')
                                                }, void 0, false, {
                                                    fileName: "[project]/web/components/WorkOrderList.tsx",
                                                    lineNumber: 572,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$TableCell$2f$TableCell$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                    children: w.vendor_cabang ?? w.raw?.vendor_cabang ?? '-'
                                                }, void 0, false, {
                                                    fileName: "[project]/web/components/WorkOrderList.tsx",
                                                    lineNumber: 573,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$TableCell$2f$TableCell$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                    sx: {
                                                        maxWidth: 220,
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap'
                                                    },
                                                    children: w.description ?? '-'
                                                }, void 0, false, {
                                                    fileName: "[project]/web/components/WorkOrderList.tsx",
                                                    lineNumber: 574,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$TableCell$2f$TableCell$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                    sx: {
                                                        width: 180
                                                    },
                                                    children: statusNorm === 'IN_PROGRESS' && typeof w.progress === 'number' ? (()=>{
                                                        const prog = Math.max(0, Math.min(1, w.progress || 0));
                                                        const statusColor = getColorForStatus(statusRaw);
                                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$Box$2f$Box$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                            sx: {
                                                                display: 'flex',
                                                                flexDirection: 'column',
                                                                gap: 0.5
                                                            },
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$Typography$2f$Typography$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                                    variant: "caption",
                                                                    sx: {
                                                                        fontWeight: 700
                                                                    },
                                                                    children: [
                                                                        Math.round(prog * 100),
                                                                        "%"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/web/components/WorkOrderList.tsx",
                                                                    lineNumber: 582,
                                                                    columnNumber: 31
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$LinearProgress$2f$LinearProgress$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                                    variant: "determinate",
                                                                    value: Math.round(prog * 100),
                                                                    sx: {
                                                                        height: 8,
                                                                        borderRadius: 2,
                                                                        backgroundColor: '#f1f5f9',
                                                                        '& .MuiLinearProgress-bar': {
                                                                            background: statusColor
                                                                        }
                                                                    }
                                                                }, void 0, false, {
                                                                    fileName: "[project]/web/components/WorkOrderList.tsx",
                                                                    lineNumber: 583,
                                                                    columnNumber: 31
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/web/components/WorkOrderList.tsx",
                                                            lineNumber: 581,
                                                            columnNumber: 29
                                                        }, this);
                                                    })() : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$Typography$2f$Typography$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                        variant: "body2",
                                                        color: "text.secondary",
                                                        children: "-"
                                                    }, void 0, false, {
                                                        fileName: "[project]/web/components/WorkOrderList.tsx",
                                                        lineNumber: 588,
                                                        columnNumber: 25
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/web/components/WorkOrderList.tsx",
                                                    lineNumber: 575,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$TableCell$2f$TableCell$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$Box$2f$Box$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                        sx: {
                                                            display: 'flex',
                                                            gap: 1
                                                        },
                                                        children: [
                                                            Array.isArray(activities) && activities.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$Button$2f$Button$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                                size: "small",
                                                                variant: "outlined",
                                                                onClick: ()=>openTaskModal(w),
                                                                children: [
                                                                    "Lihat Task (",
                                                                    activities.length,
                                                                    ")"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/web/components/WorkOrderList.tsx",
                                                                lineNumber: 594,
                                                                columnNumber: 27
                                                            }, this),
                                                            !(statusNorm === 'IN_PROGRESS' || statusNorm === 'COMPLETED' || statusNorm === 'DEPLOYED') && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$Button$2f$Button$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                                size: "small",
                                                                variant: "contained",
                                                                color: "secondary",
                                                                onClick: ()=>openEdit(w),
                                                                children: "Edit Dates"
                                                            }, void 0, false, {
                                                                fileName: "[project]/web/components/WorkOrderList.tsx",
                                                                lineNumber: 597,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/web/components/WorkOrderList.tsx",
                                                        lineNumber: 592,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/web/components/WorkOrderList.tsx",
                                                    lineNumber: 591,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, w.id, true, {
                                            fileName: "[project]/web/components/WorkOrderList.tsx",
                                            lineNumber: 566,
                                            columnNumber: 19
                                        }, this);
                                    })
                                }, void 0, false, {
                                    fileName: "[project]/web/components/WorkOrderList.tsx",
                                    lineNumber: 560,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/web/components/WorkOrderList.tsx",
                            lineNumber: 545,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/web/components/WorkOrderList.tsx",
                        lineNumber: 544,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$Box$2f$Box$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        sx: {
                            display: 'flex',
                            gap: 2,
                            alignItems: 'center'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$Button$2f$Button$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                onClick: onPrev,
                                disabled: page <= 1,
                                size: "small",
                                children: "Prev"
                            }, void 0, false, {
                                fileName: "[project]/web/components/WorkOrderList.tsx",
                                lineNumber: 609,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$Typography$2f$Typography$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                variant: "body2",
                                children: [
                                    "Page ",
                                    page,
                                    " / ",
                                    Math.max(1, Math.ceil(total / pageSize))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/web/components/WorkOrderList.tsx",
                                lineNumber: 610,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$Button$2f$Button$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                onClick: onNext,
                                disabled: page >= Math.max(1, Math.ceil(total / pageSize)),
                                size: "small",
                                children: "Next"
                            }, void 0, false, {
                                fileName: "[project]/web/components/WorkOrderList.tsx",
                                lineNumber: 611,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/web/components/WorkOrderList.tsx",
                        lineNumber: 608,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/web/components/WorkOrderList.tsx",
                lineNumber: 543,
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
                                            lineNumber: 624,
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
                                            lineNumber: 625,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/web/components/WorkOrderList.tsx",
                                    lineNumber: 623,
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
                                                lineNumber: 630,
                                                columnNumber: 21
                                            }, this) : currentUser === null ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    color: '#c00'
                                                },
                                                children: "Not authenticated"
                                            }, void 0, false, {
                                                fileName: "[project]/web/components/WorkOrderList.tsx",
                                                lineNumber: 632,
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
                                                        lineNumber: 635,
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
                                                        lineNumber: 636,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/web/components/WorkOrderList.tsx",
                                                lineNumber: 634,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/web/components/WorkOrderList.tsx",
                                            lineNumber: 628,
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
                                                    lineNumber: 642,
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
                                                    lineNumber: 645,
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
                                                    lineNumber: 647,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/web/components/WorkOrderList.tsx",
                                            lineNumber: 640,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/web/components/WorkOrderList.tsx",
                                    lineNumber: 627,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/web/components/WorkOrderList.tsx",
                            lineNumber: 622,
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
                                                lineNumber: 655,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("col", {}, void 0, false, {
                                                fileName: "[project]/web/components/WorkOrderList.tsx",
                                                lineNumber: 656,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("col", {
                                                style: {
                                                    width: '110px'
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/web/components/WorkOrderList.tsx",
                                                lineNumber: 657,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("col", {
                                                style: {
                                                    width: '340px'
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/web/components/WorkOrderList.tsx",
                                                lineNumber: 658,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/web/components/WorkOrderList.tsx",
                                        lineNumber: 654,
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
                                                    lineNumber: 662,
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
                                                    lineNumber: 663,
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
                                                    lineNumber: 664,
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
                                                    lineNumber: 666,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/web/components/WorkOrderList.tsx",
                                            lineNumber: 661,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/web/components/WorkOrderList.tsx",
                                        lineNumber: 660,
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
                                                        lineNumber: 730,
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
                                                                        lineNumber: 733,
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
                                                                        lineNumber: 735,
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
                                                                                lineNumber: 741,
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
                                                                            lineNumber: 744,
                                                                            columnNumber: 40
                                                                        }, this);
                                                                    })()
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/web/components/WorkOrderList.tsx",
                                                                lineNumber: 732,
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
                                                                lineNumber: 748,
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
                                                                                lineNumber: 757,
                                                                                columnNumber: 37
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
                                                                                lineNumber: 759,
                                                                                columnNumber: 39
                                                                            }, this)
                                                                        ]
                                                                    }, asgn.id, true, {
                                                                        fileName: "[project]/web/components/WorkOrderList.tsx",
                                                                        lineNumber: 753,
                                                                        columnNumber: 35
                                                                    }, this))
                                                            }, void 0, false, {
                                                                fileName: "[project]/web/components/WorkOrderList.tsx",
                                                                lineNumber: 751,
                                                                columnNumber: 31
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/web/components/WorkOrderList.tsx",
                                                        lineNumber: 731,
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
                                                        lineNumber: 781,
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
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$Autocomplete$2f$Autocomplete$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"], {
                                                                    multiple: true,
                                                                    options: technicians || [],
                                                                    getOptionLabel: (t)=>(t.name || t.nipp || t.email || '').toString(),
                                                                    filterSelectedOptions: true,
                                                                    value: (selectedAssignees[taskKey] || []).map((id)=>technicians.find((t)=>t.id === id)).filter(Boolean),
                                                                    onChange: (e, newVal)=>setSelectedAssignees((prev)=>({
                                                                                ...prev,
                                                                                [taskKey]: newVal.map((n)=>n.id)
                                                                            })),
                                                                    renderInput: (params)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$TextField$2f$TextField$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                                            ...params,
                                                                            placeholder: "Cari teknisi (nama / email / id)",
                                                                            size: "small"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/web/components/WorkOrderList.tsx",
                                                                            lineNumber: 792,
                                                                            columnNumber: 58
                                                                        }, void 0)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/web/components/WorkOrderList.tsx",
                                                                    lineNumber: 785,
                                                                    columnNumber: 31
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    style: {
                                                                        display: 'flex',
                                                                        gap: 8,
                                                                        flexWrap: 'wrap',
                                                                        marginTop: 8
                                                                    },
                                                                    children: (technicians || []).slice(0, 200).map((t)=>{
                                                                        const isSel = (selectedAssignees[taskKey] || []).includes(t.id);
                                                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$Chip$2f$Chip$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                                            label: (t.name || t.nipp || t.email || '').toString(),
                                                                            onClick: ()=>{
                                                                                setSelectedAssignees((prev)=>{
                                                                                    const cur = new Set(prev[taskKey] || []);
                                                                                    if (cur.has(t.id)) cur.delete(t.id);
                                                                                    else cur.add(t.id);
                                                                                    return {
                                                                                        ...prev,
                                                                                        [taskKey]: Array.from(cur)
                                                                                    };
                                                                                });
                                                                            },
                                                                            clickable: true,
                                                                            color: isSel ? 'primary' : 'default',
                                                                            variant: isSel ? 'filled' : 'outlined',
                                                                            size: "small",
                                                                            sx: {
                                                                                marginRight: 0.5
                                                                            }
                                                                        }, t.id, false, {
                                                                            fileName: "[project]/web/components/WorkOrderList.tsx",
                                                                            lineNumber: 799,
                                                                            columnNumber: 39
                                                                        }, this);
                                                                    })
                                                                }, void 0, false, {
                                                                    fileName: "[project]/web/components/WorkOrderList.tsx",
                                                                    lineNumber: 795,
                                                                    columnNumber: 33
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    style: {
                                                                        display: 'flex',
                                                                        gap: 8,
                                                                        justifyContent: 'flex-start',
                                                                        marginTop: 8
                                                                    },
                                                                    children: currentUser === undefined ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$Button$2f$Button$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                                        size: "small",
                                                                        disabled: true,
                                                                        children: "Checking..."
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/web/components/WorkOrderList.tsx",
                                                                        lineNumber: 821,
                                                                        columnNumber: 35
                                                                    }, this) : currentUser === null ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$Button$2f$Button$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                                                size: "small",
                                                                                variant: "contained",
                                                                                color: "primary",
                                                                                onClick: ()=>{
                                                                                    window.location.href = '/login';
                                                                                },
                                                                                children: "Login to assign"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/web/components/WorkOrderList.tsx",
                                                                                lineNumber: 824,
                                                                                columnNumber: 37
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$Button$2f$Button$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                                                size: "small",
                                                                                onClick: ()=>{
                                                                                    setSelectedAssignees((prev)=>({
                                                                                            ...prev,
                                                                                            [taskKey]: []
                                                                                        }));
                                                                                },
                                                                                children: "Clear"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/web/components/WorkOrderList.tsx",
                                                                                lineNumber: 825,
                                                                                columnNumber: 37
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true) : ![
                                                                        'DEPLOYED',
                                                                        'IN_PROGRESS'
                                                                    ].includes((taskModal.wo?.status ?? '').toString()) ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$Button$2f$Button$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                                                size: "small",
                                                                                variant: "contained",
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
                                                                                lineNumber: 829,
                                                                                columnNumber: 37
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$Button$2f$Button$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                                                size: "small",
                                                                                onClick: ()=>{
                                                                                    setSelectedAssignees((prev)=>({
                                                                                            ...prev,
                                                                                            [taskKey]: []
                                                                                        }));
                                                                                },
                                                                                children: "Clear"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/web/components/WorkOrderList.tsx",
                                                                                lineNumber: 851,
                                                                                columnNumber: 37
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$Button$2f$Button$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                                        size: "small",
                                                                        disabled: true,
                                                                        children: "Deployed"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/web/components/WorkOrderList.tsx",
                                                                        lineNumber: 854,
                                                                        columnNumber: 35
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/web/components/WorkOrderList.tsx",
                                                                    lineNumber: 819,
                                                                    columnNumber: 33
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/web/components/WorkOrderList.tsx",
                                                            lineNumber: 784,
                                                            columnNumber: 29
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/web/components/WorkOrderList.tsx",
                                                        lineNumber: 783,
                                                        columnNumber: 27
                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        style: {
                                                            padding: 12,
                                                            verticalAlign: 'top'
                                                        }
                                                    }, void 0, false, {
                                                        fileName: "[project]/web/components/WorkOrderList.tsx",
                                                        lineNumber: 860,
                                                        columnNumber: 27
                                                    }, this)
                                                ]
                                            }, idx, true, {
                                                fileName: "[project]/web/components/WorkOrderList.tsx",
                                                lineNumber: 729,
                                                columnNumber: 23
                                            }, this);
                                        })
                                    }, void 0, false, {
                                        fileName: "[project]/web/components/WorkOrderList.tsx",
                                        lineNumber: 670,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/web/components/WorkOrderList.tsx",
                                lineNumber: 653,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/web/components/WorkOrderList.tsx",
                            lineNumber: 652,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/web/components/WorkOrderList.tsx",
                    lineNumber: 621,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/web/components/WorkOrderList.tsx",
                lineNumber: 617,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$Dialog$2f$Dialog$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                open: Boolean(editing),
                onClose: ()=>setEditing(null),
                fullWidth: true,
                maxWidth: "sm",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$DialogTitle$2f$DialogTitle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        children: [
                            "Edit Dates — ",
                            editing?.doc_no ?? editing?.id
                        ]
                    }, void 0, true, {
                        fileName: "[project]/web/components/WorkOrderList.tsx",
                        lineNumber: 874,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$DialogContent$2f$DialogContent$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        dividers: true,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$Stack$2f$Stack$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            spacing: 2,
                            sx: {
                                mt: 1
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$TextField$2f$TextField$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    label: "Start Date & Time",
                                    type: "datetime-local",
                                    size: "small",
                                    value: editStartInput,
                                    onChange: (e)=>setEditStartInput(e.target.value),
                                    InputLabelProps: {
                                        shrink: true
                                    },
                                    fullWidth: true
                                }, void 0, false, {
                                    fileName: "[project]/web/components/WorkOrderList.tsx",
                                    lineNumber: 877,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        fontSize: 12,
                                        color: '#666'
                                    },
                                    children: [
                                        "Current: ",
                                        formatUtcDisplay(editing?.start_date)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/web/components/WorkOrderList.tsx",
                                    lineNumber: 886,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$TextField$2f$TextField$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    label: "End Date & Time",
                                    type: "datetime-local",
                                    size: "small",
                                    value: editEndInput,
                                    onChange: (e)=>setEditEndInput(e.target.value),
                                    InputLabelProps: {
                                        shrink: true
                                    },
                                    fullWidth: true
                                }, void 0, false, {
                                    fileName: "[project]/web/components/WorkOrderList.tsx",
                                    lineNumber: 888,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        fontSize: 12,
                                        color: '#666'
                                    },
                                    children: [
                                        "Current: ",
                                        formatUtcDisplay(editing?.end_date)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/web/components/WorkOrderList.tsx",
                                    lineNumber: 897,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$TextField$2f$TextField$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    label: "Keterangan (opsional)",
                                    placeholder: "Alasan atau catatan perubahan tanggal",
                                    multiline: true,
                                    rows: 4,
                                    value: editNote,
                                    onChange: (e)=>setEditNote(e.target.value),
                                    fullWidth: true,
                                    size: "small"
                                }, void 0, false, {
                                    fileName: "[project]/web/components/WorkOrderList.tsx",
                                    lineNumber: 899,
                                    columnNumber: 13
                                }, this),
                                Array.isArray(dateHistory) && dateHistory.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                fontWeight: 700,
                                                marginBottom: 8
                                            },
                                            children: "History perubahan tanggal"
                                        }, void 0, false, {
                                            fileName: "[project]/web/components/WorkOrderList.tsx",
                                            lineNumber: 912,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                maxHeight: 240,
                                                overflow: 'auto'
                                            },
                                            children: dateHistory.map((h, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        padding: 12,
                                                        borderBottom: '1px solid #f5f5f5'
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            style: {
                                                                display: 'flex',
                                                                justifyContent: 'space-between',
                                                                alignItems: 'center'
                                                            },
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    style: {
                                                                        fontSize: 13,
                                                                        color: '#333',
                                                                        fontWeight: 700
                                                                    },
                                                                    children: h.changed_at ? new Date(h.changed_at).toLocaleString() : '-'
                                                                }, void 0, false, {
                                                                    fileName: "[project]/web/components/WorkOrderList.tsx",
                                                                    lineNumber: 917,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    style: {
                                                                        fontSize: 12,
                                                                        color: '#666'
                                                                    },
                                                                    children: h.changed_by ? `${h.changed_by.nipp ?? h.changed_by.id ?? '-'} • ${h.changed_by.name ?? h.changed_by.email ?? '-'}` : '-'
                                                                }, void 0, false, {
                                                                    fileName: "[project]/web/components/WorkOrderList.tsx",
                                                                    lineNumber: 918,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/web/components/WorkOrderList.tsx",
                                                            lineNumber: 916,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            style: {
                                                                marginTop: 6,
                                                                color: '#444'
                                                            },
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    children: [
                                                                        "Start: ",
                                                                        h.old_start ? formatUtcDisplay(h.old_start) : '-',
                                                                        " → ",
                                                                        h.new_start ? formatUtcDisplay(h.new_start) : '-'
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/web/components/WorkOrderList.tsx",
                                                                    lineNumber: 921,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    children: [
                                                                        "End: ",
                                                                        h.old_end ? formatUtcDisplay(h.old_end) : '-',
                                                                        " → ",
                                                                        h.new_end ? formatUtcDisplay(h.new_end) : '-'
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/web/components/WorkOrderList.tsx",
                                                                    lineNumber: 922,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/web/components/WorkOrderList.tsx",
                                                            lineNumber: 920,
                                                            columnNumber: 23
                                                        }, this),
                                                        h.note && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            style: {
                                                                marginTop: 8,
                                                                fontSize: 13,
                                                                color: '#555'
                                                            },
                                                            children: [
                                                                "Catatan: ",
                                                                h.note
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/web/components/WorkOrderList.tsx",
                                                            lineNumber: 924,
                                                            columnNumber: 34
                                                        }, this)
                                                    ]
                                                }, h.id || idx, true, {
                                                    fileName: "[project]/web/components/WorkOrderList.tsx",
                                                    lineNumber: 915,
                                                    columnNumber: 21
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/web/components/WorkOrderList.tsx",
                                            lineNumber: 913,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/web/components/WorkOrderList.tsx",
                                    lineNumber: 911,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/web/components/WorkOrderList.tsx",
                            lineNumber: 876,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/web/components/WorkOrderList.tsx",
                        lineNumber: 875,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$DialogActions$2f$DialogActions$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        sx: {
                            p: 2
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$Button$2f$Button$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                onClick: ()=>setEditing(null),
                                disabled: editLoading,
                                children: "Batal"
                            }, void 0, false, {
                                fileName: "[project]/web/components/WorkOrderList.tsx",
                                lineNumber: 933,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$material$2f$Button$2f$Button$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                variant: "contained",
                                color: "primary",
                                onClick: async ()=>{
                                    // Convert datetime-local (YYYY-MM-DDTHH:MM) to SQL datetime string 'YYYY-MM-DD HH:MM:00'
                                    function datetimeLocalToSql(local) {
                                        if (!local) return null;
                                        const rx = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/;
                                        const m = rx.exec(local);
                                        if (!m) return null;
                                        const [, yy, mm, dd, hh, mi] = m;
                                        return `${yy}-${mm}-${dd} ${hh}:${mi}:00`;
                                    }
                                    // basic validation: ensure input matches expected pattern
                                    if (editStartInput && !/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2})$/.test(editStartInput)) {
                                        alert('Start date tidak valid');
                                        return;
                                    }
                                    if (editEndInput && !/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2})$/.test(editEndInput)) {
                                        alert('End date tidak valid');
                                        return;
                                    }
                                    const sSql = datetimeLocalToSql(editStartInput || null);
                                    const eSql = datetimeLocalToSql(editEndInput || null);
                                    await saveEdit(editing.id, sSql, eSql);
                                },
                                disabled: editLoading,
                                children: editLoading ? 'Menyimpan...' : 'Simpan Perubahan'
                            }, void 0, false, {
                                fileName: "[project]/web/components/WorkOrderList.tsx",
                                lineNumber: 934,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/web/components/WorkOrderList.tsx",
                        lineNumber: 932,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/web/components/WorkOrderList.tsx",
                lineNumber: 873,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/web/components/WorkOrderList.tsx",
        lineNumber: 484,
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

//# sourceMappingURL=web_260b3e4b._.js.map