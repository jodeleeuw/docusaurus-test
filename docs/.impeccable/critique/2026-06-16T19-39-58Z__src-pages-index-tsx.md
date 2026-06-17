---
target: src/pages/index.tsx
total_score: 25
p0_count: 2
p1_count: 3
timestamp: 2026-06-16T19-39-58Z
slug: src-pages-index-tsx
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Static page; nav active states + CTA hover from theme are fine |
| 2 | Match System / Real World | 3 | Copy is plain and clear; "Hello from jsPsych"-style template meta leaks |
| 3 | User Control and Freedom | 3 | Nav available; nothing traps the user |
| 4 | Consistency and Standards | 2 | Carries default-template debris (dead features component, placeholder meta); white logo box clashes with tinted bg |
| 5 | Error Prevention | 2 | Primary CTA points at a non-existent route — no guardrail |
| 6 | Recognition Rather Than Recall | 3 | Labels and CTA are clear |
| 7 | Flexibility and Efficiency | 2 | Single path off the page; no "browse plugins / reference / demo" routes for an ecosystem hub |
| 8 | Aesthetic and Minimalist Design | 2 | Wall of centered body text, white logo rectangle, empty `<main>` |
| 9 | Error Recovery | 2 | Broken CTA → 404; no recovery affordance on the page |
| 10 | Help and Documentation | 3 | It is the docs site; nav + search present |
| **Total** | | **25/40** | **Acceptable (low end)** |

## Anti-Patterns Verdict

**LLM assessment:** Does not look like *generated* AI slop — it looks like a half-migrated Docusaurus starter. The tells are template-default, not generative: empty `<main>`, a `HomepageFeatures` component still carrying "Easy to Use / Powered by React" + undraw illustrations (dead code, never rendered), and placeholder page meta. The new brand theme (green navbar, brand palette) is doing the heavy lifting; the homepage body hasn't caught up.

**Deterministic scan:** `detect.mjs --json` on `src/pages/index.tsx` and `HomepageFeatures/index.tsx` → `[]` (exit 0). Clean, but expected: the file is too sparse to trip pattern rules. The problems here are compositional and structural, which the detector doesn't model.

**Visual overlays:** None injected. Evidence is screenshots at 1440 / 820 / 375 px against the live dev server.

## Overall Impression

The homepage is the least-finished surface on the site — a default Docusaurus scaffold with jsPsych prose pasted into the hero and the rest left as template. Two issues are ship-blockers (mobile layout collapse, broken primary CTA). The biggest opportunity: this page is described in PRODUCT.md as "the hub of the jsPsych ecosystem," and right now it conveys none of that — no demo, no paths into plugins/reference, no sense of the ecosystem.

## What's Working

- **Copy is genuinely good** — plain, concrete, non-condescending. Exactly the "scientific & approachable" voice PRODUCT.md asks for. It just needs to be shaped into a page instead of three stacked paragraphs.
- **The theme carries the brand** — green navbar and brand palette (from the colorize pass) make the chrome feel like jsPsych even though the body doesn't yet.

## Priority Issues

- **[P0] Hero text collapses on mobile.** `.heroText { margin: 0 10rem }` is fixed regardless of viewport; the `@media (max-width: 996px)` block only adjusts `.heroBanner` padding. At 375px, 320px of side-margin crushes the paragraph to roughly one character per line. **Fix:** replace the fixed margin with a centered `max-width` column (`max-width: 70ch; margin-inline: auto; padding-inline: 1rem`). *Command: /impeccable adapt*
- **[P0] Primary CTA is a broken link.** `to="/docs/tutorials/hello-world"`; the real route is `/docs/current/getting-started/hello-world` (no `tutorials/` segment, missing version path), and no client-redirects are configured. The one action on the page leads to a 404. **Fix:** point at the correct doc id; consider a versionless `/docs/getting-started/hello-world` if a redirect/alias is set up. *Command: /impeccable clarify*
- **[P1] Empty `<main>` + dead default component.** `index.tsx` renders `<main></main>`; `HomepageFeatures` (default Docusaurus content) is imported nowhere it shows. The page never expresses the ecosystem-hub purpose. **Fix:** build a real below-hero section — entry paths (Learn / Reference / Plugins), or a live experiment demo. Delete or rewrite `HomepageFeatures`. *Command: /impeccable craft*
- **[P1] Logo is a JPG with a baked white background.** On the tinted/dark page it renders as a white rectangle card around the brain mark. It's also the page's `<h1>` (an `<img>` with alt "jsPsych Logo"), so there is no real text H1 for SEO/screen readers. **Fix:** use the transparent colored SVG (`jspsych-logo-no-text.svg` from logo-assets) and add a real (optionally visually-hidden) text `<h1>`. *Command: /impeccable typeset*
- **[P1] Placeholder page metadata ships.** Layout `title={`Hello from ${siteConfig.title}`}` and `description="Description will go into a meta tag in <head />"` are template defaults — that description is the homepage's SEO snippet. **Fix:** real title + a one-line description of jsPsych. *Command: /impeccable clarify*

## Persona Red Flags

**Casey (Distracted Mobile User):** The hero paragraph is unreadable on a phone — one character per line. This is the first thing a mobile visitor sees. Near-certain bounce.

**Jordan (Confused First-Timer):** The one obvious next step — "Get Started With jsPsych - 5min" — leads to a 404. The first-timer's single guided action is broken. No secondary path (what *is* a plugin? where are examples?) to recover.

**Dr. Mara (non-programmer researcher, from PRODUCT.md):** Arrives wanting proof jsPsych can build her experiment without deep JS. Gets three paragraphs of prose and no demonstration — the "show, don't tell" principle is inverted. A runnable mini-experiment or a screenshot of one would convert her; text alone asks her to take it on faith.

## Minor Observations

- The old MkDocs intro linked "timelines," "hello world," and "reaction time tutorial" inline; those links were dropped when the prose moved into the hero — now they're plain text dead-ends.
- `.heroBanner` has `position: relative; overflow: hidden` but nothing uses them (no positioned decoration) — leftover scaffolding.
- Only one CTA for a site that's an ecosystem hub; no path to Reference, Plugins, or a demo.

## Questions to Consider

- What would the page look like if it *showed* a running experiment instead of describing one?
- For an "ecosystem hub," should the first fold offer 3-4 doorways (Learn / Reference / Plugins / Community) rather than a single tutorial button?
- Does the hero need three paragraphs, or one confident sentence plus a demo?
