/* ---------------------------------------------------------------------------
   skills.js — grouped, and deliberately short.

   Only list things that appear somewhere else on this site. A tool nobody can
   see you use is noise, and a long list reads as less credible, not more.
--------------------------------------------------------------------------- */

export const skills = {
  heading: "Skills",

  /* Only what appears in an artifact on this page. The web and general
     tooling groups were cut — see content/_archive.js for the scoring. A
     skills list that includes React beside a research statement argues the
     applicant is leaving for industry. */
  groups: [
    {
      group: "Languages",
      items: ["Python", "C++", "C"],
    },
    {
      group: "ML / AI",
      items: [
        "PyTorch",
        "Distributed training (DDP)",
        "CUDA",
        "OpenCV",
        "RAG systems",
      ],
    },
    {
      group: "Systems",
      items: ["Flex / Bison", "Docker", "Linux"],
    },
  ],
};
