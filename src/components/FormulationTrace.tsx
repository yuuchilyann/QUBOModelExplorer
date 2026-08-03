import { Box, Chip, Paper, Stack, Typography } from '@mui/material';

import type { Derivation } from '../lib/derive';
import type { Constraint, QuboCase } from '../types';
import { Math } from './Math';
import { useI18n } from '../i18n';

const METHOD_KEY: Record<Constraint['method'], string> = {
  transform1: 'formulation.method.transform1',
  transform2: 'formulation.method.transform2',
  atLeastOne: 'formulation.method.atLeastOne',
  exactlyOne2: 'formulation.method.exactlyOne2',
  implication: 'formulation.method.implication',
  equal2: 'formulation.method.equal2',
} as const;

/**
 * The recasting, step by step.
 *
 * This is the panel the whole site exists for: the paper's chain of reasoning
 * from a constrained model to a single matrix, rendered from the SAME derivation
 * that produced the Q shown alongside it — so what is displayed is necessarily
 * what was computed.
 */
export function FormulationTrace({
  qcase,
  derivation,
}: {
  qcase: QuboCase;
  derivation: Derivation;
}) {
  const { t } = useI18n();
  const { steps, slackInfo, model } = derivation;

  const objective = steps.filter((s) => s.kind === 'objective');
  const slack = steps.filter((s) => s.kind === 'slack');
  const penalties = steps.filter((s) => s.kind === 'penalty');

  return (
    <Stack spacing={2.5}>
      <Box>
        <Typography variant="overline" color="text.secondary">
          {t('formulation.original')}
        </Typography>
        {objective.map((s, i) => (
          <Math key={i} block>
            {s.latex}
          </Math>
        ))}
        {qcase.model.constraints.length > 0 && (
          <Paper variant="outlined" sx={{ p: 1.5, mt: 1 }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
              {t('common.constraints')} ({qcase.model.constraints.length})
            </Typography>
            <Stack spacing={0.25}>
              {qcase.model.constraints.slice(0, 8).map((c, i) => (
                <Typography key={i} variant="caption" sx={{ fontFamily: 'monospace' }}>
                  {c.label ?? `constraint ${i + 1}`}
                </Typography>
              ))}
              {qcase.model.constraints.length > 8 && (
                <Typography variant="caption" color="text.secondary">
                  …另外 {qcase.model.constraints.length - 8} 條
                </Typography>
              )}
            </Stack>
          </Paper>
        )}
      </Box>

      {slack.length > 0 && (
        <Box>
          <Typography variant="overline" color="text.secondary">
            {t('formulation.slack')}
          </Typography>
          {slack.map((s, i) => (
            <Box key={i}>
              <Math block>{s.latex}</Math>
              {slackInfo[i] && slackInfo[i].used !== slackInfo[i].auto && (
                <Typography variant="caption" color="warning.main">
                  {t('formulation.slackNote', {
                    used: slackInfo[i].used,
                    auto: slackInfo[i].auto,
                  })}
                </Typography>
              )}
            </Box>
          ))}
        </Box>
      )}

      {penalties.length > 0 && (
        <Box>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 0.5 }}>
            <Typography variant="overline" color="text.secondary">
              {t('formulation.penalty')}
            </Typography>
            {[...new Set(penalties.map((p) => p.method).filter(Boolean))].map((m) => (
              <Chip key={m} size="small" variant="outlined" label={t(METHOD_KEY[m!] as never)} />
            ))}
          </Stack>
          <Stack spacing={0.5}>
            {penalties.slice(0, 12).map((s, i) => (
              <Math key={i} block>
                {s.latex}
              </Math>
            ))}
            {penalties.length > 12 && (
              <Typography variant="caption" color="text.secondary">
                …另外 {penalties.length - 12} 個懲罰項（結構相同，只是換了變數）
              </Typography>
            )}
          </Stack>
        </Box>
      )}

      <Paper variant="outlined" sx={{ p: 1.5, bgcolor: 'action.hover' }}>
        <Typography variant="overline" color="text.secondary" sx={{ display: 'block' }}>
          {t('formulation.result')}
        </Typography>
        <Math block>{`${model.sense === 'min' ? '\\min' : '\\max'}\\; y = x^t Q x`}</Math>
        <Typography variant="caption" color="text.secondary">
          {t('formulation.resultBody', { n: model.n, constant: model.constant })}
        </Typography>
      </Paper>
    </Stack>
  );
}
