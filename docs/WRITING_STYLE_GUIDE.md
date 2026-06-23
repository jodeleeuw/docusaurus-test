# jsPsych Documentation Writing Style Guide

This guide describes the house writing style of the jsPsych docs, derived from an
analysis of the existing researcher, tutorial, developer, about/community,
migration, and reference pages. Use it to keep new and edited text consistent
with the established voice.

It is descriptive of what the docs already do well, and prescriptive about the
handful of places where the docs currently drift (see
[Consistency rules](#consistency-rules-fix-on-sight) and the
[pre-publish checklist](#pre-publish-checklist)).

How to use it: when editing a page, match the register of the surrounding
[document type](#guidance-by-document-type), then run the page against the
checklist at the end.

---

## Voice and point of view

The docs speak in a **friendly, instructional voice** that explains *why*, not
just *how*. Three persons are in play; use them deliberately.

- **Second person "you"** is the default for addressing the reader and for
  things the reader does. Use the **imperative** for discrete actions.
  - "You can override any default parameter values by adding them into your trial object."
  - "Create a new file called `experiment.html`." / "Run `npm install jspsych`."

- **Inclusive "we" (author + reader)** for narrating a worked example or
  tutorial, where we build something together.
  - "Suppose we want to create an experiment where people see a set of faces."
  - "First we have to initialize jsPsych. We can do this using the `initJsPsych()` function."

- **Authorial "we" (the jsPsych project)** for recommendations, decisions, and
  asks. This is how the project speaks about itself.
  - "We recommend double checking the simulation output."
  - "We've removed `jsPsych.init()` and split the features into two functions."

Avoid the impersonal third person ("the researcher must…") in narrative prose —
reserve it for the auto-generated [reference docs](#reference-auto-generated),
which are intentionally subjectless ("Ends the current timeline.").

Be honest about limitations rather than overselling. This is part of the voice:

> "Simulation mode is not yet as comprehensively tested as the rest of jsPsych."

---

## Tone

- **Friendly-professional, accessible, not academic.** Light conversational
  touches and reassurance are welcome ("That's it!", "is straightforward",
  "feel free to ask for help with this!"). Keep them occasional, not constant.
- **Explain motivation.** Introduce a feature by the problem it solves before
  showing the mechanism ("A common pattern in behavioral experiments is to
  repeat the same procedure many times…").
- **Reassure during change or difficulty.** Migration guides preempt anxiety:
  "Most of the changes in version 8.x are behind the scenes."
- Scale the hand-holding to the audience: getting-started and tutorials are
  warm and patient; overview/conceptual pages are more matter-of-fact;
  contributor docs are collegial but assume web-dev fluency.

---

## Tense

- **Simple present** for behavior and facts: "Each plugin defines the set of
  parameters…"
- **"X will cause / will create Y"** for the consequence of a setting or action.
  This is the signature explanatory frame — use it:
  "Setting this parameter to a positive integer will cause a blank screen to display."
- **Present perfect "We've …"** for announcing changes (migration guides):
  "We've renamed `jsPsych.endExperiment()` to `jsPsych.abortExperiment()`."
- **Present, subjectless** in reference descriptions: "Returns a jsPsych instance."

---

## Audience and the words for people

Use these terms precisely — the distinction is meaningful and the docs define it
explicitly in the plugin tutorial:

| Term | Means |
|------|-------|
| **participant** | the person taking the experiment. Always use this, never "subject" or "user". (`subject_id` survives only in legacy code identifiers.) |
| **user** / **researcher** | the person *using jsPsych* to build an experiment. |
| **developer** / **contributor** | someone building plugins/extensions or contributing to the library. |

Use singular **"they"** for a generic person. Do not introduce gendered
"she/her" or "he/him" for generic participants or users.

---

## Terminology and capitalization

- **"jsPsych"** — always lowercase "j", capital "P", in every position,
  **including the start of a sentence or heading**. Never "JsPsych", "Jspsych",
  or "JSPsych" in prose.
  - The **class** is `JsPsych` and the **function** is `initJsPsych()` — those
    casings are correct *as code identifiers* (in backticks), and are separate
    from the product name.
- **Core domain terms are lowercase common nouns in prose**: timeline, trial,
  plugin, extension, parameter, node, stimulus. Capitalize them only in headings
  (per heading rules) or when they are a literal API element.
  - Wrap a term in backticks **only when you mean the literal code token**:
    "push the welcome trial to the timeline" (prose) vs. "the trial object must
    have a `type` parameter" (code token).
- **Plugin name vs. plugin type** — both forms are correct and the difference is
  intentional:
  - The plugin **name** is dash-case: `html-keyboard-response`.
  - The plugin **type** value is camelCase starting with `jsPsych`:
    `jsPsychHtmlKeyboardResponse`.
- **JavaScript / TypeScript** — always capital "J", capital "S"; never
  "Javascript". Likewise **Node.js**, **GitHub**, **SurveyJS**.
- **Booleans and JS literals** are lowercase code: `true`, `false`, `null`,
  `"NO_KEYS"`. Never Python-style `True`/`Boolean` in JavaScript context.
- **Acronyms**: expand on first use with the abbreviation in parentheses —
  "inter-trial interval (ITI)", "cross-origin resource sharing (CORS)".
- **Named tasks/paradigms** are Title Case: "Flanker Task", "Stroop paradigm".
- **Version naming**: prefer **"v8.x"** / **"v7.x"** in headings and short
  references, and **"version 8.0"** when naming a specific release. Pick one form
  within a page; don't mix "v7", "version 7.x", and "v7.x" in the same passage.

---

## Spelling and mechanics

- **American English** throughout: behavior, color, customize, analyze,
  initialize, fullscreen. (British spellings only inside proper nouns, e.g.
  "Centre for Comparative Psycholinguistics".)
- **"e.g." and "i.e."** are written that way, inline, lowercase, with a trailing
  comma ("e.g., a click"). They are used liberally — that's fine.
- **Em dashes**: use the actual character `—`, not the HTML entity `&mdash;` and
  not a hyphen. Reserve them for asides; semicolons and parentheses also work.
- **Parenthetical glosses** are characteristic and encouraged for clarifying a
  term inline: "NPM (Node Package Manager)".
- **Units**: a space between number and unit for words ("0 ms", "500
  milliseconds"); abbreviate to "ms" in tables and terse contexts.

---

## Sentence and paragraph style

- Favor **medium-length declarative sentences** in a "statement, then
  elaboration" rhythm.
- Keep **paragraphs short** (1–4 sentences). In tutorials, a single-sentence
  paragraph that introduces the next code block is normal and good:
  "Next, we push the welcome trial to the timeline, which adds it to the end of
  the array."
- The **semantic-line-break** convention (one sentence per source line) is used
  in several files and is fine to keep, but don't mix wrapped and unwrapped
  prose within one paragraph.
- Use **rhetorical questions** sparingly to motivate the next section:
  "What if we wanted to add an additional step?"

---

## Structuring a page and explaining concepts

The reliable pattern is **concept → motivation → example → walkthrough**:

1. Open with a one-sentence **definition**: "In jsPsych, plugins define the
   kinds of trials or events that should occur during the experiment."
2. Give a **motivating scenario** (often hypothetical, "Suppose we want to…").
3. Show a **short, focused code example** — introduce it with a lead-in line
   ending in a colon ("Here's what the code looks like:").
4. **Walk through the code** afterward, referencing it ("In the above version,
   there are four separate trials…").

Additional conventions:

- **Reuse running examples** as teaching vehicles (the Flanker Task and the
  face-name memory procedure recur across pages) rather than inventing a new toy
  example each time.
- In **multi-step tutorials**, build code incrementally and end each part with a
  collapsible "complete code so far":
  ```html
  <details><summary><strong>The complete code so far</strong></summary>
  ...
  </details>
  ```
- Use explicit **"First / Next / Finally"** transitions to sequence steps.
- Prefer the **naive-then-refactor** approach in developer tutorials: show simple
  code, name its limitation, then improve it ("While that works for now, it's
  not exactly flexible.").

---

## Formatting conventions

### Headings

- **Sentence case** is the house standard: "Repository structure", "Using a
  plugin", "Adding data to all trials". Capitalize only the first word and
  proper nouns (including "jsPsych").
- Phrase section headings as **task/gerund or noun phrases** ("Looping
  timelines", "Modifying timelines at runtime").
- Don't skip heading levels (no `####` directly under `##`).

### Inline code

- Backtick **every** identifier, filename, parameter, value, command, path, and
  protocol: `type`, `experiment.html`, `initJsPsych()`, `file://`, `true`.
- When referring to a function as a call, include the parentheses
  (`initJsPsych()`); be consistent within a page.

### Code blocks

- Always **language-tag** fences. Standardize on **`js`** for JavaScript and
  **`ts`** for TypeScript (not `javascript`/`JavaScript`); use `html`, `sh`,
  `php`, `json` as appropriate. **Tag TypeScript content `ts`** even if the
  surrounding narrative calls it "JavaScript".
- Use **modern JS**: `const`/`let`, never `var`, in all new and edited examples.
- Use Docusaurus features for emphasis and context:
  - Line highlighting with `{5}` / `{13-16}` (the MkDocs `hl_lines="…"` syntax
    does **not** render in Docusaurus — replace it on sight).
  - Filename labels with `title="src/index.ts"`.
- Make examples **valid and runnable** — watch for missing commas between object
  properties and unclosed brackets.

### Admonitions

Use Docusaurus admonitions; do **not** indent the body (indented bodies render
as code blocks):

```md
:::tip
Helpful, optional advice.
:::
```

| Admonition | Use for |
|------------|---------|
| `:::tip` | optional best-practice advice |
| `:::note` | clarifying caveats / asides |
| `:::info` | tooling, citations, environment notes |
| `:::warning` | things that can go wrong if ignored |
| `:::danger` | security risks and serious gotchas |

Inline `Note that …` is also an accepted lighter-weight caveat.

### Tables, lists, links

- **Tables** for enumerable reference data (parameters: Name / Type / Default /
  Description; data fields; plugin name vs. type).
- **Lists**: use `-` as the bullet marker (standardize; the docs currently mix
  `-` and `*`). Numbered lists for ordered procedures. A common item shape is
  **`Bold name` — description** or `` `code` `` — description.
- **Links**: inline `[text](path)`. For internal links use root-relative doc
  paths with the `.md`/`.mdx` extension and anchors
  (`learn/researchers/overview/data.md#section`); be consistent within a page
  rather than mixing bare-filename, `../`, and full-URL forms. **Never ship an
  empty `[text]()` link** — fill the target or remove the link.

### Front matter

- Include a `title:` and `description:` where the page warrants it; otherwise the
  H1 serves as the title. Be consistent within a section.
- Preserve project-specific front matter that already exists (`sidebar_position`,
  `pageData`/migration status) when editing.

---

## Guidance by document type

- **Conceptual / overview** (`learn/researchers/overview/*`): concept-first,
  example-driven, second person + inclusive "we"; present tense and "will cause"
  framing; motivate each feature.
- **Tutorial / getting-started**: warmest and most patient; "we"-narrated with
  imperatives for filesystem/CLI actions; incremental code with "complete code so
  far" collapsibles; "First/Next/Finally" sequencing.
- **Developer / contributor** (`learn/developers/*`): collegial, assumes web-dev
  fluency, explains jsPsych-specific machinery; "we recommend…", "As of version
  X.X…"; naive-then-refactor pedagogy. Define "user" vs. "participant" when both
  appear.
- **Migration guides** (`support/migration-*`): calm and reassuring; per-change
  `##` sections; **labeled before/after code pairs** ("Version 7.x:" → code →
  "Version 8.x:" → code); present-perfect "We've…"; always give an **escape
  hatch** ("If you relied on the old behavior, you can…"); close with a
  **"Need help?"** section linking the support thread.
- **About / community / support**: warmest promotional register; first-person
  project "we" + invitational "feel free to…"; enthusiasm (sparing exclamation
  points) is on-brand here.
- <a id="reference-auto-generated"></a>**Reference**
  (`reference/*`): largely **auto-generated by TypeDoc** (see the reference
  pipeline note). Structure is templated; the **Description/Parameters prose is
  hand-written**. Keep that prose terse, present-tense, and impersonal ("Ends the
  experiment, skipping all remaining trials."), and edit it **at the TypeScript
  source**, not in the generated Markdown.

---

## Signature phrasings

These read as "jsPsych docs" — reach for them, but vary so they don't become tics:

- "For example, …" / "For instance, …"
- "This is useful for …" / "This can be useful for …"
- "By default, jsPsych will …"
- "Note that …"
- "To <do X>, you / we <do Y> …"
- "Here's an example of …"
- "We recommend …" / "We strongly encourage …"
- "As of version X.X, …"
- "We've <verb> …" (migration)
- "If you relied on the old behavior, you can …" (migration)
- "feel free to …" (community/support)

---

## Consistency rules (fix on sight)

The current docs drift on these points. When you touch a page, bring it into
line:

1. **"jsPsych"** mis-cased as "JsPsych" in prose (the class identifier in
   backticks is exempt).
2. **"Javascript"** → **"JavaScript"**; "Typescript" → "TypeScript".
3. **`var`** in examples → **`const`/`let`**.
4. **Code-fence tags**: `javascript`/`JavaScript` → `js`; tag TS as `ts`.
5. **`hl_lines="…"`** (MkDocs) → Docusaurus `{…}` line highlighting.
6. **Indented admonition bodies** → un-indent.
7. **Empty `[text]()` links** → fill or remove.
8. **Bullet markers** `*` → `-`.
9. **Python-style `True`/`Boolean`** in JS → `true` / boolean.
10. **`&mdash;`** → `—`.
11. **Stale toolchain references** (MkDocs/`mike serve`) → the Docusaurus
    workflow.
12. **Spelling typos** and **editorial leftovers** (e.g. stray
    `<!-- check with Josh -->` comments) → remove/fix.
13. **Invalid example code** (missing commas, unclosed brackets) → make it run.

---

## Pre-publish checklist

- [ ] Right **voice** for the document type; "you"/"we" used deliberately.
- [ ] **"participant"** (not "subject"/"user") for the person taking the study.
- [ ] **"jsPsych"** cased correctly everywhere in prose.
- [ ] **Headings** in sentence case, no skipped levels.
- [ ] **American spelling**; no typos.
- [ ] Code uses **`const`/`let`**, valid syntax, correct **language tags**
      (`js`/`ts`), Docusaurus highlighting.
- [ ] **Admonitions** un-indented and using the right type.
- [ ] **No empty links**; internal links use consistent root-relative paths.
- [ ] New feature is **motivated**, shown with a **focused example**, then
      explained.
- [ ] Migration entries have **before/after pairs** and an **escape hatch**.
</content>
</invoke>
