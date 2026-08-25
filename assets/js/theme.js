/* ---------------------------------------------------------------------------
   theme.js — the light / dark control.

   THE STYLESHEET DOES THE WORK, NOT THIS FILE. tokens.css carries both
   palettes and follows `prefers-color-scheme` on its own. All this does is
   let someone override that, and remember the override.

   Three states, and the third one matters:

       (no attribute)        follow the system — the default
       data-theme="light"    pinned light
       data-theme="dark"     pinned dark

   Pinning is stored in localStorage and re-applied by the inline script in
   <head>, before the first paint. It has to be inline: a module is deferred,
   so restoring the choice here would paint the wrong theme first and snap.
   This file only handles the click.

   The control cycles back to "follow the system" rather than only toggling
   two states, so a visitor who taps it once out of curiosity can get back to
   the setting they actually keep on their machine.
--------------------------------------------------------------------------- */

/* The control's markup lives here rather than in render.js because the
   photography page has no header to render and still needs the button. */
export function themeButton() {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("class", "themebtn__mark");
  svg.setAttribute("viewBox", "0 0 16 16");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("focusable", "false");
  svg.innerHTML =
    '<g class="themebtn__sun"><circle cx="8" cy="8" r="3.1"/>' +
    '<path d="M8 1.4v1.6M8 13v1.6M14.6 8h-1.6M3 8H1.4M12.7 3.3l-1.1 1.1M4.4 11.6l-1.1 1.1M12.7 12.7l-1.1-1.1M4.4 4.4 3.3 3.3"/></g>' +
    '<g class="themebtn__moon"><path d="M13.2 9.7A5.8 5.8 0 0 1 6.3 2.8a5.9 5.9 0 1 0 6.9 6.9Z"/></g>';
  const btn = document.createElement("button");
  btn.className = "themebtn";
  btn.type = "button";
  btn.setAttribute("data-theme-btn", "true");
  btn.append(svg);
  return btn;
}

const KEY = "labid-theme";
const ORDER = ["system", "light", "dark"];

const root = document.documentElement;

const systemDark = () => window.matchMedia("(prefers-color-scheme: dark)").matches;

/** What is currently pinned, if anything. */
function current() {
  const set = root.getAttribute("data-theme");
  return set === "light" || set === "dark" ? set : "system";
}

/** What is actually on screen right now. */
export function resolved() {
  const now = current();
  return now === "system" ? (systemDark() ? "dark" : "light") : now;
}

function apply(mode) {
  if (mode === "system") {
    root.removeAttribute("data-theme");
    try { localStorage.removeItem(KEY); } catch (e) {}
  } else {
    root.setAttribute("data-theme", mode);
    try { localStorage.setItem(KEY, mode); } catch (e) {}
  }
}

/**
 * Wires up a button. The label says what you are looking at, and the
 * `aria-label` says what pressing it will do — a switch that only announces
 * its own state leaves a screen reader guessing at the outcome.
 */
export function setupTheme(button) {
  if (!button) return;

  const label = () => {
    const mode = current();
    const next = ORDER[(ORDER.indexOf(mode) + 1) % ORDER.length];
    button.dataset.mode = mode;
    button.dataset.resolved = resolved();
    button.setAttribute(
      "aria-label",
      `Theme: ${mode === "system" ? "following your system" : mode}. Switch to ${next === "system" ? "follow your system" : next}.`
    );
  };

  button.addEventListener("click", () => {
    apply(ORDER[(ORDER.indexOf(current()) + 1) % ORDER.length]);
    label();
  });

  /* While the visitor is on "system", follow it if they change it mid-visit. */
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    if (current() === "system") label();
  });

  label();
}
