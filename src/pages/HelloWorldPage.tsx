import { useMemo, useState } from 'react';
import {
  Box,
  Chip,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';

import { helloWorld } from '../cases';
import { applyEdit } from '../cases/mutate';
import { derive } from '../lib/derive';
import { evaluate } from '../lib/qubo';
import { useSolver } from '../hooks/useSolver';
import { CodeExportPanel } from '../components/CodeExportPanel';
import { HelloEditor } from '../components/CaseEditors';
import { PresenterNotes } from '../components/PresenterNotes';
import { QMatrixView } from '../components/QMatrixView';
import { QuadraticFormLatex } from '../components/QMatrixLatex';
import { SourceBadge } from '../components/SourceBadge';
import { VerificationChip, type VerificationStatus } from '../components/VerificationChip';
import { useI18n } from '../i18n';

/** Which end of the row the first column shows. */
type ColOrder = 'asc' | 'desc';

/**
 * Every assignment, laid out.
 *
 * Four variables means sixteen rows, which is the only case in the whole site
 * where the ENTIRE search space fits on screen at once. Seeing the optimum as
 * one row among sixteen — rather than as an answer handed down by a solver — is
 * the point of the page.
 *
 * Rows are enumerated with x1 as the LOW bit of the row index, so printing the
 * columns as x1…xn reads back-to-front against the usual binary convention.
 * `order` flips the columns to xn…x1, which turns the same sixteen rows into
 * plain counting — 0000, 0001, 0010 — without touching the enumeration.
 */
function AllStatesTable({
  Q,
  sense,
  order,
}: {
  Q: number[][];
  sense: 'min' | 'max';
  order: ColOrder;
}) {
  const { t } = useI18n();
  const n = Q.length;
  const cols = useMemo(() => {
    const idx = Array.from({ length: n }, (_, i) => i);
    return order === 'desc' ? idx.reverse() : idx;
  }, [n, order]);
  const rows = useMemo(() => {
    const out = Array.from({ length: 2 ** n }, (_, m) => {
      const x = Array.from({ length: n }, (_, i) => (m >> i) & 1);
      return { x, y: evaluate(Q, x) };
    });
    const best = out.reduce(
      (acc, r) => (sense === 'min' ? Math.min(acc, r.y) : Math.max(acc, r.y)),
      sense === 'min' ? Infinity : -Infinity,
    );
    return out.map((r) => ({ ...r, best: r.y === best }));
  }, [Q, n, sense]);

  return (
    <Paper variant="outlined" sx={{ maxHeight: 520, overflow: 'auto' }}>
      <Table size="small" stickyHeader>
        <TableHead>
          <TableRow>
            {cols.map((c) => (
              <TableCell key={c} align="center" sx={{ py: 0.5 }}>
                x{c + 1}
              </TableCell>
            ))}
            <TableCell align="right" sx={{ py: 0.5 }}>
              {t('solutions.energy')}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((r, i) => (
            <TableRow
              key={i}
              sx={{
                bgcolor: r.best ? 'success.light' : undefined,
                '& td': { py: 0.35 },
              }}
            >
              {cols.map((c) => (
                <TableCell key={c} align="center" sx={{ fontFamily: 'monospace' }}>
                  {r.x[c]}
                </TableCell>
              ))}
              <TableCell
                align="right"
                sx={{ fontFamily: 'monospace', fontWeight: r.best ? 700 : 400 }}
              >
                {r.y}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}

export function HelloWorldPage() {
  const { t, tStr } = useI18n();
  // Default to the paper's own x1…xn order; the toggle offers the binary
  // reading order, which most readers find easier to scan.
  const [order, setOrder] = useState<ColOrder>('asc');
  const [linear, setLinear] = useState([...helloWorld.model.linear]);
  const [quadratic, setQuadratic] = useState(helloWorld.model.quadratic.map((q) => ({ ...q })));

  const pristine =
    JSON.stringify(linear) === JSON.stringify(helloWorld.model.linear) &&
    JSON.stringify(quadratic) === JSON.stringify(helloWorld.model.quadratic);

  const qcase = useMemo(
    () => (pristine ? helloWorld : applyEdit(helloWorld, { kind: 'hello', linear, quadratic })),
    [pristine, linear, quadratic],
  );
  const { model } = useMemo(() => derive(qcase), [qcase]);
  const solve = useSolver(model, qcase.model);

  const restore = () => {
    setLinear([...helloWorld.model.linear]);
    setQuadratic(helloWorld.model.quadratic.map((q) => ({ ...q })));
  };

  const status: VerificationStatus = pristine
    ? { kind: 'matches', n: model.n, constant: model.constant }
    : { kind: 'custom' };

  return (
    <Box>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 2, flexWrap: 'wrap' }}>
        <Typography variant="h1">{t('hello.title')}</Typography>
        <SourceBadge qcase={helloWorld} />
      </Stack>

      <Typography variant="body1" component="div" sx={{ mb: 3 }}>
        {t('hello.lead')}
      </Typography>

      {/*
        Every other case page opens with a concrete scenario. This one cannot,
        because §2 has no domain — and a reader who does not know that reads the
        absence as something they failed to understand. Saying so is the fix.
      */}
      <Paper variant="outlined" sx={{ p: 2, mb: 3, borderLeft: 4, borderLeftColor: 'text.disabled' }}>
        <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
          {t('hello.noScenario.title')}
        </Typography>
        <Typography variant="body2" component="div" color="text.secondary">
          {t('hello.noScenario.body')}
        </Typography>
      </Paper>

      {/* ── three lessons ── */}
      <Stack spacing={2} sx={{ mb: 4 }}>
        {(
          [
            ['hello.lesson1.title', 'hello.lesson1.body'],
            ['hello.lesson2.title', 'hello.lesson2.body'],
            ['hello.lesson3.title', 'hello.lesson3.body'],
          ] as const
        ).map(([title, body], i) => (
          <Paper key={title} variant="outlined" sx={{ p: 2 }}>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'flex-start' }}>
              <Chip size="small" color="primary" label={i + 1} />
              <Box>
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

      {/* ── live playground: coefficients → Q → the whole space ── */}
      <Typography variant="h2" sx={{ mb: 1 }}>
        {t('hello.tryIt')}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {t('hello.tryItBody')}
      </Typography>

      <Box sx={{ mb: 2 }}>
        <VerificationChip status={status} onRestore={pristine ? undefined : restore} />
      </Box>

      <Stack direction={{ xs: 'column', lg: 'row' }} spacing={3} sx={{ mb: 4 }}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <HelloEditor
            linear={linear}
            quadratic={quadratic}
            onChange={(l, q) => {
              setLinear(l);
              setQuadratic(q);
            }}
          />
          {/* The paper's own presentation, for direct comparison with the PDF. */}
          <Paper variant="outlined" sx={{ p: 2, mt: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
              {t('hello.paperForm')}
            </Typography>
            <QuadraticFormLatex model={model} />
            <Typography variant="caption" component="div" color="text.secondary">
              {t('hello.paperFormBody')}
            </Typography>
          </Paper>

          <Box sx={{ mt: 2 }}>
            <QMatrixView model={model} paperQ={pristine ? helloWorld.paperQ : undefined} />
          </Box>
        </Box>
        <Box sx={{ width: { xs: '100%', lg: 320 }, flexShrink: 0 }}>
          <Stack
            direction="row"
            spacing={1}
            sx={{ mb: 1, alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', rowGap: 1 }}
          >
            <Typography variant="subtitle2">{t('hello.allStates')}</Typography>
            <ToggleButtonGroup
              value={order}
              exclusive
              size="small"
              onChange={(_, v: ColOrder | null) => v && setOrder(v)}
              color="primary"
              aria-label={tStr('hello.order.label')}
            >
              <ToggleButton value="asc" sx={{ px: 1, py: 0.15, fontSize: 12 }}>
                {t('hello.order.asc', { n: model.n })}
              </ToggleButton>
              <ToggleButton value="desc" sx={{ px: 1, py: 0.15, fontSize: 12 }}>
                {t('hello.order.desc', { n: model.n })}
              </ToggleButton>
            </ToggleButtonGroup>
          </Stack>
          <AllStatesTable Q={model.Q} sense={model.sense} order={order} />
          <Typography variant="caption" component="div" color="text.secondary" sx={{ mt: 0.75 }}>
            {t('hello.order.hint')}
          </Typography>
        </Box>
      </Stack>

      {/* ── run it for real ── */}
      <Typography variant="h2" sx={{ mb: 1 }}>
        {t('hello.runIt')}
      </Typography>

      {/*
        The heading promises a run, so show one. These figures come from the
        Web Worker that just swept the space — the Python below is the same
        computation moved into the reader's own environment, not the only place
        the problem is actually solved.
      */}
      <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 1, flexWrap: 'wrap' }}>
          <Typography variant="subtitle2">{t('hello.browserRun')}</Typography>
          {solve.result && (
            <Chip
              size="small"
              color={solve.result.quality === 'exact' ? 'success' : 'warning'}
              label={
                solve.result.quality === 'exact' ? t('solutions.exact') : t('solutions.heuristic')
              }
            />
          )}
        </Stack>

        {solve.running || !solve.result ? (
          <Typography variant="body2" color="text.secondary">
            {t('solutions.running')}
          </Typography>
        ) : (
          <>
            <Box
              component="pre"
              sx={{
                m: 0,
                p: 1.5,
                bgcolor: 'background.default',
                border: 1,
                borderColor: 'divider',
                borderRadius: 1,
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
                fontSize: 13,
                lineHeight: 1.6,
                overflowX: 'auto',
              }}
            >
              <code>
                {`x          = [${solve.result.best[0].x.join(', ')}]\n` +
                  `x^T Q x    = ${solve.result.best[0].energy}\n` +
                  `original y = ${solve.result.best[0].energy + model.constant}`}
              </code>
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
              {t('solutions.evaluated', {
                count: solve.result.evaluated.toLocaleString(),
                ms: solve.result.elapsedMs,
              })}
              {' · '}
              {solve.result.degeneracy > 1
                ? t('solutions.degeneracy', { count: solve.result.degeneracy })
                : t('solutions.unique')}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
              {t('hello.browserRunHint')}
            </Typography>
          </>
        )}
      </Paper>

      <Typography variant="body2" component="div" color="text.secondary" sx={{ mb: 2 }}>
        {t('hello.runItBody')}
      </Typography>
      {/*
        Driven by THIS page's state, not a fresh copy of the pristine case, so
        the emitted Python always matches the matrix and the table above it.
        A second CaseWorkbench here would both duplicate the editor and quietly
        export the paper's Q after the reader had edited the coefficients.
      */}
      <CodeExportPanel qcase={qcase} model={model} />

      <PresenterNotes>{t('notes.hello')}</PresenterNotes>
    </Box>
  );
}
