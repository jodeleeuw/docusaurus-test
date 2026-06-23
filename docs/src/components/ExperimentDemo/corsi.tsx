import Link from '@docusaurus/Link';
import styles from './styles.module.css';
import type {ExperimentDef} from './types';

type InputTrial = {
  len: number;
  correct: boolean;
  rt: number[];
};

type CorsiResults = {
  span: number;
  sequences: number;
  taps: number;
  trials: InputTrial[];
};

const LEVELS = [2, 3, 4];
const BLOCK_COUNT = 9;

function sampleSequence(length: number): number[] {
  const pool = Array.from({length: BLOCK_COUNT}, (_, i) => i);
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, length);
}

export const corsi: ExperimentDef<CorsiResults> = {
  id: 'corsi',
  tabLabel: 'Corsi blocks',
  title: 'The Corsi block test',
  lead: 'Watch the sequence light up, then tap the blocks back in the same order. It grows by one each round.',
  startLabel: 'Start the experiment',

  async build(ctx) {
    const corsiModule = await import('@jspsych-contrib/plugin-corsi-blocks');
    const CorsiBlocks = corsiModule.default;

    // Pull the block colors from the live theme so the demo tracks light/dark.
    const colors = {
      block: ctx.readVar('--demo-block', '#5e6561'),
      highlight: ctx.readVar('--demo-highlight', '#f18426'),
      correct: ctx.readVar('--demo-correct', '#00904f'),
      incorrect: ctx.readVar('--demo-incorrect', '#db3424'),
    };

    const shared = {
      type: CorsiBlocks,
      block_size: 14,
      display_width: `${ctx.size}px`,
      display_height: `${ctx.size}px`,
      block_color: colors.block,
      highlight_color: colors.highlight,
      correct_color: colors.correct,
      incorrect_color: colors.incorrect,
      sequence_block_duration: ctx.reduceMotion ? 800 : 550,
      sequence_gap_duration: ctx.reduceMotion ? 350 : 220,
      pre_stim_duration: 450,
      response_animation_duration: ctx.reduceMotion ? 0 : 350,
    };

    return LEVELS.flatMap((len) => {
      const sequence = sampleSequence(len);
      return [
        {...shared, sequence, mode: 'display'},
        {...shared, sequence, mode: 'input', data: {phase: 'input', len}},
      ];
    });
  },

  collect(jsPsych) {
    const inputTrials = jsPsych.data
      .get()
      .filter({phase: 'input'})
      .values() as Array<{len: number; correct: boolean; rt: number[]}>;

    const trials: InputTrial[] = inputTrials.map((t) => ({
      len: t.len,
      correct: t.correct,
      rt: t.rt,
    }));
    const span = trials
      .filter((t) => t.correct)
      .reduce((m, t) => Math.max(m, t.len), 0);
    const taps = trials.reduce((sum, t) => sum + t.rt.length, 0);

    return {span, sequences: trials.length, taps, trials};
  },

  renderResults(results, rerun) {
    return (
      <div className={styles.results} role="status">
        {results.span > 0 ? (
          <p className={styles.score}>
            Your Corsi span: <strong>{results.span}</strong>
          </p>
        ) : (
          <p className={styles.score}>Tricky, isn&apos;t it?</p>
        )}
        <p className={styles.scoreSub}>
          jsPsych just recorded <strong>{results.sequences}</strong> sequences
          and <strong>{results.taps}</strong> taps — with the exact time of
          every click.
        </p>

        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th scope="col">Length</th>
              <th scope="col">Result</th>
              <th scope="col">Tap times (ms)</th>
            </tr>
          </thead>
          <tbody>
            {results.trials.map((t, i) => (
              <tr key={i}>
                <td>{t.len}</td>
                <td>
                  <span
                    className={
                      t.correct ? styles.tagCorrect : styles.tagWrong
                    }>
                    {t.correct ? '✓ correct' : '✕ missed'}
                  </span>
                </td>
                <td className={styles.rtCell}>
                  {t.rt.length ? t.rt.join(', ') : '—'}
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
            to="/docs/current/learn/tutorials/rt-task">
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
      <Link to="/docs/current/reference/plugins">corsi-blocks plugin</Link>.
    </>
  ),
};
