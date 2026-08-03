import { useCallback, useEffect, useRef, useState } from 'react';

import type { ConstrainedModel, QuboModel, SampleSet } from '../types';
import { EXACT_LIMIT, HARD_LIMIT } from '../types';
import type { SolveRequest, SolveResponse } from '../workers/solver.worker';

export type SolveState = {
  result: SampleSet | null;
  running: boolean;
  progress: number;
  error: string | null;
  /** Which strategy was actually used — the UI must not claim "optimal" for tabu. */
  strategy: 'exact' | 'tabu' | null;
};

/** Scale tiers, mirroring the meter shown next to every editable input. */
export type ScaleTier = 'green' | 'amber' | 'orange' | 'red';

export function scaleTier(n: number): ScaleTier {
  if (n <= 20) return 'green';
  if (n <= EXACT_LIMIT) return 'amber';
  if (n <= 200) return 'orange';
  return n > HARD_LIMIT + 200 ? 'red' : 'orange';
}

/** Exhaustive below the limit, heuristic above it. */
export function strategyFor(n: number): 'exact' | 'tabu' {
  return n <= EXACT_LIMIT ? 'exact' : 'tabu';
}

/**
 * Runs a QUBO through the worker, re-solving whenever the model changes.
 *
 * A fresh worker per run is deliberate: terminating it is the only reliable way
 * to abort a sweep that is already inside its inner loop.
 */
export function useSolver(model: QuboModel | null, original?: ConstrainedModel): SolveState {
  const [state, setState] = useState<SolveState>({
    result: null,
    running: false,
    progress: 0,
    error: null,
    strategy: null,
  });
  const workerRef = useRef<Worker | null>(null);

  const kill = useCallback(() => {
    workerRef.current?.terminate();
    workerRef.current = null;
  }, []);

  useEffect(() => {
    if (!model) {
      setState({ result: null, running: false, progress: 0, error: null, strategy: null });
      return;
    }
    if (model.n > HARD_LIMIT + 200) {
      setState({
        result: null,
        running: false,
        progress: 0,
        error: 'too-large',
        strategy: null,
      });
      return;
    }

    kill();
    const strategy = strategyFor(model.n);
    setState({ result: null, running: true, progress: 0, error: null, strategy });

    const worker = new Worker(new URL('../workers/solver.worker.ts', import.meta.url), {
      type: 'module',
    });
    workerRef.current = worker;

    worker.onmessage = (ev: MessageEvent<SolveResponse>) => {
      const msg = ev.data;
      if (msg.kind === 'progress') {
        setState((s) => (s.running ? { ...s, progress: msg.fraction } : s));
      } else if (msg.kind === 'done') {
        setState({
          result: msg.result,
          running: false,
          progress: 1,
          error: null,
          strategy,
        });
        kill();
      } else {
        setState({
          result: null,
          running: false,
          progress: 0,
          error: msg.message,
          strategy,
        });
        kill();
      }
    };

    const req: SolveRequest = {
      Q: model.Q,
      sense: model.sense,
      strategy,
      // Counting feasibility per candidate is only affordable on the exact path
      // at modest n; above that the sweep cost would double.
      feasibility:
        strategy === 'exact' && model.n <= 20 && original?.constraints.length
          ? {
              rows: original.constraints.map((c) => ({
                coeffs: c.coeffs,
                rel: c.rel,
                rhs: c.rhs,
              })),
            }
          : undefined,
    };
    worker.postMessage(req);

    return kill;
    // `model` is rebuilt on every derivation, so identity is the right trigger.
  }, [model, original, kill]);

  return state;
}
