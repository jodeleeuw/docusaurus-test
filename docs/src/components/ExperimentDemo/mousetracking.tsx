import Link from '@docusaurus/Link';
import styles from './styles.module.css';
import type {ExperimentDef} from './types';

// One mouse sample: viewport pixel coords and ms-since-trial-start, exactly as
// the mouse-tracking extension records them.
type Sample = {x: number; y: number; t: number; event: string};
type Rect = {left: number; top: number; width: number; height: number};

type MouseResults = {
  samples: Sample[];
  // Bounding rects of the two answer buttons, in the same viewport coordinate
  // space as the samples — so we can plot the path against the targets.
  targets: {fish?: Rect; mammal?: Rect};
  choice: number | null;
  correct: boolean;
  rt: number | null;
  pathLength: number;
};

// The question. "whale" is the classic mouse-tracking item: an atypical mammal,
// so the cursor often drifts toward "Fish" before committing — the curvature
// the trajectory is meant to reveal.
const CHOICES = ['Fish', 'Mammal'];
const CORRECT = 1; // Mammal

// Stage-local selectors handed to the extension; their on-screen rectangles are
// captured at trial start and returned alongside the movement data.
const SEL_FISH = '#jspsych-html-button-response-btngroup [data-choice="0"]';
const SEL_MAMMAL = '#jspsych-html-button-response-btngroup [data-choice="1"]';

function rectFrom(t: unknown): Rect | undefined {
  if (!t || typeof t !== 'object') return undefined;
  const r = t as Record<string, number>;
  return {left: r.left, top: r.top, width: r.width, height: r.height};
}

/**
 * Project the recorded viewport coordinates into a tight local frame so the
 * path and the two buttons can be drawn in one SVG, regardless of where the
 * panel sat on the page when the trial ran. Returns the polyline points, the
 * start/end markers, the button rectangles, and the viewBox — all in the same
 * units.
 */
function project(results: MouseResults) {
  const {samples, targets} = results;
  const rects = [targets.fish, targets.mammal].filter(Boolean) as Rect[];

  // Union of every sample and every button corner, so nothing is clipped.
  const xs = [
    ...samples.map((s) => s.x),
    ...rects.flatMap((r) => [r.left, r.left + r.width]),
  ];
  const ys = [
    ...samples.map((s) => s.y),
    ...rects.flatMap((r) => [r.top, r.top + r.height]),
  ];
  const pad = 14;
  const minX = Math.min(...xs) - pad;
  const minY = Math.min(...ys) - pad;
  const w = Math.max(...xs) - minX + pad;
  const h = Math.max(...ys) - minY + pad;

  const tx = (x: number) => x - minX;
  const ty = (y: number) => y - minY;

  const points = samples.map((s) => `${tx(s.x)},${ty(s.y)}`).join(' ');
  const start = samples[0];
  const end = samples[samples.length - 1];

  const target = (r?: Rect) =>
    r && {x: tx(r.left), y: ty(r.top), width: r.width, height: r.height};

  return {
    viewBox: `0 0 ${w} ${h}`,
    points,
    start: start && {x: tx(start.x), y: ty(start.y)},
    end: end && {x: tx(end.x), y: ty(end.y)},
    fish: target(targets.fish),
    mammal: target(targets.mammal),
  };
}

export const mousetracking: ExperimentDef<MouseResults> = {
  id: 'mousetracking',
  tabLabel: 'Mouse tracking',
  title: 'Tracking the cursor',
  lead: 'Answer one question by moving your cursor to a button. jsPsych records the whole path — then draws it back to you.',
  startLabel: 'Start the experiment',

  // Register the extension on the jsPsych instance. Same module the trial below
  // imports, so the class identity matches.
  async extensions() {
    const {default: MouseTracking} = await import(
      '@jspsych/extension-mouse-tracking'
    );
    return [{type: MouseTracking}];
  },

  async build() {
    const [{default: htmlButtonResponse}, {default: MouseTracking}] =
      await Promise.all([
        import('@jspsych/plugin-html-button-response'),
        import('@jspsych/extension-mouse-tracking'),
      ]);

    return [
      {
        type: htmlButtonResponse,
        stimulus: `
          <div class="${styles.mtPrompt}">
            <p class="${styles.mtQuestion}">Is a <strong>whale</strong> a&hellip;</p>
            <p class="${styles.mtHint}">Move your cursor up to your answer.</p>
          </div>`,
        choices: CHOICES,
        button_layout: 'flex',
        // Track movement plus the click, and capture where the buttons sit so we
        // can plot the path against them afterward.
        extensions: [
          {
            type: MouseTracking,
            params: {
              events: ['mousemove', 'mousedown', 'mouseup'],
              targets: [SEL_FISH, SEL_MAMMAL],
            },
          },
        ],
        data: {phase: 'mt'},
      },
    ];
  },

  collect(jsPsych) {
    const trial = jsPsych.data.get().filter({phase: 'mt'}).values()[0] as
      | {
          mouse_tracking_data?: Sample[];
          mouse_tracking_targets?: Record<string, unknown>;
          response: number | null;
          rt: number | null;
        }
      | undefined;

    const samples = trial?.mouse_tracking_data ?? [];
    const rawTargets = trial?.mouse_tracking_targets ?? {};
    const choice = trial?.response ?? null;

    // Cumulative distance the cursor traveled, in pixels.
    let pathLength = 0;
    for (let i = 1; i < samples.length; i++) {
      pathLength += Math.hypot(
        samples[i].x - samples[i - 1].x,
        samples[i].y - samples[i - 1].y,
      );
    }

    return {
      samples,
      targets: {
        fish: rectFrom(rawTargets[SEL_FISH]),
        mammal: rectFrom(rawTargets[SEL_MAMMAL]),
      },
      choice,
      correct: choice === CORRECT,
      rt: trial?.rt ?? null,
      pathLength: Math.round(pathLength),
    };
  },

  renderResults(results, rerun) {
    const geo = project(results);
    const enoughPath = results.samples.length >= 2;

    const targetMarker = (
      t: {x: number; y: number; width: number; height: number} | undefined,
      label: string,
      chosen: boolean,
    ) =>
      t && (
        <g>
          <rect
            x={t.x}
            y={t.y}
            width={t.width}
            height={t.height}
            rx={8}
            className={chosen ? styles.mtTargetChosen : styles.mtTarget}
          />
          <text
            x={t.x + t.width / 2}
            y={t.y + t.height / 2}
            className={styles.mtTargetLabel}>
            {label}
          </text>
        </g>
      );

    return (
      <div className={styles.results} role="status">
        <p className={styles.score}>
          {results.choice == null
            ? 'No answer recorded.'
            : results.correct
              ? 'You chose mammal — correct.'
              : 'You chose fish.'}
        </p>
        <p className={styles.scoreSub}>
          The mouse-tracking extension recorded{' '}
          <strong>{results.samples.length}</strong> cursor positions
          {results.rt != null ? (
            <>
              {' '}
              over <strong>{results.rt}</strong> ms
            </>
          ) : null}{' '}
          — the exact path your hand took, drawn below.
        </p>

        {enoughPath ? (
          <svg
            className={styles.mtSvg}
            viewBox={geo.viewBox}
            preserveAspectRatio="xMidYMid meet"
            role="img"
            aria-label="Your recorded cursor trajectory from the question to the button you chose">
            {targetMarker(geo.fish, 'Fish', results.choice === 0)}
            {targetMarker(geo.mammal, 'Mammal', results.choice === 1)}
            <polyline points={geo.points} className={styles.mtPath} />
            {geo.start && (
              <circle
                cx={geo.start.x}
                cy={geo.start.y}
                r={5}
                className={styles.mtStart}
              />
            )}
            {geo.end && (
              <circle
                cx={geo.end.x}
                cy={geo.end.y}
                r={6}
                className={styles.mtEnd}
              />
            )}
          </svg>
        ) : (
          <p className={styles.scoreSub}>
            That was a straight shot — try moving the cursor along a curve next
            time to see the path bend.
          </p>
        )}

        {enoughPath && (
          <p className={styles.mtLegend}>
            <span className={styles.mtLegendStart} /> start
            <span className={styles.mtLegendEnd} /> click
            {results.pathLength > 0 ? (
              <span className={styles.mtLegendMeta}>
                {results.pathLength} px traveled
              </span>
            ) : null}
          </p>
        )}

        <div className={styles.controls}>
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={rerun}>
            Run again
          </button>
          <Link
            className={styles.codeLink}
            to="/docs/current/reference/extensions/list-of-extensions">
            See how it&apos;s built{' '}
            <span className={styles.linkArrow} aria-hidden="true">
              →
            </span>
          </Link>
        </div>
      </div>
    );
  },

  footnote: (
    <>
      This is a real jsPsych experiment, running in your browser right now —
      powered by the{' '}
      <Link to="/docs/current/reference/extensions/list-of-extensions">
        mouse-tracking extension
      </Link>
      .
    </>
  ),
};
