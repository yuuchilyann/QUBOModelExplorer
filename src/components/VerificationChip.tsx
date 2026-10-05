import { Button, Chip, Stack, Tooltip } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import EditNoteIcon from '@mui/icons-material/EditNote';
import FactCheckIcon from '@mui/icons-material/FactCheck';

import { useI18n } from '../i18n';

export type VerificationStatus =
  | { kind: 'matches'; n: number; constant: number }
  | { kind: 'mismatch'; count: number }
  /** `reference` names what is no longer being compared against. */
  | { kind: 'custom'; reference: 'paper' | 'search' }
  /** A case the paper only names: checked against direct search of the original model. */
  | { kind: 'searched'; ok: boolean; best: number; qubo: number; constant: number }
  | { kind: 'searching' };

export type VerificationChipProps = {
  status: VerificationStatus;
  onRestore?: () => void;
};

/**
 * Reconciliation status against the published Q — or, for a case the paper
 * only names, against a direct search of the original model. The two are kept
 * visibly different (`info` rather than `success`) so the second can never be
 * mistaken for agreement with the paper.
 *
 * The `custom` state is the important one: the moment a reader edits the input
 * data the paper comparison stops being meaningful, so the chip must stop
 * claiming it. The derivation and the exhaustive solve are still exact — only
 * the reference disappears.
 */
export function VerificationChip({ status, onRestore }: VerificationChipProps) {
  const { t, tStr } = useI18n();

  if (status.kind === 'custom') {
    const fromPaper = status.reference === 'paper';
    return (
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap', rowGap: 0.5 }}>
        <Tooltip title={fromPaper ? tStr('verify.detail.custom') : tStr('verify.detail.customSearch')}>
          <Chip
            size="small"
            icon={<EditNoteIcon />}
            label={fromPaper ? t('verify.custom') : t('verify.customSearch')}
            sx={{ bgcolor: 'action.selected' }}
          />
        </Tooltip>
        {onRestore && (
          <Button size="small" onClick={onRestore}>
            {fromPaper ? t('verify.restore') : t('verify.restoreSite')}
          </Button>
        )}
      </Stack>
    );
  }

  if (status.kind === 'searching') {
    return <Chip size="small" variant="outlined" icon={<FactCheckIcon />} label={t('verify.searching')} />;
  }

  if (status.kind === 'searched') {
    const params = { best: status.best, qubo: status.qubo, constant: status.constant };
    return status.ok ? (
      <Tooltip title={tStr('verify.detail.searched', params)}>
        <Chip size="small" color="info" icon={<FactCheckIcon />} label={t('verify.searched')} />
      </Tooltip>
    ) : (
      <Tooltip title={tStr('verify.detail.searchedBad', params)}>
        <Chip size="small" color="error" icon={<ErrorIcon />} label={t('verify.searchedBad')} />
      </Tooltip>
    );
  }

  if (status.kind === 'mismatch') {
    return (
      <Tooltip title={tStr('verify.detail.bad', { count: status.count })}>
        <Chip size="small" color="error" icon={<ErrorIcon />} label={t('verify.mismatch')} />
      </Tooltip>
    );
  }

  return (
    <Tooltip title={tStr('verify.detail.ok', { n: status.n, constant: status.constant })}>
      <Chip size="small" color="success" icon={<CheckCircleIcon />} label={t('verify.matches')} />
    </Tooltip>
  );
}
