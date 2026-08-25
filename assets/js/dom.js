/* ---------------------------------------------------------------------------
   dom.js — a very small element builder. No dependencies.
--------------------------------------------------------------------------- */

/**
 * h("div", { class: "x", text: "hi" }, child, child)
 * Falsy children are skipped, so `cond && h(...)` works inline, and arrays
 * are flattened, so `items.map(...)` can be passed straight through.
 */
export function h(tag, props = {}, ...children) {
  const el = document.createElement(tag);

  for (const [key, value] of Object.entries(props || {})) {
    if (value === null || value === undefined || value === false) continue;

    if (key === "text") {
      el.textContent = value;
    } else if (key === "class") {
      el.className = value;
    } else if (key === "dataset") {
      Object.assign(el.dataset, value);
    } else if (key === "style") {
      el.setAttribute("style", value);
    } else if (key.startsWith("on") && typeof value === "function") {
      el.addEventListener(key.slice(2).toLowerCase(), value);
    } else {
      el.setAttribute(key, value === true ? "" : value);
    }
  }

  for (const child of children.flat(Infinity)) {
    if (!child && child !== 0) continue;
    el.append(child instanceof Node ? child : document.createTextNode(String(child)));
  }

  return el;
}

/** A <ul> of plain strings. Separators are drawn by CSS, not inserted here. */
export function list(values, className) {
  return h(
    "ul",
    { class: className },
    (values || []).filter(Boolean).map((value) => h("li", { text: value }))
  );
}

export const isFilled = (v) => typeof v === "string" && v.trim().length > 0;

export const qs = (sel, root = document) => root.querySelector(sel);

/** Marks a node for the scroll-reveal system, with an optional stagger index. */
export function reveal(el, index) {
  el.classList.add("reveal");
  if (index) el.style.setProperty("--i", String(index));
  return el;
}
