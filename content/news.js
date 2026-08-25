/* ---------------------------------------------------------------------------
   news.js — recent activity, newest first.

   A date and one sentence is the whole format. `details` is optional: when
   it is present the item gets a "+" that opens it, and when it is absent the
   item is just a line. Most news should be just a line.

   `date` is displayed as written, so keep the format consistent —
   YYYY.MM sorts and reads well.

   Everything here must be something that actually happened. If you cannot
   point at a paper, a repository, or a date on the CV, leave it out.
--------------------------------------------------------------------------- */

export const news = {
  heading: "News",

  items: [
    {
      date: "2026.08",
      title: "Paper accepted at IEEE DSAA 2026",
      summary:
        "“How Semantically Stable Are LLM Refusals?” is in the proceedings of the 13th IEEE International Conference on Data Science and Advanced Analytics.",
      details:
        "Accepted for Short Presentation. DSAA 2026 is held in New Delhi, India, 6–9 October 2026. The paper is the December 2025 arXiv work under its camera-ready title.",
      link: "https://arxiv.org/abs/2512.01037",
      linkLabel: "Read the paper",
    },
    {
      date: "2025.12",
      title: "First paper on arXiv",
      summary:
        "Co-authored work on semantic confusion in LLM refusals goes up, then titled “When Safety Blocks Sense”.",
      details: "",
      link: "https://arxiv.org/abs/2512.01037",
      linkLabel: "arXiv:2512.01037",
    },
    {
      date: "2025.08",
      title: "Joined TigerIT Bangladesh",
      summary:
        "Machine Learning Engineer (R&D), on the biometric matching team whose submission now sits 5th on NIST MINEX III.",
      details: "",
      link: "",
      linkLabel: "",
    },
    {
      date: "2025.03",
      title: "Completed BSc in CSE at BUET",
      summary:
        "Five years, ending with a thesis on loss design for dense crowd tracking.",
      details: "",
      link: "",
      linkLabel: "",
    },
  ],
};
