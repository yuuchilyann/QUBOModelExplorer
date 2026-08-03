import { Box, Stack, Tooltip, Typography } from '@mui/material';

import type { SampleSet } from '../types';
import { useI18n } from '../i18n';

export type EnergyLandscapeProps = {
  result: SampleSet;
  /** Marks where the optimum sits within the distribution. */
  bestEnergy: number;
};

/**
 * Histogram of every objective value in the space.
 *
 * Only worth drawing because the exhaustive solver really did visit all 2ⁿ
 * assignments — this is the view that makes the penalty mechanism visible:
 * feasible solutions get pushed down to the low-energy tail while infeasible
 * ones pile up far away from it.
 */
export function EnergyLandscape({ result, bestEnergy }: EnergyLandscapeProps) {
  const { t } = useI18n();
  const { histogram } = result;
  const peak = Math.max(...histogram.bins, 1);
  const span = histogram.max - histogram.min || 1;
  const bestBin = Math.min(
    histogram.bins.length - 1,
    Math.max(0, Math.floor(((bestEnergy - histogram.min) / span) * histogram.bins.length)),
  );

  return (
    <Box>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        {t('solutions.landscape')}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: '1px',
          height: 140,
          px: 0.5,
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        {histogram.bins.map((count, i) => {
          const lo = histogram.min + (span * i) / histogram.bins.length;
          const hi = histogram.min + (span * (i + 1)) / histogram.bins.length;
          const isBest = i === bestBin;
          return (
            <Tooltip
              key={i}
              title={`${Math.round(lo)} … ${Math.round(hi)} → ${count.toLocaleString()}`}
            >
              <Box
                sx={{
                  flex: 1,
                  minWidth: 2,
                  // Log scale: the optimum's bin usually holds a handful of
                  // points against millions elsewhere, and would be invisible.
                  height: `${count === 0 ? 0 : (Math.log10(count + 1) / Math.log10(peak + 1)) * 100}%`,
                  bgcolor: isBest ? 'success.main' : 'primary.light',
                  opacity: isBest ? 1 : 0.65,
                  borderRadius: '2px 2px 0 0',
                  '&:hover': { opacity: 1 },
                }}
              />
            </Tooltip>
          );
        })}
      </Box>
      <Stack direction="row" sx={{ justifyContent: 'space-between', mt: 0.5 }}>
        <Typography variant="caption" color="text.secondary">
          {Math.round(histogram.min)}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {Math.round(histogram.max)}
        </Typography>
      </Stack>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
        {t('solutions.landscapeHint')}
      </Typography>
    </Box>
  );
}
