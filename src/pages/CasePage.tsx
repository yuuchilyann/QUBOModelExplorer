import { Alert, Box, Chip, Stack, Typography } from '@mui/material';

import { findCase } from '../cases';
import { CaseScenario, useCaseName } from '../components/CaseScenario';
import { CaseWorkbench } from '../components/CaseWorkbench';
import { PresenterNotes } from '../components/PresenterNotes';
import type { TKey } from '../i18n/locales/zh';
import { useI18n } from '../i18n';

/**
 * Case-specific talking points for whoever is presenting.
 *
 * Keys are written out rather than assembled from the case id, so TypeScript
 * checks each one against the dictionary.
 */
const NOTE_KEY: Record<string, TKey> = {
  'number-partitioning': 'notes.case.number-partitioning',
  'max-cut': 'notes.case.max-cut',
  'min-vertex-cover': 'notes.case.min-vertex-cover',
  'set-packing': 'notes.case.set-packing',
  'max-2-sat': 'notes.case.max-2-sat',
  'set-partitioning': 'notes.case.set-partitioning',
  'graph-coloring': 'notes.case.graph-coloring',
  'general-01': 'notes.case.general-01',
  qap: 'notes.case.qap',
  'quadratic-knapsack': 'notes.case.quadratic-knapsack',
};

export function CasePage({ id }: { id: string }) {
  const qcase = findCase(id);
  // Hooks must run unconditionally, so these precede the not-found return.
  const { t } = useI18n();
  const name = useCaseName(id);

  if (!qcase) {
    return <Alert severity="error">{t('case.notFound', { id })}</Alert>;
  }

  return (
    <Box>
      {/*
        The paper's own handle (§3.1) stays visible for cross-referencing, but
        the heading now leads with the problem's name rather than its slug.
      */}
      <Stack direction="row" spacing={1} sx={{ alignItems: 'baseline', mb: 0.5, flexWrap: 'wrap' }}>
        <Typography variant="h1">{name ?? qcase.id}</Typography>
        <Chip size="small" variant="outlined" label={qcase.section} />
      </Stack>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
        {qcase.id}
      </Typography>

      <CaseScenario id={qcase.id} />
      <CaseWorkbench base={qcase} />
      {NOTE_KEY[qcase.id] && <PresenterNotes>{t(NOTE_KEY[qcase.id])}</PresenterNotes>}
    </Box>
  );
}
