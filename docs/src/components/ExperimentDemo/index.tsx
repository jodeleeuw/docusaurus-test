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

/**
 * Track every `requestAnimationFrame` scheduled while a run is active so we can
 * cancel any that are still pending at teardown. Some plugins (corsi-blocks)
 * drive their stimulus sequence on a self-rescheduling rAF loop that lives
 * outside jsPsych's lifecycle, so `abortExperiment()` can't stop it — and once
 * abort empties the trial's DOM, the next frame queries a removed node and
 * throws. Canceling the pending frames first ends the loop cleanly. Nothing
 * else on the site uses rAF, so the only frames captured belong to the running
 * experiment. Returns a disposer that restores the originals and cancels what's
 * left.
 */
function installRafGuard(): () => void {
  if (typeof window === 'undefined') return () => {};

  const realRaf = window.requestAnimationFrame.bind(window);
  const realCancel = window.cancelAnimationFrame.bind(window);
  const pending = new Set<number>();

  const patchedRaf: typeof window.requestAnimationFrame = (cb) => {
    let handle = 0;
    handle = realRaf((t) => {
      pending.delete(handle);
      cb(t);
    });
    pending.add(handle);
    return handle;
  };
  const patchedCancel: typeof window.cancelAnimationFrame = (h) => {
    pending.delete(h);
    realCancel(h);
  };

  window.requestAnimationFrame = patchedRaf;
  window.cancelAnimationFrame = patchedCancel;

  return () => {
    // Only restore if no later run has replaced our patches.
    if (window.requestAnimationFrame === patchedRaf) {
      window.requestAnimationFrame = realRaf;
    }
    if (window.cancelAnimationFrame === patchedCancel) {
      window.cancelAnimationFrame = realCancel;
    }
    pending.forEach((h) => realCancel(h));
    pending.clear();
  };
}

export default function ExperimentDemo(): React.ReactNode {
  const stageRef = useRef<HTMLDivElement>(null);
  const jsPsychRef = useRef<{abortExperiment?: () => void} | null>(null);
  // Each run renders into its own child host (see `run`); kept here so teardown
  // can detach it.
  const hostRef = useRef<HTMLDivElement | null>(null);
  // Disposer for the active run's requestAnimationFrame guard (see run/abort).
  const rafGuardRef = useRef<(() => void) | null>(null);
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
    // Cancel the run's stray animation frames *before* aborting, so a plugin's
    // self-rescheduling rAF loop can't fire against the DOM that abort tears
    // down (see installRafGuard).
    rafGuardRef.current?.();
    rafGuardRef.current = null;
    try {
      jsPsychRef.current?.abortExperiment?.();
    } catch {
      /* already finished */
    }
    jsPsychRef.current = null;
    // Detach the run's host so the next run starts from a clean stage.
    hostRef.current?.remove();
    hostRef.current = null;
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

    // jsPsych renders into a fresh per-run host instead of the persistent stage
    // so teardown can detach it intact (see `abort`). `display: contents` means
    // the host generates no box, so the stage stays the sizing/styling context
    // for the plugin's content — existing CSS keeps resolving unchanged.
    const host = document.createElement('div');
    host.style.display = 'contents';
    stage.appendChild(host);
    hostRef.current = host;

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
      display_element: host,
      // Only pass extensions when the experiment defines them; an explicit
      // `undefined` would override jsPsych's internal `[]` default and crash
      // the ExtensionManager.
      ...(extensions ? {extensions} : {}),
      on_finish: () => {
        if (runToken.current !== myToken) return;
        rafGuardRef.current?.();
        rafGuardRef.current = null;
        setResults(def.collect(jsPsych));
        setPhase('done');
        jsPsychRef.current = null;
      },
    });
    jsPsychRef.current = jsPsych as unknown as {abortExperiment?: () => void};
    // Guard rAF for the lifetime of this run; disposed on finish or abort.
    rafGuardRef.current = installRafGuard();
    jsPsych.run(timeline);
  }, [active, abort]);

  const selectTab = useCallback(
    (id: string) => {
      if (id === activeId) return;
      abort();
      setActiveId(id);
      setPhase('idle');
      setResults(null);
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
