/// <reference lib="webworker" />

/**
 * Solver worker.
 *
 * Solving runs off the main thread so an `n = 24` exhaustive sweep (a few
 * seconds) leaves the UI responsive and cancellable. Cancellation works by
 * terminating the worker outright, which is why the hook that owns it recreates
 * one per run.
 */

import { bruteForce } from '../lib/samplers/bruteForce';
import { tabuSearch } from '../lib/samplers/tabu';
import type { SampleSet, Sense } from '../types';

export type SolveRequest = {
  Q: number[][];
  sense: Sense;
  strategy: 'exact' | 'tabu';
  /** Original constraint rows, so feasibility can be counted during the sweep. */
  feasibility?: {
    rows: { coeffs: number[]; rel: '<=' | '=' | '>='; rhs: number }[];
  };
  iterations?: number;
  seed?: number;
};

export type SolveResponse =
  | { kind: 'progress'; fraction: number }
  | { kind: 'done'; result: SampleSet }
  | { kind: 'error'; message: string };

const ctx = self as unknown as DedicatedWorkerGlobalScope;

ctx.onmessage = (ev: MessageEvent<SolveRequest>) => {
  const req = ev.data;
  try {
    const post = (m: SolveResponse) => ctx.postMessage(m);
    const onProgress = (fraction: number) => {
      post({ kind: 'progress', fraction });
    };

    let isFeasible: ((x: Uint8Array) => boolean) | undefined;
    if (req.feasibility && req.feasibility.rows.length) {
      const rows = req.feasibility.rows;
      isFeasible = (x) => {
        for (const r of rows) {
          let lhs = 0;
          for (let j = 0; j < r.coeffs.length; j++) lhs += r.coeffs[j] * (x[j] ?? 0);
          if (r.rel === '=' ? lhs !== r.rhs : r.rel === '<=' ? lhs > r.rhs : lhs < r.rhs) {
            return false;
          }
        }
        return true;
      };
    }

    const result =
      req.strategy === 'exact'
        ? bruteForce(req.Q, { sense: req.sense, onProgress, isFeasible })
        : tabuSearch(req.Q, {
            sense: req.sense,
            onProgress,
            iterations: req.iterations,
            seed: req.seed,
          });

    post({ kind: 'done', result });
  } catch (e) {
    ctx.postMessage({ kind: 'error', message: (e as Error).message } satisfies SolveResponse);
  }
};
