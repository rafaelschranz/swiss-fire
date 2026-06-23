/**
 * Swiss number / currency formatting. Convention: CHF + non-breaking space +
 * apostrophe thousands separator (U+2019), e.g. "CHF 50’000".
 */
const chfFormatter = new Intl.NumberFormat("de-CH", { maximumFractionDigits: 0 });

const NBSP = " ";

export function formatChf(value: number): string {
  return `CHF${NBSP}${chfFormatter.format(Math.round(value))}`;
}

/** Compact form for chart axes: 1.2M / 340k / 900. */
export function chfShort(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${Math.round(value / 1_000)}k`;
  return `${Math.round(value)}`;
}

export function formatPercent(fraction: number): string {
  return `${Math.round(fraction * 100)}%`;
}
