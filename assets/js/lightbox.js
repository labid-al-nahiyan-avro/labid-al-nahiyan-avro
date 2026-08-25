/* ---------------------------------------------------------------------------
   lightbox.js — the photograph viewer.

   Arrow keys or the on-screen controls move between photographs, Escape
   closes, focus is trapped while it is open and returned to the thumbnail
   afterwards. Touch users can swipe. Neighbouring photographs are preloaded
   one step ahead so moving through an album does not stall.
--------------------------------------------------------------------------- */

import { h } from "./dom.js";

export function createLightbox() {
  let shots = [];
  let index = 0;
  let opener = null;

  const img = h("img", { class: "lightbox__img", alt: "" });
  const counter = h("p", { class: "lightbox__counter" });
  const caption = h("p", { class: "lightbox__caption", id: "lightbox-caption" });

  const closeBtn = h("button", { class: "lb-btn", type: "button", text: "Close" });
  const prevBtn = h("button", {
    class: "lightbox__nav lightbox__nav--prev",
    type: "button",
    "aria-label": "Previous photograph",
    text: "‹",
  });
  const nextBtn = h("button", {
    class: "lightbox__nav lightbox__nav--next",
    type: "button",
    "aria-label": "Next photograph",
    text: "›",
  });

  const root = h(
    "div",
    {
      class: "lightbox",
      role: "dialog",
      "aria-modal": "true",
      "aria-label": "Photograph viewer",
      "aria-describedby": "lightbox-caption",
      "data-open": "false",
    },
    h("div", { class: "lightbox__bar" }, counter, closeBtn),
    h(
      "div",
      { class: "lightbox__stage" },
      prevBtn,
      h("figure", { class: "lightbox__figure" }, img),
      nextBtn
    ),
    caption
  );

  document.body.append(root);

  const preload = (i) => {
    const shot = shots[i];
    if (!shot) return;
    const ghost = new Image();
    ghost.src = shot.src;
  };

  const show = (i) => {
    index = (i + shots.length) % shots.length;
    const shot = shots[index];

    img.dataset.ready = "false";
    img.src = shot.src;
    img.alt = shot.alt || "";
    caption.textContent = shot.caption || "";
    counter.textContent = `${index + 1} / ${shots.length}`;

    const single = shots.length < 2;
    prevBtn.hidden = single;
    nextBtn.hidden = single;

    if (img.complete) img.dataset.ready = "true";
    preload(index + 1);
    preload(index - 1);
  };

  img.addEventListener("load", () => {
    img.dataset.ready = "true";
  });

  const focusables = () =>
    [closeBtn, prevBtn, nextBtn].filter((el) => !el.hidden && el.offsetParent !== null);

  const onKey = (event) => {
    switch (event.key) {
      case "Escape":
        event.preventDefault();
        close();
        break;
      case "ArrowRight":
        event.preventDefault();
        show(index + 1);
        break;
      case "ArrowLeft":
        event.preventDefault();
        show(index - 1);
        break;
      case "Tab": {
        const items = focusables();
        if (!items.length) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
        break;
      }
      default:
        break;
    }
  };

  function open(list, startIndex, triggerEl) {
    shots = list;
    opener = triggerEl || null;
    root.dataset.open = "true";
    document.body.dataset.lightboxOpen = "true";
    show(startIndex);
    document.addEventListener("keydown", onKey);
    closeBtn.focus();
  }

  function close() {
    root.dataset.open = "false";
    delete document.body.dataset.lightboxOpen;
    document.removeEventListener("keydown", onKey);
    /* Let the fade finish before dropping the image. */
    window.setTimeout(() => {
      if (root.dataset.open === "false") img.removeAttribute("src");
    }, 300);
    if (opener) opener.focus();
    opener = null;
  }

  closeBtn.addEventListener("click", close);
  prevBtn.addEventListener("click", () => show(index - 1));
  nextBtn.addEventListener("click", () => show(index + 1));

  /* Clicking the backdrop closes; clicking the photograph does not. */
  root.addEventListener("click", (event) => {
    if (event.target === root || event.target.classList.contains("lightbox__stage")) close();
  });

  /* Swipe. */
  let startX = null;
  root.addEventListener(
    "pointerdown",
    (event) => {
      if (event.pointerType === "mouse") return;
      startX = event.clientX;
    },
    { passive: true }
  );
  root.addEventListener(
    "pointerup",
    (event) => {
      if (startX === null) return;
      const dx = event.clientX - startX;
      startX = null;
      if (Math.abs(dx) > 45) show(dx < 0 ? index + 1 : index - 1);
    },
    { passive: true }
  );

  return { open, close };
}
