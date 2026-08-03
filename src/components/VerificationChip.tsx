import { Button, Chip, Stack, Tooltip } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import EditNoteIcon from '@mui/icons-material/EditNote';

import { useI18n } from '../i18n';

export type VerificationStatus =
  | { kind: 'matches'; n: number; constant: number }
  | { kind: 'mismatch'; count: number }
  | { kind: 'custom' };

export type VerificationChipProps = {
  status: VerificationStatus;
  onRestore?: () => void;
};

/**
 * Reconciliation status against the published Q.
 *
 * The `custom` state is the important one: the moment a reader edits the input
 * data the paper comparison stops being meaningful, so the chip must stop
 * claiming it. The derivation and the exhaustive solve are still exact — only
 * the reference disappears.
 */
export function VerificationChip({ status, onRestore }: VerificationChipProps) {
  const { t, tStr } = useI18n();

  if (status.kind === 'custom') {
    return (
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap', rowGap: 0.5 }}>
        <Tooltip title={tStr('verify.detail.custom')}>
          <Chip
            size="small"
            icon={<EditNoteIcon />}
            label={t('verify.custom')}
            sx={{ bgcolor: 'action.selected' }}
          />
        </Tooltip>
        {onRestore && (
          <Button size="small" onClick={onRestore}>
            {t('verify.restore')}
          </Button>
        )}
      </Stack>
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
