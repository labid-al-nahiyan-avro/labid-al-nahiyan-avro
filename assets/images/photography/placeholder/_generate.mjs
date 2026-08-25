/* Generates the placeholder photographs in assets/images/photography/placeholder/.
   Flat duotone architectural studies in the site's own palette, each stamped
   PLACEHOLDER so it can never be mistaken for real work. Re-run to regenerate;
   delete the folder and the album entry once real photographs exist. */
import { writeFileSync, mkdirSync } from "node:fs";

const DIR =
  "/Users/labidalnahiyan/Documents/Projects/Portfolio/assets/images/photography/placeholder";
mkdirSync(DIR, { recursive: true });

/* ground = the paper the study is printed on, figure = the one muted colour. */
const PALETTE = {
  blue:      { ground: "#e6e6e1", figure: "#55738a" },
  forest:    { ground: "#e7e8e0", figure: "#496653" },
  terracotta:{ ground: "#eee8e0", figure: "#9c5334" },
  ochre:     { ground: "#edeada", figure: "#806226" },
  plum:      { ground: "#eae4e2", figure: "#7d4f5c" },
  stone:     { ground: "#eae8e1", figure: "#6d6356" },
};

const grain = `
  <filter id="g" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" seed="7"/>
    <feColorMatrix type="saturate" values="0"/>
  </filter>`;

/* Each study is a function of the box and the two colours. */
const STUDIES = {
  horizon: (w, h, c) => `
    <rect width="${w}" height="${h}" fill="${c.ground}"/>
    <rect y="${h * 0.62}" width="${w}" height="${h * 0.38}" fill="${c.figure}" opacity=".92"/>
    <rect y="${h * 0.56}" width="${w}" height="${h * 0.06}" fill="${c.figure}" opacity=".38"/>
    <circle cx="${w * 0.74}" cy="${h * 0.34}" r="${h * 0.085}" fill="${c.figure}" opacity=".55"/>`,

  arches: (w, h, c) => {
    const n = 3, pad = w * 0.1, span = (w - pad * 2) / n;
    let out = `<rect width="${w}" height="${h}" fill="${c.ground}"/>
      <rect x="${pad}" y="${h * 0.18}" width="${w - pad * 2}" height="${h * 0.66}" fill="${c.figure}" opacity=".9"/>`;
    for (let i = 0; i < n; i++) {
      const x = pad + span * i + span * 0.18;
      const aw = span * 0.64;
      const top = h * 0.36;
      out += `<path d="M${x} ${h * 0.84} L${x} ${top} a${aw / 2} ${aw / 2} 0 0 1 ${aw} 0 L${x + aw} ${h * 0.84} Z" fill="${c.ground}"/>`;
    }
    return out;
  },

  stairs: (w, h, c) => {
    let out = `<rect width="${w}" height="${h}" fill="${c.ground}"/>`;
    const steps = 7;
    for (let i = 0; i < steps; i++) {
      const sw = (w * 0.82) / steps;
      const sh = (h * 0.62) / steps;
      out += `<rect x="${w * 0.1 + sw * i}" y="${h * 0.84 - sh * (i + 1)}" width="${sw}" height="${sh * (i + 1)}" fill="${c.figure}" opacity="${(0.35 + i * 0.09).toFixed(2)}"/>`;
    }
    return out;
  },

  columns: (w, h, c) => {
    let out = `<rect width="${w}" height="${h}" fill="${c.ground}"/>`;
    const widths = [0.06, 0.11, 0.04, 0.14, 0.07, 0.09];
    let x = w * 0.09;
    widths.forEach((f, i) => {
      out += `<rect x="${x}" y="${h * (0.14 + (i % 3) * 0.04)}" width="${w * f}" height="${h * (0.72 - (i % 3) * 0.05)}" fill="${c.figure}" opacity="${(0.9 - i * 0.1).toFixed(2)}"/>`;
      x += w * f + w * 0.045;
    });
    return out;
  },

  window: (w, h, c) => `
    <rect width="${w}" height="${h}" fill="${c.figure}" opacity=".92"/>
    <rect x="${w * 0.16}" y="${h * 0.12}" width="${w * 0.34}" height="${h * 0.42}" fill="${c.ground}"/>
    <path d="M${w * 0.16} ${h * 0.54} L${w * 0.5} ${h * 0.54} L${w * 0.86} ${h} L${w * 0.4} ${h} Z" fill="${c.ground}" opacity=".55"/>
    <rect x="${w * 0.33}" y="${h * 0.12}" width="${w * 0.008}" height="${h * 0.42}" fill="${c.figure}" opacity=".8"/>`,

  facade: (w, h, c) => {
    let out = `<rect width="${w}" height="${h}" fill="${c.figure}" opacity=".9"/>`;
    const cols = 5, rows = 7;
    const gx = w * 0.12, gy = h * 0.1;
    const cw = (w - gx * 2) / cols, ch = (h - gy * 2) / rows;
    for (let r = 0; r < rows; r++)
      for (let cI = 0; cI < cols; cI++) {
        if ((r * 7 + cI * 3) % 5 === 0) continue;   /* a few unlit windows */
        out += `<rect x="${gx + cw * cI + cw * 0.16}" y="${gy + ch * r + ch * 0.16}" width="${cw * 0.68}" height="${ch * 0.62}" fill="${c.ground}" opacity="${((r % 3) * 0.15 + 0.55).toFixed(2)}"/>`;
      }
    return out;
  },

  dunes: (w, h, c) => {
    let out = `<rect width="${w}" height="${h}" fill="${c.ground}"/>`;
    for (let i = 0; i < 4; i++) {
      const y = h * (0.42 + i * 0.14);
      out += `<path d="M0 ${y} C ${w * 0.3} ${y - h * 0.11}, ${w * 0.62} ${y + h * 0.09}, ${w} ${y - h * 0.05} L${w} ${h} L0 ${h} Z" fill="${c.figure}" opacity="${(0.22 + i * 0.2).toFixed(2)}"/>`;
    }
    return out;
  },

  shoreline: (w, h, c) => {
    let out = `<rect width="${w}" height="${h}" fill="${c.ground}"/>`;
    const bands = [0.2, 0.06, 0.015, 0.09, 0.03, 0.24];
    let y = h * 0.2;
    bands.forEach((f, i) => {
      out += `<rect y="${y}" width="${w}" height="${h * f}" fill="${c.figure}" opacity="${(0.25 + i * 0.13).toFixed(2)}"/>`;
      y += h * f + h * 0.025;
    });
    return out;
  },
};

function svg({ study, w, h, colour, n }) {
  const c = PALETTE[colour];
  const stamp = Math.round(Math.min(w, h) * 0.022);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img">
  <defs>${grain}</defs>
  ${STUDIES[study](w, h, c)}
  <rect width="${w}" height="${h}" filter="url(#g)" opacity=".055"/>
  <text x="${Math.round(w * 0.045)}" y="${Math.round(h - h * 0.045)}"
        font-family="ui-monospace, SFMono-Regular, Menlo, monospace"
        font-size="${stamp}" letter-spacing="${(stamp * 0.18).toFixed(1)}"
        fill="${c.figure}" opacity=".5">PLACEHOLDER ${String(n).padStart(2, "0")}</text>
</svg>
`;
}

const SHEET = [
  { study: "horizon",   w: 1500, h: 1000, colour: "blue" },
  { study: "arches",    w: 1000, h: 1250, colour: "stone" },
  { study: "stairs",    w: 1500, h: 1000, colour: "terracotta" },
  { study: "columns",   w: 1000, h: 1250, colour: "forest" },
  { study: "window",    w: 1500, h: 1000, colour: "ochre" },
  { study: "facade",    w: 1000, h: 1250, colour: "plum" },
  { study: "dunes",     w: 1500, h: 1000, colour: "stone" },
  { study: "shoreline", w: 1500, h: 1000, colour: "forest" },
];

SHEET.forEach((spec, i) => {
  const n = i + 1;
  const name = `${String(n).padStart(2, "0")}-${spec.study}.svg`;
  writeFileSync(`${DIR}/${name}`, svg({ ...spec, n }));
  console.log(`${name}  ${spec.w}×${spec.h}  ${spec.colour}`);
});
