---
target: learn/researchers (generated index)
total_score: 31
p0_count: 0
p1_count: 2
timestamp: 2026-06-17T13-19-12Z
slug: ost-docusaurus-test-docs-current-learn-researchers
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 4 | Breadcrumb, active sidebar, version badge all present |
| 2 | Match System / Real World | 3 | Plain title; but "2 items"/"21 items" is system-speak, not researcher language |
| 3 | User Control and Freedom | 4 | Sidebar, breadcrumb, back all available |
| 4 | Consistency and Standards | 3 | Brand theme consistent; the default 🗃️ emoji is an off-system icon |
| 5 | Error Prevention | 3 | n/a — pure navigation page |
| 6 | Recognition Rather Than Recall | 3 | Cards visible but describe nothing; user must click to discover contents |
| 7 | Flexibility and Efficiency | 3 | Sidebar gives direct access; the cards duplicate it |
| 8 | Aesthetic and Minimalist Design | 2 | Two sparse cards in a vast empty viewport; the "Next" card floats orphaned |
| 9 | Error Recovery | 3 | n/a |
| 10 | Help and Documentation | 3 | It is the docs, but this landing offers no orientation ("start here") |
| **Total** | | **31/40** | **Good (with clear content gaps)** |

## Anti-Patterns Verdict

**LLM assessment:** Not generative AI slop — this is a **stock Docusaurus generated-index** with the brand theme applied well. The theme work is genuinely good: blended navbar with the colored dot-brain mark and an orange "Learn" underline, green sidebar/breadcrumb active states, the branded compact footer, Lexend headings. The weaknesses are *template-default content*, not visual drift: the generic 🗃️ folder emoji, auto-generated "N items" card descriptions, and a page that's mostly empty space.

**Deterministic scan:** Skipped — the target is a URL rendering a generated-index page (built from `_category_.json` + theme), so there's no source markup file for `detect.mjs` to scan. Browser visualization stands in (light, dark, mobile captured on the live :3000 server).

**Visual evidence:** Captured in both color modes + mobile. Theme renders consistently; the issues below are visible in every capture.

## Overall Impression

A clean, on-brand but **thin signpost**. As the primary "Learn → Researchers" entry point it under-delivers: a researcher lands on two unlabeled folders ("2 items", "21 items") floating in a tall empty page, with no orientation about where to start or what's inside. The visual system is doing its job; the *content* of the index isn't.

## What's Working

- **The brand theme is fully applied and consistent** — navbar, sidebar active states, breadcrumb, headings, and footer all read as one system in both color modes. This page proves the design system holds up beyond the homepage.
- **Strong, legible hierarchy** — the Lexend h1 "Guides for Researchers" + one-line description is clear and confident; the page is easy to parse at a glance (there's just too little to parse).

## Priority Issues

- **[P1] The cards describe nothing — only "2 items" / "21 items."** The child categories' `_category_.json` files have no `link.description`, so Docusaurus falls back to item counts. A researcher can't tell what "Feature Overview" (21 items) covers versus "Tutorials," or which to open first. **Fix:** add a `description` to each child category's generated-index `link` (e.g. Tutorials → "Step-by-step walkthroughs, from Hello World to a full reaction-time task"). Highest-value, low-effort. *Command: /impeccable clarify*
- **[P1] No orientation / "start here."** This is the main Learn doorway, but it doesn't guide the two audiences it serves (first-timer vs. returning). **Fix:** replace the bare generated-index with a short authored `index.md` (keep the cards via `<DocCardList>`, add 2–3 sentences: "New to jsPsych? Start with the Hello World tutorial. Looking for a specific capability? Browse Feature Overview."). *Command: /impeccable craft (or clarify, if copy-only)*
- **[P2] Generic 🗃️ folder emoji on the cards.** An off-brand Docusaurus default; no other surface uses emoji icons. **Fix:** set a deliberate icon per category or drop the emoji. *Command: /impeccable polish*
- **[P2] The "Next: Tutorials »" pagination card floats orphaned** in the empty space, misaligned under the right-hand card. Standard Docusaurus, but the sparse layout strands it. **Fix:** an authored intro (above) fills the space and re-anchors it; or hide pagination on index pages. *Command: /impeccable layout*

## Persona Red Flags

**Jordan (Confused First-Timer):** Lands on "Guides for Researchers," sees two boxes labeled "2 items" and "21 items." No idea what's inside, which to open, or where to begin. High bounce / random-click risk.

**Dr. Mara (non-programmer researcher, from PRODUCT.md):** Wants reassurance she can build her study. Gets two unlabeled folders and empty space — no path, no "you can do this." The thinness quietly undercuts the "scientific & approachable" promise.

**Alex (Power User):** Fine, but the page is a pure pass-through — he uses the sidebar and ignores the cards, which are redundant with it. The index adds nothing he doesn't already have.

## Minor Observations

- The two cards **duplicate the sidebar** (Tutorials, Feature Overview appear in both), so the index's only added value would be description/orientation it currently lacks.
- "21 items" under a single "Feature Overview" is a deep bucket; the IA might benefit from sub-grouping.
- Dark mode: cards lift off the near-black page only via their 1px border; a touch more surface contrast would help them read as cards.

## Questions to Consider

- What if this landing *oriented* the researcher ("Start with Hello World; browse Feature Overview for specific capabilities") instead of listing two folders?
- Do the cards earn their place if they duplicate the sidebar and show only counts?
- Should "Feature Overview" (21 items) be split into a few labelled groups?
