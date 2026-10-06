import { Box, Chip, Paper, Stack, Typography } from '@mui/material';

import type { Clause, Graph, CatalogCase } from 'qubo-core/types';
import { unsatisfiedClauses } from 'qubo-core/derive';
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
  mode: 'cut' | 'cover' | 'color' | 'independent' | 'clique';
  /** Colours per node, for `mode === 'color'`. */
  colorOf?: (node: number) => number | null;
};

/** Shared renderer for Max-Cut, Vertex Cover, Independent Set, Clique and Graph Colouring. */
export function GraphView({ graph, x, mode, colorOf }: GraphViewProps) {
  const { t } = useI18n();
  const pts = layout(graph.nodes);
  const pos = new Map(pts.map((p) => [p.id, p]));

  const inSet = (node: number) => !!x[graph.nodes.indexOf(node)];

  let cutValue = 0;
  let uncovered = 0;
  let conflicts = 0;
  let clashes = 0;
  for (const [a, b] of graph.edges) {
    if (mode === 'independent' && inSet(a) && inSet(b)) clashes++;
    if (mode === 'cut' && inSet(a) !== inSet(b)) cutValue++;
    if (mode === 'cover' && !inSet(a) && !inSet(b)) uncovered++;
    if (mode === 'color' && colorOf && colorOf(a) !== null && colorOf(a) === colorOf(b)) {
      conflicts++;
    }
  }

  // A clique's violations are edges that are NOT there: chosen pairs that are
  // not adjacent. They are drawn as extra dashed lines.
  const adjacent = new Set(graph.edges.map(([a, b]) => `${Math.min(a, b)},${Math.max(a, b)}`));
  const chosen = graph.nodes.filter(inSet);
  const missing: [number, number][] =
    mode === 'clique'
      ? chosen.flatMap((a, i) =>
          chosen
            .slice(i + 1)
            .filter((b) => !adjacent.has(`${Math.min(a, b)},${Math.max(a, b)}`))
            .map((b) => [a, b] as [number, number]),
        )
      : [];

  const edgeStyle = (a: number, b: number) => {
    if (mode === 'clique') {
      return inSet(a) && inSet(b)
        ? { stroke: '#2f855a', width: 3, dash: undefined }
        : { stroke: '#cbd5e0', width: 1.5, dash: undefined };
    }
    if (mode === 'cut') {
      return inSet(a) !== inSet(b)
        ? { stroke: '#2f855a', width: 3, dash: undefined }
        : { stroke: '#cbd5e0', width: 1.5, dash: undefined };
    }
    if (mode === 'independent') {
      return inSet(a) && inSet(b)
        ? { stroke: '#c53030', width: 3, dash: '4 3' }
        : { stroke: '#a0aec0', width: 1.5, dash: undefined };
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
    if (mode === 'cover' || mode === 'independent' || mode === 'clique') {
      return inSet(node) ? '#2b6cb0' : '#e2e8f0';
    }
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
        {missing.map(([a, b]) => {
          const pa = pos.get(a)!;
          const pb = pos.get(b)!;
          return (
            <line
              key={`missing-${a}-${b}`}
              x1={pa.x}
              y1={pa.y}
              x2={pb.x}
              y2={pb.y}
              stroke="#c53030"
              strokeWidth={3}
              strokeDasharray="4 3"
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
        {mode === 'independent' && (
          <>
            <Chip
              size="small"
              color="primary"
              label={t('domain.independent.size', { size: x.filter(Boolean).length })}
            />
            {clashes > 0 && (
              <Chip size="small" color="error" label={`${t('domain.independent.conflict')}: ${clashes}`} />
            )}
          </>
        )}
        {mode === 'clique' && (
          <>
            <Chip size="small" color="primary" label={t('domain.clique.size', { size: chosen.length })} />
            {missing.length > 0 && (
              <Chip size="small" color="error" label={`${t('domain.clique.missing')}: ${missing.length}`} />
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
export function SatView({
  clauses,
  x,
  qcase,
  auxCount = 0,
}: {
  clauses: Clause[];
  x: number[];
  qcase: CatalogCase;
  /** Auxiliary variables the reduction added; non-zero only for clauses of 3+ literals. */
  auxCount?: number;
}) {
  const { t } = useI18n();
  const unsat = unsatisfiedClauses(clauses, x);
  const lit = (l: Clause[number]) => `${l.negated ? '¬' : ''}x${l.v + 1}`;
  const isFalse = (l: Clause[number]) => (l.negated ? !!x[l.v] : !x[l.v]);

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
          const ok = !c.every(isFalse);
          return (
            <Chip
              key={i}
              size="small"
              variant={ok ? 'filled' : 'outlined'}
              color={ok ? 'success' : 'error'}
              label={`(${c.map(lit).join(' ∨ ')})`}
              sx={{ fontFamily: 'monospace' }}
            />
          );
        })}
      </Box>
      <Paper variant="outlined" sx={{ mt: 2, p: 1.5, bgcolor: 'action.hover' }}>
        {/*
          §4.3's headline — QUBO size independent of clause count — holds only
          while every clause has two literals. Longer clauses add auxiliary
          variables, so the note must not be shown there.
        */}
        <Typography variant="body2" component="div">
          {auxCount > 0 ? t('domain.sat.auxNote', { aux: auxCount }) : t('domain.sat.sizeNote')}
        </Typography>
        {auxCount === 0 && (
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
            {t('domain.sat.current', {
              vars: qcase.model.numVars,
              clauses: clauses.length,
            })}
          </Typography>
        )}
      </Paper>
    </Box>
  );
}

/** Max Diversity — the chosen numbers on a number line, so "spread out" is visible. */
export function DiversityView({
  numbers,
  x,
  pick,
  value,
}: {
  numbers: number[];
  x: number[];
  pick: number;
  value: number;
}) {
  const { t } = useI18n();
  const lo = Math.min(...numbers);
  const hi = Math.max(...numbers);
  const at = (v: number) => 20 + ((v - lo) / (hi - lo || 1)) * 360;
  const count = x.filter(Boolean).length;

  return (
    <Box>
      <Box component="svg" viewBox="0 0 400 80" sx={{ width: '100%', maxWidth: 480 }}>
        <line x1={20} y1={40} x2={380} y2={40} stroke="#a0aec0" strokeWidth={1.5} />
        {numbers.map((v, i) => {
          const on = !!x[i];
          return (
            <g key={i}>
              <circle cx={at(v)} cy={40} r={on ? 9 : 6} fill={on ? '#2b6cb0' : '#e2e8f0'} stroke="#fff" strokeWidth={2} />
              <text x={at(v)} y={i % 2 ? 70 : 20} textAnchor="middle" fontSize={11} fontWeight={on ? 700 : 400} fill="#4a5568">
                {v}
              </text>
            </g>
          );
        })}
      </Box>
      <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap', rowGap: 1 }}>
        <Chip size="small" color="primary" label={t('domain.diversity.total', { value })} />
        <Chip
          size="small"
          color={count === pick ? 'success' : 'error'}
          variant="outlined"
          label={t('domain.diversity.count', { count, pick })}
        />
      </Stack>
    </Box>
  );
}

/** Discrete Tomography — the reconstructed image against its target projections. */
export function TomographyView({ x, rows, cols }: { x: number[]; rows: number[]; cols: number[] }) {
  const { t } = useI18n();
  const R = rows.length;
  const C = cols.length;
  const cell = (r: number, c: number) => !!x[r * C + c];
  const rowSum = (r: number) => cols.reduce((s, _, c) => s + (cell(r, c) ? 1 : 0), 0);
  const colSum = (c: number) => rows.reduce((s, _, r) => s + (cell(r, c) ? 1 : 0), 0);
  const ok = rows.every((v, r) => rowSum(r) === v) && cols.every((v, c) => colSum(c) === v);
  const sumBox = (got: number, want: number) => (
    <Typography
      variant="caption"
      sx={{ alignSelf: 'center', textAlign: 'center', fontWeight: 600, color: got === want ? 'success.main' : 'error.main' }}
    >
      {got}/{want}
    </Typography>
  );

  return (
    <Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: `repeat(${C}, 44px) 48px`, gap: '3px' }}>
        {Array.from({ length: R }, (_, r) => (
          <Box key={r} sx={{ display: 'contents' }}>
            {Array.from({ length: C }, (_, c) => (
              <Box
                key={c}
                sx={{ height: 44, borderRadius: 1, bgcolor: cell(r, c) ? 'text.primary' : 'action.hover' }}
              />
            ))}
            {sumBox(rowSum(r), rows[r])}
          </Box>
        ))}
        {cols.map((want, c) => (
          <Box key={c} sx={{ display: 'flex', justifyContent: 'center' }}>
            {sumBox(colSum(c), want)}
          </Box>
        ))}
      </Box>
      <Stack direction="row" spacing={1} sx={{ mt: 1.5, flexWrap: 'wrap', rowGap: 1 }}>
        <Chip
          size="small"
          color={ok ? 'success' : 'error'}
          label={ok ? t('domain.tomo.match') : t('domain.tomo.mismatch')}
        />
      </Stack>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
        {t('domain.tomo.note')}
      </Typography>
    </Box>
  );
}

/** Task Allocation — which task runs where, with the two cost components split out. */
export function AllocationView({
  x,
  exec,
  comm,
}: {
  x: number[];
  exec: number[][];
  comm: { i: number; j: number; cost: number }[];
}) {
  const { t } = useI18n();
  const K = exec[0]?.length ?? 0;
  const procOf = (i: number) => {
    for (let k = 0; k < K; k++) if (x[i * K + k]) return k;
    return -1;
  };
  const execCost = exec.reduce((s, row, i) => s + row.reduce((a, c, k) => a + (x[i * K + k] ? c : 0), 0), 0);
  const commCost = comm.reduce((s, { i, j, cost }) => {
    const a = procOf(i);
    const b = procOf(j);
    return s + (a >= 0 && b >= 0 && a !== b ? cost : 0);
  }, 0);

  return (
    <Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: `auto repeat(${K}, 72px)`, gap: '3px' }}>
        <Box />
        {Array.from({ length: K }, (_, k) => (
          <Typography key={k} variant="caption" align="center" color="text.secondary">
            {t('domain.alloc.proc')} {k + 1}
          </Typography>
        ))}
        {exec.map((row, i) => (
          <Box key={i} sx={{ display: 'contents' }}>
            <Typography variant="caption" color="text.secondary" sx={{ pr: 1, alignSelf: 'center' }}>
              {t('domain.alloc.task')} {i + 1}
            </Typography>
            {row.map((c, k) => {
              const on = !!x[i * K + k];
              return (
                <Box
                  key={k}
                  sx={{
                    height: 44,
                    borderRadius: 1,
                    bgcolor: on ? 'primary.main' : 'action.hover',
                    color: on ? 'primary.contrastText' : 'text.secondary',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontVariantNumeric: 'tabular-nums',
                    fontWeight: on ? 700 : 400,
                  }}
                >
                  {c}
                </Box>
              );
            })}
          </Box>
        ))}
      </Box>
      <Stack direction="row" spacing={1} sx={{ mt: 1.5, flexWrap: 'wrap', rowGap: 1 }}>
        <Chip size="small" variant="outlined" label={t('domain.alloc.exec', { value: execCost })} />
        <Chip size="small" variant="outlined" label={t('domain.alloc.comm', { value: commCost })} />
        <Chip size="small" color="primary" label={t('domain.alloc.total', { value: execCost + commCost })} />
      </Stack>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
        {t('domain.alloc.note')}
      </Typography>
    </Box>
  );
}

/** One horizontal fill bar: `used` of `limit`, red once it overflows. */
function UsageBar({ label, used, limit }: { label: string; used: number; limit: number }) {
  const over = used > limit;
  return (
    <Box sx={{ mb: 1 }}>
      <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>
        <Typography
          variant="caption"
          sx={{ fontVariantNumeric: 'tabular-nums', fontWeight: 600, color: over ? 'error.main' : 'success.main' }}
        >
          {used} / {limit}
        </Typography>
      </Stack>
      <Box sx={{ height: 12, borderRadius: 1, bgcolor: 'action.hover', overflow: 'hidden' }}>
        <Box
          sx={{
            width: `${Math.min(100, (used / (limit || 1)) * 100)}%`,
            height: '100%',
            bgcolor: over ? 'error.main' : 'primary.main',
          }}
        />
      </Box>
    </Box>
  );
}

/** Capital Budgeting — chosen projects, and each period's spend against its limit. */
export function BudgetView({
  x,
  values,
  rows,
}: {
  x: number[];
  values: number[];
  rows: { use: number[]; limit: number }[];
}) {
  const { t, tStr } = useI18n();
  const value = values.reduce((s, v, j) => s + (x[j] ? v : 0), 0);
  return (
    <Box sx={{ maxWidth: 420 }}>
      <Stack direction="row" spacing={1} sx={{ mb: 1.5, flexWrap: 'wrap', rowGap: 1 }}>
        {values.map((v, j) => (
          <Chip
            key={j}
            size="small"
            color={x[j] ? 'primary' : 'default'}
            variant={x[j] ? 'filled' : 'outlined'}
            label={tStr('domain.budget.project', { j: j + 1, value: v })}
          />
        ))}
      </Stack>
      {rows.map((r, k) => (
        <UsageBar
          key={k}
          label={tStr('domain.budget.period', { k: k + 1 })}
          used={r.use.reduce((s, a, j) => s + (x[j] ? a : 0), 0)}
          limit={r.limit}
        />
      ))}
      <Chip size="small" color="primary" sx={{ mt: 0.5 }} label={t('domain.knapsack.value', { value })} />
    </Box>
  );
}

/** Multiple Knapsack — what went into each knapsack, and what stayed out. */
export function MultiKnapsackView({
  x,
  weights,
  values,
  caps,
}: {
  x: number[];
  weights: number[];
  values: number[];
  caps: number[];
}) {
  const { t, tStr } = useI18n();
  const K = caps.length;
  const inSack = (i: number, k: number) => !!x[i * K + k];
  const value = weights.reduce((s, _, i) => s + caps.reduce((a, _c, k) => a + (inSack(i, k) ? values[i] : 0), 0), 0);
  const left = weights.map((_, i) => i).filter((i) => caps.every((_, k) => !inSack(i, k)));
  return (
    <Box sx={{ maxWidth: 420 }}>
      {caps.map((cap, k) => {
        const items = weights.map((_, i) => i).filter((i) => inSack(i, k));
        return (
          <Box key={k} sx={{ mb: 1 }}>
            <UsageBar
              label={`${tStr('domain.mknap.sack', { k: k + 1 })}: ${items.map((i) => i + 1).join(', ') || '—'}`}
              used={items.reduce((s, i) => s + weights[i], 0)}
              limit={cap}
            />
          </Box>
        );
      })}
      <Stack direction="row" spacing={1} sx={{ mt: 0.5, flexWrap: 'wrap', rowGap: 1 }}>
        <Chip size="small" color="primary" label={t('domain.knapsack.value', { value })} />
        <Chip
          size="small"
          variant="outlined"
          label={t('domain.mknap.left', { items: left.map((i) => i + 1).join(', ') || '—' })}
        />
      </Stack>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
        {t('domain.mknap.note')}
      </Typography>
    </Box>
  );
}

/**
 * P-Median / Warehouse Location — customers (circles) and sites (squares) on a
 * line, open sites filled, each customer joined to the site serving it.
 */
export function FacilityView({
  x,
  customers,
  sites,
  openCost,
}: {
  x: number[];
  customers: number[];
  sites: number[];
  openCost?: number[];
}) {
  const { t } = useI18n();
  const S = sites.length;
  const nA = customers.length * S;
  const open = (j: number) => !!x[nA + j];
  const all = [...customers, ...sites];
  const lo = Math.min(...all);
  const hi = Math.max(...all);
  const at = (v: number) => 30 + ((v - lo) / (hi - lo || 1)) * 340;
  let distance = 0;
  const links: { c: number; s: number }[] = [];
  customers.forEach((c, i) =>
    sites.forEach((s, j) => {
      if (x[i * S + j]) {
        distance += Math.abs(c - s);
        links.push({ c: i, s: j });
      }
    }),
  );
  const fixed = openCost ? openCost.reduce((s, f, j) => s + (open(j) ? f : 0), 0) : 0;

  return (
    <Box>
      <Box component="svg" viewBox="0 0 400 120" sx={{ width: '100%', maxWidth: 480 }}>
        <line x1={20} y1={60} x2={380} y2={60} stroke="#cbd5e0" strokeWidth={1.5} />
        {links.map(({ c, s }, k) => (
          <path
            key={k}
            d={`M ${at(customers[c])} 78 Q ${(at(customers[c]) + at(sites[s])) / 2} 112 ${at(sites[s])} 42`}
            fill="none"
            stroke={open(s) ? '#2f855a' : '#c53030'}
            strokeWidth={1.5}
            strokeDasharray={open(s) ? undefined : '4 3'}
          />
        ))}
        {sites.map((s, j) => (
          <g key={`s${j}`}>
            <rect x={at(s) - 11} y={20} width={22} height={22} rx={3} fill={open(j) ? '#2b6cb0' : '#e2e8f0'} stroke="#fff" strokeWidth={2} />
            <text x={at(s)} y={35} textAnchor="middle" fontSize={11} fontWeight={600} fill={open(j) ? '#fff' : '#4a5568'}>
              {j + 1}
            </text>
          </g>
        ))}
        {customers.map((c, i) => (
          <g key={`c${i}`}>
            <circle cx={at(c)} cy={78} r={9} fill="#c05621" stroke="#fff" strokeWidth={2} />
            <text x={at(c)} y={82} textAnchor="middle" fontSize={10} fontWeight={600} fill="#fff">
              {i + 1}
            </text>
          </g>
        ))}
      </Box>
      <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap', rowGap: 1 }}>
        <Chip size="small" variant="outlined" label={t('domain.facility.distance', { value: distance })} />
        {openCost && <Chip size="small" variant="outlined" label={t('domain.facility.fixed', { value: fixed })} />}
        <Chip size="small" color="primary" label={t('domain.facility.total', { value: distance + fixed })} />
      </Stack>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
        {t('domain.facility.note')}
      </Typography>
    </Box>
  );
}

/**
 * Linear Ordering — the ranking the pair variables describe, plus the full
 * agreement count (the net objective plus the constant the model leaves out).
 */
export function OrderingView({ x, votes }: { x: number[]; votes: number[][] }) {
  const { t } = useI18n();
  const n = votes.length;
  const pairs: [number, number][] = [];
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) pairs.push([i, j]);
  const ahead = (i: number, j: number) => {
    if (i < j) return !!x[pairs.findIndex(([a, b]) => a === i && b === j)];
    return !x[pairs.findIndex(([a, b]) => a === j && b === i)];
  };
  // Position = how many items are ahead. A cyclic choice yields a tie in positions.
  const wins = Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => (j !== i && ahead(i, j) ? 1 : 0)).reduce((s: number, v: number) => s + v, 0),
  );
  const order = Array.from({ length: n }, (_, i) => i).sort((a, b) => wins[b] - wins[a]);
  const consistent = new Set(wins).size === n;
  let agreement = 0;
  let total = 0;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i === j) continue;
      // Every judge-pair comparison is counted once, as votes[i][j] or votes[j][i].
      total += votes[i][j];
      if (ahead(i, j)) agreement += votes[i][j];
    }
  }

  return (
    <Box>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap', rowGap: 1 }}>
        {order.map((i, k) => (
          <Stack key={i} direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            {k > 0 && <Typography color="text.secondary">›</Typography>}
            <Chip color="primary" label={t('domain.order.item', { i: i + 1 })} />
          </Stack>
        ))}
      </Stack>
      <Stack direction="row" spacing={1} sx={{ mt: 1.5, flexWrap: 'wrap', rowGap: 1 }}>
        <Chip
          size="small"
          color={consistent ? 'success' : 'error'}
          label={consistent ? t('domain.order.consistent') : t('domain.order.cycle')}
        />
        <Chip size="small" variant="outlined" label={t('domain.order.agreement', { value: agreement, total })} />
      </Stack>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
        {t('domain.order.note')}
      </Typography>
    </Box>
  );
}

/** Clique Partitioning — the groups the node variables describe, and the weight kept inside them. */
export function ClusterView({
  x,
  n,
  weights,
}: {
  x: number[];
  n: number;
  weights: { i: number; j: number; w: number }[];
}) {
  const { t } = useI18n();
  const K = n;
  const groupsOf = (i: number) => Array.from({ length: K }, (_, k) => k).filter((k) => x[i * K + k]);
  const groups = Array.from({ length: K }, (_, k) =>
    Array.from({ length: n }, (_, i) => i).filter((i) => x[i * K + k]),
  ).filter((g) => g.length > 0);
  const valid = Array.from({ length: n }, (_, i) => groupsOf(i).length === 1).every(Boolean);
  const inside = weights.reduce(
    (s, { i, j, w }) => s + w * groupsOf(i).filter((k) => groupsOf(j).includes(k)).length,
    0,
  );

  return (
    <Box>
      <Stack direction="row" spacing={1.5} sx={{ flexWrap: 'wrap', rowGap: 1 }}>
        {groups.map((g, k) => (
          <Paper key={k} variant="outlined" sx={{ px: 1.5, py: 1, borderColor: CATEGORY_COLORS[k % CATEGORY_COLORS.length], borderWidth: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {'{'} {g.map((i) => i + 1).join(', ')} {'}'}
            </Typography>
          </Paper>
        ))}
      </Stack>
      <Stack direction="row" spacing={1} sx={{ mt: 1.5, flexWrap: 'wrap', rowGap: 1 }}>
        <Chip size="small" color="primary" label={t('domain.cluster.inside', { value: inside })} />
        {!valid && <Chip size="small" color="error" label={t('domain.cluster.invalid')} />}
      </Stack>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
        {t('domain.cluster.note', {
          weights: weights.map(({ i, j, w }) => `w${i + 1}${j + 1} = ${w}`).join(', '),
        })}
      </Typography>
    </Box>
  );
}

/** CSP (not-all-equal) — the two teams, and whether each listed trio is split. */
export function TeamsView({ x, triples }: { x: number[]; triples: [number, number, number][] }) {
  const { t } = useI18n();
  const people = x.map((_, i) => i + 1);
  const team = (p: number) => (x[p - 1] ? 1 : 0);
  const split = (tr: [number, number, number]) => new Set(tr.map(team)).size === 2;
  const bad = triples.filter((tr) => !split(tr)).length;

  return (
    <Box>
      <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', rowGap: 1 }}>
        {[0, 1].map((k) => (
          <Paper key={k} variant="outlined" sx={{ px: 1.5, py: 1, borderColor: CATEGORY_COLORS[k], borderWidth: 2 }}>
            <Typography variant="caption" color="text.secondary">
              {t('domain.teams.team', { k: k + 1 })}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {people.filter((p) => team(p) === k).join(', ') || '—'}
            </Typography>
          </Paper>
        ))}
      </Stack>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1.5 }}>
        {triples.map((tr, i) => (
          <Chip
            key={i}
            size="small"
            variant={split(tr) ? 'filled' : 'outlined'}
            color={split(tr) ? 'success' : 'error'}
            label={`{${tr.join(', ')}}`}
            sx={{ fontFamily: 'monospace' }}
          />
        ))}
      </Box>
      <Chip
        size="small"
        sx={{ mt: 1.5 }}
        color={bad === 0 ? 'success' : 'error'}
        label={bad === 0 ? t('domain.teams.ok') : t('domain.teams.bad', { count: bad })}
      />
    </Box>
  );
}

/**
 * Max Weight Matching — the variables are EDGES, so this draws the graph with
 * each edge's weight, the chosen edges in green, and any node touched by two
 * chosen edges in red.
 */
export function MatchingView({ graph, x, weights }: { graph: Graph; x: number[]; weights: number[] }) {
  const { t } = useI18n();
  const pts = layout(graph.nodes);
  const pos = new Map(pts.map((p) => [p.id, p]));
  const touches = (v: number) => graph.edges.filter(([a, b], k) => x[k] && (a === v || b === v)).length;
  const clashes = graph.nodes.filter((v) => touches(v) > 1).length;
  const total = weights.reduce((s, w, k) => s + (x[k] ? w : 0), 0);

  return (
    <Box>
      <Box component="svg" viewBox="0 0 240 240" sx={{ width: 280, height: 280 }}>
        {graph.edges.map(([a, b], k) => {
          const pa = pos.get(a)!;
          const pb = pos.get(b)!;
          const on = !!x[k];
          return (
            <g key={k}>
              <line
                x1={pa.x}
                y1={pa.y}
                x2={pb.x}
                y2={pb.y}
                stroke={on ? '#2f855a' : '#cbd5e0'}
                strokeWidth={on ? 4 : 1.5}
              />
              <text
                x={(pa.x + pb.x) / 2}
                y={(pa.y + pb.y) / 2 - 4}
                textAnchor="middle"
                fontSize={11}
                fontWeight={on ? 700 : 400}
                fill="#4a5568"
              >
                {weights[k]}
              </text>
            </g>
          );
        })}
        {pts.map((p) => {
          const bad = touches(p.id) > 1;
          return (
            <g key={p.id}>
              <circle cx={p.x} cy={p.y} r={15} fill={bad ? '#c53030' : '#e2e8f0'} stroke="#fff" strokeWidth={2.5} />
              <text x={p.x} y={p.y + 4.5} textAnchor="middle" fontSize={12} fontWeight={600} fill={bad ? '#fff' : '#4a5568'}>
                {p.id}
              </text>
            </g>
          );
        })}
      </Box>
      <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap', rowGap: 1 }}>
        <Chip size="small" color="primary" label={t('domain.matching.total', { value: total })} />
        {clashes > 0 && <Chip size="small" color="error" label={t('domain.matching.clash', { count: clashes })} />}
      </Stack>
    </Box>
  );
}

/** Portfolio — which assets are held, with the return gained and the risk taken on. */
export function PortfolioView({ x, returns, cov }: { x: number[]; returns: number[]; cov: number[][] }) {
  const { t } = useI18n();
  const held = returns.map((_, i) => i).filter((i) => x[i]);
  const ret = held.reduce((s, i) => s + returns[i], 0);
  const risk = held.reduce((s, i) => s + held.reduce((a, j) => a + cov[i][j], 0), 0);

  return (
    <Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: `auto repeat(${returns.length}, 56px)`, gap: '3px', maxWidth: 420 }}>
        <Box />
        {returns.map((_, i) => (
          <Typography key={i} variant="caption" align="center" color="text.secondary">
            {t('domain.portfolio.asset', { i: i + 1 })}
          </Typography>
        ))}
        {(['return', 'variance'] as const).map((row) => (
          <Box key={row} sx={{ display: 'contents' }}>
            <Typography variant="caption" color="text.secondary" sx={{ pr: 1, alignSelf: 'center' }}>
              {row === 'return' ? t('domain.portfolio.return') : t('domain.portfolio.variance')}
            </Typography>
            {returns.map((m, i) => (
              <Box
                key={i}
                sx={{
                  height: 36,
                  borderRadius: 1,
                  bgcolor: x[i] ? 'primary.main' : 'action.hover',
                  color: x[i] ? 'primary.contrastText' : 'text.secondary',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontVariantNumeric: 'tabular-nums',
                  fontWeight: x[i] ? 700 : 400,
                }}
              >
                {row === 'return' ? m : cov[i][i]}
              </Box>
            ))}
          </Box>
        ))}
      </Box>
      <Stack direction="row" spacing={1} sx={{ mt: 1.5, flexWrap: 'wrap', rowGap: 1 }}>
        <Chip size="small" variant="outlined" label={t('domain.portfolio.totalReturn', { value: ret })} />
        <Chip size="small" variant="outlined" label={t('domain.portfolio.totalRisk', { value: risk })} />
        <Chip size="small" color="primary" label={t('domain.portfolio.objective', { value: risk - ret })} />
      </Stack>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
        {t('domain.portfolio.note')}
      </Typography>
    </Box>
  );
}

/**
 * Community Detection — nodes coloured by community, edges inside a community
 * in green, and the modularity Q recomputed from the partition itself.
 */
export function CommunityView({ graph, x, k }: { graph: Graph; x: number[]; k: number }) {
  const { t } = useI18n();
  const pts = layout(graph.nodes);
  const pos = new Map(pts.map((p) => [p.id, p]));
  const groupsOf = (i: number) => Array.from({ length: k }, (_, c) => c).filter((c) => x[i * k + c]);
  const valid = graph.nodes.every((_, i) => groupsOf(i).length === 1);
  const comm = (v: number) => {
    const g = groupsOf(graph.nodes.indexOf(v));
    return g.length === 1 ? g[0] : null;
  };
  const deg = graph.nodes.map((v) => graph.edges.filter(([a, b]) => a === v || b === v).length);
  const twoM = graph.edges.length * 2;
  // Q = (1/2m) Σ_ij (A_ij − k_i k_j / 2m) δ(c_i, c_j), over ordered pairs including i = j.
  let num = 0;
  graph.nodes.forEach((a, i) =>
    graph.nodes.forEach((b, j) => {
      if (!valid || comm(a) !== comm(b)) return;
      const adj = graph.edges.some(([p, q]) => (p === a && q === b) || (p === b && q === a)) ? 1 : 0;
      num += twoM * adj - deg[i] * deg[j];
    }),
  );
  const den = twoM * twoM;

  return (
    <Box>
      <Box component="svg" viewBox="0 0 240 240" sx={{ width: 280, height: 280 }}>
        {graph.edges.map(([a, b], i) => {
          const pa = pos.get(a)!;
          const pb = pos.get(b)!;
          const inside = comm(a) !== null && comm(a) === comm(b);
          return (
            <line key={i} x1={pa.x} y1={pa.y} x2={pb.x} y2={pb.y} stroke={inside ? '#2f855a' : '#cbd5e0'} strokeWidth={inside ? 3 : 1.5} />
          );
        })}
        {pts.map((p) => {
          const c = comm(p.id);
          const fill = c === null ? '#c53030' : CATEGORY_COLORS[c % CATEGORY_COLORS.length];
          return (
            <g key={p.id}>
              <circle cx={p.x} cy={p.y} r={15} fill={fill} stroke="#fff" strokeWidth={2.5} />
              <text x={p.x} y={p.y + 4.5} textAnchor="middle" fontSize={12} fontWeight={600} fill="#fff">
                {p.id}
              </text>
            </g>
          );
        })}
      </Box>
      <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap', rowGap: 1 }}>
        {valid ? (
          <Chip
            size="small"
            color="primary"
            label={t('domain.community.q', { q: (num / den).toFixed(3), num, den })}
          />
        ) : (
          <Chip size="small" color="error" label={t('domain.community.invalid')} />
        )}
      </Stack>
    </Box>
  );
}

/** Shortest Path — the network, the chosen arcs, and whether they form one S→T route. */
export function PathView({ x, nodes, arcs }: { x: number[]; nodes: string[]; arcs: [string, string, number][] }) {
  const { t } = useI18n();
  const at: Record<string, { x: number; y: number }> = {
    S: { x: 30, y: 80 },
    A: { x: 120, y: 30 },
    B: { x: 120, y: 130 },
    C: { x: 220, y: 30 },
    T: { x: 310, y: 80 },
  };
  const length = arcs.reduce((s, [, , c], k) => s + (x[k] ? c : 0), 0);
  const bad = nodes.filter((v) => {
    const net = arcs.reduce((s, [a, b], k) => s + (x[k] ? (a === v ? 1 : 0) - (b === v ? 1 : 0) : 0), 0);
    return net !== (v === 'S' ? 1 : v === 'T' ? -1 : 0);
  }).length;
  // Follow chosen arcs from S, for the route label.
  const route = ['S'];
  for (let guard = 0; guard < nodes.length && route[route.length - 1] !== 'T'; guard++) {
    const k = arcs.findIndex(([a], i) => x[i] && a === route[route.length - 1]);
    if (k < 0) break;
    route.push(arcs[k][1]);
  }

  return (
    <Box>
      <Box component="svg" viewBox="0 0 340 160" sx={{ width: '100%', maxWidth: 440 }}>
        <defs>
          <marker id="arrow-on" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#2f855a" />
          </marker>
          <marker id="arrow-off" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#a0aec0" />
          </marker>
        </defs>
        {arcs.map(([a, b, c], k) => {
          const pa = at[a];
          const pb = at[b];
          const dx = pb.x - pa.x;
          const dy = pb.y - pa.y;
          const len = Math.hypot(dx, dy) || 1;
          const on = !!x[k];
          return (
            <g key={k}>
              <line
                x1={pa.x + (dx / len) * 15}
                y1={pa.y + (dy / len) * 15}
                x2={pb.x - (dx / len) * 17}
                y2={pb.y - (dy / len) * 17}
                stroke={on ? '#2f855a' : '#a0aec0'}
                strokeWidth={on ? 3 : 1.5}
                markerEnd={on ? 'url(#arrow-on)' : 'url(#arrow-off)'}
              />
              <text x={(pa.x + pb.x) / 2 + 4} y={(pa.y + pb.y) / 2 - 4} fontSize={11} fontWeight={on ? 700 : 400} fill="#4a5568">
                {c}
              </text>
            </g>
          );
        })}
        {nodes.map((v) => (
          <g key={v}>
            <circle cx={at[v].x} cy={at[v].y} r={14} fill={v === 'S' || v === 'T' ? '#2b6cb0' : '#e2e8f0'} stroke="#fff" strokeWidth={2.5} />
            <text x={at[v].x} y={at[v].y + 4.5} textAnchor="middle" fontSize={12} fontWeight={600} fill={v === 'S' || v === 'T' ? '#fff' : '#4a5568'}>
              {v}
            </text>
          </g>
        ))}
      </Box>
      <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap', rowGap: 1 }}>
        <Chip size="small" color="primary" label={t('domain.path.length', { value: length })} />
        {bad === 0 ? (
          <Chip size="small" variant="outlined" label={route.join(' → ')} />
        ) : (
          <Chip size="small" color="error" label={t('domain.path.broken', { count: bad })} />
        )}
      </Stack>
    </Box>
  );
}

/** Travelling Salesman — the tour the position variables describe, with its length. */
export function TourView({ x, dist }: { x: number[]; dist: [number, number, number][] }) {
  const { t } = useI18n();
  const free = [2, 3, 4];
  const at: Record<number, { x: number; y: number }> = {
    1: { x: 50, y: 50 },
    2: { x: 190, y: 50 },
    3: { x: 190, y: 170 },
    4: { x: 50, y: 170 },
  };
  const d = (a: number, b: number) => dist.find(([p, q]) => (p === a && q === b) || (p === b && q === a))![2];
  const cityAt = (p: number) => free.filter((v) => x[free.indexOf(v) * 3 + (p - 2)]);
  const valid =
    [2, 3, 4].every((p) => cityAt(p).length === 1) &&
    free.every((v) => [2, 3, 4].filter((p) => x[free.indexOf(v) * 3 + (p - 2)]).length === 1);
  const tour = valid ? [1, ...[2, 3, 4].map((p) => cityAt(p)[0]), 1] : null;
  const length = tour ? tour.slice(1).reduce((s, v, i) => s + d(tour[i], v), 0) : null;

  return (
    <Box>
      <Box component="svg" viewBox="0 0 240 220" sx={{ width: 260, height: 240 }}>
        {dist.map(([a, b, c], k) => {
          const onTour = tour ? tour.slice(1).some((v, i) => (tour[i] === a && v === b) || (tour[i] === b && v === a)) : false;
          return (
            <g key={k}>
              <line
                x1={at[a].x}
                y1={at[a].y}
                x2={at[b].x}
                y2={at[b].y}
                stroke={onTour ? '#2f855a' : '#e2e8f0'}
                strokeWidth={onTour ? 3.5 : 1.5}
              />
              <text x={(at[a].x + at[b].x) / 2 + 5} y={(at[a].y + at[b].y) / 2 - 5} fontSize={11} fontWeight={onTour ? 700 : 400} fill="#4a5568">
                {c}
              </text>
            </g>
          );
        })}
        {[1, 2, 3, 4].map((v) => (
          <g key={v}>
            <circle cx={at[v].x} cy={at[v].y} r={15} fill={v === 1 ? '#c05621' : '#2b6cb0'} stroke="#fff" strokeWidth={2.5} />
            <text x={at[v].x} y={at[v].y + 4.5} textAnchor="middle" fontSize={12} fontWeight={600} fill="#fff">
              {v}
            </text>
          </g>
        ))}
      </Box>
      <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap', rowGap: 1 }}>
        {tour ? (
          <>
            <Chip size="small" color="primary" label={t('domain.tour.length', { value: length })} />
            <Chip size="small" variant="outlined" label={tour.join(' → ')} />
          </>
        ) : (
          <Chip size="small" color="error" label={t('domain.tour.invalid')} />
        )}
      </Stack>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
        {t('domain.tour.note')}
      </Typography>
    </Box>
  );
}

/** Traffic Flow — each car's three candidate routes, the chosen one, and how loaded each segment is. */
export function TrafficView({ x, routes }: { x: number[]; routes: string[][][] }) {
  const { t } = useI18n();
  const load = new Map<string, number>();
  routes.forEach((cand, car) =>
    cand.forEach((segs, r) => {
      if (x[car * 3 + r]) segs.forEach((s) => load.set(s, (load.get(s) ?? 0) + 1));
    }),
  );
  const segments = [...new Set(routes.flat(2))].sort();
  const congestion = [...load.values()].reduce((s, n) => s + n * n, 0);

  return (
    <Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'auto repeat(3, minmax(88px, auto))', gap: '4px', maxWidth: 460 }}>
        <Box />
        {[1, 2, 3].map((r) => (
          <Typography key={r} variant="caption" align="center" color="text.secondary">
            {t('domain.traffic.route', { r })}
          </Typography>
        ))}
        {routes.map((cand, car) => (
          <Box key={car} sx={{ display: 'contents' }}>
            <Typography variant="caption" color="text.secondary" sx={{ pr: 1, alignSelf: 'center' }}>
              {t('domain.traffic.car', { i: car + 1 })}
            </Typography>
            {cand.map((segs, r) => {
              const on = !!x[car * 3 + r];
              return (
                <Box
                  key={r}
                  sx={{
                    py: 0.75,
                    borderRadius: 1,
                    textAlign: 'center',
                    fontFamily: 'monospace',
                    bgcolor: on ? 'primary.main' : 'action.hover',
                    color: on ? 'primary.contrastText' : 'text.secondary',
                    fontWeight: on ? 700 : 400,
                  }}
                >
                  {segs.join('-')}
                </Box>
              );
            })}
          </Box>
        ))}
      </Box>
      <Stack direction="row" spacing={0.5} sx={{ mt: 1.5, flexWrap: 'wrap', rowGap: 0.5 }}>
        {segments.map((s) => {
          const n = load.get(s) ?? 0;
          return (
            <Chip
              key={s}
              size="small"
              variant={n ? 'filled' : 'outlined'}
              color={n > 1 ? 'error' : n === 1 ? 'success' : 'default'}
              label={`${s}: ${n}`}
              sx={{ fontFamily: 'monospace' }}
            />
          );
        })}
      </Stack>
      <Chip size="small" color="primary" sx={{ mt: 1 }} label={t('domain.traffic.congestion', { value: congestion })} />
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
        {t('domain.traffic.note')}
      </Typography>
    </Box>
  );
}
