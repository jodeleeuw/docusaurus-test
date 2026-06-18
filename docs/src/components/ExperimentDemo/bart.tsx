import Link from '@docusaurus/Link';
import styles from './styles.module.css';
import type {ExperimentDef} from './types';

type BalloonTrial = {
  pumps: number;
  popped: boolean;
  earned: number;
};

type BartResults = {
  total: number;
  balloons: number;
  pumps: number;
  trials: BalloonTrial[];
};

const BALLOONS = 3;
const POINTS_PER_PUMP = 5;
// Tune the inflation curve so a balloon looks comfortably full near its limit.
const MAX_PUMPS = 14;

// A friendly risk range: enough headroom to feel rewarding, enough danger to
// make the choice real. Each balloon pops somewhere in 6–14 pumps.
function popThreshold(): number {
  return Math.floor(Math.random() * 9) + 6;
}

export const bart: ExperimentDef<BartResults> = {
  id: 'bart',
  tabLabel: 'Balloon task',
  title: 'The Balloon Analogue Risk Task',
  lead: 'Pump the balloon to earn points — but bank them before it bursts. Three balloons, each with a hidden limit.',
  startLabel: 'Start the experiment',

  async build(ctx) {
    const bartModule = await import('@jspsych-contrib/plugin-bart');
    const Bart = bartModule.default;

    const balloonColor = ctx.readVar('--demo-balloon', '#e0503b');

    // Theme the plugin's info boxes and value/label text via its parameters so
    // the display tracks light/dark with the rest of the panel. The boxes are
    // borderless filled readouts (not nested cards): a subtle fill on the
    // canvas, no outline.
    const theme = {
      value: ctx.readVar('--ifm-heading-color', '#15201a'),
      label: ctx.readVar('--ifm-color-content-secondary', '#5e6561'),
      box: ctx.readVar('--ifm-background-surface-color', '#f4f8f5'),
    };

    // Scale the plugin's balloon stage down to the compact hero panel; its SVG
    // sizes itself to this height.
    const stageHeight = Math.max(
      170,
      Math.min(230, Math.round(ctx.stage.clientWidth * 0.55)),
    );

    // The plugin tracks points per trial only; we thread the running total
    // across balloons through this closure.
    let total = 0;

    return Array.from({length: BALLOONS}, () => ({
      type: Bart,
      pop_threshold: popThreshold(),
      max_pumps: MAX_PUMPS,
      points_per_pump: POINTS_PER_PUMP,
      balloon_color: balloonColor,
      balloon_stage_height: stageHeight,
      value_text_color: theme.value,
      label_text_color: theme.label,
      info_box_border_color: 'transparent',
      info_box_background_color: theme.box,
      pump_animation_duration: ctx.reduceMotion ? 0 : 200,
      pop_animation_duration: ctx.reduceMotion ? 0 : 300,
      starting_total_points: () => total,
      on_finish: (data: {total_points: number}) => {
        total = data.total_points;
      },
      data: {phase: 'balloon'},
    }));
  },

  collect(jsPsych) {
    const balloons = jsPsych.data
      .get()
      .filter({phase: 'balloon'})
      .values() as Array<{
      pumps: number;
      popped: boolean;
      points_earned: number;
    }>;

    const trials: BalloonTrial[] = balloons.map((b) => ({
      pumps: b.pumps,
      popped: b.popped,
      earned: b.points_earned,
    }));
    const total = trials.reduce((sum, t) => sum + t.earned, 0);
    const pumps = trials.reduce((sum, t) => sum + t.pumps, 0);

    return {total, balloons: trials.length, pumps, trials};
  },

  renderResults(results, rerun) {
    return (
      <div className={styles.results} role="status">
        {results.total > 0 ? (
          <p className={styles.score}>
            You banked: <strong>{results.total}</strong>
          </p>
        ) : (
          <p className={styles.score}>Pop! Zero points — risk is tricky.</p>
        )}
        <p className={styles.scoreSub}>
          jsPsych just recorded <strong>{results.balloons}</strong> balloons and{' '}
          <strong>{results.pumps}</strong> pumps — with the exact time of every
          one.
        </p>

        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th scope="col">Balloon</th>
              <th scope="col">Pumps</th>
              <th scope="col">Outcome</th>
            </tr>
          </thead>
          <tbody>
            {results.trials.map((t, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{t.pumps}</td>
                <td>
                  <span
                    className={
                      t.popped ? styles.tagWrong : styles.tagCorrect
                    }>
                    {t.popped ? '✕ popped' : `✓ banked ${t.earned}`}
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
      <Link to="/docs/current/reference/plugins">bart plugin</Link>.
    </>
  ),
};
