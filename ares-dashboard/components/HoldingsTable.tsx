"use client";

import { useState } from "react";
import type { Holding, HoldingCategory } from "@/lib/sec-api";

interface HoldingsTableProps {
  holdings: Holding[];
  isLoading?: boolean;
}

type TabFilter = "all" | HoldingCategory;

function fmt(n: number): string {
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(0)}M`;
  return `$${n.toLocaleString()}`;
}

const SENIORITY_COLOR: Record<string, string> = {
  "First Lien / Senior Secured": "var(--green)",
  "Senior Secured / First Lien": "var(--green)",
  "Preferred Equity / Mezz": "var(--yellow)",
  "Mezzanine / Subordinated": "var(--orange)",
};

function SkeletonRow() {
  return (
    <tr style={{ borderBottom: "1px solid var(--border)" }}>
      {Array.from({ length: 9 }).map((_, i) => (
        <td key={i} className="px-3 py-3">
          <div
            className="h-3 rounded"
            style={{
              backgroundColor: "var(--border-bright)",
              width: i === 0 ? "140px" : i === 1 ? "90px" : "60px",
              opacity: 0.6,
            }}
          />
        </td>
      ))}
    </tr>
  );
}

export default function HoldingsTable({ holdings, isLoading }: HoldingsTableProps) {
  const [tab, setTab] = useState<TabFilter>("all");
  const [sortKey, setSortKey] = useState<keyof Holding>("fairValue");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const filtered =
    tab === "all" ? holdings : holdings.filter((h) => h.category === tab);

  const sorted = [...filtered].sort((a, b) => {
    const av = a[sortKey];
    const bv = b[sortKey];
    const cmp =
      typeof av === "number" && typeof bv === "number"
        ? av - bv
        : String(av ?? "").localeCompare(String(bv ?? ""));
    return sortDir === "desc" ? -cmp : cmp;
  });

  const handleSort = (key: keyof Holding) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("desc"); }
  };

  const equityCount = holdings.filter((h) => h.category === "equity").length;
  const debtCount = holdings.filter((h) => h.category === "debt").length;

  const totalFV = filtered.reduce((s, h) => s + h.fairValue, 0);
  const totalCost = filtered.reduce((s, h) => s + h.costBasis, 0);
  const avgMoic = filtered.length
    ? filtered.reduce((s, h) => s + h.grossMoic, 0) / filtered.length
    : 0;

  const tabs: { key: TabFilter; label: string; count: number; color: string }[] = [
    { key: "all", label: "ALL", count: holdings.length, color: "var(--text-secondary)" },
    { key: "equity", label: "EQUITY", count: equityCount, color: "var(--orange)" },
    { key: "debt", label: "DEBT / CREDIT", count: debtCount, color: "var(--blue)" },
  ];

  // Column definitions differ by tab
  const isDebtView = tab === "debt";
  const isAllView = tab === "all";

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
        className="flex items-center justify-between px-4 pt-3 pb-0"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <div className="pb-3">
          <div
            className="text-[10px] tracking-widest uppercase font-medium"
            style={{ color: "var(--text-muted)" }}
          >
            Portfolio Schedule of Investments
          </div>
          <div
            className="text-sm font-bold mt-0.5"
            style={{ color: "var(--text-primary)" }}
          >
            Ares Core Infrastructure Fund — {holdings.length} Investments
          </div>
        </div>

        <div className="flex items-center gap-6 text-xs pb-3">
          <div className="text-right">
            <div style={{ color: "var(--text-muted)", fontSize: "10px" }}>
              {tab === "all" ? "TOTAL FMV" : tab === "equity" ? "EQUITY FMV" : "DEBT FMV"}
            </div>
            <div style={{ color: "var(--orange)", fontWeight: 700 }}>{fmt(totalFV)}</div>
          </div>
          <div className="text-right">
            <div style={{ color: "var(--text-muted)", fontSize: "10px" }}>COST</div>
            <div style={{ color: "var(--text-secondary)", fontWeight: 600 }}>{fmt(totalCost)}</div>
          </div>
          <div className="text-right">
            <div style={{ color: "var(--text-muted)", fontSize: "10px" }}>AVG MOIC</div>
            <div style={{ color: "var(--green)", fontWeight: 700 }}>
              {avgMoic.toFixed(2)}x
            </div>
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div
        className="flex items-center gap-0 px-4"
        style={{ borderBottom: "1px solid var(--border)", backgroundColor: "var(--bg-secondary)" }}
      >
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className="flex items-center gap-1.5 px-4 py-2 text-[11px] tracking-widest uppercase transition-colors"
            style={{
              color: tab === t.key ? t.color : "var(--text-muted)",
              borderBottom: `2px solid ${tab === t.key ? t.color : "transparent"}`,
              background: "transparent",
              cursor: "pointer",
              fontWeight: tab === t.key ? 600 : 400,
            }}
          >
            {t.label}
            <span
              className="text-[9px] px-1 py-0.5 tabular-nums"
              style={{
                backgroundColor: tab === t.key ? `${t.color}15` : "transparent",
                color: tab === t.key ? t.color : "var(--text-muted)",
                border: `1px solid ${tab === t.key ? `${t.color}40` : "transparent"}`,
              }}
            >
              {t.count}
            </span>
          </button>
        ))}

        {/* Category legend */}
        <div className="ml-auto flex items-center gap-4 text-[9px] py-2">
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "var(--orange)" }} />
            <span style={{ color: "var(--text-muted)" }}>Equity / JV</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "var(--blue)" }} />
            <span style={{ color: "var(--text-muted)" }}>Debt / Preferred</span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr
              style={{
                borderBottom: "1px solid var(--border)",
                backgroundColor: "var(--bg-secondary)",
              }}
            >
              {/* Common columns */}
              {[
                { key: "name" as keyof Holding, label: "Investment", w: "" },
                { key: "instrumentType" as keyof Holding, label: "Instrument", w: "" },
                { key: "sector" as keyof Holding, label: "Sector", w: "" },
                { key: "geography" as keyof Holding, label: "Geography", w: "" },
                { key: "entryDate" as keyof Holding, label: "Entry", w: "" },
                { key: "costBasis" as keyof Holding, label: "Cost", w: "right" },
                { key: "fairValue" as keyof Holding, label: "Fair Value", w: "right" },
                { key: "grossMoic" as keyof Holding, label: "MOIC", w: "right" },
              ].map((col) => (
                <th
                  key={col.key}
                  className="px-3 py-2 cursor-pointer select-none"
                  style={{
                    textAlign: (col.w === "right" ? "right" : "left") as "right" | "left",
                    color: sortKey === col.key ? "var(--orange)" : "var(--text-muted)",
                    fontSize: "10px",
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    whiteSpace: "nowrap",
                  }}
                  onClick={() => handleSort(col.key)}
                >
                  {col.label}
                  {sortKey === col.key && (
                    <span className="ml-1">{sortDir === "desc" ? "↓" : "↑"}</span>
                  )}
                </th>
              ))}
              {/* Conditional last column */}
              <th
                className="px-3 py-2"
                style={{
                  textAlign: "left",
                  color: "var(--text-muted)",
                  fontSize: "10px",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  whiteSpace: "nowrap",
                }}
              >
                {isDebtView ? "Coupon / Maturity" : isAllView ? "Type" : "Partners / Notes"}
              </th>
            </tr>
          </thead>

          <tbody>
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)
              : sorted.map((h, i) => {
                  const catColor =
                    h.category === "equity" ? "var(--orange)" : "var(--blue)";
                  return (
                    <tr
                      key={h.id}
                      style={{
                        borderBottom: "1px solid var(--border)",
                        backgroundColor:
                          i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)",
                      }}
                      className="transition-colors hover:bg-white/[0.03]"
                    >
                      {/* Name + category dot */}
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: catColor }}
                          />
                          <span
                            style={{
                              color: "var(--text-primary)",
                              fontWeight: 500,
                              maxWidth: "200px",
                              display: "block",
                            }}
                          >
                            {h.name}
                          </span>
                        </div>
                      </td>

                      {/* Instrument type */}
                      <td className="px-3 py-2.5">
                        <span
                          className="px-1.5 py-0.5 text-[9px] font-bold tracking-wider"
                          style={{
                            backgroundColor: `${catColor}12`,
                            color: catColor,
                            border: `1px solid ${catColor}30`,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {h.instrumentType}
                        </span>
                      </td>

                      {/* Sector */}
                      <td
                        className="px-3 py-2.5 text-[11px]"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {h.sector}
                      </td>

                      {/* Geography */}
                      <td
                        className="px-3 py-2.5 text-[11px]"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {h.geography}
                      </td>

                      {/* Entry date */}
                      <td
                        className="px-3 py-2.5 tabular-nums text-[11px]"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {h.entryDate}
                      </td>

                      {/* Cost basis */}
                      <td
                        className="px-3 py-2.5 tabular-nums text-right text-[11px]"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {fmt(h.costBasis)}
                      </td>

                      {/* Fair value */}
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
                              h.grossMoic >= 1.15
                                ? "var(--green)"
                                : h.grossMoic >= 1.05
                                  ? "var(--yellow)"
                                  : "var(--text-secondary)",
                            fontWeight: 600,
                          }}
                        >
                          {h.grossMoic.toFixed(2)}x
                        </span>
                      </td>

                      {/* Conditional last column */}
                      <td className="px-3 py-2.5 text-[10px]">
                        {h.category === "debt" && h.coupon ? (
                          <div>
                            <div style={{ color: "var(--green)", fontWeight: 600 }}>
                              {h.coupon}
                            </div>
                            <div style={{ color: "var(--text-muted)" }}>
                              Mat. {h.maturity}
                            </div>
                            {h.seniority && (
                              <div
                                style={{
                                  color:
                                    SENIORITY_COLOR[h.seniority] ?? "var(--text-muted)",
                                  fontSize: "9px",
                                  marginTop: "1px",
                                }}
                              >
                                {h.seniority}
                              </div>
                            )}
                          </div>
                        ) : h.category === "equity" && h.partners ? (
                          <div
                            className="text-[10px]"
                            style={{
                              color: "var(--text-muted)",
                              maxWidth: "200px",
                              lineHeight: "1.3",
                            }}
                          >
                            {h.partners}
                          </div>
                        ) : (
                          <span style={{ color: "var(--text-muted)" }}>—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
          </tbody>
        </table>
      </div>

      {/* Capacity footnotes */}
      {!isLoading && (
        <div
          className="px-4 py-2 flex flex-wrap gap-x-6 gap-y-1"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          {sorted.map((h) => (
            <div key={h.id} className="text-[9px]" style={{ color: "var(--text-muted)" }}>
              <span style={{ color: "var(--text-secondary)" }}>{h.name.split(" ")[0]}: </span>
              {h.capacity}
            </div>
          ))}
        </div>
      )}

      <div
        className="px-4 py-2 text-[9px] text-right"
        style={{ color: "var(--text-muted)", borderTop: "1px solid var(--border)" }}
      >
        Fair values as reported in SEC 10-K/10-Q filings (CIK 0002031750) and public disclosures · Indicative for unreported periods
      </div>
    </div>
  );
}
