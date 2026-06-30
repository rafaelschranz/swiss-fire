# Pillar Zero — Swiss FIRE Bridge Calculator

**Pillar Zero** is a free, public website + calculator for the Swiss market
answering: *if you stop working before your pension pillars unlock, how much
liquid capital do you need to bridge the gap?*

This is an **educational tool, not financial advice** (see FINSA/FIDLEG
notes below). All computation runs client-side — no financial inputs are
ever sent to a server.

## Site structure

- `/` — marketing homepage (problem, features, how it works, FAQ).
- `/rechner` — the calculator (the product). `Calculator.tsx` is the client
  component; `page.tsx` is a server wrapper with metadata + JSON-LD.
- `/blog` + `/blog/[slug]` — articles (`lib/blog.ts`), statically generated.
- `/ratgeber` — long-form educational guide.
- `/ueber-uns`, `/impressum`, `/datenschutz` — about + legal.
- Global `SiteHeader`/`SiteFooter` (`components/site/`), brand + nav in
  `lib/site.ts`. SEO: Organization/WebSite/FAQ/BlogPosting JSON-LD, sitemap,
  canonical URLs, and a generated OG image (`app/opengraph-image.tsx`).

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
  cantons.ts           # 26-canton tax table (income/wealth/capital = real ESTV 2026 curves)
  types.ts             # Shared engine types
  tax.ts               # (Phase 2) income/wealth/lump-sum tax functions
  accumulation.ts       # (Phase 2) year-by-year accumulation simulator
  decumulation.ts       # year-by-year decumulation + withdrawal sequencing
  household.ts          # two-person calendar-timeline simulator (couples)
  montecarlo.ts         # parametric + real-data (Pictet-calibrated) Monte Carlo
  __tests__/            # Vitest golden tests
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
- **Cantonal capital-withdrawal tax (the dominant tax on 3a/PK lump sums)**:
  now grounded in **real ESTV figures for all 26 cantons**. The
  `lumpSumTax.referencePoints` in `cantons.ts` are the official ESTV 2026
  capital tax (cantonal + communal, single, no church, at each cantonal
  capital), pulled from swisstaxcalculator.estv.admin.ch
  (`API_calculateManyCapitalTaxes`). The engine interpolates between the
  points, scales them by the Gemeinde factor for other municipalities, and
  adds the federal one-fifth tariff.
- **Cantonal income & wealth tax**: also grounded in **real ESTV figures for
  all 26 cantons** now. `cantons.ts` carries `incomeTaxCurve` and
  `wealthTaxCurve` (single/married) — the ESTV 2026 cantonal + communal tax at
  each cantonal capital, for pension income (ESTV applies its standard
  deductions). The engine interpolates these, scales by the Gemeinde factor for
  other municipalities, and adds the exact federal direct tax. Remaining
  approximations: per-municipality differences within a canton (handled via the
  Gemeinde factor rather than a full municipal tariff table), church tax (not
  modelled), and income type (the curve uses pension income for the whole
  ordinary-income base, including dividends).

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

## Deployment

```bash
cp .env.example .env.local      # then set NEXT_PUBLIC_SITE_URL to the real domain
npm run build && npm start      # or deploy to any Next.js host (e.g. Vercel)
```

`NEXT_PUBLIC_SITE_URL` feeds the canonical URL, sitemap, robots and OpenGraph
tags. A branded share image is generated at `/opengraph-image` (see
`app/opengraph-image.tsx`) and wired into the OG/Twitter metadata automatically.

## Status

**Phase 0/1/2/3/4 complete**: project scaffolded, engine types/constants/
canton table seeded, `tax.ts` / `accumulation.ts` / `decumulation.ts`
implemented, and `montecarlo.ts` added on top of the same deterministic
engines via an injectable per-year `returnsPath`. Vitest golden/sanity tests
cover 3a capping, coordinated salary, PK projection, non-employed AHV
brackets, the Schwyz lump-sum tax curve, bridge-depletion failure, tax-optimal
withdrawal staggering, the household engine (income phases, spouse AHV
exemption, independent retirement), and Monte Carlo success-rate monotonicity.

### Monte Carlo — real data

Two return models, both reusing the deterministic engines path-by-path:
- **parametric** — lognormal annual real returns from the user's own expected
  return + volatility;
- **historical** — a model **calibrated to real long-run data** (`MARKET` in
  `constants.ts`, cited): Swiss equities ≈4.6% real / σ19% and Swiss bonds
  ≈1.8% real / σ5.2% (Pictet, 1900–2025), plus **global equities** ≈5.2% real
  / σ17% (UBS/Dimson-Marsh-Staunton Global Investment Returns Yearbook 2025).
  The user sets the **equity geography split** (e.g. 40% Swiss / 60% global)
  via `swissEquityShare`; the equity sleeve's mean/vol is blended from the two
  (diversification lowers the blended vol), then blended with bonds by the
  equity share. The earlier synthetic placeholder series has been removed. The
  equity/bond and Swiss/global correlations are flagged modelling assumptions,
  and the world figures are in the index's reporting basis (CHF strength not
  modelled).

Monte Carlo runs for both single people (decumulation, indexed from FIRE) and
households (the calendar-timeline engine, indexed from today).

The deterministic **expected real return and volatility** are themselves
auto-estimated from the chosen allocation (`portfolioRealStats`): the equity
sleeve (Swiss/global blend) mixed with bonds by the equity share, using the
same real MARKET figures. So the projection, the parametric Monte Carlo, and
the historical Monte Carlo all move together when the allocation changes (the
default 70/30 mix lands at ≈4% real / ≈12% vol). Both fields keep a "Schätzen"
toggle to override with a manual figure.

Phase 4 (UI) is built and was reworked in Phase 6 into a guided
experience: `app/page.tsx` is a client component that runs a four-step
wizard (Über Sie / Vermögen heute / Ruhestand / Feinabstimmung) built from
`components/wizard/*` and the polished `components/ui/*` primitives
(currency + percent fields, segmented control, select). Submitting reveals
a results dashboard — a gradient verdict hero (`ResultsHeadline`),
`Lifeline`, `BalanceChart`, an optional `MonteCarloFan`
(parametric/bootstrap toggle), `AssumptionsPanel`, the FINSA/FIDLEG
`Disclaimer`, and disclosed `AffiliateSlot`s — with an "Eingaben anpassen"
button back into the wizard. Shared input state/defaults live in
`lib/inputs.ts`. Fields a user often can't fill in confidently (AHV
pension, statutory ages, 3a max contribution, health premium, horizon)
start **auto-estimated** from the entered figures + verified constants via
`lib/estimates.ts`, with a per-field "Schätzen" toggle to switch to manual
entry. All computation runs in the browser; no inputs are sent to a
server. German-language UI by default.

Income can be modelled two ways: a constant salary with real growth, or an
**age-banded schedule** ("ab Alter X: Salär, Sparrate, 3a") for careers
where income ramps up sharply — e.g. someone in their twenties. The
schedule is an optional `incomePhases` array on the accumulation engine
(absent → the flat model runs unchanged); the wizard toggles between the
two and edits the bands via `IncomePhasesEditor`.

One-off inflows (inheritance, property sale, bonus) can be credited to the
taxable account at a chosen age via `oneOffInflows` — applied in the
accumulation phase if at/before FIRE, otherwise in decumulation.

Pillar withdrawals follow Swiss regulation rather than a draw-when-short
heuristic: **Säule 3a is always taken as capital** at its unlock age — and
can be **split across several accounts** (`pillar3aTranches`) closed in
separate calendar years, the standard "gestaffelter Bezug" that breaks the
progression of the lump-sum capital tax — and
**Pillar 2 is settled at the PK retirement age** as one of capital / a
lifelong Rente (capital × Umwandlungssatz) / a mix (`pillar2PayoutMode`,
`pillar2CapitalShare`, `pillar2ConversionRate`; default capital, BVG-minimum
6.8 % conversion). Capital withdrawals falling in the same calendar year are
aggregated for the progressive lump-sum tax — so staggering 3a and PK across
different years lowers the bill.

### Taxes and AHV contributions

Income is taxed properly: recurring **ordinary income** (AHV + PK Rente +
portfolio dividends) is subject to the **exact federal direct tax** (direkte
Bundessteuer, ESTV 2026 tariff, single/married, embedded in `constants.ts` and
validated against the official figures) plus a **cantonal/communal** layer
(canton effective rate × a user-set **Gemeinde-Steuerfaktor**, 100 % =
canton-typical municipality). Lump-sum capital withdrawals (3a/PK) are taxed
by the cantonal capital-tax curve × the Gemeinde factor **plus** the federal
one-fifth tariff (Art. 38 DBG). The non-employed **AHV contribution**
("AHV on wealth") now includes the funds' 5 % administrative-cost surcharge.

The non-employed AHV basis is **net wealth + 20× actual pension income**
(Renteneinkommen) — a wealth-funded early retiree with no pension has a
wealth-only basis; portfolio withdrawals / spending do **not** inflate it. The
year-by-year table breaks the funding down per year (portfolio drawdown vs.
AHV vs. PK pension vs. employment), and the headline's liquid-capital tile is
labelled "Liquide Mittel bei FIRE" (it's the taxable amount available for the
bridge — the full pot composition incl. 3a/PK is shown in "Vermögen bei FIRE").

**Residual post-FIRE employment**: an optional toggle lets a single person keep
earning part-time after FIRE (`postFireIncome` until `postFireWorkUntilAge`).
The income offsets the portfolio draw and is income-taxed, and — applying the
statutory test — it **waives the non-employed AHV contribution** in years where
the employment AHV contributions (10.6 %) reach at least half of what would
otherwise be due. (For couples this is already covered by the spouse-working
exemption in the household engine.)

The ESTV API (swisstaxcalculator.estv.admin.ch) was used to source the exact
federal tariff and is reachable for the per-municipality cantonal scales +
Steuerfüsse; reproducing every canton's cantonal/communal tariff and the
canton-specific capital-payout rules exactly is a documented next step — for
now the cantonal layer is the seeded effective-rate model scaled by the
Gemeinde factor, and deductions/church tax are not modelled (slightly
conservative). Use the ESTV calculator for exact municipal figures.

The results carry two charts: a **balance chart** (unstacked lines per
pot — total, taxable, 3a, PK — with FIRE / PK / 3a / AHV milestone
markers, in real terms) and a **Mittelverwendung-pro-Jahr** chart showing
annual outflows (living costs, AHV contributions, taxes) plus the AHV
pension line. The engine stays real-terms; an `inflation` input reflates
the annual-outflow chart to **nominal** francs so rising costs are visible.

Couples can be modelled as a **household** (`hasPartner` + a `partner`
profile). The partner gets their own salary, savings, Säule 3a, Pensionskasse
and AHV, and their own retirement age — so each person can stop working on a
different timeline. When a partner is added, the wizard's "Vermögen &
Einkommen" and "Ruhestand" steps switch to a **two-column Sie / Partner:in
layout** (with a combined household net-worth banner) so both people's inputs
sit side by side; the single-person layout is unchanged when there is no
partner. This runs a dedicated calendar-timeline simulator
(`lib/engine/household.ts`) instead of the single-person accumulation +
decumulation split: every year, each person is either working (earning,
contributing to their own pillars, adding savings to the shared taxable pot)
or retired (pillars settle at their own unlock ages, AHV from their own claim
age). The shared taxable account and living costs are household-level. Key
points modelled:

- The **non-employed AHV contribution** ("AHV on wealth" when you have no
  earned income) is charged per person to a retiree below their AHV reference
  age — but a partner who is still working **exempts** the other (the
  statutory Nichterwerbstätigen spouse exemption); when both are retired and
  below reference age, both owe it on the married (halved) basis.
- Same-year capital withdrawals by either partner are aggregated for the
  progressive lump-sum tax (joint assessment of married couples).

Both people support **age-banded income phases** and **auto-estimates**
(`partner:`-namespaced estimable keys), and the household has its own **Monte
Carlo** path (calendar-timeline, indexed from today). The combined AHV is
**plafoniert** — when both spouses draw a pension it is capped at 150% of the
maximum single pension. Remaining household simplifications: market
assumptions (returns, 3a/PK interest, inflation, canton) are shared; the
spouse AHV exemption is coarse (a still-working partner exempts the other
regardless of the exact 2×-minimum test); and charts/markers are anchored to
the primary person's age axis. Note the household engine applies the annual
wealth/dividend tax during the accumulation years too, which the single-person
accumulation engine omits — a small known inconsistency.

The Pensionskasse (Pillar 2) projection is income-driven and configurable
via an optional `pillar2Plan`: either the statutory **BVG minimum**
(age-banded 7–18 % credits) or an **average savings rate** on the insured
salary, with an adjustable insured-salary ceiling (to model
super-mandatory coverage of higher incomes) and an average PK interest
rate. The PK contribution scales with the salary trajectory each year. The
new `insuredSalary()` helper generalises `coordinatedSalary()` to a
configurable ceiling; defaults reproduce the mandatory BVG behaviour
exactly (so existing golden tests are unchanged).

Phase 7 applies the **"Private Dossier"** design system — a restrained,
editorial private-bank aesthetic. Design tokens (ink / porcelain / paper /
brass + petrol/steel/stone data palette, hairline rules) live as a Tailwind
v4 `@theme` block in `app/globals.css`; type roles are Spectral (serif
headlines), Inter (body/UI), and IBM Plex Mono (all numbers, eyebrows,
labels) loaded via `next/font`. The layout frames the page in an ink
masthead and ink2 footer; the wizard sits in an "instrument" card
overlapping the masthead; results lead with mono KPI tiles (one inverted to
ink) plus a stacked `LedgerBar` of capital composition. Charts are themed
end-to-end (mono ticks, horizontal hairlines only, a custom ink tooltip).
Brass is used sparingly as the single accent; semantic color (petrol =
positive, brass = caution) replaces generic green/red. Swiss currency
formatting (`CHF 50’000`) is centralised in `lib/format.ts`. Motion is one
orchestrated entrance per screen, disabled under `prefers-reduced-motion`.
`tsc --noEmit`, `eslint`, `vitest run` (29 tests), and `next build` all pass.

Phase 5 (SEO + a11y) is built: `app/robots.ts`, `app/sitemap.ts`,
canonical/OpenGraph/Twitter metadata and `WebApplication` JSON-LD in the
layout, an educational `/ratgeber` content page with `FAQPage` +
`BreadcrumbList` structured data, a skip link, `role="img"` chart
descriptions, `aria-pressed` mode toggles, labelled number inputs, and
`rel="sponsored"` on affiliate links. `next build` prerenders all routes
statically; `tsc --noEmit`, `eslint`, and `vitest run` (29 tests) pass.
The canonical base URL comes from `NEXT_PUBLIC_SITE_URL` (localhost
fallback) — set it to the real domain on deploy.

Scenarios are **shareable/bookmarkable**: the "Szenario teilen" button encodes
the full input state (inputs + auto-estimate flags) into the URL hash
(base64url of JSON, `lib/share.ts`) and copies the link. Loading such a URL
restores the scenario on mount. This is entirely client-side — no financial
figures are sent anywhere — and decoding merges over defaults so older links
survive added fields.

Not yet done: i18n beyond German (the UI is German-only for now).

Per-municipality: a **Gemeinde selector** (`lib/municipalities.ts`, all 2,110
municipalities) sets the tax level from the **real ESTV 2026 municipal
Steuerfüsse** — `factor = (cantonRate + communalRate) / (cantonRate +
capitalCommunalRate)`, i.e. the municipality's cantonal+communal tax relative
to the cantonal capital (capital = 1.0). Picking your Gemeinde scales the
cantonal income/wealth/capital tax exactly; the federal tax is unaffected.

Notes on data still needing real grounding:
- Cantonal **income, wealth and capital** tax are real ESTV 2026 data, refined
  per municipality via the real Steuerfuss factor above. Remaining
  simplifications: church tax is not modelled, and the income curve uses
  pension income type for the whole ordinary-income base (incl. dividends).
- The Monte Carlo `historical` mode is now calibrated to real, cited Pictet
  long-run Swiss equity/bond statistics (`MARKET` in `constants.ts`); the
  former synthetic placeholder series has been removed. It models returns
  parametrically from those real means/volatilities (plus an assumed
  correlation) rather than resampling an actual year-by-year sequence — drop
  in a real annual series if true historical block-bootstrap is wanted.
