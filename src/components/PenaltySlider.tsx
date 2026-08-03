import { Alert, Box, Button, Paper, Slider, Stack, Typography } from '@mui/material';

import type { QuboCase } from '../types';
import { useI18n } from '../i18n';

export type PenaltySliderProps = {
  qcase: QuboCase;
  value: number;
  onChange: (v: number) => void;
  /** True when the current P leaves the optimum infeasible. */
  infeasible?: boolean;
};

/**
 * The penalty scalar, exposed as a live control.
 *
 * §4.1's discussion of P (p.13) is the paper's most experiential passage — too
 * large and the penalties "overwhelm the original objective function
 * information", too small and feasibility is jeopardised, with a broad
 * "Goldilocks region" in between. Dragging the slider and watching the optimum
 * jump across the feasibility boundary conveys that in a way the prose cannot.
 */
export function PenaltySlider({ qcase, value, onChange, infeasible }: PenaltySliderProps) {
  const { t } = useI18n();
  const spec = qcase.penalty;

  if (!spec) {
    return (
      <Paper variant="outlined" sx={{ p: 1.5 }}>
        <Typography variant="caption" color="text.secondary">
          {t('penalty.none')}
        </Typography>
      </Paper>
    );
  }

  // The paper's rule of thumb: 75%–150% of a ballpark objective estimate.
  const lo = Math.max(spec.min, Math.round(spec.paperValue * 0.75));
  const hi = Math.round(spec.paperValue * 1.5);

  return (
    <Paper variant="outlined" sx={{ p: 1.5 }}>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'baseline', flexWrap: 'wrap' }}>
        <Typography variant="caption" color="text.secondary">
          {t('penalty.title')}
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
          P = {value}
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        {value !== spec.paperValue && (
          <Button size="small" onClick={() => onChange(spec.paperValue)}>
            {t('penalty.reset')}
          </Button>
        )}
      </Stack>

      <Box sx={{ px: 1 }}>
        <Slider
          size="small"
          min={spec.min}
          max={spec.max}
          step={spec.step}
          value={value}
          onChange={(_, v) => onChange(v as number)}
          marks={[
            { value: spec.paperValue, label: String(spec.paperValue) },
          ]}
          valueLabelDisplay="auto"
        />
      </Box>

      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
        {t('penalty.paperValue', { value: spec.paperValue })} · {t('penalty.suggested', { lo, hi })}
      </Typography>

      {infeasible && (
        <Alert severity="warning" sx={{ mt: 1, py: 0 }}>
          <Typography variant="caption">{t('penalty.infeasibleNow')}</Typography>
        </Alert>
      )}

      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
        {t('penalty.hint')}
      </Typography>
    </Paper>
  );
}
