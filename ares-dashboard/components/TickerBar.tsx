"use client";

interface TickerItem {
  label: string;
  value: string;
  change: number;
}

const TICKERS: TickerItem[] = [
  { label: "NAV/UNIT", value: "$112.34", change: 0.48 },
  { label: "AUM", value: "$7.34B", change: 0.0 },
  { label: "NET IRR (INCEPTION)", value: "9.4%", change: 0.0 },
  { label: "GROSS IRR", value: "11.2%", change: 0.0 },
  { label: "TVPI", value: "1.24x", change: 0.0 },
  { label: "DPI", value: "0.18x", change: 0.0 },
  { label: "YTD RETURN", value: "+5.21%", change: 5.21 },
  { label: "1M RETURN", value: "+0.48%", change: 0.48 },
  { label: "LEVERAGE", value: "42.3%", change: 0.0 },
  { label: "OCCUPANCY", value: "97.8%", change: 0.0 },
  { label: "# INVESTMENTS", value: "24", change: 0.0 },
  { label: "TOTAL COMMITTED", value: "$8.20B", change: 0.0 },
];

export default function TickerBar() {
  const doubled = [...TICKERS, ...TICKERS];

  return (
    <div
      className="ticker-wrap border-b"
      style={{
        borderColor: "var(--border)",
        backgroundColor: "var(--bg-secondary)",
        height: "32px",
        display: "flex",
        alignItems: "center",
      }}
    >
      <div className="ticker-inner flex items-center gap-0">
        {doubled.map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-1.5 px-4 text-xs"
            style={{ borderRight: "1px solid var(--border)" }}
          >
            <span style={{ color: "var(--text-muted)" }}>{item.label}</span>
            <span
              style={{
                color:
                  item.change > 0
                    ? "var(--green)"
                    : item.change < 0
                      ? "var(--red)"
                      : "var(--text-primary)",
                fontWeight: 600,
              }}
            >
              {item.value}
            </span>
            {item.change !== 0 && (
              <span
                className="text-[10px]"
                style={{
                  color: item.change > 0 ? "var(--green)" : "var(--red)",
                }}
              >
                {item.change > 0 ? "▲" : "▼"}
              </span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
