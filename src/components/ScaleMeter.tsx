import { Box, LinearProgress, Paper, Stack, Typography } from '@mui/material';

import { scaleTier, type ScaleTier } from '../hooks/useSolver';
import { useI18n } from '../i18n';

export type ScaleMeterProps = {
  /** Original decision variables (before slack). */
  baseVars: number;
  /** Slack bits appended by the recasting. */
  slackVars: number;
};

const TIER_COLOR: Record<ScaleTier, 'success' | 'warning' | 'error'> = {
  green: 'success',
  amber: 'warning',
  orange: 'warning',
  red: 'error',
};

const TIER_KEY = {
  green: 'scale.tier.green',
  amber: 'scale.tier.amber',
  orange: 'scale.tier.orange',
  red: 'scale.tier.red',
} as const;

function formatStates(n: number): string {
  if (n > 40) return `2^${n}`;
  const v = 2 ** n;
  return v.toLocaleString();
}

/**
 * The combinatorial-explosion gauge.
 *
 * Deliberately prominent rather than hidden: watching the readout cross from
 * "exhaustive" into "heuristic only" as you add one more colour or one more
 * facility is the most direct experience of what NP-hard costs, and it is
 * something only an interactive page can give.
 */
export function ScaleMeter({ baseVars, slackVars }: ScaleMeterProps) {
  const { t } = useI18n();
  const n = baseVars + slackVars;
  const tier = scaleTier(n);
  const color = TIER_COLOR[tier];

  // Position on the bar: 0 at n=0, full at the hard ceiling.
  const pct = Math.min(100, (n / 32) * 100);

  return (
    <Paper variant="outlined" sx={{ p: 1.5 }}>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'baseline', flexWrap: 'wrap' }}>
        <Typography variant="caption" color="text.secondary">
          {t('scale.title')}
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {slackVars > 0
            ? t('scale.varsWithSlack', { base: baseVars, slack: slackVars, n })
            : t('scale.vars', { n })}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          → {t('scale.states', { states: formatStates(n) })}
        </Typography>
      </Stack>

      <LinearProgress
        variant="determinate"
        value={pct}
        color={color}
        sx={{ my: 1, height: 6, borderRadius: 3 }}
      />

      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
        <Box
          sx={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            bgcolor: `${color}.main`,
            flexShrink: 0,
          }}
        />
        <Typography variant="caption" color={`${color}.main`} sx={{ fontWeight: 500 }}>
          {t(TIER_KEY[tier])}
        </Typography>
      </Stack>

      {tier === 'red' && (
        <Typography variant="caption" color="error.main" sx={{ display: 'block', mt: 0.5 }}>
          {t('scale.redHint', { n })}
        </Typography>
      )}
    </Paper>
  );
}
