---
target: the 404 page
total_score: 33
p0_count: 0
p1_count: 1
timestamp: 2026-06-19T14-03-39Z
slug: src-theme-notfound-content-index-tsx
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 4 | Clear 404 state; correct HTTP 404 status code served |
| 2 | Match System / Real World | 4 | Plain-language copy, externalizes blame, no jargon |
| 3 | User Control and Freedom | 3 | Good exits, but no on-page search — the fastest recovery on a docs site |
| 4 | Consistency and Standards | 2 | Gradient-text "404" violates the project's own absolute ban + One-Green/Orange-Is-Rare rules; CTA radius 9px is off the documented token scale |
| 5 | Error Prevention | 4 | Nothing to mis-trigger |
| 6 | Recognition Rather Than Recall | 3 | Links recognizable but styled as low-emphasis muted text; no scent for the likeliest destination |
| 7 | Flexibility and Efficiency | 3 | One CTA + four links serves most; no search shortcut |
| 8 | Aesthetic and Minimalist | 3 | Genuinely restrained; loses a point for the redundant "ERROR 404" eyebrow above the "404" numeral |
| 9 | Error Recovery | 3 | Recovers via links; copy doesn't suggest "try search" or "check the URL" |
| 10 | Help and Documentation | 4 | "Get help" link present and appropriate |
| **Total** | | **33/40** | **Good — one systemic consistency flaw** |

## Anti-Patterns Verdict

**Does this look AI-generated?** Mostly no — but the centerpiece is a self-inflicted tell.

**LLM assessment:** The page feels calm, honest, and on-brand in everything except one element. Restraint is right: no mini-game, no jokey copy, no watermark. The slop tell is the **gradient-text "404"** (`background-clip: text` over a forest-green→leaf-green→orange gradient, styles.module.css ~L37–45). This is on the project's absolute-ban list ("decorative, never meaningful — use a single solid color"), and it simultaneously breaks the One-Green Rule and the Orange-Is-Rare Rule: the orange terminus is the largest, most saturated orange on the page and means nothing — it exists because the gradient needed a third stop. It is the one place this page contradicts the discipline the rest of the site maintains, which is exactly what a category-fluent eye snags on.

**Deterministic scan:** Markup scan of `index.tsx` = 0 findings (clean). CSS scan = 1 advisory: `border-radius: 9px` on the primary CTA (L81) is outside the DESIGN.md rounded scale (8/12/16/999). Notably, **the detector did NOT catch the gradient-text ban** — that gap was caught by manual review. Treat the detector as a floor, not a ceiling, here.

**Measured contrast (correcting a visual worry):** secondary/muted text `#5e6561` on paper `#fbfefc` = **5.89:1 (PASS)**; body ink = 15.22:1. The muted lead, mono eyebrow, and quiet links all clear WCAG AA. Contrast is fine — not an issue.

**Visual evidence:** Rendered in headless Chrome at desktop light, desktop dark, and 390px mobile. No live detect.js overlay was injected; evidence is the three screenshots + CLI scans.

## Overall Impression

A strong, restrained 404 that does its job — reassure, orient, redirect — dragged down by a single decision: the page's only brand gesture is the one technique the design system explicitly bans. Biggest opportunity: swap the gradient numeral for solid forest green and let the page's identity rest on type, color discipline, and copy (where it already succeeds), then strengthen the recovery path for a lost docs reader.

## What's Working

1. **Restraint that matches the brief.** The team killed its darlings (reaction-time game, "stimulus not found" copy, animated watermark). The result is calm and scientific-approachable — the hard part, done right.
2. **Honest, blame-shifting copy.** "isn't here. It may have moved, or the link might be out of date" is textbook error UX: plausible cause, no user-shaming, no false precision. `text-wrap: balance/pretty` shows real typographic care.
3. **Legible action hierarchy.** One filled forest-green CTA with a tasteful colored shadow, a divider, then quiet links. The One-Green Rule is honored everywhere except the numeral, and the layout is vertically centered (avoids the stranded-at-top default-Docusaurus look).

## Priority Issues

- **[P1] Gradient-text "404" violates the design system's absolute ban.**
  - **Why it matters:** It's on the hard-ban list, breaks both the One-Green and Orange-Is-Rare rules, and is the single place the page contradicts the rest of the site's discipline — the most likely slop tell a fluent reviewer (or the system's own author) catches. It's also fragile: it renders via `color: transparent`, so under Windows High Contrast / forced-colors the focal numeral can vanish entirely.
  - **Fix:** Set the numeral to solid `var(--ifm-color-primary)`. If a brand spark is still wanted, express it once with a small intentional solid-orange accent, not a tri-stop gradient.
  - **Suggested command:** `/impeccable quieter` (or `/impeccable colorize` to re-place the accent deliberately).

- **[P2] Weak recovery path for a lost docs reader.**
  - **Why it matters:** On a docs site the likeliest cause of a 404 is a renamed/moved page or a typo'd URL, and the fastest fix is *search for the term you wanted* — which the page doesn't offer. Worse, the single primary CTA "Back to home" sends a mid-task reader to the **marketing homepage**, not back into the docs they were reading.
  - **Fix:** Add an inline "Search the docs" affordance (reuse the existing search component) as the lede or first quiet link, and/or change/augment the primary CTA to "Browse the docs" pointing at the docs root.
  - **Suggested command:** `/impeccable clarify` (CTA labels/destinations) + a small build for the search input.

- **[P3] Redundant "ERROR 404" eyebrow above the "404" numeral.**
  - **Why it matters:** The mono eyebrow and the H1 say the same token twice before any human-readable explanation, pushing "Page not found" lower and making the eyebrow pure decoration.
  - **Fix:** Drop the eyebrow, or repurpose it to carry info the numeral can't (e.g., the requested path, or "This page doesn't exist").
  - **Suggested command:** `/impeccable distill`.

- **[P3] CTA radius off the token scale.**
  - **Why it matters:** `.primaryCta` uses `border-radius: 9px`; DESIGN.md defines 8 (sm) / 12 (md) / 16 (lg). One-pixel drift, but it's exactly the kind of untokenized value that erodes a system. (Detector-caught.)
  - **Fix:** Use 8px (`--rounded-sm`) to match documented buttons.
  - **Suggested command:** `/impeccable polish`.

- **[P3] On mobile the quiet links blur into the real footer.**
  - **Why it matters:** At 390px the four muted recovery links sit just above the footer's "Get Started / Reference / Plugin Catalog" links at near-identical gray weight — a distracted thumb can't tell the page's intended actions from site chrome, and the page ends on a low-energy footer-like note.
  - **Fix:** Give the recovery links more presence (chips, or icon+label) and/or more separation from the footer; consider leading with the single most-likely destination.
  - **Suggested command:** `/impeccable layout`.

## Persona Red Flags

**Jordan (Confused First-Timer — lost researcher on a stale tutorial link):** No search box, so they can't type what they actually wanted; they must guess whether "Get started," "Plugin catalog," or "API reference" holds it. "Back to home" dumps them on the marketing landing page, not back into the docs they were mid-task in.

**Sam (Accessibility-Dependent — screen reader / keyboard / low vision):** The gradient numeral relies on `color: transparent`; if `background-clip: text` is unsupported or forced-colors mode is on, the "404" focal element can disappear. (Contrast for muted text measured at 5.89:1 — passes, so that earlier worry is cleared.) Keyboard focus order is fine; only one button + four standard links.

**Casey (Distracted Mobile):** "Back to home" is the only strong tap target — everything else is low-contrast gray that visually merges with the footer nav directly below it, so a hurried tap effectively has one option. The orange-tipped "4" pulls the eye toward the screen edge rather than to "Page not found."

## Minor Observations

- Vertical rhythm is slightly uneven: `.code` margin `0.25rem 0 0` vs `.title` `0.75rem 0 0` — numeral hugs the eyebrow while the title floats.
- `.ctaRow` carries `flex-wrap` + gap for multiple buttons but holds only one — vestigial (and arguably a hint that a second CTA, "Browse docs," belongs there).
- Dark-mode CTA green-glow shadow is barely visible against forest-black — fine, just noting it does little there.

## Questions to Consider

- If the gradient is the page's only brand gesture and it's banned, what's the page's identity *without* it? If the honest answer is "default Docusaurus," that's worth confronting — the brand should live in type, color discipline, and copy, not one decorative trick.
- Are most of your 404s from *external* stale links (curated destinations help) or *internal* typos/renames (search wins)? The analytics answer should decide whether search is added.
- For a docs site, is the homepage even the right primary destination for someone who was clearly already *in* the docs?
