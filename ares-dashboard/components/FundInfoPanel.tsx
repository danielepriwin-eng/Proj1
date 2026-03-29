interface FundInfo {
  name: string;
  cik: string;
  manager: string;
  fundType: string;
  strategy: string;
  geography: string;
  vintage: string;
  reportingCurrency: string;
  fiscalYearEnd: string;
  lastUpdated: string;
}

interface FundInfoPanelProps {
  info: FundInfo;
}

const rows: { label: string; key: keyof FundInfo }[] = [
  { label: "Manager", key: "manager" },
  { label: "Fund Type", key: "fundType" },
  { label: "Strategy", key: "strategy" },
  { label: "Geography", key: "geography" },
  { label: "Vintage Year", key: "vintage" },
  { label: "Reporting Currency", key: "reportingCurrency" },
  { label: "Fiscal Year End", key: "fiscalYearEnd" },
  { label: "SEC CIK", key: "cik" },
  { label: "Data As Of", key: "lastUpdated" },
];

export default function FundInfoPanel({ info }: FundInfoPanelProps) {
  return (
    <div
      style={{
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderTop: "2px solid var(--yellow)",
      }}
    >
      <div
        className="px-4 py-3"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <div
          className="text-[10px] tracking-widest uppercase font-medium"
          style={{ color: "var(--text-muted)" }}
        >
          Fund Profile
        </div>
        <div
          className="text-sm font-bold mt-0.5 truncate"
          style={{ color: "var(--text-primary)" }}
        >
          {info.name}
        </div>
      </div>

      <div className="p-0">
        {rows.map((row, i) => (
          <div
            key={row.key}
            className="flex items-center justify-between px-4 py-2"
            style={{
              borderBottom: i < rows.length - 1 ? "1px solid var(--border)" : "none",
              backgroundColor:
                i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)",
            }}
          >
            <span
              className="text-[10px] tracking-wide uppercase"
              style={{ color: "var(--text-muted)" }}
            >
              {row.label}
            </span>
            <span
              className="text-xs font-medium text-right"
              style={{
                color:
                  row.key === "cik"
                    ? "var(--blue)"
                    : row.key === "strategy" || row.key === "fundType"
                      ? "var(--orange)"
                      : "var(--text-secondary)",
                maxWidth: "180px",
              }}
            >
              {info[row.key]}
            </span>
          </div>
        ))}
      </div>

      <div
        className="px-4 py-2 text-[9px] flex items-center gap-2"
        style={{ borderTop: "1px solid var(--border)", color: "var(--text-muted)" }}
      >
        <span className="live-dot w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: "var(--green)" }} />
        SEC-registered · Evergreen Structure · Quarterly Liquidity Window
      </div>
    </div>
  );
}
