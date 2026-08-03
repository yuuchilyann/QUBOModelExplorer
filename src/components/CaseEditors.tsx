import { useState } from 'react';
import {
  Box,
  Button,
  Chip,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Slider,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveIcon from '@mui/icons-material/Remove';

import type { Clause, Graph } from '../types';
import { useI18n } from '../i18n';

/** §3.1 — a comma-separated list of positive integers. */
export function NumbersEditor({
  numbers,
  onChange,
}: {
  numbers: number[];
  onChange: (v: number[]) => void;
}) {
  const { t } = useI18n();
  const [text, setText] = useState(numbers.join(', '));
  const [error, setError] = useState(false);

  const commit = (raw: string) => {
    setText(raw);
    const parts = raw
      .split(/[,\s]+/)
      .map((s) => s.trim())
      .filter(Boolean);
    const parsed = parts.map(Number);
    if (parsed.length === 0 || parsed.some((v) => !Number.isFinite(v) || v <= 0 || !Number.isInteger(v))) {
      setError(true);
      return;
    }
    setError(false);
    onChange(parsed);
  };

  return (
    <TextField
      fullWidth
      size="small"
      label={t('editor.numbers.label')}
      helperText={error ? t('editor.numbers.invalid') : t('editor.numbers.helper')}
      error={error}
      value={text}
      onChange={(e) => commit(e.target.value)}
    />
  );
}

/**
 * Click-to-edit graph.
 *
 * Clicking a node selects it; clicking a second node toggles the edge between
 * them. Nodes are appended and removed from the end, which keeps the numbering
 * stable and the variable indices predictable.
 */
export function GraphEditor({
  graph,
  onChange,
  maxNodes = 8,
}: {
  graph: Graph;
  onChange: (g: Graph) => void;
  maxNodes?: number;
}) {
  const { t } = useI18n();
  const [selected, setSelected] = useState<number | null>(null);

  const size = 240;
  const c = size / 2;
  const pts = graph.nodes.map((id, i) => {
    const a = (i / graph.nodes.length) * 2 * Math.PI - Math.PI / 2;
    return { id, x: c + 88 * Math.cos(a), y: c + 88 * Math.sin(a) };
  });
  const pos = new Map(pts.map((p) => [p.id, p]));

  const toggleEdge = (a: number, b: number) => {
    const has = graph.edges.some(([u, v]) => (u === a && v === b) || (u === b && v === a));
    onChange({
      ...graph,
      edges: has
        ? graph.edges.filter(([u, v]) => !((u === a && v === b) || (u === b && v === a)))
        : [...graph.edges, [Math.min(a, b), Math.max(a, b)]],
    });
  };

  const clickNode = (id: number) => {
    if (selected === null) setSelected(id);
    else if (selected === id) setSelected(null);
    else {
      toggleEdge(selected, id);
      setSelected(null);
    }
  };

  const addNode = () => {
    if (graph.nodes.length >= maxNodes) return;
    const next = Math.max(0, ...graph.nodes) + 1;
    onChange({ ...graph, nodes: [...graph.nodes, next] });
  };

  const removeNode = () => {
    if (graph.nodes.length <= 2) return;
    const last = graph.nodes[graph.nodes.length - 1];
    onChange({
      nodes: graph.nodes.slice(0, -1),
      edges: graph.edges.filter(([a, b]) => a !== last && b !== last),
    });
    setSelected(null);
  };

  return (
    <Box>
      <Box component="svg" viewBox={`0 0 ${size} ${size}`} sx={{ width: 260, height: 260 }}>
        {graph.edges.map(([a, b], i) => {
          const pa = pos.get(a);
          const pb = pos.get(b);
          if (!pa || !pb) return null;
          return (
            <line key={i} x1={pa.x} y1={pa.y} x2={pb.x} y2={pb.y} stroke="#a0aec0" strokeWidth={2} />
          );
        })}
        {pts.map((p) => (
          <g key={p.id} onClick={() => clickNode(p.id)} style={{ cursor: 'pointer' }}>
            <circle
              cx={p.x}
              cy={p.y}
              r={15}
              fill={selected === p.id ? '#7c5cbf' : '#2b6cb0'}
              stroke="#fff"
              strokeWidth={2.5}
            />
            <text x={p.x} y={p.y + 4.5} textAnchor="middle" fontSize={12} fontWeight={600} fill="#fff">
              {p.id}
            </text>
          </g>
        ))}
      </Box>

      <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap', rowGap: 1 }}>
        <Button size="small" startIcon={<AddIcon />} onClick={addNode} disabled={graph.nodes.length >= maxNodes}>
          {t('editor.graph.addNode')}
        </Button>
        <Button size="small" startIcon={<RemoveIcon />} onClick={removeNode} disabled={graph.nodes.length <= 2}>
          {t('editor.graph.removeNode')}
        </Button>
        <Button size="small" onClick={() => onChange({ ...graph, edges: [] })}>
          {t('editor.graph.clear')}
        </Button>
      </Stack>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
        {t('editor.graph.hint')}
      </Typography>
    </Box>
  );
}

/** §5.2 — the graph plus the colour count, whose product drives the variable count. */
export function ColoringEditor({
  graph,
  k,
  onChange,
}: {
  graph: Graph;
  k: number;
  onChange: (g: Graph, k: number) => void;
}) {
  const { t } = useI18n();
  return (
    <Stack spacing={2}>
      <GraphEditor graph={graph} onChange={(g) => onChange(g, k)} maxNodes={7} />
      <Box sx={{ maxWidth: 260 }}>
        <Typography variant="caption" color="text.secondary">
          {t('editor.colors.label')}: {k}
        </Typography>
        <Slider
          size="small"
          min={2}
          max={5}
          marks
          value={k}
          onChange={(_, v) => onChange(graph, v as number)}
        />
      </Box>
    </Stack>
  );
}

/** §4.3 — clause list, deliberately unbounded to show the QUBO size not moving. */
export function SatEditor({
  numVars,
  clauses,
  onChange,
}: {
  numVars: number;
  clauses: Clause[];
  onChange: (numVars: number, clauses: Clause[]) => void;
}) {
  const { t } = useI18n();

  const setClause = (i: number, next: Clause) => {
    const copy = [...clauses];
    copy[i] = next;
    onChange(numVars, copy);
  };

  const literalPicker = (ci: number, li: 0 | 1) => {
    const l = clauses[ci][li];
    const value = `${l.negated ? '-' : ''}${l.v}`;
    return (
      <Select
        size="small"
        value={value}
        onChange={(e) => {
          const raw = String(e.target.value);
          const negated = raw.startsWith('-');
          const v = Number(negated ? raw.slice(1) : raw);
          const next = [...clauses[ci]] as Clause;
          next[li] = { v, negated };
          setClause(ci, next);
        }}
        sx={{ minWidth: 84, fontFamily: 'monospace' }}
      >
        {Array.from({ length: numVars }, (_, v) => [
          <MenuItem key={`p${v}`} value={String(v)}>{`x${v + 1}`}</MenuItem>,
          <MenuItem key={`n${v}`} value={`-${v}`}>{`¬x${v + 1}`}</MenuItem>,
        ]).flat()}
      </Select>
    );
  };

  return (
    <Stack spacing={1.5}>
      <Box sx={{ maxWidth: 260 }}>
        <Typography variant="caption" color="text.secondary">
          {t('editor.sat.vars')}: {numVars}
        </Typography>
        <Slider
          size="small"
          min={2}
          max={10}
          marks
          value={numVars}
          onChange={(_, v) => {
            const n = v as number;
            // Drop clauses that reference variables the model no longer has.
            onChange(n, clauses.filter((c) => c[0].v < n && c[1].v < n));
          }}
        />
      </Box>

      <Stack spacing={0.5}>
        {clauses.map((_, i) => (
          <Stack key={i} direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
            <Typography variant="caption" sx={{ width: 28, color: 'text.secondary' }}>
              {i + 1}
            </Typography>
            {literalPicker(i, 0)}
            <Typography sx={{ px: 0.5 }}>∨</Typography>
            {literalPicker(i, 1)}
            <IconButton
              size="small"
              onClick={() => onChange(numVars, clauses.filter((_, k) => k !== i))}
              aria-label="remove clause"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Stack>
        ))}
      </Stack>

      <Box>
        <Button
          size="small"
          startIcon={<AddIcon />}
          onClick={() =>
            onChange(numVars, [
              ...clauses,
              [
                { v: 0, negated: false },
                { v: Math.min(1, numVars - 1), negated: false },
              ],
            ])
          }
        >
          {t('editor.sat.add')}
        </Button>
        <Chip size="small" variant="outlined" sx={{ ml: 1 }} label={`${clauses.length} 子句`} />
      </Box>
    </Stack>
  );
}

/** §2 — the coefficients themselves, so the Q matrix can be poked directly. */
export function HelloEditor({
  linear,
  quadratic,
  onChange,
}: {
  linear: number[];
  quadratic: { i: number; j: number; coef: number }[];
  onChange: (linear: number[], quadratic: { i: number; j: number; coef: number }[]) => void;
}) {
  return (
    <Paper variant="outlined" sx={{ p: 1.5 }}>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
        線性項係數
      </Typography>
      <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', rowGap: 1, mb: 2 }}>
        {linear.map((v, i) => (
          <TextField
            key={i}
            size="small"
            type="number"
            label={`x${i + 1}`}
            value={v}
            onChange={(e) => {
              const next = [...linear];
              next[i] = Number(e.target.value) || 0;
              onChange(next, quadratic);
            }}
            sx={{ width: 92 }}
          />
        ))}
      </Stack>

      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
        二次項係數
      </Typography>
      <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', rowGap: 1 }}>
        {quadratic.map((q, k) => (
          <TextField
            key={k}
            size="small"
            type="number"
            label={`x${q.i + 1}x${q.j + 1}`}
            value={q.coef}
            onChange={(e) => {
              const next = quadratic.map((t, idx) =>
                idx === k ? { ...t, coef: Number(e.target.value) || 0 } : t,
              );
              onChange(linear, next);
            }}
            sx={{ width: 100 }}
          />
        ))}
      </Stack>
    </Paper>
  );
}
