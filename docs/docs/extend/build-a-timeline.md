---
title: Build a timeline
description: Package a reusable, parameterized experimental procedure that others can drop into their experiments.
---

# Build a timeline

A **timeline** packages a whole procedure — a task, a questionnaire, an attention check — built from existing plugins, so that you and others can reuse it across experiments with a single import. Shareable timelines are published to the [`jspsych-timelines`](https://github.com/jspsych/jspsych-timelines) repository.

:::note Page under construction
This guide still needs to be written. The structure below outlines what it should cover.

**TODO:**
- When to build a timeline vs. a [plugin](plugins/plugin-tutorial.md).
- Scaffolding a new timeline with `npx @jspsych/new-timeline`.
- The expected export shape: `createTimeline`, `timelineUnits`, and `utils`.
- Parameterizing a timeline so researchers can configure it.
- Testing and documenting a timeline.
- Publishing to `jspsych-timelines` (see [Publish & share](publish-and-share.md)).
:::

## See also

- [Build a plugin](plugins/plugin-tutorial.md)
- [Publish & share](publish-and-share.md)
- [The timeline](../learn/concepts/timeline.md) concept page
