import type { SecFiling } from "@/lib/sec-api";

interface FilingsTableProps {
  filings: SecFiling[];
  source: string;
  isLoading?: boolean;
}

const FORM_COLORS: Record<string, string> = {
  "10-K": "var(--orange)",
  "10-Q": "var(--blue)",
  "10-12G": "var(--green)",
  "S-1": "#a78bfa",
  "S-1/A": "#a78bfa",
  "DEF 14A": "var(--yellow)",
  "8-K": "var(--text-secondary)",
};

const FORM_DESC: Record<string, string> = {
  "10-K": "Annual Report (BDC)",
  "10-Q": "Quarterly Report (BDC)",
  "10-12G": "Exchange Act Registration",
  "S-1": "Securities Registration Statement",
  "S-1/A": "Securities Registration Amendment",
  "DEF 14A": "Proxy Statement",
  "8-K": "Current Report",
};

function SkeletonRow() {
  return (
    <tr style={{ borderBottom: "1px solid var(--border)" }}>
      {[60, 200, 80, 80, 140, 40].map((w, i) => (
        <td key={i} className="px-3 py-3">
          <div
            className="h-3 rounded"
            style={{ backgroundColor: "var(--border-bright)", width: `${w}px`, opacity: 0.5 }}
          />
        </td>
      ))}
    </tr>
  );
}

export default function FilingsTable({ filings, source, isLoading }: FilingsTableProps) {
  return (
    <div
      style={{
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderTop: "2px solid var(--blue)",
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
            SEC EDGAR
          </div>
          <div className="text-sm font-bold mt-0.5" style={{ color: "var(--text-primary)" }}>
            Regulatory Filings — 10-K / 10-Q (BDC)
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isLoading ? (
            <span
              className="text-[9px] px-2 py-0.5 font-bold tracking-wider"
              style={{
                backgroundColor: "rgba(255,109,0,0.1)",
                color: "var(--orange)",
                border: "1px solid rgba(255,109,0,0.3)",
              }}
            >
              FETCHING…
            </span>
          ) : source === "sec-edgar" ? (
            <span
              className="text-[9px] px-2 py-0.5 font-bold tracking-wider"
              style={{
                backgroundColor: "rgba(0,192,118,0.1)",
                color: "var(--green)",
                border: "1px solid rgba(0,192,118,0.3)",
              }}
            >
              LIVE · SEC.GOV
            </span>
          ) : (
            <span
              className="text-[9px] px-2 py-0.5 font-bold tracking-wider"
              style={{
                backgroundColor: "rgba(255,208,0,0.1)",
                color: "var(--yellow)",
                border: "1px solid rgba(255,208,0,0.3)",
              }}
            >
              INDICATIVE
            </span>
          )}
          <a
            href="https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0002031750&type=&dateb=&owner=include&count=40"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[9px] px-2 py-0.5 tracking-wider transition-colors"
            style={{
              backgroundColor: "rgba(77,159,255,0.08)",
              color: "var(--blue)",
              border: "1px solid rgba(77,159,255,0.2)",
              textDecoration: "none",
            }}
          >
            EDGAR →
          </a>
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
              {["Form", "Description", "Period", "Filed", "Accession #", ""].map((h) => (
                <th
                  key={h}
                  className="px-3 py-2 text-left"
                  style={{
                    color: "var(--text-muted)",
                    fontSize: "10px",
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    whiteSpace: "nowrap",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
              : filings.map((f, i) => (
                  <tr
                    key={f.accessionNumber}
                    style={{
                      borderBottom: "1px solid var(--border)",
                      backgroundColor:
                        i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)",
                    }}
                    className="transition-colors hover:bg-white/[0.03]"
                  >
                    {/* Form badge */}
                    <td className="px-3 py-2.5">
                      <span
                        className="px-2 py-0.5 text-[10px] font-bold tracking-wider"
                        style={{
                          backgroundColor: `${FORM_COLORS[f.form] ?? "#555"}15`,
                          color: FORM_COLORS[f.form] ?? "var(--text-muted)",
                          border: `1px solid ${FORM_COLORS[f.form] ?? "#555"}30`,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {f.form}
                      </span>
                    </td>

                    {/* Description */}
                    <td
                      className="px-3 py-2.5"
                      style={{ color: "var(--text-secondary)", maxWidth: "280px" }}
                    >
                      {f.description || FORM_DESC[f.form] || f.form}
                    </td>

                    {/* Report date */}
                    <td
                      className="px-3 py-2.5 tabular-nums"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {f.reportDate || "—"}
                    </td>

                    {/* Filing date */}
                    <td
                      className="px-3 py-2.5 tabular-nums"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {f.filingDate}
                    </td>

                    {/* Accession # */}
                    <td
                      className="px-3 py-2.5 tabular-nums font-mono text-[10px]"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {f.accessionNumber}
                    </td>

                    {/* Link */}
                    <td className="px-3 py-2.5">
                      <a
                        href={f.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[9px] px-1.5 py-0.5 transition-colors"
                        style={{
                          color: "var(--blue)",
                          border: "1px solid rgba(77,159,255,0.2)",
                          textDecoration: "none",
                        }}
                      >
                        VIEW
                      </a>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      <div
        className="px-4 py-2 text-[9px]"
        style={{ color: "var(--text-muted)", borderTop: "1px solid var(--border)" }}
      >
        CIK: 0002031750 · BDC under Investment Company Act of 1940 · Files 10-K (annual) and 10-Q (quarterly) · Manager: Ares Capital Management II LLC
      </div>
    </div>
  );
}
