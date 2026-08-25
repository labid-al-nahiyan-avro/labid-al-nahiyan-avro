/* ---------------------------------------------------------------------------
   deck.js — moving between sections.

   THE SCROLL MODEL

       horizontal  =  section to section        (the deck scrolls)
       vertical    =  content inside a section  (the section scrolls)

   Both are real, native scroll containers:

       <main class="deck">          overflow-x: auto,  scroll-snap x mandatory
         <section class="section">  overflow-y: auto,  one viewport wide
           …content, as tall as it needs to be…

   So there is no wheel handler, no preventDefault, and no transform anywhere
   in this file. A vertical wheel scrolls the section the pointer is over. A
   horizontal trackpad gesture scrolls the deck. Momentum, rubber-banding,
   snap, touch, and scrollbars are all the browser's own.

   What this file adds is only what the browser cannot infer:

   · which section is currently on screen, for the navigation
   · the NEXT and PREVIOUS controls, for mouse users who have no horizontal
     gesture at all
   · ArrowLeft / ArrowRight

   All three go through `goTo`, which calls `scrollIntoView` and lets the
   browser do the moving.
--------------------------------------------------------------------------- */

const reducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** True when the keyboard is busy doing something else. */
function isTyping(el) {
  if (!el) return false;
  if (el.isContentEditable) return true;
  return /^(input|textarea|select)$/i.test(el.tagName);
}

export function setupDeck({ deck, onSectionChange } = {}) {
  if (!deck) return { goTo: () => {} };

  const sections = Array.from(deck.querySelectorAll("[data-section]"));
  if (!sections.length) return { goTo: () => {} };

  let index = 0;

  /** Moves the deck to a section. The browser performs the scroll. */
  function goTo(target, { instant = false } = {}) {
    const node =
      typeof target === "number"
        ? sections[Math.max(0, Math.min(sections.length - 1, target))]
        : target;
    if (!node) return;

    node.scrollIntoView({
      behavior: instant || reducedMotion() ? "auto" : "smooth",
      block: "nearest",
      inline: "start",
    });
    scheduleSync();
  }

  /**
   * Wrapping from the last section back to the first, and vice versa.
   *
   * Scrolling there would fly through every section in between, which is
   * both slow and disorienting. So the deck is moved instantly behind a
   * short veil: fade the page out, jump, fade back in. About 560ms, and no
   * rotation, no perspective, no carousel — the continuity is carried by the
   * ↻ on the control and by the fact that nothing streaks past.
   */
  function wrapTo(index) {
    const veil = document.querySelector("[data-veil]");

    /* An explicit scroll of the deck, not `scrollIntoView` on the section:
       jumping the full width of the deck in one step is exactly the case
       where scrollIntoView proved unreliable, and `left` leaves nothing to
       interpret. */
    const jump = () => {
      const target = sections[index];
      if (!target) return;
      /* `behavior: "auto"` means "use the CSS value", and the deck's CSS is
         `scroll-behavior: smooth` — so asking for auto would animate the
         whole width of the deck, which is the one thing a wrap must not do.
         Suspend the CSS for the length of the jump and put it back. */
      const previous = deck.style.scrollBehavior;
      deck.style.scrollBehavior = "auto";
      deck.scrollTo({ left: target.offsetLeft, behavior: "instant" });
      deck.style.scrollBehavior = previous;
      sync();
    };

    if (reducedMotion() || !veil) {
      jump();
      return;
    }

    veil.dataset.state = "in";
    window.setTimeout(() => {
      jump();
      veil.dataset.state = "out";
      window.setTimeout(() => {
        veil.dataset.state = "idle";
      }, 320);
    }, 240);
  }

  /* ---- which section is on screen ----

     Read from the deck's own scroll position rather than an
     IntersectionObserver. Sections are exactly one deck-width apart, so this
     is a division; and because it is derived rather than reported, the
     keyboard and the navigation can never drift out of step with what is
     actually on screen. The handler does no writes, so it forces no layout. */

  const indexFromScroll = () =>
    deck.clientWidth ? Math.round(deck.scrollLeft / deck.clientWidth) : 0;

  function sync() {
    const i = Math.max(0, Math.min(sections.length - 1, indexFromScroll()));
    if (i === index) return;
    index = i;
    deck.dataset.index = String(i);
    if (onSectionChange) onSectionChange(sections[i], i);
  }

  deck.addEventListener("scroll", sync, { passive: true });
  /* `scrollend` fires once a smooth or flung scroll settles. Where it isn't
     supported the timers in scheduleSync cover the same ground. */
  if ("onscrollend" in window) {
    deck.addEventListener("scrollend", sync, { passive: true });
  }

  /* A move we started ourselves — a NEXT click, a nav link, a key — should
     not have to wait for a scroll event to be reflected in the navigation.
     Sync immediately, then again once the movement has settled. */
  let settleTimer;
  function scheduleSync() {
    sync();
    window.clearTimeout(settleTimer);
    settleTimer = window.setTimeout(sync, 620);
  }

  /* Nav links live in the header, outside the deck, and work as plain
     anchors; this keeps the highlight in step with them. */
  document.addEventListener("click", (event) => {
    if (event.target.closest('a[href^="#"]')) scheduleSync();
  });

  /* ---- the explicit controls ---- */

  /* Controls live both inside the deck and outside it (the edge navigation is
     fixed to the viewport), so this listens on the document. */
  document.addEventListener("click", (event) => {
    const stepper = event.target.closest("[data-step]");
    if (stepper) {
      event.preventDefault();
      const here = indexFromScroll();
      const last = sections.length - 1;

      if (stepper.dataset.step === "next") {
        if (here >= last) wrapTo(0);
        else goTo(here + 1);
      } else if (here <= 0) {
        wrapTo(last);
      } else {
        goTo(here - 1);
      }
      return;
    }

    const control = event.target.closest("[data-goto]");
    if (!control) return;
    /* Anchors already work without this; taking over only lets us honour
       reduced motion and keep the URL clean. */
    event.preventDefault();
    const node = document.getElementById(control.dataset.goto);
    if (node) goTo(node);
  });

  /* ---- the one wheel handler on the site ----

     It exists only because the edge controls are full-height columns in the
     gutter. A wheel is delivered to whatever is under the pointer, and those
     columns are fixed-position buttons outside the deck — not scroll
     containers, and with no scrollable ancestor, since `body` is
     `overflow: hidden`. So without this, putting the pointer in the left or
     right band and scrolling a tall section like Research would do nothing at
     all, which reads as the page being frozen.

     This does not contradict the rule in the header comment. Nothing is
     intercepted over content: the listener is on the edge navigation, which
     contains no content, and it forwards the gesture to the element that
     would have received it had the column not been in the way. Do not widen
     its scope. */
  const edge = document.querySelector("[data-edge]");
  if (edge) {
    /* Both scroll containers are `scroll-behavior: smooth`, which would turn
       every wheel tick into its own 300ms animation and feel like treacle.
       Suspend it for the length of the nudge, exactly as `wrapTo` does. */
    const nudge = (node, axis, amount) => {
      const previous = node.style.scrollBehavior;
      node.style.scrollBehavior = "auto";
      node[axis] += amount;
      node.style.scrollBehavior = previous;
    };

    edge.addEventListener(
      "wheel",
      (event) => {
        const here = sections[Math.max(0, Math.min(sections.length - 1, indexFromScroll()))];
        if (!here) return;

        if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
          nudge(deck, "scrollLeft", event.deltaX);
        } else if (here.scrollHeight > here.clientHeight) {
          nudge(here, "scrollTop", event.deltaY);
        } else {
          /* A section that fits needs no scrolling. Leave the event alone
             rather than swallowing it. */
          return;
        }
        event.preventDefault();
      },
      { passive: false }
    );
  }

  /* ---- keyboard ----
     Left and right move between sections. Up and down are left entirely
     alone, because that is how you read a section. */
  window.addEventListener("keydown", (event) => {
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    if (isTyping(document.activeElement)) return;

    /* Read the position now rather than trusting a cached index — a click,
       an anchor, or a swipe may have moved the deck since the last sync. */
    const here = indexFromScroll();

    /* Arrows clamp rather than wrap. Wrapping is a deliberate act — you press
       a control that says ↻ START — not something that should happen because
       you held a key down a beat too long. */
    if (event.key === "ArrowRight") {
      event.preventDefault();
      goTo(Math.min(sections.length - 1, here + 1));
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      goTo(Math.max(0, here - 1));
    }
  });

  /* Focus moving into an off-screen section is handled by the browser: the
     deck is a real scroll container, so it scrolls the focused element into
     view by itself. Nothing to do here. */

  /* A resize can leave the deck between two snap points. */
  let resizeTimer;
  window.addEventListener("resize", () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      sections[index].scrollIntoView({ behavior: "auto", block: "nearest", inline: "start" });
    }, 150);
  });

  deck.dataset.index = "0";
  if (onSectionChange) onSectionChange(sections[0], 0);

  return { goTo, sections };
}
