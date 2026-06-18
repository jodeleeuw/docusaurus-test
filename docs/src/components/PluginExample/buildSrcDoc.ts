/**
 * Build a complete, standalone HTML document that runs an editable jsPsych
 * snippet. The same output is used two ways: as the `srcdoc` of the inline
 * preview iframe, and as the page opened by "Open in new tab" (via a blob URL).
 * Because a `srcdoc` document has the base URL `about:srcdoc`, every asset
 * reference here must be absolute — callers pass already-resolved URLs.
 *
 * The runtime mirrors the static demo files this component replaces: jsPsych
 * and the plugins load from unpkg, and the snippet is handed to
 * `generateDocsDemoTimeline`, which adds the "Run demo" button and the trial
 * data readout. The contract for the snippet is therefore the same one the old
 * demo files used: it must define a `timeline` variable.
 */

export type BuildSrcDocOptions = {
  /** User-editable snippet. Must define a `timeline` variable. */
  code: string;
  /** unpkg specifiers, e.g. `@jspsych/plugin-html-keyboard-response@2.1.0`. */
  dependencies?: string[];
  /** jsPsych core version pulled from unpkg. */
  jspsychVersion: string;
  /** Absolute URLs to the shared demo runtime + stylesheet (in static/demos). */
  assets: {timeline: string; css: string};
};

// generateDocsDemoTimeline builds its "Run demo" / "Repeat demo" / data-readout
// controls with html-button-response, so it is always loaded even if a snippet
// doesn't reference it directly.
const HTML_BUTTON_RESPONSE = '@jspsych/plugin-html-button-response';
const HTML_BUTTON_RESPONSE_VERSION = '2.1.0';

function scriptTag(specifier: string): string {
  return `    <script src="https://unpkg.com/${specifier}"></script>`;
}

export function buildSrcDoc({
  code,
  dependencies = [],
  jspsychVersion,
  assets,
}: BuildSrcDocOptions): string {
  const hasButtonResponse = dependencies.some((d) =>
    d.startsWith(HTML_BUTTON_RESPONSE),
  );
  const deps = hasButtonResponse
    ? dependencies
    : [...dependencies, `${HTML_BUTTON_RESPONSE}@${HTML_BUTTON_RESPONSE_VERSION}`];

  const depTags = deps.map(scriptTag).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <script src="${assets.timeline}"></script>
    <script src="https://unpkg.com/jspsych@${jspsychVersion}"></script>
${depTags}
    <link rel="stylesheet" href="https://unpkg.com/jspsych@${jspsychVersion}/css/jspsych.css" />
    <link rel="stylesheet" href="${assets.css}" />
    <style>
      html, body { margin: 0; background: #fff; }
      #docs-demo-error {
        margin: 1.5rem; padding: 1rem 1.25rem; white-space: pre-wrap;
        font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
        font-size: 14px; line-height: 1.5; color: #b3261e;
        background: #fdecea; border: 1px solid #f3c4bf; border-radius: 8px;
      }
    </style>
  </head>
  <body></body>
  <script>
    // Surface any error (snippet syntax error, offline CDN, missing timeline)
    // in the iframe itself rather than failing silently.
    window.addEventListener('error', function (event) {
      var message =
        typeof initJsPsych === 'undefined'
          ? 'Could not load jsPsych. You must be online to run this demo.'
          : (event.error && event.error.message) || event.message;
      document.body.innerHTML =
        '<pre id="docs-demo-error">' + message + '</pre>';
    });
  </script>
  <script>
    const jsPsych = initJsPsych();

${code}

    if (typeof timeline === 'undefined') {
      throw new Error('Your code must define a "timeline" variable — an array of trials to run.');
    }
    jsPsych.run(generateDocsDemoTimeline(timeline));
  </script>
</html>`;
}
