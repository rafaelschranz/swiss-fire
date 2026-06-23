# Swiss FIRE Bridge Calculator

A free, public web calculator for the Swiss market answering: *if you stop
working before your pension pillars unlock, how much liquid capital do you
need to bridge the gap?*

This is an **educational tool, not financial advice** (see FINSA/FIDLEG
notes below). All computation runs client-side — no financial inputs are
ever sent to a server.

## Stack

Next.js (App Router) + TypeScript + Tailwind CSS + Vitest. The financial
engine in `lib/engine` is pure, framework-free TypeScript with zero React
imports, so it can be unit-tested and reused independently of the UI.

## Project structure

```
/app                   # Next.js routes (calculator + SEO content pages)
/components            # UI components
/lib/engine            # Pure TS financial engine
  constants.ts         # Dated 2026 Swiss pension/tax parameters, sourced in comments
  cantons.ts           # 26-canton tax table (4 seeded, 22 approximate placeholders)
  types.ts             # Shared engine types
  tax.ts               # (Phase 2) income/wealth/lump-sum tax functions
  accumulation.ts       # (Phase 2) year-by-year accumulation simulator
  decumulation.ts       # (Phase 2) year-by-year decumulation + withdrawal sequencing
  montecarlo.ts         # (Phase 2) parametric + block-bootstrap Monte Carlo
  __tests__/            # Vitest golden tests
/data/returns          # Embedded real-return proxy series for the bootstrap mode
/locales               # de (default), en
```

## Constants: sources and re-verification

All figures in `lib/engine/constants.ts` and `lib/engine/cantons.ts` are
dated **2026** and sourced inline as code comments:

- **Pillar 3a**: estv.admin.ch maximum contribution figures.
- **Pillar 2 (BVG)**: bsv.admin.ch entry threshold, coordination deduction,
  coordinated salary bounds, minimum interest rate, minimum conversion rate,
  retirement credit table.
- **Pillar 1 (AHV)**: ahv-iv.ch maximum/minimum pension, reference age,
  flexible claim window, non-employed contribution brackets.
- **Cantonal tax data**: Lucerne, Zug, Zürich, and Schwyz are seeded.
  - Schwyz's lump-sum withdrawal tax curve is calibrated to real reference
    points from the project brief (CHF 100k -> ~CHF 2,151; CHF 250k ->
    ~CHF 13,147). SZ has a pending Federal Court case on capital-benefit
    taxation — treat as provisional.
  - Zug/Zürich/Lucerne wealth-tax curves are seeded "approximate effective
    curves" per the brief. Their lump-sum tax curves, however, are
    **unverified placeholders** — the brief only gave qualitative rankings
    (e.g. "ZG is low", "ZH is relatively high in the 250k-500k range") with
    no absolute figures, so no numbers were invented; these need real
    sourcing before being relied on.
  - The other 22 cantons are entirely unseeded approximations
    (`verified: false`), generic placeholder curves that need grounding.

### January re-verification checklist

Run through this every January, since the Federal Council typically adjusts
AHV/BVG figures alongside AHV pension changes:

1. Pillar 3a max contributions (estv.admin.ch).
2. BVG entry threshold, coordination deduction, salary bounds, minimum
   interest rate, minimum conversion rate (bsv.admin.ch).
3. AHV max/min pension, reference age schedule, non-employed contribution
   brackets (ahv-iv.ch).
4. Lump-sum withdrawal tax reference points per canton (ESTV / cantonal tax
   administration calculators).
5. Update the `source` field and "as of" date comment on every changed
   constant.

## Conventions

- The engine works in **real (inflation-adjusted) terms** throughout unless
  a field name explicitly says "nominal".
- Tax/canton figures not yet backed by a real cited source are marked
  `verified: false` and labelled as placeholders in code comments — never
  invented as if grounded.

## FINSA / FIDLEG constraints

- Educational and illustrative only. No personal financial advice or
  recommendations — output is framed as "based on the inputs you entered,
  here is the math."
- Every tax figure is labelled "estimate — verify with official ESTV /
  cantonal calculators"; cantonal data is explicitly marked approximate
  and dated.
- Affiliate links (broker, Pillar 3a provider) are clearly disclosed as
  advertising, visually separate from calculation outputs, and never
  injected into results.
- No server-side collection of user financial inputs; no analytics that
  capture input values.

## Development

```bash
npm install
npm run dev        # local dev server
npm run test       # run Vitest engine tests
npm run lint       # ESLint
```

## Status

**Phase 0/1/2/3/4 complete**: project scaffolded, engine types/constants/
canton table seeded, `tax.ts` / `accumulation.ts` / `decumulation.ts`
implemented, and `montecarlo.ts` (parametric lognormal + block-bootstrap)
added on top of the same deterministic decumulation engine via an
injectable per-year `returnsPath`. 28 Vitest golden/sanity tests cover §5:
3a capping, coordinated salary, PK projection, non-employed AHV brackets,
the Schwyz lump-sum tax curve, bridge-depletion failure, tax-optimal
withdrawal staggering, and Monte Carlo success-rate monotonicity in
starting capital and expected return.

Phase 4 (UI) is built: a single-page client-side calculator
(`app/page.tsx`) wiring `InputsPanel`, `Lifeline`, `ResultsHeadline`,
`BalanceChart`, an optional `MonteCarloFan` (parametric/bootstrap toggle),
`AssumptionsPanel`, the FINSA/FIDLEG `Disclaimer`, and disclosed
`AffiliateSlot`s together with the engine. All computation runs in the
browser; no inputs are sent to a server. German-language UI by default.
`tsc --noEmit`, `eslint`, and `vitest run` all pass, and the page has been
verified rendering real computed figures via a local dev server.

Not yet done: SEO content pages, i18n beyond German, and
accessibility/mobile polish.

Notes on data still needing real grounding:
- The cantonal lump-sum tax figures for ZG/ZH/LU (and all 22 unseeded
  cantons) are placeholders — the official ESTV tax calculator
  (swisstaxcalculator.estv.admin.ch) couldn't be reached from this
  sandbox's network allowlist. Swap in real reference points there
  before relying on those curves.
- `data/returns/proxy-returns.ts` is an explicitly-flagged SYNTHETIC
  placeholder return series for the Monte Carlo bootstrap mode — not real
  historical data. Replace with a cited CHF real-return series (e.g. a
  Global Investment Returns Yearbook-style series) before relying on
  bootstrap results.
