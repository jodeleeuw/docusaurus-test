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
const SET_SIZES = [6, 12, 18];

type Color = 'target' | 'other';
type Orient = 'vertical' | 'horizontal';

// A colored bar in one of two orientations, as an inline SVG data URI. The
// target is one specific (color, orientation) pairing; every distractor shares
// exactly one of those two features. Because no single feature isolates the
// target, attention can't pop out to it — this is a conjunction search, and
// response time climbs steeply with the number of items.
function bar(color: string, orient: Orient): string {
  const rotate = orient === 'horizontal' ? ' transform="rotate(90 50 50)"' : '';
  // Single encode of the whole SVG turns the color's `#` into %23; pre-encoding
  // it here would double-encode and render an invalid (invisible) fill.
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">` +
    `<rect x="38" y="14" width="24" height="72" rx="12" fill="${color}"${rotate}/>` +
    `</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export const search: ExperimentDef<SearchResults> = {
  id: 'search',
  tabLabel: 'Visual search',
  title: 'Visual search',
  lead: 'Find the green upright bar and tap it. Every other bar is either green or upright — only one is both, and each round adds more to scan.',
  startLabel: 'Start the experiment',

  async build(ctx) {
    const mod = await import(
      '@jspsych-contrib/plugin-visual-search-click-target'
    );
    const VisualSearch = mod.default;

    // Two features, two values each. The target is green + vertical; distractors
    // each share exactly one feature with it (green + horizontal, or orange +
    // vertical), which is what makes this a conjunction search.
    const green = ctx.readVar('--ifm-color-primary', '#00683e');
    const orange = ctx.readVar('--jspsych-orange', '#f18426');
    const target = bar(green, 'vertical');

    return SET_SIZES.map((setSize) => {
      // One target plus (setSize - 1) distractors, split evenly between the two
      // single-feature-sharing types so neither feature alone reveals the target.
      const distractors = Array.from({length: setSize - 1}, (_, i) =>
        i % 2 === 0 ? bar(green, 'horizontal') : bar(orange, 'vertical'),
      );
      const images = [target, ...distractors];
      return {
        type: VisualSearch,
        images,
        target_present: true,
        target_index: 0,
        fit_container: true,
        show_absent_button: false,
        background_color: 'transparent',
        image_size: 9,
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
