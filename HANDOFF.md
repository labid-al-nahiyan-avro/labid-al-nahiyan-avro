# Portfolio — handoff

An **academic CV / research portfolio**, positioned for Fall 2027 PhD
applications. The old `data.txt` + `app.js` site is archived in `_legacy/` and
is not loaded by anything.

Plain **static HTML/CSS/JS, ES modules, no build step, no dependencies**. All
wording and data live in `content/`; the JavaScript in `assets/js/` only knows
how to lay it out.

## The layout — read this first

```
one column, centred, scrolling vertically like a page
a sticky bar across the top of it
```

That is the whole model, and it is the third one this site has had. Before it
was a **fixed identity rail** — a 19rem column down the left holding the
portrait, the name, the contacts and the whole navigation, on screen for the
entire visit. Before that, a **horizontal deck** of seven viewport-wide panes
with its own wheel forwarding and a wrap from the last section to the first.

### Why the rail went

The argument for it was real: a reader assessing an application never had to go
looking for the email address. The arguments against it, all three of which
won:

- **Almost nothing in academia is laid out that way.** A committee member
  opening the page had to learn the layout before reading it, which is a cost
  paid on the one page that should cost nothing.
- **It spent a sixth of the window on identity, permanently** — and the page it
  framed had to live in what was left.
- **Identity is met once.** A name, a face and five links are things you read at
  the top and then stop needing. Pinning them for the whole visit solved a
  problem nobody had.

The identity is in the hero now, at full size, and the navigation is a 3.25rem
bar that stays. Nothing became harder to reach: the CV is a labelled button in
the first viewport and the profiles are icon buttons beside it.

### Rules this model imposes

- **The bar and the content share one container**, `--frame` (66rem). `About me`
  in the bar sits directly above the name in the hero, and every section heading
  lines up under the first nav link. That alignment is the only one on the page
  — changing one container without the other breaks it and nothing will look
  obviously wrong, just slightly off.
- **Sections carry `scroll-margin-top: calc(3.25rem + 1rem)`.** Without it, a
  jump from the nav parks the heading underneath the bar that was used to reach
  it. If the bar's height changes, this changes with it.
- **The bar is translucent, not opaque** — 78% plus a 10px blur. It scrolls over
  content and over the ambient lattice, and a solid band cuts the page in half
  every time it crosses something.
- **Below 860px the links fold** into a panel behind a Menu button, and the
  portrait becomes a 9rem circle above the text rather than a column beside it.
- **The hero has no section header.** `section()` takes `bare: true`, which drops
  the numbered eyebrow and the `<h2>`; `01 / About me` above a 56px name is a
  label on top of a label. The `aria-label` on the `<section>` still names it, so
  it is not an unlabelled landmark.
- **Sections are separated by a hairline, not a screen.** `.section + .section
  { border-top }`. Nothing is a fixed height and nothing snaps.
- **The ambient ground is decoration.** `pointer-events: none`, and it must never
  get a z-index that puts it over content. It is `-1`, and `0` is not the same
  thing — see the ambient section.

### The trap in the scroll-spy, which the suite caught

The observer's trip-wire sits at 30–40% of the viewport height. Once the page
is scrolled to the very bottom it stops moving, and if the final section is
shorter than that offset **the band is still parked over the section above
it** — so Skills could never become current no matter how far you scrolled.
The suite reported `06 Education` at max scroll.

Bottom-of-page is therefore reported directly, *and* checked inside the
observer callback. Both are needed: the observer fires after the scroll
handler, so without the check inside it, it reports the band's answer straight
back over the correction.


## What is on the site, and what was cut

The site is aimed at **one reader**: a professor assessing a Fall 2027 PhD
application in **AI security** and **biometrics / applied vision**. Every item
was scored 1–100 against that single goal and anything under 70 was cut.

The bar exists because a portfolio is read in about thirty seconds, and every
weak item spends attention a strong one needed. Four excellent things read as
excellent; four excellent things plus six average ones read as average.

**Nothing was deleted.** Everything cut lives in `content/_archive.js` with its
score and the reasoning, and nothing imports that file. Move an entry back if a
different situation calls for it — a job application weighs the full-stack work
very differently.

**Three entries have already made that trip back.** Shop Genie, BABO and
NerdHerd were cut at 45/40/20 and are live again in `content/projects.js`. The
scores were right for a three-item section and wrong for a seven-item one: a
Projects section holding only what is on-thesis reads as someone with three
artifacts, not as someone with focus. The reasoning that cut them is kept in
`_archive.js` because it is the reasoning that would cut them again from a
shorter section.

| cut | score | why, in one line |
|---|---|---|
| Skills → Engineering | 20 | a full-stack group beside a research statement reads as "will leave for industry" |
| Intellesphere.AI | 25 | three months of frontend beside NIST-ranked R&D reads as divided attention |
| Notre Dame HSC | 35 | no committee reads past the bachelor's |
| Docker · Linux · Git | 45 | every applicant has them; listing them says nothing |
| Programming contest | 50 | the Projects section carries coding ability with actual repositories |
| Hackathon win | 55 | real, but reads undergraduate and competes with the NIST result |
| **PoisonGate** | **0** | **scored zero because it does not exist yet, not because it does not matter** |

**PoisonGate is the highest-value thing that could be added.** AI security is
half the stated direction and currently has no artifact behind it — the
DSAA paper is the only thing carrying that side. A finished PoisonGate would
score in the 90s.

### SREGym is deliberately absent

The current GitHub account has a fork of `SREGym/SREGym`. **The GitHub API shows
zero commits from this account**, which was checked before it went anywhere near
the site. Forking a lab's repository to read it is completely normal; presenting
it as work is not, and a professor who clicks through finds an empty commit
history. It goes on the site the day there are merged contributions to point
at.

### The NIST claim, and how it is worded

The MINEX III ranking is a **team** submission and the submission itself was
handled by colleagues; the role here is data preparation and model training.
The site says exactly that, in the Experience entry and in the `from:` note in
`content/overview.js`. NIST publishes these results, so the claim is checkable in a
minute — which is precisely why it must stay exact. An overstated number on a
public benchmark is the fastest way to lose a committee.

## Section 01 is an ordinary About page, and that was deliberate

```
● OPEN TO FALL 2027 PHD OPPORTUNITIES     the ask, first
one sentence on what you work on          the positioning
two paragraphs of bio                     who you are
```

Section 01 **is** the hero: name, role, availability line, one sentence, the
bio, then the CV button and the profile icons, with the portrait beside all of
it. That is the shape of an academic homepage, and it is the shape a professor
opening this page is expecting to find. It has no section header of its own —
see `bare: true` in the layout notes above.

### What used to be here, and why it is off

The top of the section carried an **overview written for a reader who will not
scroll**: four figures — `5th NIST MINEX III · −41% FNMR · 1 IEEE paper ·
3.62/4.00` — and three lines that each jumped to the section proving them.

The reasoning was sound and the result was wrong. A row of large figures over a
bulleted list of achievements with jump links is a **KPI strip and a feature
list** — the top of a product landing page. Nobody's academic page looks like
that, and the reader it was built for is exactly the reader who would notice.

It is behind `overview.show` in `content/overview.js`, currently `false`, with
the argument for turning it back on written beside the flag. `statement` is
still live; only `facts` and `highlights` are gated.

**Nothing became unreachable when it went off.** Every figure in it restated
something further down the page — that was the rule for the file, and it is now
the argument against the block:

| figure | where it actually lives |
|---|---|
| 5th NIST MINEX III | Experience → TigerIT → first bullet |
| −41% FNMR | Experience → TigerIT → the metric chart |
| 1 IEEE paper | Research → Publications, and the News entry |
| 3.62 / 4.00 | Education → BUET |

**The rule survives the block, in case it returns.** Every figure in
`content/overview.js` must already be true somewhere else in `/content`, each
entry carries a `from:` field naming its source, and it stops being an overview
at five. The `from:` field is never rendered; it exists so the next person can
check. A number a committee cannot verify is worse than no number.

**The availability line leads the section, and that placement was measured.**
It used to close the bio, where it fell **below the fold at 1440×900 and
1280×800** — the single most important sentence on the site, reachable only by
scrolling.

## The list is the unit

News, research, work, experience and education are all the same shape: an
editorial list of rows separated by hairlines — number or date, title, one
line, then a row of coloured tags — with a `+` where there is more.

**They are cards now**, and that reverses the rule the site was built on. Every
list used to be hairline-separated rows with no box, no radius and no fill, on
the argument that cards are what make a portfolio look like every other
portfolio. That was asked to change.

Three things are kept from the old argument, and they are what stops a page of
cards reading as a dashboard:

- **No shadow, ever.** Depth is a 1px border and a barely-tinted fill.
- **The card is quieter than the tags inside it.** The tag used to be the only
  bordered component, and it has to survive being put inside a border — so the
  card's border sits at `--rule-2` and its fill at 45% of `--paper-2`, both
  well under the tag's 58% border and 10% bed. Verified: tags still resolve to
  a 1px border and 7px radius against the card.
- **One hover, not four.** The border takes the accent, the fill lifts to 5%,
  and the card rises 2px. Nothing else moves.

An expandable card uses `:has(.row__head:hover)` so the whole box lights up
rather than just the summary. Without `:has()` support the card simply does not
light — a degradation, not a break.

Spacing follows one rule: **big space between sections, small space between
items inside one.** A list of research should read as a list, not as five
things that happen to share a screen.

### How wide the column is

**Every section is 60% of the viewport, centred — Home included.** It is
written that way in `site.css` §5 so the number in the rule is the number on
screen:

```css
max-width: min(max(calc(60vw + var(--gutter) * 2), 34rem), var(--frame));
```

Both bounds earn their place, and removing either breaks a real screen. The
**34rem floor** stops a phone being told to use 60% of 390px, which would
leave a 230px column with 80px of nothing on each side. The **`--frame`
ceiling** stops the line length running away on a large monitor. Measured:
60% from about 800 through 1950, 78% at 620, 86% at 390.

Home used to run to `--frame` — about 74% — which made the deck look like it
changed its margin the moment you left the first screen. It is now on the same
rule as everything else.

**Widening or narrowing this column does not change a line of prose much.**
The text keeps its own tighter caps — `--measure` 66ch, a row description
64ch, a title 40ch — all inside the 45–75ch band. The column width mostly
decides where the hairlines end and where the `+` and `→` marks sit.

**The masthead stacks below 1100px**, and that number is derived, not guessed:
two columns need 15.25rem for the contact list, a 2rem gutter, and about 36ch
of bio beside it — roughly 656px of content, which at 60% of the viewport
arrives at about 1100px. Squeezing the profile column narrower than 15.25rem
is what made the email address wrap to `labid.nahiyan12@gma / il.com`.

## What is on the page, and what is behind a `+`

Visible always: the bio, the contact details in full, the research direction,
the PhD availability, every project's description, each item's title and one
line, **and its tags** — a job's stack was moved out from behind the `+` and
onto the row, because the stack is what a reader is scanning a job for.

Behind a `+`: the long-form detail — problem / approach / contribution /
results for research, bullets and the chart for a job, thesis and coursework
for a degree. That is depth on request, not information hidden from view.
Everything remains reachable by find-on-page, and printing expands it all.

### The Ongoing list, and what is in it

Two entries, both team work, neither claiming a result:

- **Agentic security: trajectory behavioural motif analysis.** Mining trajectory
  data from agentic systems for behavioural motifs that separate a compromised
  run from an ordinary one — a description of what an attack *looks like*,
  rather than a signature for the exploit that caused it. It leads the section
  because it is the one piece of live work pointing at the AI-security half of
  the stated direction.
- **Distortion-robust objectives for fingerprint matching.** The R&D line at
  TigerIT, stated as the research question inside the job rather than as the
  job.

`details.results` is blank on both and stays blank until there is a number.

### Research is two lists: Completed and Ongoing

`content/research.js` carries a `groups` array — **`ongoing` then `done`** — and
every item names which one it belongs to with `status`. `render.js` sorts them
and draws a mono eyebrow, a count and a hairline between the two.

**Ongoing leads.** What is running now answers "what would this person do
next", which is what a committee is reading for; what is finished is the
evidence underneath it. Reversing the two entries in `groups` puts Completed
back on top and needs no other edit.

Three rules hold this together:

- **Numbering is global, and it follows `items`, not `groups`.** A card's
  number comes from its index in `research.items`. So the array has to be kept
  in PAGE order — ongoing entries first, matching the group order above — or
  the numbers run 03, 01 down the section. That is the one thing to remember
  when adding an item: put it in the array where it should appear on the page,
  not at the end.
- **An empty group does not render, heading included.** Emptying `ongoing`
  leaves no promise on the page the section cannot keep.
- **Ongoing claims no results.** `details.results` stays blank until a number
  exists — the same rule as everywhere else on this site, and the reason the
  ongoing card renders as problem / approach / contribution and nothing more.

Each card also carries a **status pill** above its title — ACCEPTED, DEFENDED,
IN PROGRESS — from `item.stage`. It sits above the title rather than beside it
because a reader scanning the list is answering *is this finished?* before they
read what the thing is. It has two states and deliberately **not** two hues:
`done` is a filled accent chip, `ongoing` is an unfilled dashed grey one. The
site already colours by field via `content/tags.js`; a second colour system
fighting the tags is how a page starts looking like a dashboard.

**`details.venue` is the first field behind the `+`**, before problem. One card
should answer every question about where a piece of work landed — conference,
track, city, dates, and the earlier title if it was renamed — so nobody has to
go looking elsewhere on the page for it.

### The paper was renamed, and the site uses one name

The December 2025 arXiv posting is titled *When Safety Blocks Sense: Measuring
Semantic Confusion in LLM Refusals*. The accepted version is *How Semantically
Stable Are LLM Refusals? Measuring Confusion in Local Safety Boundaries*
(IEEE DSAA 2026, New Delhi, 6–9 Oct 2026, Short Presentation). **The site uses
the camera-ready title everywhere** — an applicant with two names for one paper
reads as two half-papers. The old title survives in exactly two places, both
deliberate: `research.js → details.venue`, and the December entry in `news.js`,
so a reader arriving from the arXiv posting can see it is the same work.

There is **no preprint section and no preprint label** anywhere. It is an
accepted IEEE paper now; the arXiv link is how you read it, not what it is.

Moving between sections is done by the fixed edge controls, the numbered
header nav, or the arrow keys. Sections carry no controls of their own.

**Wrapping.** On the last section NEXT becomes `↻ START` and returns to Home;
PREVIOUS is hidden on Home. Scrolling back would fly through every section in
between, so the deck is moved instantly behind a short veil — fade out, jump,
fade in, about 560ms. No rotation, no perspective, no carousel.

One trap worth remembering: **`behavior: "auto"` in `scrollTo` means "use the
CSS value"**, and the deck's CSS is `scroll-behavior: smooth`. Asking for auto
therefore animated the whole width of the deck — the one thing the wrap must
not do. `wrapTo` now suspends the CSS property for the length of the jump and
passes `behavior: "instant"`.

## File map

```
index.html              page shell + the opening card
photography.html        the gallery (not linked from the nav — see below)

content/                ← EDIT THESE. No HTML, no CSS, no components.
├── site.js             name, roles, focus, availability, nav, <title>
├── links.js            email / GitHub / LinkedIn / arXiv / Scholar / ORCID / CV
├── about.js            portrait + bio
├── news.js             recent activity, newest first
├── research.js         interests, statement, groups, items, direction,
│                    publications. Items are split Completed / Ongoing by
│                    their `status` field — see below.
├── experience.js       jobs, bullets, and the metric chart
├── projects.js         the Projects section — every card links to a repo
├── skills.js           grouped tools
├── overview.js         the one-sentence statement above the bio, plus the
│                    figures block that is off behind `show: false`.
├── tags.js             which colour a category, field or tool is drawn in
├── education.js        degrees, thesis, coursework
├── honors.js           awards
└── photography.js      albums and their photographs

assets/
├── css/tokens.css      colour, type, space, motion — the control panel
├── css/_palette.mjs    generates the colour values; `node` it, don't hand-edit
├── css/site.css        everything else
├── js/dom.js           tiny element builder
├── js/nav.js           scroll-spy + smooth scroll  ← read the header comment
├── js/ambient.js       the quiet layer behind the page
├── js/_deck.legacy.js  the old horizontal deck. Nothing imports it.
├── js/render.js        builds the top bar, the hero and every section
├── js/main.js          homepage entry point
├── js/photo.js         photography page entry point
├── js/intro.js         the one-time opening card
├── js/theme.js         light / dark, and the control's markup
├── js/motion.js        scroll reveals (photography page only)
├── js/lightbox.js      photograph viewer
├── cv.pdf              what the CV link serves
└── images/
    ├── profile/        portrait
    ├── projects/       project images (the work list is text — see below)
    └── photography/    one folder per album
        └── placeholder/  generated stand-ins + the script that made them
```

Images live in `assets/images/`, not `public/images/` — there is no build step,
so there is no `public/` convention to honour. The three subfolders are the
ones you asked for.

## Everyday edits

| Want to change | Open |
|---|---|
| Roles, focus line, PhD status | `content/site.js` |
| The bio | `content/about.js` |
| The sentence above the bio | `content/overview.js` |
| Add or remove a project | `content/projects.js` |
| Recover something that was cut | `content/_archive.js` |
| Add a research item | `content/research.js` |
| Add a news item | `content/news.js` |
| A social link, or hide one (leave it `""`) | `content/links.js` |
| Which colour a category or tool gets | `content/tags.js` |
| Colours, fonts, spacing | `assets/css/tokens.css` |
| A field colour, or the palette itself | `assets/css/_palette.mjs`, then re-run it |

Adding an item makes its section taller. Nothing else needs adjusting.

To add or reorder sections, edit `site.nav` — it drives the navigation, the
section order, and the pager targets together. A new id also needs an entry in
the `SECTIONS` map at the bottom of `render.js`.

## Photography

Deliberately **not** in the navigation. The only route in is a phrase in the
second bio paragraph in `content/about.js`:

```
"Outside research I'm usually {photography|behind a camera}, or watching anime."
```

`{photography|text}` becomes a link to `photography.html` — quiet, underlined
in rule colour rather than accent, with a small arrow that steps sideways on
hover. Finding it should feel earned. The page carries its own empty state, so
the link is unconditional; the direct URL always works.

The gallery itself is a horizontal scroller with snap points — visually in
keeping with the deck, but an ordinary one, because photographs are heavy and
a native scroller lets the browser skip painting what is off screen.

### The placeholder album

The page currently shows **eight generated studies, not photographs** — flat
duotone architectural forms in the site's own palette, so the gallery can be
laid out and judged before real photographs exist. Every one carries a
`PLACEHOLDER nn` stamp in the image itself, and `placeholder: true` on the
album prints a plain **Placeholder** label beside its title. A stand-in that
could be read as somebody's work is worse than an empty page.

To get rid of them: delete the `placeholder` album from
`content/photography.js` and the folder `assets/images/photography/placeholder/`.
Nothing else refers to either. The generator is kept beside the files as
`_generate.mjs` (`node _generate.mjs`) so the set can be regenerated or
extended rather than reverse-engineered.

**There are no project or research images anywhere, by design.** Work and
research are editorial lists — number, title, one line, field — and adding
pictures to them would turn them back into the cards this site is built to
avoid. `assets/images/projects/` stands empty for that reason, and the `image`
field in `content/projects.js` is unused.

To add an album:

1. `mkdir assets/images/photography/dhaka/` and drop the files in.
2. Add the album to `content/photography.js`.

Images may be plain path strings or objects with `alt`, `caption`, `w`, `h`.
**Supply `w`/`h`** — without them the row reflows as images arrive. Everything
past the first is lazy-loaded, and the viewer only fetches a full-size image on
demand. The viewer supports arrow keys, Escape, swipe, focus trapping, and
returns focus to the thumbnail on close.

## Design system

- **Two themes, one palette.** See *Light and dark* below. Neither is an
  afterthought: the dark values are generated from the same constants as the
  light ones, not eyeballed afterwards.
- **Where the colour comes from.** This is the part to understand before
  changing any of it, because it is a claim rather than a taste.

  The subject of this site is measurement — loss functions, evaluation
  metrics, confusion matrices. The instrument of that field is the
  perceptually-uniform colormap: viridis, magma, cividis, the scales built so
  that equal steps in the data are equal steps in perceived colour. The
  palette is built the same way. **Six hues spaced evenly 60° apart in OKLCH,
  plus one deliberate near-neutral, every one of them pinned to the same
  lightness** — L=0.520 on light, L=0.785 on dark — with chroma clamped to
  whatever sRGB can actually show there.

  The constraint buys the property: **no field on this page is louder than any
  other field.** Measured in the browser, the seven families land between
  5.11:1 and 5.78:1 on the light theme (spread **0.67**) and 8.26:1 to 9.14:1
  on the dark (spread **0.88**). That is the whole idea, and it is the thing a
  hand-edited hex quietly destroys.

  | family | light | dark | | covers |
  |---|---|---|---|---|
  | research | `#2a7c32` | `#81cf84` | 145° green | fields, safety, evaluation |
  | vision | `#007781` | `#1fd0e0` | 205° teal | vision, detection, tracking |
  | web | `#4264b6` | `#97b8ff` | 265° blue | application engineering, data |
  | ml | `#8f4a93` | `#e39be7` | 325° magenta | models, training, losses |
  | security | `#a9433f` | `#ff9890` | 25° red | AI / computer security |
  | infra | `#896100` | `#e4af4d` | 80° amber | CUDA, Docker, Linux, Git |
  | systems | `#626975` | `#b2b9c6` | 262° neutral | languages, compilers |

  `systems` is the near-neutral on purpose. It is the fallback, it carries the
  programming languages, and about a third of every tag on the site is drawn
  in it — it is what stops six saturated hues reading as confetti.

  **Regenerate, do not hand-edit:** `node assets/css/_palette.mjs` prints the
  values and a contrast table for both themes. Change a hue or a lightness
  constant in that file and re-run. Editing a hex in `tokens.css` to taste is
  how the equal-weight property disappears with nothing to show it.
- **One hue wheel, used twice.** Section accents are drawn from the same six
  hues and the same neutral, so the page never introduces a colour the reader
  has not already been taught. A section's accent says *where you are*; a tag's
  family says *what something is*.

  | | section | accent |
  |---|---|---|
  | 01 | profile | neutral |
  | 02 | news | magenta |
  | 03 | research | green |
  | 04 | work | red |
  | 05 | experience | blue |
  | 06 | education | amber |
  | 07 | skills | teal |

  Every component reads `var(--accent)` and knows nothing else about colour;
  sections rebind it for their own subtree in `site.css` §5, and `main.js`
  copies the active one onto `<html>` so the header nav and the edge bands
  follow. **The paper does not change between sections** — the colour lives in
  the marks and the ground holds still.
- Three files, three jobs, and no colour is ever named in JavaScript: **values**
  in `tokens.css`, **vocabulary** (which word lands in which family) in
  `content/tags.js`, **lookup** in `render.js`, which writes `data-family` onto
  the element for the stylesheet to bind.
- The availability marker stays the research green in every section — that
  line means one thing and should always look the same.
- **The portrait is the only photographic thing on the page.** The palette
  around it is chosen to frame it: the tags are outlines with a ~10% bed,
  never fills.

- **Type: one family, five weights.** Manrope, variable 400..800, and nothing
  else. The three-voice stack it replaced — Space Grotesk for structure,
  Literata for reading, IBM Plex Mono for data — is gone by request.

  | weight | job |
  |---|---|
  | 400 | body, descriptions, bio |
  | 500 | metadata, navigation, contact |
  | 600 | item and project titles, tags |
  | 700 | section titles |
  | 800 | the name, and nothing else |

  **What was traded.** The mono voice is gone, so labels and tags no longer
  carry the fixed-width texture that separated them from prose at a glance.
  That job is now done by letter-spacing (`--tracking-mono: 0.1em`, applied to
  the same elements the mono used to cover) and by colour. Digits are held in
  line with `font-variant-numeric: tabular-nums` where they must align, because
  Manrope's proportional figures will not do it alone.

  The three token names are kept and all three point at the same stack, so
  re-splitting is one edit if the mono is ever missed.

  **Headings carry the hierarchy now.** They were 21px and 26px, which read as
  slightly-larger body text. They then went too far the other way. Current, at
  1440: section title **32px/700**, item title **21px/600**, the name
  **32px/800**, body **17px/400**, bio and statements **18px/400**, tags and nav
  11–12px/500–600.

  **The two heading sizes move together**, because the step between "where am
  I" and "what is this" is a ratio, not a gap. 32/21 holds what 44/26 held.
  Shrink one alone and the other reads wrong.

  **The section head is two lines, not one.** `03 / RESEARCH` set small was
  acting as both index and title and succeeding as neither — it read as
  metadata, so a reader scanning had nothing to catch. The number is now a
  small eyebrow and the name is an actual `<h2>`. The slash went with the
  change: it used to separate number from name, and once the name moved down
  it separated nothing.
- **Running prose is justified, and words are never broken.** One rule in
  `site.css` §2: `text-align: justify` with `hyphens: none`. `none` rather
  than the `manual` default, so the intent is stated and a stray `&shy;`
  pasted into content cannot reintroduce a break.

  **This is a deliberate trade, and it costs something measurable.**
  Justification stretches the spaces on a line; without hyphenation, a long
  word that will not fit moves down whole and leaves the line above it to
  spread. Measured across all justified prose, against a natural space of
  4.78px:

  | viewport | median gap | 95th percentile | worst |
  |---|---|---|---|
  | 1440 | 5.69px (1.2×) | 10.6px (2.2×) | 12.8px (2.7×) |
  | 1024 | 7.28px (1.5×) | 12.8px (2.7×) | 31.4px (6.6×) |
  | 390 | 7.94px (1.7×) | 18.8px (3.9×) | 33.4px (7.0×) |

  Comfortable on a desktop, loose on a phone, with the occasional wide line.
  If the gaps ever look worse than the breaks would have, the lever is
  `hyphens: auto` on that one rule — not a change to the alignment.

  Verified at nine widths from 390 to 1728: **zero mid-word breaks.** Ten
  breaks were found and all ten fall on a hyphen the word already contains —
  `distortion-aware`, `token-level`, `10,000-prompt`. No character is
  inserted; that is ordinary English line-breaking, not hyphenation. If even
  those should stop, the fix is a non-breaking hyphen (U+2011) in the content,
  and the cost is that find-on-page and copy-paste stop matching a plain `-`.

  Prose only: 37 elements. Titles, labels, metadata, mono, tags and citations
  stay ranged left. A single-line paragraph looks unchanged either way, since
  the last line of a block is never justified — which is also why a two-line
  paragraph justifies its first line and leaves the second ragged.

- **No cards anywhere.** Hierarchy comes from typography, hairlines, spacing,
  alignment and — now — colour. The tag is the only component on the site with
  a border, and that is what lets it carry the weight: if projects and research
  also sat in boxes, an outlined tag would be one box inside another and would
  stop meaning anything. Keep the structure editorial and the tags will keep
  working. The portrait is a 4:5 rectangle with a 4px radius — an editorial
  portrait, not an avatar. It is sized independently of its column: the column
  is as wide as the longest contact URL, the photo is narrower.
- **Section labels read `03 / RESEARCH`** with an accent rule under them that
  draws itself open as the section arrives. The number is accent at 500, the
  slash is the accent at 45%, the name is `--ink-2`, and the rule is the one
  place any colour appears at full strength — which is what makes it read as a
  heading mark rather than as decoration.
- **Three kinds of lead column**, set by `data-kind` on `.row__lead`. A `num`
  is an index: accent, tabular, quiet. A `date` is a label you navigate by, so
  it gets an outlined chip in the section accent — News and Experience are
  scanned by date, and that is the whole reason for the difference. `mark` is
  for a word like THESIS.
- **Order inside a row is fixed and means something**: title, sentence, grey
  metadata, tags last. The tags are the most saturated thing in the row, so
  they anchor the bottom instead of competing with the title for first glance.
- **Roughly 60/30/10.** Neutral body text, then accent on metadata and
  controls, then the few places colour goes to full strength: section rules,
  the availability marker, an active nav item. If the page starts to feel loud,
  turn down `--tag-bed` and `--tag-line` in `tokens.css` before removing any
  colour — every tinted thing on the site reads from those two.
- **Hovering a row moves four things a little, and nothing a lot**: the title
  and its lead take the accent, the title steps 3px right, the `+` or `→`
  brightens and steps with it, and the hairline *under* the row takes 45% of
  the accent. That last one is the quietest of the four and the only one that
  says *which row you are on* rather than what will happen if you click.
- **The opening sets its own type against the site's**: the name in Newsreader
  at up to 3.5rem, the roles under it in Martian Mono at 11px, tracked out and
  uppercase — the inverse of the profile column, where the name is the smaller
  of the two. An opening title, not a caption.
- **Every section is a left-aligned column.** Section 01 is two columns —
  profile left, bio right — and the rest are single.
- **Contact shows paths, not hosts.** The icon says which service it is, so
  the label is only the path — `/labid-al-nahiyan-avro`, `/labid-al-nahiyan`,
  `/cv` — while the `href` keeps the full URL untouched. LinkedIn's `/in/` is
  stripped as scaffolding. `pathLabel()` in `render.js` does this; the email is
  the one entry shown in full. The five icons are drawn inline in the same file
  — one stroke weight, currentColor, 13px — because a dependency for five
  glyphs is not worth it. They are punctuation, not logos.
- **The profile column is 15.25rem** — the width at which the email address
  holds one line in Martian Mono at 11px. The portrait is narrower than its
  column on purpose, and the gutter to the bio is 2rem, not the 4.5rem it
  started at: the two columns are one composition.
- **Motion is additive.** With JavaScript off or reduced motion on the page is
  complete and static, and section changes become immediate.

## The ambient ground

Three fixed layers behind the page, all painted from the active section's
`--accent`, so the background drifts from one section's colour to the next
instead of switching.

```
wash    one wide accent bloom, effectively still     CSS, 64s drift
field   34 sample points, slow drift + cursor push   canvas, ambient.js
light   a soft reading light trailing the cursor     CSS, transform only
```

**Why points and not particles.** Three concepts were considered — drifting
dots with cursor push, a soft light over slow geometry, organic lines with a
particle field. What is built is the first, reframed so it belongs to this site
rather than to every developer portfolio: the points are a **sparse sample
field**, scattered measurements, and the cursor is a reading passing over them.
Same mechanics, different argument, and it keeps the count honest — 34 points
on a desktop, 14 on a narrow screen, not a thousand connected ones.

The push is a magnetic field, not an explosion: 18px of travel inside a 190px
radius, easing back at 0.07 per frame. Nothing chases the cursor.

**The scatter is seeded.** A fixed seed means the field is identical on every
load, so it reads as a composition rather than as noise that happens
differently each time.

### The rules it must never break

- **It is decoration.** `pointer-events: none` on the whole layer,
  **`z-index: -1`**, `aria-hidden`. Verified: five sampled points across the
  viewport, and `elementFromPoint` resolves to the ambient layer at none of
  them.

  **It was `z-index: 0` for a long time, and that was a bug.** At 0 the layer
  is *positioned*, and a positioned element paints above non-positioned content
  regardless of document order. Everything on this page is in normal flow, so
  the lattice was being drawn **on top of** the body text, the cards and the
  portrait — dots crawling over a photograph of someone's face.

  `pointer-events: none` is exactly what hid it: nothing could be clicked
  through the layer, so every interaction check passed and the only symptom was
  that the page looked faintly dusty. It survived four separate rounds of
  raising the card background — 45 → 70 → 88 → 100% — each of which was an
  attempt to fix this symptom from the wrong end. **If the page ever looks
  washed out again, check the paint order before touching a background value.**
- **It never touches the scroll.** No wheel handler, no `preventDefault`, no
  scroll listener of its own.
- **It waits for the opening.** Held at `opacity: 0` until `intro:done`, so the
  panels part onto the portfolio rather than onto something already moving.
  Verified: never `on` in any frame while the intro layer was up.
- **Reduced motion keeps the field and stops it.** One frame drawn, no rAF at
  all. Verified at 0 pixels changed in 900ms, against ~1,600 normally.
- **No cursor, no light.** `@media (hover: none), (pointer: coarse)` removes it
  outright rather than leaving a GPU layer following nothing.

### The cost, and the bug that hid in it

The first version **halved the frame rate**, and it was reported as the
background "interfering with navigation". It was not interfering with events —
hit-testing was clean, and `elementFromPoint` never resolved to the layer. It
was paint cost, which feels identical from the other side of the screen.

| | median frame | p95 | frames over 20ms |
|---|---|---|---|
| before | **33.4ms** | 83.3ms | 37 / 52 |
| after | 16.7ms | 16.8ms | **0 / 77** |

Two causes, both worth remembering:

1. **The light was a 736px box moved with the `translate` property on an
   unpromoted element.** Every frame, the main thread repainted a 736px radial
   gradient. It is now 240px, moved with `transform: translate3d` under
   `will-change: transform`, so the compositor moves an existing texture
   instead.
2. **`filter: blur(28px)` on a viewport-and-a-half element running an
   animation.** That re-rasterised the whole area continuously and bought
   nothing — a radial gradient is already smooth. Removed.

After the fix the layer costs nothing measurable: 16.7ms with it on, 16.7ms
with it hidden.

**The light is a tint, not a spotlight.** 120px radius at 6% falling to
nothing, lerped at 0.14 (~150ms of lag). It was 368px at 10%. The point push
was cut to match — 12px inside a 130px radius, so the influence a reader sees
and the influence they feel are the same size.

If it ever needs to be quieter still, the dials are the alpha in `ambient.js`
(`0.16 + rnd() * 0.34`) and the two percentages in `.ambient__wash`.

## Contacts and icons

The hero shows **CV** as a labelled button and **email · GitHub · LinkedIn ·
Google Scholar** as icon buttons beside it.

- **The CV is the only one with a word on it.** It is the thing a committee
  actually opens; four profiles a reader may want once do not deserve four lines
  of text. `style: "action"` in `content/links.js` is what marks it.
- **Every icon carries `aria-label` *and* `title`.** The glyph is the entire
  visible content, so the accessible name is the only name it has.

- **arXiv is deliberately not a contact row.** The paper is still linked
  from Research, from News and from the no-JavaScript block in `index.html`;
  it just is not in the contact list. `links.arxiv` no longer exists.
- **A row hides itself when its URL is blank** in `content/links.js`, so
  nothing needs commenting out to drop one.
- **`text` overrides what a `url` row reads as.** The path-only rule exists
  because the host is the noisy half — but a Scholar URL is
  `/citations?user=…`, where the path is noise too and the id is unreadable.
  Scholar therefore reads *Google Scholar*. Use `text` only where the path
  genuinely says nothing; everything else stays a path.
- **Scholar and LinkedIn are the real profiles** as of Aug 2026, supplied
  directly. `orcid` is still blank, which hides it.

## Icons

**There is no `.svg` file for any icon on this site.** Editing one means
editing the markup where it is written, and there are three places:

| icon | where |
|---|---|
| email · GitHub · LinkedIn · Scholar · CV | the `ICONS` object in `assets/js/render.js` |
| sun · moon | `themeButton()` in `assets/js/theme.js` |
| favicon | the `data:image/svg+xml` URI in **both** `index.html` and `photography.html` |

The only real `.svg` files in the repo are the eight photography placeholders,
which are loaded normally as images.

**The five shipped icons are solid 24×24 brand marks**, not the stroked 16×16
abstractions they started as — a circle-on-a-line standing in for GitHub read
as decoration rather than as the service it pointed at. All five carry
`solid: true`. Verified at 72px, 26px and 13px: all still legible at contact
size, all painted, none nested, each in its own service colour.

### Writing an ICONS entry

Three forms, in the order you will want them:

```js
name: '<circle .../><path .../>'               // inner markup, 16×16 grid
name: { paths: '…', viewBox: '0 0 24 24' }     // a different grid
name: { paths: '…', solid: true }              // a filled icon, not stroked
```

**The default is stroke-drawn on a 16×16 grid**, because `.icon` in site.css
forces `fill: none; stroke: currentColor; stroke-width: 1.4`. That is the trap
worth knowing about: **a filled icon pasted in without `solid: true` renders
completely invisible.** The CSS overrides its fill and it looks exactly like
the edit did nothing. Verified — a `<path fill="currentColor">` computes to
`fill: none` in that context. A Feather or Lucide outline drops straight in; a
Font Awesome or Material solid glyph needs `solid: true`.

`solid: true` sets `data-solid` on the element, and `.icon[data-solid]` swaps
the paint to `fill: currentColor; stroke: none`.

**Pasting a whole `<svg>…</svg>` is handled rather than punished.** `icon()`
unwraps it, adopts its `viewBox` if one was not given, and warns once in the
console naming the icon. Without that it became an `<svg>` inside an `<svg>` —
measured at 10×10 inside the 13×13 parent, wrong scale, and silent.

All of this is asserted: the five shipped icons still render at 16×16,
stroke-drawn and unnested; the solid form paints; a custom viewBox is kept; and
a wrapped paste is unwrapped, re-viewBoxed and warned about.

### If an edit still seems to do nothing

ES modules cache hard. After editing `render.js` or `theme.js`, a plain reload
can serve the old module — use **Cmd+Shift+R**. Favicons cache harder still and
often need a new tab.

## Light and dark

Two themes, and a third state that matters: **following the system**. The
control in the header cycles light → dark → follow, so someone who taps it out
of curiosity can get back to the setting they actually keep on their machine.
A small dot on the button appears only while a choice is pinned, which is what
tells "I am on dark because I chose it" apart from "I am on dark because my
laptop is".

```
(no attribute)        follow prefers-color-scheme  ← default, nothing stored
data-theme="light"    pinned light
data-theme="dark"     pinned dark
```

**The restore is inline in `<head>`, and it has to be.** A pinned choice must
be on `<html>` before the first paint or the page paints light and snaps to
dark — the flash every themed site gets wrong. A module cannot do it: modules
are deferred by definition. `theme.js` only handles the click. Verified: with
dark pinned, the **first painted frame is already dark**.

Both `index.html` and `photography.html` carry the same inline restore and read
the same `labid-theme` key. Change it in one and you must change it in the
other.

### How the two palettes are wired

Light values are live in `:root`. Dark values live **once** in a `--dk-*` bank
at the foot of `:root`, and two thin blocks map them onto the live names — one
for `prefers-color-scheme`, one for `[data-theme="dark"]`. The two mapping
blocks are deliberately **identical text**, so drift shows up in a diff
immediately, and no colour value is ever written twice.

`:not([data-theme="light"])` on the media-query block is what lets an explicit
light choice beat a dark system preference. Verified.

The dark ground is a deep slate-indigo (`#171b28`), not black — a near-black
page with one bright accent is as much of a default look as the cream one was.
It sits in the same hue family as the neutral tag, so the dark theme reads as
the light theme turned down rather than as a different site.

Two dials are turned up in dark because a tinted film reads differently over a
dark ground: `--tag-bed` 10% → 14%, `--tag-line` 58% → 52%.

Everything else came free. Every component already read `var(--accent)` or a
`color-mix()` of it, so nothing outside `tokens.css` needed a dark-mode branch.

## Local preview

ES modules need a server (`file://` will not work).

```bash
cd /Users/labidalnahiyan/Documents/Projects/Portfolio
python3 -m http.server 8000
```

## Live site & deploy

- **Live:** <https://labid-al-nahiyan-avro.github.io/> (GitHub Pages, repo root).
- **Two repos, don't confuse them:**
  - `labid-al-nahiyan-avro/labid-al-nahiyan-avro` — the **profile README** repo.
    This working directory's `origin`. `README.md` here belongs to it. Not the site.
  - `labid-al-nahiyan-avro/labid-al-nahiyan-avro.github.io` — the **website**.
    Reachable here as the `site` remote. Deploy target.

```bash
P="/Users/labidalnahiyan/Documents/Projects/Portfolio"
D="/tmp/portfolio-deploy"
rm -rf "$D"
git clone git@github.com:labid-al-nahiyan-avro/labid-al-nahiyan-avro.github.io.git "$D"
rsync -a --delete \
  --exclude '.git' --exclude '_legacy' --exclude '*.pdf' --exclude '.DS_Store' \
  --exclude 'HANDOFF.md' --exclude 'README.md' --exclude 'example.txt' \
  "$P/" "$D/"
cp "$P/assets/cv.pdf" "$D/assets/cv.pdf"
cd "$D" && git add -A && git commit -m "Rebuild portfolio" && git push origin main
```

Pages rebuilds in ~1 min; hard-refresh (Cmd+Shift+R) to beat the CDN cache.

## The opening

**Not a loading screen.** Nothing is being waited for — the portfolio is
already built underneath. It is one short beat of identity and then it is
gone, about **1.24 seconds** on screen.

A full-screen layer at `z-index: 9999`: two ivory panels cover the viewport,
the name and roles sit on top of them, then the panels part — top up, bottom
down — and the portfolio is **already there underneath**, fully rendered. The
reveal shows the real page rather than fading one in.

```
0–300ms      panels cover the viewport; the name fades up
260–600ms    the roles rise into place
460–680ms    a short green rule draws beneath them
700–1240ms   the panels withdraw (540ms, cubic-bezier(.76,0,.24,1))
~1240ms      intro.js removes the layer and sets `intro-done`
```

Measured from a cold load: layer on screen at 194ms, name up at 426ms, layer
gone 1270ms later — **1.58s from navigation to a clear portfolio**, of which
~300ms is the page loading before the sequence can start at all.

### Where the timing lives, and why

**In `site.css` §4, as CSS animations — not in JavaScript.** `data-state="play"`
is written into `index.html`, so every beat starts at **first paint**. This is
the whole fix for the version before it, which set that attribute from a module
and so put the entire sequence behind the module's download and execution: about
250ms of dead time that pushed a 1.2s opening out to 2.35s.

It also means the panels part **on their own**. With scripting broken, blocked,
or simply slow, the page still uncovers itself. `intro.js` is only responsible
for taking the finished layer away, remembering the visit, and letting an
impatient visitor skip with a click or Escape.

Three layers of failsafe, because the portfolio must always become usable:

1. `intro.js` finishes on the panel's **`animationend`** — read from the
   animation rather than restating its duration, so the two cannot disagree;
2. a 1.8s timer in `intro.js`, in case the panel never animates at all;
3. a 2s timer in the inline `<head>` script, in case the module never runs.

### Why it did not appear, for three rounds

`intro.js` used to open with `if (prefersReducedMotion()) return finishNow()` —
it **skipped the sequence outright**. macOS carries "Reduce motion" in
Accessibility → Display, plenty of people have it on, and Chrome honours it, so
for those visitors the intro had never existed no matter what changed in its
CSS. The blanket `animation-duration: 0.01ms !important` in the reduced-motion
block would have flattened it anyway.

Reduced motion now keeps the full-screen opening — it is the site's identity,
not decoration — but runs it in ~700ms as a pure cross-fade: the panels fade
where they would slide, and `transform` stays `none` throughout. That override
is a **media query** at the foot of `site.css`, not a `data-motion` attribute
set by script, for the same reason as everything else here: the opening should
not need a module to have run.

### Two traps, both found by driving it

1. `finish()` used to set `intro-done` at the same moment it started the
   reveal. `html.intro-done .intro { display: none }` then removed the layer
   instantly and the panels never visibly parted. The class goes on **after**
   the panels have finished, together with removing the node.
2. Holding section 01's entrance stagger until the panels had parted seemed
   tidier — let the portfolio *arrive* as it is uncovered. It is wrong. The
   panels then open onto a **blank sheet** which fills itself in afterwards,
   which is exactly the "you have entered a different website" feeling the
   opening exists to avoid. Section 01 reveals while it is still covered, on
   purpose. There is a comment saying so in `main.js`.

### Seeing it again

It plays once per browsing session, and the `<head>` script sets `intro-done`
before the layer is ever parsed, so a repeat visit shows no flash of it.

- open the site in a new tab
- `sessionStorage.removeItem("labid-intro-seen")` in the console
- load with `?intro` on the end of the URL

The key is `labid-intro-seen`, in both `assets/js/intro.js` and the inline
script in `index.html` — change it in both or not at all.

## What was verified

> **These results describe the RAIL-ERA build.** The suite has not been re-run
> since the identity rail was replaced by the top bar and the hero. Everything
> below about the deck, the theme, the ambient ground and the tag system still
> holds; every assertion that names `.rail`, the contact rows or the 1000px
> breakpoint describes a layout that no longer exists. Re-run before trusting
> the masthead and mobile paragraphs.


Driven in real Chrome over the DevTools protocol, measuring rather than
eyeballing. **66 assertions, all passing** across `verify`, `toggle` and
`palcheck`. The deck-era suite was retired with the deck. The numbers below are from those
runs, at 1440×900 unless stated.

**The palette, in the browser, in both themes.** All seven families present and
resolving; every family and every section accent clears AA on its own ground;
all three ink levels clear AA. The property the palette exists for holds:
family contrast spread **0.67 light** (5.11–5.78) and **0.88 dark**
(8.26–9.14). Headless Chrome reports a dark system preference by default, so
the harness pins `prefers-color-scheme` explicitly — without that every colour
assertion silently tests the wrong theme.

**The theme control**, 12 assertions: starts on follow-the-system with nothing
in storage; press one pins light, two pins dark and the page actually turns
`rgb(23, 27, 40)`, three returns to follow and clears storage; the pin survives
a reload; **the first painted frame after a reload is already dark** — the
check that catches the flash; and an explicit light choice beats an emulated
dark system.

**The masthead** *(rail-era)*. The rail is sticky at 296px; seven sections stack in one
scrolling page; `body` overflow is back to `visible`; no horizontal overflow;
and no `.deck`, `[data-edge]` or `[data-veil]` survives anywhere in the
document. Scrolled to the very foot of the page, **all five contact rows and
the theme control are still on screen** — which is the entire point of the
layout, so it is asserted rather than assumed. Nav clicks to Research, Work and
Home each highlight the right item and recolour `--accent` to that section's own
value, and focus lands on the target section so Tab continues from there.

**The ambient ground** *(pre-fix)*. On after the opening and never before it; `z-index: 0`
with `pointer-events: none`; `elementFromPoint` at five sampled positions
resolves to real content at all five; the reading light reaches opacity 1 and
tracks the cursor; the field is drawn (892 inked pixels) and drifts (~1,600
changing per 900ms). Under reduced motion it is still drawn and changes **0**
pixels.

**Mobile, with touch actually emulated** — the harness now sets `mobile: true`
and enables touch events, because a 390px window otherwise still reports
`pointer: fine` and any query gated on a touch screen silently does not apply.
The rail goes static, the nav folds behind a working toggle, all five contacts
hold one line each, and the cursor light is not rendered at all.

**The tag system.** 70 tags across the deck, every one carrying a family, all
seven families in use and each resolving to its own colour. Outlined
(`1px`, tinted bed behind), `7px` radius, `4px 9px` padding — measured, not
assumed. 13 labels appear in more than one section and **none of them disagrees
about its colour**, which is the assertion that would catch the taxonomy
drifting. Every section paints `rgba(0, 0, 0, 0)` — no section tints the paper
any more. Each of the seven draws an accent rule (50–56px) and an accent
number. The availability marker is outlined, `rgb(73, 102, 83)` in every
section, and 328px wide — a marker, not a banner. The five contact icons carry
five different colours while no label borrows its icon's.

**The opening, as a lifecycle** — from a clean session: layer present at 194ms
→ `z-index: 9999` → panels overlap by 9px so no seam shows → name at full
opacity by 426ms → **1270ms on screen, gone 1576ms after navigation** →
`intro-done` never set while the layer was still up (the check that catches the
`display: none` trap) → **21 sampled frames during the reveal, every one with
all 7 sections already rendered underneath** → session flag written → skipped
on the next same-session load → `?intro` brings it back.

Under `prefers-reduced-motion`, on its own schedule: layer present and *not*
skipped, name up 107ms after paint, **panel `transform` stays `none` in every
sampled frame**, gone after 684ms. This path previously produced nothing at all.

**Profile.** Contact labels are path-only — `/labid-al-nahiyan-avro`,
`/labid-al-nahiyan`, `/abs/2512.01037`, `/cv` — with no host name anywhere and
the `href`s verified unchanged and absolute; the email is the one entry shown
in full. Portrait 190×238, i.e. exactly 4:5, 4px radius, `box-shadow: none`,
`object-fit: cover`. Masthead gutter **32px**. Bio centre 495 against profile
centre 495 — exactly centred. The Fall 2027 line sits inside the first viewport
and its dot is `rgb(73, 102, 83)` whatever section it is in.

**Colour.** All seven accents resolve distinctly, each section's number is
drawn in its own, and every tinted background still measures as paper
(no channel below 215/255) — the colour is felt, not seen as a block. The
header nav picks up the active section's accent: `rgb(156, 83, 52)` on Work.

**Navigation.** Starts on 01 with PREVIOUS hidden; NEXT → 02; PREVIOUS → 01;
nav jump → 06; ArrowRight → 07; ArrowLeft → 06; on the last section NEXT reads
`Start` with a `↻`; the wrap lands on 01 and the labels reset to `News`. A tall
section scrolls vertically (0 → 184) **without the deck moving sideways**, and
a research row expands to a 549px body.

**Geometry.** Deck `scrollWidth` 10080 = 7 × 1440, no page-level horizontal
overflow. At **390×844**: profile stacks above the bio, the portrait holds 4:5,
all five contact rows stay visible, sections stay exactly one viewport wide,
the menu becomes a toggle, and the pager moves to the bottom edge.

**Not verified, and worth ten minutes with a real pointer:** how a wheel and a
trackpad feel moving through the deck, snap at the end of a fling, hover
transitions, the lightbox in use, and Safari and Firefox. Headless Chrome
dispatches **no scroll events at all** and will not advance smooth scrolling or
CSS transitions, so end-states had to be asserted directly rather than watched.

One thing to know about the opening on a slow connection: the Google Fonts
stylesheet in `<head>` is render-blocking, so first paint — and therefore the
first beat — waits on it. That is a deliberate trade: making it async would
start the opening sooner but swap the name's typeface halfway through it.

## Open to-dos

- **PoisonGate.** Named in your briefs, but it appears in no CV and no file in
  this repo, so nothing was written for it. The stub is in `content/_archive.js`
  under `projects`, scored 0 with the reasoning; fill it in and move it across
  to `content/projects.js`.
- **Pick the CV to serve.** `assets/cv.pdf` is currently a copy of
  `Labid_al_nahiyan_CV.pdf` (the 2-page academic version). The six PDFs in the
  repo root are the candidates; site content is drawn from all of them.
- **The name.** The site says *Labid Al Nahiyan*, which is what you chose when
  asked, and it matches the arXiv byline. Your sketches say *Labid Avro*. One
  line in `content/site.js` if you want to switch.
- **CURRENT FOCUS block.** Asked for "only if it does not duplicate" — it would
  have repeated the focus line already in the profile column and the interests
  line at the top of Research, so it was left out.
- Fill in `orcid` in `content/links.js` when that profile exists. Scholar and
  LinkedIn are done.
- **Add photographs.** The gallery is built and currently holds eight generated
  placeholders; see *Photography → the placeholder album* for how to swap them
  out. They are stamped and labelled, but they are still not your work, so this
  is the to-do to clear before the site is shown to anyone.
- `_legacy/` can be deleted once you are happy with the rebuild.
