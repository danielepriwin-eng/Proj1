interface Filing {
  accessionNumber: string;
  filingDate: string;
  form: string;
  description: string;
  reportDate: string;
  url: string;
}

interface FilingsTableProps {
  filings: Filing[];
  source: string;
}

const FORM_COLORS: Record<string, string> = {
  "N-PORT": "var(--orange)",
  "N-CSR": "var(--blue)",
  "N-CEN": "var(--yellow)",
  "N-2": "var(--green)",
  "D": "var(--text-secondary)",
  "ADV": "#a78bfa",
};

export default function FilingsTable({ filings, source }: FilingsTableProps) {
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
          <div
            className="text-sm font-bold mt-0.5"
            style={{ color: "var(--text-primary)" }}
          >
            Recent Regulatory Filings
          </div>
        </div>
        <div className="flex items-center gap-2">
          {source === "sec-edgar" ? (
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
              INDICATIVE DATA
            </span>
          )}
          <a
            href="https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001803164&type=&dateb=&owner=include&count=40"
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
            VIEW ALL →
          </a>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)", backgroundColor: "var(--bg-secondary)" }}>
              {["Form", "Description", "Report Date", "Filed", "Accession #", ""].map(
                (h) => (
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
                )
              )}
            </tr>
          </thead>
          <tbody>
            {filings.map((f, i) => (
              <tr
                key={f.accessionNumber}
                style={{
                  borderBottom: "1px solid var(--border)",
                  backgroundColor:
                    i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)",
                }}
                className="transition-colors hover:bg-white/[0.03]"
              >
                {/* Form type badge */}
                <td className="px-3 py-2.5">
                  <span
                    className="px-2 py-0.5 text-[10px] font-bold tracking-wider"
                    style={{
                      backgroundColor: `${FORM_COLORS[f.form] ?? "var(--text-muted)"}15`,
                      color: FORM_COLORS[f.form] ?? "var(--text-muted)",
                      border: `1px solid ${FORM_COLORS[f.form] ?? "var(--text-muted)"}30`,
                    }}
                  >
                    {f.form}
                  </span>
                </td>

                {/* Description */}
                <td
                  className="px-3 py-2.5"
                  style={{ color: "var(--text-secondary)", maxWidth: "220px" }}
                >
                  {f.description}
                </td>

                {/* Report Date */}
                <td
                  className="px-3 py-2.5 tabular-nums"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {f.reportDate || "—"}
                </td>

                {/* Filing Date */}
                <td
                  className="px-3 py-2.5 tabular-nums"
                  style={{ color: "var(--text-muted)" }}
                >
                  {f.filingDate}
                </td>

                {/* Accession Number */}
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
        CIK: 0001803164 · EDGAR: sec.gov · Form types: N-PORT (portfolio holdings), N-CSR (shareholder reports), N-CEN (annual census), N-2 (registration)
      </div>
    </div>
  );
}
