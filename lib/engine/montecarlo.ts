import { BOND_REAL_RETURNS_CHF, EQUITY_REAL_RETURNS_CHF } from "../../data/returns/proxy-returns";
import { DEFAULTS } from "./constants";
import { simulateDecumulation, type DecumulationParams } from "./decumulation";
import type { MonteCarloResult } from "./types";

export type MonteCarloMode = "parametric" | "bootstrap";

export interface MonteCarloInputs {
  /** Base decumulation params; `expectedReturn` doubles as the parametric mean return. */
  decumulationParams: DecumulationParams;
  volatility: number;
  /** Equity share of the mix (0..1) used to blend the bootstrap proxy series. Bonds = 1 - equityShare. */
  equityShare: number;
  mode: MonteCarloMode;
  paths?: number;
  /** Injectable seed for reproducible runs (tests); omit for a fresh random seed. */
  seed?: number;
}

/** Deterministic, seedable PRNG (mulberry32) so Monte Carlo runs are reproducible in tests. */
function mulberry32(seed: number): () => number {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function standardNormal(rng: () => number): number {
  // Box-Muller transform.
  const u1 = Math.max(rng(), Number.EPSILON);
  const u2 = rng();
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

/** Lognormal annual real returns: mean arithmetic return ~= `mean`, with `vol` annual volatility. */
function generateParametricPath(years: number, mean: number, vol: number, rng: () => number): number[] {
  const drift = Math.log(1 + mean) - 0.5 * vol * vol;
  const path: number[] = [];
  for (let i = 0; i < years; i++) {
    const z = standardNormal(rng);
    path.push(Math.exp(drift + vol * z) - 1);
  }
  return path;
}

function mixedHistoricalReturns(equityShare: number): number[] {
  return EQUITY_REAL_RETURNS_CHF.map((eq, i) => equityShare * eq + (1 - equityShare) * BOND_REAL_RETURNS_CHF[i]);
}

/** Block-bootstrap: stitches random 3-5 year blocks from the embedded proxy series. */
function generateBootstrapPath(
  years: number,
  equityShare: number,
  rng: () => number,
  blockMin = DEFAULTS.bootstrapBlockYears.min,
  blockMax = DEFAULTS.bootstrapBlockYears.max,
): number[] {
  const series = mixedHistoricalReturns(equityShare);
  const path: number[] = [];
  while (path.length < years) {
    const blockLength = blockMin + Math.floor(rng() * (blockMax - blockMin + 1));
    const start = Math.floor(rng() * series.length);
    for (let i = 0; i < blockLength && path.length < years; i++) {
      path.push(series[(start + i) % series.length]);
    }
  }
  return path;
}

function percentile(sortedValues: number[], p: number): number {
  if (sortedValues.length === 0) return 0;
  const idx = (sortedValues.length - 1) * p;
  const lower = Math.floor(idx);
  const upper = Math.ceil(idx);
  if (lower === upper) return sortedValues[lower];
  const fraction = idx - lower;
  return sortedValues[lower] + fraction * (sortedValues[upper] - sortedValues[lower]);
}

/**
 * Runs the decumulation simulator across many stochastic return paths.
 * Parametric mode (default) draws lognormal annual real returns from
 * `expectedReturn` + `volatility`. Bootstrap mode stitches 3-5 year
 * blocks from the embedded proxy return series instead (see
 * data/returns/proxy-returns.ts — currently a documented synthetic
 * placeholder, not real historical data).
 */
export function simulateMonteCarlo(inputs: MonteCarloInputs): MonteCarloResult {
  const numPaths = inputs.paths ?? DEFAULTS.monteCarloPaths;
  const rng = mulberry32(inputs.seed ?? Date.now());
  const years = inputs.decumulationParams.horizonAge - inputs.decumulationParams.fireAge;

  let successes = 0;
  let bridgeFailures = 0;
  const balancesByYear: number[][] = Array.from({ length: years }, () => []);

  for (let p = 0; p < numPaths; p++) {
    const returnsPath =
      inputs.mode === "parametric"
        ? generateParametricPath(years, inputs.decumulationParams.expectedReturn, inputs.volatility, rng)
        : generateBootstrapPath(years, inputs.equityShare, rng);

    const result = simulateDecumulation({ ...inputs.decumulationParams, returnsPath });

    if (!result.failed) successes++;
    if (result.failedDuringBridge) bridgeFailures++;

    for (let y = 0; y < years; y++) {
      const yearResult = result.years[y];
      balancesByYear[y].push(yearResult ? yearResult.taxableBalance : 0);
    }
  }

  const percentile10: number[] = [];
  const percentile50: number[] = [];
  const percentile90: number[] = [];

  for (let y = 0; y < years; y++) {
    const sorted = [...balancesByYear[y]].sort((a, b) => a - b);
    percentile10.push(percentile(sorted, 0.1));
    percentile50.push(percentile(sorted, 0.5));
    percentile90.push(percentile(sorted, 0.9));
  }

  return {
    successRate: successes / numPaths,
    bridgeFailureRate: bridgeFailures / numPaths,
    percentile10,
    percentile50,
    percentile90,
  };
}
