import { activeIncomePhase, inflowAt } from "./accumulation";
import { AHV, DEFAULTS, PILLAR_2 } from "./constants";
import type { Pillar2PayoutMode } from "./decumulation";
import { cantonalIncomeTax, cantonalWealthTax, federalCapitalTax, federalIncomeTax, insuredSalary, lumpSumTax, nonEmployedAhvContribution, retirementCreditRate } from "./tax";
import type { CantonTaxData, DecumulationYearResult, IncomePhase, OneOffInflow, Pillar2Plan } from "./types";

/**
 * One member of a household. Each person ages on their own clock and retires
 * at their own `fireAge`; their pension pillars unlock at their own ages. The
 * taxable account and living costs are shared at the household level (see
 * `HouseholdParams`), but the 3a and Pillar 2 pots are individual, as Swiss
 * law requires. All figures are real (today's purchasing power).
 */
export interface HouseholdPerson {
  label: string;
  currentAge: number;
  fireAge: number;
  /** Flat salary model: salary today + real growth while working. */
  currentSalary: number;
  salaryGrowth: number;
  /** Savings this person adds to the shared taxable account each working year. */
  annualTaxableSavings: number;
  /**
   * Optional age-banded salary/savings schedule for this person. When present
   * (non-empty), it overrides the flat salary/savings/3a fields each year —
   * exactly like the single-person accumulation engine.
   */
  incomePhases?: IncomePhase[];
  currentPillar3a: number;
  annualPillar3aContribution: number;
  pillar3aUnlockAge: number;
  pillar3aTranches: number;
  currentPillar2: number;
  pillar2Plan: Pillar2Plan;
  earliestPkAge: number;
  pillar2PayoutMode: Pillar2PayoutMode;
  pillar2CapitalShare: number;
  pillar2ConversionRate: number;
  ahvReferenceAge: number;
  ahvClaimAge: number;
  ahvAnnualPension: number;
  healthInsuranceAnnualPremium: number;
}

export interface HouseholdParams {
  primary: HouseholdPerson;
  partner: HouseholdPerson;
  /** Combined liquid (taxable) capital today. */
  startingTaxable: number;
  /** Shared household living costs (real, excl. health premiums). */
  annualRealSpending: number;
  canton: CantonTaxData;
  expectedReturn: number;
  pillar3aReturn: number;
  /** Planning horizon, on the PRIMARY person's age axis. */
  horizonAge: number;
  /** Communal tax multiplier vs. the canton baseline (1.0 = typical). See DecumulationParams. */
  gemeindeSteuerfuss?: number;
  oneOffInflows?: OneOffInflow[];
  /** Per-year real return sequence (indexed by years since today) for Monte Carlo. */
  returnsPath?: number[];
}

export interface HouseholdResult {
  /** Year-by-year household totals, indexed by the primary person's age. */
  years: DecumulationYearResult[];
  taxableAtFire: number;
  pillar3aAtFire: number;
  pillar2AtFire: number;
  bridgeCapitalRequired: number;
  failed: boolean;
  failedDuringBridge: boolean;
}

/** See decumulation.ts — symmetric early/deferred AHV adjustment (approximate). */
function adjustedAhvPension(basePension: number, claimAge: number, referenceAge: number): number {
  return basePension * (1 + (claimAge - referenceAge) * AHV.approxEarlyReductionPerYear);
}

interface PersonState {
  p: HouseholdPerson;
  pillar3a: number;
  pillar2: number;
  pillar2Settled: boolean;
  pillar2Pension: number;
  tranchesLeft: number;
  salary: number;
  /** Sorted income phases, or null when the flat salary model applies. */
  phases: IncomePhase[] | null;
}

/** This year's economics for one person (flat fields or active income phase). */
function personEconomics(s: PersonState, age: number): {
  working: boolean;
  salary: number;
  taxableSavings: number;
  pillar3aContribution: number;
} {
  const working = age < s.p.fireAge;
  const phase = s.phases ? activeIncomePhase(s.phases, age) : null;
  return {
    working,
    salary: phase ? phase.salary : s.salary,
    taxableSavings: working ? (phase ? phase.annualTaxableSavings : s.p.annualTaxableSavings) : 0,
    pillar3aContribution: working ? (phase ? phase.annualPillar3aContribution : s.p.annualPillar3aContribution) : 0,
  };
}

/**
 * Household decumulation/accumulation on a single calendar timeline.
 *
 * Each year, every person is either working (age < their fireAge) — earning a
 * salary, adding savings to the shared taxable pot, and crediting their own 3a
 * and Pillar 2 — or retired, in which case their pillars settle at their own
 * unlock ages (3a as staggered capital, Pillar 2 as capital / Rente / mix) and
 * their AHV starts at their claim age. Shared living costs and taxes are met
 * from the combined taxable account.
 *
 * The non-employed AHV contribution ("AHV on wealth") is charged to a retired
 * person below their AHV reference age — UNLESS their partner is still working
 * and covers them (the statutory Nichterwerbstätigen exemption). When both are
 * retired and below reference age, both owe it on the (married, halved) basis.
 *
 * Capital lump sums withdrawn by either partner in the same calendar year are
 * aggregated for the progressive lump-sum tax, reflecting joint assessment of
 * married couples — so staggering withdrawals across years lowers the bill.
 */
export function simulateHousehold(params: HouseholdParams): HouseholdResult {
  const years: DecumulationYearResult[] = [];
  const people = [params.primary, params.partner];

  const st: PersonState[] = people.map((p) => ({
    p,
    pillar3a: p.currentPillar3a,
    pillar2: p.currentPillar2,
    pillar2Settled: false,
    pillar2Pension: 0,
    tranchesLeft: Math.max(1, Math.floor(p.pillar3aTranches)),
    salary: p.currentSalary,
    phases: p.incomePhases && p.incomePhases.length > 0 ? [...p.incomePhases].sort((a, b) => a.fromAge - b.fromAge) : null,
  }));

  // Map a person's own age to the primary person's age axis.
  const personAgeAt = (p: HouseholdPerson, primaryAge: number) =>
    p.currentAge + (primaryAge - params.primary.currentAge);

  const firstFirePrimaryAge = Math.min(
    ...people.map((p) => params.primary.currentAge + (p.fireAge - p.currentAge)),
  );
  const firstUnlockPrimaryAge = Math.min(
    ...people.map(
      (p) => params.primary.currentAge + (Math.min(p.pillar3aUnlockAge, p.earliestPkAge) - p.currentAge),
    ),
  );

  let taxable = params.startingTaxable;
  let depleted = false;
  let failedDuringBridge = false;
  let bridgeCapitalRequired = 0;

  let taxableAtFire = taxable;
  let pillar3aAtFire = st[0].pillar3a + st[1].pillar3a;
  let pillar2AtFire = st[0].pillar2 + st[1].pillar2;

  for (let primaryAge = params.primary.currentAge; primaryAge < params.horizonAge; primaryAge++) {
    const t = primaryAge - params.primary.currentAge;

    // Capture household composition entering the primary person's FIRE year.
    if (primaryAge === params.primary.fireAge) {
      taxableAtFire = taxable;
      pillar3aAtFire = st[0].pillar3a + st[1].pillar3a;
      pillar2AtFire = st[0].pillar2 + st[1].pillar2;
    }

    // Household one-off inflows (keyed to the primary person's age). Unlike the
    // single-person path, the starting balance does not pre-include a current-age
    // inflow, so it is credited here too.
    taxable += inflowAt(params.oneOffInflows, primaryAge);

    // --- Per-person retirement settlement (capital aggregated household-wide) ---
    let capitalThisYear = 0;
    for (const s of st) {
      const age = personAgeAt(s.p, primaryAge);
      if (s.tranchesLeft > 0 && age >= s.p.pillar3aUnlockAge && s.pillar3a > 0) {
        const tranche = s.pillar3a / s.tranchesLeft;
        capitalThisYear += tranche;
        s.pillar3a -= tranche;
        s.tranchesLeft -= 1;
      }
      if (!s.pillar2Settled && age >= s.p.earliestPkAge && s.pillar2 > 0) {
        const share = s.p.pillar2PayoutMode === "capital" ? 1 : s.p.pillar2PayoutMode === "pension" ? 0 : s.p.pillar2CapitalShare;
        const pkCapital = s.pillar2 * share;
        s.pillar2Pension = (s.pillar2 - pkCapital) * s.p.pillar2ConversionRate;
        capitalThisYear += pkCapital;
        s.pillar2 = 0;
        s.pillar2Settled = true;
      }
    }

    // Couples are assessed jointly (married tariff). Cantonal/communal scaled by
    // the Gemeinde factor; federal one-fifth tariff added on the capital total.
    const gemeinde = params.gemeindeSteuerfuss ?? 1;
    let lumpSumTaxPaid = 0;
    if (capitalThisYear > 0) {
      lumpSumTaxPaid = lumpSumTax(params.canton, capitalThisYear) * gemeinde + federalCapitalTax(capitalThisYear, true);
      taxable += capitalThisYear - lumpSumTaxPaid;
    }

    // --- Incomes: AHV, PK Rente, and still-working salaries -------------------
    const econ = st.map((s) => personEconomics(s, personAgeAt(s.p, primaryAge)));
    let pillar2PensionTotal = 0;
    let workingSavings = 0;
    const ahvEach: number[] = [];
    const working = st.map((s, i) => {
      const age = personAgeAt(s.p, primaryAge);
      ahvEach.push(age >= s.p.ahvClaimAge ? adjustedAhvPension(s.p.ahvAnnualPension, s.p.ahvClaimAge, s.p.ahvReferenceAge) : 0);
      pillar2PensionTotal += s.pillar2Pension;
      workingSavings += econ[i].taxableSavings;
      return econ[i].working;
    });
    // AHV couple plafonierung: when both spouses draw a pension, their combined
    // AHV is capped at 150% of the maximum single pension.
    let ahvPensionTotal = ahvEach[0] + ahvEach[1];
    if (ahvEach[0] > 0 && ahvEach[1] > 0) {
      ahvPensionTotal = Math.min(ahvPensionTotal, AHV.coupleMaxPensionFactor * AHV.maxAnnualPension);
    }
    const pensionIncome = ahvPensionTotal + pillar2PensionTotal;

    // --- Non-employed AHV ("AHV on wealth") per person ------------------------
    // A retired person below their AHV reference age owes it, unless the
    // partner is still working (and thus covers the household) — the statutory
    // spouse exemption.
    let nonEmployedContribution = 0;
    const someoneWorking = working.some(Boolean);
    if (!someoneWorking) {
      // Basis = net wealth + 20× actual pension income (Renteneinkommen);
      // portfolio withdrawals / spending do not count.
      for (const s of st) {
        const age = personAgeAt(s.p, primaryAge);
        const retired = age >= s.p.fireAge;
        if (retired && age < s.p.ahvReferenceAge) {
          nonEmployedContribution += nonEmployedAhvContribution(Math.max(0, taxable), pensionIncome, "married");
        }
      }
    }

    // --- Cash flow on the shared taxable account ------------------------------
    // While anyone is still working, their salary covers the household's living
    // costs and the surplus (annualTaxableSavings, plus any already-retired
    // partner's pension) is added to the pot — this is the accumulation phase.
    // Once both are retired, living costs are drawn from the portfolio net of
    // pensions and the non-employed AHV contribution.
    const spend = params.annualRealSpending + s0health(st);
    let netCashNeed: number;
    if (someoneWorking) {
      netCashNeed = -(workingSavings + pensionIncome);
    } else {
      netCashNeed = spend + nonEmployedContribution - pensionIncome;
      if (primaryAge < firstUnlockPrimaryAge) {
        const discountYears = Math.max(0, primaryAge - firstFirePrimaryAge);
        bridgeCapitalRequired += Math.max(0, netCashNeed) / Math.pow(1 + params.expectedReturn, discountYears);
      }
    }

    taxable -= netCashNeed;
    if (taxable < 0) {
      depleted = true;
      if (primaryAge < firstUnlockPrimaryAge) failedDuringBridge = true;
      taxable = 0;
    }

    // Recurring income tax on the household's ordinary income (AHV + PK Rente +
    // portfolio dividends): joint federal direct tax + cantonal/communal.
    const dividendIncome = Math.max(0, taxable) * DEFAULTS.dividendYield;
    const ordinaryIncome = pensionIncome + dividendIncome;
    const divTax =
      federalIncomeTax(ordinaryIncome, true) + cantonalIncomeTax(params.canton, ordinaryIncome, true) * gemeinde;
    const wTax = cantonalWealthTax(params.canton, Math.max(0, taxable), true) * gemeinde;
    taxable -= divTax + wTax;
    if (taxable < 0) {
      depleted = true;
      if (primaryAge < firstUnlockPrimaryAge) failedDuringBridge = true;
      taxable = 0;
    }

    // --- Growth, working contributions, and salary progression ----------------
    const yearReturn = params.returnsPath?.[t] ?? params.expectedReturn;
    taxable *= 1 + yearReturn;

    st.forEach((s, i) => {
      const age = personAgeAt(s.p, primaryAge);
      const e = econ[i];
      s.pillar3a = s.pillar3a * (1 + params.pillar3aReturn) + e.pillar3aContribution;

      const interest = s.p.pillar2Plan.interestRate;
      let credit = 0;
      if (e.working) {
        const ceiling = s.p.pillar2Plan.model === "rate" ? s.p.pillar2Plan.insuredCeiling : PILLAR_2.upperInsuredSalaryLimit;
        const insured = insuredSalary(e.salary, ceiling);
        const rate = s.p.pillar2Plan.model === "rate" ? s.p.pillar2Plan.savingsRate : retirementCreditRate(age + 1);
        credit = insured * rate;
        // Flat model advances the tracked salary; phase model reads the phase each year.
        if (!s.phases) s.salary *= 1 + s.p.salaryGrowth;
      }
      s.pillar2 = s.pillar2 * (1 + interest) + credit;
    });

    years.push({
      age: primaryAge,
      taxableBalance: taxable,
      pillar3aBalance: st[0].pillar3a + st[1].pillar3a,
      pillar2Balance: st[0].pillar2 + st[1].pillar2,
      spend,
      ahvNonEmployedContribution: nonEmployedContribution,
      dividendTax: divTax,
      wealthTax: wTax,
      lumpSumTax: lumpSumTaxPaid,
      ahvPension: ahvPensionTotal,
      pillar2Pension: pillar2PensionTotal,
      employmentIncome: 0,
      netWithdrawal: netCashNeed,
      depleted,
    });

    if (depleted) break;
  }

  return {
    years,
    taxableAtFire,
    pillar3aAtFire,
    pillar2AtFire,
    bridgeCapitalRequired: Math.max(0, bridgeCapitalRequired),
    failed: depleted,
    failedDuringBridge,
  };
}

/** Combined health-insurance premium for both household members. */
function s0health(st: PersonState[]): number {
  return st.reduce((sum, s) => sum + s.p.healthInsuranceAnnualPremium, 0);
}
