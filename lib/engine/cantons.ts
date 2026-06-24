import type { CantonCode, CantonTaxData, TaxCurve } from "./types";

/**
 * 26-canton tax data table — all three taxes are now grounded in REAL official
 * ESTV figures (tax year 2026), sourced from the ESTV tax calculator
 * (swisstaxcalculator.estv.admin.ch), for a single / married person with no
 * church tax at the cantonal capital municipality:
 *
 *   - `incomeTaxCurve` — cantonal + communal income tax by gross pension income
 *     (ESTV applies the standard deductions internally).
 *   - `wealthTaxCurve` — cantonal + communal wealth tax.
 *   - `lumpSumTax.referencePoints` — cantonal + communal capital-withdrawal tax
 *     on 3a / Pillar 2 lump sums.
 *
 * The engine interpolates between the points, adds the federal direct tax /
 * federal one-fifth capital tariff itself, and scales the cantonal/communal
 * part by the user's Gemeinde factor for municipalities other than the capital.
 * Deductions beyond ESTV's standard ones, church tax, and per-municipality
 * scale differences are not modelled. Re-verify every January.
 */

type ReferencePoint = { amount: number; tax: number };

/**
 * Real ESTV 2026 capital-withdrawal tax (cantonal + communal, single, no church,
 * cantonal capital). Source: ESTV API_calculateManyCapitalTaxes.
 */
const CAPITAL_REFERENCE_POINTS: Record<CantonCode, ReferencePoint[]> = {
  AG: [{ amount: 50000, tax: 1424 }, { amount: 100000, tax: 4142 }, { amount: 250000, tax: 13287 }, { amount: 500000, tax: 29398 }, { amount: 1000000, tax: 62233 }],
  AI: [{ amount: 50000, tax: 1110 }, { amount: 100000, tax: 2774 }, { amount: 250000, tax: 7600 }, { amount: 500000, tax: 15200 }, { amount: 1000000, tax: 30400 }],
  AR: [{ amount: 50000, tax: 3700 }, { amount: 100000, tax: 7400 }, { amount: 250000, tax: 18500 }, { amount: 500000, tax: 39042 }, { amount: 1000000, tax: 88374 }],
  BE: [{ amount: 50000, tax: 1669 }, { amount: 100000, tax: 4091 }, { amount: 250000, tax: 12422 }, { amount: 500000, tax: 30758 }, { amount: 1000000, tax: 73154 }],
  BL: [{ amount: 50000, tax: 1650 }, { amount: 100000, tax: 3300 }, { amount: 250000, tax: 8250 }, { amount: 500000, tax: 23100 }, { amount: 1000000, tax: 72600 }],
  BS: [{ amount: 50000, tax: 1750 }, { amount: 100000, tax: 4750 }, { amount: 250000, tax: 16750 }, { amount: 500000, tax: 36750 }, { amount: 1000000, tax: 76750 }],
  FR: [{ amount: 50000, tax: 900 }, { amount: 100000, tax: 2700 }, { amount: 250000, tax: 13500 }, { amount: 500000, tax: 36000 }, { amount: 1000000, tax: 81000 }],
  GE: [{ amount: 50000, tax: 1183 }, { amount: 100000, tax: 3588 }, { amount: 250000, tax: 11650 }, { amount: 500000, tax: 26550 }, { amount: 1000000, tax: 58069 }],
  GL: [{ amount: 50000, tax: 2414 }, { amount: 100000, tax: 4828 }, { amount: 250000, tax: 12070 }, { amount: 500000, tax: 24140 }, { amount: 1000000, tax: 48280 }],
  GR: [{ amount: 50000, tax: 1350 }, { amount: 100000, tax: 2700 }, { amount: 250000, tax: 6750 }, { amount: 500000, tax: 18000 }, { amount: 1000000, tax: 36000 }],
  JU: [{ amount: 50000, tax: 2613 }, { amount: 100000, tax: 5637 }, { amount: 250000, tax: 17495 }, { amount: 500000, tax: 37682 }, { amount: 1000000, tax: 78057 }],
  LU: [{ amount: 50000, tax: 986 }, { amount: 100000, tax: 3016 }, { amount: 250000, tax: 9106 }, { amount: 500000, tax: 19256 }, { amount: 1000000, tax: 39556 }],
  NE: [{ amount: 50000, tax: 2363 }, { amount: 100000, tax: 5139 }, { amount: 250000, tax: 15661 }, { amount: 500000, tax: 31775 }, { amount: 1000000, tax: 64519 }],
  NW: [{ amount: 50000, tax: 1241 }, { amount: 100000, tax: 3035 }, { amount: 250000, tax: 8520 }, { amount: 500000, tax: 17045 }, { amount: 1000000, tax: 34095 }],
  OW: [{ amount: 50000, tax: 2560 }, { amount: 100000, tax: 5119 }, { amount: 250000, tax: 12798 }, { amount: 500000, tax: 25596 }, { amount: 1000000, tax: 51192 }],
  SG: [{ amount: 50000, tax: 2673 }, { amount: 100000, tax: 5346 }, { amount: 250000, tax: 13365 }, { amount: 500000, tax: 26730 }, { amount: 1000000, tax: 53460 }],
  SH: [{ amount: 50000, tax: 877 }, { amount: 100000, tax: 2542 }, { amount: 250000, tax: 7870 }, { amount: 500000, tax: 15741 }, { amount: 1000000, tax: 31482 }],
  SO: [{ amount: 50000, tax: 1670 }, { amount: 100000, tax: 4489 }, { amount: 250000, tax: 13799 }, { amount: 500000, tax: 28350 }, { amount: 1000000, tax: 56700 }],
  SZ: [{ amount: 50000, tax: 445 }, { amount: 100000, tax: 1389 }, { amount: 250000, tax: 8140 }, { amount: 500000, tax: 21375 }, { amount: 1000000, tax: 42750 }],
  TG: [{ amount: 50000, tax: 3012 }, { amount: 100000, tax: 6024 }, { amount: 250000, tax: 15060 }, { amount: 500000, tax: 30120 }, { amount: 1000000, tax: 60240 }],
  TI: [{ amount: 50000, tax: 1930 }, { amount: 100000, tax: 3860 }, { amount: 250000, tax: 9650 }, { amount: 500000, tax: 22751 }, { amount: 1000000, tax: 57900 }],
  UR: [{ amount: 50000, tax: 1853 }, { amount: 100000, tax: 3705 }, { amount: 250000, tax: 9263 }, { amount: 500000, tax: 18525 }, { amount: 1000000, tax: 37050 }],
  VD: [{ amount: 50000, tax: 1591 }, { amount: 100000, tax: 4052 }, { amount: 250000, tax: 13460 }, { amount: 500000, tax: 31446 }, { amount: 1000000, tax: 67638 }],
  VS: [{ amount: 50000, tax: 2100 }, { amount: 100000, tax: 4200 }, { amount: 250000, tax: 10778 }, { amount: 500000, tax: 30172 }, { amount: 1000000, tax: 80000 }],
  ZG: [{ amount: 50000, tax: 780 }, { amount: 100000, tax: 2197 }, { amount: 250000, tax: 7352 }, { amount: 500000, tax: 17752 }, { amount: 1000000, tax: 38552 }],
  ZH: [{ amount: 50000, tax: 2140 }, { amount: 100000, tax: 4280 }, { amount: 250000, tax: 10700 }, { amount: 500000, tax: 24567 }, { amount: 1000000, tax: 86542 }],
};

/**
 * Real ESTV 2026 cantonal + communal income tax (pension income type) and wealth
 * tax, single vs married, at the cantonal capital. Source: ESTV
 * API_calculateDetailedTaxes. Income points are gross pension income (ESTV
 * applies standard deductions); wealth points are net wealth.
 */
const CANTONAL_TAX_CURVES: Record<CantonCode, { income: TaxCurve; wealth: TaxCurve }> = {
  AG: { income: { single: [{ amount: 25000, tax: 641 }, { amount: 50000, tax: 4139 }, { amount: 75000, tax: 8398 }, { amount: 100000, tax: 13088 }, { amount: 150000, tax: 22900 }, { amount: 250000, tax: 43494 }], married: [{ amount: 25000, tax: 25 }, { amount: 50000, tax: 1787 }, { amount: 75000, tax: 4617 }, { amount: 100000, tax: 8279 }, { amount: 150000, tax: 16795 }, { amount: 250000, tax: 35849 }] }, wealth: { single: [{ amount: 100000, tax: 0 }, { amount: 250000, tax: 175 }, { amount: 500000, tax: 754 }, { amount: 1000000, tax: 2323 }], married: [{ amount: 100000, tax: 0 }, { amount: 250000, tax: 0 }, { amount: 500000, tax: 424 }, { amount: 1000000, tax: 1909 }] } },
  AI: { income: { single: [{ amount: 25000, tax: 1012 }, { amount: 50000, tax: 3999 }, { amount: 75000, tax: 7229 }, { amount: 100000, tax: 10631 }, { amount: 150000, tax: 17421 }, { amount: 250000, tax: 29987 }], married: [{ amount: 25000, tax: 283 }, { amount: 50000, tax: 2025 }, { amount: 75000, tax: 4858 }, { amount: 100000, tax: 7999 }, { amount: 150000, tax: 14459 }, { amount: 250000, tax: 28101 }] }, wealth: { single: [{ amount: 100000, tax: 114 }, { amount: 250000, tax: 456 }, { amount: 500000, tax: 1026 }, { amount: 1000000, tax: 2166 }], married: [{ amount: 100000, tax: 0 }, { amount: 250000, tax: 342 }, { amount: 500000, tax: 912 }, { amount: 1000000, tax: 2052 }] } },
  AR: { income: { single: [{ amount: 25000, tax: 1534 }, { amount: 50000, tax: 5541 }, { amount: 75000, tax: 10248 }, { amount: 100000, tax: 15293 }, { amount: 150000, tax: 25817 }, { amount: 250000, tax: 47277 }], married: [{ amount: 25000, tax: 131 }, { amount: 50000, tax: 3144 }, { amount: 75000, tax: 7090 }, { amount: 100000, tax: 11804 }, { amount: 150000, tax: 22016 }, { amount: 250000, tax: 43233 }] }, wealth: { single: [{ amount: 100000, tax: 92 }, { amount: 250000, tax: 648 }, { amount: 500000, tax: 1637 }, { amount: 1000000, tax: 3673 }], married: [{ amount: 100000, tax: 0 }, { amount: 250000, tax: 370 }, { amount: 500000, tax: 1332 }, { amount: 1000000, tax: 3368 }] } },
  BE: { income: { single: [{ amount: 25000, tax: 1698 }, { amount: 50000, tax: 6578 }, { amount: 75000, tax: 11707 }, { amount: 100000, tax: 17416 }, { amount: 150000, tax: 30231 }, { amount: 250000, tax: 57596 }], married: [{ amount: 25000, tax: 358 }, { amount: 50000, tax: 4177 }, { amount: 75000, tax: 8629 }, { amount: 100000, tax: 13433 }, { amount: 150000, tax: 24580 }, { amount: 250000, tax: 50479 }] }, wealth: { single: [{ amount: 100000, tax: 147 }, { amount: 250000, tax: 636 }, { amount: 500000, tax: 1596 }, { amount: 1000000, tax: 4027 }], married: [{ amount: 100000, tax: 0 }, { amount: 250000, tax: 571 }, { amount: 500000, tax: 1515 }, { amount: 1000000, tax: 3929 }] } },
  BL: { income: { single: [{ amount: 25000, tax: 0 }, { amount: 50000, tax: 5308 }, { amount: 75000, tax: 11322 }, { amount: 100000, tax: 17959 }, { amount: 150000, tax: 32223 }, { amount: 250000, tax: 61655 }], married: [{ amount: 25000, tax: 170 }, { amount: 50000, tax: 1513 }, { amount: 75000, tax: 5407 }, { amount: 100000, tax: 10615 }, { amount: 150000, tax: 22645 }, { amount: 250000, tax: 50046 }] }, wealth: { single: [{ amount: 100000, tax: 18 }, { amount: 250000, tax: 320 }, { amount: 500000, tax: 1556 }, { amount: 1000000, tax: 4278 }], married: [{ amount: 100000, tax: 0 }, { amount: 250000, tax: 127 }, { amount: 500000, tax: 1086 }, { amount: 1000000, tax: 3788 }] } },
  BS: { income: { single: [{ amount: 25000, tax: 0 }, { amount: 50000, tax: 4788 }, { amount: 75000, tax: 10038 }, { amount: 100000, tax: 15288 }, { amount: 150000, tax: 25788 }, { amount: 250000, tax: 47432 }], married: [{ amount: 25000, tax: 0 }, { amount: 50000, tax: 756 }, { amount: 75000, tax: 6006 }, { amount: 100000, tax: 11256 }, { amount: 150000, tax: 21756 }, { amount: 250000, tax: 42756 }] }, wealth: { single: [{ amount: 100000, tax: 28 }, { amount: 250000, tax: 394 }, { amount: 500000, tax: 2262 }, { amount: 1000000, tax: 5758 }], married: [{ amount: 100000, tax: 0 }, { amount: 250000, tax: 112 }, { amount: 500000, tax: 1182 }, { amount: 1000000, tax: 4726 }] } },
  FR: { income: { single: [{ amount: 25000, tax: 512 }, { amount: 50000, tax: 5628 }, { amount: 75000, tax: 11803 }, { amount: 100000, tax: 17840 }, { amount: 150000, tax: 31266 }, { amount: 250000, tax: 58307 }], married: [{ amount: 25000, tax: 118 }, { amount: 50000, tax: 2789 }, { amount: 75000, tax: 7383 }, { amount: 100000, tax: 12342 }, { amount: 150000, tax: 23604 }, { amount: 250000, tax: 48533 }] }, wealth: { single: [{ amount: 100000, tax: 54 }, { amount: 250000, tax: 693 }, { amount: 500000, tax: 1926 }, { amount: 1000000, tax: 4932 }], married: [{ amount: 100000, tax: 0 }, { amount: 250000, tax: 580 }, { amount: 500000, tax: 1926 }, { amount: 1000000, tax: 4932 }] } },
  GE: { income: { single: [{ amount: 25000, tax: 0 }, { amount: 50000, tax: 2627 }, { amount: 75000, tax: 9676 }, { amount: 100000, tax: 16800 }, { amount: 150000, tax: 29573 }, { amount: 250000, tax: 56983 }], married: [{ amount: 25000, tax: 0 }, { amount: 50000, tax: 0 }, { amount: 75000, tax: 3325 }, { amount: 100000, tax: 9748 }, { amount: 150000, tax: 21341 }, { amount: 250000, tax: 46117 }] }, wealth: { single: [{ amount: 100000, tax: 35 }, { amount: 250000, tax: 508 }, { amount: 500000, tax: 1638 }, { amount: 1000000, tax: 4546 }], married: [{ amount: 100000, tax: 0 }, { amount: 250000, tax: 214 }, { amount: 500000, tax: 1199 }, { amount: 1000000, tax: 3999 }] } },
  GL: { income: { single: [{ amount: 25000, tax: 772 }, { amount: 50000, tax: 4638 }, { amount: 75000, tax: 9013 }, { amount: 100000, tax: 13540 }, { amount: 150000, tax: 23102 }, { amount: 250000, tax: 44056 }], married: [{ amount: 25000, tax: 0 }, { amount: 50000, tax: 2458 }, { amount: 75000, tax: 6097 }, { amount: 100000, tax: 10093 }, { amount: 150000, tax: 19146 }, { amount: 250000, tax: 38038 }] }, wealth: { single: [{ amount: 100000, tax: 79 }, { amount: 250000, tax: 623 }, { amount: 500000, tax: 1528 }, { amount: 1000000, tax: 3338 }], married: [{ amount: 100000, tax: 0 }, { amount: 250000, tax: 344 }, { amount: 500000, tax: 1249 }, { amount: 1000000, tax: 3059 }] } },
  GR: { income: { single: [{ amount: 25000, tax: 256 }, { amount: 50000, tax: 4046 }, { amount: 75000, tax: 8706 }, { amount: 100000, tax: 13490 }, { amount: 150000, tax: 23443 }, { amount: 250000, tax: 43650 }], married: [{ amount: 25000, tax: 0 }, { amount: 50000, tax: 710 }, { amount: 75000, tax: 4255 }, { amount: 100000, tax: 8530 }, { amount: 150000, tax: 17885 }, { amount: 250000, tax: 37393 }] }, wealth: { single: [{ amount: 100000, tax: 51 }, { amount: 250000, tax: 365 }, { amount: 500000, tax: 1133 }, { amount: 1000000, tax: 2849 }], married: [{ amount: 100000, tax: 0 }, { amount: 250000, tax: 194 }, { amount: 500000, tax: 904 }, { amount: 1000000, tax: 2637 }] } },
  JU: { income: { single: [{ amount: 25000, tax: 396 }, { amount: 50000, tax: 5985 }, { amount: 75000, tax: 11617 }, { amount: 100000, tax: 17542 }, { amount: 150000, tax: 30743 }, { amount: 250000, tax: 57588 }], married: [{ amount: 25000, tax: 0 }, { amount: 50000, tax: 1908 }, { amount: 75000, tax: 7227 }, { amount: 100000, tax: 12122 }, { amount: 150000, tax: 23370 }, { amount: 250000, tax: 47562 }] }, wealth: { single: [{ amount: 100000, tax: 168 }, { amount: 250000, tax: 655 }, { amount: 500000, tax: 1566 }, { amount: 1000000, tax: 3914 }], married: [{ amount: 100000, tax: 0 }, { amount: 250000, tax: 555 }, { amount: 500000, tax: 1445 }, { amount: 1000000, tax: 3768 }] } },
  LU: { income: { single: [{ amount: 25000, tax: 276 }, { amount: 50000, tax: 4244 }, { amount: 75000, tax: 7956 }, { amount: 100000, tax: 11582 }, { amount: 150000, tax: 19096 }, { amount: 250000, tax: 35414 }], married: [{ amount: 25000, tax: 0 }, { amount: 50000, tax: 1516 }, { amount: 75000, tax: 5236 }, { amount: 100000, tax: 8734 }, { amount: 150000, tax: 15974 }, { amount: 250000, tax: 32654 }] }, wealth: { single: [{ amount: 100000, tax: 80 }, { amount: 250000, tax: 406 }, { amount: 500000, tax: 950 }, { amount: 1000000, tax: 2038 }], married: [{ amount: 100000, tax: 0 }, { amount: 250000, tax: 272 }, { amount: 500000, tax: 816 }, { amount: 1000000, tax: 1904 }] } },
  NE: { income: { single: [{ amount: 25000, tax: 1114 }, { amount: 50000, tax: 7068 }, { amount: 75000, tax: 13105 }, { amount: 100000, tax: 19688 }, { amount: 150000, tax: 33848 }, { amount: 250000, tax: 61837 }], married: [{ amount: 25000, tax: 7 }, { amount: 50000, tax: 2570 }, { amount: 75000, tax: 8776 }, { amount: 100000, tax: 14457 }, { amount: 150000, tax: 26663 }, { amount: 250000, tax: 53929 }] }, wealth: { single: [{ amount: 100000, tax: 284 }, { amount: 250000, tax: 1229 }, { amount: 500000, tax: 3402 }, { amount: 1000000, tax: 6804 }], married: [{ amount: 100000, tax: 22 }, { amount: 250000, tax: 872 }, { amount: 500000, tax: 2508 }, { amount: 1000000, tax: 6804 }] } },
  NW: { income: { single: [{ amount: 25000, tax: 715 }, { amount: 50000, tax: 4221 }, { amount: 75000, tax: 7927 }, { amount: 100000, tax: 11726 }, { amount: 150000, tax: 19569 }, { amount: 250000, tax: 33712 }], married: [{ amount: 25000, tax: 0 }, { amount: 50000, tax: 1703 }, { amount: 75000, tax: 5202 }, { amount: 100000, tax: 8805 }, { amount: 150000, tax: 16244 }, { amount: 250000, tax: 31742 }] }, wealth: { single: [{ amount: 100000, tax: 80 }, { amount: 250000, tax: 266 }, { amount: 500000, tax: 576 }, { amount: 1000000, tax: 1197 }], married: [{ amount: 100000, tax: 38 }, { amount: 250000, tax: 223 }, { amount: 500000, tax: 534 }, { amount: 1000000, tax: 1153 }] } },
  OW: { income: { single: [{ amount: 25000, tax: 1229 }, { amount: 50000, tax: 4748 }, { amount: 75000, tax: 7986 }, { amount: 100000, tax: 11186 }, { amount: 150000, tax: 17585 }, { amount: 250000, tax: 30383 }], married: [{ amount: 25000, tax: 26 }, { amount: 50000, tax: 2944 }, { amount: 75000, tax: 6335 }, { amount: 100000, tax: 9599 }, { amount: 150000, tax: 15998 }, { amount: 250000, tax: 28796 }] }, wealth: { single: [{ amount: 100000, tax: 107 }, { amount: 250000, tax: 320 }, { amount: 500000, tax: 676 }, { amount: 1000000, tax: 1387 }], married: [{ amount: 100000, tax: 72 }, { amount: 250000, tax: 284 }, { amount: 500000, tax: 640 }, { amount: 1000000, tax: 1351 }] } },
  SG: { income: { single: [{ amount: 25000, tax: 1181 }, { amount: 50000, tax: 5424 }, { amount: 75000, tax: 10599 }, { amount: 100000, tax: 16188 }, { amount: 150000, tax: 27598 }, { amount: 250000, tax: 50440 }], married: [{ amount: 25000, tax: 0 }, { amount: 50000, tax: 2338 }, { amount: 75000, tax: 5987 }, { amount: 100000, tax: 10820 }, { amount: 150000, tax: 21167 }, { amount: 250000, tax: 43747 }] }, wealth: { single: [{ amount: 100000, tax: 104 }, { amount: 250000, tax: 723 }, { amount: 500000, tax: 1756 }, { amount: 1000000, tax: 3821 }], married: [{ amount: 100000, tax: 0 }, { amount: 250000, tax: 414 }, { amount: 500000, tax: 1446 }, { amount: 1000000, tax: 3511 }] } },
  SH: { income: { single: [{ amount: 25000, tax: 567 }, { amount: 50000, tax: 3843 }, { amount: 75000, tax: 7675 }, { amount: 100000, tax: 12048 }, { amount: 150000, tax: 20875 }, { amount: 250000, tax: 38750 }], married: [{ amount: 25000, tax: 0 }, { amount: 50000, tax: 1443 }, { amount: 75000, tax: 4689 }, { amount: 100000, tax: 7968 }, { amount: 150000, tax: 15845 }, { amount: 250000, tax: 33333 }] }, wealth: { single: [{ amount: 100000, tax: 71 }, { amount: 250000, tax: 286 }, { amount: 500000, tax: 803 }, { amount: 1000000, tax: 2647 }], married: [{ amount: 100000, tax: 0 }, { amount: 250000, tax: 215 }, { amount: 500000, tax: 652 }, { amount: 1000000, tax: 2413 }] } },
  SO: { income: { single: [{ amount: 25000, tax: 340 }, { amount: 50000, tax: 5836 }, { amount: 75000, tax: 11402 }, { amount: 100000, tax: 17072 }, { amount: 150000, tax: 29384 }, { amount: 250000, tax: 54224 }], married: [{ amount: 25000, tax: 0 }, { amount: 50000, tax: 2029 }, { amount: 75000, tax: 6782 }, { amount: 100000, tax: 12083 }, { amount: 150000, tax: 23276 }, { amount: 250000, tax: 47038 }] }, wealth: { single: [{ amount: 100000, tax: 65 }, { amount: 250000, tax: 411 }, { amount: 500000, tax: 951 }, { amount: 1000000, tax: 2031 }], married: [{ amount: 100000, tax: 0 }, { amount: 250000, tax: 324 }, { amount: 500000, tax: 864 }, { amount: 1000000, tax: 1944 }] } },
  SZ: { income: { single: [{ amount: 25000, tax: 440 }, { amount: 50000, tax: 2928 }, { amount: 75000, tax: 5514 }, { amount: 100000, tax: 8293 }, { amount: 150000, tax: 13850 }, { amount: 250000, tax: 24965 }], married: [{ amount: 25000, tax: 0 }, { amount: 50000, tax: 915 }, { amount: 75000, tax: 3516 }, { amount: 100000, tax: 5970 }, { amount: 150000, tax: 11208 }, { amount: 250000, tax: 22326 }] }, wealth: { single: [{ amount: 100000, tax: 0 }, { amount: 250000, tax: 214 }, { amount: 500000, tax: 642 }, { amount: 1000000, tax: 1497 }], married: [{ amount: 100000, tax: 0 }, { amount: 250000, tax: 0 }, { amount: 500000, tax: 428 }, { amount: 1000000, tax: 1283 }] } },
  TG: { income: { single: [{ amount: 25000, tax: 417 }, { amount: 50000, tax: 4845 }, { amount: 75000, tax: 9237 }, { amount: 100000, tax: 13782 }, { amount: 150000, tax: 23194 }, { amount: 250000, tax: 43124 }], married: [{ amount: 25000, tax: 0 }, { amount: 50000, tax: 1582 }, { amount: 75000, tax: 5437 }, { amount: 100000, tax: 9688 }, { amount: 150000, tax: 18473 }, { amount: 250000, tax: 36975 }] }, wealth: { single: [{ amount: 100000, tax: 0 }, { amount: 250000, tax: 414 }, { amount: 500000, tax: 1105 }, { amount: 1000000, tax: 2485 }], married: [{ amount: 100000, tax: 0 }, { amount: 250000, tax: 138 }, { amount: 500000, tax: 829 }, { amount: 1000000, tax: 2209 }] } },
  TI: { income: { single: [{ amount: 25000, tax: 0 }, { amount: 50000, tax: 4782 }, { amount: 75000, tax: 10051 }, { amount: 100000, tax: 15859 }, { amount: 150000, tax: 28263 }, { amount: 250000, tax: 53832 }], married: [{ amount: 25000, tax: 0 }, { amount: 50000, tax: 1272 }, { amount: 75000, tax: 5249 }, { amount: 100000, tax: 10341 }, { amount: 150000, tax: 22330 }, { amount: 250000, tax: 48331 }] }, wealth: { single: [{ amount: 100000, tax: 0 }, { amount: 250000, tax: 579 }, { amount: 500000, tax: 1756 }, { amount: 1000000, tax: 4458 }], married: [{ amount: 100000, tax: 0 }, { amount: 250000, tax: 0 }, { amount: 500000, tax: 1467 }, { amount: 1000000, tax: 4111 }] } },
  UR: { income: { single: [{ amount: 25000, tax: 969 }, { amount: 50000, tax: 4430 }, { amount: 75000, tax: 7892 }, { amount: 100000, tax: 11353 }, { amount: 150000, tax: 18275 }, { amount: 250000, tax: 32120 }], married: [{ amount: 25000, tax: 0 }, { amount: 50000, tax: 2430 }, { amount: 75000, tax: 5891 }, { amount: 100000, tax: 9352 }, { amount: 150000, tax: 16275 }, { amount: 250000, tax: 30120 }] }, wealth: { single: [{ amount: 100000, tax: 0 }, { amount: 250000, tax: 281 }, { amount: 500000, tax: 768 }, { amount: 1000000, tax: 1743 }], married: [{ amount: 100000, tax: 0 }, { amount: 250000, tax: 74 }, { amount: 500000, tax: 562 }, { amount: 1000000, tax: 1537 }] } },
  VD: { income: { single: [{ amount: 25000, tax: 95 }, { amount: 50000, tax: 5777 }, { amount: 75000, tax: 12130 }, { amount: 100000, tax: 18342 }, { amount: 150000, tax: 32425 }, { amount: 250000, tax: 63564 }], married: [{ amount: 25000, tax: 0 }, { amount: 50000, tax: 1694 }, { amount: 75000, tax: 8552 }, { amount: 100000, tax: 13732 }, { amount: 150000, tax: 25007 }, { amount: 250000, tax: 52242 }] }, wealth: { single: [{ amount: 100000, tax: 175 }, { amount: 250000, tax: 892 }, { amount: 500000, tax: 2552 }, { amount: 1000000, tax: 6391 }], married: [{ amount: 100000, tax: 0 }, { amount: 250000, tax: 892 }, { amount: 500000, tax: 2552 }, { amount: 1000000, tax: 6391 }] } },
  VS: { income: { single: [{ amount: 25000, tax: 10 }, { amount: 50000, tax: 4558 }, { amount: 75000, tax: 9709 }, { amount: 100000, tax: 15793 }, { amount: 150000, tax: 30994 }, { amount: 250000, tax: 58680 }], married: [{ amount: 25000, tax: 10 }, { amount: 50000, tax: 2667 }, { amount: 75000, tax: 5770 }, { amount: 100000, tax: 9627 }, { amount: 150000, tax: 20187 }, { amount: 250000, tax: 47933 }] }, wealth: { single: [{ amount: 100000, tax: 197 }, { amount: 250000, tax: 861 }, { amount: 500000, tax: 2102 }, { amount: 1000000, tax: 5014 }], married: [{ amount: 100000, tax: 21 }, { amount: 250000, tax: 638 }, { amount: 500000, tax: 1894 }, { amount: 1000000, tax: 4778 }] } },
  ZG: { income: { single: [{ amount: 25000, tax: 3 }, { amount: 50000, tax: 878 }, { amount: 75000, tax: 2798 }, { amount: 100000, tax: 4683 }, { amount: 150000, tax: 10230 }, { amount: 250000, tax: 20985 }], married: [{ amount: 25000, tax: 0 }, { amount: 50000, tax: 85 }, { amount: 75000, tax: 952 }, { amount: 100000, tax: 2073 }, { amount: 150000, tax: 5624 }, { amount: 250000, tax: 15430 }] }, wealth: { single: [{ amount: 100000, tax: 0 }, { amount: 250000, tax: 25 }, { amount: 500000, tax: 187 }, { amount: 1000000, tax: 917 }], married: [{ amount: 100000, tax: 0 }, { amount: 250000, tax: 0 }, { amount: 500000, tax: 50 }, { amount: 1000000, tax: 560 }] } },
  ZH: { income: { single: [{ amount: 25000, tax: 847 }, { amount: 50000, tax: 3670 }, { amount: 75000, tax: 7666 }, { amount: 100000, tax: 12356 }, { amount: 150000, tax: 22772 }, { amount: 250000, tax: 47343 }], married: [{ amount: 25000, tax: 94 }, { amount: 50000, tax: 1944 }, { amount: 75000, tax: 5023 }, { amount: 100000, tax: 8767 }, { amount: 150000, tax: 17490 }, { amount: 250000, tax: 38254 }] }, wealth: { single: [{ amount: 100000, tax: 20 }, { amount: 250000, tax: 181 }, { amount: 500000, tax: 639 }, { amount: 1000000, tax: 2002 }], married: [{ amount: 100000, tax: 0 }, { amount: 250000, tax: 95 }, { amount: 500000, tax: 466 }, { amount: 1000000, tax: 1745 }] } },
};

const CANTON_NAMES: Record<CantonCode, string> = {
  AG: "Aargau", AI: "Appenzell Innerrhoden", AR: "Appenzell Ausserrhoden", BE: "Bern",
  BL: "Basel-Landschaft", BS: "Basel-Stadt", FR: "Fribourg", GE: "Genève", GL: "Glarus",
  GR: "Graubünden", JU: "Jura", LU: "Luzern", NE: "Neuchâtel", NW: "Nidwalden", OW: "Obwalden",
  SG: "St. Gallen", SH: "Schaffhausen", SO: "Solothurn", SZ: "Schwyz", TG: "Thurgau",
  TI: "Ticino", UR: "Uri", VD: "Vaud", VS: "Valais", ZG: "Zug", ZH: "Zürich",
};

const SOURCE = "ESTV official calculator, tax year 2026 (cantonal+communal, cantonal capital, single/married, pension income, no church). Other municipalities are approximated via the Gemeinde factor.";

function buildCanton(code: CantonCode): CantonTaxData {
  const curves = CANTONAL_TAX_CURVES[code];
  return {
    code,
    name: CANTON_NAMES[code],
    verified: true,
    incomeTaxCurve: curves.income,
    wealthTaxCurve: curves.wealth,
    // Legacy fields retained for the standalone wealthTax/dividend helpers + tests.
    wealthTaxBrackets: [
      { from: 0, rate: 0.0015 },
      { from: 250_000, rate: 0.003 },
      { from: 1_000_000, rate: 0.0045 },
    ],
    incomeTaxEffectiveRate: 0.2,
    lumpSumTax: { referencePoints: CAPITAL_REFERENCE_POINTS[code] },
    source: SOURCE,
  };
}

const ALL_CODES: CantonCode[] = [
  "AG", "AI", "AR", "BE", "BL", "BS", "FR", "GE", "GL", "GR",
  "JU", "LU", "NE", "NW", "OW", "SG", "SH", "SO", "SZ", "TG",
  "TI", "UR", "VD", "VS", "ZG", "ZH",
];

export const CANTONS: Record<CantonCode, CantonTaxData> = Object.fromEntries(
  ALL_CODES.map((code) => [code, buildCanton(code)]),
) as Record<CantonCode, CantonTaxData>;

export function getCanton(code: CantonCode): CantonTaxData {
  return CANTONS[code];
}
