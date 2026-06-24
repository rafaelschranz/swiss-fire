"use client";

import { chfShort } from "@/lib/format";
import type { DecumulationYearResult } from "@/lib/engine/types";

interface Row {
  age: number;
  total: number;
  taxable: number;
  pillar3a: number;
  pillar2: number;
  ahvPension: number;
  pkPension: number;
  employment: number;
  withdrawal: number; // net drawn from the portfolio for living (>= 0)
  living: number;
  ahvContrib: number;
  taxes: number;
  depleted: boolean;
}

function toRows(years: DecumulationYearResult[]): Row[] {
  return years.map((y) => ({
    age: y.age,
    total: y.taxableBalance + y.pillar3aBalance + y.pillar2Balance,
    taxable: y.taxableBalance,
    pillar3a: y.pillar3aBalance,
    pillar2: y.pillar2Balance,
    ahvPension: y.ahvPension,
    pkPension: y.pillar2Pension,
    employment: y.employmentIncome,
    withdrawal: Math.max(0, y.netWithdrawal),
    living: y.spend,
    ahvContrib: y.ahvNonEmployedContribution,
    taxes: y.dividendTax + y.wealthTax + y.lumpSumTax,
    depleted: y.depleted,
  }));
}

const CSV_HEADERS = [
  "Alter", "Vermoegen_Total", "Steuerbar", "Saeule_3a", "Pensionskasse",
  "AHV_Rente", "PK_Rente", "Erwerb", "Portfolio_Bezug", "Lebenshaltung",
  "AHV_Beitraege", "Steuern",
] as const;

function buildCsv(years: DecumulationYearResult[]): string {
  const rows = toRows(years).map((r) =>
    [r.age, r.total, r.taxable, r.pillar3a, r.pillar2, r.ahvPension, r.pkPension, r.employment, r.withdrawal, r.living, r.ahvContrib, r.taxes]
      .map((n) => Math.round(n))
      .join(";"),
  );
  return [CSV_HEADERS.join(";"), ...rows].join("\n");
}

const Th = ({ children, right }: { children: React.ReactNode; right?: boolean }) => (
  <th className={`eyebrow whitespace-nowrap px-2.5 py-2 font-medium text-muted ${right ? "text-right" : "text-left"}`}>
    {children}
  </th>
);

const Td = ({ children, right, dim, accent }: { children: React.ReactNode; right?: boolean; dim?: boolean; accent?: boolean }) => (
  <td className={`num whitespace-nowrap px-2.5 py-1.5 text-sm ${right ? "text-right" : ""} ${accent ? "text-petrol" : dim ? "text-muted" : "text-ink"}`}>
    {children}
  </td>
);

const cell = (v: number) => (v > 0 ? chfShort(v) : "—");

export function YearTable({ years }: { years: DecumulationYearResult[] }) {
  const rows = toRows(years);
  const hasEmployment = rows.some((r) => r.employment > 0);

  const downloadCsv = () => {
    const blob = new Blob([buildCsv(years)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "swiss-fire-jahresverlauf.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="card p-5">
      <div className="mb-3 flex items-center justify-between gap-4">
        <p className="eyebrow text-muted">Jahresverlauf · in heutiger Kaufkraft (real)</p>
        <button
          type="button"
          onClick={downloadCsv}
          className="eyebrow border border-line-2 px-3 py-1.5 text-muted transition hover:border-ink hover:text-ink"
        >
          CSV herunterladen
        </button>
      </div>
      <div className="max-h-[28rem] overflow-auto">
        <table className="w-full border-collapse">
          <thead className="sticky top-0 bg-paper">
            <tr className="border-b border-line-2">
              <Th>Alter</Th>
              <Th right>Total</Th>
              <Th right>Steuerbar</Th>
              <Th right>3a</Th>
              <Th right>PK</Th>
              <Th right>AHV-Rente</Th>
              <Th right>PK-Rente</Th>
              {hasEmployment && <Th right>Erwerb</Th>}
              <Th right>Portfolio-Bezug</Th>
              <Th right>AHV-Beitr.</Th>
              <Th right>Steuern</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.age} className={`border-b border-line ${r.depleted ? "bg-brass/5" : ""}`}>
                <Td>{r.age}</Td>
                <Td right>{chfShort(r.total)}</Td>
                <Td right dim>{chfShort(r.taxable)}</Td>
                <Td right dim>{cell(r.pillar3a)}</Td>
                <Td right dim>{cell(r.pillar2)}</Td>
                <Td right>{cell(r.ahvPension)}</Td>
                <Td right>{cell(r.pkPension)}</Td>
                {hasEmployment && <Td right>{cell(r.employment)}</Td>}
                <Td right accent>{cell(r.withdrawal)}</Td>
                <Td right dim>{cell(r.ahvContrib)}</Td>
                <Td right dim>{cell(r.taxes)}</Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-muted">
        Mittelherkunft pro Jahr: die Lebenshaltung wird aus <span className="text-petrol">Portfolio-Bezug</span>
        {" "}(Bezug aus dem investierten Vermögen), AHV-Rente, PK-Rente und ggf. Erwerb gedeckt. „Steuern“ umfasst
        Einkommens-, Vermögens- und Kapitalauszahlungssteuer (Bund + Kanton/Gemeinde). Beträge gerundet; die
        CSV-Datei enthält die vollen Werte.
      </p>
    </div>
  );
}
