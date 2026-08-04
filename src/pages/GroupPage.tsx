import { Box, Card, CardActionArea, CardContent, Chip, Stack, Typography } from '@mui/material';

import { derive } from '../lib/derive';
import { CaseScenarioLine, useCaseName } from '../components/CaseScenario';
import { PresenterNotes } from '../components/PresenterNotes';
import { SourceBadge } from '../components/SourceBadge';
import type { CaseGroup, QuboCase } from '../types';
import { useI18n } from '../i18n';

const TITLE_KEY = {
  natural: 'group.natural.title',
  knownPenalty: 'group.knownPenalty.title',
  general: 'group.general.title',
} as const;

const BODY_KEY = {
  natural: 'group.natural.body',
  knownPenalty: 'group.knownPenalty.body',
  general: 'group.general.body',
} as const;

const NOTE_KEY = {
  natural: 'notes.group.natural',
  knownPenalty: 'notes.group.knownPenalty',
  general: 'notes.group.general',
} as const;

/**
 * One case, as a browsable card.
 *
 * Its own component because `useCaseName` is a hook and the list below maps
 * over cases — calling it inside the map would break the rules of hooks.
 */
function CaseCard({ c, onOpen }: { c: QuboCase; onOpen: (id: string) => void }) {
  const { t } = useI18n();
  const name = useCaseName(c.id);
  const { model } = derive(c);
  const slack = model.n - c.model.numVars;

  return (
    <Card variant="outlined">
      <CardActionArea onClick={() => onOpen(c.id)}>
        <CardContent>
          <Stack
            direction="row"
            spacing={1}
            sx={{ alignItems: 'center', flexWrap: 'wrap', rowGap: 1, mb: 1 }}
          >
            <SourceBadge qcase={c} />
            <Typography variant="h3">{name ?? c.id}</Typography>
            <Box sx={{ flexGrow: 1 }} />
            <Chip
              size="small"
              variant="outlined"
              label={
                slack > 0
                  ? t('scale.varsWithSlack', { base: c.model.numVars, slack, n: model.n })
                  : t('scale.vars', { n: model.n })
              }
            />
            {c.penalty && (
              <Chip size="small" variant="outlined" label={`P = ${c.penalty.paperValue}`} />
            )}
            {c.editable && <Chip size="small" color="primary" label={t('editor.title')} />}
          </Stack>

          {/* The framing, so the list can be browsed without opening each case. */}
          <Box sx={{ mb: 1 }}>
            <CaseScenarioLine id={c.id} />
          </Box>

          <Typography variant="caption" color="text.secondary">
            {t('scale.states', { states: (2 ** model.n).toLocaleString() })} ·{' '}
            {c.model.sense === 'min' ? t('common.min') : t('common.max')} ·{' '}
            {c.model.constraints.length} {t('common.constraints')}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export type GroupPageProps = {
  group: CaseGroup;
  cases: QuboCase[];
  onOpen: (id: string) => void;
};

export function GroupPage({ group, cases, onOpen }: GroupPageProps) {
  const { t } = useI18n();

  return (
    <Box>
      <Typography variant="h1" sx={{ mb: 2 }}>
        {t(TITLE_KEY[group])}
      </Typography>
      <Typography variant="body1" component="div" sx={{ mb: 3 }}>
        {t(BODY_KEY[group])}
      </Typography>

      <Stack spacing={2}>
        {cases.map((c) => (
          <CaseCard key={c.id} c={c} onOpen={onOpen} />
        ))}
      </Stack>

      <PresenterNotes>{t(NOTE_KEY[group])}</PresenterNotes>
    </Box>
  );
}
