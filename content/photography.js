/* ---------------------------------------------------------------------------
   photography.js — the photography page.

   HOW TO ADD PHOTOGRAPHS
   1. Make a folder:  assets/images/photography/<album-name>/
   2. Drop your files in it.
   3. Add an album below, listing the files in the order you want them shown.

   An image can be written two ways:

       "assets/images/photography/dhaka/01.jpg"

   or, when you want a caption or want to prevent layout shift:

       { src: "assets/images/photography/dhaka/01.jpg",
         alt: "Rickshaws waiting out the rain",   // describes the photo
         caption: "Karwan Bazar",                 // optional, shown under it
         w: 1600, h: 1067 }                       // optional but recommended

   The first photograph of an album runs wide; the rest flow in two columns.
   Everything below the fold loads lazily and the viewer only fetches a
   full-size image when you open it.

   THE PLACEHOLDER ALBUM
   The album below is not photography. It is eight generated studies, each
   stamped PLACEHOLDER, standing in so the page can be laid out and judged
   before real photographs exist. `placeholder: true` puts a plain label on
   the album saying so, so nobody can mistake them for your work.

   To replace it: add your own album, then delete the placeholder entry and
   the folder assets/images/photography/placeholder/. Nothing else refers to
   it. The generator that made the files is kept beside them as _generate.mjs.
--------------------------------------------------------------------------- */

export const photography = {
  title: "Photography",

  intro:
    "The same habit as the rest of this site, running slower: deciding what is worth keeping in frame.",

  albums: [
    {
      id: "placeholder",
      title: "Studies",
      placeholder: true,
      description:
        "Standing in until the real photographs are here — these are generated, not photographed.",
      images: [
        { src: "assets/images/photography/placeholder/01-horizon.svg", alt: "Placeholder study: a low horizon in muted blue", caption: "Horizon", w: 1500, h: 1000 },
        { src: "assets/images/photography/placeholder/02-arches.svg", alt: "Placeholder study: three arches cut from a wall", caption: "Arches", w: 1000, h: 1250 },
        { src: "assets/images/photography/placeholder/03-stairs.svg", alt: "Placeholder study: a flight of steps in terracotta", caption: "Steps", w: 1500, h: 1000 },
        { src: "assets/images/photography/placeholder/04-columns.svg", alt: "Placeholder study: uneven columns in forest green", caption: "Columns", w: 1000, h: 1250 },
        { src: "assets/images/photography/placeholder/05-window.svg", alt: "Placeholder study: light thrown across a floor from a window", caption: "Light", w: 1500, h: 1000 },
        { src: "assets/images/photography/placeholder/06-facade.svg", alt: "Placeholder study: a grid of lit and unlit windows", caption: "Facade", w: 1000, h: 1250 },
        { src: "assets/images/photography/placeholder/07-dunes.svg", alt: "Placeholder study: layered curves in warm stone", caption: "Dunes", w: 1500, h: 1000 },
        { src: "assets/images/photography/placeholder/08-shoreline.svg", alt: "Placeholder study: horizontal bands of green", caption: "Shoreline", w: 1500, h: 1000 },
      ],
    },

    // {
    //   id: "dhaka",
    //   title: "Dhaka",
    //   description: "Walking the same three streets until they looked different.",
    //   images: [
    //     { src: "assets/images/photography/dhaka/01.jpg", alt: "…", caption: "…" },
    //     "assets/images/photography/dhaka/02.jpg",
    //     "assets/images/photography/dhaka/03.jpg",
    //   ],
    // },
  ],
};
