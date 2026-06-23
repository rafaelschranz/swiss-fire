/**
 * Embedded annual REAL return proxy series for the Monte Carlo block-
 * bootstrap stress mode, expressed in CHF terms.
 *
 * IMPORTANT — THIS IS A SYNTHETIC ILLUSTRATIVE PLACEHOLDER, NOT REAL
 * HISTORICAL DATA. This sandbox has no network access to a verified
 * historical-returns source (e.g. the Credit Suisse / UBS Global
 * Investment Returns Yearbook CHF series, or SNB/Pictet data), so no
 * real annual figures have been invented here. The series below was
 * generated to have plausible long-run statistical properties for a
 * global equity index and a global bond index in CHF terms (equities:
 * mean real return roughly in the historically-documented 4-6% range
 * with ~16-18% volatility; bonds: roughly 0-1.5% mean real return with
 * ~5-6% volatility — both depressed relative to USD/EUR-denominator
 * equivalents because of the Swiss franc's long-run appreciation, which
 * matters for an unhedged CHF investor and should be called out in the
 * UI wherever this proxy series is used) — but the specific year-by-year
 * values are NOT sourced and must NOT be presented to users as historical
 * fact.
 *
 * TODO before relying on the bootstrap mode in production: replace this
 * array with a real, cited, year-by-year CHF real-return series and
 * update this comment with the source and "as of" date.
 */

export const EQUITY_REAL_RETURNS_CHF: readonly number[] = [
  0.18, -0.04, 0.09, 0.21, -0.12, 0.15, 0.06, -0.08, 0.22, 0.11,
  -0.19, 0.08, 0.14, -0.31, 0.24, 0.09, 0.03, -0.06, 0.17, 0.12,
  -0.02, 0.19, 0.07, -0.15, 0.10, 0.05, 0.20, -0.09, 0.13, 0.16,
  -0.05, 0.08, 0.21, -0.22, 0.14, 0.06, 0.11, -0.03, 0.18, 0.04,
];

export const BOND_REAL_RETURNS_CHF: readonly number[] = [
  0.02, 0.01, -0.01, 0.03, 0.00, 0.04, -0.02, 0.01, 0.02, 0.00,
  0.05, -0.01, 0.02, 0.06, -0.03, 0.01, 0.02, 0.00, -0.01, 0.03,
  0.01, -0.02, 0.04, 0.02, 0.00, 0.01, -0.01, 0.03, 0.02, -0.02,
  0.05, 0.01, -0.01, 0.04, 0.00, 0.02, 0.01, -0.01, 0.02, 0.03,
];

if (EQUITY_REAL_RETURNS_CHF.length !== BOND_REAL_RETURNS_CHF.length) {
  throw new Error("Equity and bond proxy series must be the same length to mix by year.");
}
