import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

import { Math } from '../components/Math';
import { PresenterNotes } from '../components/PresenterNotes';
import { useI18n } from '../i18n';

/**
 * Truth table for Rosenberg's reduction penalty
 * `P(x₁x₂ − 2x₁y₁ − 2x₂y₁ + 3y₁)`.
 *
 * Computed rather than transcribed, so the claim "this is zero exactly when
 * y₁ = x₁x₂" is demonstrated on the page instead of asserted.
 */
function rosenbergRows() {
  const rows: { x1: number; x2: number; y1: number; value: number; ok: boolean }[] = [];
  for (const x1 of [0, 1]) {
    for (const x2 of [0, 1]) {
      for (const y1 of [0, 1]) {
        const value = x1 * x2 - 2 * x1 * y1 - 2 * x2 * y1 + 3 * y1;
        rows.push({ x1, x2, y1, value, ok: y1 === x1 * x2 });
      }
    }
  }
  return rows;
}

export function AppendixPage() {
  const { t } = useI18n();
  const rows = rosenbergRows();

  return (
    <Box>
      <Typography variant="h1" sx={{ mb: 3 }}>
        {t('appendix.title')}
      </Typography>

      <Typography variant="h2" sx={{ mb: 1 }}>
        {t('appendix.higherOrder.title')}
      </Typography>
      <Typography variant="body1" component="div" sx={{ mb: 2 }}>
        {t('appendix.higherOrder.body')}
      </Typography>

      <Paper variant="outlined" sx={{ mb: 4, overflowX: 'auto' }}>
        <Typography variant="subtitle2" sx={{ p: 1.5, pb: 0 }}>
          {t('appendix.higherOrder.table')}
        </Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>
                <Math>{'x_1'}</Math>
              </TableCell>
              <TableCell>
                <Math>{'x_2'}</Math>
              </TableCell>
              <TableCell>
                <Math>{'y_1'}</Math>
              </TableCell>
              <TableCell>
                <Math>{'x_1 x_2'}</Math>
              </TableCell>
              <TableCell>{t('appendix.penaltyValue')} / P</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((r, i) => (
              <TableRow
                key={i}
                sx={{ bgcolor: r.ok ? 'success.light' : undefined, opacity: r.ok ? 1 : 0.7 }}
              >
                <TableCell>{r.x1}</TableCell>
                <TableCell>{r.x2}</TableCell>
                <TableCell>{r.y1}</TableCell>
                <TableCell>{r.x1 * r.x2}</TableCell>
                <TableCell sx={{ fontWeight: r.value === 0 ? 700 : 400 }}>{r.value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Typography
          variant="caption"
          component="div"
          color="text.secondary"
          sx={{ p: 1.5 }}
        >
          {t('appendix.higherOrder.tableNote')}
        </Typography>
      </Paper>

      <Typography variant="h2" sx={{ mb: 1 }}>
        {t('appendix.nodeVars.title')}
      </Typography>
      <Typography variant="body1" component="div" sx={{ mb: 2 }}>
        {t('appendix.nodeVars.body')}
      </Typography>

      <Paper variant="outlined" sx={{ p: 2, mb: 2, bgcolor: 'action.hover' }}>
        <Typography variant="body2">{t('appendix.nodeVars.example')}</Typography>
      </Paper>

      <PresenterNotes>{t('notes.appendix')}</PresenterNotes>
    </Box>
  );
}
