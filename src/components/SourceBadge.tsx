import { Chip, Tooltip } from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';

import type { QuboCase } from '../types';

/**
 * Section and page anchor, pinned to every case header so a presenter can turn
 * straight to the corresponding page of the PDF.
 */
export function SourceBadge({ qcase }: { qcase: QuboCase }) {
  const [a, b] = qcase.pages;
  const pages = a === b ? `p.${a}` : `pp.${a}–${b}`;
  return (
    <Tooltip title="Glover, Kochenberger & Du — Quantum Bridge Analytics I (2019)">
      <Chip
        size="small"
        variant="outlined"
        icon={<MenuBookIcon />}
        label={`${qcase.section} · ${pages}`}
        sx={{ fontVariantNumeric: 'tabular-nums' }}
      />
    </Tooltip>
  );
}
