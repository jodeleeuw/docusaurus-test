/**
 * Wraps the default theme CodeBlock. A fenced block tagged `runnable`
 *
 *     ```html runnable
 *     <!DOCTYPE html> ... a complete jsPsych experiment ...
 *     ```
 *
 * is flagged via React context so the swizzled Buttons group can render an
 * "open & run in new tab" icon alongside the copy and word-wrap buttons. The
 * flag is stripped from the metastring so the default code block doesn't try to
 * interpret it. The actual run behavior lives in ./Buttons.
 */
import React, {type ReactNode} from 'react';
import OriginalCodeBlock from '@theme-original/CodeBlock';
import type CodeBlockType from '@theme/CodeBlock';
import type {WrapperProps} from '@docusaurus/types';
import {RunnableContext} from './runnableContext';

type Props = WrapperProps<typeof CodeBlockType>;

const RUNNABLE = /(^|\s)runnable(\s|$)/;

export default function CodeBlockWrapper(props: Props): ReactNode {
  const metastring = props.metastring ?? '';

  if (!RUNNABLE.test(metastring)) {
    return <OriginalCodeBlock {...props} />;
  }

  const cleanedMeta = metastring.replace(RUNNABLE, ' ').trim();

  return (
    <RunnableContext.Provider value={true}>
      <OriginalCodeBlock {...props} metastring={cleanedMeta || undefined} />
    </RunnableContext.Provider>
  );
}
