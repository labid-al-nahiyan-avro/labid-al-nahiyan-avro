/* ---------------------------------------------------------------------------
   ambient.js — the quiet layer behind the page.

   THE CHOSEN GROUND: LATTICE.
   Points on an even grid, and **almost nothing moves them but the reader**.
   There is no drift, no bloom and no cursor light — the whole layer is one
   still lattice, and the cursor pushes a small neighbourhood of it aside and
   lets it settle back. Order, with a local disturbance.

   That is the argument for it over the scattered field it replaced: a field
   of drifting dots is decoration that happens whether anyone is there or not.
   A lattice that only moves where you are is a field under measurement, which
   is the subject of this site. It is also cheaper — a still grid costs nothing
   until a pointer enters the window.

   Four other grounds were built and compared before this one was picked; they
   are not in this file. Nothing here is on by default either: the layer is
   gated behind `ambient.enabled` in content/site.js.

   WHAT IT MUST NEVER DO
   Block a click, touch the scroll, or out-shout the content. The layer is
   `pointer-events: none`, it listens on `window`, it never calls
   `preventDefault`, and it draws at half strength — see --ambient-k.

   COST
   One rAF loop, and only while a pointer is in the window: with no pointer
   and nothing settling, the loop stops itself. No DOM per point, no
   allocation in the loop, and `getComputedStyle` polled every 400ms rather
   than every frame.
--------------------------------------------------------------------------- */

/* Grid pitch in CSS pixels, and the cursor's reach. The push is a magnetic
   field, not an explosion: 18px of travel inside 150px. */
const PITCH = 46;
const PUSH_RADIUS = 150;
const PUSH_MAX = 18;

const prefersReduced = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function setupAmbient() {
  const layer = document.querySelector("[data-ambient]");
  const canvas = document.querySelector("[data-ambient-field]");
  if (!layer || !canvas) return;

  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) return;

  const points = [];
  let w = 0, h = 0, dpr = 1;

  /* Cursor state lives in plain numbers, not in any framework. `tx/ty` is
     where the pointer is; `cx/cy` is where the lattice's idea of it has
     caught up to. */
  let tx = -9999, ty = -9999, cx = -9999, cy = -9999;
  let hasPointer = false;

  /* The accent is re-read on a timer rather than every frame — getComputedStyle
     is a style resolve, and the value only changes when a section does. The
     drawn colour eases toward it so the ground drifts between sections over
     about a second instead of switching. */
  let accent = [110, 130, 120];
  let target = [110, 130, 120];

  function readAccent() {
    const raw = getComputedStyle(document.documentElement)
      .getPropertyValue("--accent")
      .trim();
    if (!raw) return;
    const probe = document.createElement("i");
    probe.style.color = raw;
    document.body.appendChild(probe);
    const m = getComputedStyle(probe).color.match(/\d+/g);
    probe.remove();
    if (m) target = [Number(m[0]), Number(m[1]), Number(m[2])];
  }

  /* The lattice. Regular, and rebuilt on resize so the pitch stays constant
     in CSS pixels rather than stretching with the window. */
  function build() {
    points.length = 0;
    const cols = Math.ceil(w / PITCH) + 1;
    const rows = Math.ceil(h / PITCH) + 1;
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        points.push({ gx: x * PITCH, gy: y * PITCH, ox: 0, oy: 0 });
      }
    }
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    build();
  }

  /** True while anything is still moving, so the loop can stop itself. */
  let restless = false;

  function draw() {
    ctx.clearRect(0, 0, w, h);

    for (let i = 0; i < 3; i++) accent[i] += (target[i] - accent[i]) * 0.04;
    const cr = accent[0] | 0, cg = accent[1] | 0, cb = accent[2] | 0;
    const fill = `rgba(${cr},${cg},${cb},0.30)`;
    ctx.fillStyle = fill;

    restless = false;
    for (let i = 0; i < points.length; i++) {
      const p = points[i];

      /* The only force in the whole layer. Nothing drifts; a point sits
         exactly on its lattice position until a cursor comes near it. */
      let wantX = 0, wantY = 0;
      if (hasPointer) {
        const dx = p.gx - cx, dy = p.gy - cy;
        const d2 = dx * dx + dy * dy;
        if (d2 < PUSH_RADIUS * PUSH_RADIUS) {
          const d = Math.sqrt(d2) || 1;
          const force = (1 - d / PUSH_RADIUS) ** 2;
          wantX = (dx / d) * force * PUSH_MAX;
          wantY = (dy / d) * force * PUSH_MAX;
        }
      }
      p.ox += (wantX - p.ox) * 0.08;
      p.oy += (wantY - p.oy) * 0.08;
      if (!restless && (Math.abs(p.ox - wantX) > 0.05 || Math.abs(p.oy - wantY) > 0.05)) {
        restless = true;
      }

      ctx.beginPath();
      ctx.arc(p.gx + p.ox, p.gy + p.oy, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  let raf = 0;
  let accentTimer = 0;
  let running = true;
  function frame(t) {
    /* The cursor is followed with a lag of 0.14 — about 150ms, the small
       delay that reads as weight rather than as attachment. */
    if (hasPointer) {
      cx += (tx - cx) * 0.14;
      cy += (ty - cy) * 0.14;
    }
    if (t - accentTimer > 400) { accentTimer = t; readAccent(); }
    draw();

    /* Stop when there is nothing left to do. A still lattice with no pointer
       near it does not need sixty frames a second, and this is what makes the
       layer free when the reader is reading rather than moving. */
    const chasing = hasPointer && (Math.abs(tx - cx) > 0.4 || Math.abs(ty - cy) > 0.4);
    if (chasing || restless) raf = requestAnimationFrame(frame);
    else raf = 0;
  }

  function start() {
    if (raf || prefersReduced() || !running) return;
    raf = requestAnimationFrame(frame);
  }
  function stop() {
    if (!raf) return;
    cancelAnimationFrame(raf);
    raf = 0;
  }

  /* Pointer, on window and passive — this layer never sees a click, because
     it is pointer-events: none and sits behind everything. */
  window.addEventListener(
    "pointermove",
    (e) => {
      if (e.pointerType === "touch") return;   // no cursor to follow
      if (!hasPointer) { cx = e.clientX; cy = e.clientY; }
      hasPointer = true;
      tx = e.clientX;
      ty = e.clientY;
      layer.dataset.pointer = "on";
      start();   /* the loop parks itself when idle; a move restarts it */
    },
    { passive: true }
  );
  window.addEventListener("pointerleave", () => { layer.dataset.pointer = "off"; hasPointer = false; start(); }, { passive: true });
  window.addEventListener("blur", () => { layer.dataset.pointer = "off"; hasPointer = false; start(); });

  window.addEventListener("resize", () => { resize(); draw(); }, { passive: true });
  document.addEventListener("visibilitychange", () => {
    running = !document.hidden;
    running ? start() : stop();
  });

  /* Reduced motion keeps the field but stops it moving: one frame, drawn
     where the points start, and no loop at all. */
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  motion.addEventListener("change", () => {
    stop();
    if (prefersReduced()) { readAccent(); accent = target.slice(); draw(); }
    else start();
  });

  build();
  resize();
  readAccent();
  accent = target.slice();

  /* Held back until the opening has finished, so the panels part onto the
     portfolio rather than onto a moving background. The class is also set by
     the head failsafe, so this cannot strand the layer hidden. */
  const reveal = () => {
    layer.dataset.on = "true";
    /* Draw once either way: with no pointer in the window the lattice is
       simply sitting there, and that is its resting state, not an empty one. */
    draw();
    if (!prefersReduced()) start();
  };
  if (document.documentElement.classList.contains("intro-done")) reveal();
  else document.addEventListener("intro:done", reveal, { once: true });
}
