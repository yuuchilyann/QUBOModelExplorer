import {
  Alert,
  Box,
  Chip,
  LinearProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material';

import type { QuboCase, QuboModel } from '../types';
import type { SolveState } from '../hooks/useSolver';
import { checkFeasibility } from '../lib/derive';
import { EnergyLandscape } from './EnergyLandscape';
import { useI18n } from '../i18n';

export type SolutionPanelProps = {
  qcase: QuboCase;
  model: QuboModel;
  state: SolveState;
};

/**
 * What the solver found, and how much it is entitled to claim.
 *
 * The `exact` / `heuristic` distinction is surfaced prominently rather than
 * buried: an exhaustive sweep has proven optimality, tabu search has not, and
 * conflating the two would undermine every other claim on the page.
 */
export function SolutionPanel({ qcase, model, state }: SolutionPanelProps) {
  const { t } = useI18n();

  if (state.error === 'too-large') {
    return <Alert severity="error">{t('scale.redHint', { n: model.n })}</Alert>;
  }
  if (state.error) {
    return <Alert severity="error">{state.error}</Alert>;
  }
  if (state.running || !state.result) {
    return (
      <Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {t('solutions.running')}
        </Typography>
        <LinearProgress variant={state.progress > 0 ? 'determinate' : 'indeterminate'} value={state.progress * 100} />
      </Box>
    );
  }

  const result = state.result;
  const best = result.best[0];
  const original = best.energy + model.constant;
  const feas = qcase.model.constraints.length
    ? checkFeasibility(qcase.model, best.x)
    : null;

  return (
    <Stack spacing={3}>
      <Box>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap', rowGap: 1, mb: 1.5 }}>
          <Chip
            size="small"
            color={result.quality === 'exact' ? 'success' : 'warning'}
            label={result.quality === 'exact' ? t('solutions.exact') : t('solutions.heuristic')}
          />
          <Chip
            size="small"
            variant="outlined"
            label={
              result.degeneracy > 1
                ? t('solutions.degeneracy', { count: result.degeneracy })
                : t('solutions.unique')
            }
          />
          <Typography variant="caption" color="text.secondary">
            {t('solutions.evaluated', {
              count: result.evaluated.toLocaleString(),
              ms: result.elapsedMs,
            })}
          </Typography>
        </Stack>

        <Paper variant="outlined" sx={{ p: 2 }}>
          <Typography variant="overline" color="text.secondary">
            {t('solutions.best')}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 0.5,
              my: 1,
            }}
          >
            {best.x.map((v, i) => (
              <Box
                key={i}
                sx={{
                  minWidth: 30,
                  px: 0.75,
                  py: 0.5,
                  textAlign: 'center',
                  borderRadius: 0.5,
                  fontFamily: 'monospace',
                  fontSize: 13,
                  bgcolor: v ? 'primary.main' : 'action.hover',
                  color: v ? 'primary.contrastText' : 'text.disabled',
                  border: model.varMeta[i]?.kind === 'slack' ? '2px dashed' : 'none',
                  borderColor: 'warning.main',
                }}
                title={model.varMeta[i]?.name}
              >
                {v}
              </Box>
            ))}
          </Box>
          <Stack direction="row" spacing={3} sx={{ flexWrap: 'wrap', rowGap: 1 }}>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                {t('solutions.energy')}
              </Typography>
              <Typography variant="h3">{best.energy}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                {t('solutions.original')}
              </Typography>
              <Typography variant="h3">{original}</Typography>
            </Box>
          </Stack>
          {result.feasibleCount !== undefined && (
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
              {t('solutions.feasible', { count: result.feasibleCount.toLocaleString() })}
            </Typography>
          )}
        </Paper>
      </Box>

      {feas && (
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            {t('solutions.feasibilityCheck')}
          </Typography>
          {!feas.feasible && (
            <Alert severity="warning" sx={{ mb: 1 }}>
              {t('solutions.infeasible')}
            </Alert>
          )}
          <Paper variant="outlined" sx={{ maxHeight: 260, overflow: 'auto' }}>
            <Table size="small">
              <TableBody>
                {feas.rows.slice(0, 30).map((r) => {
                  const c = qcase.model.constraints[r.index];
                  return (
                    <TableRow key={r.index}>
                      <TableCell sx={{ py: 0.5 }}>
                        <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                          {c.label ?? `constraint ${r.index + 1}`}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: 0.5, width: 120 }}>
                        <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                          {r.lhs} {c.rel} {c.rhs}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: 0.5, width: 70 }}>
                        <Chip
                          size="small"
                          color={r.ok ? 'success' : 'error'}
                          label={r.ok ? t('solutions.rowOk') : t('solutions.rowBad')}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            {feas.rows.length > 30 && (
              <Typography variant="caption" color="text.secondary" sx={{ p: 1, display: 'block' }}>
                {t('solutions.moreRows', { count: feas.rows.length - 30, shown: 30 })}
              </Typography>
            )}
          </Paper>
        </Box>
      )}

      <EnergyLandscape result={result} bestEnergy={best.energy} />
    </Stack>
  );
}
