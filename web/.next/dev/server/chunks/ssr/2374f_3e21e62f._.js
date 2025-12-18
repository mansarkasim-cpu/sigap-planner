module.exports = [
"[project]/web/node_modules/@mui/utils/esm/refType/refType.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/prop-types/index.js [app-ssr] (ecmascript)");
;
const refType = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].oneOfType([
    __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].func,
    __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].object
]);
const __TURBOPACK__default__export__ = refType;
}),
"[project]/web/node_modules/@mui/utils/esm/refType/refType.js [app-ssr] (ecmascript) <export default as refType>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "refType",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$refType$2f$refType$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$refType$2f$refType$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/utils/esm/refType/refType.js [app-ssr] (ecmascript)");
}),
"[project]/web/node_modules/@mui/utils/esm/elementTypeAcceptingRef/elementTypeAcceptingRef.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/prop-types/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$chainPropTypes$2f$chainPropTypes$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/utils/esm/chainPropTypes/chainPropTypes.js [app-ssr] (ecmascript)");
;
;
function isClassComponent(elementType) {
    // elementType.prototype?.isReactComponent
    const { prototype = {} } = elementType;
    return Boolean(prototype.isReactComponent);
}
function elementTypeAcceptingRef(props, propName, componentName, location, propFullName) {
    const propValue = props[propName];
    const safePropName = propFullName || propName;
    if ("TURBOPACK compile-time truthy", 1) {
        return null;
    }
    //TURBOPACK unreachable
    ;
    let warningHint;
}
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$chainPropTypes$2f$chainPropTypes$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].elementType, elementTypeAcceptingRef);
}),
"[project]/web/node_modules/@mui/utils/esm/elementTypeAcceptingRef/elementTypeAcceptingRef.js [app-ssr] (ecmascript) <export default as elementTypeAcceptingRef>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "elementTypeAcceptingRef",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$elementTypeAcceptingRef$2f$elementTypeAcceptingRef$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$elementTypeAcceptingRef$2f$elementTypeAcceptingRef$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/utils/esm/elementTypeAcceptingRef/elementTypeAcceptingRef.js [app-ssr] (ecmascript)");
}),
"[project]/web/node_modules/@mui/utils/esm/HTMLElementType/HTMLElementType.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>HTMLElementType
]);
function HTMLElementType(props, propName, componentName, location, propFullName) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const propValue = props[propName];
    const safePropName = propFullName || propName;
    if (propValue == null) {
        return null;
    }
    if (propValue && propValue.nodeType !== 1) {
        return new Error(`Invalid ${location} \`${safePropName}\` supplied to \`${componentName}\`. ` + `Expected an HTMLElement.`);
    }
    return null;
}
}),
"[project]/web/node_modules/@mui/utils/esm/HTMLElementType/HTMLElementType.js [app-ssr] (ecmascript) <export default as HTMLElementType>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "HTMLElementType",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$HTMLElementType$2f$HTMLElementType$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$HTMLElementType$2f$HTMLElementType$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/utils/esm/HTMLElementType/HTMLElementType.js [app-ssr] (ecmascript)");
}),
"[project]/web/node_modules/@mui/utils/esm/getScrollbarSize/getScrollbarSize.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// A change of the browser zoom change the scrollbar size.
// Credit https://github.com/twbs/bootstrap/blob/488fd8afc535ca3a6ad4dc581f5e89217b6a36ac/js/src/util/scrollbar.js#L14-L18
__turbopack_context__.s([
    "default",
    ()=>getScrollbarSize
]);
function getScrollbarSize(doc) {
    // https://developer.mozilla.org/en-US/docs/Web/API/Window/innerWidth#usage_notes
    const documentWidth = doc.documentElement.clientWidth;
    return Math.abs(window.innerWidth - documentWidth);
}
}),
"[project]/web/node_modules/@mui/utils/esm/getScrollbarSize/getScrollbarSize.js [app-ssr] (ecmascript) <export default as unstable_getScrollbarSize>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "unstable_getScrollbarSize",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$getScrollbarSize$2f$getScrollbarSize$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$getScrollbarSize$2f$getScrollbarSize$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/utils/esm/getScrollbarSize/getScrollbarSize.js [app-ssr] (ecmascript)");
}),
"[project]/web/node_modules/@mui/utils/esm/integerPropType/integerPropType.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "getTypeByValue",
    ()=>getTypeByValue
]);
function getTypeByValue(value) {
    const valueType = typeof value;
    switch(valueType){
        case 'number':
            if (Number.isNaN(value)) {
                return 'NaN';
            }
            if (!Number.isFinite(value)) {
                return 'Infinity';
            }
            if (value !== Math.floor(value)) {
                return 'float';
            }
            return 'number';
        case 'object':
            if (value === null) {
                return 'null';
            }
            return value.constructor.name;
        default:
            return valueType;
    }
}
// IE 11 support
function ponyfillIsInteger(x) {
    // eslint-disable-next-line no-restricted-globals
    return typeof x === 'number' && isFinite(x) && Math.floor(x) === x;
}
const isInteger = Number.isInteger || ponyfillIsInteger;
function requiredInteger(props, propName, componentName, location) {
    const propValue = props[propName];
    if (propValue == null || !isInteger(propValue)) {
        const propType = getTypeByValue(propValue);
        return new RangeError(`Invalid ${location} \`${propName}\` of type \`${propType}\` supplied to \`${componentName}\`, expected \`integer\`.`);
    }
    return null;
}
function validator(props, propName, ...other) {
    const propValue = props[propName];
    if (propValue === undefined) {
        return null;
    }
    return requiredInteger(props, propName, ...other);
}
function validatorNoop() {
    return null;
}
validator.isRequired = requiredInteger;
validatorNoop.isRequired = validatorNoop;
const __TURBOPACK__default__export__ = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : validator;
}),
"[project]/web/node_modules/@mui/utils/esm/integerPropType/integerPropType.js [app-ssr] (ecmascript) <export default as integerPropType>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "integerPropType",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$integerPropType$2f$integerPropType$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$integerPropType$2f$integerPropType$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/utils/esm/integerPropType/integerPropType.js [app-ssr] (ecmascript)");
}),
"[project]/web/node_modules/@mui/utils/esm/resolveProps/resolveProps.js [app-ssr] (ecmascript) <export default as internal_resolveProps>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "internal_resolveProps",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$resolveProps$2f$resolveProps$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$resolveProps$2f$resolveProps$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/utils/esm/resolveProps/resolveProps.js [app-ssr] (ecmascript)");
}),
"[project]/web/node_modules/@mui/base/utils/isHostComponent.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/web/node_modules/@mui/base/TextareaAutosize/TextareaAutosize.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TextareaAutosize",
    ()=>TextareaAutosize
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$babel$2f$runtime$2f$helpers$2f$esm$2f$extends$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@babel/runtime/helpers/esm/extends.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$babel$2f$runtime$2f$helpers$2f$esm$2f$objectWithoutPropertiesLoose$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@babel/runtime/helpers/esm/objectWithoutPropertiesLoose.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/prop-types/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$dom$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-dom.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$debounce$2f$debounce$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__unstable_debounce$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/utils/esm/debounce/debounce.js [app-ssr] (ecmascript) <export default as unstable_debounce>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$useForkRef$2f$useForkRef$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__unstable_useForkRef$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/utils/esm/useForkRef/useForkRef.js [app-ssr] (ecmascript) <export default as unstable_useForkRef>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$useEnhancedEffect$2f$useEnhancedEffect$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__unstable_useEnhancedEffect$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/utils/esm/useEnhancedEffect/useEnhancedEffect.js [app-ssr] (ecmascript) <export default as unstable_useEnhancedEffect>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$ownerWindow$2f$ownerWindow$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__unstable_ownerWindow$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/utils/esm/ownerWindow/ownerWindow.js [app-ssr] (ecmascript) <export default as unstable_ownerWindow>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-runtime.js [app-ssr] (ecmascript)");
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
 */ const TextareaAutosize = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](function TextareaAutosize(props, forwardedRef) {
    const { onChange, maxRows, minRows = 1, style, value } = props, other = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$babel$2f$runtime$2f$helpers$2f$esm$2f$objectWithoutPropertiesLoose$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(props, _excluded);
    const { current: isControlled } = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"](value != null);
    const inputRef = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"](null);
    const handleRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$useForkRef$2f$useForkRef$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__unstable_useForkRef$3e$__["unstable_useForkRef"])(forwardedRef, inputRef);
    const shadowRef = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"](null);
    const renders = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"](0);
    const [state, setState] = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"]({
        outerHeightStyle: 0
    });
    const getUpdatedState = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"](()=>{
        const input = inputRef.current;
        const containerWindow = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$ownerWindow$2f$ownerWindow$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__unstable_ownerWindow$3e$__["unstable_ownerWindow"])(input);
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
    }, [
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
    const syncHeight = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"](()=>{
        const newState = getUpdatedState();
        if (isEmpty(newState)) {
            return;
        }
        setState((prevState)=>updateState(prevState, newState));
    }, [
        getUpdatedState
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$useEnhancedEffect$2f$useEnhancedEffect$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__unstable_useEnhancedEffect$3e$__["unstable_useEnhancedEffect"])(()=>{
        const syncHeightWithFlushSync = ()=>{
            const newState = getUpdatedState();
            if (isEmpty(newState)) {
                return;
            }
            // In React 18, state updates in a ResizeObserver's callback are happening after
            // the paint, this leads to an infinite rendering.
            //
            // Using flushSync ensures that the states is updated before the next pain.
            // Related issue - https://github.com/facebook/react/issues/24331
            __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$dom$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["flushSync"](()=>{
                setState((prevState)=>updateState(prevState, newState));
            });
        };
        const handleResize = ()=>{
            renders.current = 0;
            syncHeightWithFlushSync();
        };
        // Workaround a "ResizeObserver loop completed with undelivered notifications" error
        // in test.
        // Note that we might need to use this logic in production per https://github.com/WICG/resize-observer/issues/38
        // Also see https://github.com/mui/mui-x/issues/8733
        let rAF;
        const rAFHandleResize = ()=>{
            cancelAnimationFrame(rAF);
            rAF = requestAnimationFrame(()=>{
                handleResize();
            });
        };
        const debounceHandleResize = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$debounce$2f$debounce$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__unstable_debounce$3e$__["unstable_debounce"])(handleResize);
        const input = inputRef.current;
        const containerWindow = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$ownerWindow$2f$ownerWindow$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__unstable_ownerWindow$3e$__["unstable_ownerWindow"])(input);
        containerWindow.addEventListener('resize', debounceHandleResize);
        let resizeObserver;
        if (typeof ResizeObserver !== 'undefined') {
            resizeObserver = new ResizeObserver(("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : handleResize);
            resizeObserver.observe(input);
        }
        return ()=>{
            debounceHandleResize.clear();
            cancelAnimationFrame(rAF);
            containerWindow.removeEventListener('resize', debounceHandleResize);
            if (resizeObserver) {
                resizeObserver.disconnect();
            }
        };
    }, [
        getUpdatedState
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$useEnhancedEffect$2f$useEnhancedEffect$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__unstable_useEnhancedEffect$3e$__["unstable_useEnhancedEffect"])(()=>{
        syncHeight();
    });
    __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"](()=>{
        renders.current = 0;
    }, [
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxs"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("textarea", (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$babel$2f$runtime$2f$helpers$2f$esm$2f$extends$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])({
                value: value,
                onChange: handleChange,
                ref: handleRef,
                rows: minRows,
                style: (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$babel$2f$runtime$2f$helpers$2f$esm$2f$extends$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])({
                    height: state.outerHeightStyle,
                    // Need a large enough difference to allow scrolling.
                    // This prevents infinite rendering loop.
                    overflow: state.overflow ? 'hidden' : undefined
                }, style)
            }, other)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("textarea", {
                "aria-hidden": true,
                className: props.className,
                readOnly: true,
                ref: shadowRef,
                tabIndex: -1,
                style: (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$babel$2f$runtime$2f$helpers$2f$esm$2f$extends$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])({}, styles.shadow, style, {
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
   */ className: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].string,
    /**
   * Maximum number of rows to display.
   */ maxRows: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].oneOfType([
        __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].number,
        __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].string
    ]),
    /**
   * Minimum number of rows to display.
   * @default 1
   */ minRows: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].oneOfType([
        __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].number,
        __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].string
    ]),
    /**
   * @ignore
   */ onChange: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].func,
    /**
   * @ignore
   */ placeholder: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].string,
    /**
   * @ignore
   */ style: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].object,
    /**
   * @ignore
   */ value: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].oneOfType([
        __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].arrayOf(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].string),
        __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].number,
        __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].string
    ])
} : "TURBOPACK unreachable";
;
}),
"[project]/web/node_modules/@mui/base/utils/appendOwnerState.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "appendOwnerState",
    ()=>appendOwnerState
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$babel$2f$runtime$2f$helpers$2f$esm$2f$extends$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@babel/runtime/helpers/esm/extends.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$base$2f$utils$2f$isHostComponent$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/base/utils/isHostComponent.js [app-ssr] (ecmascript)");
;
;
function appendOwnerState(elementType, otherProps, ownerState) {
    if (elementType === undefined || (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$base$2f$utils$2f$isHostComponent$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isHostComponent"])(elementType)) {
        return otherProps;
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$babel$2f$runtime$2f$helpers$2f$esm$2f$extends$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])({}, otherProps, {
        ownerState: (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$babel$2f$runtime$2f$helpers$2f$esm$2f$extends$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])({}, otherProps.ownerState, ownerState)
    });
}
}),
"[project]/web/node_modules/@mui/base/utils/extractEventHandlers.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/web/node_modules/@mui/base/utils/omitEventHandlers.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/web/node_modules/@mui/base/utils/mergeSlotProps.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "mergeSlotProps",
    ()=>mergeSlotProps
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$babel$2f$runtime$2f$helpers$2f$esm$2f$extends$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@babel/runtime/helpers/esm/extends.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/clsx/dist/clsx.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$base$2f$utils$2f$extractEventHandlers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/base/utils/extractEventHandlers.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$base$2f$utils$2f$omitEventHandlers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/base/utils/omitEventHandlers.js [app-ssr] (ecmascript)");
;
;
;
;
function mergeSlotProps(parameters) {
    const { getSlotProps, additionalProps, externalSlotProps, externalForwardedProps, className } = parameters;
    if (!getSlotProps) {
        // The simpler case - getSlotProps is not defined, so no internal event handlers are defined,
        // so we can simply merge all the props without having to worry about extracting event handlers.
        const joinedClasses = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(externalForwardedProps == null ? void 0 : externalForwardedProps.className, externalSlotProps == null ? void 0 : externalSlotProps.className, className, additionalProps == null ? void 0 : additionalProps.className);
        const mergedStyle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$babel$2f$runtime$2f$helpers$2f$esm$2f$extends$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])({}, additionalProps == null ? void 0 : additionalProps.style, externalForwardedProps == null ? void 0 : externalForwardedProps.style, externalSlotProps == null ? void 0 : externalSlotProps.style);
        const props = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$babel$2f$runtime$2f$helpers$2f$esm$2f$extends$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])({}, additionalProps, externalForwardedProps, externalSlotProps);
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
    const eventHandlers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$base$2f$utils$2f$extractEventHandlers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["extractEventHandlers"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$babel$2f$runtime$2f$helpers$2f$esm$2f$extends$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])({}, externalForwardedProps, externalSlotProps));
    const componentsPropsWithoutEventHandlers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$base$2f$utils$2f$omitEventHandlers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["omitEventHandlers"])(externalSlotProps);
    const otherPropsWithoutEventHandlers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$base$2f$utils$2f$omitEventHandlers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["omitEventHandlers"])(externalForwardedProps);
    const internalSlotProps = getSlotProps(eventHandlers);
    // The order of classes is important here.
    // Emotion (that we use in libraries consuming Base UI) depends on this order
    // to properly override style. It requires the most important classes to be last
    // (see https://github.com/mui/material-ui/pull/33205) for the related discussion.
    const joinedClasses = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(internalSlotProps == null ? void 0 : internalSlotProps.className, additionalProps == null ? void 0 : additionalProps.className, className, externalForwardedProps == null ? void 0 : externalForwardedProps.className, externalSlotProps == null ? void 0 : externalSlotProps.className);
    const mergedStyle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$babel$2f$runtime$2f$helpers$2f$esm$2f$extends$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])({}, internalSlotProps == null ? void 0 : internalSlotProps.style, additionalProps == null ? void 0 : additionalProps.style, externalForwardedProps == null ? void 0 : externalForwardedProps.style, externalSlotProps == null ? void 0 : externalSlotProps.style);
    const props = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$babel$2f$runtime$2f$helpers$2f$esm$2f$extends$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])({}, internalSlotProps, additionalProps, otherPropsWithoutEventHandlers, componentsPropsWithoutEventHandlers);
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
"[project]/web/node_modules/@mui/base/utils/resolveComponentProps.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/web/node_modules/@mui/base/utils/useSlotProps.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useSlotProps",
    ()=>useSlotProps
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$babel$2f$runtime$2f$helpers$2f$esm$2f$extends$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@babel/runtime/helpers/esm/extends.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$babel$2f$runtime$2f$helpers$2f$esm$2f$objectWithoutPropertiesLoose$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@babel/runtime/helpers/esm/objectWithoutPropertiesLoose.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$useForkRef$2f$useForkRef$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__unstable_useForkRef$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/utils/esm/useForkRef/useForkRef.js [app-ssr] (ecmascript) <export default as unstable_useForkRef>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$base$2f$utils$2f$appendOwnerState$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/base/utils/appendOwnerState.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$base$2f$utils$2f$mergeSlotProps$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/base/utils/mergeSlotProps.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$base$2f$utils$2f$resolveComponentProps$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/base/utils/resolveComponentProps.js [app-ssr] (ecmascript)");
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
    const { elementType, externalSlotProps, ownerState, skipResolvingSlotProps = false } = parameters, rest = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$babel$2f$runtime$2f$helpers$2f$esm$2f$objectWithoutPropertiesLoose$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(parameters, _excluded);
    const resolvedComponentsProps = skipResolvingSlotProps ? {} : (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$base$2f$utils$2f$resolveComponentProps$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["resolveComponentProps"])(externalSlotProps, ownerState);
    const { props: mergedProps, internalRef } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$base$2f$utils$2f$mergeSlotProps$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mergeSlotProps"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$babel$2f$runtime$2f$helpers$2f$esm$2f$extends$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])({}, rest, {
        externalSlotProps: resolvedComponentsProps
    }));
    const ref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$useForkRef$2f$useForkRef$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__unstable_useForkRef$3e$__["unstable_useForkRef"])(internalRef, resolvedComponentsProps == null ? void 0 : resolvedComponentsProps.ref, (_parameters$additiona = parameters.additionalProps) == null ? void 0 : _parameters$additiona.ref);
    const props = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$base$2f$utils$2f$appendOwnerState$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["appendOwnerState"])(elementType, (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$babel$2f$runtime$2f$helpers$2f$esm$2f$extends$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])({}, mergedProps, {
        ref
    }), ownerState);
    return props;
}
}),
"[project]/web/node_modules/@mui/base/unstable_useModal/ModalManager.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ModalManager",
    ()=>ModalManager,
    "ariaHidden",
    ()=>ariaHidden
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$ownerWindow$2f$ownerWindow$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__unstable_ownerWindow$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/utils/esm/ownerWindow/ownerWindow.js [app-ssr] (ecmascript) <export default as unstable_ownerWindow>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$ownerDocument$2f$ownerDocument$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__unstable_ownerDocument$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/utils/esm/ownerDocument/ownerDocument.js [app-ssr] (ecmascript) <export default as unstable_ownerDocument>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$getScrollbarSize$2f$getScrollbarSize$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__unstable_getScrollbarSize$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/utils/esm/getScrollbarSize/getScrollbarSize.js [app-ssr] (ecmascript) <export default as unstable_getScrollbarSize>");
;
// Is a vertical scrollbar displayed?
function isOverflowing(container) {
    const doc = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$ownerDocument$2f$ownerDocument$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__unstable_ownerDocument$3e$__["unstable_ownerDocument"])(container);
    if (doc.body === container) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$ownerWindow$2f$ownerWindow$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__unstable_ownerWindow$3e$__["unstable_ownerWindow"])(container).innerWidth > doc.documentElement.clientWidth;
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
    return parseInt((0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$ownerWindow$2f$ownerWindow$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__unstable_ownerWindow$3e$__["unstable_ownerWindow"])(element).getComputedStyle(element).paddingRight, 10) || 0;
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
            const scrollbarSize = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$getScrollbarSize$2f$getScrollbarSize$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__unstable_getScrollbarSize$3e$__["unstable_getScrollbarSize"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$ownerDocument$2f$ownerDocument$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__unstable_ownerDocument$3e$__["unstable_ownerDocument"])(container));
            restoreStyle.push({
                value: container.style.paddingRight,
                property: 'padding-right',
                el: container
            });
            // Use computed style, here to get the real padding to add our scrollbar width.
            container.style.paddingRight = `${getPaddingRight(container) + scrollbarSize}px`;
            // .mui-fixed is a global helper.
            const fixedElements = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$ownerDocument$2f$ownerDocument$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__unstable_ownerDocument$3e$__["unstable_ownerDocument"])(container).querySelectorAll('.mui-fixed');
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
            scrollContainer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$ownerDocument$2f$ownerDocument$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__unstable_ownerDocument$3e$__["unstable_ownerDocument"])(container).body;
        } else {
            // Support html overflow-y: auto for scroll stability between pages
            // https://css-tricks.com/snippets/css/force-vertical-scrollbar/
            const parent = container.parentElement;
            const containerWindow = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$ownerWindow$2f$ownerWindow$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__unstable_ownerWindow$3e$__["unstable_ownerWindow"])(container);
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
"[project]/web/node_modules/@mui/base/unstable_useModal/useModal.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useModal",
    ()=>useModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$babel$2f$runtime$2f$helpers$2f$esm$2f$extends$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@babel/runtime/helpers/esm/extends.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$ownerDocument$2f$ownerDocument$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__unstable_ownerDocument$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/utils/esm/ownerDocument/ownerDocument.js [app-ssr] (ecmascript) <export default as unstable_ownerDocument>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$useForkRef$2f$useForkRef$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__unstable_useForkRef$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/utils/esm/useForkRef/useForkRef.js [app-ssr] (ecmascript) <export default as unstable_useForkRef>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$useEventCallback$2f$useEventCallback$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__unstable_useEventCallback$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/utils/esm/useEventCallback/useEventCallback.js [app-ssr] (ecmascript) <export default as unstable_useEventCallback>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$createChainedFunction$2f$createChainedFunction$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__unstable_createChainedFunction$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/utils/esm/createChainedFunction/createChainedFunction.js [app-ssr] (ecmascript) <export default as unstable_createChainedFunction>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$base$2f$utils$2f$extractEventHandlers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/base/utils/extractEventHandlers.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$base$2f$unstable_useModal$2f$ModalManager$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/base/unstable_useModal/ModalManager.js [app-ssr] (ecmascript)");
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
const defaultManager = new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$base$2f$unstable_useModal$2f$ModalManager$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ModalManager"]();
function useModal(parameters) {
    const { container, disableEscapeKeyDown = false, disableScrollLock = false, // @ts-ignore internal logic - Base UI supports the manager as a prop too
    manager = defaultManager, closeAfterTransition = false, onTransitionEnter, onTransitionExited, children, onClose, open, rootRef } = parameters;
    // @ts-ignore internal logic
    const modal = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"]({});
    const mountNodeRef = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"](null);
    const modalRef = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"](null);
    const handleRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$useForkRef$2f$useForkRef$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__unstable_useForkRef$3e$__["unstable_useForkRef"])(modalRef, rootRef);
    const [exited, setExited] = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](!open);
    const hasTransition = getHasTransition(children);
    let ariaHiddenProp = true;
    if (parameters['aria-hidden'] === 'false' || parameters['aria-hidden'] === false) {
        ariaHiddenProp = false;
    }
    const getDoc = ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$ownerDocument$2f$ownerDocument$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__unstable_ownerDocument$3e$__["unstable_ownerDocument"])(mountNodeRef.current);
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
    const handleOpen = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$useEventCallback$2f$useEventCallback$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__unstable_useEventCallback$3e$__["unstable_useEventCallback"])(()=>{
        const resolvedContainer = getContainer(container) || getDoc().body;
        manager.add(getModal(), resolvedContainer);
        // The element was already mounted.
        if (modalRef.current) {
            handleMounted();
        }
    });
    const isTopModal = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"](()=>manager.isTopModal(getModal()), [
        manager
    ]);
    const handlePortalRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$useEventCallback$2f$useEventCallback$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__unstable_useEventCallback$3e$__["unstable_useEventCallback"])((node)=>{
        mountNodeRef.current = node;
        if (!node) {
            return;
        }
        if (open && isTopModal()) {
            handleMounted();
        } else if (modalRef.current) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$base$2f$unstable_useModal$2f$ModalManager$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ariaHidden"])(modalRef.current, ariaHiddenProp);
        }
    });
    const handleClose = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"](()=>{
        manager.remove(getModal(), ariaHiddenProp);
    }, [
        ariaHiddenProp,
        manager
    ]);
    __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"](()=>{
        return ()=>{
            handleClose();
        };
    }, [
        handleClose
    ]);
    __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"](()=>{
        if (open) {
            handleOpen();
        } else if (!hasTransition || !closeAfterTransition) {
            handleClose();
        }
    }, [
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
        const propsEventHandlers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$base$2f$utils$2f$extractEventHandlers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["extractEventHandlers"])(parameters);
        // The custom event handlers shouldn't be spread on the root element
        delete propsEventHandlers.onTransitionEnter;
        delete propsEventHandlers.onTransitionExited;
        const externalEventHandlers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$babel$2f$runtime$2f$helpers$2f$esm$2f$extends$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])({}, propsEventHandlers, otherHandlers);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$babel$2f$runtime$2f$helpers$2f$esm$2f$extends$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])({
            role: 'presentation'
        }, externalEventHandlers, {
            onKeyDown: createHandleKeyDown(externalEventHandlers),
            ref: handleRef
        });
    };
    const getBackdropProps = (otherHandlers = {})=>{
        const externalEventHandlers = otherHandlers;
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$babel$2f$runtime$2f$helpers$2f$esm$2f$extends$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])({
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
            onEnter: (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$createChainedFunction$2f$createChainedFunction$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__unstable_createChainedFunction$3e$__["unstable_createChainedFunction"])(handleEnter, children == null ? void 0 : children.props.onEnter),
            onExited: (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$createChainedFunction$2f$createChainedFunction$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__unstable_createChainedFunction$3e$__["unstable_createChainedFunction"])(handleExited, children == null ? void 0 : children.props.onExited)
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
"[project]/web/node_modules/@mui/base/unstable_useModal/useModal.js [app-ssr] (ecmascript) <export useModal as unstable_useModal>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "unstable_useModal",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$base$2f$unstable_useModal$2f$useModal$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useModal"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$base$2f$unstable_useModal$2f$useModal$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/base/unstable_useModal/useModal.js [app-ssr] (ecmascript)");
}),
"[project]/web/node_modules/@mui/base/FocusTrap/FocusTrap.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FocusTrap",
    ()=>FocusTrap
]);
/* eslint-disable consistent-return, jsx-a11y/no-noninteractive-tabindex */ var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/prop-types/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$exactProp$2f$exactProp$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__exactProp$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/utils/esm/exactProp/exactProp.js [app-ssr] (ecmascript) <export default as exactProp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$elementAcceptingRef$2f$elementAcceptingRef$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__elementAcceptingRef$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/utils/esm/elementAcceptingRef/elementAcceptingRef.js [app-ssr] (ecmascript) <export default as elementAcceptingRef>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$useForkRef$2f$useForkRef$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__unstable_useForkRef$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/utils/esm/useForkRef/useForkRef.js [app-ssr] (ecmascript) <export default as unstable_useForkRef>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$ownerDocument$2f$ownerDocument$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__unstable_ownerDocument$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/utils/esm/ownerDocument/ownerDocument.js [app-ssr] (ecmascript) <export default as unstable_ownerDocument>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-runtime.js [app-ssr] (ecmascript)");
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
    const ignoreNextEnforceFocus = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"](false);
    const sentinelStart = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"](null);
    const sentinelEnd = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"](null);
    const nodeToRestore = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"](null);
    const reactFocusEventTarget = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"](null);
    // This variable is useful when disableAutoFocus is true.
    // It waits for the active element to move into the component to activate.
    const activated = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"](false);
    const rootRef = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"](null);
    // @ts-expect-error TODO upstream fix
    const handleRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$useForkRef$2f$useForkRef$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__unstable_useForkRef$3e$__["unstable_useForkRef"])(children.ref, rootRef);
    const lastKeydown = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"](null);
    __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"](()=>{
        // We might render an empty child.
        if (!open || !rootRef.current) {
            return;
        }
        activated.current = !disableAutoFocus;
    }, [
        disableAutoFocus,
        open
    ]);
    __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"](()=>{
        // We might render an empty child.
        if (!open || !rootRef.current) {
            return;
        }
        const doc = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$ownerDocument$2f$ownerDocument$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__unstable_ownerDocument$3e$__["unstable_ownerDocument"])(rootRef.current);
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
        return ()=>{
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
        };
    // Missing `disableRestoreFocus` which is fine.
    // We don't support changing that prop on an open FocusTrap
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        open
    ]);
    __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"](()=>{
        // We might render an empty child.
        if (!open || !rootRef.current) {
            return;
        }
        const doc = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$ownerDocument$2f$ownerDocument$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__unstable_ownerDocument$3e$__["unstable_ownerDocument"])(rootRef.current);
        const loopFocus = (nativeEvent)=>{
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
        };
        const contain = ()=>{
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
        };
        doc.addEventListener('focusin', contain);
        doc.addEventListener('keydown', loopFocus, true);
        // With Edge, Safari and Firefox, no focus related events are fired when the focused area stops being a focused area.
        // e.g. https://bugzilla.mozilla.org/show_bug.cgi?id=559561.
        // Instead, we can look if the active element was restored on the BODY element.
        //
        // The whatwg spec defines how the browser should behave but does not explicitly mention any events:
        // https://html.spec.whatwg.org/multipage/interaction.html#focus-fixup-rule.
        const interval = setInterval(()=>{
            if (doc.activeElement && doc.activeElement.tagName === 'BODY') {
                contain();
            }
        }, 50);
        return ()=>{
            clearInterval(interval);
            doc.removeEventListener('focusin', contain);
            doc.removeEventListener('keydown', loopFocus, true);
        };
    }, [
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxs"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("div", {
                tabIndex: open ? 0 : -1,
                onFocus: handleFocusSentinel,
                ref: sentinelStart,
                "data-testid": "sentinelStart"
            }),
            /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cloneElement"](children, {
                ref: handleRef,
                onFocus
            }),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("div", {
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
   */ children: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$elementAcceptingRef$2f$elementAcceptingRef$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__elementAcceptingRef$3e$__["elementAcceptingRef"],
    /**
   * If `true`, the focus trap will not automatically shift focus to itself when it opens, and
   * replace it to the last focused element when it closes.
   * This also works correctly with any focus trap children that have the `disableAutoFocus` prop.
   *
   * Generally this should never be set to `true` as it makes the focus trap less
   * accessible to assistive technologies, like screen readers.
   * @default false
   */ disableAutoFocus: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].bool,
    /**
   * If `true`, the focus trap will not prevent focus from leaving the focus trap while open.
   *
   * Generally this should never be set to `true` as it makes the focus trap less
   * accessible to assistive technologies, like screen readers.
   * @default false
   */ disableEnforceFocus: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].bool,
    /**
   * If `true`, the focus trap will not restore focus to previously focused element once
   * focus trap is hidden or unmounted.
   * @default false
   */ disableRestoreFocus: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].bool,
    /**
   * Returns an array of ordered tabbable nodes (i.e. in tab order) within the root.
   * For instance, you can provide the "tabbable" npm dependency.
   * @param {HTMLElement} root
   */ getTabbable: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].func,
    /**
   * This prop extends the `open` prop.
   * It allows to toggle the open state without having to wait for a rerender when changing the `open` prop.
   * This prop should be memoized.
   * It can be used to support multiple focus trap mounted at the same time.
   * @default function defaultIsEnabled(): boolean {
   *   return true;
   * }
   */ isEnabled: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].func,
    /**
   * If `true`, focus is locked.
   */ open: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].bool.isRequired
} : "TURBOPACK unreachable";
if ("TURBOPACK compile-time truthy", 1) {
    // eslint-disable-next-line
    FocusTrap['propTypes' + ''] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$exactProp$2f$exactProp$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__exactProp$3e$__["exactProp"])(FocusTrap.propTypes);
}
;
}),
"[project]/web/node_modules/@mui/base/FocusTrap/FocusTrap.js [app-ssr] (ecmascript) <export FocusTrap as default>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$base$2f$FocusTrap$2f$FocusTrap$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FocusTrap"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$base$2f$FocusTrap$2f$FocusTrap$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/base/FocusTrap/FocusTrap.js [app-ssr] (ecmascript)");
}),
"[project]/web/node_modules/@mui/base/Portal/Portal.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Portal",
    ()=>Portal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$dom$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-dom.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/prop-types/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$exactProp$2f$exactProp$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__exactProp$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/utils/esm/exactProp/exactProp.js [app-ssr] (ecmascript) <export default as exactProp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$HTMLElementType$2f$HTMLElementType$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__HTMLElementType$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/utils/esm/HTMLElementType/HTMLElementType.js [app-ssr] (ecmascript) <export default as HTMLElementType>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$useEnhancedEffect$2f$useEnhancedEffect$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__unstable_useEnhancedEffect$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/utils/esm/useEnhancedEffect/useEnhancedEffect.js [app-ssr] (ecmascript) <export default as unstable_useEnhancedEffect>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$useForkRef$2f$useForkRef$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__unstable_useForkRef$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/utils/esm/useForkRef/useForkRef.js [app-ssr] (ecmascript) <export default as unstable_useForkRef>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$setRef$2f$setRef$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__unstable_setRef$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/utils/esm/setRef/setRef.js [app-ssr] (ecmascript) <export default as unstable_setRef>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-runtime.js [app-ssr] (ecmascript)");
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
 */ const Portal = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](function Portal(props, forwardedRef) {
    const { children, container, disablePortal = false } = props;
    const [mountNode, setMountNode] = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](null);
    // @ts-expect-error TODO upstream fix
    const handleRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$useForkRef$2f$useForkRef$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__unstable_useForkRef$3e$__["unstable_useForkRef"])(/*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isValidElement"](children) ? children.ref : null, forwardedRef);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$useEnhancedEffect$2f$useEnhancedEffect$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__unstable_useEnhancedEffect$3e$__["unstable_useEnhancedEffect"])(()=>{
        if (!disablePortal) {
            setMountNode(getContainer(container) || document.body);
        }
    }, [
        container,
        disablePortal
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$useEnhancedEffect$2f$useEnhancedEffect$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__unstable_useEnhancedEffect$3e$__["unstable_useEnhancedEffect"])(()=>{
        if (mountNode && !disablePortal) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$setRef$2f$setRef$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__unstable_setRef$3e$__["unstable_setRef"])(forwardedRef, mountNode);
            return ()=>{
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$setRef$2f$setRef$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__unstable_setRef$3e$__["unstable_setRef"])(forwardedRef, null);
            };
        }
        return undefined;
    }, [
        forwardedRef,
        mountNode,
        disablePortal
    ]);
    if (disablePortal) {
        if (/*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isValidElement"](children)) {
            const newProps = {
                ref: handleRef
            };
            return /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cloneElement"](children, newProps);
        }
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
            children: children
        });
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: mountNode ? /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$dom$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createPortal"](children, mountNode) : mountNode
    });
});
("TURBOPACK compile-time truthy", 1) ? Portal.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // |     To update them edit TypeScript types and run "yarn proptypes"  |
    // ----------------------------------------------------------------------
    /**
   * The children to render into the `container`.
   */ children: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].node,
    /**
   * An HTML element or function that returns one.
   * The `container` will have the portal children appended to it.
   *
   * By default, it uses the body of the top-level document object,
   * so it's simply `document.body` most of the time.
   */ container: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"] /* @typescript-to-proptypes-ignore */ .oneOfType([
        __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$HTMLElementType$2f$HTMLElementType$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__HTMLElementType$3e$__["HTMLElementType"],
        __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].func
    ]),
    /**
   * The `children` will be under the DOM hierarchy of the parent component.
   * @default false
   */ disablePortal: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].bool
} : "TURBOPACK unreachable";
if ("TURBOPACK compile-time truthy", 1) {
    // eslint-disable-next-line
    Portal['propTypes' + ''] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$exactProp$2f$exactProp$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__exactProp$3e$__["exactProp"])(Portal.propTypes);
}
;
}),
"[project]/web/node_modules/@mui/base/Portal/Portal.js [app-ssr] (ecmascript) <export Portal as default>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$base$2f$Portal$2f$Portal$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Portal"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$base$2f$Portal$2f$Portal$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/base/Portal/Portal.js [app-ssr] (ecmascript)");
}),
"[project]/web/node_modules/react-is/cjs/react-is.development.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * @license React
 * react-is.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ if ("TURBOPACK compile-time truthy", 1) {
    (function() {
        'use strict';
        // ATTENTION
        // When adding new symbols to this file,
        // Please consider also adding to 'react-devtools-shared/src/backend/ReactSymbols'
        // The Symbol used to tag the ReactElement-like types.
        var REACT_ELEMENT_TYPE = Symbol.for('react.element');
        var REACT_PORTAL_TYPE = Symbol.for('react.portal');
        var REACT_FRAGMENT_TYPE = Symbol.for('react.fragment');
        var REACT_STRICT_MODE_TYPE = Symbol.for('react.strict_mode');
        var REACT_PROFILER_TYPE = Symbol.for('react.profiler');
        var REACT_PROVIDER_TYPE = Symbol.for('react.provider');
        var REACT_CONTEXT_TYPE = Symbol.for('react.context');
        var REACT_SERVER_CONTEXT_TYPE = Symbol.for('react.server_context');
        var REACT_FORWARD_REF_TYPE = Symbol.for('react.forward_ref');
        var REACT_SUSPENSE_TYPE = Symbol.for('react.suspense');
        var REACT_SUSPENSE_LIST_TYPE = Symbol.for('react.suspense_list');
        var REACT_MEMO_TYPE = Symbol.for('react.memo');
        var REACT_LAZY_TYPE = Symbol.for('react.lazy');
        var REACT_OFFSCREEN_TYPE = Symbol.for('react.offscreen');
        // -----------------------------------------------------------------------------
        var enableScopeAPI = false; // Experimental Create Event Handle API.
        var enableCacheElement = false;
        var enableTransitionTracing = false; // No known bugs, but needs performance testing
        var enableLegacyHidden = false; // Enables unstable_avoidThisFallback feature in Fiber
        // stuff. Intended to enable React core members to more easily debug scheduling
        // issues in DEV builds.
        var enableDebugTracing = false; // Track which Fiber(s) schedule render work.
        var REACT_MODULE_REFERENCE;
        {
            REACT_MODULE_REFERENCE = Symbol.for('react.module.reference');
        }
        function isValidElementType(type) {
            if (typeof type === 'string' || typeof type === 'function') {
                return true;
            } // Note: typeof might be other than 'symbol' or 'number' (e.g. if it's a polyfill).
            if (type === REACT_FRAGMENT_TYPE || type === REACT_PROFILER_TYPE || enableDebugTracing || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || enableLegacyHidden || type === REACT_OFFSCREEN_TYPE || enableScopeAPI || enableCacheElement || enableTransitionTracing) {
                return true;
            }
            if (typeof type === 'object' && type !== null) {
                if (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || // This needs to include all possible module reference object
                // types supported by any Flight configuration anywhere since
                // we don't know which Flight build this will end up being used
                // with.
                type.$$typeof === REACT_MODULE_REFERENCE || type.getModuleId !== undefined) {
                    return true;
                }
            }
            return false;
        }
        function typeOf(object) {
            if (typeof object === 'object' && object !== null) {
                var $$typeof = object.$$typeof;
                switch($$typeof){
                    case REACT_ELEMENT_TYPE:
                        var type = object.type;
                        switch(type){
                            case REACT_FRAGMENT_TYPE:
                            case REACT_PROFILER_TYPE:
                            case REACT_STRICT_MODE_TYPE:
                            case REACT_SUSPENSE_TYPE:
                            case REACT_SUSPENSE_LIST_TYPE:
                                return type;
                            default:
                                var $$typeofType = type && type.$$typeof;
                                switch($$typeofType){
                                    case REACT_SERVER_CONTEXT_TYPE:
                                    case REACT_CONTEXT_TYPE:
                                    case REACT_FORWARD_REF_TYPE:
                                    case REACT_LAZY_TYPE:
                                    case REACT_MEMO_TYPE:
                                    case REACT_PROVIDER_TYPE:
                                        return $$typeofType;
                                    default:
                                        return $$typeof;
                                }
                        }
                    case REACT_PORTAL_TYPE:
                        return $$typeof;
                }
            }
            return undefined;
        }
        var ContextConsumer = REACT_CONTEXT_TYPE;
        var ContextProvider = REACT_PROVIDER_TYPE;
        var Element = REACT_ELEMENT_TYPE;
        var ForwardRef = REACT_FORWARD_REF_TYPE;
        var Fragment = REACT_FRAGMENT_TYPE;
        var Lazy = REACT_LAZY_TYPE;
        var Memo = REACT_MEMO_TYPE;
        var Portal = REACT_PORTAL_TYPE;
        var Profiler = REACT_PROFILER_TYPE;
        var StrictMode = REACT_STRICT_MODE_TYPE;
        var Suspense = REACT_SUSPENSE_TYPE;
        var SuspenseList = REACT_SUSPENSE_LIST_TYPE;
        var hasWarnedAboutDeprecatedIsAsyncMode = false;
        var hasWarnedAboutDeprecatedIsConcurrentMode = false; // AsyncMode should be deprecated
        function isAsyncMode(object) {
            {
                if (!hasWarnedAboutDeprecatedIsAsyncMode) {
                    hasWarnedAboutDeprecatedIsAsyncMode = true; // Using console['warn'] to evade Babel and ESLint
                    console['warn']('The ReactIs.isAsyncMode() alias has been deprecated, ' + 'and will be removed in React 18+.');
                }
            }
            return false;
        }
        function isConcurrentMode(object) {
            {
                if (!hasWarnedAboutDeprecatedIsConcurrentMode) {
                    hasWarnedAboutDeprecatedIsConcurrentMode = true; // Using console['warn'] to evade Babel and ESLint
                    console['warn']('The ReactIs.isConcurrentMode() alias has been deprecated, ' + 'and will be removed in React 18+.');
                }
            }
            return false;
        }
        function isContextConsumer(object) {
            return typeOf(object) === REACT_CONTEXT_TYPE;
        }
        function isContextProvider(object) {
            return typeOf(object) === REACT_PROVIDER_TYPE;
        }
        function isElement(object) {
            return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
        }
        function isForwardRef(object) {
            return typeOf(object) === REACT_FORWARD_REF_TYPE;
        }
        function isFragment(object) {
            return typeOf(object) === REACT_FRAGMENT_TYPE;
        }
        function isLazy(object) {
            return typeOf(object) === REACT_LAZY_TYPE;
        }
        function isMemo(object) {
            return typeOf(object) === REACT_MEMO_TYPE;
        }
        function isPortal(object) {
            return typeOf(object) === REACT_PORTAL_TYPE;
        }
        function isProfiler(object) {
            return typeOf(object) === REACT_PROFILER_TYPE;
        }
        function isStrictMode(object) {
            return typeOf(object) === REACT_STRICT_MODE_TYPE;
        }
        function isSuspense(object) {
            return typeOf(object) === REACT_SUSPENSE_TYPE;
        }
        function isSuspenseList(object) {
            return typeOf(object) === REACT_SUSPENSE_LIST_TYPE;
        }
        exports.ContextConsumer = ContextConsumer;
        exports.ContextProvider = ContextProvider;
        exports.Element = Element;
        exports.ForwardRef = ForwardRef;
        exports.Fragment = Fragment;
        exports.Lazy = Lazy;
        exports.Memo = Memo;
        exports.Portal = Portal;
        exports.Profiler = Profiler;
        exports.StrictMode = StrictMode;
        exports.Suspense = Suspense;
        exports.SuspenseList = SuspenseList;
        exports.isAsyncMode = isAsyncMode;
        exports.isConcurrentMode = isConcurrentMode;
        exports.isContextConsumer = isContextConsumer;
        exports.isContextProvider = isContextProvider;
        exports.isElement = isElement;
        exports.isForwardRef = isForwardRef;
        exports.isFragment = isFragment;
        exports.isLazy = isLazy;
        exports.isMemo = isMemo;
        exports.isPortal = isPortal;
        exports.isProfiler = isProfiler;
        exports.isStrictMode = isStrictMode;
        exports.isSuspense = isSuspense;
        exports.isSuspenseList = isSuspenseList;
        exports.isValidElementType = isValidElementType;
        exports.typeOf = typeOf;
    })();
}
}),
"[project]/web/node_modules/react-is/index.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
else {
    module.exports = __turbopack_context__.r("[project]/web/node_modules/react-is/cjs/react-is.development.js [app-ssr] (ecmascript)");
}
}),
"[project]/web/node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>_assertThisInitialized
]);
function _assertThisInitialized(e) {
    if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    return e;
}
;
}),
"[project]/web/node_modules/react-transition-group/esm/utils/ChildMapping.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getChildMapping",
    ()=>getChildMapping,
    "getInitialChildMapping",
    ()=>getInitialChildMapping,
    "getNextChildMapping",
    ()=>getNextChildMapping,
    "mergeChildMappings",
    ()=>mergeChildMappings
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
;
function getChildMapping(children, mapFn) {
    var mapper = function mapper(child) {
        return mapFn && (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isValidElement"])(child) ? mapFn(child) : child;
    };
    var result = Object.create(null);
    if (children) __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Children"].map(children, function(c) {
        return c;
    }).forEach(function(child) {
        // run the map function here instead so that the key is the computed one
        result[child.key] = mapper(child);
    });
    return result;
}
function mergeChildMappings(prev, next) {
    prev = prev || {};
    next = next || {};
    function getValueForKey(key) {
        return key in next ? next[key] : prev[key];
    } // For each key of `next`, the list of keys to insert before that key in
    // the combined list
    var nextKeysPending = Object.create(null);
    var pendingKeys = [];
    for(var prevKey in prev){
        if (prevKey in next) {
            if (pendingKeys.length) {
                nextKeysPending[prevKey] = pendingKeys;
                pendingKeys = [];
            }
        } else {
            pendingKeys.push(prevKey);
        }
    }
    var i;
    var childMapping = {};
    for(var nextKey in next){
        if (nextKeysPending[nextKey]) {
            for(i = 0; i < nextKeysPending[nextKey].length; i++){
                var pendingNextKey = nextKeysPending[nextKey][i];
                childMapping[nextKeysPending[nextKey][i]] = getValueForKey(pendingNextKey);
            }
        }
        childMapping[nextKey] = getValueForKey(nextKey);
    } // Finally, add the keys which didn't appear before any key in `next`
    for(i = 0; i < pendingKeys.length; i++){
        childMapping[pendingKeys[i]] = getValueForKey(pendingKeys[i]);
    }
    return childMapping;
}
function getProp(child, prop, props) {
    return props[prop] != null ? props[prop] : child.props[prop];
}
function getInitialChildMapping(props, onExited) {
    return getChildMapping(props.children, function(child) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cloneElement"])(child, {
            onExited: onExited.bind(null, child),
            in: true,
            appear: getProp(child, 'appear', props),
            enter: getProp(child, 'enter', props),
            exit: getProp(child, 'exit', props)
        });
    });
}
function getNextChildMapping(nextProps, prevChildMapping, onExited) {
    var nextChildMapping = getChildMapping(nextProps.children);
    var children = mergeChildMappings(prevChildMapping, nextChildMapping);
    Object.keys(children).forEach(function(key) {
        var child = children[key];
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isValidElement"])(child)) return;
        var hasPrev = key in prevChildMapping;
        var hasNext = key in nextChildMapping;
        var prevChild = prevChildMapping[key];
        var isLeaving = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isValidElement"])(prevChild) && !prevChild.props.in; // item is new (entering)
        if (hasNext && (!hasPrev || isLeaving)) {
            // console.log('entering', key)
            children[key] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cloneElement"])(child, {
                onExited: onExited.bind(null, child),
                in: true,
                exit: getProp(child, 'exit', nextProps),
                enter: getProp(child, 'enter', nextProps)
            });
        } else if (!hasNext && hasPrev && !isLeaving) {
            // item is old (exiting)
            // console.log('leaving', key)
            children[key] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cloneElement"])(child, {
                in: false
            });
        } else if (hasNext && hasPrev && (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isValidElement"])(prevChild)) {
            // item hasn't changed transition states
            // copy over the last transition props;
            // console.log('unchanged', key)
            children[key] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cloneElement"])(child, {
                onExited: onExited.bind(null, child),
                in: prevChild.props.in,
                exit: getProp(child, 'exit', nextProps),
                enter: getProp(child, 'enter', nextProps)
            });
        }
    });
    return children;
}
}),
"[project]/web/node_modules/react-transition-group/esm/TransitionGroup.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$babel$2f$runtime$2f$helpers$2f$esm$2f$objectWithoutPropertiesLoose$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@babel/runtime/helpers/esm/objectWithoutPropertiesLoose.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$babel$2f$runtime$2f$helpers$2f$esm$2f$extends$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@babel/runtime/helpers/esm/extends.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$babel$2f$runtime$2f$helpers$2f$esm$2f$assertThisInitialized$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$babel$2f$runtime$2f$helpers$2f$esm$2f$inheritsLoose$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@babel/runtime/helpers/esm/inheritsLoose.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/prop-types/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$react$2d$transition$2d$group$2f$esm$2f$TransitionGroupContext$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/react-transition-group/esm/TransitionGroupContext.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$react$2d$transition$2d$group$2f$esm$2f$utils$2f$ChildMapping$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/react-transition-group/esm/utils/ChildMapping.js [app-ssr] (ecmascript)");
;
;
;
;
;
;
;
;
var values = Object.values || function(obj) {
    return Object.keys(obj).map(function(k) {
        return obj[k];
    });
};
var defaultProps = {
    component: 'div',
    childFactory: function childFactory(child) {
        return child;
    }
};
/**
 * The `<TransitionGroup>` component manages a set of transition components
 * (`<Transition>` and `<CSSTransition>`) in a list. Like with the transition
 * components, `<TransitionGroup>` is a state machine for managing the mounting
 * and unmounting of components over time.
 *
 * Consider the example below. As items are removed or added to the TodoList the
 * `in` prop is toggled automatically by the `<TransitionGroup>`.
 *
 * Note that `<TransitionGroup>`  does not define any animation behavior!
 * Exactly _how_ a list item animates is up to the individual transition
 * component. This means you can mix and match animations across different list
 * items.
 */ var TransitionGroup = /*#__PURE__*/ function(_React$Component) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$babel$2f$runtime$2f$helpers$2f$esm$2f$inheritsLoose$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(TransitionGroup, _React$Component);
    function TransitionGroup(props, context) {
        var _this;
        _this = _React$Component.call(this, props, context) || this;
        var handleExited = _this.handleExited.bind((0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$babel$2f$runtime$2f$helpers$2f$esm$2f$assertThisInitialized$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(_this)); // Initial children should all be entering, dependent on appear
        _this.state = {
            contextValue: {
                isMounting: true
            },
            handleExited: handleExited,
            firstRender: true
        };
        return _this;
    }
    var _proto = TransitionGroup.prototype;
    _proto.componentDidMount = function componentDidMount() {
        this.mounted = true;
        this.setState({
            contextValue: {
                isMounting: false
            }
        });
    };
    _proto.componentWillUnmount = function componentWillUnmount() {
        this.mounted = false;
    };
    TransitionGroup.getDerivedStateFromProps = function getDerivedStateFromProps(nextProps, _ref) {
        var prevChildMapping = _ref.children, handleExited = _ref.handleExited, firstRender = _ref.firstRender;
        return {
            children: firstRender ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$react$2d$transition$2d$group$2f$esm$2f$utils$2f$ChildMapping$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getInitialChildMapping"])(nextProps, handleExited) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$react$2d$transition$2d$group$2f$esm$2f$utils$2f$ChildMapping$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getNextChildMapping"])(nextProps, prevChildMapping, handleExited),
            firstRender: false
        };
    } // node is `undefined` when user provided `nodeRef` prop
    ;
    _proto.handleExited = function handleExited(child, node) {
        var currentChildMapping = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$react$2d$transition$2d$group$2f$esm$2f$utils$2f$ChildMapping$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getChildMapping"])(this.props.children);
        if (child.key in currentChildMapping) return;
        if (child.props.onExited) {
            child.props.onExited(node);
        }
        if (this.mounted) {
            this.setState(function(state) {
                var children = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$babel$2f$runtime$2f$helpers$2f$esm$2f$extends$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])({}, state.children);
                delete children[child.key];
                return {
                    children: children
                };
            });
        }
    };
    _proto.render = function render() {
        var _this$props = this.props, Component = _this$props.component, childFactory = _this$props.childFactory, props = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$babel$2f$runtime$2f$helpers$2f$esm$2f$objectWithoutPropertiesLoose$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(_this$props, [
            "component",
            "childFactory"
        ]);
        var contextValue = this.state.contextValue;
        var children = values(this.state.children).map(childFactory);
        delete props.appear;
        delete props.enter;
        delete props.exit;
        if (Component === null) {
            return /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].createElement(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$react$2d$transition$2d$group$2f$esm$2f$TransitionGroupContext$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].Provider, {
                value: contextValue
            }, children);
        }
        return /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].createElement(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$react$2d$transition$2d$group$2f$esm$2f$TransitionGroupContext$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].Provider, {
            value: contextValue
        }, /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].createElement(Component, props, children));
    };
    return TransitionGroup;
}(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].Component);
TransitionGroup.propTypes = ("TURBOPACK compile-time truthy", 1) ? {
    /**
   * `<TransitionGroup>` renders a `<div>` by default. You can change this
   * behavior by providing a `component` prop.
   * If you use React v16+ and would like to avoid a wrapping `<div>` element
   * you can pass in `component={null}`. This is useful if the wrapping div
   * borks your css styles.
   */ component: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].any,
    /**
   * A set of `<Transition>` components, that are toggled `in` and out as they
   * leave. the `<TransitionGroup>` will inject specific transition props, so
   * remember to spread them through if you are wrapping the `<Transition>` as
   * with our `<Fade>` example.
   *
   * While this component is meant for multiple `Transition` or `CSSTransition`
   * children, sometimes you may want to have a single transition child with
   * content that you want to be transitioned out and in when you change it
   * (e.g. routes, images etc.) In that case you can change the `key` prop of
   * the transition child as you change its content, this will cause
   * `TransitionGroup` to transition the child out and back in.
   */ children: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].node,
    /**
   * A convenience prop that enables or disables appear animations
   * for all children. Note that specifying this will override any defaults set
   * on individual children Transitions.
   */ appear: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].bool,
    /**
   * A convenience prop that enables or disables enter animations
   * for all children. Note that specifying this will override any defaults set
   * on individual children Transitions.
   */ enter: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].bool,
    /**
   * A convenience prop that enables or disables exit animations
   * for all children. Note that specifying this will override any defaults set
   * on individual children Transitions.
   */ exit: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].bool,
    /**
   * You may need to apply reactive updates to a child as it is exiting.
   * This is generally done by using `cloneElement` however in the case of an exiting
   * child the element has already been removed and not accessible to the consumer.
   *
   * If you do need to update a child as it leaves you can provide a `childFactory`
   * to wrap every child, even the ones that are leaving.
   *
   * @type Function(child: ReactElement) -> ReactElement
   */ childFactory: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].func
} : "TURBOPACK unreachable";
TransitionGroup.defaultProps = defaultProps;
const __TURBOPACK__default__export__ = TransitionGroup;
}),
"[project]/web/node_modules/react-transition-group/esm/TransitionGroup.js [app-ssr] (ecmascript) <export default as TransitionGroup>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TransitionGroup",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$react$2d$transition$2d$group$2f$esm$2f$TransitionGroup$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$react$2d$transition$2d$group$2f$esm$2f$TransitionGroup$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/react-transition-group/esm/TransitionGroup.js [app-ssr] (ecmascript)");
}),
"[project]/web/node_modules/@mui/system/esm/styled.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$system$2f$esm$2f$createStyled$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/system/esm/createStyled.js [app-ssr] (ecmascript)");
;
const styled = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$system$2f$esm$2f$createStyled$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])();
const __TURBOPACK__default__export__ = styled;
}),
"[project]/web/node_modules/@mui/system/esm/styleFunctionSx/extendSxProp.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>extendSxProp
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$babel$2f$runtime$2f$helpers$2f$esm$2f$extends$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@babel/runtime/helpers/esm/extends.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$babel$2f$runtime$2f$helpers$2f$esm$2f$objectWithoutPropertiesLoose$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@babel/runtime/helpers/esm/objectWithoutPropertiesLoose.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$deepmerge$2f$deepmerge$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/utils/esm/deepmerge/deepmerge.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$system$2f$esm$2f$styleFunctionSx$2f$defaultSxConfig$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/system/esm/styleFunctionSx/defaultSxConfig.js [app-ssr] (ecmascript)");
;
;
const _excluded = [
    "sx"
];
;
;
const splitProps = (props)=>{
    var _props$theme$unstable, _props$theme;
    const result = {
        systemProps: {},
        otherProps: {}
    };
    const config = (_props$theme$unstable = props == null || (_props$theme = props.theme) == null ? void 0 : _props$theme.unstable_sxConfig) != null ? _props$theme$unstable : __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$system$2f$esm$2f$styleFunctionSx$2f$defaultSxConfig$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"];
    Object.keys(props).forEach((prop)=>{
        if (config[prop]) {
            result.systemProps[prop] = props[prop];
        } else {
            result.otherProps[prop] = props[prop];
        }
    });
    return result;
};
function extendSxProp(props) {
    const { sx: inSx } = props, other = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$babel$2f$runtime$2f$helpers$2f$esm$2f$objectWithoutPropertiesLoose$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(props, _excluded);
    const { systemProps, otherProps } = splitProps(other);
    let finalSx;
    if (Array.isArray(inSx)) {
        finalSx = [
            systemProps,
            ...inSx
        ];
    } else if (typeof inSx === 'function') {
        finalSx = (...args)=>{
            const result = inSx(...args);
            if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$deepmerge$2f$deepmerge$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isPlainObject"])(result)) {
                return systemProps;
            }
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$babel$2f$runtime$2f$helpers$2f$esm$2f$extends$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])({}, systemProps, result);
        };
    } else {
        finalSx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$babel$2f$runtime$2f$helpers$2f$esm$2f$extends$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])({}, systemProps, inSx);
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$babel$2f$runtime$2f$helpers$2f$esm$2f$extends$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])({}, otherProps, {
        sx: finalSx
    });
}
}),
"[project]/web/node_modules/@mui/system/esm/styleFunctionSx/extendSxProp.js [app-ssr] (ecmascript) <export default as extendSxProp>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "extendSxProp",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$system$2f$esm$2f$styleFunctionSx$2f$extendSxProp$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$system$2f$esm$2f$styleFunctionSx$2f$extendSxProp$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/system/esm/styleFunctionSx/extendSxProp.js [app-ssr] (ecmascript)");
}),
"[project]/web/node_modules/@mui/system/esm/Stack/createStack.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>createStack,
    "style",
    ()=>style
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$babel$2f$runtime$2f$helpers$2f$esm$2f$objectWithoutPropertiesLoose$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@babel/runtime/helpers/esm/objectWithoutPropertiesLoose.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$babel$2f$runtime$2f$helpers$2f$esm$2f$extends$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@babel/runtime/helpers/esm/extends.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/prop-types/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/clsx/dist/clsx.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$deepmerge$2f$deepmerge$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/utils/esm/deepmerge/deepmerge.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$generateUtilityClass$2f$generateUtilityClass$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/utils/esm/generateUtilityClass/generateUtilityClass.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$composeClasses$2f$composeClasses$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/utils/esm/composeClasses/composeClasses.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$system$2f$esm$2f$styled$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/system/esm/styled.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$system$2f$esm$2f$useThemeProps$2f$useThemeProps$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/system/esm/useThemeProps/useThemeProps.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$system$2f$esm$2f$styleFunctionSx$2f$extendSxProp$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__extendSxProp$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/system/esm/styleFunctionSx/extendSxProp.js [app-ssr] (ecmascript) <export default as extendSxProp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$system$2f$esm$2f$createTheme$2f$createTheme$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/system/esm/createTheme/createTheme.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$system$2f$esm$2f$breakpoints$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/system/esm/breakpoints.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$system$2f$esm$2f$spacing$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/system/esm/spacing.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-runtime.js [app-ssr] (ecmascript)");
;
;
const _excluded = [
    "component",
    "direction",
    "spacing",
    "divider",
    "children",
    "className",
    "useFlexGap"
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
;
;
;
const defaultTheme = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$system$2f$esm$2f$createTheme$2f$createTheme$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])();
// widening Theme to any so that the consumer can own the theme structure.
const defaultCreateStyledComponent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$system$2f$esm$2f$styled$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])('div', {
    name: 'MuiStack',
    slot: 'Root',
    overridesResolver: (props, styles)=>styles.root
});
function useThemePropsDefault(props) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$system$2f$esm$2f$useThemeProps$2f$useThemeProps$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])({
        props,
        name: 'MuiStack',
        defaultTheme
    });
}
/**
 * Return an array with the separator React element interspersed between
 * each React node of the input children.
 *
 * > joinChildren([1,2,3], 0)
 * [1,0,2,0,3]
 */ function joinChildren(children, separator) {
    const childrenArray = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Children"].toArray(children).filter(Boolean);
    return childrenArray.reduce((output, child, index)=>{
        output.push(child);
        if (index < childrenArray.length - 1) {
            output.push(/*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cloneElement"](separator, {
                key: `separator-${index}`
            }));
        }
        return output;
    }, []);
}
const getSideFromDirection = (direction)=>{
    return ({
        row: 'Left',
        'row-reverse': 'Right',
        column: 'Top',
        'column-reverse': 'Bottom'
    })[direction];
};
const style = ({ ownerState, theme })=>{
    let styles = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$babel$2f$runtime$2f$helpers$2f$esm$2f$extends$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])({
        display: 'flex',
        flexDirection: 'column'
    }, (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$system$2f$esm$2f$breakpoints$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["handleBreakpoints"])({
        theme
    }, (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$system$2f$esm$2f$breakpoints$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["resolveBreakpointValues"])({
        values: ownerState.direction,
        breakpoints: theme.breakpoints.values
    }), (propValue)=>({
            flexDirection: propValue
        })));
    if (ownerState.spacing) {
        const transformer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$system$2f$esm$2f$spacing$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createUnarySpacing"])(theme);
        const base = Object.keys(theme.breakpoints.values).reduce((acc, breakpoint)=>{
            if (typeof ownerState.spacing === 'object' && ownerState.spacing[breakpoint] != null || typeof ownerState.direction === 'object' && ownerState.direction[breakpoint] != null) {
                acc[breakpoint] = true;
            }
            return acc;
        }, {});
        const directionValues = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$system$2f$esm$2f$breakpoints$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["resolveBreakpointValues"])({
            values: ownerState.direction,
            base
        });
        const spacingValues = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$system$2f$esm$2f$breakpoints$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["resolveBreakpointValues"])({
            values: ownerState.spacing,
            base
        });
        if (typeof directionValues === 'object') {
            Object.keys(directionValues).forEach((breakpoint, index, breakpoints)=>{
                const directionValue = directionValues[breakpoint];
                if (!directionValue) {
                    const previousDirectionValue = index > 0 ? directionValues[breakpoints[index - 1]] : 'column';
                    directionValues[breakpoint] = previousDirectionValue;
                }
            });
        }
        const styleFromPropValue = (propValue, breakpoint)=>{
            if (ownerState.useFlexGap) {
                return {
                    gap: (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$system$2f$esm$2f$spacing$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getValue"])(transformer, propValue)
                };
            }
            return {
                // The useFlexGap={false} implement relies on each child to give up control of the margin.
                // We need to reset the margin to avoid double spacing.
                '& > :not(style):not(style)': {
                    margin: 0
                },
                '& > :not(style) ~ :not(style)': {
                    [`margin${getSideFromDirection(breakpoint ? directionValues[breakpoint] : ownerState.direction)}`]: (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$system$2f$esm$2f$spacing$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getValue"])(transformer, propValue)
                }
            };
        };
        styles = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$deepmerge$2f$deepmerge$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(styles, (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$system$2f$esm$2f$breakpoints$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["handleBreakpoints"])({
            theme
        }, spacingValues, styleFromPropValue));
    }
    styles = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$system$2f$esm$2f$breakpoints$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mergeBreakpointsInOrder"])(theme.breakpoints, styles);
    return styles;
};
function createStack(options = {}) {
    const { // This will allow adding custom styled fn (for example for custom sx style function)
    createStyledComponent = defaultCreateStyledComponent, useThemeProps = useThemePropsDefault, componentName = 'MuiStack' } = options;
    const useUtilityClasses = ()=>{
        const slots = {
            root: [
                'root'
            ]
        };
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$composeClasses$2f$composeClasses$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(slots, (slot)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$generateUtilityClass$2f$generateUtilityClass$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(componentName, slot), {});
    };
    const StackRoot = createStyledComponent(style);
    const Stack = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](function Grid(inProps, ref) {
        const themeProps = useThemeProps(inProps);
        const props = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$system$2f$esm$2f$styleFunctionSx$2f$extendSxProp$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__extendSxProp$3e$__["extendSxProp"])(themeProps); // `color` type conflicts with html color attribute.
        const { component = 'div', direction = 'column', spacing = 0, divider, children, className, useFlexGap = false } = props, other = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$babel$2f$runtime$2f$helpers$2f$esm$2f$objectWithoutPropertiesLoose$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(props, _excluded);
        const ownerState = {
            direction,
            spacing,
            useFlexGap
        };
        const classes = useUtilityClasses();
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(StackRoot, (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$babel$2f$runtime$2f$helpers$2f$esm$2f$extends$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])({
            as: component,
            ownerState: ownerState,
            ref: ref,
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(classes.root, className)
        }, other, {
            children: divider ? joinChildren(children, divider) : children
        }));
    });
    ("TURBOPACK compile-time truthy", 1) ? Stack.propTypes = {
        children: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].node,
        direction: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].oneOfType([
            __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].oneOf([
                'column-reverse',
                'column',
                'row-reverse',
                'row'
            ]),
            __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].arrayOf(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].oneOf([
                'column-reverse',
                'column',
                'row-reverse',
                'row'
            ])),
            __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].object
        ]),
        divider: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].node,
        spacing: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].oneOfType([
            __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].arrayOf(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].oneOfType([
                __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].number,
                __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].string
            ])),
            __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].number,
            __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].object,
            __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].string
        ]),
        sx: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].oneOfType([
            __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].arrayOf(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].oneOfType([
                __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].func,
                __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].object,
                __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].bool
            ])),
            __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].func,
            __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].object
        ])
    } : "TURBOPACK unreachable";
    return Stack;
}
}),
"[project]/web/node_modules/@mui/system/esm/Stack/createStack.js [app-ssr] (ecmascript) <export default as createStack>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createStack",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$system$2f$esm$2f$Stack$2f$createStack$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$system$2f$esm$2f$Stack$2f$createStack$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/system/esm/Stack/createStack.js [app-ssr] (ecmascript)");
}),
"[project]/web/node_modules/@mui/system/esm/styleFunctionSx/extendSxProp.js [app-ssr] (ecmascript) <export default as unstable_extendSxProp>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "unstable_extendSxProp",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$system$2f$esm$2f$styleFunctionSx$2f$extendSxProp$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$system$2f$esm$2f$styleFunctionSx$2f$extendSxProp$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/system/esm/styleFunctionSx/extendSxProp.js [app-ssr] (ecmascript)");
}),
"[project]/web/node_modules/@mui/system/esm/createBox.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>createBox
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$babel$2f$runtime$2f$helpers$2f$esm$2f$extends$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@babel/runtime/helpers/esm/extends.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$babel$2f$runtime$2f$helpers$2f$esm$2f$objectWithoutPropertiesLoose$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@babel/runtime/helpers/esm/objectWithoutPropertiesLoose.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/clsx/dist/clsx.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$styled$2d$engine$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/styled-engine/index.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$system$2f$esm$2f$styleFunctionSx$2f$styleFunctionSx$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/system/esm/styleFunctionSx/styleFunctionSx.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$system$2f$esm$2f$styleFunctionSx$2f$extendSxProp$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__extendSxProp$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/system/esm/styleFunctionSx/extendSxProp.js [app-ssr] (ecmascript) <export default as extendSxProp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$system$2f$esm$2f$useTheme$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/system/esm/useTheme.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-runtime.js [app-ssr] (ecmascript)");
'use client';
;
;
const _excluded = [
    "className",
    "component"
];
;
;
;
;
;
;
function createBox(options = {}) {
    const { themeId, defaultTheme, defaultClassName = 'MuiBox-root', generateClassName } = options;
    const BoxRoot = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$styled$2d$engine$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"])('div', {
        shouldForwardProp: (prop)=>prop !== 'theme' && prop !== 'sx' && prop !== 'as'
    })(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$system$2f$esm$2f$styleFunctionSx$2f$styleFunctionSx$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]);
    const Box = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](function Box(inProps, ref) {
        const theme = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$system$2f$esm$2f$useTheme$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(defaultTheme);
        const _extendSxProp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$system$2f$esm$2f$styleFunctionSx$2f$extendSxProp$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__extendSxProp$3e$__["extendSxProp"])(inProps), { className, component = 'div' } = _extendSxProp, other = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$babel$2f$runtime$2f$helpers$2f$esm$2f$objectWithoutPropertiesLoose$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(_extendSxProp, _excluded);
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(BoxRoot, (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$babel$2f$runtime$2f$helpers$2f$esm$2f$extends$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])({
            as: component,
            ref: ref,
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(className, generateClassName ? generateClassName(defaultClassName) : defaultClassName),
            theme: themeId ? theme[themeId] || theme : theme
        }, other));
    });
    return Box;
}
}),
"[project]/web/node_modules/@mui/system/esm/createBox.js [app-ssr] (ecmascript) <export default as createBox>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createBox",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$system$2f$esm$2f$createBox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$mui$2f$system$2f$esm$2f$createBox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@mui/system/esm/createBox.js [app-ssr] (ecmascript)");
}),
"[project]/web/node_modules/@mui/icons-material/Save.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var _interopRequireDefault = __turbopack_context__.r("[project]/web/node_modules/@babel/runtime/helpers/interopRequireDefault.js [app-ssr] (ecmascript)");
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = void 0;
var _createSvgIcon = _interopRequireDefault(__turbopack_context__.r("[project]/web/node_modules/@mui/icons-material/utils/createSvgIcon.js [app-ssr] (ecmascript)"));
var _jsxRuntime = __turbopack_context__.r("[project]/web/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-runtime.js [app-ssr] (ecmascript)");
var _default = (0, _createSvgIcon.default)(/*#__PURE__*/ (0, _jsxRuntime.jsx)("path", {
    d: "M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"
}), 'Save');
exports.default = _default;
}),
"[project]/web/node_modules/@mui/icons-material/Bolt.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var _interopRequireDefault = __turbopack_context__.r("[project]/web/node_modules/@babel/runtime/helpers/interopRequireDefault.js [app-ssr] (ecmascript)");
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = void 0;
var _createSvgIcon = _interopRequireDefault(__turbopack_context__.r("[project]/web/node_modules/@mui/icons-material/utils/createSvgIcon.js [app-ssr] (ecmascript)"));
var _jsxRuntime = __turbopack_context__.r("[project]/web/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-runtime.js [app-ssr] (ecmascript)");
var _default = (0, _createSvgIcon.default)(/*#__PURE__*/ (0, _jsxRuntime.jsx)("path", {
    d: "M11 21h-1l1-7H7.5c-.58 0-.57-.32-.38-.66.19-.34.05-.08.07-.12C8.48 10.94 10.42 7.54 13 3h1l-1 7h3.5c.49 0 .56.33.47.51l-.07.15C12.96 17.55 11 21 11 21z"
}), 'Bolt');
exports.default = _default;
}),
];

//# sourceMappingURL=2374f_3e21e62f._.js.map