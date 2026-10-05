import { Box, Paper, Stack, Typography } from '@mui/material';

import type { TKey } from '../i18n/locales/zh';
import { useI18n } from '../i18n';

/**
 * The concrete story behind a case.
 *
 * The paper introduces each model by section number and goes straight to the
 * algebra, which leaves a reader who has not met the problem before with no
 * idea what the answer would be FOR. These blurbs put "what is this" ahead of
 * "here is the Q matrix" without altering a single number.
 *
 * Keys are listed explicitly rather than built as `case.${id}.name`: written
 * out, TypeScript checks every one against the dictionary, so a typo or a
 * missing translation is a compile error instead of a raw key rendered on the
 * page.
 */
type ScenarioKeys = { name: TKey; scenario: TKey; xMeans: TKey; uses: TKey };

const SCENARIOS: Record<string, ScenarioKeys> = {
  'number-partitioning': {
    name: 'case.number-partitioning.name',
    scenario: 'case.number-partitioning.scenario',
    xMeans: 'case.number-partitioning.xMeans',
    uses: 'case.number-partitioning.uses',
  },
  'max-cut': {
    name: 'case.max-cut.name',
    scenario: 'case.max-cut.scenario',
    xMeans: 'case.max-cut.xMeans',
    uses: 'case.max-cut.uses',
  },
  'min-vertex-cover': {
    name: 'case.min-vertex-cover.name',
    scenario: 'case.min-vertex-cover.scenario',
    xMeans: 'case.min-vertex-cover.xMeans',
    uses: 'case.min-vertex-cover.uses',
  },
  'set-packing': {
    name: 'case.set-packing.name',
    scenario: 'case.set-packing.scenario',
    xMeans: 'case.set-packing.xMeans',
    uses: 'case.set-packing.uses',
  },
  'max-independent-set': {
    name: 'case.max-independent-set.name',
    scenario: 'case.max-independent-set.scenario',
    xMeans: 'case.max-independent-set.xMeans',
    uses: 'case.max-independent-set.uses',
  },
  'max-clique': {
    name: 'case.max-clique.name',
    scenario: 'case.max-clique.scenario',
    xMeans: 'case.max-clique.xMeans',
    uses: 'case.max-clique.uses',
  },
  'max-diversity': {
    name: 'case.max-diversity.name',
    scenario: 'case.max-diversity.scenario',
    xMeans: 'case.max-diversity.xMeans',
    uses: 'case.max-diversity.uses',
  },
  'discrete-tomography': {
    name: 'case.discrete-tomography.name',
    scenario: 'case.discrete-tomography.scenario',
    xMeans: 'case.discrete-tomography.xMeans',
    uses: 'case.discrete-tomography.uses',
  },
  'task-allocation': {
    name: 'case.task-allocation.name',
    scenario: 'case.task-allocation.scenario',
    xMeans: 'case.task-allocation.xMeans',
    uses: 'case.task-allocation.uses',
  },
  'capital-budgeting': {
    name: 'case.capital-budgeting.name',
    scenario: 'case.capital-budgeting.scenario',
    xMeans: 'case.capital-budgeting.xMeans',
    uses: 'case.capital-budgeting.uses',
  },
  'multiple-knapsack': {
    name: 'case.multiple-knapsack.name',
    scenario: 'case.multiple-knapsack.scenario',
    xMeans: 'case.multiple-knapsack.xMeans',
    uses: 'case.multiple-knapsack.uses',
  },
  'p-median': {
    name: 'case.p-median.name',
    scenario: 'case.p-median.scenario',
    xMeans: 'case.p-median.xMeans',
    uses: 'case.p-median.uses',
  },
  'warehouse-location': {
    name: 'case.warehouse-location.name',
    scenario: 'case.warehouse-location.scenario',
    xMeans: 'case.warehouse-location.xMeans',
    uses: 'case.warehouse-location.uses',
  },
  'linear-ordering': {
    name: 'case.linear-ordering.name',
    scenario: 'case.linear-ordering.scenario',
    xMeans: 'case.linear-ordering.xMeans',
    uses: 'case.linear-ordering.uses',
  },
  'clique-partitioning': {
    name: 'case.clique-partitioning.name',
    scenario: 'case.clique-partitioning.scenario',
    xMeans: 'case.clique-partitioning.xMeans',
    uses: 'case.clique-partitioning.uses',
  },
  'max-3-sat': {
    name: 'case.max-3-sat.name',
    scenario: 'case.max-3-sat.scenario',
    xMeans: 'case.max-3-sat.xMeans',
    uses: 'case.max-3-sat.uses',
  },
  'constraint-satisfaction': {
    name: 'case.constraint-satisfaction.name',
    scenario: 'case.constraint-satisfaction.scenario',
    xMeans: 'case.constraint-satisfaction.xMeans',
    uses: 'case.constraint-satisfaction.uses',
  },
  'max-2-sat': {
    name: 'case.max-2-sat.name',
    scenario: 'case.max-2-sat.scenario',
    xMeans: 'case.max-2-sat.xMeans',
    uses: 'case.max-2-sat.uses',
  },
  'set-partitioning': {
    name: 'case.set-partitioning.name',
    scenario: 'case.set-partitioning.scenario',
    xMeans: 'case.set-partitioning.xMeans',
    uses: 'case.set-partitioning.uses',
  },
  'graph-coloring': {
    name: 'case.graph-coloring.name',
    scenario: 'case.graph-coloring.scenario',
    xMeans: 'case.graph-coloring.xMeans',
    uses: 'case.graph-coloring.uses',
  },
  'general-01': {
    name: 'case.general-01.name',
    scenario: 'case.general-01.scenario',
    xMeans: 'case.general-01.xMeans',
    uses: 'case.general-01.uses',
  },
  qap: {
    name: 'case.qap.name',
    scenario: 'case.qap.scenario',
    xMeans: 'case.qap.xMeans',
    uses: 'case.qap.uses',
  },
  'quadratic-knapsack': {
    name: 'case.quadratic-knapsack.name',
    scenario: 'case.quadratic-knapsack.scenario',
    xMeans: 'case.quadratic-knapsack.xMeans',
    uses: 'case.quadratic-knapsack.uses',
  },
};

/** The human name for a case, for headings and cards. Undefined if none. */
export function useCaseName(id: string): string | undefined {
  const { tStr } = useI18n();
  return SCENARIOS[id] ? tStr(SCENARIOS[id].name) : undefined;
}

/**
 * The framing as a card teaser.
 *
 * Clamped rather than given its own shorter string: one source of text means
 * the card and the case page can never drift apart, and the cases whose
 * scenario runs to a second paragraph are exactly the ones where the extra
 * detail belongs on the page, not in a list.
 */
export function CaseScenarioLine({ id }: { id: string }) {
  const { t } = useI18n();
  const keys = SCENARIOS[id];
  if (!keys) return null;
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      component="div"
      sx={{
        display: '-webkit-box',
        WebkitBoxOrient: 'vertical',
        WebkitLineClamp: 2,
        overflow: 'hidden',
      }}
    >
      {t(keys.scenario)}
    </Typography>
  );
}

export function CaseScenario({ id }: { id: string }) {
  const { t } = useI18n();
  const keys = SCENARIOS[id];
  if (!keys) return null;

  return (
    <Paper variant="outlined" sx={{ p: 2, mb: 3, borderLeft: 4, borderLeftColor: 'primary.main' }}>
      <Typography variant="overline" color="text.secondary">
        {t('scenario.heading')}
      </Typography>

      <Typography variant="body1" component="div" sx={{ mt: 0.5, mb: 2 }}>
        {t(keys.scenario)}
      </Typography>

      <Stack spacing={1.5}>
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 0.25 }}>
            {t('scenario.xMeans')}
          </Typography>
          <Typography variant="body2" component="div" color="text.secondary">
            {t(keys.xMeans)}
          </Typography>
        </Box>

        <Box>
          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
            {t('scenario.uses')}
          </Typography>
          <Typography variant="body2" component="div" color="text.secondary">
            {t(keys.uses)}
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
}
