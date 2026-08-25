/* ---------------------------------------------------------------------------
   photo.js — photography page entry point.

   The gallery runs horizontally, like the rest of the site, but as an
   ordinary scroller rather than the pinned track used on the homepage:
   photographs are heavy, and a native scroller lets the browser do its own
   work of only painting what is on screen.

   Adding photographs never requires touching this file. Drop the files into
   assets/images/photography/<album>/ and list them in content/photography.js.
--------------------------------------------------------------------------- */

import { h, isFilled, reveal } from "./dom.js";
import { site } from "../../content/site.js";
import { photography } from "../../content/photography.js";
import { createLightbox } from "./lightbox.js";
import { setupReveals } from "./motion.js";
import { setupTheme, themeButton } from "./theme.js";

const mount = document.querySelector("[data-photo]");

document.title = `${photography.title} — ${site.name}`;

/** Accepts either "path/to.jpg" or { src, alt, caption, w, h }. */
function normalize(image) {
  const shot = typeof image === "string" ? { src: image } : { ...image };
  shot.alt = shot.alt || shot.caption || "";
  return shot;
}

const albums = (photography.albums || [])
  .map((album) => ({ ...album, images: (album.images || []).map(normalize) }))
  .filter((album) => album.images.length > 0);

/* Every photograph on the page, in reading order — the viewer walks this. */
const all = albums.flatMap((album) => album.images);

mount.append(
  h(
    "div",
    { class: "frame" },
    h(
      "header",
      { class: "photo-head" },
      /* This page has no header nav, so the theme control rides beside the
         way back rather than being missing here. Same key, same module. */
      h(
        "div",
        { class: "photo-topbar" },
        h(
          "a",
          { class: "photo-back", href: "index.html" },
          h("span", { text: "←" }),
          "Back to the portfolio"
        ),
        themeButton()
      ),
      h("h1", { class: "photo-head__title", text: photography.title }),
      isFilled(photography.intro) && h("p", { class: "lede", text: photography.intro })
    )
  )
);

if (!albums.length) {
  mount.append(
    h(
      "div",
      { class: "frame" },
      h(
        "div",
        { class: "photo-empty" },
        h("p", { text: "No photographs here yet." }),
        h(
          "p",
          { style: "margin-top:0.75rem" },
          "Add them by dropping files into ",
          h("code", { text: "assets/images/photography/<album>/" }),
          " and listing the album in ",
          h("code", { text: "content/photography.js" }),
          "."
        )
      )
    )
  );
} else {
  const lightbox = createLightbox();
  let cursor = 0;

  for (const album of albums) {
    const gallery = h("div", { class: "gallery" });

    album.images.forEach((shot, i) => {
      const position = cursor++;

      const figure = h(
        "button",
        {
          class: "shot",
          type: "button",
          "aria-label": shot.alt ? `Open photograph: ${shot.alt}` : "Open photograph",
        },
        h("img", {
          src: shot.src,
          alt: shot.alt,
          loading: i === 0 ? "eager" : "lazy",
          decoding: "async",
          ...(shot.w && shot.h ? { width: shot.w, height: shot.h } : {}),
        }),
        isFilled(shot.caption)
          ? h("span", { class: "shot__caption", text: shot.caption })
          : null
      );

      figure.addEventListener("click", () => lightbox.open(all, position, figure));
      gallery.append(figure);
    });

    mount.append(
      reveal(
        h(
          "section",
          { class: "album" },
          h(
            "div",
            { class: "frame" },
            h(
              "div",
              { class: "album__head" },
              h(
                "h2",
                { class: "album__title" },
                album.title || "",
                /* Said plainly on the page, not only in the source: a
                   generated stand-in must never read as somebody's work. */
                album.placeholder
                  ? h("span", { class: "album__flag", text: "Placeholder" })
                  : null
              ),
              h("p", {
                class: "album__count",
                text: `${album.images.length} photograph${album.images.length === 1 ? "" : "s"}  ·  scroll →`,
              })
            ),
            isFilled(album.description)
              ? h("p", { class: "album__desc", text: album.description })
              : null
          ),
          h("div", { class: "frame" }, gallery)
        )
      )
    );
  }
}

setupTheme(document.querySelector("[data-theme-btn]"));
setupReveals();
