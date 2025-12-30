(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/web/node_modules/@mui/base/utils/isHostComponent.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Determines if a given element is a DOM element name (i.e. not a React component).
 */ __turbopack_context__.s([
    "isHostComponent",
    ()=>isHostComponent
]);
function isHostComponent(element) {
    return typeof element === 'string';
}
}),
"[project]/web/node_modules/@mui/base/TextareaAutosize/TextareaAutosize.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TextareaAutosize",
    ()=>TextareaAutosize
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/web/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$babel$2f$runtime$2f$helpers$2f$esm$2f$extends$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@babel/runtime/helpers/esm/extends.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$babel$2f$runtime$2f$helpers$2f$esm$2f$objectWithoutPropertiesLoose$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@babel/runtime/helpers/esm/objectWithoutPropertiesLoose.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/prop-types/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/next/dist/compiled/react-dom/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$debounce$2f$debounce$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__unstable_debounce$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/utils/esm/debounce/debounce.js [app-client] (ecmascript) <export default as unstable_debounce>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$useForkRef$2f$useForkRef$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__unstable_useForkRef$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/utils/esm/useForkRef/useForkRef.js [app-client] (ecmascript) <export default as unstable_useForkRef>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$useEnhancedEffect$2f$useEnhancedEffect$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__unstable_useEnhancedEffect$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/utils/esm/useEnhancedEffect/useEnhancedEffect.js [app-client] (ecmascript) <export default as unstable_useEnhancedEffect>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$ownerWindow$2f$ownerWindow$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__unstable_ownerWindow$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/utils/esm/ownerWindow/ownerWindow.js [app-client] (ecmascript) <export default as unstable_ownerWindow>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
'use client';
;
;
const _excluded = [
    "onChange",
    "maxRows",
    "minRows",
    "style",
    "value"
];
;
;
;
;
;
;
function getStyleValue(value) {
    return parseInt(value, 10) || 0;
}
const styles = {
    shadow: {
        // Visibility needed to hide the extra text area on iPads
        visibility: 'hidden',
        // Remove from the content flow
        position: 'absolute',
        // Ignore the scrollbar width
        overflow: 'hidden',
        height: 0,
        top: 0,
        left: 0,
        // Create a new layer, increase the isolation of the computed values
        transform: 'translateZ(0)'
    }
};
function isEmpty(obj) {
    return obj === undefined || obj === null || Object.keys(obj).length === 0 || obj.outerHeightStyle === 0 && !obj.overflow;
}
/**
 *
 * Demos:
 *
 * - [Textarea Autosize](https://mui.com/base-ui/react-textarea-autosize/)
 * - [Textarea Autosize](https://mui.com/material-ui/react-textarea-autosize/)
 *
 * API:
 *
 * - [TextareaAutosize API](https://mui.com/base-ui/react-textarea-autosize/components-api/#textarea-autosize)
 */ const TextareaAutosize = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](function TextareaAutosize(props, forwardedRef) {
    const { onChange, maxRows, minRows = 1, style, value } = props, other = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$babel$2f$runtime$2f$helpers$2f$esm$2f$objectWithoutPropertiesLoose$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(props, _excluded);
    const { current: isControlled } = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](value != null);
    const inputRef = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](null);
    const handleRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$useForkRef$2f$useForkRef$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__unstable_useForkRef$3e$__["unstable_useForkRef"])(forwardedRef, inputRef);
    const shadowRef = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](null);
    const renders = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](0);
    const [state, setState] = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"]({
        outerHeightStyle: 0
    });
    const getUpdatedState = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "TextareaAutosize.TextareaAutosize.useCallback[getUpdatedState]": ()=>{
            const input = inputRef.current;
            const containerWindow = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$ownerWindow$2f$ownerWindow$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__unstable_ownerWindow$3e$__["unstable_ownerWindow"])(input);
            const computedStyle = containerWindow.getComputedStyle(input);
            // If input's width is shrunk and it's not visible, don't sync height.
            if (computedStyle.width === '0px') {
                return {
                    outerHeightStyle: 0
                };
            }
            const inputShallow = shadowRef.current;
            inputShallow.style.width = computedStyle.width;
            inputShallow.value = input.value || props.placeholder || 'x';
            if (inputShallow.value.slice(-1) === '\n') {
                // Certain fonts which overflow the line height will cause the textarea
                // to report a different scrollHeight depending on whether the last line
                // is empty. Make it non-empty to avoid this issue.
                inputShallow.value += ' ';
            }
            const boxSizing = computedStyle.boxSizing;
            const padding = getStyleValue(computedStyle.paddingBottom) + getStyleValue(computedStyle.paddingTop);
            const border = getStyleValue(computedStyle.borderBottomWidth) + getStyleValue(computedStyle.borderTopWidth);
            // The height of the inner content
            const innerHeight = inputShallow.scrollHeight;
            // Measure height of a textarea with a single row
            inputShallow.value = 'x';
            const singleRowHeight = inputShallow.scrollHeight;
            // The height of the outer content
            let outerHeight = innerHeight;
            if (minRows) {
                outerHeight = Math.max(Number(minRows) * singleRowHeight, outerHeight);
            }
            if (maxRows) {
                outerHeight = Math.min(Number(maxRows) * singleRowHeight, outerHeight);
            }
            outerHeight = Math.max(outerHeight, singleRowHeight);
            // Take the box sizing into account for applying this value as a style.
            const outerHeightStyle = outerHeight + (boxSizing === 'border-box' ? padding + border : 0);
            const overflow = Math.abs(outerHeight - innerHeight) <= 1;
            return {
                outerHeightStyle,
                overflow
            };
        }
    }["TextareaAutosize.TextareaAutosize.useCallback[getUpdatedState]"], [
        maxRows,
        minRows,
        props.placeholder
    ]);
    const updateState = (prevState, newState)=>{
        const { outerHeightStyle, overflow } = newState;
        // Need a large enough difference to update the height.
        // This prevents infinite rendering loop.
        if (renders.current < 20 && (outerHeightStyle > 0 && Math.abs((prevState.outerHeightStyle || 0) - outerHeightStyle) > 1 || prevState.overflow !== overflow)) {
            renders.current += 1;
            return {
                overflow,
                outerHeightStyle
            };
        }
        if ("TURBOPACK compile-time truthy", 1) {
            if (renders.current === 20) {
                console.error([
                    'MUI: Too many re-renders. The layout is unstable.',
                    'TextareaAutosize limits the number of renders to prevent an infinite loop.'
                ].join('\n'));
            }
        }
        return prevState;
    };
    const syncHeight = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "TextareaAutosize.TextareaAutosize.useCallback[syncHeight]": ()=>{
            const newState = getUpdatedState();
            if (isEmpty(newState)) {
                return;
            }
            setState({
                "TextareaAutosize.TextareaAutosize.useCallback[syncHeight]": (prevState)=>updateState(prevState, newState)
            }["TextareaAutosize.TextareaAutosize.useCallback[syncHeight]"]);
        }
    }["TextareaAutosize.TextareaAutosize.useCallback[syncHeight]"], [
        getUpdatedState
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$useEnhancedEffect$2f$useEnhancedEffect$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__unstable_useEnhancedEffect$3e$__["unstable_useEnhancedEffect"])({
        "TextareaAutosize.TextareaAutosize.useEnhancedEffect": ()=>{
            const syncHeightWithFlushSync = {
                "TextareaAutosize.TextareaAutosize.useEnhancedEffect.syncHeightWithFlushSync": ()=>{
                    const newState = getUpdatedState();
                    if (isEmpty(newState)) {
                        return;
                    }
                    // In React 18, state updates in a ResizeObserver's callback are happening after
                    // the paint, this leads to an infinite rendering.
                    //
                    // Using flushSync ensures that the states is updated before the next pain.
                    // Related issue - https://github.com/facebook/react/issues/24331
                    __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["flushSync"]({
                        "TextareaAutosize.TextareaAutosize.useEnhancedEffect.syncHeightWithFlushSync": ()=>{
                            setState({
                                "TextareaAutosize.TextareaAutosize.useEnhancedEffect.syncHeightWithFlushSync": (prevState)=>updateState(prevState, newState)
                            }["TextareaAutosize.TextareaAutosize.useEnhancedEffect.syncHeightWithFlushSync"]);
                        }
                    }["TextareaAutosize.TextareaAutosize.useEnhancedEffect.syncHeightWithFlushSync"]);
                }
            }["TextareaAutosize.TextareaAutosize.useEnhancedEffect.syncHeightWithFlushSync"];
            const handleResize = {
                "TextareaAutosize.TextareaAutosize.useEnhancedEffect.handleResize": ()=>{
                    renders.current = 0;
                    syncHeightWithFlushSync();
                }
            }["TextareaAutosize.TextareaAutosize.useEnhancedEffect.handleResize"];
            // Workaround a "ResizeObserver loop completed with undelivered notifications" error
            // in test.
            // Note that we might need to use this logic in production per https://github.com/WICG/resize-observer/issues/38
            // Also see https://github.com/mui/mui-x/issues/8733
            let rAF;
            const rAFHandleResize = {
                "TextareaAutosize.TextareaAutosize.useEnhancedEffect.rAFHandleResize": ()=>{
                    cancelAnimationFrame(rAF);
                    rAF = requestAnimationFrame({
                        "TextareaAutosize.TextareaAutosize.useEnhancedEffect.rAFHandleResize": ()=>{
                            handleResize();
                        }
                    }["TextareaAutosize.TextareaAutosize.useEnhancedEffect.rAFHandleResize"]);
                }
            }["TextareaAutosize.TextareaAutosize.useEnhancedEffect.rAFHandleResize"];
            const debounceHandleResize = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$debounce$2f$debounce$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__unstable_debounce$3e$__["unstable_debounce"])(handleResize);
            const input = inputRef.current;
            const containerWindow = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$ownerWindow$2f$ownerWindow$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__unstable_ownerWindow$3e$__["unstable_ownerWindow"])(input);
            containerWindow.addEventListener('resize', debounceHandleResize);
            let resizeObserver;
            if (typeof ResizeObserver !== 'undefined') {
                resizeObserver = new ResizeObserver(("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : handleResize);
                resizeObserver.observe(input);
            }
            return ({
                "TextareaAutosize.TextareaAutosize.useEnhancedEffect": ()=>{
                    debounceHandleResize.clear();
                    cancelAnimationFrame(rAF);
                    containerWindow.removeEventListener('resize', debounceHandleResize);
                    if (resizeObserver) {
                        resizeObserver.disconnect();
                    }
                }
            })["TextareaAutosize.TextareaAutosize.useEnhancedEffect"];
        }
    }["TextareaAutosize.TextareaAutosize.useEnhancedEffect"], [
        getUpdatedState
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$useEnhancedEffect$2f$useEnhancedEffect$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__unstable_useEnhancedEffect$3e$__["unstable_useEnhancedEffect"])({
        "TextareaAutosize.TextareaAutosize.useEnhancedEffect": ()=>{
            syncHeight();
        }
    }["TextareaAutosize.TextareaAutosize.useEnhancedEffect"]);
    __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "TextareaAutosize.TextareaAutosize.useEffect": ()=>{
            renders.current = 0;
        }
    }["TextareaAutosize.TextareaAutosize.useEffect"], [
        value
    ]);
    const handleChange = (event)=>{
        renders.current = 0;
        if (!isControlled) {
            syncHeight();
        }
        if (onChange) {
            onChange(event);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxs"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])("textarea", (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$babel$2f$runtime$2f$helpers$2f$esm$2f$extends$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])({
                value: value,
                onChange: handleChange,
                ref: handleRef,
                rows: minRows,
                style: (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$babel$2f$runtime$2f$helpers$2f$esm$2f$extends$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])({
                    height: state.outerHeightStyle,
                    // Need a large enough difference to allow scrolling.
                    // This prevents infinite rendering loop.
                    overflow: state.overflow ? 'hidden' : undefined
                }, style)
            }, other)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])("textarea", {
                "aria-hidden": true,
                className: props.className,
                readOnly: true,
                ref: shadowRef,
                tabIndex: -1,
                style: (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$babel$2f$runtime$2f$helpers$2f$esm$2f$extends$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])({}, styles.shadow, style, {
                    paddingTop: 0,
                    paddingBottom: 0
                })
            })
        ]
    });
});
("TURBOPACK compile-time truthy", 1) ? TextareaAutosize.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // |     To update them edit TypeScript types and run "yarn proptypes"  |
    // ----------------------------------------------------------------------
    /**
   * @ignore
   */ className: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].string,
    /**
   * Maximum number of rows to display.
   */ maxRows: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].oneOfType([
        __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].number,
        __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].string
    ]),
    /**
   * Minimum number of rows to display.
   * @default 1
   */ minRows: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].oneOfType([
        __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].number,
        __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].string
    ]),
    /**
   * @ignore
   */ onChange: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].func,
    /**
   * @ignore
   */ placeholder: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].string,
    /**
   * @ignore
   */ style: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].object,
    /**
   * @ignore
   */ value: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].oneOfType([
        __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].arrayOf(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].string),
        __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].number,
        __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].string
    ])
} : "TURBOPACK unreachable";
;
}),
"[project]/web/node_modules/@mui/base/utils/appendOwnerState.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "appendOwnerState",
    ()=>appendOwnerState
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$babel$2f$runtime$2f$helpers$2f$esm$2f$extends$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@babel/runtime/helpers/esm/extends.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$base$2f$utils$2f$isHostComponent$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/base/utils/isHostComponent.js [app-client] (ecmascript)");
;
;
function appendOwnerState(elementType, otherProps, ownerState) {
    if (elementType === undefined || (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$base$2f$utils$2f$isHostComponent$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isHostComponent"])(elementType)) {
        return otherProps;
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$babel$2f$runtime$2f$helpers$2f$esm$2f$extends$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])({}, otherProps, {
        ownerState: (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$babel$2f$runtime$2f$helpers$2f$esm$2f$extends$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])({}, otherProps.ownerState, ownerState)
    });
}
}),
"[project]/web/node_modules/@mui/base/utils/extractEventHandlers.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Extracts event handlers from a given object.
 * A prop is considered an event handler if it is a function and its name starts with `on`.
 *
 * @param object An object to extract event handlers from.
 * @param excludeKeys An array of keys to exclude from the returned object.
 */ __turbopack_context__.s([
    "extractEventHandlers",
    ()=>extractEventHandlers
]);
function extractEventHandlers(object, excludeKeys = []) {
    if (object === undefined) {
        return {};
    }
    const result = {};
    Object.keys(object).filter((prop)=>prop.match(/^on[A-Z]/) && typeof object[prop] === 'function' && !excludeKeys.includes(prop)).forEach((prop)=>{
        result[prop] = object[prop];
    });
    return result;
}
}),
"[project]/web/node_modules/@mui/base/utils/omitEventHandlers.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Removes event handlers from the given object.
 * A field is considered an event handler if it is a function with a name beginning with `on`.
 *
 * @param object Object to remove event handlers from.
 * @returns Object with event handlers removed.
 */ __turbopack_context__.s([
    "omitEventHandlers",
    ()=>omitEventHandlers
]);
function omitEventHandlers(object) {
    if (object === undefined) {
        return {};
    }
    const result = {};
    Object.keys(object).filter((prop)=>!(prop.match(/^on[A-Z]/) && typeof object[prop] === 'function')).forEach((prop)=>{
        result[prop] = object[prop];
    });
    return result;
}
}),
"[project]/web/node_modules/@mui/base/utils/mergeSlotProps.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "mergeSlotProps",
    ()=>mergeSlotProps
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$babel$2f$runtime$2f$helpers$2f$esm$2f$extends$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@babel/runtime/helpers/esm/extends.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$base$2f$utils$2f$extractEventHandlers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/base/utils/extractEventHandlers.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$base$2f$utils$2f$omitEventHandlers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/base/utils/omitEventHandlers.js [app-client] (ecmascript)");
;
;
;
;
function mergeSlotProps(parameters) {
    const { getSlotProps, additionalProps, externalSlotProps, externalForwardedProps, className } = parameters;
    if (!getSlotProps) {
        // The simpler case - getSlotProps is not defined, so no internal event handlers are defined,
        // so we can simply merge all the props without having to worry about extracting event handlers.
        const joinedClasses = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(externalForwardedProps == null ? void 0 : externalForwardedProps.className, externalSlotProps == null ? void 0 : externalSlotProps.className, className, additionalProps == null ? void 0 : additionalProps.className);
        const mergedStyle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$babel$2f$runtime$2f$helpers$2f$esm$2f$extends$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])({}, additionalProps == null ? void 0 : additionalProps.style, externalForwardedProps == null ? void 0 : externalForwardedProps.style, externalSlotProps == null ? void 0 : externalSlotProps.style);
        const props = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$babel$2f$runtime$2f$helpers$2f$esm$2f$extends$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])({}, additionalProps, externalForwardedProps, externalSlotProps);
        if (joinedClasses.length > 0) {
            props.className = joinedClasses;
        }
        if (Object.keys(mergedStyle).length > 0) {
            props.style = mergedStyle;
        }
        return {
            props,
            internalRef: undefined
        };
    }
    // In this case, getSlotProps is responsible for calling the external event handlers.
    // We don't need to include them in the merged props because of this.
    const eventHandlers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$base$2f$utils$2f$extractEventHandlers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["extractEventHandlers"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$babel$2f$runtime$2f$helpers$2f$esm$2f$extends$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])({}, externalForwardedProps, externalSlotProps));
    const componentsPropsWithoutEventHandlers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$base$2f$utils$2f$omitEventHandlers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["omitEventHandlers"])(externalSlotProps);
    const otherPropsWithoutEventHandlers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$base$2f$utils$2f$omitEventHandlers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["omitEventHandlers"])(externalForwardedProps);
    const internalSlotProps = getSlotProps(eventHandlers);
    // The order of classes is important here.
    // Emotion (that we use in libraries consuming Base UI) depends on this order
    // to properly override style. It requires the most important classes to be last
    // (see https://github.com/mui/material-ui/pull/33205) for the related discussion.
    const joinedClasses = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(internalSlotProps == null ? void 0 : internalSlotProps.className, additionalProps == null ? void 0 : additionalProps.className, className, externalForwardedProps == null ? void 0 : externalForwardedProps.className, externalSlotProps == null ? void 0 : externalSlotProps.className);
    const mergedStyle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$babel$2f$runtime$2f$helpers$2f$esm$2f$extends$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])({}, internalSlotProps == null ? void 0 : internalSlotProps.style, additionalProps == null ? void 0 : additionalProps.style, externalForwardedProps == null ? void 0 : externalForwardedProps.style, externalSlotProps == null ? void 0 : externalSlotProps.style);
    const props = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$babel$2f$runtime$2f$helpers$2f$esm$2f$extends$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])({}, internalSlotProps, additionalProps, otherPropsWithoutEventHandlers, componentsPropsWithoutEventHandlers);
    if (joinedClasses.length > 0) {
        props.className = joinedClasses;
    }
    if (Object.keys(mergedStyle).length > 0) {
        props.style = mergedStyle;
    }
    return {
        props,
        internalRef: internalSlotProps.ref
    };
}
}),
"[project]/web/node_modules/@mui/base/utils/resolveComponentProps.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * If `componentProps` is a function, calls it with the provided `ownerState`.
 * Otherwise, just returns `componentProps`.
 */ __turbopack_context__.s([
    "resolveComponentProps",
    ()=>resolveComponentProps
]);
function resolveComponentProps(componentProps, ownerState, slotState) {
    if (typeof componentProps === 'function') {
        return componentProps(ownerState, slotState);
    }
    return componentProps;
}
}),
"[project]/web/node_modules/@mui/base/utils/useSlotProps.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useSlotProps",
    ()=>useSlotProps
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$babel$2f$runtime$2f$helpers$2f$esm$2f$extends$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@babel/runtime/helpers/esm/extends.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$babel$2f$runtime$2f$helpers$2f$esm$2f$objectWithoutPropertiesLoose$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@babel/runtime/helpers/esm/objectWithoutPropertiesLoose.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$useForkRef$2f$useForkRef$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__unstable_useForkRef$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/utils/esm/useForkRef/useForkRef.js [app-client] (ecmascript) <export default as unstable_useForkRef>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$base$2f$utils$2f$appendOwnerState$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/base/utils/appendOwnerState.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$base$2f$utils$2f$mergeSlotProps$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/base/utils/mergeSlotProps.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$base$2f$utils$2f$resolveComponentProps$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/base/utils/resolveComponentProps.js [app-client] (ecmascript)");
'use client';
;
;
const _excluded = [
    "elementType",
    "externalSlotProps",
    "ownerState",
    "skipResolvingSlotProps"
];
;
;
;
;
function useSlotProps(parameters) {
    var _parameters$additiona;
    const { elementType, externalSlotProps, ownerState, skipResolvingSlotProps = false } = parameters, rest = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$babel$2f$runtime$2f$helpers$2f$esm$2f$objectWithoutPropertiesLoose$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(parameters, _excluded);
    const resolvedComponentsProps = skipResolvingSlotProps ? {} : (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$base$2f$utils$2f$resolveComponentProps$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resolveComponentProps"])(externalSlotProps, ownerState);
    const { props: mergedProps, internalRef } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$base$2f$utils$2f$mergeSlotProps$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mergeSlotProps"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$babel$2f$runtime$2f$helpers$2f$esm$2f$extends$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])({}, rest, {
        externalSlotProps: resolvedComponentsProps
    }));
    const ref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$useForkRef$2f$useForkRef$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__unstable_useForkRef$3e$__["unstable_useForkRef"])(internalRef, resolvedComponentsProps == null ? void 0 : resolvedComponentsProps.ref, (_parameters$additiona = parameters.additionalProps) == null ? void 0 : _parameters$additiona.ref);
    const props = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$base$2f$utils$2f$appendOwnerState$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["appendOwnerState"])(elementType, (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$babel$2f$runtime$2f$helpers$2f$esm$2f$extends$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])({}, mergedProps, {
        ref
    }), ownerState);
    return props;
}
}),
"[project]/web/node_modules/@mui/base/unstable_useModal/ModalManager.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ModalManager",
    ()=>ModalManager,
    "ariaHidden",
    ()=>ariaHidden
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$ownerWindow$2f$ownerWindow$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__unstable_ownerWindow$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/utils/esm/ownerWindow/ownerWindow.js [app-client] (ecmascript) <export default as unstable_ownerWindow>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$ownerDocument$2f$ownerDocument$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__unstable_ownerDocument$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/utils/esm/ownerDocument/ownerDocument.js [app-client] (ecmascript) <export default as unstable_ownerDocument>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$getScrollbarSize$2f$getScrollbarSize$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__unstable_getScrollbarSize$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/utils/esm/getScrollbarSize/getScrollbarSize.js [app-client] (ecmascript) <export default as unstable_getScrollbarSize>");
;
// Is a vertical scrollbar displayed?
function isOverflowing(container) {
    const doc = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$ownerDocument$2f$ownerDocument$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__unstable_ownerDocument$3e$__["unstable_ownerDocument"])(container);
    if (doc.body === container) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$ownerWindow$2f$ownerWindow$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__unstable_ownerWindow$3e$__["unstable_ownerWindow"])(container).innerWidth > doc.documentElement.clientWidth;
    }
    return container.scrollHeight > container.clientHeight;
}
function ariaHidden(element, show) {
    if (show) {
        element.setAttribute('aria-hidden', 'true');
    } else {
        element.removeAttribute('aria-hidden');
    }
}
function getPaddingRight(element) {
    return parseInt((0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$ownerWindow$2f$ownerWindow$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__unstable_ownerWindow$3e$__["unstable_ownerWindow"])(element).getComputedStyle(element).paddingRight, 10) || 0;
}
function isAriaHiddenForbiddenOnElement(element) {
    // The forbidden HTML tags are the ones from ARIA specification that
    // can be children of body and can't have aria-hidden attribute.
    // cf. https://www.w3.org/TR/html-aria/#docconformance
    const forbiddenTagNames = [
        'TEMPLATE',
        'SCRIPT',
        'STYLE',
        'LINK',
        'MAP',
        'META',
        'NOSCRIPT',
        'PICTURE',
        'COL',
        'COLGROUP',
        'PARAM',
        'SLOT',
        'SOURCE',
        'TRACK'
    ];
    const isForbiddenTagName = forbiddenTagNames.indexOf(element.tagName) !== -1;
    const isInputHidden = element.tagName === 'INPUT' && element.getAttribute('type') === 'hidden';
    return isForbiddenTagName || isInputHidden;
}
function ariaHiddenSiblings(container, mountElement, currentElement, elementsToExclude, show) {
    const blacklist = [
        mountElement,
        currentElement,
        ...elementsToExclude
    ];
    [].forEach.call(container.children, (element)=>{
        const isNotExcludedElement = blacklist.indexOf(element) === -1;
        const isNotForbiddenElement = !isAriaHiddenForbiddenOnElement(element);
        if (isNotExcludedElement && isNotForbiddenElement) {
            ariaHidden(element, show);
        }
    });
}
function findIndexOf(items, callback) {
    let idx = -1;
    items.some((item, index)=>{
        if (callback(item)) {
            idx = index;
            return true;
        }
        return false;
    });
    return idx;
}
function handleContainer(containerInfo, props) {
    const restoreStyle = [];
    const container = containerInfo.container;
    if (!props.disableScrollLock) {
        if (isOverflowing(container)) {
            // Compute the size before applying overflow hidden to avoid any scroll jumps.
            const scrollbarSize = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$getScrollbarSize$2f$getScrollbarSize$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__unstable_getScrollbarSize$3e$__["unstable_getScrollbarSize"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$ownerDocument$2f$ownerDocument$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__unstable_ownerDocument$3e$__["unstable_ownerDocument"])(container));
            restoreStyle.push({
                value: container.style.paddingRight,
                property: 'padding-right',
                el: container
            });
            // Use computed style, here to get the real padding to add our scrollbar width.
            container.style.paddingRight = `${getPaddingRight(container) + scrollbarSize}px`;
            // .mui-fixed is a global helper.
            const fixedElements = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$ownerDocument$2f$ownerDocument$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__unstable_ownerDocument$3e$__["unstable_ownerDocument"])(container).querySelectorAll('.mui-fixed');
            [].forEach.call(fixedElements, (element)=>{
                restoreStyle.push({
                    value: element.style.paddingRight,
                    property: 'padding-right',
                    el: element
                });
                element.style.paddingRight = `${getPaddingRight(element) + scrollbarSize}px`;
            });
        }
        let scrollContainer;
        if (container.parentNode instanceof DocumentFragment) {
            scrollContainer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$ownerDocument$2f$ownerDocument$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__unstable_ownerDocument$3e$__["unstable_ownerDocument"])(container).body;
        } else {
            // Support html overflow-y: auto for scroll stability between pages
            // https://css-tricks.com/snippets/css/force-vertical-scrollbar/
            const parent = container.parentElement;
            const containerWindow = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$ownerWindow$2f$ownerWindow$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__unstable_ownerWindow$3e$__["unstable_ownerWindow"])(container);
            scrollContainer = (parent == null ? void 0 : parent.nodeName) === 'HTML' && containerWindow.getComputedStyle(parent).overflowY === 'scroll' ? parent : container;
        }
        // Block the scroll even if no scrollbar is visible to account for mobile keyboard
        // screensize shrink.
        restoreStyle.push({
            value: scrollContainer.style.overflow,
            property: 'overflow',
            el: scrollContainer
        }, {
            value: scrollContainer.style.overflowX,
            property: 'overflow-x',
            el: scrollContainer
        }, {
            value: scrollContainer.style.overflowY,
            property: 'overflow-y',
            el: scrollContainer
        });
        scrollContainer.style.overflow = 'hidden';
    }
    const restore = ()=>{
        restoreStyle.forEach(({ value, el, property })=>{
            if (value) {
                el.style.setProperty(property, value);
            } else {
                el.style.removeProperty(property);
            }
        });
    };
    return restore;
}
function getHiddenSiblings(container) {
    const hiddenSiblings = [];
    [].forEach.call(container.children, (element)=>{
        if (element.getAttribute('aria-hidden') === 'true') {
            hiddenSiblings.push(element);
        }
    });
    return hiddenSiblings;
}
class ModalManager {
    constructor(){
        this.containers = void 0;
        this.modals = void 0;
        this.modals = [];
        this.containers = [];
    }
    add(modal, container) {
        let modalIndex = this.modals.indexOf(modal);
        if (modalIndex !== -1) {
            return modalIndex;
        }
        modalIndex = this.modals.length;
        this.modals.push(modal);
        // If the modal we are adding is already in the DOM.
        if (modal.modalRef) {
            ariaHidden(modal.modalRef, false);
        }
        const hiddenSiblings = getHiddenSiblings(container);
        ariaHiddenSiblings(container, modal.mount, modal.modalRef, hiddenSiblings, true);
        const containerIndex = findIndexOf(this.containers, (item)=>item.container === container);
        if (containerIndex !== -1) {
            this.containers[containerIndex].modals.push(modal);
            return modalIndex;
        }
        this.containers.push({
            modals: [
                modal
            ],
            container,
            restore: null,
            hiddenSiblings
        });
        return modalIndex;
    }
    mount(modal, props) {
        const containerIndex = findIndexOf(this.containers, (item)=>item.modals.indexOf(modal) !== -1);
        const containerInfo = this.containers[containerIndex];
        if (!containerInfo.restore) {
            containerInfo.restore = handleContainer(containerInfo, props);
        }
    }
    remove(modal, ariaHiddenState = true) {
        const modalIndex = this.modals.indexOf(modal);
        if (modalIndex === -1) {
            return modalIndex;
        }
        const containerIndex = findIndexOf(this.containers, (item)=>item.modals.indexOf(modal) !== -1);
        const containerInfo = this.containers[containerIndex];
        containerInfo.modals.splice(containerInfo.modals.indexOf(modal), 1);
        this.modals.splice(modalIndex, 1);
        // If that was the last modal in a container, clean up the container.
        if (containerInfo.modals.length === 0) {
            // The modal might be closed before it had the chance to be mounted in the DOM.
            if (containerInfo.restore) {
                containerInfo.restore();
            }
            if (modal.modalRef) {
                // In case the modal wasn't in the DOM yet.
                ariaHidden(modal.modalRef, ariaHiddenState);
            }
            ariaHiddenSiblings(containerInfo.container, modal.mount, modal.modalRef, containerInfo.hiddenSiblings, false);
            this.containers.splice(containerIndex, 1);
        } else {
            // Otherwise make sure the next top modal is visible to a screen reader.
            const nextTop = containerInfo.modals[containerInfo.modals.length - 1];
            // as soon as a modal is adding its modalRef is undefined. it can't set
            // aria-hidden because the dom element doesn't exist either
            // when modal was unmounted before modalRef gets null
            if (nextTop.modalRef) {
                ariaHidden(nextTop.modalRef, false);
            }
        }
        return modalIndex;
    }
    isTopModal(modal) {
        return this.modals.length > 0 && this.modals[this.modals.length - 1] === modal;
    }
}
}),
"[project]/web/node_modules/@mui/base/unstable_useModal/useModal.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useModal",
    ()=>useModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$babel$2f$runtime$2f$helpers$2f$esm$2f$extends$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@babel/runtime/helpers/esm/extends.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$ownerDocument$2f$ownerDocument$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__unstable_ownerDocument$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/utils/esm/ownerDocument/ownerDocument.js [app-client] (ecmascript) <export default as unstable_ownerDocument>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$useForkRef$2f$useForkRef$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__unstable_useForkRef$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/utils/esm/useForkRef/useForkRef.js [app-client] (ecmascript) <export default as unstable_useForkRef>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$useEventCallback$2f$useEventCallback$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__unstable_useEventCallback$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/utils/esm/useEventCallback/useEventCallback.js [app-client] (ecmascript) <export default as unstable_useEventCallback>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$createChainedFunction$2f$createChainedFunction$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__unstable_createChainedFunction$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/utils/esm/createChainedFunction/createChainedFunction.js [app-client] (ecmascript) <export default as unstable_createChainedFunction>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$base$2f$utils$2f$extractEventHandlers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/base/utils/extractEventHandlers.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$base$2f$unstable_useModal$2f$ModalManager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/base/unstable_useModal/ModalManager.js [app-client] (ecmascript)");
'use client';
;
;
;
;
;
function getContainer(container) {
    return typeof container === 'function' ? container() : container;
}
function getHasTransition(children) {
    return children ? children.props.hasOwnProperty('in') : false;
}
// A modal manager used to track and manage the state of open Modals.
// Modals don't open on the server so this won't conflict with concurrent requests.
const defaultManager = new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$base$2f$unstable_useModal$2f$ModalManager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ModalManager"]();
function useModal(parameters) {
    const { container, disableEscapeKeyDown = false, disableScrollLock = false, // @ts-ignore internal logic - Base UI supports the manager as a prop too
    manager = defaultManager, closeAfterTransition = false, onTransitionEnter, onTransitionExited, children, onClose, open, rootRef } = parameters;
    // @ts-ignore internal logic
    const modal = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"]({});
    const mountNodeRef = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](null);
    const modalRef = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](null);
    const handleRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$useForkRef$2f$useForkRef$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__unstable_useForkRef$3e$__["unstable_useForkRef"])(modalRef, rootRef);
    const [exited, setExited] = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](!open);
    const hasTransition = getHasTransition(children);
    let ariaHiddenProp = true;
    if (parameters['aria-hidden'] === 'false' || parameters['aria-hidden'] === false) {
        ariaHiddenProp = false;
    }
    const getDoc = ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$ownerDocument$2f$ownerDocument$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__unstable_ownerDocument$3e$__["unstable_ownerDocument"])(mountNodeRef.current);
    const getModal = ()=>{
        modal.current.modalRef = modalRef.current;
        modal.current.mount = mountNodeRef.current;
        return modal.current;
    };
    const handleMounted = ()=>{
        manager.mount(getModal(), {
            disableScrollLock
        });
        // Fix a bug on Chrome where the scroll isn't initially 0.
        if (modalRef.current) {
            modalRef.current.scrollTop = 0;
        }
    };
    const handleOpen = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$useEventCallback$2f$useEventCallback$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__unstable_useEventCallback$3e$__["unstable_useEventCallback"])({
        "useModal.useEventCallback[handleOpen]": ()=>{
            const resolvedContainer = getContainer(container) || getDoc().body;
            manager.add(getModal(), resolvedContainer);
            // The element was already mounted.
            if (modalRef.current) {
                handleMounted();
            }
        }
    }["useModal.useEventCallback[handleOpen]"]);
    const isTopModal = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "useModal.useCallback[isTopModal]": ()=>manager.isTopModal(getModal())
    }["useModal.useCallback[isTopModal]"], [
        manager
    ]);
    const handlePortalRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$useEventCallback$2f$useEventCallback$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__unstable_useEventCallback$3e$__["unstable_useEventCallback"])({
        "useModal.useEventCallback[handlePortalRef]": (node)=>{
            mountNodeRef.current = node;
            if (!node) {
                return;
            }
            if (open && isTopModal()) {
                handleMounted();
            } else if (modalRef.current) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$base$2f$unstable_useModal$2f$ModalManager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ariaHidden"])(modalRef.current, ariaHiddenProp);
            }
        }
    }["useModal.useEventCallback[handlePortalRef]"]);
    const handleClose = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "useModal.useCallback[handleClose]": ()=>{
            manager.remove(getModal(), ariaHiddenProp);
        }
    }["useModal.useCallback[handleClose]"], [
        ariaHiddenProp,
        manager
    ]);
    __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "useModal.useEffect": ()=>{
            return ({
                "useModal.useEffect": ()=>{
                    handleClose();
                }
            })["useModal.useEffect"];
        }
    }["useModal.useEffect"], [
        handleClose
    ]);
    __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "useModal.useEffect": ()=>{
            if (open) {
                handleOpen();
            } else if (!hasTransition || !closeAfterTransition) {
                handleClose();
            }
        }
    }["useModal.useEffect"], [
        open,
        handleClose,
        hasTransition,
        closeAfterTransition,
        handleOpen
    ]);
    const createHandleKeyDown = (otherHandlers)=>(event)=>{
            var _otherHandlers$onKeyD;
            (_otherHandlers$onKeyD = otherHandlers.onKeyDown) == null || _otherHandlers$onKeyD.call(otherHandlers, event);
            // The handler doesn't take event.defaultPrevented into account:
            //
            // event.preventDefault() is meant to stop default behaviors like
            // clicking a checkbox to check it, hitting a button to submit a form,
            // and hitting left arrow to move the cursor in a text input etc.
            // Only special HTML elements have these default behaviors.
            if (event.key !== 'Escape' || !isTopModal()) {
                return;
            }
            if (!disableEscapeKeyDown) {
                // Swallow the event, in case someone is listening for the escape key on the body.
                event.stopPropagation();
                if (onClose) {
                    onClose(event, 'escapeKeyDown');
                }
            }
        };
    const createHandleBackdropClick = (otherHandlers)=>(event)=>{
            var _otherHandlers$onClic;
            (_otherHandlers$onClic = otherHandlers.onClick) == null || _otherHandlers$onClic.call(otherHandlers, event);
            if (event.target !== event.currentTarget) {
                return;
            }
            if (onClose) {
                onClose(event, 'backdropClick');
            }
        };
    const getRootProps = (otherHandlers = {})=>{
        const propsEventHandlers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$base$2f$utils$2f$extractEventHandlers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["extractEventHandlers"])(parameters);
        // The custom event handlers shouldn't be spread on the root element
        delete propsEventHandlers.onTransitionEnter;
        delete propsEventHandlers.onTransitionExited;
        const externalEventHandlers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$babel$2f$runtime$2f$helpers$2f$esm$2f$extends$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])({}, propsEventHandlers, otherHandlers);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$babel$2f$runtime$2f$helpers$2f$esm$2f$extends$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])({
            role: 'presentation'
        }, externalEventHandlers, {
            onKeyDown: createHandleKeyDown(externalEventHandlers),
            ref: handleRef
        });
    };
    const getBackdropProps = (otherHandlers = {})=>{
        const externalEventHandlers = otherHandlers;
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$babel$2f$runtime$2f$helpers$2f$esm$2f$extends$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])({
            'aria-hidden': true
        }, externalEventHandlers, {
            onClick: createHandleBackdropClick(externalEventHandlers),
            open
        });
    };
    const getTransitionProps = ()=>{
        const handleEnter = ()=>{
            setExited(false);
            if (onTransitionEnter) {
                onTransitionEnter();
            }
        };
        const handleExited = ()=>{
            setExited(true);
            if (onTransitionExited) {
                onTransitionExited();
            }
            if (closeAfterTransition) {
                handleClose();
            }
        };
        return {
            onEnter: (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$createChainedFunction$2f$createChainedFunction$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__unstable_createChainedFunction$3e$__["unstable_createChainedFunction"])(handleEnter, children == null ? void 0 : children.props.onEnter),
            onExited: (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$createChainedFunction$2f$createChainedFunction$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__unstable_createChainedFunction$3e$__["unstable_createChainedFunction"])(handleExited, children == null ? void 0 : children.props.onExited)
        };
    };
    return {
        getRootProps,
        getBackdropProps,
        getTransitionProps,
        rootRef: handleRef,
        portalRef: handlePortalRef,
        isTopModal,
        exited,
        hasTransition
    };
}
}),
"[project]/web/node_modules/@mui/base/unstable_useModal/useModal.js [app-client] (ecmascript) <export useModal as unstable_useModal>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "unstable_useModal",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$base$2f$unstable_useModal$2f$useModal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useModal"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$base$2f$unstable_useModal$2f$useModal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/base/unstable_useModal/useModal.js [app-client] (ecmascript)");
}),
"[project]/web/node_modules/@mui/base/FocusTrap/FocusTrap.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FocusTrap",
    ()=>FocusTrap
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/web/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
/* eslint-disable consistent-return, jsx-a11y/no-noninteractive-tabindex */ var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/prop-types/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$exactProp$2f$exactProp$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__exactProp$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/utils/esm/exactProp/exactProp.js [app-client] (ecmascript) <export default as exactProp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$elementAcceptingRef$2f$elementAcceptingRef$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__elementAcceptingRef$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/utils/esm/elementAcceptingRef/elementAcceptingRef.js [app-client] (ecmascript) <export default as elementAcceptingRef>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$useForkRef$2f$useForkRef$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__unstable_useForkRef$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/utils/esm/useForkRef/useForkRef.js [app-client] (ecmascript) <export default as unstable_useForkRef>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$ownerDocument$2f$ownerDocument$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__unstable_ownerDocument$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/utils/esm/ownerDocument/ownerDocument.js [app-client] (ecmascript) <export default as unstable_ownerDocument>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
'use client';
;
;
;
;
;
// Inspired by https://github.com/focus-trap/tabbable
const candidatesSelector = [
    'input',
    'select',
    'textarea',
    'a[href]',
    'button',
    '[tabindex]',
    'audio[controls]',
    'video[controls]',
    '[contenteditable]:not([contenteditable="false"])'
].join(',');
function getTabIndex(node) {
    const tabindexAttr = parseInt(node.getAttribute('tabindex') || '', 10);
    if (!Number.isNaN(tabindexAttr)) {
        return tabindexAttr;
    }
    // Browsers do not return `tabIndex` correctly for contentEditable nodes;
    // https://bugs.chromium.org/p/chromium/issues/detail?id=661108&q=contenteditable%20tabindex&can=2
    // so if they don't have a tabindex attribute specifically set, assume it's 0.
    // in Chrome, <details/>, <audio controls/> and <video controls/> elements get a default
    //  `tabIndex` of -1 when the 'tabindex' attribute isn't specified in the DOM,
    //  yet they are still part of the regular tab order; in FF, they get a default
    //  `tabIndex` of 0; since Chrome still puts those elements in the regular tab
    //  order, consider their tab index to be 0.
    if (node.contentEditable === 'true' || (node.nodeName === 'AUDIO' || node.nodeName === 'VIDEO' || node.nodeName === 'DETAILS') && node.getAttribute('tabindex') === null) {
        return 0;
    }
    return node.tabIndex;
}
function isNonTabbableRadio(node) {
    if (node.tagName !== 'INPUT' || node.type !== 'radio') {
        return false;
    }
    if (!node.name) {
        return false;
    }
    const getRadio = (selector)=>node.ownerDocument.querySelector(`input[type="radio"]${selector}`);
    let roving = getRadio(`[name="${node.name}"]:checked`);
    if (!roving) {
        roving = getRadio(`[name="${node.name}"]`);
    }
    return roving !== node;
}
function isNodeMatchingSelectorFocusable(node) {
    if (node.disabled || node.tagName === 'INPUT' && node.type === 'hidden' || isNonTabbableRadio(node)) {
        return false;
    }
    return true;
}
function defaultGetTabbable(root) {
    const regularTabNodes = [];
    const orderedTabNodes = [];
    Array.from(root.querySelectorAll(candidatesSelector)).forEach((node, i)=>{
        const nodeTabIndex = getTabIndex(node);
        if (nodeTabIndex === -1 || !isNodeMatchingSelectorFocusable(node)) {
            return;
        }
        if (nodeTabIndex === 0) {
            regularTabNodes.push(node);
        } else {
            orderedTabNodes.push({
                documentOrder: i,
                tabIndex: nodeTabIndex,
                node: node
            });
        }
    });
    return orderedTabNodes.sort((a, b)=>a.tabIndex === b.tabIndex ? a.documentOrder - b.documentOrder : a.tabIndex - b.tabIndex).map((a)=>a.node).concat(regularTabNodes);
}
function defaultIsEnabled() {
    return true;
}
/**
 * Utility component that locks focus inside the component.
 *
 * Demos:
 *
 * - [Focus Trap](https://mui.com/base-ui/react-focus-trap/)
 *
 * API:
 *
 * - [FocusTrap API](https://mui.com/base-ui/react-focus-trap/components-api/#focus-trap)
 */ function FocusTrap(props) {
    const { children, disableAutoFocus = false, disableEnforceFocus = false, disableRestoreFocus = false, getTabbable = defaultGetTabbable, isEnabled = defaultIsEnabled, open } = props;
    const ignoreNextEnforceFocus = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](false);
    const sentinelStart = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](null);
    const sentinelEnd = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](null);
    const nodeToRestore = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](null);
    const reactFocusEventTarget = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](null);
    // This variable is useful when disableAutoFocus is true.
    // It waits for the active element to move into the component to activate.
    const activated = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](false);
    const rootRef = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](null);
    // @ts-expect-error TODO upstream fix
    const handleRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$useForkRef$2f$useForkRef$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__unstable_useForkRef$3e$__["unstable_useForkRef"])(children.ref, rootRef);
    const lastKeydown = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](null);
    __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "FocusTrap.useEffect": ()=>{
            // We might render an empty child.
            if (!open || !rootRef.current) {
                return;
            }
            activated.current = !disableAutoFocus;
        }
    }["FocusTrap.useEffect"], [
        disableAutoFocus,
        open
    ]);
    __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "FocusTrap.useEffect": ()=>{
            // We might render an empty child.
            if (!open || !rootRef.current) {
                return;
            }
            const doc = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$ownerDocument$2f$ownerDocument$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__unstable_ownerDocument$3e$__["unstable_ownerDocument"])(rootRef.current);
            if (!rootRef.current.contains(doc.activeElement)) {
                if (!rootRef.current.hasAttribute('tabIndex')) {
                    if ("TURBOPACK compile-time truthy", 1) {
                        console.error([
                            'MUI: The modal content node does not accept focus.',
                            'For the benefit of assistive technologies, ' + 'the tabIndex of the node is being set to "-1".'
                        ].join('\n'));
                    }
                    rootRef.current.setAttribute('tabIndex', '-1');
                }
                if (activated.current) {
                    rootRef.current.focus();
                }
            }
            return ({
                "FocusTrap.useEffect": ()=>{
                    // restoreLastFocus()
                    if (!disableRestoreFocus) {
                        // In IE11 it is possible for document.activeElement to be null resulting
                        // in nodeToRestore.current being null.
                        // Not all elements in IE11 have a focus method.
                        // Once IE11 support is dropped the focus() call can be unconditional.
                        if (nodeToRestore.current && nodeToRestore.current.focus) {
                            ignoreNextEnforceFocus.current = true;
                            nodeToRestore.current.focus();
                        }
                        nodeToRestore.current = null;
                    }
                }
            })["FocusTrap.useEffect"];
        // Missing `disableRestoreFocus` which is fine.
        // We don't support changing that prop on an open FocusTrap
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }
    }["FocusTrap.useEffect"], [
        open
    ]);
    __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "FocusTrap.useEffect": ()=>{
            // We might render an empty child.
            if (!open || !rootRef.current) {
                return;
            }
            const doc = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$ownerDocument$2f$ownerDocument$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__unstable_ownerDocument$3e$__["unstable_ownerDocument"])(rootRef.current);
            const loopFocus = {
                "FocusTrap.useEffect.loopFocus": (nativeEvent)=>{
                    lastKeydown.current = nativeEvent;
                    if (disableEnforceFocus || !isEnabled() || nativeEvent.key !== 'Tab') {
                        return;
                    }
                    // Make sure the next tab starts from the right place.
                    // doc.activeElement refers to the origin.
                    if (doc.activeElement === rootRef.current && nativeEvent.shiftKey) {
                        // We need to ignore the next contain as
                        // it will try to move the focus back to the rootRef element.
                        ignoreNextEnforceFocus.current = true;
                        if (sentinelEnd.current) {
                            sentinelEnd.current.focus();
                        }
                    }
                }
            }["FocusTrap.useEffect.loopFocus"];
            const contain = {
                "FocusTrap.useEffect.contain": ()=>{
                    const rootElement = rootRef.current;
                    // Cleanup functions are executed lazily in React 17.
                    // Contain can be called between the component being unmounted and its cleanup function being run.
                    if (rootElement === null) {
                        return;
                    }
                    if (!doc.hasFocus() || !isEnabled() || ignoreNextEnforceFocus.current) {
                        ignoreNextEnforceFocus.current = false;
                        return;
                    }
                    // The focus is already inside
                    if (rootElement.contains(doc.activeElement)) {
                        return;
                    }
                    // The disableEnforceFocus is set and the focus is outside of the focus trap (and sentinel nodes)
                    if (disableEnforceFocus && doc.activeElement !== sentinelStart.current && doc.activeElement !== sentinelEnd.current) {
                        return;
                    }
                    // if the focus event is not coming from inside the children's react tree, reset the refs
                    if (doc.activeElement !== reactFocusEventTarget.current) {
                        reactFocusEventTarget.current = null;
                    } else if (reactFocusEventTarget.current !== null) {
                        return;
                    }
                    if (!activated.current) {
                        return;
                    }
                    let tabbable = [];
                    if (doc.activeElement === sentinelStart.current || doc.activeElement === sentinelEnd.current) {
                        tabbable = getTabbable(rootRef.current);
                    }
                    // one of the sentinel nodes was focused, so move the focus
                    // to the first/last tabbable element inside the focus trap
                    if (tabbable.length > 0) {
                        var _lastKeydown$current, _lastKeydown$current2;
                        const isShiftTab = Boolean(((_lastKeydown$current = lastKeydown.current) == null ? void 0 : _lastKeydown$current.shiftKey) && ((_lastKeydown$current2 = lastKeydown.current) == null ? void 0 : _lastKeydown$current2.key) === 'Tab');
                        const focusNext = tabbable[0];
                        const focusPrevious = tabbable[tabbable.length - 1];
                        if (typeof focusNext !== 'string' && typeof focusPrevious !== 'string') {
                            if (isShiftTab) {
                                focusPrevious.focus();
                            } else {
                                focusNext.focus();
                            }
                        }
                    // no tabbable elements in the trap focus or the focus was outside of the focus trap
                    } else {
                        rootElement.focus();
                    }
                }
            }["FocusTrap.useEffect.contain"];
            doc.addEventListener('focusin', contain);
            doc.addEventListener('keydown', loopFocus, true);
            // With Edge, Safari and Firefox, no focus related events are fired when the focused area stops being a focused area.
            // e.g. https://bugzilla.mozilla.org/show_bug.cgi?id=559561.
            // Instead, we can look if the active element was restored on the BODY element.
            //
            // The whatwg spec defines how the browser should behave but does not explicitly mention any events:
            // https://html.spec.whatwg.org/multipage/interaction.html#focus-fixup-rule.
            const interval = setInterval({
                "FocusTrap.useEffect.interval": ()=>{
                    if (doc.activeElement && doc.activeElement.tagName === 'BODY') {
                        contain();
                    }
                }
            }["FocusTrap.useEffect.interval"], 50);
            return ({
                "FocusTrap.useEffect": ()=>{
                    clearInterval(interval);
                    doc.removeEventListener('focusin', contain);
                    doc.removeEventListener('keydown', loopFocus, true);
                }
            })["FocusTrap.useEffect"];
        }
    }["FocusTrap.useEffect"], [
        disableAutoFocus,
        disableEnforceFocus,
        disableRestoreFocus,
        isEnabled,
        open,
        getTabbable
    ]);
    const onFocus = (event)=>{
        if (nodeToRestore.current === null) {
            nodeToRestore.current = event.relatedTarget;
        }
        activated.current = true;
        reactFocusEventTarget.current = event.target;
        const childrenPropsHandler = children.props.onFocus;
        if (childrenPropsHandler) {
            childrenPropsHandler(event);
        }
    };
    const handleFocusSentinel = (event)=>{
        if (nodeToRestore.current === null) {
            nodeToRestore.current = event.relatedTarget;
        }
        activated.current = true;
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxs"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])("div", {
                tabIndex: open ? 0 : -1,
                onFocus: handleFocusSentinel,
                ref: sentinelStart,
                "data-testid": "sentinelStart"
            }),
            /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cloneElement"](children, {
                ref: handleRef,
                onFocus
            }),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])("div", {
                tabIndex: open ? 0 : -1,
                onFocus: handleFocusSentinel,
                ref: sentinelEnd,
                "data-testid": "sentinelEnd"
            })
        ]
    });
}
("TURBOPACK compile-time truthy", 1) ? FocusTrap.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // |     To update them edit TypeScript types and run "yarn proptypes"  |
    // ----------------------------------------------------------------------
    /**
   * A single child content element.
   */ children: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$elementAcceptingRef$2f$elementAcceptingRef$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__elementAcceptingRef$3e$__["elementAcceptingRef"],
    /**
   * If `true`, the focus trap will not automatically shift focus to itself when it opens, and
   * replace it to the last focused element when it closes.
   * This also works correctly with any focus trap children that have the `disableAutoFocus` prop.
   *
   * Generally this should never be set to `true` as it makes the focus trap less
   * accessible to assistive technologies, like screen readers.
   * @default false
   */ disableAutoFocus: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].bool,
    /**
   * If `true`, the focus trap will not prevent focus from leaving the focus trap while open.
   *
   * Generally this should never be set to `true` as it makes the focus trap less
   * accessible to assistive technologies, like screen readers.
   * @default false
   */ disableEnforceFocus: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].bool,
    /**
   * If `true`, the focus trap will not restore focus to previously focused element once
   * focus trap is hidden or unmounted.
   * @default false
   */ disableRestoreFocus: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].bool,
    /**
   * Returns an array of ordered tabbable nodes (i.e. in tab order) within the root.
   * For instance, you can provide the "tabbable" npm dependency.
   * @param {HTMLElement} root
   */ getTabbable: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].func,
    /**
   * This prop extends the `open` prop.
   * It allows to toggle the open state without having to wait for a rerender when changing the `open` prop.
   * This prop should be memoized.
   * It can be used to support multiple focus trap mounted at the same time.
   * @default function defaultIsEnabled(): boolean {
   *   return true;
   * }
   */ isEnabled: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].func,
    /**
   * If `true`, focus is locked.
   */ open: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].bool.isRequired
} : "TURBOPACK unreachable";
if ("TURBOPACK compile-time truthy", 1) {
    // eslint-disable-next-line
    FocusTrap['propTypes' + ''] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$exactProp$2f$exactProp$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__exactProp$3e$__["exactProp"])(FocusTrap.propTypes);
}
;
}),
"[project]/web/node_modules/@mui/base/FocusTrap/FocusTrap.js [app-client] (ecmascript) <export FocusTrap as default>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$base$2f$FocusTrap$2f$FocusTrap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FocusTrap"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$base$2f$FocusTrap$2f$FocusTrap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/base/FocusTrap/FocusTrap.js [app-client] (ecmascript)");
}),
"[project]/web/node_modules/@mui/base/Portal/Portal.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Portal",
    ()=>Portal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/web/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/next/dist/compiled/react-dom/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/prop-types/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$exactProp$2f$exactProp$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__exactProp$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/utils/esm/exactProp/exactProp.js [app-client] (ecmascript) <export default as exactProp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$HTMLElementType$2f$HTMLElementType$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__HTMLElementType$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/utils/esm/HTMLElementType/HTMLElementType.js [app-client] (ecmascript) <export default as HTMLElementType>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$useEnhancedEffect$2f$useEnhancedEffect$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__unstable_useEnhancedEffect$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/utils/esm/useEnhancedEffect/useEnhancedEffect.js [app-client] (ecmascript) <export default as unstable_useEnhancedEffect>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$useForkRef$2f$useForkRef$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__unstable_useForkRef$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/utils/esm/useForkRef/useForkRef.js [app-client] (ecmascript) <export default as unstable_useForkRef>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$setRef$2f$setRef$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__unstable_setRef$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/utils/esm/setRef/setRef.js [app-client] (ecmascript) <export default as unstable_setRef>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
'use client';
;
;
;
;
;
function getContainer(container) {
    return typeof container === 'function' ? container() : container;
}
/**
 * Portals provide a first-class way to render children into a DOM node
 * that exists outside the DOM hierarchy of the parent component.
 *
 * Demos:
 *
 * - [Portal](https://mui.com/base-ui/react-portal/)
 *
 * API:
 *
 * - [Portal API](https://mui.com/base-ui/react-portal/components-api/#portal)
 */ const Portal = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](function Portal(props, forwardedRef) {
    const { children, container, disablePortal = false } = props;
    const [mountNode, setMountNode] = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](null);
    // @ts-expect-error TODO upstream fix
    const handleRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$useForkRef$2f$useForkRef$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__unstable_useForkRef$3e$__["unstable_useForkRef"])(/*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isValidElement"](children) ? children.ref : null, forwardedRef);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$useEnhancedEffect$2f$useEnhancedEffect$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__unstable_useEnhancedEffect$3e$__["unstable_useEnhancedEffect"])({
        "Portal.Portal.useEnhancedEffect": ()=>{
            if (!disablePortal) {
                setMountNode(getContainer(container) || document.body);
            }
        }
    }["Portal.Portal.useEnhancedEffect"], [
        container,
        disablePortal
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$useEnhancedEffect$2f$useEnhancedEffect$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__unstable_useEnhancedEffect$3e$__["unstable_useEnhancedEffect"])({
        "Portal.Portal.useEnhancedEffect": ()=>{
            if (mountNode && !disablePortal) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$setRef$2f$setRef$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__unstable_setRef$3e$__["unstable_setRef"])(forwardedRef, mountNode);
                return ({
                    "Portal.Portal.useEnhancedEffect": ()=>{
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$setRef$2f$setRef$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__unstable_setRef$3e$__["unstable_setRef"])(forwardedRef, null);
                    }
                })["Portal.Portal.useEnhancedEffect"];
            }
            return undefined;
        }
    }["Portal.Portal.useEnhancedEffect"], [
        forwardedRef,
        mountNode,
        disablePortal
    ]);
    if (disablePortal) {
        if (/*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isValidElement"](children)) {
            const newProps = {
                ref: handleRef
            };
            return /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cloneElement"](children, newProps);
        }
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: children
        });
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: mountNode ? /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createPortal"](children, mountNode) : mountNode
    });
});
("TURBOPACK compile-time truthy", 1) ? Portal.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // |     To update them edit TypeScript types and run "yarn proptypes"  |
    // ----------------------------------------------------------------------
    /**
   * The children to render into the `container`.
   */ children: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].node,
    /**
   * An HTML element or function that returns one.
   * The `container` will have the portal children appended to it.
   *
   * By default, it uses the body of the top-level document object,
   * so it's simply `document.body` most of the time.
   */ container: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"] /* @typescript-to-proptypes-ignore */ .oneOfType([
        __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$HTMLElementType$2f$HTMLElementType$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__HTMLElementType$3e$__["HTMLElementType"],
        __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].func
    ]),
    /**
   * The `children` will be under the DOM hierarchy of the parent component.
   * @default false
   */ disablePortal: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].bool
} : "TURBOPACK unreachable";
if ("TURBOPACK compile-time truthy", 1) {
    // eslint-disable-next-line
    Portal['propTypes' + ''] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$exactProp$2f$exactProp$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__exactProp$3e$__["exactProp"])(Portal.propTypes);
}
;
}),
"[project]/web/node_modules/@mui/base/Portal/Portal.js [app-client] (ecmascript) <export Portal as default>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$base$2f$Portal$2f$Portal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Portal"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$base$2f$Portal$2f$Portal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/base/Portal/Portal.js [app-client] (ecmascript)");
}),
"[project]/web/node_modules/@mui/base/Popper/popperClasses.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getPopperUtilityClass",
    ()=>getPopperUtilityClass,
    "popperClasses",
    ()=>popperClasses
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$generateUtilityClass$2f$generateUtilityClass$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__generateUtilityClass$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/utils/esm/generateUtilityClass/generateUtilityClass.js [app-client] (ecmascript) <export default as generateUtilityClass>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$generateUtilityClasses$2f$generateUtilityClasses$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__generateUtilityClasses$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/utils/esm/generateUtilityClasses/generateUtilityClasses.js [app-client] (ecmascript) <export default as generateUtilityClasses>");
;
;
function getPopperUtilityClass(slot) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$generateUtilityClass$2f$generateUtilityClass$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__generateUtilityClass$3e$__["generateUtilityClass"])('MuiPopper', slot);
}
const popperClasses = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$generateUtilityClasses$2f$generateUtilityClasses$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__generateUtilityClasses$3e$__["generateUtilityClasses"])('MuiPopper', [
    'root'
]);
}),
"[project]/web/node_modules/@mui/base/utils/ClassNameConfigurator.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ClassNameConfigurator",
    ()=>ClassNameConfigurator,
    "useClassNamesOverride",
    ()=>useClassNamesOverride
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
'use client';
;
;
const defaultContextValue = {
    disableDefaultClasses: false
};
const ClassNameConfiguratorContext = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"](defaultContextValue);
function useClassNamesOverride(generateUtilityClass) {
    const { disableDefaultClasses } = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"](ClassNameConfiguratorContext);
    return (slot)=>{
        if (disableDefaultClasses) {
            return '';
        }
        return generateUtilityClass(slot);
    };
}
function ClassNameConfigurator(props) {
    const { disableDefaultClasses, children } = props;
    const contextValue = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "ClassNameConfigurator.useMemo[contextValue]": ()=>({
                disableDefaultClasses: disableDefaultClasses != null ? disableDefaultClasses : false
            })
    }["ClassNameConfigurator.useMemo[contextValue]"], [
        disableDefaultClasses
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(ClassNameConfiguratorContext.Provider, {
        value: contextValue,
        children: children
    });
}
}),
"[project]/web/node_modules/@mui/base/Popper/Popper.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Popper",
    ()=>Popper
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/web/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$babel$2f$runtime$2f$helpers$2f$esm$2f$extends$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@babel/runtime/helpers/esm/extends.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$babel$2f$runtime$2f$helpers$2f$esm$2f$objectWithoutPropertiesLoose$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@babel/runtime/helpers/esm/objectWithoutPropertiesLoose.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$chainPropTypes$2f$chainPropTypes$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__chainPropTypes$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/utils/esm/chainPropTypes/chainPropTypes.js [app-client] (ecmascript) <export default as chainPropTypes>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$HTMLElementType$2f$HTMLElementType$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__HTMLElementType$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/utils/esm/HTMLElementType/HTMLElementType.js [app-client] (ecmascript) <export default as HTMLElementType>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$refType$2f$refType$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__refType$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/utils/esm/refType/refType.js [app-client] (ecmascript) <export default as refType>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$ownerDocument$2f$ownerDocument$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__unstable_ownerDocument$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/utils/esm/ownerDocument/ownerDocument.js [app-client] (ecmascript) <export default as unstable_ownerDocument>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$useEnhancedEffect$2f$useEnhancedEffect$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__unstable_useEnhancedEffect$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/utils/esm/useEnhancedEffect/useEnhancedEffect.js [app-client] (ecmascript) <export default as unstable_useEnhancedEffect>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$useForkRef$2f$useForkRef$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__unstable_useForkRef$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/utils/esm/useForkRef/useForkRef.js [app-client] (ecmascript) <export default as unstable_useForkRef>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$popperjs$2f$core$2f$lib$2f$popper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@popperjs/core/lib/popper.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/prop-types/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$composeClasses$2f$composeClasses$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__unstable_composeClasses$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/utils/esm/composeClasses/composeClasses.js [app-client] (ecmascript) <export default as unstable_composeClasses>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$base$2f$Portal$2f$Portal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/base/Portal/Portal.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$base$2f$Popper$2f$popperClasses$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/base/Popper/popperClasses.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$base$2f$utils$2f$useSlotProps$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/base/utils/useSlotProps.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$base$2f$utils$2f$ClassNameConfigurator$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/base/utils/ClassNameConfigurator.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
'use client';
;
;
const _excluded = [
    "anchorEl",
    "children",
    "direction",
    "disablePortal",
    "modifiers",
    "open",
    "placement",
    "popperOptions",
    "popperRef",
    "slotProps",
    "slots",
    "TransitionProps",
    "ownerState"
], _excluded2 = [
    "anchorEl",
    "children",
    "container",
    "direction",
    "disablePortal",
    "keepMounted",
    "modifiers",
    "open",
    "placement",
    "popperOptions",
    "popperRef",
    "style",
    "transition",
    "slotProps",
    "slots"
];
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
function flipPlacement(placement, direction) {
    if (direction === 'ltr') {
        return placement;
    }
    switch(placement){
        case 'bottom-end':
            return 'bottom-start';
        case 'bottom-start':
            return 'bottom-end';
        case 'top-end':
            return 'top-start';
        case 'top-start':
            return 'top-end';
        default:
            return placement;
    }
}
function resolveAnchorEl(anchorEl) {
    return typeof anchorEl === 'function' ? anchorEl() : anchorEl;
}
function isHTMLElement(element) {
    return element.nodeType !== undefined;
}
function isVirtualElement(element) {
    return !isHTMLElement(element);
}
const useUtilityClasses = ()=>{
    const slots = {
        root: [
            'root'
        ]
    };
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$composeClasses$2f$composeClasses$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__unstable_composeClasses$3e$__["unstable_composeClasses"])(slots, (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$base$2f$utils$2f$ClassNameConfigurator$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useClassNamesOverride"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$base$2f$Popper$2f$popperClasses$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getPopperUtilityClass"]));
};
const defaultPopperOptions = {};
const PopperTooltip = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](function PopperTooltip(props, forwardedRef) {
    var _slots$root;
    const { anchorEl, children, direction, disablePortal, modifiers, open, placement: initialPlacement, popperOptions, popperRef: popperRefProp, slotProps = {}, slots = {}, TransitionProps } = props, other = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$babel$2f$runtime$2f$helpers$2f$esm$2f$objectWithoutPropertiesLoose$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(props, _excluded);
    const tooltipRef = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](null);
    const ownRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$useForkRef$2f$useForkRef$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__unstable_useForkRef$3e$__["unstable_useForkRef"])(tooltipRef, forwardedRef);
    const popperRef = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](null);
    const handlePopperRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$useForkRef$2f$useForkRef$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__unstable_useForkRef$3e$__["unstable_useForkRef"])(popperRef, popperRefProp);
    const handlePopperRefRef = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](handlePopperRef);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$useEnhancedEffect$2f$useEnhancedEffect$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__unstable_useEnhancedEffect$3e$__["unstable_useEnhancedEffect"])({
        "PopperTooltip.PopperTooltip.useEnhancedEffect": ()=>{
            handlePopperRefRef.current = handlePopperRef;
        }
    }["PopperTooltip.PopperTooltip.useEnhancedEffect"], [
        handlePopperRef
    ]);
    __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useImperativeHandle"](popperRefProp, {
        "PopperTooltip.PopperTooltip.useImperativeHandle": ()=>popperRef.current
    }["PopperTooltip.PopperTooltip.useImperativeHandle"], []);
    const rtlPlacement = flipPlacement(initialPlacement, direction);
    /**
   * placement initialized from prop but can change during lifetime if modifiers.flip.
   * modifiers.flip is essentially a flip for controlled/uncontrolled behavior
   */ const [placement, setPlacement] = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](rtlPlacement);
    const [resolvedAnchorElement, setResolvedAnchorElement] = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](resolveAnchorEl(anchorEl));
    __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "PopperTooltip.PopperTooltip.useEffect": ()=>{
            if (popperRef.current) {
                popperRef.current.forceUpdate();
            }
        }
    }["PopperTooltip.PopperTooltip.useEffect"]);
    __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "PopperTooltip.PopperTooltip.useEffect": ()=>{
            if (anchorEl) {
                setResolvedAnchorElement(resolveAnchorEl(anchorEl));
            }
        }
    }["PopperTooltip.PopperTooltip.useEffect"], [
        anchorEl
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$useEnhancedEffect$2f$useEnhancedEffect$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__unstable_useEnhancedEffect$3e$__["unstable_useEnhancedEffect"])({
        "PopperTooltip.PopperTooltip.useEnhancedEffect": ()=>{
            if (!resolvedAnchorElement || !open) {
                return undefined;
            }
            const handlePopperUpdate = {
                "PopperTooltip.PopperTooltip.useEnhancedEffect.handlePopperUpdate": (data)=>{
                    setPlacement(data.placement);
                }
            }["PopperTooltip.PopperTooltip.useEnhancedEffect.handlePopperUpdate"];
            if ("TURBOPACK compile-time truthy", 1) {
                if (resolvedAnchorElement && isHTMLElement(resolvedAnchorElement) && resolvedAnchorElement.nodeType === 1) {
                    const box = resolvedAnchorElement.getBoundingClientRect();
                    if (("TURBOPACK compile-time value", "development") !== 'test' && box.top === 0 && box.left === 0 && box.right === 0 && box.bottom === 0) {
                        console.warn([
                            'MUI: The `anchorEl` prop provided to the component is invalid.',
                            'The anchor element should be part of the document layout.',
                            "Make sure the element is present in the document or that it's not display none."
                        ].join('\n'));
                    }
                }
            }
            let popperModifiers = [
                {
                    name: 'preventOverflow',
                    options: {
                        altBoundary: disablePortal
                    }
                },
                {
                    name: 'flip',
                    options: {
                        altBoundary: disablePortal
                    }
                },
                {
                    name: 'onUpdate',
                    enabled: true,
                    phase: 'afterWrite',
                    fn: {
                        "PopperTooltip.PopperTooltip.useEnhancedEffect": ({ state })=>{
                            handlePopperUpdate(state);
                        }
                    }["PopperTooltip.PopperTooltip.useEnhancedEffect"]
                }
            ];
            if (modifiers != null) {
                popperModifiers = popperModifiers.concat(modifiers);
            }
            if (popperOptions && popperOptions.modifiers != null) {
                popperModifiers = popperModifiers.concat(popperOptions.modifiers);
            }
            const popper = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$popperjs$2f$core$2f$lib$2f$popper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createPopper"])(resolvedAnchorElement, tooltipRef.current, (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$babel$2f$runtime$2f$helpers$2f$esm$2f$extends$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])({
                placement: rtlPlacement
            }, popperOptions, {
                modifiers: popperModifiers
            }));
            handlePopperRefRef.current(popper);
            return ({
                "PopperTooltip.PopperTooltip.useEnhancedEffect": ()=>{
                    popper.destroy();
                    handlePopperRefRef.current(null);
                }
            })["PopperTooltip.PopperTooltip.useEnhancedEffect"];
        }
    }["PopperTooltip.PopperTooltip.useEnhancedEffect"], [
        resolvedAnchorElement,
        disablePortal,
        modifiers,
        open,
        popperOptions,
        rtlPlacement
    ]);
    const childProps = {
        placement: placement
    };
    if (TransitionProps !== null) {
        childProps.TransitionProps = TransitionProps;
    }
    const classes = useUtilityClasses();
    const Root = (_slots$root = slots.root) != null ? _slots$root : 'div';
    const rootProps = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$base$2f$utils$2f$useSlotProps$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSlotProps"])({
        elementType: Root,
        externalSlotProps: slotProps.root,
        externalForwardedProps: other,
        additionalProps: {
            role: 'tooltip',
            ref: ownRef
        },
        ownerState: props,
        className: classes.root
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(Root, (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$babel$2f$runtime$2f$helpers$2f$esm$2f$extends$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])({}, rootProps, {
        children: typeof children === 'function' ? children(childProps) : children
    }));
});
/**
 * Poppers rely on the 3rd party library [Popper.js](https://popper.js.org/docs/v2/) for positioning.
 *
 * Demos:
 *
 * - [Popper](https://mui.com/base-ui/react-popper/)
 *
 * API:
 *
 * - [Popper API](https://mui.com/base-ui/react-popper/components-api/#popper)
 */ const Popper = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](function Popper(props, forwardedRef) {
    const { anchorEl, children, container: containerProp, direction = 'ltr', disablePortal = false, keepMounted = false, modifiers, open, placement = 'bottom', popperOptions = defaultPopperOptions, popperRef, style, transition = false, slotProps = {}, slots = {} } = props, other = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$babel$2f$runtime$2f$helpers$2f$esm$2f$objectWithoutPropertiesLoose$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(props, _excluded2);
    const [exited, setExited] = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](true);
    const handleEnter = ()=>{
        setExited(false);
    };
    const handleExited = ()=>{
        setExited(true);
    };
    if (!keepMounted && !open && (!transition || exited)) {
        return null;
    }
    // If the container prop is provided, use that
    // If the anchorEl prop is provided, use its parent body element as the container
    // If neither are provided let the Modal take care of choosing the container
    let container;
    if (containerProp) {
        container = containerProp;
    } else if (anchorEl) {
        const resolvedAnchorEl = resolveAnchorEl(anchorEl);
        container = resolvedAnchorEl && isHTMLElement(resolvedAnchorEl) ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$ownerDocument$2f$ownerDocument$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__unstable_ownerDocument$3e$__["unstable_ownerDocument"])(resolvedAnchorEl).body : (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$ownerDocument$2f$ownerDocument$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__unstable_ownerDocument$3e$__["unstable_ownerDocument"])(null).body;
    }
    const display = !open && keepMounted && (!transition || exited) ? 'none' : undefined;
    const transitionProps = transition ? {
        in: open,
        onEnter: handleEnter,
        onExited: handleExited
    } : undefined;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$base$2f$Portal$2f$Portal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Portal"], {
        disablePortal: disablePortal,
        container: container,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(PopperTooltip, (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$babel$2f$runtime$2f$helpers$2f$esm$2f$extends$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])({
            anchorEl: anchorEl,
            direction: direction,
            disablePortal: disablePortal,
            modifiers: modifiers,
            ref: forwardedRef,
            open: transition ? !exited : open,
            placement: placement,
            popperOptions: popperOptions,
            popperRef: popperRef,
            slotProps: slotProps,
            slots: slots
        }, other, {
            style: (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$babel$2f$runtime$2f$helpers$2f$esm$2f$extends$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])({
                // Prevents scroll issue, waiting for Popper.js to add this style once initiated.
                position: 'fixed',
                // Fix Popper.js display issue
                top: 0,
                left: 0,
                display
            }, style),
            TransitionProps: transitionProps,
            children: children
        }))
    });
});
("TURBOPACK compile-time truthy", 1) ? Popper.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // |     To update them edit TypeScript types and run "yarn proptypes"  |
    // ----------------------------------------------------------------------
    /**
   * An HTML element, [virtualElement](https://popper.js.org/docs/v2/virtual-elements/),
   * or a function that returns either.
   * It's used to set the position of the popper.
   * The return value will passed as the reference object of the Popper instance.
   */ anchorEl: (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$chainPropTypes$2f$chainPropTypes$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__chainPropTypes$3e$__["chainPropTypes"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].oneOfType([
        __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$HTMLElementType$2f$HTMLElementType$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__HTMLElementType$3e$__["HTMLElementType"],
        __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].object,
        __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].func
    ]), (props)=>{
        if (props.open) {
            const resolvedAnchorEl = resolveAnchorEl(props.anchorEl);
            if (resolvedAnchorEl && isHTMLElement(resolvedAnchorEl) && resolvedAnchorEl.nodeType === 1) {
                const box = resolvedAnchorEl.getBoundingClientRect();
                if (("TURBOPACK compile-time value", "development") !== 'test' && box.top === 0 && box.left === 0 && box.right === 0 && box.bottom === 0) {
                    return new Error([
                        'MUI: The `anchorEl` prop provided to the component is invalid.',
                        'The anchor element should be part of the document layout.',
                        "Make sure the element is present in the document or that it's not display none."
                    ].join('\n'));
                }
            } else if (!resolvedAnchorEl || typeof resolvedAnchorEl.getBoundingClientRect !== 'function' || isVirtualElement(resolvedAnchorEl) && resolvedAnchorEl.contextElement != null && resolvedAnchorEl.contextElement.nodeType !== 1) {
                return new Error([
                    'MUI: The `anchorEl` prop provided to the component is invalid.',
                    'It should be an HTML element instance or a virtualElement ',
                    '(https://popper.js.org/docs/v2/virtual-elements/).'
                ].join('\n'));
            }
        }
        return null;
    }),
    /**
   * Popper render function or node.
   */ children: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"] /* @typescript-to-proptypes-ignore */ .oneOfType([
        __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].node,
        __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].func
    ]),
    /**
   * An HTML element or function that returns one.
   * The `container` will have the portal children appended to it.
   *
   * By default, it uses the body of the top-level document object,
   * so it's simply `document.body` most of the time.
   */ container: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"] /* @typescript-to-proptypes-ignore */ .oneOfType([
        __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$HTMLElementType$2f$HTMLElementType$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__HTMLElementType$3e$__["HTMLElementType"],
        __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].func
    ]),
    /**
   * Direction of the text.
   * @default 'ltr'
   */ direction: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].oneOf([
        'ltr',
        'rtl'
    ]),
    /**
   * The `children` will be under the DOM hierarchy of the parent component.
   * @default false
   */ disablePortal: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].bool,
    /**
   * Always keep the children in the DOM.
   * This prop can be useful in SEO situation or
   * when you want to maximize the responsiveness of the Popper.
   * @default false
   */ keepMounted: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].bool,
    /**
   * Popper.js is based on a "plugin-like" architecture,
   * most of its features are fully encapsulated "modifiers".
   *
   * A modifier is a function that is called each time Popper.js needs to
   * compute the position of the popper.
   * For this reason, modifiers should be very performant to avoid bottlenecks.
   * To learn how to create a modifier, [read the modifiers documentation](https://popper.js.org/docs/v2/modifiers/).
   */ modifiers: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].arrayOf(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].shape({
        data: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].object,
        effect: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].func,
        enabled: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].bool,
        fn: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].func,
        name: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].any,
        options: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].object,
        phase: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].oneOf([
            'afterMain',
            'afterRead',
            'afterWrite',
            'beforeMain',
            'beforeRead',
            'beforeWrite',
            'main',
            'read',
            'write'
        ]),
        requires: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].arrayOf(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].string),
        requiresIfExists: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].arrayOf(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].string)
    })),
    /**
   * If `true`, the component is shown.
   */ open: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].bool.isRequired,
    /**
   * Popper placement.
   * @default 'bottom'
   */ placement: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].oneOf([
        'auto-end',
        'auto-start',
        'auto',
        'bottom-end',
        'bottom-start',
        'bottom',
        'left-end',
        'left-start',
        'left',
        'right-end',
        'right-start',
        'right',
        'top-end',
        'top-start',
        'top'
    ]),
    /**
   * Options provided to the [`Popper.js`](https://popper.js.org/docs/v2/constructors/#options) instance.
   * @default {}
   */ popperOptions: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].shape({
        modifiers: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].array,
        onFirstUpdate: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].func,
        placement: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].oneOf([
            'auto-end',
            'auto-start',
            'auto',
            'bottom-end',
            'bottom-start',
            'bottom',
            'left-end',
            'left-start',
            'left',
            'right-end',
            'right-start',
            'right',
            'top-end',
            'top-start',
            'top'
        ]),
        strategy: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].oneOf([
            'absolute',
            'fixed'
        ])
    }),
    /**
   * A ref that points to the used popper instance.
   */ popperRef: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$refType$2f$refType$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__refType$3e$__["refType"],
    /**
   * The props used for each slot inside the Popper.
   * @default {}
   */ slotProps: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].shape({
        root: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].oneOfType([
            __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].func,
            __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].object
        ])
    }),
    /**
   * The components used for each slot inside the Popper.
   * Either a string to use a HTML element or a component.
   * @default {}
   */ slots: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].shape({
        root: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].elementType
    }),
    /**
   * Help supporting a react-transition-group/Transition component.
   * @default false
   */ transition: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].bool
} : "TURBOPACK unreachable";
;
}),
]);

//# sourceMappingURL=2374f_%40mui_base_9316ec63._.js.map