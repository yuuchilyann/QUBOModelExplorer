import { useMemo } from 'react';
import { Box } from '@mui/material';
import katex from 'katex';
import 'katex/dist/katex.min.css';

export type MathProps = {
  children: string;
  /** Display (centred, own line) rather than inline. */
  block?: boolean;
};

/** Thin KaTeX wrapper. Renders the source verbatim if KaTeX cannot parse it. */
export function Math({ children, block = false }: MathProps) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(children, {
        displayMode: block,
        throwOnError: false,
        output: 'html',
      });
    } catch {
      return null;
    }
  }, [children, block]);

  if (html === null) {
    return (
      <Box component="code" sx={{ fontFamily: 'monospace', fontSize: '0.9em' }}>
        {children}
      </Box>
    );
  }

  return (
    <Box
      component={block ? 'div' : 'span'}
      sx={{
        ...(block ? { my: 1.5, overflowX: 'auto', overflowY: 'hidden', py: 0.5 } : {}),
        '& .katex': { fontSize: block ? '1.05em' : '1em' },
      }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
