import type {ReactNode} from 'react';

export type DemoPhase = 'idle' | 'running' | 'done';

/**
 * Everything an experiment definition needs to build one run, derived once per
 * run from the live stage element so the demo can read theme colors and size
 * itself to the panel.
 */
export type RunContext = {
  stage: HTMLElement;
  reduceMotion: boolean;
  /** Square edge length (px) for displays that want to fill the panel. */
  size: number;
  /** Read a CSS custom property off the stage, with a fallback. */
  readVar: (name: string, fallback: string) => string;
};

/**
 * A single embeddable jsPsych experiment. The shell owns the jsPsych lifecycle
 * (init, run, abort) and the panel chrome; each definition supplies its
 * timeline, how to read its results off the data, and how to present them.
 */
export interface ExperimentDef<R = unknown> {
  id: string;
  /** Label shown in the tab switcher. */
  tabLabel: string;
  /** Heading shown above the stage when this experiment is active. */
  title: string;
  /** One-line description shown under the title. */
  lead: string;
  /** Label for the idle start button. */
  startLabel: string;
  /** Lazy-load the plugin(s) and build the jsPsych timeline for one run. */
  build: (ctx: RunContext) => Promise<any[]>;
  /** Derive a results object from the finished jsPsych instance. */
  collect: (jsPsych: {data: any}) => R;
  /** Render the results panel shown when the run finishes. */
  renderResults: (results: R, rerun: () => void) => ReactNode;
  /** Footnote shown beneath the panel. */
  footnote: ReactNode;
}
