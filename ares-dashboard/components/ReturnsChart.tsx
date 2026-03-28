"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from "recharts";

interface QuarterlyReturn {
  quarter: string;
  gross: number;
  net: number;
  benchmark: number;
}

interface ReturnsChartProps {
  data: QuarterlyReturn[];
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; name: string; color: string }>;
  label?: string;
}) => {
  if (!active || !payload?.length) return null;

  return (
    <div
      className="text-xs p-3"
      style={{
        backgroundColor: "#1a1a1a",
        border: "1px solid var(--border-bright)",
        color: "var(--text-primary)",
        minWidth: "180px",
      }}
    >
      <div
        className="font-bold mb-2 pb-1 tracking-wider"
        style={{
          color: "var(--orange)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        {label}
      </div>
      {payload.map((p) => (
        <div key={p.name} className="flex justify-between gap-4 py-0.5">
          <span style={{ color: p.color }}>
            {p.name === "gross"
              ? "Gross Return"
              : p.name === "net"
                ? "Net Return"
                : "Benchmark"}
          </span>
          <span
            style={{
              color: p.value >= 0 ? "var(--green)" : "var(--red)",
              fontWeight: 600,
            }}
          >
            {p.value >= 0 ? "+" : ""}
            {p.value.toFixed(2)}%
          </span>
        </div>
      ))}
    </div>
  );
};

export default function ReturnsChart({ data }: ReturnsChartProps) {
  return (
    <div
      className="p-4"
      style={{
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderTop: "2px solid var(--green)",
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <div
            className="text-[10px] tracking-widest uppercase font-medium"
            style={{ color: "var(--text-muted)" }}
          >
            Performance
          </div>
          <div
            className="text-base font-bold mt-0.5"
            style={{ color: "var(--text-primary)" }}
          >
            Quarterly Returns vs. Benchmark
          </div>
        </div>
        <div className="flex items-center gap-4 text-[10px]">
          {[
            { color: "var(--orange)", label: "Gross" },
            { color: "var(--green)", label: "Net" },
            { color: "#555", label: "Benchmark" },
          ].map((l) => (
            <div key={l.label} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5" style={{ backgroundColor: l.color }} />
              <span style={{ color: "var(--text-muted)" }}>{l.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ height: "200px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
            barGap={2}
          >
            <CartesianGrid
              strokeDasharray="2 4"
              stroke="#1e1e1e"
              vertical={false}
            />
            <XAxis
              dataKey="quarter"
              tick={{ fill: "#555", fontSize: 9, fontFamily: "IBM Plex Mono" }}
              axisLine={{ stroke: "#1e1e1e" }}
              tickLine={false}
              interval={1}
            />
            <YAxis
              tickFormatter={(v) => `${v}%`}
              tick={{ fill: "#555", fontSize: 10, fontFamily: "IBM Plex Mono" }}
              axisLine={false}
              tickLine={false}
              width={38}
              domain={[-3, 4]}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={0} stroke="#2a2a2a" />
            <Bar dataKey="gross" fill="#ff6d00" opacity={0.8} radius={[1, 1, 0, 0]} maxBarSize={12} />
            <Bar dataKey="net" fill="#00c076" opacity={0.8} radius={[1, 1, 0, 0]} maxBarSize={12} />
            <Bar dataKey="benchmark" fill="#333" opacity={0.9} radius={[1, 1, 0, 0]} maxBarSize={12} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
