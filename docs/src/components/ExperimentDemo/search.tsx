import Link from '@docusaurus/Link';
import styles from './styles.module.css';
import type {ExperimentDef} from './types';

type SearchTrial = {
  setSize: number;
  rt: number;
  correct: boolean;
};

type SearchResults = {
  found: number;
  total: number;
  slope: number | null;
  trials: SearchTrial[];
};

// Display sizes grow each round so search time visibly climbs with clutter.
const SET_SIZES = [4, 8, 12];
const ROTATIONS = [0, 90, 180, 270];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// A rotated "T" (target) or "L" (distractor) as an inline SVG data URI, drawn
// in the given ink color. T-among-L is the classic search that resists pop-out,
// so response time scales with the number of items.
function glyph(kind: 'T' | 'L', color: string): string {
  const path =
    kind === 'T'
      ? 'M22 34 H78 M50 34 V82' // bar across the top, stem down the middle
      : 'M40 20 V80 H78'; // down then along the foot — a corner junction
  // Single encode of the whole SVG turns the color's `#` into %23; pre-encoding
  // it here would double-encode and render an invalid (invisible) stroke.
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">` +
    `<g transform="rotate(${pick(ROTATIONS)} 50 50)" fill="none" stroke="${color}" ` +
    `stroke-width="12" stroke-linecap="round" stroke-linejoin="round">` +
    `<path d="${path}"/></g></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export const search: ExperimentDef<SearchResults> = {
  id: 'search',
  tabLabel: 'Visual search',
  title: 'Visual search',
  lead: 'Find the T hidden among the Ls and tap it. Each round adds more items to scan.',
  startLabel: 'Start the experiment',

  async build(ctx) {
    const mod = await import(
      '@jspsych-contrib/plugin-visual-search-click-target'
    );
    const VisualSearch = mod.default;

    const ink = ctx.readVar('--ifm-color-content', '#1f2622');

    return SET_SIZES.map((setSize) => {
      // One target plus (setSize - 1) distractors, each with its own rotation.
      const images = [
        glyph('T', ink),
        ...Array.from({length: setSize - 1}, () => glyph('L', ink)),
      ];
      return {
        type: VisualSearch,
        images,
        target_present: true,
        target_index: 0,
        fit_container: true,
        show_absent_button: false,
        background_color: 'transparent',
        image_size: 11,
        search_area_width: 94,
        search_area_height: 92,
        data: {phase: 'search', setSize},
      };
    });
  },

  collect(jsPsych) {
    const raw = jsPsych.data
      .get()
      .filter({phase: 'search'})
      .values() as Array<{setSize: number; rt: number; correct: boolean}>;

    const trials: SearchTrial[] = raw.map((t) => ({
      setSize: t.setSize,
      rt: t.rt,
      correct: t.correct,
    }));
    const found = trials.filter((t) => t.correct).length;

    // Search slope: extra milliseconds per added item, from the correct trials
    // at the smallest and largest displays. Null if there isn't a clean pair.
    const hits = trials.filter((t) => t.correct);
    let slope: number | null = null;
    if (hits.length >= 2) {
      const lo = hits.reduce((a, b) => (b.setSize < a.setSize ? b : a));
      const hi = hits.reduce((a, b) => (b.setSize > a.setSize ? b : a));
      if (hi.setSize > lo.setSize) {
        const s = Math.round((hi.rt - lo.rt) / (hi.setSize - lo.setSize));
        if (Number.isFinite(s) && s > 0) slope = s;
      }
    }

    return {found, total: trials.length, slope, trials};
  },

  renderResults(results, rerun) {
    return (
      <div className={styles.results} role="status">
        {results.slope != null ? (
          <p className={styles.score}>
            Search slope: <strong>{results.slope}</strong> ms / item
          </p>
        ) : results.found > 0 ? (
          <p className={styles.score}>Found it.</p>
        ) : (
          <p className={styles.score}>Tricky — keep looking.</p>
        )}
        <p className={styles.scoreSub}>
          jsPsych timed every search — the more items on screen, the longer it
          took to find the T.
        </p>

        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th scope="col">Items</th>
              <th scope="col">Time (ms)</th>
              <th scope="col">Result</th>
            </tr>
          </thead>
          <tbody>
            {results.trials.map((t, i) => (
              <tr key={i}>
                <td>{t.setSize}</td>
                <td className={styles.rtCell}>{t.rt}</td>
                <td>
                  <span
                    className={
                      t.correct ? styles.tagCorrect : styles.tagWrong
                    }>
                    {t.correct ? '✓ found' : '✕ missed'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className={styles.controls}>
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={rerun}>
            Run again
          </button>
          <Link
            className={styles.codeLink}
            to="/docs/current/reference/plugins">
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
      powered by the community{' '}
      <Link to="/docs/current/reference/plugins">
        visual-search-click-target plugin
      </Link>
      .
    </>
  ),
};
