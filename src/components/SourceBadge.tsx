import { Chip, Tooltip } from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';

import type { CatalogCase } from 'qubo-core/types';
import { useI18n } from '../i18n';

export function pageLabel(pages: [number, number]): string {
  const [a, b] = pages;
  return a === b ? `p.${a}` : `pp.${a}–${b}`;
}

/**
 * Section and page anchor, pinned to every case header so a presenter can turn
 * straight to the corresponding page of the PDF.
 *
 * For a case the paper only names, the anchor points at the mention, and a
 * second chip says so: the page number alone would read as "worked here".
 */
export function SourceBadge({ qcase }: { qcase: CatalogCase }) {
  const { t, tStr } = useI18n();
  return (
    <>
      <Tooltip title="Glover, Kochenberger & Du — Quantum Bridge Analytics I (2019)">
        <Chip
          size="small"
          variant="outlined"
          icon={<MenuBookIcon />}
          label={`${qcase.section} · ${pageLabel(qcase.pages)}`}
          sx={{ fontVariantNumeric: 'tabular-nums' }}
        />
      </Tooltip>
      {qcase.source === 'mentioned' && (
        <Tooltip
          title={qcase.mention === 'cited' ? tStr('source.cited.tooltip') : tStr('source.mentioned.tooltip')}
        >
          <Chip
            size="small"
            color="warning"
            variant="outlined"
            label={qcase.mention === 'cited' ? t('source.cited') : t('source.mentioned')}
          />
        </Tooltip>
      )}
    </>
  );
}
