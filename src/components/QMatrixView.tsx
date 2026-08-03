import { useMemo, useState } from 'react';
import {
  Box,
  Chip,
  Paper,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from '@mui/material';

import type { QuboModel } from '../types';
import { toUpperTriangular } from '../lib/qubo';
import { bmatrix } from './QMatrixLatex';
// Aliased: this file uses Math.abs/Math.max, and an import named `Math` would
// shadow the global object.
import { Math as Tex } from './Math';
import { useI18n } from '../i18n';

export type QMatrixViewProps = {
  model: QuboModel;
  /** The paper's printed Q, when this case is still on its published data. */
  paperQ?: number[][];
};

type Form = 'symmetric' | 'upper';
type Display = 'heatmap' | 'latex';

function fmt(v: number): string {
  if (v === 0) return '·';
  if (Number.isInteger(v)) return String(v);
  return String(Number(v.toFixed(3)));
}

/**
 * Q as an interactive heatmap.
 *
 * Hovering a cell explains where the number came from — the objective, a
 * specific constraint, a clause — which is the piece a printed matrix can never
 * show. It also makes the block-diagonal structure the paper points out in §5.2
 * ("Looking for patterns is often a useful de-bugging tool") visible at a glance.
 */
export function QMatrixView({ model, paperQ }: QMatrixViewProps) {
  const { t } = useI18n();
  const [form, setForm] = useState<Form>('symmetric');
  const [display, setDisplay] = useState<Display>('heatmap');

  const shown = useMemo(
    () => (form === 'symmetric' ? model.Q : toUpperTriangular(model.Q)),
    [model.Q, form],
  );

  const scale = useMemo(() => {
    let max = 0;
    for (const row of shown) for (const v of row) max = Math.max(max, Math.abs(v));
    return max || 1;
  }, [shown]);

  const mismatches = useMemo(() => {
    if (!paperQ || form !== 'symmetric') return null;
    const set = new Set<string>();
    for (let i = 0; i < model.n; i++) {
      for (let j = 0; j < model.n; j++) {
        if (Math.abs(model.Q[i][j] - (paperQ[i]?.[j] ?? NaN)) > 1e-9) set.add(`${i},${j}`);
      }
    }
    return set;
  }, [paperQ, model.Q, model.n, form]);

  // Shrink the type as the matrix grows so a 15×15 still fits without scrolling.
  const cell = model.n <= 6 ? 52 : model.n <= 10 ? 44 : model.n <= 16 ? 36 : 28;
  const font = model.n <= 10 ? 13 : model.n <= 16 ? 11 : 9;

  return (
    <Box>
      <Stack
        direction="row"
        spacing={1}
        sx={{ mb: 1.5, alignItems: 'center', flexWrap: 'wrap', rowGap: 1 }}
      >
        <ToggleButtonGroup
          value={form}
          exclusive
          size="small"
          onChange={(_, v: Form | null) => v && setForm(v)}
          color="primary"
        >
          <ToggleButton value="symmetric" sx={{ px: 1.5, py: 0.25 }}>
            {t('matrix.symmetric')}
          </ToggleButton>
          <ToggleButton value="upper" sx={{ px: 1.5, py: 0.25 }}>
            {t('matrix.upper')}
          </ToggleButton>
        </ToggleButtonGroup>

        <ToggleButtonGroup
          value={display}
          exclusive
          size="small"
          onChange={(_, v: Display | null) => v && setDisplay(v)}
          color="primary"
        >
          <ToggleButton value="heatmap" sx={{ px: 1.5, py: 0.25 }}>
            {t('matrix.view.heatmap')}
          </ToggleButton>
          <ToggleButton value="latex" sx={{ px: 1.5, py: 0.25 }}>
            {t('matrix.view.latex')}
          </ToggleButton>
        </ToggleButtonGroup>

        <Chip size="small" variant="outlined" label={t('matrix.constant', { constant: model.constant })} />
      </Stack>

      {display === 'latex' ? (
        <Box>
          <Box sx={{ overflowX: 'auto', py: 1 }}>
            <Tex block>{`Q = ${bmatrix(shown)}`}</Tex>
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
            {t('matrix.view.latexHint')}
          </Typography>
        </Box>
      ) : (
      <Box sx={{ overflowX: 'auto', pb: 1 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: `${cell * 0.9}px repeat(${model.n}, ${cell}px)`,
            gap: '2px',
            width: 'max-content',
          }}
        >
          <Box />
          {model.varMeta.map((m, j) => (
            <Box
              key={`h${j}`}
              sx={{
                fontSize: font,
                textAlign: 'center',
                color: m.kind === 'slack' ? 'warning.main' : 'text.secondary',
                pb: 0.5,
              }}
            >
              {m.name}
            </Box>
          ))}

          {shown.map((row, i) => (
            <Box key={`r${i}`} sx={{ display: 'contents' }}>
              <Box
                sx={{
                  fontSize: font,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  pr: 0.5,
                  color: model.varMeta[i].kind === 'slack' ? 'warning.main' : 'text.secondary',
                }}
              >
                {model.varMeta[i].name}
              </Box>
              {row.map((v, j) => {
                const intensity = Math.abs(v) / scale;
                const bad = mismatches?.has(`${i},${j}`);
                const bg =
                  v === 0
                    ? 'transparent'
                    : v > 0
                      ? `rgba(43, 108, 176, ${0.08 + intensity * 0.62})`
                      : `rgba(192, 86, 33, ${0.08 + intensity * 0.62})`;
                const contributions = model.provenance.get(`${i},${j}`) ?? [];
                return (
                  <Tooltip
                    key={`c${i}-${j}`}
                    title={
                      <Box sx={{ py: 0.5 }}>
                        <Typography variant="caption" sx={{ fontWeight: 600, display: 'block' }}>
                          {t('matrix.provenance', { i, j, value: fmt(v) })}
                        </Typography>
                        {contributions.length === 0 ? (
                          <Typography variant="caption">{t('matrix.provenance.empty')}</Typography>
                        ) : (
                          contributions.map((c, k) => (
                            <Typography key={k} variant="caption" sx={{ display: 'block' }}>
                              {c.detail} → {c.amount > 0 ? '+' : ''}
                              {fmt(c.amount)}
                            </Typography>
                          ))
                        )}
                      </Box>
                    }
                  >
                    <Box
                      sx={{
                        height: cell,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: font,
                        fontVariantNumeric: 'tabular-nums',
                        bgcolor: bg,
                        borderRadius: 0.5,
                        cursor: 'default',
                        color: v === 0 ? 'text.disabled' : 'text.primary',
                        outline: bad ? '2px solid' : 'none',
                        outlineColor: 'error.main',
                        '&:hover': { filter: 'brightness(0.92)' },
                      }}
                    >
                      {fmt(v)}
                    </Box>
                  </Tooltip>
                );
              })}
            </Box>
          ))}
        </Box>
      </Box>
      )}

      {display === 'heatmap' && (
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
          {t('matrix.hint')}
        </Typography>
      )}
    </Box>
  );
}

/** Small legend explaining the slack-variable colouring. */
export function MatrixLegend() {
  return (
    <Paper variant="outlined" sx={{ p: 1, display: 'inline-flex', gap: 2 }}>
      <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
        <Box sx={{ width: 14, height: 14, bgcolor: 'rgba(43,108,176,0.55)', borderRadius: 0.5 }} />
        <Typography variant="caption">&gt; 0</Typography>
      </Stack>
      <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
        <Box sx={{ width: 14, height: 14, bgcolor: 'rgba(192,86,33,0.55)', borderRadius: 0.5 }} />
        <Typography variant="caption">&lt; 0</Typography>
      </Stack>
    </Paper>
  );
}
