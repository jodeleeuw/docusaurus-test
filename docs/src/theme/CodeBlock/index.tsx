/**
 * Wraps the default theme CodeBlock so that a fenced block tagged `runnable`
 * gets an "Open & run in new tab" button:
 *
 *     ```html runnable
 *     <!DOCTYPE html> ... a complete jsPsych experiment ...
 *     ```
 *
 * The button blobs the exact code and opens it in a new tab — no generated HTML
 * files, no external services. This is the same blob-URL approach used by the
 * PluginExample component. Because a blob: document has an opaque origin, any
 * relative `img/...` asset paths are rewritten to absolute site URLs first, so
 * the code shown on the page can stay idiomatic (e.g. `img/blue.png`) while the
 * runnable copy still finds the assets. Reads the site URL from config, so it
 * keeps working if the site later moves to a different domain.
 */
import React, {type ReactNode} from 'react';
import OriginalCodeBlock from '@theme-original/CodeBlock';
import type CodeBlockType from '@theme/CodeBlock';
import type {WrapperProps} from '@docusaurus/types';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './styles.module.css';

type Props = WrapperProps<typeof CodeBlockType>;

const RUNNABLE = /(^|\s)runnable(\s|$)/;

function codeToString(children: ReactNode): string {
  if (typeof children === 'string') return children;
  if (Array.isArray(children)) return children.filter((c) => typeof c === 'string').join('');
  return '';
}

// Rewrite relative `img/...` (or `/img/...`) asset references to absolute URLs
// rooted at the site, so they resolve from a blob: origin. CDN/absolute URLs
// (https://...) don't match this pattern and are left untouched.
function absolutizeAssets(html: string, base: string): string {
  return html.replace(
    /(src|href)=("|')\/?(img\/[^"']+)\2/g,
    (_match, attr, quote, path) => `${attr}=${quote}${base}${path}${quote}`,
  );
}

export default function CodeBlockWrapper(props: Props): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  const metastring = props.metastring ?? '';

  if (!RUNNABLE.test(metastring)) {
    return <OriginalCodeBlock {...props} />;
  }

  // base ends in a slash, e.g. "https://example.github.io/my-site/"
  const base = siteConfig.url + siteConfig.baseUrl;

  const openInNewTab = () => {
    const html = absolutizeAssets(codeToString(props.children), base);
    const url = URL.createObjectURL(new Blob([html], {type: 'text/html'}));
    window.open(url, '_blank', 'noopener,noreferrer');
    // Release the object URL once the new tab has had time to load it.
    setTimeout(() => URL.revokeObjectURL(url), 60_000);
  };

  // Drop our custom flag so the default CodeBlock doesn't try to parse it,
  // but keep any other metastring (line highlighting, title, etc.).
  const cleanedMeta = metastring.replace(RUNNABLE, ' ').trim();

  return (
    <div className={styles.runnable}>
      <OriginalCodeBlock {...props} metastring={cleanedMeta || undefined} />
      <div className={styles.toolbar}>
        <button
          type="button"
          className={styles.button}
          onClick={openInNewTab}
          title="Open this complete example in a new browser tab and run it">
          <span aria-hidden="true">▶</span> Open &amp; run in new tab
        </button>
      </div>
    </div>
  );
}
