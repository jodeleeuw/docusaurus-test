import {useCallback, useEffect, useRef, useState} from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';
import type {DemoPhase, ExperimentDef, RunContext} from './types';
import {corsi} from './corsi';
import {bart} from './bart';
import {search} from './search';
import {mousetracking} from './mousetracking';

/**
 * Real jsPsych experiments, embedded live in the homepage. The shell owns the
 * jsPsych runtime — lazy-loaded on first interaction so it never touches the
 * SSR pass — and a tab switcher; each experiment is a self-contained
 * definition (see ./types) that supplies its timeline, results, and copy.
 *
 * The tasks are click/touch-only (no keyboard capture, which would fight the
 * surrounding page) and short. When a run finishes we surface the data jsPsych
 * collected — the point of the demo.
 */

const EXPERIMENTS: ExperimentDef<any>[] = [corsi, bart, search, mousetracking];

function makeReadVar(el: HTMLElement) {
  return (name: string, fallback: string): string => {
    const v = getComputedStyle(el).getPropertyValue(name).trim();
    return v || fallback;
  };
}

export default function ExperimentDemo(): React.ReactNode {
  const stageRef = useRef<HTMLDivElement>(null);
  const jsPsychRef = useRef<{abortExperiment?: () => void} | null>(null);
  // Bumped whenever a run is superseded (tab switch, rerun, unmount) so an
  // in-flight async load knows to bail instead of mounting a stale run.
  const runToken = useRef(0);

  const [activeId, setActiveId] = useState(EXPERIMENTS[0].id);
  const [phase, setPhase] = useState<DemoPhase>('idle');
  const [results, setResults] = useState<unknown>(null);

  const active =
    EXPERIMENTS.find((e) => e.id === activeId) ?? EXPERIMENTS[0];

  const abort = useCallback(() => {
    runToken.current += 1;
    try {
      jsPsychRef.current?.abortExperiment?.();
    } catch {
      /* already finished */
    }
    jsPsychRef.current = null;
  }, []);

  // Tear down any in-flight run if the component unmounts mid-experiment.
  useEffect(() => abort, [abort]);

  const run = useCallback(async () => {
    const stage = stageRef.current;
    if (!stage) return;
    const def = active;

    abort();
    const myToken = runToken.current;

    setResults(null);
    setPhase('running');
    stage.innerHTML = '';

    const reduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Square display sized to the panel, capped for large screens.
    const size = Math.max(
      220,
      Math.min(340, Math.round(stage.clientWidth - 8)),
    );

    const ctx: RunContext = {
      stage,
      reduceMotion,
      size,
      readVar: makeReadVar(stage),
    };

    const [{initJsPsych}, timeline, extensions] = await Promise.all([
      import('jspsych'),
      def.build(ctx),
      def.extensions?.(ctx) ?? Promise.resolve(undefined),
    ]);

    // Bail if the user switched tabs or left while the bundle was loading.
    if (runToken.current !== myToken || stageRef.current !== stage) return;

    const jsPsych = initJsPsych({
      display_element: stage,
      extensions,
      on_finish: () => {
        if (runToken.current !== myToken) return;
        setResults(def.collect(jsPsych));
        setPhase('done');
        jsPsychRef.current = null;
      },
    });
    jsPsychRef.current = jsPsych as unknown as {abortExperiment?: () => void};
    jsPsych.run(timeline);
  }, [active, abort]);

  const selectTab = useCallback(
    (id: string) => {
      if (id === activeId) return;
      abort();
      setActiveId(id);
      setPhase('idle');
      setResults(null);
      if (stageRef.current) stageRef.current.innerHTML = '';
    },
    [activeId, abort],
  );

  return (
    <figure className={styles.panel}>
      <figcaption className={styles.header}>
        <div
          className={styles.tabs}
          role="group"
          aria-label="Choose an experiment">
          {EXPERIMENTS.map((e) => {
            const selected = e.id === activeId;
            return (
              <button
                key={e.id}
                type="button"
                aria-pressed={selected}
                className={clsx(styles.tab, selected && styles.tabActive)}
                onClick={() => selectTab(e.id)}>
                {e.tabLabel}
              </button>
            );
          })}
        </div>
        <h2 className={styles.title}>{active.title}</h2>
        <p className={styles.lead}>{active.lead}</p>
      </figcaption>

      <div className={styles.stageWrap}>
        <div
          ref={stageRef}
          className={styles.stage}
          role="application"
          aria-label={active.title}
          data-phase={phase}
          data-experiment={active.id}
        />

        {phase === 'idle' && (
          <div className={styles.overlay}>
            <button
              type="button"
              className={styles.primaryButton}
              onClick={run}>
              {active.startLabel}
            </button>
          </div>
        )}

        {phase === 'done' &&
          results != null &&
          active.renderResults(results, run)}
      </div>

      <p className={styles.footnote}>{active.footnote}</p>
    </figure>
  );
}
