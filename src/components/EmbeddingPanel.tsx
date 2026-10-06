import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  FormControlLabel,
  LinearProgress,
  Paper,
  Stack,
  Switch,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from '@mui/material';
import CasinoIcon from '@mui/icons-material/Casino';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

import {
  DEFAULT_EMBED_SEED,
  PEGASUS_SIZES,
  chainCouplers,
  embeddingStats,
  intraChainCouplers,
} from 'qubo-core/hardware/embed';
import {
  adjacency,
  linearToPegasus,
  pegasusGraph,
  pegasusLayout,
  type HardwareGraph,
} from 'qubo-core/hardware/pegasus';
import { density } from 'qubo-core/hardware/problemGraph';
import type { QuboModel } from 'qubo-core/types';

import { useEmbedding } from '../hooks/useEmbedding';
import { useI18n } from '../i18n';
import { CATEGORY_COLORS } from '../theme';

const colorOf = (i: number) => CATEGORY_COLORS[i % CATEGORY_COLORS.length];

const IDLE_QUBIT = '#cbd5e0';
const COUPLING = '#4a5568';

/** Marker and stroke sizes per fragment, so P(6)'s 680 qubits stay legible. */
const SCALE: Record<number, { r: number; chain: number; link: number }> = {
  2: { r: 6, chain: 4, link: 1.6 },
  3: { r: 4.2, chain: 3, link: 1.2 },
  4: { r: 3.2, chain: 2.4, link: 1 },
  6: { r: 2.2, chain: 1.8, link: 0.8 },
};

type Segment = [x1: number, y1: number, x2: number, y2: number];

/**
 * How a coupler is drawn. Crossing qubits, and two qubits end to end on the
 * same line, meet at a point; two side-by-side qubits (Pegasus's odd
 * couplers) are joined by a short rung across the gap.
 */
type Link = { kind: 'dot'; x: number; y: number } | { kind: 'rung'; seg: Segment };

type Geometry = {
  /** Each qubit as a line segment, in SVG units. */
  seg: Map<number, Segment>;
  link: (a: number, b: number) => Link;
  viewBox: string;
};

/**
 * Pegasus as D-Wave draws it: every qubit a line segment, and two qubits that
 * cross are coupled where they cross.
 *
 * `pegasusLayout` places each qubit's centre. Its extent is read off the graph
 * rather than restated: a vertical qubit runs exactly as far as the horizontal
 * qubits it is coupled to, and vice versa. So no Pegasus constant is repeated
 * here, and the picture cannot drift from the topology in qubo-core.
 */
function qubitSegments(target: HardwareGraph): Geometry {
  const S = 460;
  const adj = adjacency(target);
  const centre = new Map<number, [number, number]>();
  for (const [q, [x, y]] of pegasusLayout(target)) centre.set(q, [x * S, -y * S]);
  const vertical = new Map(target.nodes.map((q) => [q, linearToPegasus(target.m, q)[0] === 0]));
  const margin = S / (12 * target.m) / 2;

  const seg = new Map<number, Segment>();
  let [minX, minY, maxX, maxY] = [Infinity, Infinity, -Infinity, -Infinity];
  for (const q of target.nodes) {
    const [cx, cy] = centre.get(q)!;
    const crossing = adj.get(q)!.filter((r) => vertical.get(r) !== vertical.get(q));
    let s: Segment = [cx, cy, cx, cy];
    if (crossing.length) {
      const along = crossing.map((r) => centre.get(r)![vertical.get(q) ? 1 : 0]);
      const lo = Math.min(...along) - margin;
      const hi = Math.max(...along) + margin;
      s = vertical.get(q) ? [cx, lo, cx, hi] : [lo, cy, hi, cy];
    }
    seg.set(q, s);
    minX = Math.min(minX, s[0], s[2]);
    maxX = Math.max(maxX, s[0], s[2]);
    minY = Math.min(minY, s[1], s[3]);
    maxY = Math.max(maxY, s[1], s[3]);
  }

  const link = (a: number, b: number): Link => {
    const [ax, ay] = centre.get(a)!;
    const [bx, by] = centre.get(b)!;
    if (vertical.get(a) !== vertical.get(b)) {
      return vertical.get(a) ? { kind: 'dot', x: ax, y: by } : { kind: 'dot', x: bx, y: ay };
    }
    const endToEnd = vertical.get(a) ? Math.abs(ay - by) > Math.abs(ax - bx) : Math.abs(ax - bx) > Math.abs(ay - by);
    return endToEnd
      ? { kind: 'dot', x: (ax + bx) / 2, y: (ay + by) / 2 }
      : { kind: 'rung', seg: [ax, ay, bx, by] };
  };

  const pad = 8;
  return {
    seg,
    link,
    viewBox: `${minX - pad} ${minY - pad} ${maxX - minX + 2 * pad} ${maxY - minY + 2 * pad}`,
  };
}

function CouplerMark({
  link,
  fill,
  r,
  width,
  opacity,
}: {
  link: Link;
  fill: string;
  r: number;
  width: number;
  opacity: number;
}) {
  if (link.kind === 'rung') {
    const [x1, y1, x2, y2] = link.seg;
    return (
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={fill}
        strokeWidth={width}
        strokeLinecap="round"
        opacity={opacity}
        style={{ pointerEvents: 'none' }}
      />
    );
  }
  return (
    <circle
      cx={link.x}
      cy={link.y}
      r={r}
      fill={fill}
      stroke="#fff"
      strokeWidth={r / 3}
      opacity={opacity}
      style={{ pointerEvents: 'none' }}
    />
  );
}

export type EmbeddingPanelProps = {
  model: QuboModel;
};

/**
 * The QUBO on the hardware: D-Wave's three minorminer figures (source graph,
 * target graph, embedding) for this case's own derived Q.
 *
 * The target graph is not drawn separately: it is the right-hand picture with
 * the chains switched off, so a toggle shows it instead of a third panel of
 * the same Pegasus fragment.
 */
export function EmbeddingPanel({ model }: EmbeddingPanelProps) {
  const { t, tStr } = useI18n();
  const [size, setSize] = useState<number | 'auto'>('auto');
  const [seed, setSeed] = useState(DEFAULT_EMBED_SEED);
  const [hardwareOnly, setHardwareOnly] = useState(false);
  const [hover, setHover] = useState<number | null>(null);
  const [pinned, setPinned] = useState<number | null>(null);

  const { source, sourceKey, state } = useEmbedding(model, { size, seed });
  const done = state.kind === 'done' && state.key === sourceKey ? state : null;

  // A focus refers to a variable index; once the problem graph changes, that
  // index may name a different variable, or none.
  useEffect(() => {
    setHover(null);
    setPinned(null);
  }, [sourceKey]);

  const neighbours = useMemo(() => {
    const out: Set<number>[] = Array.from({ length: source.n }, () => new Set());
    for (const [i, j] of source.edges) {
      out[i].add(j);
      out[j].add(i);
    }
    return out;
  }, [source]);

  const target = useMemo(() => (done ? pegasusGraph(done.m) : null), [done]);
  const geom = useMemo(() => (target ? qubitSegments(target) : null), [target]);
  const drawn = useMemo(() => {
    if (!done || !target) return null;
    const owner = new Map<number, number>();
    done.chains.forEach((c, i) => c.forEach((q) => owner.set(q, i)));
    return {
      owner,
      intra: intraChainCouplers(target, done.chains),
      inter: chainCouplers(source, target, done.chains),
      stats: embeddingStats(done.chains),
    };
  }, [done, target, source]);

  const focus = hover ?? pinned;
  const lit = (i: number) => focus === null || i === focus || neighbours[focus]?.has(i);
  const togglePin = (i: number | undefined) =>
    setPinned((p) => (i === undefined || p === i ? null : i));

  const name = (i: number) => model.varMeta[i]?.name ?? `x${i + 1}`;
  const dashed = (i: number) => model.varMeta[i]?.kind !== 'decision';

  // ── source graph geometry ──
  const SRC = 240;
  const srcR = source.n <= 12 ? 13 : source.n <= 24 ? 9 : 6;
  const ring = SRC / 2 - srcR - 6;
  const srcPts = Array.from({ length: source.n }, (_, i) => {
    const a = (i / Math.max(source.n, 1)) * 2 * Math.PI - Math.PI / 2;
    return { x: SRC / 2 + ring * Math.cos(a), y: SRC / 2 + ring * Math.sin(a) };
  });

  const sc = SCALE[done?.m ?? 2] ?? SCALE[6];

  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {t('embed.intro')}
      </Typography>

      <Stack
        direction="row"
        spacing={2}
        sx={{ alignItems: 'center', flexWrap: 'wrap', rowGap: 1, mb: 2 }}
      >
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            {t('embed.size.label')}
          </Typography>
          <ToggleButtonGroup
            size="small"
            exclusive
            value={size}
            onChange={(_, v: number | 'auto' | null) => v !== null && setSize(v)}
          >
            <ToggleButton value="auto">{t('embed.size.auto')}</ToggleButton>
            {PEGASUS_SIZES.map((m) => (
              <ToggleButton key={m} value={m}>{`P(${m})`}</ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Stack>
        <Tooltip title={tStr('embed.reseed.tooltip')}>
          <Button size="small" startIcon={<CasinoIcon />} onClick={() => setSeed((s) => s + 1)}>
            {t('embed.reseed')}
          </Button>
        </Tooltip>
        <Typography variant="caption" color="text.secondary">
          {t('embed.seed', { seed: seed - DEFAULT_EMBED_SEED + 1 })}
        </Typography>
        <FormControlLabel
          control={
            <Switch size="small" checked={hardwareOnly} onChange={(e) => setHardwareOnly(e.target.checked)} />
          }
          label={<Typography variant="body2">{t('embed.hardwareOnly')}</Typography>}
        />
      </Stack>

      <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', rowGap: 1 }}>
        <Chip size="small" variant="outlined" label={t('embed.stat.vars', { n: source.n })} />
        <Chip
          size="small"
          variant="outlined"
          label={t('embed.stat.edges', {
            edges: source.edges.length,
            density: (density(source) * 100).toFixed(0),
          })}
        />
        {done && target && drawn && (
          <>
            <Chip
              size="small"
              variant="outlined"
              label={t('embed.stat.fragment', { m: done.m, qubits: target.nodes.length })}
            />
            <Chip size="small" color="primary" variant="outlined" label={t('embed.stat.used', { qubits: drawn.stats.qubits })} />
            <Chip size="small" variant="outlined" label={t('embed.stat.maxChain', { len: drawn.stats.maxChain })} />
            <Chip
              size="small"
              variant="outlined"
              label={t('embed.stat.meanChain', { len: drawn.stats.meanChain.toFixed(2) })}
            />
            <Tooltip title={done.valid ? tStr('embed.valid.tooltip') : done.problems.join('; ')}>
              <Chip
                size="small"
                color={done.valid ? 'success' : 'error'}
                icon={done.valid ? <CheckCircleIcon /> : <ErrorIcon />}
                label={t(done.valid ? 'embed.valid' : 'embed.invalid')}
              />
            </Tooltip>
          </>
        )}
      </Stack>

      {state.kind === 'running' && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
            {t('embed.running', { m: state.m ?? '' })}
          </Typography>
          <LinearProgress />
        </Box>
      )}
      {state.kind === 'failed' && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {t('embed.failed', { m: state.m })}
        </Alert>
      )}
      {state.kind === 'too-large' && (
        <Alert severity="info" sx={{ mb: 2 }}>
          {t('embed.tooLarge', { n: state.n })}
        </Alert>
      )}
      {state.kind === 'error' && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {t('embed.error', { message: state.message })}
        </Alert>
      )}

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ alignItems: 'flex-start' }}>
        {/* ── source graph ── */}
        <Box sx={{ flexShrink: 0 }}>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
            {t('embed.source.title')}
          </Typography>
          <Box
            component="svg"
            viewBox={`0 0 ${SRC} ${SRC}`}
            sx={{ width: 240, maxWidth: '100%', height: 'auto', display: 'block' }}
            onMouseLeave={() => setHover(null)}
          >
            {source.edges.map(([i, j]) => {
              const on = focus === null || i === focus || j === focus;
              return (
                <line
                  key={`e${i}-${j}`}
                  x1={srcPts[i].x}
                  y1={srcPts[i].y}
                  x2={srcPts[j].x}
                  y2={srcPts[j].y}
                  stroke={on && focus !== null ? COUPLING : '#cbd5e0'}
                  strokeWidth={on && focus !== null ? 1.6 : 1}
                  opacity={on ? 1 : 0.25}
                />
              );
            })}
            {srcPts.map((p, i) => (
              <g
                key={`v${i}`}
                style={{ cursor: 'pointer' }}
                opacity={lit(i) ? 1 : 0.25}
                onMouseEnter={() => setHover(i)}
                onClick={() => togglePin(i)}
              >
                <title>
                  {done
                    ? tStr('embed.var.title', { name: name(i), len: done.chains[i]?.length ?? 0 })
                    : name(i)}
                </title>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={srcR}
                  fill={colorOf(i)}
                  stroke={i === focus ? '#1a202c' : '#fff'}
                  strokeWidth={i === focus ? 2.5 : 2}
                  strokeDasharray={dashed(i) ? '3 2' : undefined}
                />
                {source.n <= 24 && (
                  <text
                    x={p.x}
                    y={p.y + (srcR > 10 ? 4 : 3)}
                    textAnchor="middle"
                    fontSize={srcR > 10 ? 10 : 7}
                    fill="#fff"
                    style={{ pointerEvents: 'none' }}
                  >
                    {name(i)}
                  </text>
                )}
              </g>
            ))}
          </Box>
        </Box>

        {/* ── Pegasus: target graph, with or without the chains ── */}
        <Box sx={{ flex: 1, minWidth: 0, width: '100%' }}>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
            {target
              ? t(hardwareOnly ? 'embed.target.title' : 'embed.embedding.title', {
                  m: done!.m,
                  qubits: target.nodes.length,
                  couplers: target.edges.length,
                })
              : t('embed.target.pending')}
          </Typography>
          {target && geom && drawn && done && (
            <Box
              component="svg"
              viewBox={geom.viewBox}
              sx={{ width: '100%', maxWidth: 520, height: 'auto', display: 'block' }}
              onMouseLeave={() => setHover(null)}
            >
              {/* every qubit; in hardware-only mode this is the whole picture */}
              {target.nodes.map((q) => {
                if (!hardwareOnly && drawn.owner.has(q)) return null;
                const [x1, y1, x2, y2] = geom.seg.get(q)!;
                return (
                  <line
                    key={`f${q}`}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={hardwareOnly ? '#a0aec0' : IDLE_QUBIT}
                    strokeWidth={hardwareOnly ? sc.link * 1.2 : sc.link}
                    onMouseEnter={() => setHover(null)}
                  >
                    <title>{tStr('embed.qubit.free', { q })}</title>
                  </line>
                );
              })}

              {!hardwareOnly && (
                <>
                  {/* the chains: each qubit a thick segment in its variable's colour */}
                  {done.chains.flatMap((chain, i) =>
                    chain.map((q) => {
                      const [x1, y1, x2, y2] = geom.seg.get(q)!;
                      return (
                        <g
                          key={`q${q}`}
                          style={{ cursor: 'pointer' }}
                          opacity={lit(i) ? 1 : 0.12}
                          onMouseEnter={() => setHover(i)}
                          onClick={() => togglePin(i)}
                        >
                          <title>{tStr('embed.qubit.used', { q, name: name(i) })}</title>
                          <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="transparent" strokeWidth={sc.chain + 8} />
                          <line
                            x1={x1}
                            y1={y1}
                            x2={x2}
                            y2={y2}
                            stroke={colorOf(i)}
                            strokeWidth={i === focus ? sc.chain * 1.4 : sc.chain}
                            strokeLinecap="round"
                          />
                        </g>
                      );
                    }),
                  )}
                  {/* couplers inside a chain: where its qubits join */}
                  {drawn.intra.flatMap((links, i) =>
                    links.map(([a, b]) => (
                      <CouplerMark
                        key={`h${a}-${b}`}
                        link={geom.link(a, b)}
                        fill={colorOf(i)}
                        r={sc.r}
                        width={sc.chain}
                        opacity={lit(i) ? 1 : 0.12}
                      />
                    )),
                  )}
                  {/* couplers between two chains: where q_ij physically lives */}
                  {[...drawn.inter].flatMap(([key, couplers]) => {
                    const [i, j] = key.split(',').map(Number);
                    if (focus !== null && i !== focus && j !== focus) return [];
                    return couplers.map(([a, b]) => (
                      <CouplerMark
                        key={`x${a}-${b}`}
                        link={geom.link(a, b)}
                        fill={COUPLING}
                        r={sc.r * 0.85}
                        width={sc.chain * 0.8}
                        opacity={1}
                      />
                    ));
                  })}
                </>
              )}
            </Box>
          )}
        </Box>
      </Stack>

      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
        {t(hardwareOnly ? 'embed.legend.hardware' : 'embed.legend')}
      </Typography>
      <Alert severity="info" sx={{ mt: 2 }}>
        {t('embed.note')}
      </Alert>
    </Paper>
  );
}
