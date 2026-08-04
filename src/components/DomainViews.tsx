import { Box, Chip, Paper, Stack, Typography } from '@mui/material';

import type { Clause, Graph, QuboCase } from '../types';
import { unsatisfiedClauses } from '../lib/derive';
import { CATEGORY_COLORS } from '../theme';
import { useI18n } from '../i18n';

/** Circular layout so any node count lays out sensibly without hand-placed coordinates. */
function layout(nodes: number[], size = 240, r = 88) {
  const c = size / 2;
  return nodes.map((id, i) => {
    const a = (i / nodes.length) * 2 * Math.PI - Math.PI / 2;
    return { id, x: c + r * Math.cos(a), y: c + r * Math.sin(a) };
  });
}

export type GraphViewProps = {
  graph: Graph;
  x: number[];
  /** How to interpret the assignment. */
  mode: 'cut' | 'cover' | 'color';
  /** Colours per node, for `mode === 'color'`. */
  colorOf?: (node: number) => number | null;
};

/** Shared renderer for Max-Cut, Minimum Vertex Cover and Graph Colouring. */
export function GraphView({ graph, x, mode, colorOf }: GraphViewProps) {
  const { t } = useI18n();
  const pts = layout(graph.nodes);
  const pos = new Map(pts.map((p) => [p.id, p]));

  const inSet = (node: number) => !!x[graph.nodes.indexOf(node)];

  let cutValue = 0;
  let uncovered = 0;
  let conflicts = 0;
  for (const [a, b] of graph.edges) {
    if (mode === 'cut' && inSet(a) !== inSet(b)) cutValue++;
    if (mode === 'cover' && !inSet(a) && !inSet(b)) uncovered++;
    if (mode === 'color' && colorOf && colorOf(a) !== null && colorOf(a) === colorOf(b)) {
      conflicts++;
    }
  }

  const edgeStyle = (a: number, b: number) => {
    if (mode === 'cut') {
      return inSet(a) !== inSet(b)
        ? { stroke: '#2f855a', width: 3, dash: undefined }
        : { stroke: '#cbd5e0', width: 1.5, dash: undefined };
    }
    if (mode === 'cover') {
      return !inSet(a) && !inSet(b)
        ? { stroke: '#c53030', width: 3, dash: '4 3' }
        : { stroke: '#a0aec0', width: 1.5, dash: undefined };
    }
    const clash = colorOf && colorOf(a) !== null && colorOf(a) === colorOf(b);
    return clash
      ? { stroke: '#c53030', width: 3, dash: '4 3' }
      : { stroke: '#a0aec0', width: 1.5, dash: undefined };
  };

  const nodeFill = (node: number) => {
    if (mode === 'color') {
      const c = colorOf?.(node);
      return c === null || c === undefined ? '#e2e8f0' : CATEGORY_COLORS[c % CATEGORY_COLORS.length];
    }
    if (mode === 'cover') return inSet(node) ? '#2b6cb0' : '#e2e8f0';
    return inSet(node) ? '#2b6cb0' : '#c05621';
  };

  return (
    <Box>
      <Box component="svg" viewBox="0 0 240 240" sx={{ width: 280, height: 280 }}>
        {graph.edges.map(([a, b], i) => {
          const pa = pos.get(a)!;
          const pb = pos.get(b)!;
          const s = edgeStyle(a, b);
          return (
            <line
              key={i}
              x1={pa.x}
              y1={pa.y}
              x2={pb.x}
              y2={pb.y}
              stroke={s.stroke}
              strokeWidth={s.width}
              strokeDasharray={s.dash}
            />
          );
        })}
        {pts.map((p) => (
          <g key={p.id}>
            <circle cx={p.x} cy={p.y} r={15} fill={nodeFill(p.id)} stroke="#fff" strokeWidth={2.5} />
            <text
              x={p.x}
              y={p.y + 4.5}
              textAnchor="middle"
              fontSize={12}
              fontWeight={600}
              fill={nodeFill(p.id) === '#e2e8f0' ? '#4a5568' : '#fff'}
            >
              {p.id}
            </text>
          </g>
        ))}
      </Box>

      <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap', rowGap: 1 }}>
        {mode === 'cut' && (
          <>
            <Chip size="small" color="success" label={t('domain.graph.cutValue', { value: cutValue })} />
            <Chip size="small" sx={{ bgcolor: '#2b6cb0', color: '#fff' }} label={t('domain.graph.setA')} />
            <Chip size="small" sx={{ bgcolor: '#c05621', color: '#fff' }} label={t('domain.graph.setB')} />
          </>
        )}
        {mode === 'cover' && (
          <>
            <Chip
              size="small"
              color="primary"
              label={t('domain.cover.size', { size: x.filter(Boolean).length })}
            />
            {uncovered > 0 && (
              <Chip size="small" color="error" label={`${t('domain.cover.uncovered')}: ${uncovered}`} />
            )}
          </>
        )}
        {mode === 'color' && (
          <Chip
            size="small"
            color={conflicts === 0 ? 'success' : 'error'}
            label={conflicts === 0 ? t('domain.color.feasible') : `${t('domain.color.conflict')}: ${conflicts}`}
          />
        )}
      </Stack>
    </Box>
  );
}

/** §3.1 — the two subset sums, side by side. */
export function PartitionView({ numbers, x }: { numbers: number[]; x: number[] }) {
  const { t } = useI18n();
  const a = numbers.filter((_, i) => x[i]);
  const b = numbers.filter((_, i) => !x[i]);
  const sumA = a.reduce((s, v) => s + v, 0);
  const sumB = b.reduce((s, v) => s + v, 0);
  const diff = Math.abs(sumA - sumB);
  const scale = Math.max(sumA, sumB, 1);

  const column = (label: string, items: number[], sum: number, color: string) => (
    <Box sx={{ flex: 1, minWidth: 150 }}>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Box
        sx={{
          height: 160,
          display: 'flex',
          flexDirection: 'column-reverse',
          gap: '2px',
          justifyContent: 'flex-start',
          mt: 0.5,
        }}
      >
        {items.map((v, i) => (
          <Box
            key={i}
            sx={{
              height: `${(v / scale) * 100}%`,
              minHeight: 16,
              bgcolor: color,
              color: '#fff',
              borderRadius: 0.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12,
            }}
          >
            {v}
          </Box>
        ))}
      </Box>
      <Typography variant="h3" sx={{ mt: 0.5 }}>
        {sum}
      </Typography>
    </Box>
  );

  return (
    <Box>
      <Stack direction="row" spacing={2}>
        {column(String(t('domain.partition.subset1')), a, sumA, '#2b6cb0')}
        {column(String(t('domain.partition.subset2')), b, sumB, '#c05621')}
      </Stack>
      <Chip
        size="small"
        color={diff === 0 ? 'success' : 'default'}
        sx={{ mt: 1 }}
        label={diff === 0 ? t('domain.partition.perfect') : t('domain.partition.diff', { diff })}
      />
    </Box>
  );
}

/** §5.4 — which facility landed on which location, plus the flow/distance data. */
export function AssignmentView({
  x,
  size,
  cost,
}: {
  x: number[];
  size: number;
  cost: number;
}) {
  const { t } = useI18n();
  return (
    <Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: `auto repeat(${size}, 56px)`, gap: '3px' }}>
        <Box />
        {Array.from({ length: size }, (_, l) => (
          <Typography key={l} variant="caption" align="center" color="text.secondary">
            {t('domain.assign.location')} {l + 1}
          </Typography>
        ))}
        {Array.from({ length: size }, (_, f) => (
          <Box key={f} sx={{ display: 'contents' }}>
            <Typography variant="caption" color="text.secondary" sx={{ pr: 1, alignSelf: 'center' }}>
              {t('domain.assign.facility')} {f + 1}
            </Typography>
            {Array.from({ length: size }, (_, l) => {
              const on = !!x[f * size + l];
              return (
                <Box
                  key={l}
                  sx={{
                    height: 44,
                    borderRadius: 1,
                    bgcolor: on ? 'primary.main' : 'action.hover',
                    color: on ? 'primary.contrastText' : 'text.disabled',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 600,
                  }}
                >
                  {on ? '●' : '·'}
                </Box>
              );
            })}
          </Box>
        ))}
      </Box>
      <Chip size="small" sx={{ mt: 1.5 }} label={t('domain.assign.cost', { cost })} />
    </Box>
  );
}

/** §5.5 — the chosen projects against the budget line. */
export function KnapsackView({
  x,
  weights,
  budget,
  value,
}: {
  x: number[];
  weights: number[];
  budget: number;
  value: number;
}) {
  const { t } = useI18n();
  const used = weights.reduce((s, w, i) => s + (x[i] ? w : 0), 0);

  return (
    <Box>
      <Box
        sx={{
          position: 'relative',
          height: 40,
          bgcolor: 'action.hover',
          borderRadius: 1,
          display: 'flex',
          overflow: 'hidden',
        }}
      >
        {weights.map((w, i) =>
          x[i] ? (
            <Box
              key={i}
              sx={{
                width: `${(w / budget) * 100}%`,
                bgcolor: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                borderRight: '1px solid rgba(255,255,255,0.4)',
              }}
            >
              {i + 1}
            </Box>
          ) : null,
        )}
      </Box>
      <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap', rowGap: 1 }}>
        <Chip
          size="small"
          color={used <= budget ? 'success' : 'error'}
          label={t('domain.knapsack.budget', { used, total: budget })}
        />
        <Chip size="small" variant="outlined" label={t('domain.knapsack.value', { value })} />
      </Stack>
    </Box>
  );
}

/** §4.3 — clause-by-clause satisfaction, plus the size-independence point. */
export function SatView({ clauses, x, qcase }: { clauses: Clause[]; x: number[]; qcase: QuboCase }) {
  const { t } = useI18n();
  const unsat = unsatisfiedClauses(clauses, x);
  const lit = (l: Clause[number]) => `${l.negated ? '¬' : ''}x${l.v + 1}`;

  return (
    <Box>
      <Chip
        size="small"
        color={unsat === 0 ? 'success' : 'warning'}
        sx={{ mb: 1.5 }}
        label={t('domain.sat.count', { sat: clauses.length - unsat, total: clauses.length })}
      />
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {clauses.map((c, i) => {
          const ok = !(
            (c[0].negated ? x[c[0].v] : !x[c[0].v]) && (c[1].negated ? x[c[1].v] : !x[c[1].v])
          );
          return (
            <Chip
              key={i}
              size="small"
              variant={ok ? 'filled' : 'outlined'}
              color={ok ? 'success' : 'error'}
              label={`(${lit(c[0])} ∨ ${lit(c[1])})`}
              sx={{ fontFamily: 'monospace' }}
            />
          );
        })}
      </Box>
      <Paper variant="outlined" sx={{ mt: 2, p: 1.5, bgcolor: 'action.hover' }}>
        <Typography variant="body2" component="div">
          {t('domain.sat.sizeNote')}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
          {t('domain.sat.current', {
            vars: qcase.model.numVars,
            clauses: clauses.length,
          })}
        </Typography>
      </Paper>
    </Box>
  );
}
