import { Alert, AlertTitle, Box, Chip, Stack, Typography } from '@mui/material';

import { findCase } from 'qubo-core/cases';
import { CaseScenario, useCaseName } from '../components/CaseScenario';
import { CaseWorkbench } from '../components/CaseWorkbench';
import { pageLabel } from '../components/SourceBadge';
import { PresenterNotes } from '../components/PresenterNotes';
import type { TKey } from '../i18n/locales/zh';
import { useI18n } from '../i18n';

/**
 * Case-specific talking points for whoever is presenting.
 *
 * Keys are written out rather than assembled from the case id, so TypeScript
 * checks each one against the dictionary.
 */
/**
 * For a case the paper only names: how its optimum follows from a number the
 * paper does print, when it does. Written out for the same reason as below.
 */
const ANCHOR_KEY: Record<string, TKey> = {
  'max-independent-set': 'case.max-independent-set.anchor',
};

/**
 * How a mentioned case relates to what the authors themselves did in the work
 * the §1 list comes from (Kochenberger & Glover 2006) — a confirmation, or a
 * stated difference. Shown in the banner, not the presenter notes: it is a
 * claim about provenance, which readers need as much as presenters do.
 */
const PROVENANCE_KEY: Record<string, TKey> = {
  'warehouse-location': 'case.warehouse-location.provenance',
  'constraint-satisfaction': 'case.constraint-satisfaction.provenance',
};

const NOTE_KEY: Record<string, TKey> = {
  'number-partitioning': 'notes.case.number-partitioning',
  'max-cut': 'notes.case.max-cut',
  'min-vertex-cover': 'notes.case.min-vertex-cover',
  'set-packing': 'notes.case.set-packing',
  'max-independent-set': 'notes.case.max-independent-set',
  'max-clique': 'notes.case.max-clique',
  'max-diversity': 'notes.case.max-diversity',
  'discrete-tomography': 'notes.case.discrete-tomography',
  'task-allocation': 'notes.case.task-allocation',
  'capital-budgeting': 'notes.case.capital-budgeting',
  'multiple-knapsack': 'notes.case.multiple-knapsack',
  'p-median': 'notes.case.p-median',
  'warehouse-location': 'notes.case.warehouse-location',
  'linear-ordering': 'notes.case.linear-ordering',
  'clique-partitioning': 'notes.case.clique-partitioning',
  'max-3-sat': 'notes.case.max-3-sat',
  'constraint-satisfaction': 'notes.case.constraint-satisfaction',
  'graph-partitioning': 'notes.case.graph-partitioning',
  'portfolio': 'notes.case.portfolio',
  'max-matching': 'notes.case.max-matching',
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

      {/*
        A case the paper only names says so before anything else: without this,
        the section badge and the familiar layout would read as "worked in the
        paper", and the Q below as something the PDF prints.
      */}
      {qcase.source === 'mentioned' && (
        <Alert severity="info" sx={{ mb: 3 }}>
          {/* §6 citations are a weaker claim than the §1 list, so they say so. */}
          <AlertTitle>
            {qcase.mention === 'cited' ? t('extended.banner.titleCited') : t('extended.banner.title')}
          </AlertTitle>
          {qcase.mention === 'cited'
            ? t('extended.banner.bodyCited', { section: qcase.section, pages: pageLabel(qcase.pages) })
            : t('extended.banner.body', { section: qcase.section, pages: pageLabel(qcase.pages) })}
          {ANCHOR_KEY[qcase.id] && (
            <Box sx={{ mt: 1.5 }}>{t(ANCHOR_KEY[qcase.id])}</Box>
          )}
          {PROVENANCE_KEY[qcase.id] && (
            <Box sx={{ mt: 1.5 }}>{t(PROVENANCE_KEY[qcase.id])}</Box>
          )}
        </Alert>
      )}

      <CaseScenario id={qcase.id} />
      <CaseWorkbench base={qcase} />
      {NOTE_KEY[qcase.id] && <PresenterNotes>{t(NOTE_KEY[qcase.id])}</PresenterNotes>}
    </Box>
  );
}
