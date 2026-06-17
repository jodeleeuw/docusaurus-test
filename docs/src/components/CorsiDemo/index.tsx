import {useCallback, useEffect, useRef, useState} from 'react';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

/**
 * A real jsPsych experiment, embedded live in the homepage. It runs the
 * community Corsi-blocks plugin (@jspsych-contrib/plugin-corsi-blocks) on the
 * actual jsPsych runtime — the same library the docs describe. jsPsych and the
 * plugin are loaded lazily on first interaction so they never touch the SSR
 * pass and stay out of the initial bundle.
 *
 * The task is click/touch-only (no keyboard capture, which would fight the
 * surrounding page) and short: three sequences of increasing length. When it
 * finishes we surface the data jsPsych collected — the point of the demo.
 */

type Phase = 'idle' | 'running' | 'done';

type InputTrial = {
  len: number;
  correct: boolean;
  rt: number[];
};

type Results = {
  span: number;
  sequences: number;
  taps: number;
  trials: InputTrial[];
};

const LEVELS = [2, 3, 4];
const BLOCK_COUNT = 9;

function readVar(el: HTMLElement, name: string, fallback: string): string {
  const v = getComputedStyle(el).getPropertyValue(name).trim();
  return v || fallback;
}

function sampleSequence(length: number): number[] {
  const pool = Array.from({length: BLOCK_COUNT}, (_, i) => i);
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, length);
}

export default function CorsiDemo(): React.ReactNode {
  const stageRef = useRef<HTMLDivElement>(null);
  const jsPsychRef = useRef<{abortExperiment?: () => void} | null>(null);
  const [phase, setPhase] = useState<Phase>('idle');
  const [results, setResults] = useState<Results | null>(null);

  // Tear down any in-flight run if the component unmounts mid-experiment.
  useEffect(() => {
    return () => {
      try {
        jsPsychRef.current?.abortExperiment?.();
      } catch {
        /* already finished */
      }
      jsPsychRef.current = null;
    };
  }, []);

  const run = useCallback(async () => {
    const stage = stageRef.current;
    if (!stage) return;

    setResults(null);
    setPhase('running');
    stage.innerHTML = '';

    const [{initJsPsych}, corsiModule] = await Promise.all([
      import('jspsych'),
      import('@jspsych-contrib/plugin-corsi-blocks'),
    ]);
    const CorsiBlocks = corsiModule.default;

    const reduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Pull the block colors from the live theme so the demo tracks light/dark.
    const colors = {
      block: readVar(stage, '--demo-block', '#5e6561'),
      highlight: readVar(stage, '--demo-highlight', '#f18426'),
      correct: readVar(stage, '--demo-correct', '#00904f'),
      incorrect: readVar(stage, '--demo-incorrect', '#db3424'),
    };

    // Square display sized to the panel, capped for large screens.
    const size = Math.max(
      220,
      Math.min(340, Math.round(stage.clientWidth - 8)),
    );

    const jsPsych = initJsPsych({
      display_element: stage,
      on_finish: () => {
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

        setResults({span, sequences: trials.length, taps, trials});
        setPhase('done');
        jsPsychRef.current = null;
      },
    });
    jsPsychRef.current = jsPsych as unknown as {abortExperiment?: () => void};

    const shared = {
      type: CorsiBlocks,
      block_size: 14,
      display_width: `${size}px`,
      display_height: `${size}px`,
      block_color: colors.block,
      highlight_color: colors.highlight,
      correct_color: colors.correct,
      incorrect_color: colors.incorrect,
      sequence_block_duration: reduceMotion ? 800 : 550,
      sequence_gap_duration: reduceMotion ? 350 : 220,
      pre_stim_duration: 450,
      response_animation_duration: reduceMotion ? 0 : 350,
    };

    const timeline = LEVELS.flatMap((len) => {
      const sequence = sampleSequence(len);
      return [
        {...shared, sequence, mode: 'display'},
        {...shared, sequence, mode: 'input', data: {phase: 'input', len}},
      ];
    });

    jsPsych.run(timeline);
  }, []);

  return (
    <figure className={styles.panel}>
      <figcaption className={styles.header}>
        <span className={styles.kicker}>Live experiment</span>
        <h2 className={styles.title}>The Corsi block test</h2>
        <p className={styles.lead}>
          Watch the sequence light up, then tap the blocks back in the same
          order. It grows by one each round.
        </p>
      </figcaption>

      <div className={styles.stageWrap}>
        <div
          ref={stageRef}
          className={styles.stage}
          role="application"
          aria-label="Corsi block tapping task"
          data-phase={phase}
        />

        {phase === 'idle' && (
          <div className={styles.overlay}>
            <button
              type="button"
              className={styles.primaryButton}
              onClick={run}>
              Start the experiment
            </button>
          </div>
        )}

        {phase === 'done' && results && (
          <div className={styles.results} role="status">
            {results.span > 0 ? (
              <p className={styles.score}>
                Your Corsi span: <strong>{results.span}</strong>
              </p>
            ) : (
              <p className={styles.score}>Tricky, isn&apos;t it?</p>
            )}
            <p className={styles.scoreSub}>
              jsPsych just recorded <strong>{results.sequences}</strong>{' '}
              sequences and <strong>{results.taps}</strong> taps — with the
              exact time of every click.
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
                onClick={run}>
                Run again
              </button>
              <Link
                className={styles.codeLink}
                to="/docs/current/learn/researchers/tutorials/rt-task">
                See how it&apos;s built →
              </Link>
            </div>
          </div>
        )}
      </div>

      <p className={styles.footnote}>
        This is a real jsPsych experiment, running in your browser right now —
        powered by the community{' '}
        <Link to="/docs/current/reference/plugins">corsi-blocks plugin</Link>.
      </p>
    </figure>
  );
}
