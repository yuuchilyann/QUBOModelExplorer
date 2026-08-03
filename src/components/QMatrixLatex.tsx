import { Box } from '@mui/material';

import type { QuboModel } from '../types';
// Aliased: a local binding called `Math` would shadow the global object, so
// `Math.abs` below would resolve to the React component instead.
import { Math as Tex } from './Math';

/**
 * Q rendered the way the paper prints it, so a reader can hold the page and the
 * PDF side by side. The heatmap is better for spotting structure; this is
 * better for reconciling against the publication.
 */

/** §4.3's Q carries half-integers, and the paper writes those as fractions. */
function cell(v: number): string {
  if (Number.isInteger(v)) return String(v);
  if (Number.isInteger(v * 2)) {
    const sign = v < 0 ? '-' : '';
    return `${sign}${Math.abs(v) * 2}/2`;
  }
  return String(Number(v.toFixed(3)));
}

export function bmatrix(Q: number[][]): string {
  return `\\begin{bmatrix}${Q.map((row) => row.map(cell).join(' & ')).join(' \\\\ ')}\\end{bmatrix}`;
}

/** `Q = [ … ]` on its own. */
export function QMatrixLatex({ model }: { model: QuboModel }) {
  return (
    <Box sx={{ overflowX: 'auto', py: 1 }}>
      <Tex block>{`Q = ${bmatrix(model.Q)}`}</Tex>
    </Box>
  );
}

/**
 * The full quadratic form as §2 (p.5) writes it: a row vector of the variables,
 * the matrix, then the same variables again as a column.
 */
export function QuadraticFormLatex({ model }: { model: QuboModel }) {
  const n = model.n;
  const row = Array.from({ length: n }, (_, i) => `x_{${i + 1}}`).join(' & ');
  const col = Array.from({ length: n }, (_, i) => `x_{${i + 1}}`).join(' \\\\ ');
  const sense = model.sense === 'min' ? '\\text{Minimize}' : '\\text{Maximize}';

  return (
    <Box sx={{ overflowX: 'auto', py: 1 }}>
      <Tex block>
        {`${sense}\\quad y = \\begin{pmatrix}${row}\\end{pmatrix} ${bmatrix(model.Q)} \\begin{bmatrix}${col}\\end{bmatrix}`}
      </Tex>
    </Box>
  );
}
