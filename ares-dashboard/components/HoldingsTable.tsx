"use client";

import { useState } from "react";

interface Holding {
  id: number;
  name: string;
  sector: string;
  geography: string;
  entryDate: string;
  costBasis: number;
  fairValue: number;
  grossMoic: number;
  ownership: string;
  ebitda: number;
  status: string;
  changePercent: number;
}

interface HoldingsTableProps {
  holdings: Holding[];
}

type SortKey = keyof Holding;

function fmt(n: number): string {
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(0)}M`;
  return `$${n.toLocaleString()}`;
}

export default function HoldingsTable({ holdings }: HoldingsTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("fairValue");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const sorted = [...holdings].sort((a, b) => {
    const av = a[sortKey];
    const bv = b[sortKey];
    const cmp =
      typeof av === "number" && typeof bv === "number"
        ? av - bv
        : String(av).localeCompare(String(bv));
    return sortDir === "desc" ? -cmp : cmp;
  });

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const totalFV = holdings.reduce((s, h) => s + h.fairValue, 0);
  const totalCost = holdings.reduce((s, h) => s + h.costBasis, 0);
  const avgMoic = holdings.reduce((s, h) => s + h.grossMoic, 0) / holdings.length;

  const cols: { key: SortKey; label: string; align?: "right" }[] = [
    { key: "name", label: "Investment" },
    { key: "sector", label: "Sector" },
    { key: "geography", label: "Geography" },
    { key: "status", label: "Type" },
    { key: "ownership", label: "Ownership" },
    { key: "entryDate", label: "Entry" },
    { key: "costBasis", label: "Cost Basis", align: "right" },
    { key: "fairValue", label: "Fair Value", align: "right" },
    { key: "grossMoic", label: "MOIC", align: "right" },
    { key: "changePercent", label: "Chg%", align: "right" },
  ];

  return (
    <div
      style={{
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderTop: "2px solid var(--orange)",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <div>
          <div
            className="text-[10px] tracking-widest uppercase font-medium"
            style={{ color: "var(--text-muted)" }}
          >
            Portfolio
          </div>
          <div
            className="text-sm font-bold mt-0.5"
            style={{ color: "var(--text-primary)" }}
          >
            Holdings — {holdings.length} Investments
          </div>
        </div>
        <div className="flex items-center gap-6 text-xs">
          <div className="text-right">
            <div style={{ color: "var(--text-muted)", fontSize: "10px" }}>TOTAL FMV</div>
            <div style={{ color: "var(--orange)", fontWeight: 700 }}>{fmt(totalFV)}</div>
          </div>
          <div className="text-right">
            <div style={{ color: "var(--text-muted)", fontSize: "10px" }}>TOTAL COST</div>
            <div style={{ color: "var(--text-secondary)", fontWeight: 600 }}>{fmt(totalCost)}</div>
          </div>
          <div className="text-right">
            <div style={{ color: "var(--text-muted)", fontSize: "10px" }}>AVG MOIC</div>
            <div style={{ color: "var(--green)", fontWeight: 700 }}>{avgMoic.toFixed(2)}x</div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)" }}>
              {cols.map((col) => (
                <th
                  key={col.key}
                  className="px-3 py-2 cursor-pointer select-none transition-colors"
                  style={{
                    textAlign: col.align ?? "left",
                    color: sortKey === col.key ? "var(--orange)" : "var(--text-muted)",
                    fontSize: "10px",
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    whiteSpace: "nowrap",
                    backgroundColor: "var(--bg-secondary)",
                  }}
                  onClick={() => handleSort(col.key)}
                >
                  {col.label}
                  {sortKey === col.key && (
                    <span className="ml-1">{sortDir === "desc" ? "↓" : "↑"}</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((h, i) => (
              <tr
                key={h.id}
                style={{
                  borderBottom: "1px solid var(--border)",
                  backgroundColor:
                    i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)",
                  cursor: "default",
                }}
                className="transition-colors hover:bg-white/[0.03]"
              >
                {/* Name */}
                <td className="px-3 py-2.5" style={{ color: "var(--text-primary)", fontWeight: 500 }}>
                  {h.name}
                </td>
                {/* Sector */}
                <td className="px-3 py-2.5" style={{ color: "var(--text-secondary)" }}>
                  {h.sector}
                </td>
                {/* Geography */}
                <td className="px-3 py-2.5" style={{ color: "var(--text-secondary)" }}>
                  {h.geography}
                </td>
                {/* Status badge */}
                <td className="px-3 py-2.5">
                  <span
                    className="px-1.5 py-0.5 text-[9px] font-bold tracking-wider"
                    style={{
                      backgroundColor:
                        h.status === "Core"
                          ? "rgba(77,159,255,0.1)"
                          : "rgba(255,109,0,0.1)",
                      color:
                        h.status === "Core"
                          ? "var(--blue)"
                          : "var(--orange)",
                      border: `1px solid ${h.status === "Core" ? "rgba(77,159,255,0.3)" : "rgba(255,109,0,0.3)"}`,
                    }}
                  >
                    {h.status}
                  </span>
                </td>
                {/* Ownership */}
                <td className="px-3 py-2.5 tabular-nums" style={{ color: "var(--text-secondary)" }}>
                  {h.ownership}
                </td>
                {/* Entry */}
                <td className="px-3 py-2.5 tabular-nums" style={{ color: "var(--text-muted)" }}>
                  {h.entryDate}
                </td>
                {/* Cost Basis */}
                <td
                  className="px-3 py-2.5 tabular-nums text-right"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {fmt(h.costBasis)}
                </td>
                {/* Fair Value */}
                <td
                  className="px-3 py-2.5 tabular-nums text-right font-semibold"
                  style={{ color: "var(--text-primary)" }}
                >
                  {fmt(h.fairValue)}
                </td>
                {/* MOIC */}
                <td className="px-3 py-2.5 tabular-nums text-right">
                  <span
                    style={{
                      color:
                        h.grossMoic >= 1.25
                          ? "var(--green)"
                          : h.grossMoic >= 1.1
                            ? "var(--yellow)"
                            : "var(--text-secondary)",
                      fontWeight: 600,
                    }}
                  >
                    {h.grossMoic.toFixed(2)}x
                  </span>
                </td>
                {/* Change */}
                <td className="px-3 py-2.5 tabular-nums text-right">
                  <span
                    style={{
                      color:
                        h.changePercent > 0
                          ? "var(--green)"
                          : h.changePercent < 0
                            ? "var(--red)"
                            : "var(--text-muted)",
                      fontWeight: 500,
                    }}
                  >
                    {h.changePercent > 0 ? "+" : ""}
                    {h.changePercent.toFixed(1)}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div
        className="px-4 py-2 text-[9px] text-right"
        style={{ color: "var(--text-muted)", borderTop: "1px solid var(--border)" }}
      >
        Fair values as of Dec 31, 2024 · Source: Fund Administrator
      </div>
    </div>
  );
}
