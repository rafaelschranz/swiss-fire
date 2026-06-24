"use client";

import { chfShort } from "@/lib/format";
import type { DecumulationYearResult } from "@/lib/engine/types";

interface Row {
  age: number;
  total: number;
  taxable: number;
  pillar3a: number;
  pillar2: number;
  pension: number;
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
    pension: y.ahvPension + y.pillar2Pension,
    living: y.spend,
    ahvContrib: y.ahvNonEmployedContribution,
    taxes: y.dividendTax + y.wealthTax + y.lumpSumTax,
    depleted: y.depleted,
  }));
}

const CSV_HEADERS = [
  "Alter",
  "Vermoegen_Total",
  "Steuerbar",
  "Saeule_3a",
  "Pensionskasse",
  "Renten_AHV_PK",
  "Lebenshaltung",
  "AHV_Beitraege",
  "Steuern",
] as const;

function buildCsv(years: DecumulationYearResult[]): string {
  const rows = toRows(years).map((r) =>
    [r.age, r.total, r.taxable, r.pillar3a, r.pillar2, r.pension, r.living, r.ahvContrib, r.taxes]
      .map((n) => (typeof n === "number" ? Math.round(n) : n))
      .join(";"),
  );
  return [CSV_HEADERS.join(";"), ...rows].join("\n");
}

const Th = ({ children, right }: { children: React.ReactNode; right?: boolean }) => (
  <th className={`eyebrow whitespace-nowrap px-2.5 py-2 font-medium text-muted ${right ? "text-right" : "text-left"}`}>
    {children}
  </th>
);

const Td = ({ children, right, dim }: { children: React.ReactNode; right?: boolean; dim?: boolean }) => (
  <td className={`num whitespace-nowrap px-2.5 py-1.5 text-sm ${right ? "text-right" : ""} ${dim ? "text-muted" : "text-ink"}`}>
    {children}
  </td>
);

export function YearTable({ years }: { years: DecumulationYearResult[] }) {
  const rows = toRows(years);

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
              <Th right>Renten</Th>
              <Th right>Leben</Th>
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
                <Td right dim>{chfShort(r.pillar3a)}</Td>
                <Td right dim>{chfShort(r.pillar2)}</Td>
                <Td right>{r.pension > 0 ? chfShort(r.pension) : "—"}</Td>
                <Td right dim>{chfShort(r.living)}</Td>
                <Td right dim>{r.ahvContrib > 0 ? chfShort(r.ahvContrib) : "—"}</Td>
                <Td right dim>{chfShort(r.taxes)}</Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-muted">
        „Steuern“ umfasst Einkommens-, Vermögens- und Kapitalauszahlungssteuer (Bund + Kanton/Gemeinde).
        Beträge gerundet; die CSV-Datei enthält die vollen Werte.
      </p>
    </div>
  );
}
