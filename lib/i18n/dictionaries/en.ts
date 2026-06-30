import type { Dictionary } from "@/lib/i18n/dictionaries";

/**
 * English dictionary. Must match the shape of the canonical German dictionary
 * (de.ts) — the `: Dictionary` annotation enforces it at compile time. Swiss
 * pension terms (AHV, BVG, Pensionskasse, Säule 3a) are kept as proper nouns,
 * as is usual in Swiss English, with the surrounding prose translated.
 */
export const en: Dictionary = {
  common: {
    skipToContent: "Skip to main content",
    brandKicker: "Swiss FIRE",
    tagline: "Early retirement in Switzerland, fully worked out.",
    ctaCalc: "Run the numbers",
    menu: "Menu",
    you: "You",
    partner: "Partner",
    nav: {
      rechner: "Calculator",
      blog: "Blog",
      ratgeber: "Guide",
      ueberUns: "About",
    },
    legal: {
      impressum: "Legal notice",
      datenschutz: "Privacy",
    },
    footer: {
      blurb:
        "The independent Swiss calculator for early retirement — the bridge phase, your pension pillars and real taxes, transparently worked out.",
      navHeading: "Navigation",
      legalHeading: "Legal",
      disclaimer:
        "For educational purposes only. Not financial, tax or investment advice. All tax figures are estimates without warranty. Calculations run locally in your browser; no inputs are sent to a server.",
      rights: "All rights reserved.",
    },
    langSwitch: "Change language",
    disclaimer: {
      title: "Not financial advice",
      body:
        "This tool is for educational purposes only. It provides no personal financial, tax or investment advice and no recommendation. All outputs are based solely on the assumptions you enter — “here is the maths based on your figures”, not “this is what you should do”. All tax figures are estimates — please verify them with the official ESTV or cantonal tax calculator. Your inputs stay entirely within your browser and are never sent to a server.",
    },
  },

  meta: {
    titleDefault: "Pillar Zero | Early retirement & Swiss pensions",
    titleTemplate: "%s | Pillar Zero",
    description:
      "Pillar Zero is the free Swiss calculator for early retirement: the bridge phase, Säule 3a, Pensionskasse, AHV and real ESTV taxes per municipality. An educational tool, not financial advice — every calculation runs locally in your browser.",
    keywords: [
      "FIRE Switzerland",
      "early retirement",
      "bridge phase",
      "Säule 3a",
      "Pensionskasse",
      "BVG",
      "AHV",
      "lump-sum withdrawal tax",
      "financial independence",
    ],
  },

  home: {
    meta: {
      title: "Calculate early retirement in Switzerland",
      description:
        "In four steps, Pillar Zero shows whether your capital is enough for early retirement — the bridge phase, Säule 3a, Pensionskasse, AHV and real ESTV taxes per municipality. Free and private.",
    },
    hero: {
      kicker: "Pillar Zero · Swiss FIRE",
      h1: "Is your capital enough for early retirement?",
      body:
        "Pillar Zero works out the bridge between your exit and the moment you can draw on Säule 3a, Pensionskasse and AHV — including real ESTV taxes for your municipality. In four steps, free and entirely private.",
      ctaPrimary: "Run the numbers, free →",
      ctaSecondary: "Read the guide",
      note: "Educational tool, not financial advice · no sign-up · your inputs never leave your browser",
    },
    problem: {
      kicker: "The problem",
      h2: "Your pension capital is locked away — exactly when you need it.",
      body:
        "Retire early and you have to bridge the years until 58–65, before the three pillars kick in. This bridge phase decides whether early retirement holds up.",
      cards: [
        {
          k: "Bridge phase",
          v: "Exit → 58/60",
          d: "Only your freely available wealth is at hand. Säule 3a and the Pensionskasse are locked.",
        },
        {
          k: "Pension withdrawal",
          v: "from 58–60",
          d: "Pensionskasse and Säule 3a become accessible — staggered carefully, that saves tax.",
        },
        {
          k: "AHV",
          v: "from 63–65",
          d: "The AHV pension begins and reduces what you need to draw from your own wealth.",
        },
      ],
    },
    features: {
      kicker: "What Pillar Zero calculates",
      h2: "Everything that defines Swiss early retirement.",
      items: [
        {
          title: "Bridge capital",
          body: "How much liquid wealth you need to bridge the years until your first pension withdrawal.",
        },
        {
          title: "Real taxes per municipality",
          body: "Income, wealth and capital tax with real 2026 ESTV figures — for each of the 2,110 municipalities.",
        },
        {
          title: "Säule 3a · PK · AHV",
          body: "Staggered 3a withdrawals, Pensionskasse as capital or pension, early AHV draw and the AHV contributions on wealth.",
        },
        {
          title: "Monte Carlo with real data",
          body: "How robust is the plan? A simulation based on real Swiss equity and bond returns since 1900.",
        },
        {
          title: "For couples too",
          body: "Two profiles with their own exit age and pensions — worked out as a household, including the AHV ceiling.",
        },
        {
          title: "Local & private",
          body: "Every calculation runs in your browser. No inputs are ever sent to a server.",
        },
      ],
    },
    steps: {
      kicker: "How it works",
      h2: "Four steps to your answer.",
      cta: "Open the calculator →",
      items: [
        { n: "01", title: "About you", body: "Age, planned exit age, canton and municipality." },
        { n: "02", title: "Wealth & income", body: "Portfolio, Säule 3a, Pensionskasse, salary and savings rate." },
        { n: "03", title: "Retirement", body: "Spending, pensions, withdrawal age and how you draw your pension." },
        { n: "04", title: "Result", body: "Is the capital enough? With a timeline, taxes and a year-by-year view." },
      ],
    },
    blogTeaser: {
      kicker: "From the blog",
      h2: "Know-how for early retirement.",
      all: "All articles →",
      readingSuffix: "min read",
    },
    faq: {
      kicker: "Frequent questions",
      h2: "Good to know.",
      items: [
        {
          q: "What does Pillar Zero cost?",
          a: "Nothing. The calculator is free and needs no sign-up. There is no paid version.",
        },
        {
          q: "Are my inputs stored?",
          a: "No. All calculations run locally in your browser. No financial data is sent to a server.",
        },
        {
          q: "How accurate are the taxes?",
          a: "The capital, income and wealth taxes are based on real figures from the official ESTV tax calculator (2026), scaled per municipality. The federal direct tax is computed with the exact tariff. Some simplifications remain (e.g. deductions) — the figures are estimates without warranty.",
        },
        {
          q: "Is this financial advice?",
          a: "No. Pillar Zero is an educational tool. It does not replace personal financial, tax or pension advice.",
        },
      ],
    },
    finalCta: {
      h2: "Work out your own bridge.",
      body: "Free, in a few minutes, without your inputs leaving your browser.",
      cta: "Get started →",
    },
  },

  calculator: {
    meta: {
      title: "Bridge calculator — work out early retirement",
      description:
        "In four steps, work out whether your capital is enough for early retirement: the bridge phase, Säule 3a, Pensionskasse, AHV and real ESTV taxes per municipality. Free, locally in your browser.",
      ogTitle: "Bridge calculator — work out early retirement",
    },
    jsonLdName: "Pillar Zero bridge calculator",
    formHero: {
      kicker: "Swiss early retirement · bridge calculation",
      h1: "Is your capital enough to reach your pension?",
      body:
        "Four steps to the bridge calculation between early retirement and access to Säule 3a, Pensionskasse and AHV — including a tax estimate per canton.",
    },
    nav: { back: "← Back", next: "Next →", compute: "Calculate result →" },
    formFootnote: "Educational tool, not financial advice. All calculations run locally in your browser.",
    results: {
      kicker: "Dossier · Result",
      h1: "Your bridge calculation",
      share: "Share scenario",
      shareDone: "Link copied ✓",
      edit: "Edit inputs",
    },
    sections: {
      capital: "Wealth at FIRE",
      timeline: "Timeline",
      balance: "Wealth over time",
      outflow: "Annual use of funds",
      monteCarlo: "Monte Carlo",
      yearTable: "Year by year",
      assumptions: "Assumptions & sources",
      providers: "Providers",
    },
    capital: {
      body:
        "How your projected wealth at exit is made up. During the bridge phase only the taxable wealth is available — Säule 3a and the Pensionskasse are locked until the withdrawal age.",
      segTaxable: "Taxable",
      seg3a: "Säule 3a",
      segPk: "Pensionskasse",
    },
    balance: {
      partnerNote:
        "Shown is the combined household wealth on your age axis. Milestones marked “·P” belong to your partner (in steel); your own are in brass/grey.",
    },
    outflow: {
      body:
        "How much money is spent each year in retirement and where it comes from. By default in today's purchasing power (real) — all calculations run in real terms, so inflation only affects the optional nominal view. From the moment it starts, the AHV pension reduces what you draw yourself.",
    },
    monteCarlo: {
      groupAria: "Monte Carlo mode",
      off: "Off",
      parametric: "Parametric",
      historical: "Historical",
      intro: "How robust is the plan against fluctuating returns?",
      introHistorical:
        " The historical mode draws returns from real long-run figures — Swiss equities & bonds (Pictet) and global equities (UBS/DMS) — blended by your equity share and your Swiss/global split.",
      introParametric: " The parametric mode uses your expected return and volatility (log-normal).",
    },
    yearTable: {
      body:
        "Every year in detail — wealth per pot, pensions, AHV contributions and taxes. Exportable as CSV for further work in a spreadsheet.",
    },
    barista: {
      kicker: "The AHV hack",
      heading: "Barista-FIRE: side-stepping the AHV on wealth",
      intro:
        "Retire early with no earned income and you pay AHV based on your wealth until the reference age. A small side job can waive that contribution — but only if its AHV contributions (10.6%) reach at least half of what you'd otherwise owe (the statutory half rule). That's exactly what this works out, honestly.",
      tileExposure: "AHV on wealth (bridge)",
      tileExposureNote: "up to {peak}/year",
      tileBreakEven: "Side-job income needed",
      tileBreakEvenNote: "to waive it entirely",
      tileSaved: "Saved by this",
      tileAtStake: "At stake",
      verdictOff:
        "A side job earning at least {breakEven}/year makes this wealth-based AHV disappear entirely. Turn on Barista-FIRE in the “Retirement” step to work it through.",
      verdictShort:
        "Your side job ({income}) isn't quite enough yet: to waive the wealth-based AHV in the most expensive bridge years you'd need to earn at least {breakEven}/year.",
      verdictCoveredFull: "✓ Your side job waives the entire wealth-based AHV across the bridge — about {savings} saved.",
      verdictCoveredPartial:
        "✓ Your side job waives part of the wealth-based AHV (about {savings}); in the wealthiest years the income doesn't quite reach the threshold.",
      ruleNote:
        "Worked out honestly: the popular “CHF 514 is enough” claim only holds at modest wealth. What counts is the half rule (Art. 28bis AHVV) — with high wealth it takes a correspondingly higher side income.",
      householdNote:
        "In a household, each person's side job waives only their own wealth contribution (no mutual cover). Shown is the combined wealth-based AHV across the bridge.",
    },
    compare: {
      pin: "Compare",
      exit: "End comparison",
      editB: "Edit scenario B",
      kicker: "Scenarios A/B",
      heading: "Scenario comparison",
      subtitle:
        "A is pinned. Use “Edit inputs” to change your plan (e.g. FIRE age, canton, PK withdrawal, Barista-FIRE) — B updates while A stays for comparison.",
      identical:
        "A and B are identical. Use “Edit inputs” to change a value (e.g. FIRE age or withdrawal type) to see the difference.",
      clear: "Remove comparison",
      metric: "Metric",
      colA: "A (pinned)",
      colB: "B (current)",
      colDelta: "Δ (B − A)",
      verdict: "Verdict",
      ok: "✓ Sufficient",
      notOk: "✗ Insufficient",
      never: "—",
      years: "yrs",
      bridge: "Bridge capital needed",
      liquid: "Liquid funds at FIRE",
      buffer: "Buffer / gap",
      mc: "Monte Carlo success",
      depletion: "Wealth depleted at",
      finalWealth: "Wealth at horizon",
      lifetimeTax: "Taxes (cumulative)",
      lifetimeAhv: "AHV on wealth (cumulative)",
      chartLabel: "Total wealth over time",
    },
  },

  wizard: {
    progressAria: "Progress",
    units: { years: "yrs", perYear: "/year", accounts: "accounts", chf: "CHF" },
    field: {
      estimatedOn: "Estimated ●",
      estimatedOff: "Estimate ○",
      toggleAria: "Estimate {label} automatically",
    },
    estimateLabels: {
      horizonAge: "Default planning horizon (95).",
      ahvReferenceAge: "Statutory reference age (65).",
      ahvClaimAge: "Assumed drawn at the reference age.",
      pillar3aUnlockAge: "5 years before the reference age.",
      earliestPkAge: "Typical earliest PK withdrawal (58).",
      ahvAnnualPension: "Estimated from reference age & marital status — please check against your AHV statement.",
      annualPillar3aContribution: "Maximum contribution with a Pensionskasse.",
      healthInsuranceAnnualPremium: "A rough flat figure per person.",
      pillar2ConversionRate: "BVG minimum 6.8%, trimmed by ~0.1pp per year of early draw — an approximation, check your scheme.",
      expectedReturn: "Computed from your allocation & real long-run figures (Pictet/UBS).",
      volatility: "Portfolio volatility computed from the allocation (real figures).",
    },
    incomePhases: {
      phaseLabel: "Phase {n} · age {start}–{end}",
      fireEnd: "FIRE ({age})",
      remove: "Remove",
      fromAge: "From age",
      grossSalary: "Gross salary",
      taxableSavings: "Savings (taxable)",
      contribution3a: "3a contribution",
      add: "+ Add phase",
    },
    oneOff: {
      empty: "No inflows yet. Add, for example, an expected inheritance or a property sale.",
      label: "Inflow {n}",
      remove: "Remove",
      atAge: "At age",
      amount: "Amount",
      add: "+ Add inflow",
    },
    steps: {
      you: {
        title: "About you",
        subtitle: "When do you exit, and where do you live?",
        currentAge: "Current age",
        fireAge: "FIRE age (exit)",
        horizonAge: "Planning horizon",
        horizonHint: "Up to what age should the money last?",
        maritalStatus: "Marital status",
        single: "Single",
        married: "Married",
        canton: "Tax canton",
        cantonHint: "Income, wealth and capital tax: real 2026 ESTV figures.",
        gemeinde: "Municipality",
        gemeindeHint:
          "Real 2026 ESTV tax multipliers; in % of the cantonal capital. Scales the cantonal/communal taxes exactly to your municipality.",
        confession: "Confession (church tax)",
        confessionNone: "None / no confession",
        confessionProtestant: "Protestant Reformed",
        confessionRoman: "Roman Catholic",
        confessionHint:
          "If you are a church member, your municipality's church tax is added (real ESTV multiplier).",
        planTogether: "Plan together",
        planTogetherAria: "Household with a partner",
        alone: "Alone",
        withPartner: "With a partner",
        partnerAge: "Partner's age",
        partnerFireAge: "Partner's FIRE age",
        partnerIntro:
          "Include a second person with their own salary, own pillars and own exit age. Wealth and living costs are then calculated as a household.",
      },
      wealth: {
        title: "Wealth & income",
        subtitle: "Current balances plus salary and savings rate until exit.",
        householdBanner: "Household wealth today",
        taxableNow: "Taxable wealth today",
        pillar3aNow: "Säule 3a balance today",
        pillar2Now: "Pensionskasse balance today",
        salarySavings: "Salary & savings",
        incomeModeAria: "Income mode {who}",
        constant: "Constant",
        phases: "Phases",
        phasesLong: "By age phases",
        grossSalary: "Gross salary",
        salaryGrowth: "Salary growth (real)",
        taxableSavings: "Savings (taxable)",
        contribution3a: "3a contribution",
        pkBuildupShort: "PK build-up",
        pkBuildup: "Pensionskasse build-up",
        pkModelAria: "Pensionskasse model {who}",
        pkModelAriaSingle: "Pensionskasse model",
        bvgMin: "BVG minimum",
        avgContribution: "Avg. contribution",
        avgPkContribution: "Avg. PK contribution",
        avgPkContributionHint: "Share of the insured salary per year.",
        insuredCeiling: "Salary insured up to",
        insuredCeilingHint: "Your fund insures up to this salary — above 90,720 only with supplementary cover.",
        pkRateNote:
          "An average annual savings contribution (employee + employer) as a % of the insured salary — scaled together with income.",
        pkBvgNote:
          "Statutory retirement credits (7–18% by age) on the insured salary. For higher incomes with supplementary cover, choose “Avg. contribution”.",
        incomePhasesNote:
          "Define salary and savings rate per age phase — ideal when your income rises sharply over the years.",
        incomeSimpleNote:
          "A constant salary with real growth (see fine-tuning). For sharply rising incomes switch to “By age phases”.",
        otherWealthHousehold: "Other net wealth (household)",
        otherWealth: "Other net wealth",
        otherWealthHint:
          "E.g. property minus mortgage. Counts for wealth tax & AHV on wealth, but is not liquid.",
        oneOffHeading: "One-off inflows (e.g. inheritance)",
        oneOffNoteHousehold:
          "Optional one-off amounts credited to the shared taxable wealth at a given age (on the first person's age axis).",
        oneOffNote:
          "Optional one-off amounts credited to the taxable wealth at a given age.",
      },
      retirement: {
        title: "Retirement",
        subtitle: "Spending, pensions and when each pillar becomes available.",
        livingHousehold: "Living costs (household)",
        livingHouseholdHint: "Shared spending in today's purchasing power (health insurance per person separately below).",
        living: "Living costs",
        livingHint: "In today's purchasing power.",
        healthPremium: "Health insurance premium",
        ahvPension: "Expected AHV pension",
        ahvPensionHint: "For married couples the sum of both pensions is capped at 150% of the maximum pension.",
        ahvClaimAge: "Draw AHV from",
        ahvReferenceAge: "AHV reference age",
        pillar3aUnlock: "Säule 3a available from",
        pillar3aTranches: "Säule 3a accounts (staggered)",
        pillar3aTranchesHint:
          "Spread across several 3a accounts and drawn in separate years — this breaks the progression of the lump-sum withdrawal tax.",
        earliestPk: "Pensionskasse available from",
        pkPayout: "Pensionskasse withdrawal",
        pkPayoutAria: "Pensionskasse withdrawal type {who}",
        pkPayoutAriaSingle: "Pensionskasse withdrawal type",
        capital: "Capital",
        pension: "Pension",
        mixed: "Mixed",
        conversionRate: "Conversion rate",
        conversionRateHint: "BVG minimum 6.8%; often lower for supplementary cover.",
        capitalShare: "Capital share",
        capitalShareHint: "Share taken as capital; the rest is annuitised.",
        payoutNoteCapital:
          "The whole PK balance is taken as capital (once, at the reduced capital tax rate) and moved into your freely available wealth.",
        payoutNotePension:
          "The whole PK balance is converted into a lifelong pension (balance × conversion rate per year). The pension is taxable income.",
        payoutNoteMixed:
          "Part is taken as capital, the rest annuitised. By law at least 25% can be taken as capital.",
        payoutNote3a: " Säule 3a is always drawn as capital by law.",
        postFire: "Still working after exit?",
        postFireAria: "Employment after FIRE",
        no: "No",
        partTime: "Part-time / mandates",
        postFireNote:
          "If you still earn enough after exit, you pay no non-employed AHV (“AHV on wealth”): if your AHV contributions from employment (10.6%) are at least half of the otherwise-due non-employed contribution, the latter falls away. Earned income also reduces the capital you draw and is taxed as income.",
        postFireIncome: "Earned income (gross)",
        postFireUntil: "Working until age",
        barista: "Barista-FIRE: a small side job?",
        baristaAria: "Barista-FIRE side job",
        baristaYes: "Yes, a side job",
        baristaNote:
          "The well-known “Sackgeld-Job” lever: a small side job can waive the non-employed AHV (“AHV on wealth”) — but only if its AHV contributions (10.6%) reach at least half of the contribution you'd otherwise owe. With a lot of wealth, that takes a higher income than is often claimed.",
        baristaIncome: "Side-job income (gross)",
        baristaIncomeHint:
          "Applies from early retirement until the AHV reference age. The result shows whether it actually waives the wealth-based AHV.",
        baristaIncomeHintHousehold:
          "This person's side job until the reference age (0 = none). Waives only their own wealth contribution (the half rule).",
      },
      assumptions: {
        title: "Fine-tuning",
        subtitle: "Optional — sensible defaults are already set.",
        expectedReturn: "Expected real return",
        expectedReturnHint: "Real portfolio return (real, after inflation).",
        volatility: "Volatility",
        volatilityHint: "For the Monte Carlo simulation.",
        equityShare: "Equity share",
        equityShareHint: "Equities vs. bonds. Also drives the estimated return & volatility.",
        swissShare: "Swiss share of equities",
        swissShareHint: "E.g. 40% Swiss / 60% global. The rest = global equities (real figures Pictet & UBS/DMS).",
        return3a: "Säule 3a return",
        pkInterest: "PK interest",
        pkInterestHint: "Avg. interest on the PK balance.",
        salaryGrowth: "Salary growth (real)",
        inflation: "Inflation",
        inflationHint: "Only for the nominal display of annual spending.",
      },
    },
  },

  charts: {
    realNominal: {
      real: "Real",
      nominal: "Nominal",
      realCaption: "in today's purchasing power (real)",
      nominalCaption: "nominal, incl. {pct}% inflation",
      toggleAria: "Real or nominal display",
    },
    outflow: {
      caption: "Annual use of funds",
      imgAlt:
        "Stacked bar chart of annual spending (living costs, AHV contributions, taxes), with the AHV pension and — if annuitised — the PK pension as lines.",
      living: "Living costs",
      ahvContrib: "AHV contributions",
      taxes: "Taxes",
      ahvPension: "AHV pension",
      pkPension: "PK pension",
    },
    balance: {
      caption: "Wealth per pot",
      imgAlt:
        "Line chart of total wealth as well as taxable wealth, Säule 3a and the Pensionskasse over time, with markers for FIRE and the PK, 3a and AHV withdrawals.",
      total: "Total",
      taxable: "Taxable",
      pillar3a: "Säule 3a",
      pillar2: "Pensionskasse",
    },
    fan: {
      imgAlt:
        "Fan chart of the Monte Carlo simulation with the median and the range between the 10th and 90th percentile of taxable wealth over time.",
      p90: "90th percentile",
      median: "Median",
      p10: "10th percentile",
      band: "10th–90th percentile",
      ageLabel: "Age {age}",
    },
    yearTable: {
      caption: "Year by year",
      csv: "CSV",
      csvFilename: "pillar-zero-year-by-year.csv",
      headers: {
        age: "Age",
        total: "Total",
        taxable: "Taxable",
        pillar3a: "3a",
        pillar2: "PK",
        ahvPension: "AHV pension",
        pkPension: "PK pension",
        employment: "Earned",
        withdrawal: "Portfolio draw",
        ahvContrib: "AHV contr.",
        taxes: "Taxes",
      },
      footnotePrefix: "Where the funds come from each year: living costs are covered from the ",
      footnoteWithdrawal: "portfolio draw",
      footnoteSuffix:
        " (drawn from invested wealth), the AHV pension, the PK pension and any earned income. “Taxes” covers income, wealth and lump-sum withdrawal tax (federal + canton/municipality). Amounts are rounded; the CSV file contains the full values.",
    },
  },

  results: {
    verdict: "Verdict",
    enough: "● Sufficient",
    notEnough: "● Not yet sufficient",
    headlineFeasible: "Your capital is enough for early retirement.",
    headlineBridgeFail: "Your capital is not yet enough for early retirement.",
    headlineHorizonFail: "Your capital is enough — but not to the planning horizon.",
    detailSurplus:
      "Your taxable wealth at FIRE exceeds the bridge requirement by {amount}. The plan holds to the planning horizon.",
    detailFeasibleNoSurplus:
      "The plan holds to the planning horizon — even though pension capital is drawn early to get there.",
    detailBridgeFail:
      "About {amount} is missing until the first pension withdrawal. Until then, everything must come from your taxable wealth.",
    detailHorizonFail: "The bridge phase is covered, but the wealth runs out before the planning horizon.",
    tileBridgeNeed: "Bridge capital needed",
    tileLiquid: "Liquid funds at FIRE",
    tileBuffer: "Buffer",
    tileGap: "Gap",
    tileMonteCarlo: "Monte Carlo success",
    tileCoverage: "Bridge coverage",
  },

  lifeline: {
    today: "Today",
    fire: "FIRE",
    unlock3a: "3a free",
    unlockPk: "PK free",
    ahvClaim: "AHV draw",
    horizon: "Horizon",
    bridgeTitle: "Bridge phase: no pension access",
    footnote:
      "Brass marks the bridge phase ({fire}–{unlock}): spending must be covered entirely from taxable wealth, since Säule 3a and the Pensionskasse are still locked.",
  },

  assumptions: {
    pillar3a: {
      title: "Säule 3a",
      maxContribution: "Max. contribution (with PK)",
      earliest: "Earliest possible withdrawal",
      earliestValue: "Reference age − {years} years",
      staggered: "Staggered withdrawal",
      staggeredValue: "one account per year",
      staggeredNote:
        "Drawing several 3a accounts in separate calendar years breaks the progression of the lump-sum withdrawal tax.",
    },
    pillar2: {
      title: "Pensionskasse (BVG minimum)",
      coordination: "Coordination deduction",
      minInterest: "Minimum interest rate",
      minConversion: "Minimum conversion rate",
      earliestAge: "Earliest withdrawal age (default)",
      earliestAgeNote: "Depends on the scheme, individually configurable.",
      payout: "Withdrawal",
      payoutValue: "Capital / pension / mixed",
      payoutNote:
        "Säule 3a is drawn as capital by law; the PK as capital, a lifelong pension (balance × conversion rate) or a mix. Pension income (AHV + PK) is taxed as income (see income tax).",
    },
    incomeTax: {
      title: "Income & capital tax",
      federal: "Federal direct tax",
      federalValue: "{year} tariff",
      federalNote:
        "Exact federal tariff (single/married). Pensions (AHV + PK) and dividends are taxed as income.",
      cantonal: "Cantonal/communal income & wealth tax",
      cantonalValue: "ESTV 2026 (real)",
      cantonalNote:
        "Real ESTV figures (cantonal capital, single/married, pension income incl. standard deductions); interpolated between reference points.",
      gemeinde: "Municipality",
      gemeindeNote:
        "This municipality's real 2026 ESTV tax multiplier, in % of the cantonal capital — scales the cantonal/communal taxes exactly.",
      federalCapital: "Federal lump-sum withdrawal tax",
      federalCapitalValue: "⅕ of the ordinary tariff",
      federalCapitalNote:
        "Art. 38 DBG, on 3a/PK capital withdrawals — in addition to the cantonal/communal capital tax.",
    },
    market: {
      title: "Monte Carlo — real market data",
      equityCh: "Swiss equities (real)",
      equityGlobal: "Global equities (real)",
      equityGlobalNote:
        "UBS/DMS world index. The equity part is blended by your Swiss/global split; world figures on a reporting-currency basis (CHF strength not modelled).",
      bondsCh: "Swiss bonds (real)",
      correlations: "Correlations (assumption)",
      correlationsValue: "Equity/bond {eb} · CH/world {sw}",
      correlationsNote:
        "Model assumptions, not published single values. The historical mode draws returns from these distributions.",
      source: "Source",
    },
    ahv: {
      title: "AHV",
      maxPension: "Maximum full pension",
      referenceAge: "Reference age (default)",
      claimWindow: "Withdrawal window",
      reduction: "Reduction for early draw",
      reductionNote:
        "Official 2026 rates: 6.8% per year of early draw (13.6% for 2 years). Deferral follows the official Aufschub table (5.2–31.5%, not symmetric). Income-dependent rates apply only to transitional-generation women (1961–1969).",
    },
    cantonTax: {
      title: "Taxes — {canton}",
      dividendYield: "Dividend yield assumption",
      dividendYieldValue: "{pct}%/year",
      dividendYieldNote: "An assumption, not from the project brief — a typical ETF mix.",
      noCapGains: "No capital gains tax",
      yes: "Yes",
      no: "No",
      noCapGainsNote: "For private investors on movable assets.",
      capitalTax: "Lump-sum withdrawal tax",
      capitalTaxValue: "ESTV 2026 (real)",
      capitalTaxNote:
        "Real ESTV reference values (cantonal + communal, cantonal capital, single, without church tax); interpolated between reference points and scaled by the municipal tax factor.",
      source: "Source",
      unverifiedNote:
        "For {canton} the lump-sum withdrawal tax uses real ESTV figures; the wealth and ordinary income tax, however, still rest on a generic approximation. For exact values, use the official ESTV tax calculator.",
    },
    perYear: "/year",
  },

  affiliate: {
    aria: "Advertising",
    label: "Advertising / partner link",
    learnMore: "Learn more →",
    broker: {
      name: "Broker (placeholder)",
      description: "An online broker to hold the taxable bridge portfolio.",
    },
    pillar3a: {
      name: "3a provider (placeholder)",
      description: "A Säule 3a securities solution provider.",
    },
  },

  blog: {
    meta: {
      title: "Blog — know-how on early retirement",
      description:
        "Articles on Swiss early retirement: the bridge phase, Säule 3a, Pensionskasse, AHV contributions and taxes — clearly explained.",
    },
    index: {
      kicker: "Blog",
      h1: "Know-how on early retirement",
      body: "The bridge phase, pensions and taxes — the mechanics of Swiss early retirement, clearly explained.",
      readingShort: "min",
    },
    post: {
      back: "← Blog",
      readingSuffix: "min read",
      footnote: "Educational tool, not financial or tax advice. Figures are 2026 estimates without warranty.",
      cta: "Work out your own early retirement →",
      more: "Keep reading",
      breadcrumb: "Blog",
    },
  },

  ratgeber: {
    meta: {
      title: "Guide: the FIRE bridge phase, pillars & capital withdrawal",
      description:
        "How does the bridge phase work for early retirement in Switzerland? Säule 3a, Pensionskasse, AHV and the tax on capital withdrawal — clearly explained.",
    },
    breadcrumbAria: "Breadcrumb",
    breadcrumbHome: "Calculator",
    breadcrumbCurrent: " / Guide",
    h1: "Early retirement in Switzerland: understanding the bridge phase",
    intro:
      "A compact overview of the mechanics between a FIRE exit and access to Säule 3a, Pensionskasse and AHV — the foundation behind the calculator.",
    section1Title: "The three pillars at a glance",
    section1Body:
      "The Swiss pension system rests on three pillars: the state AHV (pillar 1), occupational benefits / the Pensionskasse (pillar 2, BVG) and tied private provision (Säule 3a). For early retirement, the key point is that all three only pay out from a certain age — the gap before that must be bridged from your own freely available wealth.",
    pillars: [
      ["Pillar 1 — AHV", "Drawn flexibly from 63, regularly from reference age 65. Drawing early reduces the lifelong pension."],
      ["Pillar 2 — Pensionskasse", "Capital or pension withdrawal, depending on the scheme often from 58–60. A capital withdrawal is taxed once."],
      ["Säule 3a", "Withdrawal at the earliest five years before the reference age, so typically from around 60. Several 3a accounts allow staggered withdrawals."],
    ],
    section2Title: "Why staggering the withdrawal matters",
    section2Body:
      "Capital withdrawals from pension assets are added together in the year of withdrawal and taxed progressively. Drawing Säule 3a and the Pensionskasse in the same year quickly lands you in a higher progression band. Spreading them across several tax years can noticeably lower the total lump-sum withdrawal tax. The calculator mirrors this heuristic by drawing from at most one pillar per year.",
    section3Title: "Frequent questions",
    backToCalc: "← To the calculator",
    faq: [
      {
        q: "What is the FIRE bridge phase?",
        a: "The bridge phase is the years between an early exit from working life (FIRE) and the point at which pension assets become available. Säule 3a and the Pensionskasse can usually be drawn at the earliest around five years before the reference age, the AHV from 63. During the bridge phase, living costs must be covered entirely from freely available (taxable) wealth.",
      },
      {
        q: "From what age can I draw Säule 3a and the Pensionskasse?",
        a: "Säule 3a balances can be drawn at the earliest five years before the AHV reference age, so usually from around 60. Pensionskasse capital is often available from 58 to 60, depending on the scheme. The exact age limits depend on the pension institution and its regulations.",
      },
      {
        q: "How is a capital withdrawal from pensions taxed?",
        a: "Capital withdrawals from Säule 3a and the Pensionskasse are taxed separately from other income at a reduced rate (lump-sum withdrawal tax). The rate is progressive and varies strongly by canton and municipality. If several withdrawals fall in the same tax year, they are added together — staggering them over several years can therefore lower the tax burden.",
      },
      {
        q: "Do I have to pay AHV contributions after exit?",
        a: "Anyone no longer in employment before the reference age counts as non-employed and pays AHV contributions based on wealth and any pension income. The contributions sit between a minimum and a maximum per year. These costs arise on top during the bridge phase and should be planned for.",
      },
      {
        q: "Does this tool calculate in real or nominal terms?",
        a: "The calculation is done throughout in real (inflation-adjusted) terms. Returns, spending and pensions are therefore to be understood in today's purchasing power. That simplifies interpretation, because amounts stay comparable across the years.",
      },
    ],
  },

  about: {
    meta: {
      title: "About",
      description:
        "Why Pillar Zero exists and how the calculator works: independent, transparent and entirely in the browser.",
    },
    kicker: "About",
    h1: "Early retirement, honestly worked out.",
    p1: "Pillar Zero grew out of a simple observation: most FIRE calculators ignore what makes Switzerland special — pension capital is locked away for the longest time, and the taxes on capital withdrawals, income and wealth differ massively from one municipality to the next.",
    p2: "We wanted a tool that reflects this reality: the bridge phase between exit and pension withdrawal, the staggered Säule 3a withdrawal, the choice between Pensionskasse capital and pension, the AHV contributions of the non-employed — and real taxes for your municipality.",
    h2numbers: "Where the numbers come from",
    numbers1:
      "The tax figures come from the official calculator of the Federal Tax Administration (ESTV, tax year 2026): the lump-sum withdrawal tax, the cantonal/communal income and wealth tax, and the municipal tax multipliers of all 2,110 municipalities. The federal direct tax we compute with the exact statutory tariff. AHV, BVG and Säule 3a figures follow the official 2026 values.",
    numbers2:
      "Some deliberate simplifications remain (for example with deductions and church tax). All figures are estimates without warranty and do not replace personal advice.",
    h2privacy: "Your data stays with you",
    privacy:
      "All calculations run locally in your browser. No financial data is transmitted to or stored on a server. Shared scenario links encode the inputs in the URL — they too do not leave your browser.",
    h2independent: "Independent & ad-funded",
    independent:
      "Pillar Zero is free and independent. Any partner pointers are clearly marked as advertising and kept separate from the calculation results.",
    cta: "To the calculator →",
  },

  impressum: {
    meta: { title: "Legal notice", description: "Legal notice and provider details for Pillar Zero." },
    kicker: "Legal",
    h1: "Legal notice",
    placeholder: "Note — add the provider's name and address before going public.",
    providerHeading: "Provider",
    providerLines: ["Pillar Zero", "[Name / Company]", "[Street No.]", "[Postcode City], Switzerland"],
    contactHeading: "Contact",
    contact: "Email: contact@pillarzero.ch",
    liabilityHeading: "Disclaimer of liability",
    liability1:
      "Pillar Zero is an educational tool and does not constitute financial, tax or investment advice. All calculations and tax figures are estimates without warranty. No liability is accepted for decisions based on the results; the official bodies (ESTV, compensation office, Pensionskasse) and personal advice are decisive.",
    liability2:
      "No liability is accepted for the content of external links; their operators are solely responsible.",
  },

  datenschutz: {
    meta: {
      title: "Privacy",
      description:
        "Pillar Zero's privacy statement: all calculations run locally in the browser, no financial data is transmitted.",
    },
    kicker: "Legal",
    h1: "Privacy",
    h2principle: "Principle: no server processing of your inputs",
    principle:
      "Pillar Zero is built so that your financial data does not leave your browser. All calculations (wealth, pensions, taxes) run entirely locally on your device. No input values are transmitted to, stored on or evaluated by a server.",
    h2shared: "Shared scenarios",
    shared:
      "When you share a scenario, the inputs are encoded into the link (URL fragment). Browsers usually do not send this fragment to the server. Only share such a link with people you are happy to entrust the contained details to.",
    h2logs: "Server logs & hosting",
    logs:
      "When pages are requested, technically necessary server logs may arise at the hosting provider (e.g. IP address, time, page requested). These serve operation and security and contain none of the financial data you enter.",
    h2analytics: "Anonymous usage statistics",
    analytics:
      "To improve the site we collect anonymous, cookieless usage statistics with a self-hosted Umami instance. This records aggregated information such as the page visited, the referrer and the approximate region — no cookies, no cross-device tracking, and nothing that identifies you personally. The financial data you enter in the calculator is not affected and does not leave your browser.",
    h2external: "External content",
    external:
      "Fonts are delivered via the build. Clearly marked partner links lead to external providers with their own privacy policies.",
    h2contact: "Contact",
    contact: "Privacy questions: contact@pillarzero.ch.",
  },

  og: {
    kicker: "Private Dossier · Swiss FIRE",
    h1: "Is your capital enough to reach your pension?",
    body:
      "Bridge calculation between early retirement and Säule 3a, Pensionskasse & AHV — incl. real ESTV taxes per municipality.",
    footerLeft: "Säule 3a · Pensionskasse · AHV · Taxes",
    footerRight: "Educational tool — not financial advice",
  },
};
