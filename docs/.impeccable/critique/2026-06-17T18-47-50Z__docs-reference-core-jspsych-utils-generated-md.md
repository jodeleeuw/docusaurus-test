---
target: TypeDoc-generated jspsych-utils sample page
total_score: 26
p0_count: 0
p1_count: 3
timestamp: 2026-06-17T18-47-50Z
slug: docs-reference-core-jspsych-utils-generated-md
---
# Critique: TypeDoc-generated jsPsych.utils reference page

Judged on information design (visual theme is shared via custom.css). Product register: lookup-first, dual audience (non-programmer researchers + developers).

## Design Health Score
| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | bare names weaken orientation |
| 2 | Match System / Real World | 2 | headings drop jsPsych.utils namespace; TypeDoc signature notation |
| 3 | User Control and Freedom | 3 | n/a static |
| 4 | Consistency and Standards | 2 | diverges from hand-written reference pages |
| 5 | Error Prevention | 3 | n/a |
| 6 | Recognition Rather Than Recall | 2 | bare names force namespace recall |
| 7 | Flexibility and Efficiency | 3 | scannable tables, anchors, copyable code |
| 8 | Aesthetic and Minimalist | 2 | redundant TOC + Functions H2 + glyphs + escaped generics |
| 9 | Error Recovery | 3 | n/a |
| 10 | Help and Documentation | 3 | complete, accurate, examples present |
| Total | | 26/40 | Acceptable |

Cognitive load: moderate (~3 failures: hierarchy, working memory via bare names, always-on type-param tables).

## Anti-Patterns Verdict
Detector clean ([], exit 0) on markdown. Not slop, but machine-generated tells: triangle glyph, escaped generics, duplicate TOC scaffolding, floating bare type under Returns. TypeDoc-default look.

## Strengths
1. Zero-drift content (the core value).
2. Scannable param/type tables for dev lookup.
3. Internal consistency across entries.

## Priority Issues
- [P1] Bare function names drop jsPsych.utils namespace (match real world / recognition). Fix via TypeDoc name config or post-process.
- [P1] TypeDoc signature notation is a jargon barrier for researchers (Design Principle 2). Fix via custom template showing plain call signature.
- [P1] Inconsistent with rest of reference section; don't half-migrate. Fix: one path for whole core reference.
- [P2] Redundant in-page TOC + Functions H2 vs theme right-rail TOC. Disable TypeDoc index/TOC partials.
- [P2] Lost module intro prose (no @module comment in source). Add top-of-file JSDoc.

## Persona Red Flags
- Dr. Maya (non-programmer researcher): stalls on generics/type-param table and bare names.
- Alex (developer): well served; prefers this format.
- Sam (a11y): tables have headers (good); triangle glyph announced literally by screen readers.

## Minor Observations
- Returns shows bare type token then description (floating fragment).
- Type-parameter tables always shown even when trivial.
- ___ rules heavier than hand-written spacing rhythm.

## Questions
- What if the copyable namespaced call signature led, TS type secondary?
- Generate everything vs only developer-facing modules?
- Could post-processing/custom theme close 80% of the gap?
