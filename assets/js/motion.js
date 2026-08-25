/* ---------------------------------------------------------------------------
   motion.js — the small shared motion helpers.

   The homepage reveals content as each section arrives, which main.js does
   directly. `setupReveals` here is for ordinary vertical pages — currently
   just the photography page.
--------------------------------------------------------------------------- */

export const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Fades elements in as they enter the viewport, once each. */
export function setupReveals(root = document) {
  const targets = root.querySelectorAll(".reveal");
  if (!targets.length) return;

  if (prefersReducedMotion() || !("IntersectionObserver" in window)) {
    targets.forEach((el) => el.classList.add("is-in"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-in");
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
  );

  targets.forEach((el) => observer.observe(el));
}
