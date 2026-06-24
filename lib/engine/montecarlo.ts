import { DEFAULTS, MARKET } from "./constants";
import { simulateDecumulation, type DecumulationParams } from "./decumulation";
import { simulateHousehold, type HouseholdParams } from "./household";
import type { MonteCarloResult } from "./types";

/**
 * Monte Carlo return models:
 *   - "parametric": lognormal annual real returns from the user's own
 *     `expectedReturn` (mean) and `volatility`.
 *   - "historical": a two-asset model calibrated to real long-run Swiss data
 *     (Pictet 1900–2025, see MARKET): equity and bond real returns are drawn
 *     from their historical means/volatilities, correlated, and blended by the
 *     equity share. This grounds the simulation in real published figures
 *     rather than a synthetic series.
 */
export type MonteCarloMode = "parametric" | "historical";

export interface MonteCarloInputs {
  /** Base decumulation params; `expectedReturn` doubles as the parametric mean return. */
  decumulationParams: DecumulationParams;
  volatility: number;
  /** Equity share of the mix (0..1); bonds = 1 - equityShare. */
  equityShare: number;
  /** Swiss share of the equity sleeve (0..1); the rest is global equities. */
  swissEquityShare: number;
  mode: MonteCarloMode;
  paths?: number;
  /** Injectable seed for reproducible runs (tests); omit for a fresh random seed. */
  seed?: number;
}

export interface HouseholdMonteCarloInputs {
  householdParams: HouseholdParams;
  volatility: number;
  equityShare: number;
  swissEquityShare: number;
  mode: MonteCarloMode;
  paths?: number;
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

/** Lognormal annual real returns: arithmetic mean ~= `mean`, with `vol` annual volatility. */
function generateParametricPath(years: number, mean: number, vol: number, rng: () => number): number[] {
  const drift = Math.log(1 + mean) - 0.5 * vol * vol;
  const path: number[] = [];
  for (let i = 0; i < years; i++) {
    path.push(Math.exp(drift + vol * standardNormal(rng)) - 1);
  }
  return path;
}

/**
 * Real mean and volatility of the equity sleeve, blended from Swiss and global
 * equities by `swissEquityShare` (e.g. 0.2 = 20% Swiss / 80% global), using the
 * real Swiss (Pictet) and world (UBS/DMS) figures and their assumed correlation.
 */
export function blendedEquity(swissEquityShare: number): { mean: number; vol: number } {
  const w = Math.min(1, Math.max(0, swissEquityShare));
  const { equityRealReturn: sm, equityVolatility: ss, globalEquityRealReturn: gm, globalEquityVolatility: gs, swissGlobalEquityCorrelation: rho } = MARKET;
  const mean = w * sm + (1 - w) * gm;
  const variance = w * w * ss * ss + (1 - w) * (1 - w) * gs * gs + 2 * w * (1 - w) * rho * ss * gs;
  return { mean, vol: Math.sqrt(variance) };
}

/**
 * Two-asset path calibrated to real history (MARKET). The equity sleeve is a
 * Swiss/global blend (`swissEquityShare`); equity and bond real returns are
 * drawn lognormally from their historical means/vols, correlated via a
 * Cholesky step, and blended by the equity share.
 */
function generateHistoricalPath(years: number, equityShare: number, swissEquityShare: number, rng: () => number): number[] {
  const { bondRealReturn, bondVolatility, equityBondCorrelation: rho } = MARKET;
  const eq = blendedEquity(swissEquityShare);
  const eqDrift = Math.log(1 + eq.mean) - 0.5 * eq.vol * eq.vol;
  const bondDrift = Math.log(1 + bondRealReturn) - 0.5 * bondVolatility * bondVolatility;
  const path: number[] = [];
  for (let i = 0; i < years; i++) {
    const z1 = standardNormal(rng);
    const z2 = standardNormal(rng);
    const zBond = rho * z1 + Math.sqrt(1 - rho * rho) * z2;
    const eqRet = Math.exp(eqDrift + eq.vol * z1) - 1;
    const bondRet = Math.exp(bondDrift + bondVolatility * zBond) - 1;
    path.push(equityShare * eqRet + (1 - equityShare) * bondRet);
  }
  return path;
}

function percentile(sortedValues: number[], p: number): number {
  if (sortedValues.length === 0) return 0;
  const idx = (sortedValues.length - 1) * p;
  const lower = Math.floor(idx);
  const upper = Math.ceil(idx);
  if (lower === upper) return sortedValues[lower];
  return sortedValues[lower] + (idx - lower) * (sortedValues[upper] - sortedValues[lower]);
}

interface PathOutcome {
  failed: boolean;
  failedDuringBridge: boolean;
  /** Taxable balance per simulated year (from the start of the projection axis). */
  balances: number[];
}

/**
 * Generic Monte Carlo harness: generates `paths` return sequences and feeds
 * each to `runOnce`, then aggregates success rates and per-year balance
 * percentiles. Shared by the single-person and household simulators.
 */
function runMonteCarlo(opts: {
  years: number;
  paths: number;
  seed?: number;
  mode: MonteCarloMode;
  mean: number;
  volatility: number;
  equityShare: number;
  swissEquityShare: number;
  runOnce: (returnsPath: number[]) => PathOutcome;
}): MonteCarloResult {
  const { years, paths, mode, mean, volatility, equityShare, swissEquityShare, runOnce } = opts;
  const rng = mulberry32(opts.seed ?? Date.now());

  let successes = 0;
  let bridgeFailures = 0;
  const balancesByYear: number[][] = Array.from({ length: years }, () => []);

  for (let p = 0; p < paths; p++) {
    const returnsPath =
      mode === "parametric"
        ? generateParametricPath(years, mean, volatility, rng)
        : generateHistoricalPath(years, equityShare, swissEquityShare, rng);

    const outcome = runOnce(returnsPath);
    if (!outcome.failed) successes++;
    if (outcome.failedDuringBridge) bridgeFailures++;

    for (let y = 0; y < years; y++) {
      balancesByYear[y].push(outcome.balances[y] ?? 0);
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

  return { successRate: successes / paths, bridgeFailureRate: bridgeFailures / paths, percentile10, percentile50, percentile90 };
}

/** Single-person Monte Carlo over the decumulation engine (fireAge-indexed). */
export function simulateMonteCarlo(inputs: MonteCarloInputs): MonteCarloResult {
  const params = inputs.decumulationParams;
  return runMonteCarlo({
    years: params.horizonAge - params.fireAge,
    paths: inputs.paths ?? DEFAULTS.monteCarloPaths,
    seed: inputs.seed,
    mode: inputs.mode,
    mean: params.expectedReturn,
    volatility: inputs.volatility,
    equityShare: inputs.equityShare,
    swissEquityShare: inputs.swissEquityShare,
    runOnce: (returnsPath) => {
      const r = simulateDecumulation({ ...params, returnsPath });
      return { failed: r.failed, failedDuringBridge: r.failedDuringBridge, balances: r.years.map((y) => y.taxableBalance) };
    },
  });
}

/** Household Monte Carlo over the calendar-timeline engine (currentAge-indexed). */
export function simulateHouseholdMonteCarlo(inputs: HouseholdMonteCarloInputs): MonteCarloResult {
  const params = inputs.householdParams;
  return runMonteCarlo({
    years: params.horizonAge - params.primary.currentAge,
    paths: inputs.paths ?? DEFAULTS.monteCarloPaths,
    seed: inputs.seed,
    mode: inputs.mode,
    mean: params.expectedReturn,
    volatility: inputs.volatility,
    equityShare: inputs.equityShare,
    swissEquityShare: inputs.swissEquityShare,
    runOnce: (returnsPath) => {
      const r = simulateHousehold({ ...params, returnsPath });
      return { failed: r.failed, failedDuringBridge: r.failedDuringBridge, balances: r.years.map((y) => y.taxableBalance) };
    },
  });
}
