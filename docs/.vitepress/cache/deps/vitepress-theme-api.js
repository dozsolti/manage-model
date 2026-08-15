import { Jt as renderSlot, Vt as openBlock, W as createBaseVNode, nt as defineComponent, q as createElementBlock, sr as normalizeStyle } from "./vue.runtime.esm-bundler-D4M2X7UN.js";
//#region node_modules/vitepress-theme-api/dist/vitepress-theme-api.es.js
var p = { class: "container-content" };
var a = { class: "left" };
var _ = /* @__PURE__ */ defineComponent({
	__name: "DividePage",
	props: { top: {} },
	setup(n) {
		const e = n;
		return (t, d) => (openBlock(), createElementBlock("div", p, [createBaseVNode("div", a, [renderSlot(t.$slots, "left")]), createBaseVNode("div", {
			class: "right",
			style: normalizeStyle({ top: e.top ? `${e.top}px` : "0px" })
		}, [renderSlot(t.$slots, "right")], 4)]));
	}
});
//#endregion
export { _ as DividePage };
