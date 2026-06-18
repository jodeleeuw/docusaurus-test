import {useCallback, useRef, useState} from 'react';
import type {ReactElement} from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import useBaseUrl from '@docusaurus/useBaseUrl';
import CodeBlock from '@theme/CodeBlock';
import clsx from 'clsx';
import {buildSrcDoc} from './buildSrcDoc';
import styles from './styles.module.css';

/**
 * An editable, runnable jsPsych example for the plugin docs. The code shown is
 * the single source of truth: the user can edit it, the live preview is rebuilt
 * from whatever is in the editor, and "Open in new tab" exports the exact same
 * runnable page. The demo runtime (CDN scripts + generateDocsDemoTimeline) is
 * assembled in buildSrcDoc and run inside a sandboxed iframe, so a snippet that
 * writes to document.body never touches the surrounding docs page.
 *
 * Authored content lives in PluginExampleProps.json; pages spread one entry in.
 */

export type PluginExampleProps = {
  /** Short description shown on the collapsed example's summary bar. */
  summary: string;
  /** The editable snippet. Must define a `timeline` variable (see buildSrcDoc). */
  code: string;
  /** unpkg specifiers for the plugins this example needs. */
  dependencies?: string[];
  /** Override the default jsPsych version pulled from unpkg. */
  jspsychVersion?: string;
  /** Initial demo-stage height in pixels; the reader can drag to resize. */
  height?: number;
};

const DEFAULT_JSPSYCH_VERSION = '8.2.2';
const DEFAULT_HEIGHT = 360;
const MIN_STAGE_HEIGHT = 200;
const MAX_STAGE_HEIGHT = 900;
const KEY_RESIZE_STEP = 24;

const clampHeight = (h: number): number =>
  Math.min(MAX_STAGE_HEIGHT, Math.max(MIN_STAGE_HEIGHT, h));

export function PluginExample({
  summary,
  code,
  dependencies = [],
  jspsychVersion = DEFAULT_JSPSYCH_VERSION,
  height = DEFAULT_HEIGHT,
}: PluginExampleProps): ReactElement {
  // The shared demo runtime + stylesheet live in static/demos. useBaseUrl adds
  // the site's baseUrl; we prepend the origin at build time because a srcdoc
  // document resolves relative URLs against about:srcdoc.
  const timelinePath = useBaseUrl('/demos/docs-demo-timeline.js');
  const cssPath = useBaseUrl('/demos/docs-demo.css');

  // Editor contents, the code currently running in the preview, and the
  // generated document. `activated` defers all of this — and the CDN load —
  // until the example is first expanded.
  const [draft, setDraft] = useState(code);
  const [applied, setApplied] = useState(code);
  const [srcDoc, setSrcDoc] = useState<string | null>(null);
  const [activated, setActivated] = useState(false);
  const [stageHeight, setStageHeight] = useState(clampHeight(height));

  const blobUrls = useRef<string[]>([]);

  const makeDoc = useCallback(
    (source: string): string => {
      const origin =
        typeof window !== 'undefined' ? window.location.origin : '';
      return buildSrcDoc({
        code: source,
        dependencies,
        jspsychVersion,
        assets: {timeline: origin + timelinePath, css: origin + cssPath},
      });
    },
    [dependencies, jspsychVersion, timelinePath, cssPath],
  );

  const activate = useCallback(() => {
    if (activated) return;
    setActivated(true);
    setSrcDoc(makeDoc(draft));
  }, [activated, draft, makeDoc]);

  const run = useCallback(() => {
    setApplied(draft);
    setSrcDoc(makeDoc(draft));
  }, [draft, makeDoc]);

  const reset = useCallback(() => {
    setDraft(code);
    setApplied(code);
    setSrcDoc(makeDoc(code));
  }, [code, makeDoc]);

  const openInNewTab = useCallback(() => {
    const blob = new Blob([makeDoc(draft)], {type: 'text/html'});
    const url = URL.createObjectURL(blob);
    blobUrls.current.push(url);
    window.open(url, '_blank', 'noopener,noreferrer');
    // Give the new tab time to load before releasing the object URL.
    window.setTimeout(() => {
      URL.revokeObjectURL(url);
      blobUrls.current = blobUrls.current.filter((u) => u !== url);
    }, 60_000);
  }, [draft, makeDoc]);

  // Drag the bottom strip to resize the stage. Pointer capture routes every
  // move event to the handle even while the cursor is over the sandboxed
  // iframe, which would otherwise swallow them.
  const startResize = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.preventDefault();
      const handle = e.currentTarget;
      const startY = e.clientY;
      const startHeight = stageHeight;
      handle.setPointerCapture(e.pointerId);

      const onMove = (ev: PointerEvent) =>
        setStageHeight(clampHeight(startHeight + (ev.clientY - startY)));
      const onUp = (ev: PointerEvent) => {
        handle.releasePointerCapture(ev.pointerId);
        handle.removeEventListener('pointermove', onMove);
        handle.removeEventListener('pointerup', onUp);
      };
      handle.addEventListener('pointermove', onMove);
      handle.addEventListener('pointerup', onUp);
    },
    [stageHeight],
  );

  const onResizeKey = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      const delta = e.key === 'ArrowDown' ? KEY_RESIZE_STEP : -KEY_RESIZE_STEP;
      setStageHeight((h) => clampHeight(h + delta));
    }
  }, []);

  const dirty = draft !== applied;
  const edited = draft !== code;

  return (
    <details
      className={styles.example}
      onToggle={(e) => {
        if (e.currentTarget.open) activate();
      }}>
      <summary className={styles.summary}>
        <span className={styles.summaryText}>{summary}</span>
        <span className={styles.chevron} aria-hidden="true" />
      </summary>

      <div className={styles.body}>
        {activated && (
          <>
            <div className={styles.editorWrap}>
              <BrowserOnly
                fallback={
                  <CodeBlock language="javascript">{draft}</CodeBlock>
                }>
                {() => {
                  const CodeEditor = require('./CodeEditor').default;
                  return <CodeEditor value={draft} onChange={setDraft} />;
                }}
              </BrowserOnly>

              <div className={styles.actions}>
                <button
                  type="button"
                  className={styles.iconButton}
                  onClick={reset}
                  disabled={!edited}
                  aria-label="Reset to the original code"
                  title="Reset to the original code">
                  ↺
                </button>
                <button
                  type="button"
                  className={styles.iconButton}
                  onClick={openInNewTab}
                  aria-label="Open this demo in a new tab"
                  title="Open this demo in a new tab">
                  <span className={styles.openIcon} aria-hidden="true">
                    ↗
                  </span>
                </button>
                <button
                  type="button"
                  className={styles.runButton}
                  onClick={run}
                  disabled={!dirty}
                  title="Run your edits in the preview below">
                  <span className={styles.runIcon} aria-hidden="true">
                    ▶
                  </span>
                  Run
                  {dirty && <span className={styles.runDot} aria-hidden="true" />}
                </button>
              </div>
            </div>

            <div className={styles.stage} style={{height: `${stageHeight}px`}}>
              {srcDoc && (
                <iframe
                  className={styles.preview}
                  title={`${summary} — live demo`}
                  srcDoc={srcDoc}
                  sandbox="allow-scripts"
                />
              )}
            </div>

            <div
              className={styles.resizeHandle}
              role="separator"
              aria-orientation="horizontal"
              aria-label="Drag to resize the demo. Use arrow keys to adjust."
              aria-valuenow={Math.round(stageHeight)}
              aria-valuemin={MIN_STAGE_HEIGHT}
              aria-valuemax={MAX_STAGE_HEIGHT}
              tabIndex={0}
              onPointerDown={startResize}
              onKeyDown={onResizeKey}>
              <span className={styles.grip} aria-hidden="true" />
            </div>
          </>
        )}
      </div>
    </details>
  );
}

export default PluginExample;
