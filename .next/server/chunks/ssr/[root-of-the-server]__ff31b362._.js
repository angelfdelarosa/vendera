module.exports = {

"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}}),
"[project]/src/hooks/use-toast.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "reducer": (()=>reducer),
    "toast": (()=>toast),
    "useToast": (()=>useToast)
});
// Inspired by react-hot-toast library
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1000000;
const actionTypes = {
    ADD_TOAST: "ADD_TOAST",
    UPDATE_TOAST: "UPDATE_TOAST",
    DISMISS_TOAST: "DISMISS_TOAST",
    REMOVE_TOAST: "REMOVE_TOAST"
};
let count = 0;
function genId() {
    count = (count + 1) % Number.MAX_SAFE_INTEGER;
    return count.toString();
}
const toastTimeouts = new Map();
const addToRemoveQueue = (toastId)=>{
    if (toastTimeouts.has(toastId)) {
        return;
    }
    const timeout = setTimeout(()=>{
        toastTimeouts.delete(toastId);
        dispatch({
            type: "REMOVE_TOAST",
            toastId: toastId
        });
    }, TOAST_REMOVE_DELAY);
    toastTimeouts.set(toastId, timeout);
};
const reducer = (state, action)=>{
    switch(action.type){
        case "ADD_TOAST":
            return {
                ...state,
                toasts: [
                    action.toast,
                    ...state.toasts
                ].slice(0, TOAST_LIMIT)
            };
        case "UPDATE_TOAST":
            return {
                ...state,
                toasts: state.toasts.map((t)=>t.id === action.toast.id ? {
                        ...t,
                        ...action.toast
                    } : t)
            };
        case "DISMISS_TOAST":
            {
                const { toastId } = action;
                // ! Side effects ! - This could be extracted into a dismissToast() action,
                // but I'll keep it here for simplicity
                if (toastId) {
                    addToRemoveQueue(toastId);
                } else {
                    state.toasts.forEach((toast)=>{
                        addToRemoveQueue(toast.id);
                    });
                }
                return {
                    ...state,
                    toasts: state.toasts.map((t)=>t.id === toastId || toastId === undefined ? {
                            ...t,
                            open: false
                        } : t)
                };
            }
        case "REMOVE_TOAST":
            if (action.toastId === undefined) {
                return {
                    ...state,
                    toasts: []
                };
            }
            return {
                ...state,
                toasts: state.toasts.filter((t)=>t.id !== action.toastId)
            };
    }
};
const listeners = [];
let memoryState = {
    toasts: []
};
function dispatch(action) {
    memoryState = reducer(memoryState, action);
    listeners.forEach((listener)=>{
        listener(memoryState);
    });
}
function toast({ ...props }) {
    const id = genId();
    const update = (props)=>dispatch({
            type: "UPDATE_TOAST",
            toast: {
                ...props,
                id
            }
        });
    const dismiss = ()=>dispatch({
            type: "DISMISS_TOAST",
            toastId: id
        });
    dispatch({
        type: "ADD_TOAST",
        toast: {
            ...props,
            id,
            open: true,
            onOpenChange: (open)=>{
                if (!open) dismiss();
            }
        }
    });
    return {
        id: id,
        dismiss,
        update
    };
}
function useToast() {
    const [state, setState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(memoryState);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        listeners.push(setState);
        return ()=>{
            const index = listeners.indexOf(setState);
            if (index > -1) {
                listeners.splice(index, 1);
            }
        };
    }, [
        state
    ]);
    return {
        ...state,
        toast,
        dismiss: (toastId)=>dispatch({
                type: "DISMISS_TOAST",
                toastId
            })
    };
}
;
}}),
"[project]/src/lib/utils.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "canvasPreview": (()=>canvasPreview),
    "cn": (()=>cn)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/clsx/dist/clsx.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-ssr] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
async function canvasPreview(image, canvas, crop) {
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        throw new Error('No 2d context');
    }
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const pixelRatio = window.devicePixelRatio;
    canvas.width = Math.floor(crop.width * scaleX * pixelRatio);
    canvas.height = Math.floor(crop.height * scaleY * pixelRatio);
    ctx.scale(pixelRatio, pixelRatio);
    ctx.imageSmoothingQuality = 'high';
    const cropX = crop.x * scaleX;
    const cropY = crop.y * scaleY;
    const centerX = image.naturalWidth / 2;
    const centerY = image.naturalHeight / 2;
    ctx.save();
    ctx.translate(-cropX, -cropY);
    ctx.translate(centerX, centerY);
    ctx.translate(-centerX, -centerY);
    ctx.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight, 0, 0, image.naturalWidth, image.naturalHeight);
    ctx.restore();
}
}}),
"[project]/src/components/ui/toast.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "Toast": (()=>Toast),
    "ToastAction": (()=>ToastAction),
    "ToastClose": (()=>ToastClose),
    "ToastDescription": (()=>ToastDescription),
    "ToastProvider": (()=>ToastProvider),
    "ToastTitle": (()=>ToastTitle),
    "ToastViewport": (()=>ToastViewport)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-toast/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/class-variance-authority/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-ssr] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
const ToastProvider = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Provider"];
const ToastViewport = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"])(({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Viewport"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/toast.tsx",
        lineNumber: 16,
        columnNumber: 3
    }, this));
ToastViewport.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Viewport"].displayName;
const toastVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cva"])("group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full", {
    variants: {
        variant: {
            default: "border bg-background text-foreground",
            destructive: "destructive group border-destructive bg-destructive text-destructive-foreground"
        }
    },
    defaultVariants: {
        variant: "default"
    }
});
const Toast = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"])(({ className, variant, ...props }, ref)=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Root"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])(toastVariants({
            variant
        }), className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/toast.tsx",
        lineNumber: 49,
        columnNumber: 5
    }, this);
});
Toast.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Root"].displayName;
const ToastAction = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"])(({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Action"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/toast.tsx",
        lineNumber: 62,
        columnNumber: 3
    }, this));
ToastAction.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Action"].displayName;
const ToastClose = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"])(({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Close"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600", className),
        "toast-close": "",
        ...props,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
            className: "h-4 w-4"
        }, void 0, false, {
            fileName: "[project]/src/components/ui/toast.tsx",
            lineNumber: 86,
            columnNumber: 5
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/ui/toast.tsx",
        lineNumber: 77,
        columnNumber: 3
    }, this));
ToastClose.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Close"].displayName;
const ToastTitle = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"])(({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Title"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("text-sm font-semibold", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/toast.tsx",
        lineNumber: 95,
        columnNumber: 3
    }, this));
ToastTitle.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Title"].displayName;
const ToastDescription = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"])(({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Description"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("text-sm opacity-90", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/toast.tsx",
        lineNumber: 107,
        columnNumber: 3
    }, this));
ToastDescription.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Description"].displayName;
;
}}),
"[project]/src/components/ui/toaster.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "Toaster": (()=>Toaster)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/use-toast.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$toast$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/toast.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
function Toaster() {
    const { toasts } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useToast"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$toast$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ToastProvider"], {
        children: [
            toasts.map(function({ id, title, description, action, ...props }) {
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$toast$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Toast"], {
                    ...props,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid gap-1",
                            children: [
                                title && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$toast$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ToastTitle"], {
                                    children: title
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ui/toaster.tsx",
                                    lineNumber: 22,
                                    columnNumber: 25
                                }, this),
                                description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$toast$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ToastDescription"], {
                                    children: description
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ui/toaster.tsx",
                                    lineNumber: 24,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/ui/toaster.tsx",
                            lineNumber: 21,
                            columnNumber: 13
                        }, this),
                        action,
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$toast$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ToastClose"], {}, void 0, false, {
                            fileName: "[project]/src/components/ui/toaster.tsx",
                            lineNumber: 28,
                            columnNumber: 13
                        }, this)
                    ]
                }, id, true, {
                    fileName: "[project]/src/components/ui/toaster.tsx",
                    lineNumber: 20,
                    columnNumber: 11
                }, this);
            }),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$toast$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ToastViewport"], {}, void 0, false, {
                fileName: "[project]/src/components/ui/toaster.tsx",
                lineNumber: 32,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/toaster.tsx",
        lineNumber: 17,
        columnNumber: 5
    }, this);
}
}}),
"[project]/src/locales/en.json (json)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.v(JSON.parse("{\"header\":{\"properties\":\"Properties\",\"favorites\":\"Favorites\",\"addProperty\":\"Add Property\"},\"home\":{\"title\":\"Sell fast. Buy happy.\",\"subtitle\":\"Discover a curated selection of the finest properties. Your new beginning awaits.\",\"featuredListings\":\"Featured Listings\",\"noProperties\":\"No properties match your current filters.\"},\"search\":{\"location\":\"Location\",\"allLocations\":\"All Locations\",\"propertyType\":\"Property Type\",\"allTypes\":\"All Types\",\"priceRange\":\"Price Range\",\"button\":\"Search\",\"placeholder\":{\"users\":\"Search users by name...\",\"properties\":\"Search for properties...\"},\"enterQuery\":\"Please enter a name to search.\",\"resultsTitle\":\"Search Results\",\"resultsFor\":\"Showing results for:\",\"noUsersFound\":\"No Users Found\",\"noUsersMatch\":\"No users match your search query. Try a different name.\"},\"footer\":{\"about\":\"About Us\",\"contact\":\"Contact\",\"terms\":\"Terms of Service\",\"follow\":\"Follow Us\",\"copyright\":\"© {year} VENDRA. All rights reserved.\"},\"userNav\":{\"avatarAlt\":\"User avatar\",\"profile\":\"Profile\",\"logout\":\"Log out\"},\"login\":{\"title\":\"Login\",\"subtitle\":\"Enter your email below to login to your account.\",\"password\":\"Password\",\"button\":\"Login\",\"noAccount\":\"Don't have an account?\",\"toast\":{\"error\":{\"title\":\"Login Failed\"},\"success\":{\"title\":\"Login Successful\",\"description\":\"Welcome back!\"}}},\"signup\":{\"title\":\"Sign Up\",\"subtitle\":\"Enter your information to create an account\",\"name\":\"Full Name\",\"confirmPassword\":\"Confirm Password\",\"button\":\"Create an account\",\"hasAccount\":\"Already have an account?\",\"toast\":{\"error\":{\"title\":\"Sign Up Failed\"},\"success\":{\"title\":\"Sign Up Successful\",\"description\":\"Please check your email to verify your account.\"}}},\"favorites\":{\"title\":\"Your Favorite Properties\",\"subtitle\":\"Here are the listings you've saved for later.\",\"add\":\"Add to favorites\",\"remove\":\"Remove from favorites\",\"empty\":{\"title\":\"No Favorites Yet\",\"description\":\"Click the heart icon on any property to save it here.\",\"button\":\"Browse Properties\"},\"toast\":{\"added\":{\"title\":\"Added to Favorites\",\"description\":\"\\\"{title}\\\" has been saved.\"},\"removed\":{\"title\":\"Removed from Favorites\",\"description\":\"\\\"{title}\\\" has been removed.\"}}},\"messages\":{\"title\":\"Your Conversations\",\"subtitle\":\"Manage your messages with sellers.\",\"allMessages\":\"All Messages\",\"re\":\"Re:\",\"empty\":{\"title\":\"No Conversations Yet\",\"description\":\"When you contact a seller, your conversations will appear here.\",\"button\":\"Browse Properties\"},\"select\":{\"title\":\"Select a conversation\",\"description\":\"Choose a conversation from the list to see the messages.\"},\"timestamp\":{\"minutes\":\"{count}m ago\",\"hours\":\"{count}h ago\"}},\"chat\":{\"title\":\"Chat with\",\"titleProperty\":\"Chat about \\\"{title}\\\"\",\"potentialBuyer\":\"Potential Buyer\",\"error\":\"Sorry, I'm having trouble connecting right now. Please try again later.\",\"placeholder\":\"Type your message...\"},\"notifications\":{\"open\":\"Open messages\",\"inbox\":\"Inbox\",\"noMessages\":\"No new messages.\",\"viewAll\":\"View all messages\"},\"profile\":{\"sellerBadge\":\"Seller\",\"ratings\":\"ratings\",\"avatarAlt\":\"{name}'s Profile Picture\",\"contactSeller\":\"Contact Seller\",\"tabs\":{\"listed\":\"Listed Properties\",\"saved\":\"Saved Properties\"},\"empty\":{\"listed\":{\"own\":\"You haven't listed any properties yet.\",\"other\":\"{name} hasn't listed any properties yet.\"},\"saved\":{\"description\":\"You haven't saved any properties yet.\",\"button\":\"Browse Properties\"}},\"edit\":{\"title\":\"Edit Profile\",\"description\":\"Make changes to your profile here. Click save when you're done.\",\"name\":\"Full Name\",\"save\":\"Save changes\",\"toast\":{\"success\":{\"title\":\"Profile Updated\",\"description\":\"Your changes have been saved.\"},\"error\":{\"title\":\"Update Failed\",\"description\":\"Could not save your profile changes.\"}}}},\"property\":{\"realtorInfo\":\"Realtor Information\",\"certifiedRealtor\":\"Certified Realtor\",\"details\":\"Property Details\",\"bedrooms\":\"Bedrooms\",\"bathrooms\":\"Bathrooms\",\"beds\":\"beds\",\"baths\":\"baths\",\"sqft\":\"sqft\",\"description\":\"Description\",\"features\":\"Features\",\"similar\":\"Similar Properties\",\"types\":{\"house\":\"House\",\"apartment\":\"Apartment\",\"condo\":\"Condo\",\"villa\":\"Villa\",\"lot\":\"Lot / Land\"}},\"newProperty\":{\"title\":\"List a New Property\",\"subtitle\":\"Fill out the details below to put your property on the market.\",\"form\":{\"name\":\"Property Name\",\"name_placeholder\":\"e.g., Luxurious Villa with Ocean View\",\"price\":\"Price\",\"location\":\"Location\",\"address\":\"Full Address\",\"type_placeholder\":\"Select a type\",\"bedrooms\":\"Bedrooms\",\"bathrooms\":\"Bathrooms\",\"area\":\"Area (m²)\",\"amenities_note\":\"Comma-separated list.\",\"features\":\"Features\",\"features_placeholder\":\"e.g., Ocean view, modern architecture\",\"generating\":\"Generating...\",\"generate_ai\":\"Generate with AI\",\"description_placeholder\":\"Describe the property...\",\"photos\":\"Property Photos\",\"submit\":\"List Property\"},\"toast\":{\"generated\":{\"title\":\"Description Generated!\",\"description\":\"The AI-powered description has been added.\"},\"listed\":{\"title\":\"Property Listed!\",\"description\":\"Your property is now on the market.\"},\"error\":\"Failed to generate description.\"}},\"userCard\":{\"viewProfile\":\"View Profile\"},\"languageSwitcher\":{\"label\":\"Change language\"},\"about\":{\"title\":\"Reimagining Real Estate\",\"subtitle\":\"We are a passionate team dedicated to creating a transparent, efficient, and enjoyable real estate experience for everyone.\",\"missionTitle\":\"Our Mission\",\"missionText\":\"Our mission is to empower buyers and sellers with the data, inspiration, and knowledge they need to make the best decisions. We believe that finding a home should be a joyful journey, and we're here to make that a reality, one property at a time.\",\"teamTitle\":\"Meet the Team\",\"teamSubtitle\":\"We are a diverse group of real estate agents, tech enthusiasts, and customer service experts united by a single goal: to serve you better.\",\"whyTitle\":\"Why VENDRA?\",\"whySubtitle\":\"Discover the advantages of using our platform for your next real estate venture.\",\"why1_title\":\"Curated Listings\",\"why1_text\":\"We feature a handpicked selection of quality properties to ensure you're browsing the best on the market.\",\"why2_title\":\"Expert Agents\",\"why2_text\":\"Connect with experienced and verified real estate professionals ready to assist you at every step.\",\"why3_title\":\"Simplified Experience\",\"why3_text\":\"Our user-friendly platform makes finding, buying, and selling properties easier than ever before.\"},\"contact\":{\"title\":\"Get In Touch\",\"subtitle\":\"Have a question or a comment? Use the form below to send us a message, or contact us by email or phone.\",\"form\":{\"title\":\"Send us a Message\",\"name\":\"Full Name\",\"name_placeholder\":\"Your Name\",\"email\":\"Email Address\",\"email_placeholder\":\"your.email@example.com\",\"message\":\"Message\",\"message_placeholder\":\"Type your message here...\",\"submit\":\"Send Message\",\"validation\":{\"name\":\"Please enter your name.\",\"email\":\"Please enter a valid email address.\",\"message\":\"Message must be at least 10 characters long.\"}},\"info\":{\"title\":\"Contact Information\",\"address_title\":\"Our Office\",\"address\":\"KM 17 Autop. Duarte\",\"phone_title\":\"Phone\",\"phone\":\"829-689-7550 (WhatsApp available)\",\"email_title\":\"Email\",\"email\":\"support@vendra.com\"},\"toast\":{\"success\":{\"title\":\"Message Sent!\",\"description\":\"Thank you for contacting us. We'll get back to you shortly.\"}}},\"terms\":{\"title\":\"Terms and Conditions\",\"subtitle\":\"Please read these terms and conditions carefully before using Our Service.\",\"lastUpdated\":\"Last updated: {date}\",\"locale_code\":\"en-US\",\"section1\":{\"title\":\"1. Introduction\",\"content\":\"Welcome to VENDRA. These Terms and Conditions govern your use of our website and services. By accessing or using the service, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the service.\"},\"section2\":{\"title\":\"2. User Accounts\",\"content\":\"When you create an account with us, you must provide us with information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.\"},\"section3\":{\"title\":\"3. Property Listings\",\"content\":\"VENDRA allows users to post property listings. You are responsible for the accuracy and legality of the content you post. We reserve the right to remove any listing that violates our policies or is deemed inappropriate, at our sole discretion.\"},\"section4\":{\"title\":\"4. Intellectual Property\",\"content\":\"The Service and its original content, features, and functionality are and will remain the exclusive property of VENDRA and its licensors. The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries.\"},\"section5\":{\"title\":\"5. Limitation of Liability\",\"content\":\"In no event shall VENDRA, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.\"},\"section6\":{\"title\":\"6. Governing Law\",\"content\":\"These Terms shall be governed and construed in accordance with the laws of the State of California, United States, without regard to its conflict of law provisions.\"}},\"landing\":{\"hero\":{\"title\":\"Your Next Home Awaits\",\"subtitle\":\"The premier marketplace for discovering, buying, and selling extraordinary properties. Let's find the door to your dreams.\",\"cta_main\":\"Get Started\",\"cta_secondary\":\"Learn More\"},\"featured\":{\"title\":\"Featured Listings\",\"subtitle\":\"Explore a handpicked selection of our finest properties, from luxury villas to modern city apartments.\"},\"features\":{\"feature1_title\":\"Advanced Search\",\"feature1_desc\":\"Easily find your ideal property with our powerful and intuitive search filters.\",\"feature2_title\":\"Quality Listings\",\"feature2_desc\":\"We feature a curated selection of properties to ensure you browse the best on the market.\",\"feature3_title\":\"Direct Messaging\",\"feature3_desc\":\"Connect directly and securely with sellers and agents to get the information you need.\"},\"testimonials\":{\"title\":\"What Our Clients Say\",\"subtitle\":\"We're proud to have helped so many people find their perfect home. Here's what they think about VENDRA.\",\"quote1\":\"VENDRA made finding our dream home an absolute breeze. The platform is so intuitive and the agents were incredibly helpful!\",\"role1\":\"Happy Homebuyers\",\"quote2\":\"As an agent, VENDRA is a game-changer. It connects me with serious buyers and streamlines the entire selling process.\",\"role2\":\"Verified Seller\",\"quote3\":\"I was overwhelmed with the process of selling my house, but VENDRA provided the tools and support I needed to get a great offer, fast.\",\"role3\":\"First-time Seller\"},\"cta\":{\"title\":\"Ready to Begin Your Journey?\",\"subtitle\":\"Create an account today to save your favorite properties, connect with sellers, and unlock all the features of VENDRA.\",\"button\":\"Sign Up for Free\"}},\"mock\":{\"property1_title\":\"Luxurious Villa in Beverly Hills\",\"property1_description\":\"A stunning villa offering unparalleled luxury and privacy. Features a grand staircase, gourmet kitchen, and a breathtaking infinity pool with city views. Perfect for those who demand the very best in life.\",\"property2_title\":\"Modern Downtown LA Apartment\",\"property2_description\":\"Sleek, stylish, and modern apartment in the heart of downtown LA. Floor-to-ceiling windows offer incredible skyline views. Amenities include a rooftop lounge, fitness center, and 24/7 concierge.\",\"property3_title\":\"Cozy Family Home in Santa Monica\",\"property3_description\":\"Charming family home just blocks from the beach. This house boasts a beautiful backyard with a garden, a spacious living room with a fireplace, and a recently renovated kitchen. Ideal for family living.\",\"property4_title\":\"Chic West Hollywood Condo\",\"property4_description\":\"A trendy condo in a vibrant neighborhood, perfect for a young professional. Open-concept design with modern finishes and a private balcony. The building offers a pool, gym, and secure parking.\",\"property5_title\":\"Sprawling Malibu Estate\",\"property5_description\":\"An exquisite beachfront estate with private beach access. This designer masterpiece features panoramic ocean views from every room, a state-of-the-art home theater, and a tennis court.\",\"property6_title\":\"Quaint Pasadena Craftsman\",\"property6_description\":\"A beautiful craftsman-style home on a quiet, tree-lined street in Pasadena. Features original woodwork, a large front porch, and a serene backyard perfect for relaxing.\",\"property7_title\":\"Penthouse with Panoramic Views\",\"property7_description\":\"Live at the top of the world in this exclusive penthouse. Offering 360-degree views of the city, this residence is the epitome of urban luxury. Includes a private elevator, rooftop terrace, and premium services.\",\"property8_title\":\"Beachfront Santa Monica Condo\",\"property8_description\":\"Wake up to the sound of the waves in this luxurious beachfront condo. Direct access to the sand, a modern open-plan living area, and a large balcony to enjoy the sunset. A rare opportunity in a prime location.\",\"user1_bio\":\"Top-tier real estate agent with over 15 years of experience in the luxury market. Let me help you find your dream home.\",\"user2_bio\":\"Specializing in downtown residential and commercial properties. Let's find your next investment.\",\"user3_bio\":\"Your go-to Santa Monica real estate expert. I live and breathe coastal properties.\",\"user4_bio\":\"Connecting clients with the vibrant West Hollywood lifestyle. Your dream condo awaits.\"}}"));}}),
"[project]/src/locales/es.json (json)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.v(JSON.parse("{\"header\":{\"properties\":\"Propiedades\",\"favorites\":\"Favoritos\",\"addProperty\":\"Añadir Propiedad\"},\"home\":{\"title\":\"Vende rápido. Compra feliz.\",\"subtitle\":\"Descubre una cuidada selección de las mejores propiedades. Tu nuevo comienzo te espera.\",\"featuredListings\":\"Listados Destacados\",\"noProperties\":\"Ninguna propiedad coincide con tus filtros actuales.\"},\"search\":{\"location\":\"Ubicación\",\"allLocations\":\"Todas las Ubicaciones\",\"propertyType\":\"Tipo de Propiedad\",\"allTypes\":\"Todos los Tipos\",\"priceRange\":\"Rango de Precios\",\"button\":\"Buscar\",\"placeholder\":{\"users\":\"Buscar usuarios por nombre...\",\"properties\":\"Buscar propiedades...\"},\"enterQuery\":\"Por favor, introduce un nombre para buscar.\",\"resultsTitle\":\"Resultados de Búsqueda\",\"resultsFor\":\"Mostrando resultados para:\",\"noUsersFound\":\"No se encontraron usuarios\",\"noUsersMatch\":\"Ningún usuario coincide con tu búsqueda. Intenta con un nombre diferente.\"},\"footer\":{\"about\":\"Sobre Nosotros\",\"contact\":\"Contacto\",\"terms\":\"Términos de Servicio\",\"follow\":\"Síguenos\",\"copyright\":\"© {year} VENDRA. Todos los derechos reservados.\"},\"userNav\":{\"avatarAlt\":\"Avatar del usuario\",\"profile\":\"Perfil\",\"logout\":\"Cerrar sesión\"},\"login\":{\"title\":\"Iniciar Sesión\",\"subtitle\":\"Introduce tu correo para acceder a tu cuenta.\",\"password\":\"Contraseña\",\"button\":\"Iniciar Sesión\",\"noAccount\":\"¿No tienes una cuenta?\",\"toast\":{\"error\":{\"title\":\"Fallo de Inicio de Sesión\"},\"success\":{\"title\":\"Inicio de Sesión Exitoso\",\"description\":\"¡Bienvenido de nuevo!\"}}},\"signup\":{\"title\":\"Registrarse\",\"subtitle\":\"Introduce tu información para crear una cuenta\",\"name\":\"Nombre Completo\",\"confirmPassword\":\"Confirmar Contraseña\",\"button\":\"Crear una cuenta\",\"hasAccount\":\"¿Ya tienes una cuenta?\",\"toast\":{\"error\":{\"title\":\"Fallo en el Registro\"},\"success\":{\"title\":\"Registro Exitoso\",\"description\":\"Por favor, revisa tu correo para verificar tu cuenta.\"}}},\"favorites\":{\"title\":\"Tus Propiedades Favoritas\",\"subtitle\":\"Aquí están los listados que has guardado para más tarde.\",\"add\":\"Añadir a favoritos\",\"remove\":\"Quitar de favoritos\",\"empty\":{\"title\":\"Aún no tienes favoritos\",\"description\":\"Haz clic en el icono del corazón en cualquier propiedad para guardarla aquí.\",\"button\":\"Explorar Propiedades\"},\"toast\":{\"added\":{\"title\":\"Añadido a Favoritos\",\"description\":\"\\\"{title}\\\" ha sido guardado.\"},\"removed\":{\"title\":\"Eliminado de Favoritos\",\"description\":\"\\\"{title}\\\" ha sido eliminado.\"}}},\"messages\":{\"title\":\"Tus Conversaciones\",\"subtitle\":\"Gestiona tus mensajes con los vendedores.\",\"allMessages\":\"Todos los Mensajes\",\"re\":\"Re:\",\"empty\":{\"title\":\"Aún no hay conversaciones\",\"description\":\"Cuando contactes a un vendedor, tus conversaciones aparecerán aquí.\",\"button\":\"Explorar Propiedades\"},\"select\":{\"title\":\"Selecciona una conversación\",\"description\":\"Elige una conversación de la lista para ver los mensajes.\"},\"timestamp\":{\"minutes\":\"hace {count}m\",\"hours\":\"hace {count}h\"}},\"chat\":{\"title\":\"Chatear con\",\"titleProperty\":\"Chatear sobre \\\"{title}\\\"\",\"potentialBuyer\":\"Comprador Potencial\",\"error\":\"Lo siento, estoy teniendo problemas para conectarme ahora mismo. Por favor, inténtalo de nuevo más tarde.\",\"placeholder\":\"Escribe tu mensaje...\"},\"notifications\":{\"open\":\"Abrir mensajes\",\"inbox\":\"Bandeja de entrada\",\"noMessages\":\"No hay mensajes nuevos.\",\"viewAll\":\"Ver todos los mensajes\"},\"profile\":{\"sellerBadge\":\"Vendedor\",\"ratings\":\"valoraciones\",\"avatarAlt\":\"Foto de perfil de {name}\",\"contactSeller\":\"Contactar al Vendedor\",\"tabs\":{\"listed\":\"Propiedades Listadas\",\"saved\":\"Propiedades Guardadas\"},\"empty\":{\"listed\":{\"own\":\"Aún no has listado ninguna propiedad.\",\"other\":\"{name} aún no ha listado ninguna propiedad.\"},\"saved\":{\"description\":\"Aún no has guardado ninguna propiedad.\",\"button\":\"Explorar Propiedades\"}},\"edit\":{\"title\":\"Editar Perfil\",\"description\":\"Realiza cambios en tu perfil aquí. Haz clic en guardar cuando hayas terminado.\",\"name\":\"Nombre Completo\",\"save\":\"Guardar cambios\",\"toast\":{\"success\":{\"title\":\"Perfil Actualizado\",\"description\":\"Tus cambios han sido guardados.\"},\"error\":{\"title\":\"Error al Actualizar\",\"description\":\"No se pudieron guardar los cambios de tu perfil.\"}}}},\"property\":{\"realtorInfo\":\"Información del Agente\",\"certifiedRealtor\":\"Agente Certificado\",\"details\":\"Detalles de la Propiedad\",\"bedrooms\":\"Dormitorios\",\"bathrooms\":\"Baños\",\"beds\":\"habs\",\"baths\":\"baños\",\"sqft\":\"m²\",\"description\":\"Descripción\",\"features\":\"Características\",\"similar\":\"Propiedades Similares\",\"types\":{\"house\":\"Casa\",\"apartment\":\"Apartamento\",\"condo\":\"Condominio\",\"villa\":\"Villa\",\"lot\":\"Solar / Terreno\"}},\"newProperty\":{\"title\":\"Listar una Nueva Propiedad\",\"subtitle\":\"Rellena los detalles a continuación para poner tu propiedad en el mercado.\",\"form\":{\"name\":\"Nombre de la Propiedad\",\"name_placeholder\":\"Ej: Villa de lujo con vista al mar\",\"price\":\"Precio\",\"location\":\"Ubicación\",\"address\":\"Dirección Completa\",\"type_placeholder\":\"Selecciona un tipo\",\"bedrooms\":\"Dormitorios\",\"bathrooms\":\"Baños\",\"area\":\"Área (m²)\",\"amenities_note\":\"Lista separada por comas.\",\"features\":\"Características\",\"features_placeholder\":\"Ej: Vista al mar, arquitectura moderna\",\"generating\":\"Generando...\",\"generate_ai\":\"Generar con IA\",\"description_placeholder\":\"Describe la propiedad...\",\"photos\":\"Fotos de la Propiedad\",\"submit\":\"Listar Propiedad\"},\"toast\":{\"generated\":{\"title\":\"¡Descripción Generada!\",\"description\":\"La descripción generada por IA ha sido añadida.\"},\"listed\":{\"title\":\"¡Propiedad Listada!\",\"description\":\"Tu propiedad ya está en el mercado.\"},\"error\":\"No se pudo generar la descripción.\"}},\"userCard\":{\"viewProfile\":\"Ver Perfil\"},\"languageSwitcher\":{\"label\":\"Cambiar idioma\"},\"about\":{\"title\":\"Reimaginando los Bienes Raíces\",\"subtitle\":\"Somos un equipo apasionado dedicado a crear una experiencia inmobiliaria transparente, eficiente y agradable para todos.\",\"missionTitle\":\"Nuestra Misión\",\"missionText\":\"Nuestra misión es empoderar a compradores y vendedores con los datos, la inspiración y el conocimiento que necesitan para tomar las mejores decisiones. Creemos que encontrar un hogar debe ser un viaje alegre, y estamos aquí para hacerlo realidad, una propiedad a la vez.\",\"teamTitle\":\"Conoce al Equipo\",\"teamSubtitle\":\"Somos un grupo diverso de agentes inmobiliarios, entusiastas de la tecnología y expertos en servicio al cliente unidos por un único objetivo: servirte mejor.\",\"whyTitle\":\"¿Por qué VENDRA?\",\"whySubtitle\":\"Descubre las ventajas de usar nuestra plataforma para tu próxima aventura inmobiliaria.\",\"why1_title\":\"Listados Curados\",\"why1_text\":\"Contamos con una selección cuidadosamente elegida de propiedades de calidad para asegurar que estés viendo lo mejor del mercado.\",\"why2_title\":\"Agentes Expertos\",\"why2_text\":\"Conéctate con profesionales inmobiliarios experimentados y verificados, listos para ayudarte en cada paso.\",\"why3_title\":\"Experiencia Simplificada\",\"why3_text\":\"Nuestra plataforma fácil de usar hace que encontrar, comprar y vender propiedades sea más sencillo que nunca.\"},\"contact\":{\"title\":\"Ponte en Contacto\",\"subtitle\":\"¿Tienes alguna pregunta o comentario? Usa el formulario a continuación para enviarnos un mensaje, o contáctanos por correo electrónico o teléfono.\",\"form\":{\"title\":\"Envíanos un Mensaje\",\"name\":\"Nombre Completo\",\"name_placeholder\":\"Tu Nombre\",\"email\":\"Correo Electrónico\",\"email_placeholder\":\"tu.email@ejemplo.com\",\"message\":\"Mensaje\",\"message_placeholder\":\"Escribe tu mensaje aquí...\",\"submit\":\"Enviar Mensaje\",\"validation\":{\"name\":\"Por favor, introduce tu nombre.\",\"email\":\"Por favor, introduce una dirección de correo válida.\",\"message\":\"El mensaje debe tener al menos 10 caracteres.\"}},\"info\":{\"title\":\"Información de Contacto\",\"address_title\":\"Nuestra Oficina\",\"address\":\"KM 17 Autop. Duarte\",\"phone_title\":\"Teléfono\",\"phone\":\"829-689-7550 (con WhatsApp)\",\"email_title\":\"Correo Electrónico\",\"email\":\"soporte@vendra.com\"},\"toast\":{\"success\":{\"title\":\"¡Mensaje Enviado!\",\"description\":\"Gracias por contactarnos. Te responderemos en breve.\"}}},\"terms\":{\"title\":\"Términos y Condiciones\",\"subtitle\":\"Por favor, lee estos términos y condiciones cuidadosamente antes de usar Nuestro Servicio.\",\"lastUpdated\":\"Última actualización: {date}\",\"locale_code\":\"es-ES\",\"section1\":{\"title\":\"1. Introducción\",\"content\":\"Bienvenido a VENDRA. Estos Términos y Condiciones rigen tu uso de nuestro sitio web y servicios. Al acceder o utilizar el servicio, aceptas estar sujeto a estos Términos. Si no estás de acuerdo con alguna parte de los términos, no podrás acceder al servicio.\"},\"section2\":{\"title\":\"2. Cuentas de Usuario\",\"content\":\"Cuando creas una cuenta con nosotros, debes proporcionarnos información que sea precisa, completa y actualizada en todo momento. No hacerlo constituye una violación de los Términos, lo que puede resultar en la terminación inmediata de tu cuenta en nuestro Servicio.\"},\"section3\":{\"title\":\"3. Listados de Propiedades\",\"content\":\"VENDRA permite a los usuarios publicar listados de propiedades. Eres responsable de la exactitud y legalidad del contenido que publicas. Nos reservamos el derecho de eliminar cualquier listado que viole nuestras políticas o se considere inapropiado, a nuestra entera discreción.\"},\"section4\":{\"title\":\"4. Propiedad Intelectual\",\"content\":\"El Servicio y su contenido original, características y funcionalidades son y seguirán siendo propiedad exclusiva de VENDRA y sus licenciantes. El Servicio está protegido por derechos de autor, marcas registradas y otras leyes tanto de los Estados Unidos como de otros países.\"},\"section5\":{\"title\":\"5. Limitación de Responsabilidad\",\"content\":\"En ningún caso VENDRA, ni sus directores, empleados, socios, agentes, proveedores o afiliados, serán responsables por daños indirectos, incidentales, especiales, consecuentes o punitivos, incluyendo, sin limitación, pérdida de beneficios, datos, uso, buena voluntad u otras pérdidas intangibles.\"},\"section6\":{\"title\":\"6. Ley Aplicable\",\"content\":\"Estos Términos se regirán e interpretarán de acuerdo con las leyes del Estado de California, Estados Unidos, sin tener en cuenta sus disposiciones sobre conflicto de leyes.\"}},\"landing\":{\"hero\":{\"title\":\"Tu Próximo Hogar te Espera\",\"subtitle\":\"El mercado principal para descubrir, comprar y vender propiedades extraordinarias. Encontremos la puerta a tus sueños.\",\"cta_main\":\"Comenzar\",\"cta_secondary\":\"Saber Más\"},\"featured\":{\"title\":\"Listados Destacados\",\"subtitle\":\"Tu próximo hogar o inversión comienza aquí. Descubre casas, solares, apartamentos y más.\"},\"features\":{\"feature1_title\":\"Búsqueda Avanzada\",\"feature1_desc\":\"Personaliza tu búsqueda y descubre propiedades que se ajustan a ti.\",\"feature2_title\":\"Listado de Propiedades a un Click\",\"feature2_desc\":\"Tu próximo hogar o inversión puede estar más cerca de lo que imaginas. Conéctate con vendedores reales en segundos.\",\"feature3_title\":\"Mensajería Directa\",\"feature3_desc\":\"Conectamos a compradores con vendedores de forma directa y rápida\"},\"testimonials\":{\"title\":\"Lo que Dicen Nuestros Clientes\",\"subtitle\":\"Estamos orgullosos de haber ayudado a tantas personas a encontrar su inmueble perfecto. Esto es lo que piensan de VENDRA.\",\"quote1\":\"VENDRA hizo que encontrar la casa de nuestros sueños fuera un juego de niños. ¡La plataforma es muy intuitiva y los agentes fueron increíblemente serviciales!\",\"role1\":\"Compradores Felices\",\"quote2\":\"Como agente, VENDRA es revolucionario. Me conecta con compradores serios y agiliza todo el proceso de venta.\",\"role2\":\"Vendedora Verificada\",\"quote3\":\"Estaba abrumado con el proceso de vender mi casa, pero VENDRA me dio las herramientas y el apoyo que necesitaba para obtener una gran oferta, rápidamente.\",\"role3\":\"Vendedor Primerizo\"},\"cta\":{\"title\":\"¿Listo para Empezar tu Viaje?\",\"subtitle\":\"Crea una cuenta hoy para guardar tus propiedades favoritas, conectarte con vendedores y desbloquear todas las funciones de VENDRA.\",\"button\":\"Regístrate Gratis\"}},\"mock\":{\"property1_title\":\"Lujosa Villa en Beverly Hills\",\"property1_description\":\"Una impresionante villa que ofrece lujo y privacidad incomparables. Cuenta con una gran escalera, cocina gourmet y una piscina infinita impresionante con vistas a la ciudad. Perfecta para quienes exigen lo mejor de la vida.\",\"property2_title\":\"Moderno Apartamento en el Centro de LA\",\"property2_description\":\"Apartamento moderno, elegante y con estilo en el corazón del centro de LA. Ventanas de piso a techo que ofrecen increíbles vistas del horizonte. Las comodidades incluyen un salón en la azotea, gimnasio y conserje 24/7.\",\"property3_title\":\"Acogedora Casa Familiar en Santa Monica\",\"property3_description\":\"Encantadora casa familiar a solo unas cuadras de la playa. Esta casa cuenta con un hermoso patio trasero con jardín, una espaciosa sala de estar con chimenea y una cocina recientemente renovada. Ideal para la vida familiar.\",\"property4_title\":\"Condominio Chic en West Hollywood\",\"property4_description\":\"Un condominio de moda en un barrio vibrante, perfecto para un joven profesional. Diseño de concepto abierto con acabados modernos y un balcón privado. El edificio ofrece piscina, gimnasio y estacionamiento seguro.\",\"property5_title\":\"Extensa Finca en Malibú\",\"property5_description\":\"Una exquisita finca frente al mar con acceso privado a la playa. Esta obra maestra del diseño cuenta con vistas panorámicas al océano desde todas las habitaciones, un cine en casa de última generación y una cancha de tenis.\",\"property6_title\":\"Pintoresca Casa en Pasadena\",\"property6_description\":\"Una hermosa casa de estilo artesano en una calle tranquila y arbolada en Pasadena. Cuenta con carpintería original, un gran porche delantero y un patio trasero sereno perfecto para relajarse.\",\"property7_title\":\"Penthouse con Vistas Panorámicas\",\"property7_description\":\"Vive en la cima del mundo en este exclusivo penthouse. Ofreciendo vistas de 360 grados de la ciudad, esta residencia es el epítome del lujo urbano. Incluye un ascensor privado, terraza en la azotea y servicios premium.\",\"property8_title\":\"Condominio Frente a la Playa en Santa Mónica\",\"property8_description\":\"Despierta con el sonido de las olas en este lujoso condominio frente a la playa. Acceso directo a la arena, una moderna sala de estar de planta abierta y un gran balcón para disfrutar del atardecer. Una oportunidad única en una ubicación privilegiada.\",\"user1_bio\":\"Agente inmobiliaria de primer nivel con más de 15 años de experiencia en el mercado de lujo. Permíteme ayudarte a encontrar la casa de tus sueños.\",\"user2_bio\":\"Especializado en propiedades residenciales y comerciales del centro. Encontremos tu próxima inversión.\",\"user3_bio\":\"Tu experta en bienes raíces de Santa Mónica. Vivo y respiro propiedades costeras.\",\"user4_bio\":\"Conectando clientes con el vibrante estilo de vida de West Hollywood. El condominio de tus sueños te espera.\"}}"));}}),
"[project]/src/context/LanguageContext.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "LanguageContext": (()=>LanguageContext),
    "LanguageProvider": (()=>LanguageProvider)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$locales$2f$en$2e$json__$28$json$29$__ = __turbopack_context__.i("[project]/src/locales/en.json (json)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$locales$2f$es$2e$json__$28$json$29$__ = __turbopack_context__.i("[project]/src/locales/es.json (json)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$js$2d$cookie$2f$dist$2f$js$2e$cookie$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/js-cookie/dist/js.cookie.mjs [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
const translations = {
    en: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$locales$2f$en$2e$json__$28$json$29$__["default"],
    es: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$locales$2f$es$2e$json__$28$json$29$__["default"]
};
const LanguageContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(undefined);
const LanguageProvider = ({ children })=>{
    const [locale, setLocaleState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(()=>{
        const savedLocale = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$js$2d$cookie$2f$dist$2f$js$2e$cookie$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].get('locale');
        return savedLocale === 'en' || savedLocale === 'es' ? savedLocale : 'es';
    });
    const setLocale = (newLocale)=>{
        setLocaleState(newLocale);
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$js$2d$cookie$2f$dist$2f$js$2e$cookie$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].set('locale', newLocale, {
            expires: 365
        });
    };
    const value = {
        locale,
        setLocale,
        translations: translations[locale]
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(LanguageContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/context/LanguageContext.tsx",
        lineNumber: 39,
        columnNumber: 5
    }, this);
};
}}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/stream [external] (stream, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}}),
"[externals]/http [external] (http, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}}),
"[externals]/url [external] (url, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}}),
"[externals]/punycode [external] (punycode, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("punycode", () => require("punycode"));

module.exports = mod;
}}),
"[externals]/https [external] (https, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}}),
"[externals]/zlib [external] (zlib, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}}),
"[externals]/events [external] (events, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}}),
"[externals]/net [external] (net, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("net", () => require("net"));

module.exports = mod;
}}),
"[externals]/tls [external] (tls, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("tls", () => require("tls"));

module.exports = mod;
}}),
"[externals]/crypto [external] (crypto, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}}),
"[externals]/buffer [external] (buffer, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("buffer", () => require("buffer"));

module.exports = mod;
}}),
"[project]/src/lib/supabase/client.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "createClient": (()=>createClient)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/index.js [app-ssr] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createBrowserClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/createBrowserClient.js [app-ssr] (ecmascript)");
'use client';
;
function createClient() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createBrowserClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createBrowserClient"])(("TURBOPACK compile-time value", "https://noyztbqdgfniixzmpuac.supabase.co"), ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5veXp0YnFkZ2ZuaWl4em1wdWFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyOTcwNzEsImV4cCI6MjA2ODg3MzA3MX0.WcQOBRjEYQun3eFIzSrupRFmjJArY2jXToMURoylciY"));
}
}}),
"[project]/src/context/AuthContext.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "AuthProvider": (()=>AuthProvider),
    "useAuth": (()=>useAuth)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase/client.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(undefined);
const AuthProvider = ({ children })=>{
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createClient"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session)=>{
            const currentUser = session?.user ?? null;
            setUser(currentUser);
            setLoading(false);
            if (event === 'SIGNED_IN' && router) {
                router.refresh();
            }
        });
        return ()=>{
            subscription.unsubscribe();
        };
    }, [
        supabase,
        router
    ]);
    const login = async (email, pass)=>{
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password: pass
        });
        return {
            error
        };
    };
    const logout = async ()=>{
        await supabase.auth.signOut();
        setUser(null);
    };
    const signup = async (name, email, pass)=>{
        // The database trigger 'on_auth_user_created' will now handle creating the profile.
        const { data, error } = await supabase.auth.signUp({
            email,
            password: pass,
            options: {
                data: {
                    full_name: name,
                    avatar_url: `https://placehold.co/128x128.png?text=${name.charAt(0)}`
                }
            }
        });
        return {
            error
        };
    };
    const value = {
        user,
        loading,
        login,
        logout,
        signup,
        supabase
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/context/AuthContext.tsx",
        lineNumber: 81,
        columnNumber: 5
    }, this);
};
const useAuth = ()=>{
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
}}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__ff31b362._.js.map