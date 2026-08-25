/* ---------------------------------------------------------------------------
   site.js — identity, navigation, and what the browser tab says.

   The deck is seven sections wide. `nav` below is the whole of it: the
   navigation, the section order, and the NEXT / PREVIOUS targets all come
   from this one array.

   There is deliberately no Contact section — contact details live in the
   profile column of the first section, in full, where they are read first.
--------------------------------------------------------------------------- */

export const site = {
  name: "Labid Al Nahiyan",

  /* Under the name in the profile column. */
  roles: ["ML Engineer @ TigerIT LTD"],

  /* The research areas listed under the roles. Keep to three or four. */
  focus: ["Machine learning", "Computer vision", "Security"],

  location: "Dhaka, Bangladesh",

  /* The PhD line, shown at the end of the bio. */
  availability: {
    show: true,
    text: "Open to Fall 2027 PhD opportunities",
  },

  /* The deck, in order. `top` is the profile section. */
  nav: [
    { id: "top", label: "About me" },
    { id: "news", label: "News" },
    { id: "research", label: "Research" },
    { id: "projects", label: "Projects" },
    { id: "experience", label: "Experience" },
    { id: "education", label: "Education" },
    { id: "skills", label: "Skills" },
  ],

  /* The short full-screen opening, shown once per browsing session. About
     1.2 seconds: name, role, a rule, then the panels part and the portfolio
     is already there underneath.

     Its timing is a design decision rather than content, so the schedule
     lives in one place — site.css §4 — where the beats can be read in order.
     Setting this to false removes the opening entirely. */
  /* OFF for this audience. The opening is 1.2s of animation before any
     content, and the reader this site is built for is on their fortieth
     application of the evening. It is intact and one flag from returning. */
  intro: {
    enabled: false,
  },

  /* The ambient background: a still lattice of points, disturbed only where
     the cursor is. Set false to remove it entirely — nothing else needs
     editing. How strongly it draws is `--ambient-k` in tokens.css, currently
     0.5; that is a design value rather than content, so it lives there. */
  ambient: {
    enabled: true,
  },

  /* <title> and <meta name="description"> */
  meta: {
    title: "Labid Al Nahiyan — ML / AI researcher",
    description:
      "Labid Al Nahiyan works on the security and reliability of machine learning systems — biometric matching and LLM evaluation. Author on an IEEE DSAA 2026 paper. Applying for Fall 2027 PhD positions in AI security and applied vision.",
  },
};
