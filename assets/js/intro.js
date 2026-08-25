/* ---------------------------------------------------------------------------
   intro.js — the opening title sequence.

   THE SCHEDULE IS NOT IN THIS FILE. It is in site.css §4, and it starts at
   first paint because `data-state="play"` is written into index.html. About
   1.2 seconds end to end:

       0–300ms     two ivory panels cover the viewport; the name fades up
       260–600ms   the role rises into place
       460–680ms   a short accent rule draws under it
       700–1240ms  the panels part — top up, bottom down
       ~1240ms     this file removes the layer

   The portfolio is rendered underneath the whole time. The panels are simply
   covering it, so the reveal shows the real page rather than fading one in.
   It is an opening, not a loading screen: nothing is being waited for.

   WHAT THIS FILE IS FOR
   Clearing the layer away once the panels have finished, remembering that the
   visitor has seen it, and letting an impatient one skip. That is all. The
   panels part with or without it.

   WHY IT USED TO NOT APPEAR
   Two causes, both now designed out rather than patched:

   1. `if (prefersReducedMotion()) return finishNow()` skipped the sequence
      outright. macOS carries "Reduce motion" in Accessibility → Display and
      Chrome honours it, so for those visitors the opening never existed.
      Reduced motion now gets a shortened, motionless cross-fade instead —
      see the media query at the foot of site.css.
   2. The beats were started by this module, so they began ~250ms late and
      the whole thing ran to 2.3s. They are CSS now and start at first paint.

   Finishing is driven by `animationend` on the panel rather than a timer, so
   it cannot drift out of step with the stylesheet. A timer still backs it up,
   and index.html backs that up in turn: the portfolio must always become
   usable.

   IF IT SEEMS MISSING
   It plays once per browsing session. To see it again:
       · open the site in a new tab
       · run  sessionStorage.removeItem("labid-intro-seen")  in the console
       · load the page with  ?intro  on the end of the URL
--------------------------------------------------------------------------- */

const KEY = "labid-intro-seen";

/** Fired on `document` the moment the portfolio is uncovered, whichever way
 *  the opening ended. main.js uses it to time the first section's entrance. */
export const INTRO_DONE = "intro:done";

const remember = () => {
  try {
    sessionStorage.setItem(KEY, "true");
  } catch (e) {
    /* Private mode: the sequence simply plays again next time. */
  }
};

const alreadySeen = () => {
  try {
    return sessionStorage.getItem(KEY) === "true";
  } catch (e) {
    return false;
  }
};

/** `?intro` on the URL forces it, whatever the session says. */
const forced = () => /[?&]intro\b/.test(window.location.search);

export function playIntro(node) {
  const done = () => {
    document.documentElement.classList.add("intro-done");
    document.dispatchEvent(new CustomEvent(INTRO_DONE));
  };

  if (!node) return done();

  const finishNow = () => {
    node.remove();
    remember();
    done();
  };

  /* index.html has already put `intro-done` on <html> in this case, so the
     layer never painted and no animation will ever end. */
  if (alreadySeen() && !forced()) return finishNow();

  let finished = false;
  const finish = () => {
    if (finished) return;
    finished = true;
    window.clearTimeout(timer);
    finishNow();
  };

  /* The panels are the last thing to move, so their animation ending is the
     moment the page is uncovered. Reading it from the animation rather than
     re-stating its duration here means the two can never disagree. */
  const panel = node.querySelector(".intro__panel--top");
  if (panel) panel.addEventListener("animationend", finish, { once: true });

  /* Backstop, in case the panel never animates at all — no stylesheet, an
     animation-suppressing extension, a browser that skips animations on a
     background tab. Comfortably past the 1.24s the sequence actually takes. */
  const timer = window.setTimeout(finish, 1800);

  /* Let an impatient visitor straight through. The listeners are on `window`,
     not on the layer: the layer is `pointer-events: none` so that a failure
     to remove it can never leave the page unclickable, which means it cannot
     receive a click of its own. */
  const skip = (event) => {
    if (finished) return;
    if (event.type === "keydown" && event.key !== "Escape" && event.key !== "Enter") return;
    node.dataset.state = "skip";
    window.setTimeout(finish, 180);
  };
  window.addEventListener("pointerdown", skip, { once: true });
  window.addEventListener("keydown", skip, { once: true });
}
