import { useMemo } from 'react';
import {
  Box,
  Chip,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

import {
  evaluatePolynomial,
  nativeForm,
  splitPenalty,
  type NativeKind,
  type OneHotLayout,
} from 'qubo-core/hardware/daConstraints';
import type { ConstrainedModel, QuboModel } from 'qubo-core/types';

import type { TKey } from '../i18n/locales/zh';
import { useI18n } from '../i18n';

const KIND_KEY: Record<NativeKind, TKey> = {
  oneHot: 'daSubmit.kind.oneHot',
  inequality: 'daSubmit.kind.inequality',
  equality: 'daSubmit.kind.equality',
};

const KIND_COLOR: Record<NativeKind, 'success' | 'primary' | 'default'> = {
  oneHot: 'success',
  inequality: 'primary',
  equality: 'default',
};

/** Rows listed before the table is cut short. */
const MAX_ROWS = 24;

export type DaSubmissionCardProps = {
  /** The (possibly edited) constrained model the page derived Q from. */
  original: ConstrainedModel;
  model: QuboModel;
  /** The solver's best assignment, when there is one, to show the split adds up. */
  bestX: number[] | null;
};

/**
 * The same case three ways: the paper's single Q with a fixed P, the cost and
 * penalty polynomials a third-generation DA takes separately, and the native
 * declarations (one-hot groups, inequalities) that let it drop slack bits.
 *
 * Structure only — the copy says plainly that Fujitsu's request format is not
 * public and is not reproduced.
 */
export function DaSubmissionCard({ original, model, bestX }: DaSubmissionCardProps) {
  const { t } = useI18n();
  const split = useMemo(() => splitPenalty(original), [original]);
  const native = useMemo(() => nativeForm(original), [original]);
  const names = model.varMeta.map((m) => m.name);
  const sign = model.sense === 'min' ? 1 : -1;

  const counts = {
    oneHot: native.constraints.filter((c) => c.kind === 'oneHot').length,
    inequality: native.constraints.filter((c) => c.kind === 'inequality').length,
    equality: native.constraints.filter((c) => c.kind === 'equality').length,
  };
  const hasConstraints = original.constraints.length > 0 || model.varMeta.some((m) => m.kind === 'aux');

  const at = bestX && bestX.length === model.n ? bestX : null;
  const cost = at ? evaluatePolynomial(split.cost, at) : null;
  const penalty = at ? evaluatePolynomial(split.penalty, at) : null;

  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        {t('daSubmit.title')}
      </Typography>
      <Typography variant="body2" color="text.secondary" component="div" sx={{ mb: 1.5 }}>
        {t('daSubmit.intro')}
      </Typography>

      <Box sx={{ overflowX: 'auto', mb: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>{t('daSubmit.col.paper')}</TableCell>
              <TableCell>{t('daSubmit.col.split')}</TableCell>
              <TableCell>{t('daSubmit.col.native')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell sx={{ color: 'text.secondary' }}>{t('daSubmit.row.submit')}</TableCell>
              <TableCell>{t('daSubmit.paper.submit')}</TableCell>
              <TableCell>{t('daSubmit.split.submit')}</TableCell>
              <TableCell>{t('daSubmit.native.submit')}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ color: 'text.secondary' }}>{t('daSubmit.row.vars')}</TableCell>
              <TableCell sx={{ fontVariantNumeric: 'tabular-nums' }}>{native.paperVars}</TableCell>
              <TableCell sx={{ fontVariantNumeric: 'tabular-nums' }}>{native.paperVars}</TableCell>
              <TableCell sx={{ fontVariantNumeric: 'tabular-nums' }}>
                {native.nativeVars}
                {native.slackSaved > 0 && (
                  <Typography variant="caption" color="success.main" sx={{ ml: 1 }}>
                    {t('daSubmit.slackSaved', { n: native.slackSaved })}
                  </Typography>
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ color: 'text.secondary' }}>{t('daSubmit.row.P')}</TableCell>
              <TableCell>{t('daSubmit.paper.P', { P: model.P })}</TableCell>
              <TableCell>{t('daSubmit.split.P')}</TableCell>
              <TableCell>{t('daSubmit.native.P')}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ color: 'text.secondary' }}>{t('daSubmit.row.constraints')}</TableCell>
              <TableCell>{t('daSubmit.paper.constraints')}</TableCell>
              <TableCell>{t('daSubmit.split.constraints')}</TableCell>
              <TableCell>{t('daSubmit.native.constraints', counts)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Box>

      {!hasConstraints ? (
        <Typography variant="body2" color="text.secondary">
          {t('daSubmit.none')}
        </Typography>
      ) : (
        <Stack spacing={2}>
          {cost != null && penalty != null && (
            <Typography variant="body2" component="div">
              {t('daSubmit.check', {
                cost,
                penalty,
                P: model.P,
                total: cost + model.P * penalty,
                y: sign * (evaluatePolynomial({ Q: model.Q, constant: model.constant }, at!)),
              })}
            </Typography>
          )}

          <OneHotLine layout={native.oneHot} names={names} />

          {original.constraints.length > 0 && (
            <Box sx={{ maxHeight: 280, overflow: 'auto', border: 1, borderColor: 'divider', borderRadius: 1 }}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>{t('daSubmit.list.constraint')}</TableCell>
                    <TableCell>{t('daSubmit.list.declared')}</TableCell>
                    <TableCell align="right">{t('daSubmit.list.slack')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {native.constraints.slice(0, MAX_ROWS).map((c) => (
                    <TableRow key={c.index}>
                      <TableCell sx={{ py: 0.5 }}>
                        <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                          {original.constraints[c.index].label ?? `constraint ${c.index + 1}`}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: 0.5 }}>
                        <Chip size="small" color={KIND_COLOR[c.kind]} label={t(KIND_KEY[c.kind])} />
                      </TableCell>
                      <TableCell align="right" sx={{ py: 0.5, fontVariantNumeric: 'tabular-nums' }}>
                        {c.kind === 'inequality' && c.slackBits > 0 ? `−${c.slackBits}` : ''}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {native.constraints.length > MAX_ROWS && (
                <Typography variant="caption" color="text.secondary" sx={{ p: 1, display: 'block' }}>
                  {t('solutions.moreRows', { count: native.constraints.length - MAX_ROWS, shown: MAX_ROWS })}
                </Typography>
              )}
            </Box>
          )}
        </Stack>
      )}

      <Typography variant="body2" color="text.secondary" component="div" sx={{ mt: 2 }}>
        {t('daSubmit.note')}
      </Typography>
    </Paper>
  );
}

function OneHotLine({ layout, names }: { layout: OneHotLayout; names: string[] }) {
  const { t } = useI18n();
  const list = (groups: number[][]) => groups.map((g) => `{${g.map((v) => names[v]).join(', ')}}`).join('  ');
  if (layout.kind === 'none') return null;
  return (
    <Box>
      <Typography variant="body2" sx={{ fontWeight: 500 }}>
        {layout.kind === 'oneWay'
          ? t('daSubmit.oneHot.oneWay', { n: layout.groups.length })
          : layout.kind === 'twoWay'
          ? t('daSubmit.oneHot.twoWay', { rows: layout.rows.length, cols: layout.cols.length })
          : t('daSubmit.oneHot.overlapping', { n: layout.groups.length })}
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace', display: 'block' }}>
        {layout.kind === 'twoWay' ? `${list(layout.rows)}  ×  ${list(layout.cols)}` : list(layout.groups)}
      </Typography>
    </Box>
  );
}
