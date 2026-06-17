# Product

## Register

product

## Users

Two overlapping audiences, both arriving with a task in hand:

- **Researchers / scientists** building behavioral experiments that run in the browser. Many are not professional programmers — psychologists, cognitive scientists, students. They come to learn (tutorials, conceptual guides) and to copy working patterns. Their context: figuring out how to express an experimental design in jsPsych, often under deadline, frequently new to JavaScript.
- **Developers / plugin authors** extending the ecosystem. They come for exact reference — API signatures, parameters, return data — and expect fast, precise lookup. Comfortable with code; impatient with fluff.

The job to be done: *get from "I have an experiment idea" to "it runs" with the least friction*, and later *look up the exact detail I half-remember* without hunting.

## Product Purpose

The documentation site is the home and **hub of the jsPsych ecosystem**. jsPsych is an open-source JavaScript framework for building browser-based behavioral experiments out of composable plugins arranged on a timeline. This site is more than reference for one library: it is the connection point for a set of interrelated services and packages (core, plugins, extensions, contrib, and adjacent tools) that each carry their own documentation.

Success looks like: a first-time researcher completing the hello-world tutorial without getting lost; an experienced developer finding the exact plugin parameter in seconds; and any visitor immediately understanding the shape of the ecosystem and where to go next. The site must serve both deep linear learning and fast non-linear lookup, and it must make the multi-package ecosystem feel like one coherent place rather than scattered repos.

## Brand Personality

**Scientific & approachable.** Credible and rigorous enough that researchers trust it for published work, but warm and unintimidating enough that a non-programmer can start. The voice is plain, encouraging, and concrete — explains the *why*, shows working code, never condescends and never shows off. Open-source community warmth without the chaos.

The existing visual identity is established and should be honored, not reinvented: the dot-brain logo (orange, light + dark green, coral-red), the lowercase humanist "jspsych" wordmark, a friendly-but-serious register. Warmth comes from the palette, typography, and clear writing — not from decoration.

## Anti-references

- **Generic Docusaurus default.** The out-of-the-box green/blue template look. If a visitor can tell it's an uncustomized Docusaurus site, we've failed. (The current theme is still largely default — that's the starting debt to pay down.)
- **Corporate / SaaS-y.** Gradient heroes, marketing buzzwords, enterprise-cold polish. This is an academic open-source tool, not a product funnel.
- **Cluttered / busy.** Too many colors, admonition callouts, and decorations competing for attention. Restraint is the default.
- **Sterile / intimidating.** Cold walls of text and reference-only density that scare off the non-programmer researcher.

Reference feel to draw from: **Astro / Svelte docs** — friendly, modern, confident open-source energy that stays approachable for newcomers while remaining precise.

## Design Principles

1. **Lookup is the primary verb.** Most visits are "find the one thing." Navigation, search, in-page hierarchy, and code presentation are the core UX — optimize ruthlessly for fast orientation and retrieval.
2. **Lower the barrier, keep the rigor.** Beginners and experts share every page. Lead approachable (plain language, runnable examples, clear next step) without dumbing down the precise reference an expert needs.
3. **One coherent hub, many packages.** Make the ecosystem legible — consistent navigation and visual vocabulary across core, plugins, extensions, and adjacent services, so the whole thing reads as one place.
4. **Show, don't tell.** A working, runnable example beats a paragraph of prose. Code and live demos are first-class content, not afterthoughts.
5. **Earn the brand, drop the template.** Express the established jsPsych identity (palette, wordmark, warmth) deliberately; eliminate every trace of generic Docusaurus default.

## Accessibility & Inclusion

Target **WCAG 2.1 AA**. Body text ≥4.5:1 contrast, large text ≥3:1, in both light and dark mode. Full keyboard navigation, visible focus states, semantic heading structure, and skip-to-content. Honor `prefers-reduced-motion` for any added motion. Because the brand leans on red and green, never encode meaning in color alone (status, diffs, callouts must carry an icon, label, or shape) so the palette stays legible for color-blind readers.
