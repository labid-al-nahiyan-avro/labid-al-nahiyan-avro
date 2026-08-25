/* ---------------------------------------------------------------------------
   about.js — the portrait and the bio.

   Both are visible in the first section, side by side: portrait and contact
   details on the left, this bio on the right. Nothing here is behind a click.
   Three to five short sentences.

   MARKING A PHRASE
   Wrap it in ** ** and it is set bold with an accent underline:

       "a computer science graduate of **BUET**."

   Five marks across the whole bio is the ceiling, and there are five now. They
   are a path through the paragraph for a reader who is skimming it — where you
   work, where you studied, what the work is about, and what you are asking
   for. A paragraph where six things are important has nothing important in it,
   so adding one means taking one out.

   PHOTOGRAPHY LINK
   Wrap a phrase like this to turn it into a link to the photography page:

       "Outside research I'm usually {photography|behind a camera}."

   Before the | is the destination (only "photography" is defined), after it
   is the text a reader sees. While content/photography.js has no albums with
   images, the phrase renders as plain text instead of a dead link — nobody
   gets sent to an empty gallery.
--------------------------------------------------------------------------- */

export const about = {
  /* Square image, 400×400 or larger. Displayed as a circle.
     Leave src blank to hide it. */
  portrait: {
    src: "assets/images/profile/profile2.png",
    alt: "Labid Al Nahiyan",
  },

  bio: [
    "I'm a machine learning engineer at **TigerIT** working on biometric matching R&D, and a computer science graduate of **BUET**. The through-line across my work is **objective design** — the loss functions and metrics that decide what a model is actually optimizing for, and what it quietly stops noticing.",

    "That has meant a size-aware loss for tracking people in dense crowds, a distortion-aware objective for fingerprint matching, and metrics for catching language models refusing things they shouldn't — the last of these accepted to **IEEE DSAA 2026**. I'm applying for **Fall 2027 PhD positions in AI security and applied vision** to keep working on it.",
  ],
};
