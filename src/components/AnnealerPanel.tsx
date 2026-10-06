import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  Grid,
  LinearProgress,
  Paper,
  Slider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from '@mui/material';
import CasinoIcon from '@mui/icons-material/Casino';

import {
  DA_FIRST_GENERATION,
  DA_THIRD_GENERATION,
  precisionReport,
  registerLimit,
  type DaPrecision,
} from 'qubo-core/hardware/daPrecision';
import type { AnnealTracePoint, DigitalAnnealerResult } from 'qubo-core/samplers/digitalAnnealer';
import type { QuboModel } from 'qubo-core/types';

import type { AnnealRequest, AnnealResponse, QuantizeOutcome } from '../workers/anneal.worker';
import { QUANTIZE_MAX_VARS } from '../workers/anneal.worker';
import { useI18n } from '../i18n';
import { CATEGORY_COLORS } from '../theme';

/** Beyond this a run of the default length stops feeling interactive. */
export const ANNEAL_MAX_VARS = 200;

const SWEEP_CHOICES = [50, 200, 1000] as const;
const RUNS = 16;
const DEFAULT_SEED = 1;
/** The first generation's 26/16 split, kept as the slider moves. */
const LINEAR_EXTRA_BITS = DA_FIRST_GENERATION.linearBits - DA_FIRST_GENERATION.quadraticBits;
const DEBOUNCE_MS = 250;

const DA_COLOR = CATEGORY_COLORS[0];
const SA_COLOR = '#a0aec0';
const OFFSET_COLOR = CATEGORY_COLORS[1];

type RunState =
  | { kind: 'running'; progress: number }
  | {
      kind: 'done';
      parallel: DigitalAnnealerResult;
      single: DigitalAnnealerResult;
      quantized: QuantizeOutcome | null;
    }
  | { kind: 'error'; message: string };

export type AnnealerPanelProps = {
  model: QuboModel;
  /** The exhaustive optimum, when the page's solver has proven one. */
  optimum: number | null;
};

/**
 * The Digital Annealer's algorithm, run in the browser beside plain simulated
 * annealing on the same schedule.
 *
 * What it can show is behaviour — how often each method moves, how the offset
 * climbs out of a minimum, whether runs land on the optimum. What it cannot
 * show is Fujitsu's speed: the hardware does a step's n trials at once, and a
 * browser does not. The copy says so before any number appears.
 */
export function AnnealerPanel({ model, optimum }: AnnealerPanelProps) {
  const { t } = useI18n();
  const [sweeps, setSweeps] = useState<number>(200);
  const [seed, setSeed] = useState(DEFAULT_SEED);
  const [bits, setBits] = useState(8);
  const [state, setState] = useState<RunState>({ kind: 'running', progress: 0 });
  const workerRef = useRef<Worker | null>(null);

  const precision: DaPrecision = useMemo(
    () => ({ id: `${bits}-bit`, linearBits: bits + LINEAR_EXTRA_BITS, quadraticBits: bits }),
    [bits],
  );
  const tooLarge = model.n > ANNEAL_MAX_VARS;

  useEffect(() => {
    if (tooLarge) return;
    setState({ kind: 'running', progress: 0 });
    const timer = setTimeout(() => {
      const worker = new Worker(new URL('../workers/anneal.worker.ts', import.meta.url), {
        type: 'module',
      });
      workerRef.current = worker;
      worker.onmessage = (ev: MessageEvent<AnnealResponse>) => {
        const msg = ev.data;
        if (msg.kind === 'progress') {
          setState((s) => (s.kind === 'running' ? { kind: 'running', progress: msg.fraction } : s));
          return;
        }
        setState(msg.kind === 'done' ? { ...msg, kind: 'done' } : msg);
        worker.terminate();
        if (workerRef.current === worker) workerRef.current = null;
      };
      const req: AnnealRequest = { Q: model.Q, sense: model.sense, sweeps, runs: RUNS, seed, precision };
      worker.postMessage(req);
    }, DEBOUNCE_MS);
    return () => {
      clearTimeout(timer);
      workerRef.current?.terminate();
      workerRef.current = null;
    };
  }, [model, sweeps, seed, precision, tooLarge]);

  if (tooLarge) {
    return <Alert severity="info">{t('anneal.tooLarge', { n: model.n, max: ANNEAL_MAX_VARS })}</Alert>;
  }

  return (
    <Stack spacing={3}>
      <Typography variant="body2" component="div">
        {t('anneal.intro')}
      </Typography>

      <Stack direction="row" spacing={2} sx={{ alignItems: 'center', flexWrap: 'wrap', rowGap: 1 }}>
        <Typography variant="body2" color="text.secondary">
          {t('anneal.sweeps')}
        </Typography>
        <ToggleButtonGroup
          size="small"
          exclusive
          value={sweeps}
          onChange={(_, v: number | null) => v != null && setSweeps(v)}
        >
          {SWEEP_CHOICES.map((s) => (
            <ToggleButton key={s} value={s} sx={{ px: 1.5 }}>
              {s}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
        <Tooltip title={t('anneal.reseed.tooltip')}>
          <Button size="small" startIcon={<CasinoIcon />} onClick={() => setSeed((s) => s + 1)}>
            {t('anneal.reseed')}
          </Button>
        </Tooltip>
        <Typography variant="caption" color="text.secondary">
          {t('anneal.budget', { runs: RUNS, steps: (sweeps * model.n).toLocaleString(), seed })}
        </Typography>
      </Stack>

      {state.kind === 'running' && (
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {t('anneal.running')}
          </Typography>
          <LinearProgress
            variant={state.progress > 0 ? 'determinate' : 'indeterminate'}
            value={state.progress * 100}
          />
        </Box>
      )}
      {state.kind === 'error' && <Alert severity="error">{t('anneal.error', { message: state.message })}</Alert>}

      {state.kind === 'done' && (
        <>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <MethodCard result={state.parallel} optimum={optimum} color={DA_COLOR} />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <MethodCard result={state.single} optimum={optimum} color={SA_COLOR} />
            </Grid>
          </Grid>
          {optimum == null && (
            <Typography variant="caption" color="text.secondary">
              {t('anneal.noOptimum')}
            </Typography>
          )}

          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              {t('anneal.trace.title')}
            </Typography>
            <TraceChart parallel={state.parallel.trace ?? []} single={state.single.trace ?? []} optimum={optimum} />
            <Typography variant="body2" color="text.secondary" component="div" sx={{ mt: 1 }}>
              {t('anneal.trace.legend')}
            </Typography>
          </Paper>
        </>
      )}

      <PrecisionCard
        model={model}
        bits={bits}
        onBits={setBits}
        quantized={state.kind === 'done' ? state.quantized : null}
        optimum={optimum}
        pending={state.kind === 'running'}
      />

      <Paper variant="outlined" sx={{ p: 2, bgcolor: 'action.hover' }}>
        <Typography variant="body2" component="div">
          {t('anneal.note')}
        </Typography>
      </Paper>
    </Stack>
  );
}

function MethodCard({
  result,
  optimum,
  color,
}: {
  result: DigitalAnnealerResult;
  optimum: number | null;
  color: string;
}) {
  const { t } = useI18n();
  const parallel = result.trial === 'parallel';
  const best = result.best[0].energy;
  const hits = optimum == null ? null : result.runs.filter((r) => r.energy === optimum).length;

  const rows: [string, string][] = [
    [String(t('anneal.stat.best')), String(best)],
    ...(hits == null
      ? []
      : ([[String(t('anneal.stat.hits')), `${hits} / ${result.runs.length}`]] as [string, string][])),
    [String(t('anneal.stat.acceptance')), `${(result.acceptanceRate * 100).toFixed(0)}%`],
    ...(parallel
      ? ([[String(t('anneal.stat.offsetSteps')), result.offsetSteps.toLocaleString()]] as [string, string][])
      : []),
    [String(t('anneal.stat.evaluated')), result.evaluated.toLocaleString()],
  ];

  return (
    <Paper variant="outlined" sx={{ p: 2, height: '100%', borderTop: 4, borderTopColor: color }}>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 1, flexWrap: 'wrap', rowGap: 1 }}>
        <Typography variant="subtitle2">{t(parallel ? 'anneal.da.title' : 'anneal.sa.title')}</Typography>
        {optimum != null && (
          <Chip
            size="small"
            color={best === optimum ? 'success' : 'warning'}
            label={t(best === optimum ? 'anneal.reached' : 'anneal.missed')}
          />
        )}
      </Stack>
      <Typography variant="caption" color="text.secondary" component="div" sx={{ mb: 1 }}>
        {t(parallel ? 'anneal.da.sub' : 'anneal.sa.sub')}
      </Typography>
      <Table size="small">
        <TableBody>
          {rows.map(([k, v]) => (
            <TableRow key={k}>
              <TableCell sx={{ pl: 0, color: 'text.secondary' }}>{k}</TableCell>
              <TableCell align="right" sx={{ pr: 0, fontVariantNumeric: 'tabular-nums', fontWeight: 500 }}>
                {v}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}

const W = 640;
const H_ENERGY = 180;
const H_OFFSET = 70;
const PAD = { l: 52, r: 10, t: 8, b: 6 };

/**
 * First run of each method, energy over steps, with the Digital Annealer's
 * offset underneath on the same step axis. The offset strip is where the escape
 * mechanism becomes visible: a sawtooth that climbs while nothing is accepted
 * and drops to zero the moment something is.
 */
function TraceChart({
  parallel,
  single,
  optimum,
}: {
  parallel: AnnealTracePoint[];
  single: AnnealTracePoint[];
  optimum: number | null;
}) {
  const { t } = useI18n();
  if (!parallel.length) return null;

  const lastStep = Math.max(parallel[parallel.length - 1].step, single[single.length - 1]?.step ?? 0) || 1;
  const energies = [...parallel, ...single].map((p) => p.energy);
  if (optimum != null) energies.push(optimum);
  const lo = Math.min(...energies);
  const hi = Math.max(...energies);
  const span = hi - lo || 1;
  const maxOffset = Math.max(...parallel.map((p) => p.offset)) || 1;

  const sx = (step: number) => PAD.l + (step / lastStep) * (W - PAD.l - PAD.r);
  const sy = (e: number) => PAD.t + (1 - (e - lo) / span) * (H_ENERGY - PAD.t - PAD.b);
  const top = H_ENERGY + 14;
  const so = (o: number) => top + (1 - o / maxOffset) * (H_OFFSET - 8);
  const line = (pts: AnnealTracePoint[]) => pts.map((p) => `${sx(p.step).toFixed(1)},${sy(p.energy).toFixed(1)}`).join(' ');
  const area =
    `${sx(parallel[0].step).toFixed(1)},${so(0).toFixed(1)} ` +
    parallel.map((p) => `${sx(p.step).toFixed(1)},${so(p.offset).toFixed(1)}`).join(' ') +
    ` ${sx(parallel[parallel.length - 1].step).toFixed(1)},${so(0).toFixed(1)}`;

  return (
    <Box sx={{ width: '100%', overflowX: 'auto' }}>
      <svg viewBox={`0 0 ${W} ${top + H_OFFSET + 18}`} width="100%" style={{ minWidth: 360, display: 'block' }}>
        <text x={4} y={PAD.t + 10} fontSize={10} fill="#718096">
          {hi}
        </text>
        <text x={4} y={H_ENERGY - PAD.b} fontSize={10} fill="#718096">
          {lo}
        </text>
        <line x1={PAD.l} x2={W - PAD.r} y1={H_ENERGY - PAD.b} y2={H_ENERGY - PAD.b} stroke="#e2e8f0" />
        {optimum != null && (
          <>
            <line
              x1={PAD.l}
              x2={W - PAD.r}
              y1={sy(optimum)}
              y2={sy(optimum)}
              stroke="#38a169"
              strokeDasharray="4 3"
            />
            <text x={PAD.l + 4} y={sy(optimum) + 12} fontSize={10} fill="#38a169">
              {String(t('anneal.trace.optimum'))}
            </text>
          </>
        )}
        <polyline points={line(single)} fill="none" stroke={SA_COLOR} strokeWidth={1.2} />
        <polyline points={line(parallel)} fill="none" stroke={DA_COLOR} strokeWidth={1.6} />

        <text x={4} y={top + 10} fontSize={10} fill={OFFSET_COLOR}>
          E_off
        </text>
        <polygon points={area} fill={OFFSET_COLOR} fillOpacity={0.35} stroke={OFFSET_COLOR} strokeWidth={0.8} />
        <line x1={PAD.l} x2={W - PAD.r} y1={so(0)} y2={so(0)} stroke="#e2e8f0" />
        <text x={W - PAD.r} y={top + H_OFFSET + 14} fontSize={10} fill="#718096" textAnchor="end">
          {String(t('anneal.trace.steps', { n: lastStep + 1 }))}
        </text>
      </svg>
    </Box>
  );
}

function PrecisionCard({
  model,
  bits,
  onBits,
  quantized,
  optimum,
  pending,
}: {
  model: QuboModel;
  bits: number;
  onBits: (b: number) => void;
  quantized: QuantizeOutcome | null;
  optimum: number | null;
  pending: boolean;
}) {
  const { t } = useI18n();
  const gens = [
    { key: 'anneal.precision.da1', target: DA_FIRST_GENERATION },
    { key: 'anneal.precision.da3', target: DA_THIRD_GENERATION },
  ] as const;
  const report = precisionReport(model.Q, DA_FIRST_GENERATION);
  const moved = quantized && optimum != null ? quantized.energyOnOriginal !== optimum : null;

  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        {t('anneal.precision.title')}
      </Typography>
      <Typography variant="body2" color="text.secondary" component="div" sx={{ mb: 1.5 }}>
        {t('anneal.precision.intro')}
      </Typography>
      <Box sx={{ overflowX: 'auto', mb: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>{t('anneal.precision.col.linear')}</TableCell>
              <TableCell>{t('anneal.precision.col.quadratic')}</TableCell>
              <TableCell>{t('anneal.precision.col.fits')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>{t('anneal.precision.needed')}</TableCell>
              <TableCell sx={{ fontVariantNumeric: 'tabular-nums' }}>
                {report.integral
                  ? t('anneal.precision.bits', { bits: report.linearBitsNeeded, max: report.maxLinear })
                  : t('anneal.precision.nonInteger')}
              </TableCell>
              <TableCell sx={{ fontVariantNumeric: 'tabular-nums' }}>
                {report.integral
                  ? t('anneal.precision.bits', { bits: report.quadraticBitsNeeded, max: report.maxQuadratic })
                  : t('anneal.precision.nonInteger')}
              </TableCell>
              <TableCell />
            </TableRow>
            {gens.map(({ key, target }) => {
              const fits = precisionReport(model.Q, target).fits;
              return (
                <TableRow key={key}>
                  <TableCell>{t(key)}</TableCell>
                  <TableCell>{t('anneal.precision.register', { bits: target.linearBits })}</TableCell>
                  <TableCell>{t('anneal.precision.register', { bits: target.quadraticBits })}</TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      color={fits ? 'success' : 'warning'}
                      label={t(fits ? 'anneal.precision.fits' : 'anneal.precision.scaled')}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>

      <Typography variant="body2" sx={{ fontWeight: 500 }}>
        {t('anneal.precision.what', { bits, max: registerLimit(bits) })}
      </Typography>
      <Box sx={{ px: 1, maxWidth: 420 }}>
        <Slider
          size="small"
          min={3}
          max={16}
          step={1}
          marks
          value={bits}
          valueLabelDisplay="auto"
          onChange={(_, v) => onBits(v as number)}
        />
      </Box>
      {model.n > QUANTIZE_MAX_VARS ? (
        <Typography variant="body2" color="text.secondary">
          {t('anneal.precision.tooLarge', { max: QUANTIZE_MAX_VARS })}
        </Typography>
      ) : pending || !quantized ? (
        <Typography variant="body2" color="text.secondary">
          {t('anneal.running')}
        </Typography>
      ) : moved == null ? (
        <Typography variant="body2" color="text.secondary">
          {t('anneal.noOptimum')}
        </Typography>
      ) : (
        <Alert severity={moved ? 'warning' : 'success'}>
          {quantized.scale === 1 && quantized.rounded === 0
            ? t('anneal.precision.untouched', { bits })
            : moved
            ? t('anneal.precision.moved', {
                scale: quantized.scale.toPrecision(3),
                rounded: quantized.rounded,
                got: quantized.energyOnOriginal,
                optimum: optimum!,
              })
            : t('anneal.precision.kept', { scale: quantized.scale.toPrecision(3), rounded: quantized.rounded })}
        </Alert>
      )}
    </Paper>
  );
}
