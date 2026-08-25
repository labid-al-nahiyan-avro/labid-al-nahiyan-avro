/* ---------------------------------------------------------------------------
   _palette.mjs — generates the colour values in tokens.css.

       node assets/css/_palette.mjs

   Prints the token block and a contrast table for both themes. Paste the
   output into tokens.css, or just read the table to check a change.

   WHY THIS FILE EXISTS
   The palette has a property that is easy to break by hand: every field
   colour sits at the SAME OKLCH LIGHTNESS, so no field on the page is louder
   than any other. Nudge one hex "just a little darker" in the stylesheet and
   the property is gone with nothing to show it. Change a constant here and
   re-run instead — the contrast table is the proof.

   Six hues, 60 degrees apart, plus one near-neutral for the fallback family.
   Chroma is clamped to whatever sRGB can show at that lightness, which is why
   the six do not all end up equally saturated: teal and green have more room
   at L=0.52 than red does. That is the gamut, not a mistake.
--------------------------------------------------------------------------- */

const f = (x) => (x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055);
const finv = (x) => (x <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4));

function oklchToRgb(L, C, hDeg) {
  const h = (hDeg * Math.PI) / 180;
  const a = C * Math.cos(h), b = C * Math.sin(h);
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b;
  const l = l_ ** 3, m = m_ ** 3, s = s_ ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s,
  ];
}
const inGamut = (rgb) => rgb.every((v) => v >= -0.0005 && v <= 1.0005);

/** The most chroma this lightness and hue can actually show in sRGB. */
function clampChroma(L, C, h) {
  if (inGamut(oklchToRgb(L, C, h))) return C;
  let lo = 0, hi = C;
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2;
    if (inGamut(oklchToRgb(L, mid, h))) lo = mid; else hi = mid;
  }
  return lo;
}
function hex(L, C, h) {
  const [r, g, b] = oklchToRgb(L, clampChroma(L, C, h), h).map((v) => Math.min(1, Math.max(0, v)));
  const to = (v) => Math.round(f(v) * 255).toString(16).padStart(2, "0");
  return "#" + to(r) + to(g) + to(b);
}
function lum(s) {
  const n = parseInt(s.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => finv(v / 255));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function ratio(a, b) {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}

/* ---- the constants. These are the design. ---- */
const HUE = { security: 25, infra: 80, research: 145, vision: 205, web: 265, ml: 325 };
const NEUTRAL_HUE = 262;

const LIGHT = { L: 0.520, C: 0.135, NC: 0.021 };
const DARK  = { L: 0.785, C: 0.130, NC: 0.020 };

const PAGE = { light: hex(0.992, 0.003, 250), dark: hex(0.225, 0.026, 272) };

const SECTION = {                 /* section accent -> hue on the same wheel */
  profile: NEUTRAL_HUE, news: 325, research: 145,
  work: 25, experience: 265, education: 80, skills: 205,
};

function build(t) {
  const k = t === "light" ? LIGHT : DARK;
  const o = { page: PAGE[t] };
  for (const [name, h] of Object.entries(HUE)) o["tag-" + name] = hex(k.L, k.C, h);
  o["tag-systems"] = hex(k.L, k.NC, NEUTRAL_HUE);
  for (const [name, h] of Object.entries(SECTION)) {
    o["accent-" + name] = hex(k.L, h === NEUTRAL_HUE ? k.NC : k.C, h);
  }
  return o;
}

const light = build("light"), dark = build("dark");

console.log("token                light      on page    dark       on page");
const fam = { light: [], dark: [] };
for (const key of Object.keys(light)) {
  const a = ratio(light[key], PAGE.light), b = ratio(dark[key], PAGE.dark);
  if (key.startsWith("tag-")) { fam.light.push(a); fam.dark.push(b); }
  const flag = key === "page" ? "" : a >= 4.5 && b >= 4.5 ? "AA" : "** FAILS AA **";
  console.log(
    key.padEnd(20), light[key], a.toFixed(2).padStart(6), "   ",
    dark[key], b.toFixed(2).padStart(6), " ", flag
  );
}
const spread = (a) => (Math.max(...a) - Math.min(...a)).toFixed(2);
console.log(
  "\nfamily contrast spread — light " + spread(fam.light) +
  ", dark " + spread(fam.dark) + "   (near zero = equal visual weight)"
);
