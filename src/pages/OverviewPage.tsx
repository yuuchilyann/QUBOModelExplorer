import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
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
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { MinorEmbeddingView } from '../components/MinorEmbeddingView';
import { PresenterNotes } from '../components/PresenterNotes';
import { Math } from '../components/Math';
import type { TKey } from '../i18n/locales/zh';
import { useI18n } from '../i18n';

type Here = 'run' | 'emit' | 'planned';

/**
 * The solver side of the bridge.
 *
 * `name` doubles as the React key, so it stays a stable ASCII handle; the two
 * platforms whose name is descriptive rather than a proper noun carry a
 * `nameKey` for display. Anything else a reader has to read — topology, scale —
 * is a dictionary key unless it is itself a proper noun (Zephyr, QUBO, Ising).
 */
const PLATFORMS: {
  name: string;
  nameKey?: TKey;
  kindKey: TKey;
  native: string;
  topology?: string;
  topologyKey?: TKey;
  embedding: boolean;
  scaleKey: TKey;
  here: Here;
}[] = [
  {
    name: 'D-Wave Advantage2',
    kindKey: 'overview.platform.annealing',
    native: 'Ising',
    topology: 'Zephyr',
    embedding: true,
    scaleKey: 'overview.scale.advantage2',
    here: 'emit',
  },
  {
    name: 'Fujitsu Digital Annealer',
    kindKey: 'overview.platform.digital',
    native: 'QUBO',
    topologyKey: 'overview.topology.asic',
    embedding: false,
    scaleKey: 'overview.scale.digital',
    here: 'planned',
  },
  {
    name: 'QAOA',
    nameKey: 'overview.platform.name.qaoa',
    kindKey: 'overview.platform.gate',
    native: 'Hamiltonian',
    topologyKey: 'overview.topology.varies',
    embedding: true,
    scaleKey: 'overview.scale.qaoa',
    here: 'planned',
  },
  {
    name: 'Tabu search',
    nameKey: 'overview.platform.name.tabu',
    kindKey: 'overview.platform.classical',
    native: 'QUBO',
    topology: '—',
    embedding: false,
    scaleKey: 'overview.scale.tabu',
    here: 'run',
  },
  {
    name: 'Exhaustive search',
    nameKey: 'overview.platform.name.exhaustive',
    kindKey: 'overview.platform.classical',
    native: 'QUBO',
    topology: '—',
    embedding: false,
    scaleKey: 'overview.scale.exhaustive',
    here: 'run',
  },
];

const HERE_COLOR: Record<Here, 'success' | 'primary' | 'default'> = {
  run: 'success',
  emit: 'primary',
  planned: 'default',
};

const HERE_KEY = {
  run: 'overview.here.run',
  emit: 'overview.here.emit',
  planned: 'overview.here.planned',
} as const;

/**
 * What the standard form costs.
 *
 * The page up to here is the paper's own case FOR QUBO. This section is the
 * other half of the ledger, which the tutorial — written by the authors of the
 * classical QUBO metaheuristics it advocates — has little reason to dwell on.
 * Leaving it out would make the site an advertisement rather than a companion.
 */
const COSTS = [
  ['overview.cost.item1.title', 'overview.cost.item1.body'],
  ['overview.cost.item2.title', 'overview.cost.item2.body'],
  ['overview.cost.item3.title', 'overview.cost.item3.body'],
  ['overview.cost.item4.title', 'overview.cost.item4.body'],
] as const;

const FIT = ['overview.cost.fit.1', 'overview.cost.fit.2', 'overview.cost.fit.3', 'overview.cost.fit.4'] as const;
const UNFIT = ['overview.cost.unfit.1', 'overview.cost.unfit.2', 'overview.cost.unfit.3', 'overview.cost.unfit.4'] as const;

const PROBLEM_SIDE = [
  'Number Partitioning',
  'Max-Cut',
  'Vertex Cover',
  'Set Packing',
  'Max 2-SAT',
  'Set Partitioning',
  'Graph Colouring',
  'General 0/1 LP',
  'QAP',
  'Quadratic Knapsack',
];

export function OverviewPage() {
  const { t, tStr } = useI18n();
  const platformName = (p: (typeof PLATFORMS)[number]) =>
    p.nameKey ? tStr(p.nameKey) : p.name;

  return (
    <Box>
      <Typography variant="h1" sx={{ mb: 2 }}>
        {t('overview.title')}
      </Typography>
      <Typography variant="body1" component="div" sx={{ mb: 3 }}>
        {t('overview.lead')}
      </Typography>

      {/* ── the standard form, flanked by what feeds it and what consumes it ── */}
      <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          sx={{ alignItems: 'stretch' }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography variant="overline" color="text.secondary">
              {t('overview.left')}
            </Typography>
            <Stack spacing={0.5} sx={{ mt: 1 }}>
              {PROBLEM_SIDE.map((p) => (
                <Chip key={p} size="small" label={p} variant="outlined" sx={{ justifyContent: 'flex-start' }} />
              ))}
            </Stack>
          </Box>

          <Box
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              px: 2,
              py: 3,
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              borderRadius: 2,
            }}
          >
            <Typography variant="overline" sx={{ opacity: 0.85 }}>
              {t('overview.middle')}
            </Typography>
            <Box sx={{ '& .katex': { color: '#fff' }, mt: 1 }}>
              <Math block>{'y = x^t Q x'}</Math>
            </Box>
            <Typography variant="caption" sx={{ opacity: 0.85, textAlign: 'center' }}>
              x ∈ {'{0,1}'}
              <sup>n</sup>
            </Typography>
          </Box>

          <Box sx={{ flex: 1 }}>
            <Typography variant="overline" color="text.secondary">
              {t('overview.right')}
            </Typography>
            <Stack spacing={0.5} sx={{ mt: 1 }}>
              {PLATFORMS.map((p) => (
                <Chip
                  key={p.name}
                  size="small"
                  label={platformName(p)}
                  color={HERE_COLOR[p.here]}
                  variant={p.here === 'planned' ? 'outlined' : 'filled'}
                  sx={{ justifyContent: 'flex-start' }}
                />
              ))}
            </Stack>
          </Box>
        </Stack>
      </Paper>

      <Paper variant="outlined" sx={{ p: 2, mb: 3, bgcolor: 'action.hover' }}>
        <Typography variant="body2" component="div">
          {t('overview.whyIsing')}
        </Typography>
      </Paper>

      {/* ── platform comparison ── */}
      <Typography variant="h2" sx={{ mb: 1.5 }}>
        {t('overview.platforms')}
      </Typography>
      <Paper variant="outlined" sx={{ mb: 3, overflowX: 'auto' }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>{t('overview.col.native')}</TableCell>
              <TableCell>{t('overview.col.topology')}</TableCell>
              <TableCell>{t('overview.col.embedding')}</TableCell>
              <TableCell>{t('overview.col.scale')}</TableCell>
              <TableCell>{t('overview.col.here')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {PLATFORMS.map((p) => (
              <TableRow key={p.name}>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {platformName(p)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {t(p.kindKey)}
                  </Typography>
                </TableCell>
                <TableCell>{p.native}</TableCell>
                <TableCell>{p.topologyKey ? t(p.topologyKey) : p.topology}</TableCell>
                <TableCell>{p.embedding ? t('overview.yes') : t('overview.no')}</TableCell>
                <TableCell>
                  <Typography variant="caption">{t(p.scaleKey)}</Typography>
                </TableCell>
                <TableCell>
                  <Chip size="small" color={HERE_COLOR[p.here]} label={t(HERE_KEY[p.here])} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* ── D-Wave, unpacked ── */}
      <Accordion variant="outlined" disableGutters sx={{ mb: 3, '&:before': { display: 'none' } }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h3">{t('overview.dwave.title')}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" component="div" sx={{ mb: 2 }}>
            {t('overview.dwave.body')}
          </Typography>
          <Table size="small" sx={{ mb: 2 }}>
            <TableBody>
              {(
                [
                  ['overview.dwave.layer.company', 'overview.dwave.company'],
                  ['overview.dwave.layer.hardware', 'overview.dwave.hardware'],
                  ['overview.dwave.layer.cloud', 'overview.dwave.cloud'],
                  ['overview.dwave.layer.software', 'overview.dwave.software'],
                ] as const
              ).map(([k, v]) => (
                <TableRow key={k}>
                  <TableCell sx={{ width: 90, fontWeight: 600 }}>{t(k)}</TableCell>
                  <TableCell>
                    <Typography variant="body2">{t(v)}</Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Typography variant="body2" component="div" sx={{ mb: 1.5 }}>
            {t('overview.dwave.language')}
          </Typography>
          <Typography variant="body2" component="div" color="text.secondary">
            {t('overview.dwave.qbsolvNote')}
          </Typography>
        </AccordionDetails>
      </Accordion>

      {/* ── minor-embedding ── */}
      <Typography variant="h2" sx={{ mb: 1 }}>
        {t('overview.embedding.title')}
      </Typography>
      <Typography variant="body2" component="div" sx={{ mb: 2 }}>
        {t('overview.embedding.body')}
      </Typography>
      <MinorEmbeddingView />

      {/* ── the other half of the ledger ── */}
      <Typography variant="h2" sx={{ mt: 4, mb: 1 }}>
        {t('overview.cost.title')}
      </Typography>
      <Typography variant="body2" component="div" sx={{ mb: 2 }}>
        {t('overview.cost.lead')}
      </Typography>

      <Stack spacing={1.5} sx={{ mb: 3 }}>
        {COSTS.map(([title, body], i) => (
          <Paper key={title} variant="outlined" sx={{ p: 2 }}>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'flex-start' }}>
              <Chip size="small" color="warning" label={i + 1} />
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="h3" sx={{ mb: 0.5 }}>
                  {t(title)}
                </Typography>
                <Typography variant="body2" component="div" color="text.secondary">
                  {t(body)}
                </Typography>
              </Box>
            </Stack>
          </Paper>
        ))}
      </Stack>

      {/* The practical takeaway: a two-column smell test. */}
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 3 }}>
        {(
          [
            ['overview.cost.fit.title', FIT, 'success.main'],
            ['overview.cost.unfit.title', UNFIT, 'warning.main'],
          ] as const
        ).map(([title, items, color]) => (
          <Paper
            key={title}
            variant="outlined"
            sx={{ p: 2, flex: 1, borderTop: 3, borderTopColor: color }}
          >
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              {t(title)}
            </Typography>
            <Stack component="ul" spacing={0.75} sx={{ m: 0, pl: 2.5 }}>
              {items.map((k) => (
                <Typography key={k} component="li" variant="body2" color="text.secondary">
                  {t(k)}
                </Typography>
              ))}
            </Stack>
          </Paper>
        ))}
      </Stack>

      <Paper variant="outlined" sx={{ p: 2, mb: 3, bgcolor: 'action.hover' }}>
        <Typography variant="body2" component="div">
          {t('overview.cost.verdict')}
        </Typography>
      </Paper>

      <PresenterNotes>{t('notes.overview')}</PresenterNotes>
    </Box>
  );
}
