/// <reference lib="webworker" />

/**
 * Digital Annealer worker.
 *
 * Runs the parallel-trial anneal and its single-trial baseline on the same
 * schedule, then — when the problem is small enough to enumerate — checks
 * whether rounding Q to a narrower register moves the optimum. As with the
 * other workers, cancelling means terminating it, so the panel makes one per run.
 */

import { bruteForce } from 'qubo-core/samplers/bruteForce';
import { digitalAnnealer, type DigitalAnnealerResult } from 'qubo-core/samplers/digitalAnnealer';
import { quantize, type DaPrecision } from 'qubo-core/hardware/daPrecision';
import { evaluate } from 'qubo-core/qubo';
import type { Sense } from 'qubo-core/types';

/** Enumerating the rounded problem is only worth it while it stays interactive. */
export const QUANTIZE_MAX_VARS = 20;

export type AnnealRequest = {
  Q: number[][];
  sense: Sense;
  sweeps: number;
  runs: number;
  seed: number;
  /** Register widths to round to for the precision demo. */
  precision: DaPrecision;
};

export type QuantizeOutcome = {
  scale: number;
  rounded: number;
  /** Optimum of the rounded problem, scored on the ORIGINAL Q. */
  energyOnOriginal: number;
  x: number[];
};

export type AnnealResponse =
  | { kind: 'progress'; fraction: number }
  | {
      kind: 'done';
      parallel: DigitalAnnealerResult;
      single: DigitalAnnealerResult;
      quantized: QuantizeOutcome | null;
    }
  | { kind: 'error'; message: string };

const ctx = self as unknown as DedicatedWorkerGlobalScope;

ctx.onmessage = (ev: MessageEvent<AnnealRequest>) => {
  const { Q, sense, sweeps, runs, seed, precision } = ev.data;
  const post = (m: AnnealResponse) => ctx.postMessage(m);
  try {
    const common = { sense, sweeps, runs, seed, trace: true };
    const parallel = digitalAnnealer(Q, {
      ...common,
      onProgress: (f) => post({ kind: 'progress', fraction: f / 2 }),
    });
    const single = digitalAnnealer(Q, {
      ...common,
      trial: 'single',
      onProgress: (f) => post({ kind: 'progress', fraction: 0.5 + f / 2 }),
    });

    let quantized: QuantizeOutcome | null = null;
    if (Q.length <= QUANTIZE_MAX_VARS) {
      const qz = quantize(Q, precision);
      const x = bruteForce(qz.Q, { sense }).best[0].x;
      quantized = { scale: qz.scale, rounded: qz.rounded, energyOnOriginal: evaluate(Q, x), x };
    }

    post({ kind: 'done', parallel, single, quantized });
  } catch (err) {
    post({ kind: 'error', message: err instanceof Error ? err.message : String(err) });
  }
};
