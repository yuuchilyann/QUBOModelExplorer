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
import { useI18n } from '../i18n';

type Here = 'run' | 'emit' | 'planned';

const PLATFORMS: {
  name: string;
  kindKey: 'overview.platform.annealing' | 'overview.platform.gate' | 'overview.platform.digital' | 'overview.platform.classical';
  native: string;
  topology: string;
  embedding: boolean;
  scale: string;
  here: Here;
}[] = [
  {
    name: 'D-Wave Advantage2',
    kindKey: 'overview.platform.annealing',
    native: 'Ising',
    topology: 'Zephyr',
    embedding: true,
    scale: '全連通約數百個邏輯變數',
    here: 'emit',
  },
  {
    name: 'Fujitsu Digital Annealer',
    kindKey: 'overview.platform.digital',
    native: 'QUBO',
    topology: '全連通 (ASIC)',
    embedding: false,
    scale: '1,024 變數（Aramon et al. 2019）',
    here: 'planned',
  },
  {
    name: 'QAOA（閘模型）',
    kindKey: 'overview.platform.gate',
    native: 'Hamiltonian',
    topology: '依硬體而異',
    embedding: true,
    scale: '目前僅小規模 MaxCut / MIS',
    here: 'planned',
  },
  {
    name: 'Tabu search（古典）',
    kindKey: 'overview.platform.classical',
    native: 'QUBO',
    topology: '—',
    embedding: false,
    scale: '數千變數',
    here: 'run',
  },
  {
    name: '窮舉（古典）',
    kindKey: 'overview.platform.classical',
    native: 'QUBO',
    topology: '—',
    embedding: false,
    scale: '≤ 24 變數，保證最優',
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
  const { t } = useI18n();

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
                  label={p.name}
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
                    {p.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {t(p.kindKey)}
                  </Typography>
                </TableCell>
                <TableCell>{p.native}</TableCell>
                <TableCell>{p.topology}</TableCell>
                <TableCell>{p.embedding ? t('overview.yes') : t('overview.no')}</TableCell>
                <TableCell>
                  <Typography variant="caption">{p.scale}</Typography>
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

      <PresenterNotes>
        這一頁只要讓觀眾接受一件事：<strong>QUBO 是一座橋，不是一個目的地</strong>。一端是十一種看起來毫無關係的問題，另一端是四種完全不同的硬體，中間那個{' '}
        <Math>{'x^tQx'}</Math> 是唯一的共同語言。
        <br />
        <br />
        常見提問一：「那是不是丟給量子電腦就會比較快？」答案是不會。論文作者自己在 p.34
        說他們的古典 solver QUBO 2.0 比主流量子系統快三個數量級。本站十一個案例全都小到瀏覽器毫秒級就窮舉完了。
        <br />
        <br />
        常見提問二：「為什麼要先變成 NP-hard？」其實並沒有變難。QUBO 本來就是 NP-hard，規約沒有讓問題變簡單。動機是<strong>統一介面</strong>，不是降低難度。
        <br />
        <br />
        minor-embedding 那張圖建議現場拖 slider 從 3 拉到 10，讓大家看物理需求怎麼平方成長。這是「5000 qubits 為什麼只放得下幾百個變數」最快的解釋。
      </PresenterNotes>
    </Box>
  );
}
