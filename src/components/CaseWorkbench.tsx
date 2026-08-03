import { useEffect, useMemo, useState } from 'react';
import { Alert, Box, Grid, Paper, Stack, Tab, Tabs, Typography } from '@mui/material';

import { applyEdit, maxMagnitude, SAFE_MAGNITUDE, type CaseEdit } from '../cases/mutate';
import { derive } from '../lib/derive';
import { diffMatrices } from '../lib/qubo';
import { useSolver } from '../hooks/useSolver';
import type { Clause, Graph, QuboCase } from '../types';
import { CodeExportPanel } from './CodeExportPanel';
import { ColoringEditor, GraphEditor, HelloEditor, NumbersEditor, SatEditor } from './CaseEditors';
import { AssignmentView, GraphView, KnapsackView, PartitionView, SatView } from './DomainViews';
import { FormulationTrace } from './FormulationTrace';
import { PenaltySlider } from './PenaltySlider';
import { QMatrixView } from './QMatrixView';
import { ScaleMeter } from './ScaleMeter';
import { SolutionPanel } from './SolutionPanel';
import { SourceBadge } from './SourceBadge';
import { VerificationChip, type VerificationStatus } from './VerificationChip';
import { useI18n } from '../i18n';

/** Recover the editable payload from a case, so editors start on the paper's data. */
function initialEdit(qcase: QuboCase): CaseEdit | null {
  switch (qcase.id) {
    case 'number-partitioning':
      return { kind: 'numbers', numbers: [...qcase.model.constraints[0].coeffs] };
    case 'max-cut':
    case 'min-vertex-cover':
      return qcase.graph ? { kind: 'graph', graph: qcase.graph } : null;
    case 'graph-coloring':
      return qcase.graph
        ? {
            kind: 'coloring',
            graph: qcase.graph,
            k: qcase.model.numVars / qcase.graph.nodes.length,
          }
        : null;
    case 'max-2-sat':
      return qcase.model.clauses
        ? { kind: 'sat', numVars: qcase.model.numVars, clauses: qcase.model.clauses }
        : null;
    case 'hello-world':
      return {
        kind: 'hello',
        linear: [...qcase.model.linear],
        quadratic: qcase.model.quadratic.map((q) => ({ ...q })),
      };
    default:
      return null;
  }
}

type View = 'formulation' | 'matrix' | 'solutions' | 'domain' | 'code';

export type CaseWorkbenchProps = {
  base: QuboCase;
};

/**
 * The per-case workbench: edit → derive → solve → reconcile → export, all live.
 *
 * Everything downstream flows from `derive()`, so a slider drag or a graph edit
 * updates the matrix, the solution, the feasibility check and the emitted Python
 * in one pass. Nothing on screen is a cached copy of anything else.
 */
export function CaseWorkbench({ base }: CaseWorkbenchProps) {
  const { t } = useI18n();
  const pristine = useMemo(() => initialEdit(base), [base]);
  const [edit, setEdit] = useState<CaseEdit | null>(pristine);
  const [penalty, setPenalty] = useState<number>(base.penalty?.paperValue ?? 1);
  const [view, setView] = useState<View>('formulation');

  // Switching case resets everything back to the published data.
  useEffect(() => {
    setEdit(pristine);
    setPenalty(base.penalty?.paperValue ?? 1);
  }, [base, pristine]);

  const edited =
    edit !== null && pristine !== null && JSON.stringify(edit) !== JSON.stringify(pristine);
  const penaltyChanged = base.penalty ? penalty !== base.penalty.paperValue : false;

  const qcase = useMemo(
    () => (edited && edit ? applyEdit(base, edit) : base),
    [base, edit, edited],
  );
  const derivation = useMemo(() => derive(qcase, penalty), [qcase, penalty]);
  const model = derivation.model;
  const solve = useSolver(model, qcase.model);

  // Reconciliation is only meaningful on the published data at the published P.
  const status: VerificationStatus = useMemo(() => {
    if (edited || penaltyChanged || qcase.custom) return { kind: 'custom' };
    const d = diffMatrices(model.Q, base.paperQ);
    return d.equal
      ? { kind: 'matches', n: model.n, constant: model.constant }
      : { kind: 'mismatch', count: d.cells.length };
  }, [edited, penaltyChanged, qcase.custom, model, base.paperQ]);

  const magnitude = maxMagnitude(model.Q);
  const slackCount = model.n - qcase.model.numVars;
  const bestX = solve.result?.best[0].x ?? [];

  const restore = () => {
    setEdit(pristine);
    setPenalty(base.penalty?.paperValue ?? 1);
  };

  const tabs: { key: View; label: string }[] = [
    { key: 'formulation', label: String(t('case.tab.formulation')) },
    { key: 'matrix', label: String(t('case.tab.matrix')) },
    { key: 'solutions', label: String(t('case.tab.solutions')) },
    { key: 'domain', label: String(t('case.tab.domain')) },
    { key: 'code', label: String(t('case.tab.code')) },
  ];

  const domain = renderDomain(qcase, bestX, model.constant, solve.result?.best[0].energy ?? 0);

  return (
    <Box>
      <Stack
        direction="row"
        spacing={1}
        sx={{ alignItems: 'center', flexWrap: 'wrap', rowGap: 1, mb: 2 }}
      >
        <SourceBadge qcase={base} />
        <VerificationChip status={status} onRestore={edited || penaltyChanged ? restore : undefined} />
      </Stack>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <ScaleMeter baseVars={qcase.model.numVars} slackVars={slackCount} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <PenaltySlider
            qcase={base}
            value={penalty}
            onChange={setPenalty}
            infeasible={
              solve.result != null &&
              qcase.model.constraints.length > 0 &&
              !checkOk(qcase, bestX)
            }
          />
        </Grid>
      </Grid>

      {magnitude > SAFE_MAGNITUDE && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {t('editor.overflow', { max: magnitude.toExponential(2) })}
        </Alert>
      )}

      {base.editable && edit && (
        <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
          <Typography variant="overline" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
            {t('editor.title')}
          </Typography>
          {renderEditor(edit, setEdit)}
        </Paper>
      )}

      {tabs.length > 1 && (
        <Tabs value={view} onChange={(_, v: View) => setView(v)} variant="scrollable" sx={{ mb: 2 }}>
          {tabs.map((x) => (
            <Tab key={x.key} value={x.key} label={x.label} />
          ))}
        </Tabs>
      )}

      {view === 'formulation' && <FormulationTrace qcase={qcase} derivation={derivation} />}
      {view === 'matrix' && (
        <QMatrixView model={model} paperQ={status.kind === 'matches' ? base.paperQ : undefined} />
      )}
      {view === 'solutions' && <SolutionPanel qcase={qcase} model={model} state={solve} />}
      {view === 'domain' && (domain ?? <Typography color="text.secondary">—</Typography>)}
      {view === 'code' && (
        <CodeExportPanel
          qcase={qcase}
          model={model}
          extraPackages={qcase.graph ? ['networkx', 'matplotlib'] : []}
        />
      )}
    </Box>
  );
}

function checkOk(qcase: QuboCase, x: number[]): boolean {
  for (const c of qcase.model.constraints) {
    let lhs = 0;
    for (let j = 0; j < c.coeffs.length; j++) lhs += c.coeffs[j] * (x[j] ?? 0);
    if (c.rel === '=' ? lhs !== c.rhs : c.rel === '<=' ? lhs > c.rhs : lhs < c.rhs) return false;
  }
  return true;
}

function renderEditor(edit: CaseEdit, setEdit: (e: CaseEdit) => void) {
  switch (edit.kind) {
    case 'numbers':
      return (
        <NumbersEditor
          numbers={edit.numbers}
          onChange={(numbers) => setEdit({ kind: 'numbers', numbers })}
        />
      );
    case 'graph':
      return (
        <GraphEditor graph={edit.graph} onChange={(graph: Graph) => setEdit({ kind: 'graph', graph })} />
      );
    case 'coloring':
      return (
        <ColoringEditor
          graph={edit.graph}
          k={edit.k}
          onChange={(graph, k) => setEdit({ kind: 'coloring', graph, k })}
        />
      );
    case 'sat':
      return (
        <SatEditor
          numVars={edit.numVars}
          clauses={edit.clauses}
          onChange={(numVars, clauses: Clause[]) => setEdit({ kind: 'sat', numVars, clauses })}
        />
      );
    case 'hello':
      return (
        <HelloEditor
          linear={edit.linear}
          quadratic={edit.quadratic}
          onChange={(linear, quadratic) => setEdit({ kind: 'hello', linear, quadratic })}
        />
      );
  }
}

/** Pick the problem-specific picture for a case. */
function renderDomain(qcase: QuboCase, x: number[], constant: number, energy: number) {
  if (x.length === 0) return null;
  switch (qcase.id) {
    case 'number-partitioning':
      return <PartitionView numbers={qcase.model.constraints[0].coeffs} x={x} />;
    case 'max-cut':
      return qcase.graph ? <GraphView graph={qcase.graph} x={x} mode="cut" /> : null;
    case 'min-vertex-cover':
      return qcase.graph ? <GraphView graph={qcase.graph} x={x} mode="cover" /> : null;
    case 'graph-coloring': {
      if (!qcase.graph) return null;
      const K = qcase.model.numVars / qcase.graph.nodes.length;
      const colorOf = (node: number) => {
        const p = qcase.graph!.nodes.indexOf(node);
        if (p < 0) return null;
        for (let c = 0; c < K; c++) if (x[p * K + c]) return c;
        return null;
      };
      return <GraphView graph={qcase.graph} x={x} mode="color" colorOf={colorOf} />;
    }
    case 'max-2-sat':
      return qcase.model.clauses ? (
        <SatView clauses={qcase.model.clauses} x={x} qcase={qcase} />
      ) : null;
    case 'qap': {
      const size = Math.round(Math.sqrt(qcase.model.numVars));
      return <AssignmentView x={x} size={size} cost={energy + constant} />;
    }
    case 'quadratic-knapsack': {
      const c = qcase.model.constraints[0];
      return (
        <KnapsackView
          x={x}
          weights={c.coeffs.slice(0, qcase.model.numVars)}
          budget={c.rhs}
          value={energy + constant}
        />
      );
    }
    default:
      return null;
  }
}
