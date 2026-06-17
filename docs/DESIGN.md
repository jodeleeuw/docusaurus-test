---
name: jsPsych Documentation
description: The documentation hub for the jsPsych behavioral-experiment framework.
colors:
  forest-green: "#00683e"
  forest-green-dark: "#006037"
  leaf-green: "#13b24b"
  primary-dark-mode: "#32bb64"
  signal-orange: "#f18426"
  signal-orange-bright: "#ffae5c"
  signal-orange-ink: "#b55800"
  coral-red: "#ee4523"
  paper: "#fbfefc"
  mist-surface: "#f4f8f5"
  pine-ink: "#1f2622"
  slate-sage: "#5e6561"
  heading-ink: "#15201a"
  forest-black: "#0d1310"
  deep-pine: "#151b17"
  moonlit-ink: "#e5e9e6"
  success: "#03a14a"
  danger: "#db3424"
  warning: "#f18426"
  info: "#328bb0"
typography:
  display:
    fontFamily: "'Lexend Variable', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "clamp(2.1rem, 1.4rem + 3vw, 3.4rem)"
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: "-0.025em"
  heading:
    fontFamily: "'Lexend Variable', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "clamp(1.5rem, 1.2rem + 1.4vw, 2.1rem)"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.018em"
  body:
    fontFamily: "'Lexend Variable', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.7
    letterSpacing: "normal"
  label:
    fontFamily: "'Lexend Variable', system-ui, -apple-system, sans-serif"
    fontSize: "0.72rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.01em"
  code:
    fontFamily: "'JetBrains Mono Variable', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
    fontSize: "0.95em"
    fontWeight: 400
    lineHeight: 1.7
    letterSpacing: "normal"
rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
  pill: "999px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "40px"
components:
  button-primary:
    backgroundColor: "{colors.forest-green}"
    textColor: "#ffffff"
    rounded: "{rounded.sm}"
    padding: "0.8rem 1.6rem"
    typography: "{typography.body}"
  button-primary-hover:
    backgroundColor: "{colors.forest-green-dark}"
    textColor: "#ffffff"
  button-secondary:
    backgroundColor: "#00000000"
    textColor: "{colors.forest-green}"
    rounded: "{rounded.sm}"
    padding: "0.8rem 1.6rem"
  demo-panel:
    backgroundColor: "{colors.mist-surface}"
    rounded: "{rounded.lg}"
    padding: "1.75rem"
  navbar:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.pine-ink}"
---

# Design System: jsPsych Documentation

## 1. Overview

**Creative North Star: "The Open Workbench"**

jsPsych is open-source software for building behavioral experiments, and its documentation should feel like the workbench where those experiments get built: a well-lit, well-organized surface where the tools are within reach and the work itself is on display. The signature move is *showing, not telling* — the homepage runs a real jsPsych experiment in front of you rather than describing one. Every surface is content-first and quietly confident: the framework's identity (the dot-brain logo's forest green, leaf green, orange, and coral) supplies the warmth, while the layout gets out of the way so code, prose, and live demos lead.

The personality is **scientific and approachable** — credible enough that researchers trust it for published work, warm enough that a non-programmer can start without fear. This is a hub for an entire ecosystem of packages (core, plugins, extensions, contrib), so coherence across many surfaces matters more than per-page flourish. Restraint is the discipline: one green carries the brand, orange is a rare accent, and generous whitespace plus a reading-tuned typeface (Lexend) do the heavy lifting.

This system explicitly rejects the **generic Docusaurus default** (the out-of-the-box green/blue template that signals "we didn't customize anything"), **corporate / SaaS-y** marketing polish (gradient heroes, buzzwords, enterprise cold), **cluttered / busy** surfaces (too many colors and callouts competing), and the **sterile / intimidating** wall-of-text academic look that scares off newcomers.

**Key Characteristics:**
- Live, runnable demos as first-class content — show, don't tell.
- One forest-green brand voice; orange as a ≤10% accent, never decoration.
- Reading-tuned humanist type (Lexend) + clear monospace (JetBrains Mono) for code.
- Green-tinted neutrals, never warm cream; near-black-with-a-pine-tint in dark mode.
- WCAG 2.1 AA throughout; meaning never rests on color alone (red/green safe).

## 2. Colors

A restrained, green-led palette drawn directly from the jsPsych dot-brain logo: forest green leads, orange warms, coral and leaf-green appear only where meaning calls for them. Colors are authored in OKLCH for perceptual evenness and emitted as the hex values below for broad browser support.

### Primary
- **jsPsych Forest Green** (`#00683e`, light): The brand's anchor. Links, primary buttons, sidebar active state, the active navbar item, current-page markers. Clears 6.9:1 on white. In dark mode it brightens to **Primary-Dark Green** (`#32bb64`) so links hold ~7:1 on the near-black page.
- **Forest Green (deep)** (`#006037`): Hover/pressed state of primary actions.

### Secondary
- **Signal Orange** (`#f18426`, light / `#ff9c3b`, dark): The single brand accent. Navbar link hover, keyboard focus rings, text selection, the directory-arrow flourish, and the demo's highlight-block color. Never used as a body-text color (use **Signal Orange Ink** `#b55800`, which clears 4.5:1 on white, when orange text is truly needed).

### Tertiary
- **Leaf Green** (`#13b24b`): The logo's brighter green; appears in success states and the live demo's correct-feedback color.
- **Coral Red** (`#ee4523` / danger `#db3424`): The logo's warm pole. Reserved for error/danger states and the demo's incorrect-feedback color.

### Neutral
- **Green-Tinted Paper** (`#fbfefc`, light bg) / **Forest Black** (`#0d1310`, dark bg): Page background. A whisper of brand-green chroma (~0.006), never warm cream.
- **Mist Surface** (`#f4f8f5`, light) / **Deep Pine** (`#151b17`, dark): Elevated surfaces — cards, the demo panel, the dark-mode navbar.
- **Pine Ink** (`#1f2622`, light) / **Moonlit Ink** (`#e5e9e6`, dark): Body text. 15:1 / 14:1 — no washed gray.
- **Slate Sage** (`#5e6561`, light): Secondary/muted text. Holds 6:1; this is the floor, never lighter.
- **Heading Ink** (`#15201a`, light): Headings, a half-step darker than body for quiet hierarchy.

### Named Rules
**The One-Green Rule.** Forest green is the only color that carries structure. If a second hue is doing structural work on a screen, one of them is wrong.

**The Orange-Is-Rare Rule.** Orange appears on ≤10% of any screen — accents, focus, selection, one flourish. Its scarcity is the point; the moment it decorates, it stops meaning anything.

**The No-Cream Rule.** Neutrals tint toward the brand green, never toward warm beige/sand/parchment. Warmth comes from the orange accent and the type, not the background.

**The Color-Is-Never-Alone Rule.** The palette leans on red and green, so status, feedback, and diffs must always carry an icon, label, or shape in addition to color. Color-blind readers must lose nothing.

## 3. Typography

**Display & Body Font:** Lexend Variable (with system-ui, -apple-system, Segoe UI, Roboto fallbacks)
**Code Font:** JetBrains Mono Variable (with ui-monospace, SF Mono, Menlo, Consolas fallbacks)

**Character:** One humanist sans carries everything — headings, body, labels, UI — in multiple weights, paired only with a monospace for code (a genuine structure-contrast pairing, not two similar sans). Lexend was tuned from reading-proficiency research, so it earns its place on a behavioral-science site, and its rounded forms echo the lowercase "jspsych" wordmark. Both are self-hosted variable fonts, latin-subset, `font-display: swap`.

### Hierarchy
- **Display** (600, `clamp(2.1rem, 1.4rem + 3vw, 3.4rem)`, line-height 1.05, letter-spacing -0.025em): Homepage hero headline only.
- **Heading** (600, `clamp(1.5rem, 1.2rem + 1.4vw, 2.1rem)`, line-height 1.2, letter-spacing -0.018em on h1/h2): Section and page titles.
- **Body** (400, 1rem, line-height 1.7): All prose. Cap measure at 65–75ch; long-form prose uses `text-wrap: pretty`.
- **Label** (600, 0.72rem, letter-spacing 0.01em): Small status chips like the demo's "Live experiment" badge.
- **Code** (400, 0.95em, JetBrains Mono): Inline code and code blocks; **ligatures disabled** so exact characters read true.

### Named Rules
**The Tighten-Only-Large Rule.** Negative letter-spacing applies only to the larger headings (display/h1/h2). Body and small headings keep default tracking; tightening small text cramps it.

**The Balance-The-Headline Rule.** h1–h3 use `text-wrap: balance` for even line lengths; headlines never ship ragged or overflowing — test copy at every breakpoint.

## 4. Elevation

Mostly flat, with depth conveyed by **tonal layering** (surface lightness) rather than heavy shadows. In light mode, elevated surfaces step up from paper to mist; in dark mode, depth comes entirely from lighter surface tones (forest-black → deep-pine), never from shadow. Shadows appear sparingly and only on genuinely floating elements (the live demo panel, primary buttons) as soft, low-contrast ambient diffusion — never as a 2014-style hard drop shadow.

### Shadow Vocabulary
- **Panel ambient** (`box-shadow: 0 1px 2px rgba(0,0,0,0.04), 0 12px 28px -18px rgba(0,0,0,0.25)`): The live demo card's quiet lift off the page. Deepens in dark mode.
- **Button lift** (`box-shadow: 0 8px 20px -10px var(--ifm-color-primary)`): A colored, low-opacity glow under primary CTAs only.
- **Hairline separator** (`border-bottom: 1px solid` emphasis-200): How the dark-mode navbar separates from the page instead of a shadow.

### Named Rules
**The Depth-From-Tone Rule.** In dark mode, elevation is lightness, never shadow. If you reach for a drop shadow to separate two dark surfaces, step the surface lightness instead.

## 5. Components

Components are **calm and legible**: quiet surfaces that recede so the documentation leads, with soft radii, full-perimeter borders (never side-stripes), and clear, standard states.

### Buttons
- **Shape:** Gently rounded (8px radius); pills (999px) only for small status chips.
- **Primary:** Forest-green fill, white text, `0.8rem 1.6rem` padding, a colored ambient lift. Hover deepens the green and rises 1–2px.
- **Secondary:** Transparent fill, forest-green text, 1px emphasis border. Hover adopts a forest-green border and a faint surface wash.
- **Hover / Focus:** 120–150ms ease transitions. Keyboard focus shows a 2px **Signal Orange** outline with 2px offset, so it never blends into green controls.

### Cards / Containers
- **Corner Style:** 16px (panels), 12px (insets like the demo stage).
- **Background:** Mist surface (light) / deep pine (dark), one step off the page.
- **Shadow Strategy:** Panel ambient only on floating elements; most containers are flat with a 1px emphasis border.
- **Internal Padding:** Fluid, `clamp(1.25rem, 1rem + 1.5vw, 1.75rem)`.

### Navigation
- **Style:** The navbar **blends into the page background** in both modes (paper in light, forest-black in dark) with a 1px hairline base edge — no saturated bar. Brand presence is carried by the full-color logo mark and a strong, tight wordmark (700), not by bar color. Nav links are heavier than body (600).
- **States:** The active page and hover both show a brand-green link color plus an animated **Signal Orange** underline (2px) that slides in from the left — the navbar's signature wayfinding accent. Logo lifts 1.05× on hover. Both motions are suppressed under reduced motion (the underline snaps instead of sliding).
- **The Blend-Not-Bar Rule.** The navbar never reintroduces a saturated background bar. If it needs more presence, add it through type weight, the colored logo, or the orange underline — never by filling the bar with color.

### Live Experiment Panel (signature component)
The homepage hero's defining element: a surface card running a real jsPsych Corsi-blocks experiment. A "Live experiment" label-chip with a pulsing coral status dot, a Lexend title, the interactive stage (theme-aware block colors read from CSS custom properties — orange highlight, green/coral feedback), and a results card that surfaces the actual data jsPsych recorded (a tap-time table). This is the "show, don't tell" principle made literal; treat it as the brand's hero, not a decoration.

### Motion
State-conveying and brief: 120–250ms ease-out (`cubic-bezier(0.22, 1, 0.36, 1)`) on hover/focus/transition. One gentle hero entrance (`rise`: 10px + fade, ~600ms). Every animation has a `prefers-reduced-motion: reduce` path. No bounce, no elastic, no orchestrated page-load sequences.

## 6. Do's and Don'ts

### Do:
- **Do** let forest green carry the brand and reserve **Signal Orange** for accents, focus rings, selection, and one flourish — ≤10% of any screen.
- **Do** keep body text at Pine Ink / Moonlit Ink (15:1 / 14:1) and never let secondary text go lighter than Slate Sage (`#5e6561`, 6:1).
- **Do** tint neutrals toward the brand green; carry warmth in the accent and type.
- **Do** pair every status/feedback/diff color with an icon, label, or shape — the palette leans red/green.
- **Do** lead with a runnable demo or real code where you'd otherwise write a paragraph.
- **Do** cap prose at 65–75ch and disable ligatures in code so exact characters read true.
- **Do** convey depth in dark mode by stepping surface lightness, not by adding shadows.

### Don't:
- **Don't** ship the **generic Docusaurus default** look — uncustomized green/blue, default footer, stock template cards.
- **Don't** drift **corporate / SaaS-y**: no gradient heroes, marketing buzzwords, or enterprise-cold polish on an academic open-source tool.
- **Don't** make surfaces **cluttered or busy** — no rainbow of admonitions, no decoration competing with content.
- **Don't** go **sterile or intimidating** with cold walls of reference-only text; keep a path for the non-programmer researcher.
- **Don't** use a warm cream/sand/beige background, or token names like `--paper`/`--cream`; neutrals lean green.
- **Don't** use `border-left`/`border-right` greater than 1px as a colored accent stripe; use full borders or background tints.
- **Don't** use gradient text, decorative glassmorphism, or hard 2014-style drop shadows.
- **Don't** color orange as body text; use Signal Orange Ink (`#b55800`) only when orange text is unavoidable.
