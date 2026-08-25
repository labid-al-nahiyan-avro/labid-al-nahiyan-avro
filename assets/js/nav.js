/* ---------------------------------------------------------------------------
   nav.js — which section you are in, and getting to another one.

   THE SCROLL MODEL, AFTER THE MASTHEAD REWRITE

       the page scrolls vertically, once, like a page
       the rail is fixed beside it and does not scroll

   That is the whole model. The previous shell was a horizontal deck of seven
   viewport-wide panes with its own wheel forwarding, edge bands, and a wrap
   from the last section back to the first; all of it is gone, and
   `_deck.legacy.js` is kept only so the reasoning is not lost. Nothing
   imports it.

   What is left is the small amount the browser cannot infer:

   · which section is on screen, for the nav highlight and the accent
   · smooth scrolling to a section when a nav link is clicked

   There is no wheel handler, no preventDefault, no transform driving scroll,
   and no scroll hijacking of any kind. Native page scrolling, and an observer
   watching it.
--------------------------------------------------------------------------- */

const reducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function setupNav({ sections, onSectionChange } = {}) {
  if (!sections || !sections.length) return;

  let current = -1;
  const report = (i) => {
    if (i === current || i < 0) return;
    current = i;
    if (onSectionChange) onSectionChange(sections[i], i);
  };

  /* Which section counts as "the one you are reading" is a judgement, not a
     fact: two are usually on screen at once. The rule here is the one that
     matches how people read — the topmost section whose body has crossed the
     upper third of the viewport. `rootMargin` moves the trip-wire there
     rather than doing arithmetic on every scroll event. */
  const atBottom = () =>
    window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4;

  const seen = new Set();
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) seen.add(e.target);
        else seen.delete(e.target);
      });
      /* Bottom of the page overrides the band — see the note below. Without
         this the observer, which fires after the scroll handler, would report
         the band's answer straight back over it. */
      if (atBottom()) return report(sections.length - 1);
      /* The lowest-indexed section still in the band wins, so scrolling up
         and scrolling down agree about where you are. */
      let best = -1;
      seen.forEach((el) => {
        const i = sections.indexOf(el);
        if (i >= 0 && (best === -1 || i < best)) best = i;
      });
      if (best >= 0) report(best);
    },
    { rootMargin: "-30% 0px -60% 0px", threshold: 0 }
  );
  sections.forEach((s) => io.observe(s));

  /* A section arriving is also when its content should arrive. Separate
     observer, different trip-wire: reveal as soon as any part is near, not
     when it becomes "current". */
  const revealIO = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-in"));
        revealIO.unobserve(e.target);
      });
    },
    { rootMargin: "0px 0px -12% 0px", threshold: 0 }
  );
  sections.forEach((s) => revealIO.observe(s));

  /* THE LAST SECTION CANNOT WIN ON ITS OWN.
     Declared above the observer because the observer calls it.
     The trip-wire sits at 30-40% of the viewport height. Once the page is
     scrolled to the very bottom it stops moving, and if the final section is
     shorter than that offset the band is still parked over the one above it —
     so Skills could never become current no matter how far you scrolled.
     Measured, not theorised: the suite caught it reporting Education at max
     scroll. Bottom-of-page is therefore reported directly. */
  window.addEventListener(
    "scroll",
    () => { if (atBottom()) report(sections.length - 1); },
    { passive: true }
  );

  /* Nav links are real anchors and would work with this removed; taking over
     only lets us honour reduced motion and keep the URL clean. */
  document.addEventListener("click", (event) => {
    const control = event.target.closest("[data-goto]");
    if (!control) return;
    const node = document.getElementById(control.dataset.goto);
    if (!node) return;
    event.preventDefault();
    node.scrollIntoView({
      behavior: reducedMotion() ? "auto" : "smooth",
      block: "start",
    });
    /* Move the keyboard with the page, or the next Tab starts from wherever
       the reader was before they used the nav. */
    node.setAttribute("tabindex", "-1");
    node.focus({ preventScroll: true });
  });

  report(0);
}
