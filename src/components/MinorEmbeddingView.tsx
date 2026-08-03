import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Chip,
  Paper,
  Slider,
  Stack,
  Typography,
} from '@mui/material';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ReplayIcon from '@mui/icons-material/Replay';

import { CATEGORY_COLORS } from '../theme';
import { useI18n } from '../i18n';

const MIN_N = 3;
const MAX_N = 10;

/** A physical qubit: which unit cell it sits in, and its orientation. */
type Qubit = { r: number; c: number; kind: 'h' | 'v' };

/**
 * Chain for logical variable `i` in the Chimera-style cross embedding of `K_n`.
 *
 * The chip is an n×n array of unit cells, each holding TWO qubits — one
 * horizontal, one vertical — coupled to each other inside the cell. Then
 *
 *     chain i  =  every horizontal qubit in row i  ∪  every vertical qubit in column i
 *
 * The two arms join inside cell `(i, i)`, so the chain is connected. For any
 * pair `i ≠ j`, chain `i`'s horizontal qubit and chain `j`'s vertical qubit
 * both sit in cell `(i, j)` and are coupled there — which is where `q_ij`
 * physically lives.
 *
 * Crucially **no qubit is ever shared between two chains**, which is the actual
 * rule on hardware: a physical qubit represents exactly one logical variable.
 * The price is `2n` qubits per logical variable, i.e. `2n²` in total.
 */
function chainQubits(i: number, n: number): Qubit[] {
  const out: Qubit[] = [];
  for (let c = 0; c < n; c++) out.push({ r: i, c, kind: 'h' });
  for (let r = 0; r < n; r++) out.push({ r, c: i, kind: 'v' });
  return out;
}

/**
 * Why a fully connected QUBO does not fit a sparse chip one variable per qubit.
 *
 * The paper flags the problem but does not draw it (p.33, citing Date et al.
 * 2019 on embedding being "a very hard problem" in its own right). Watching the
 * chains grow is the fastest way to understand why a 5,000-qubit annealer
 * handles only a few hundred densely-coupled variables.
 */
export function MinorEmbeddingView() {
  const { t } = useI18n();
  const [n, setN] = useState(5);
  const [revealed, setRevealed] = useState(MAX_N);
  const [playing, setPlaying] = useState(false);

  // Reveal one chain at a time while playing, then stop at the last one.
  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      setRevealed((r) => {
        if (r >= n) {
          setPlaying(false);
          return r;
        }
        return r + 1;
      });
    }, 650);
    return () => window.clearInterval(id);
  }, [playing, n]);

  // Changing n invalidates the reveal position.
  useEffect(() => {
    setRevealed(n);
    setPlaying(false);
  }, [n]);

  const chains = useMemo(
    () => Array.from({ length: n }, (_, i) => chainQubits(i, n)),
    [n],
  );

  const chainLength = 2 * n;
  const physical = 2 * n * n;

  const play = () => {
    if (revealed >= n) setRevealed(0);
    setPlaying(true);
  };

  // ── geometry ──
  const LOGICAL_R = 78;
  const logicalPts = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * 2 * Math.PI - Math.PI / 2;
    return { x: 100 + LOGICAL_R * Math.cos(a), y: 100 + LOGICAL_R * Math.sin(a) };
  });

  const CELL = Math.min(26, 220 / n);
  const gridSize = CELL * n;

  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Stack
        direction="row"
        spacing={2}
        sx={{ alignItems: 'center', flexWrap: 'wrap', rowGap: 1, mb: 2 }}
      >
        <Box sx={{ minWidth: 230 }}>
          <Typography variant="caption" color="text.secondary">
            {t('overview.embedding.vars')}: {n}
          </Typography>
          <Slider
            size="small"
            min={MIN_N}
            max={MAX_N}
            value={n}
            onChange={(_, v) => setN(v as number)}
            marks
          />
        </Box>
        <Button
          size="small"
          variant="outlined"
          startIcon={playing ? <PauseIcon /> : <PlayArrowIcon />}
          onClick={() => (playing ? setPlaying(false) : play())}
        >
          {playing ? t('overview.embedding.pause') : t('overview.embedding.play')}
        </Button>
        <Button
          size="small"
          startIcon={<ReplayIcon />}
          onClick={() => {
            setPlaying(false);
            setRevealed(n);
          }}
        >
          {t('overview.embedding.reset')}
        </Button>
      </Stack>

      <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', rowGap: 1 }}>
        <Chip size="small" variant="outlined" label={`${t('overview.embedding.chainLen')}: ${chainLength}`} />
        <Chip size="small" variant="outlined" label={`${t('overview.embedding.physical')}: ${physical}`} />
        <Chip
          size="small"
          color="warning"
          label={t('overview.embedding.ratio', { ratio: (physical / n).toFixed(0) })}
        />
      </Stack>

      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={3}
        sx={{ alignItems: 'flex-start' }}
      >
        {/* ── logical: the fully connected QUBO ── */}
        <Box>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
            {t('overview.embedding.logical')}
          </Typography>
          <Box component="svg" viewBox="0 0 200 200" sx={{ width: 220, height: 220 }}>
            {logicalPts.map((p, i) =>
              logicalPts.slice(i + 1).map((qp, k) => (
                <line
                  key={`e${i}-${i + 1 + k}`}
                  x1={p.x}
                  y1={p.y}
                  x2={qp.x}
                  y2={qp.y}
                  stroke="#cbd5e0"
                  strokeWidth={1}
                />
              )),
            )}
            {logicalPts.map((p, i) => (
              <g key={`n${i}`}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={12}
                  fill={i < revealed ? CATEGORY_COLORS[i % CATEGORY_COLORS.length] : '#e2e8f0'}
                  stroke="#fff"
                  strokeWidth={2}
                />
                <text
                  x={p.x}
                  y={p.y + 4}
                  textAnchor="middle"
                  fontSize={11}
                  fill={i < revealed ? '#fff' : '#718096'}
                >
                  {i + 1}
                </text>
              </g>
            ))}
          </Box>
        </Box>

        {/* ── physical: chains laid onto the chip ── */}
        <Box>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
            {t('overview.embedding.physicalView')}
          </Typography>
          <Box
            component="svg"
            viewBox={`0 0 ${gridSize} ${gridSize}`}
            sx={{ width: 240, height: 240 }}
          >
            {/* unit cells: each holds one horizontal and one vertical qubit */}
            {Array.from({ length: n }, (_, r) =>
              Array.from({ length: n }, (_, c) => (
                <rect
                  key={`g${r}-${c}`}
                  x={c * CELL + 1}
                  y={r * CELL + 1}
                  width={CELL - 2}
                  height={CELL - 2}
                  rx={3}
                  fill="#edf2f7"
                />
              )),
            )}
            {/* chains, in reveal order */}
            {chains.slice(0, revealed).map((qubits, i) => {
              const color = CATEGORY_COLORS[i % CATEGORY_COLORS.length];
              const bar = Math.max(3, CELL * 0.22);
              const len = CELL - 5;
              return (
                <g key={`c${i}`}>
                  {qubits.map((q, k) => {
                    const x0 = q.c * CELL;
                    const y0 = q.r * CELL;
                    return q.kind === 'h' ? (
                      <rect
                        key={`q${k}`}
                        x={x0 + 2.5}
                        y={y0 + CELL / 2 - bar / 2 - bar * 0.6}
                        width={len}
                        height={bar}
                        rx={bar / 2}
                        fill={color}
                      />
                    ) : (
                      <rect
                        key={`q${k}`}
                        x={x0 + CELL / 2 - bar / 2 + bar * 0.6}
                        y={y0 + 2.5}
                        width={bar}
                        height={len}
                        rx={bar / 2}
                        fill={color}
                        opacity={0.85}
                      />
                    );
                  })}
                </g>
              );
            })}
          </Box>
        </Box>
      </Stack>

      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
        {t('overview.embedding.note')}
      </Typography>
    </Paper>
  );
}
