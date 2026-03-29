"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

interface NavDataPoint {
  quarter: string;
  nav: number;
  navPerUnit: number;
}

interface NavChartProps {
  data: NavDataPoint[];
  isLoading?: boolean;
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; dataKey: string }>;
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
        minWidth: "160px",
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
        <div key={p.dataKey} className="flex justify-between gap-4 py-0.5">
          <span style={{ color: "var(--text-muted)" }}>
            {p.dataKey === "nav" ? "Fund NAV" : "NAV / Unit"}
          </span>
          <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>
            {p.dataKey === "nav"
              ? `$${(p.value / 1e9).toFixed(2)}B`
              : `$${p.value.toFixed(2)}`}
          </span>
        </div>
      ))}
    </div>
  );
};

export default function NavChart({ data, isLoading }: NavChartProps) {
  return (
    <div
      className="p-4"
      style={{
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderTop: "2px solid var(--orange)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div
            className="text-[10px] tracking-widest uppercase font-medium"
            style={{ color: "var(--text-muted)" }}
          >
            Net Asset Value
          </div>
          <div
            className="text-base font-bold mt-0.5"
            style={{ color: "var(--text-primary)" }}
          >
            Fund NAV & NAV Per Unit — Quarterly
          </div>
        </div>
        <div className="flex items-center gap-4 text-[10px]">
          <div className="flex items-center gap-1.5">
            <div
              className="w-3 h-0.5"
              style={{ backgroundColor: "var(--orange)" }}
            />
            <span style={{ color: "var(--text-muted)" }}>Fund NAV ($B)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div
              className="w-3 h-0.5"
              style={{ backgroundColor: "var(--blue)" }}
            />
            <span style={{ color: "var(--text-muted)" }}>NAV/Unit</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div style={{ height: "220px" }}>
        {isLoading ? (
          <div
            className="w-full h-full flex items-end gap-1 px-2 pb-4"
            style={{ opacity: 0.3 }}
          >
            {[40, 55, 48, 62, 70, 75, 80, 85, 90, 88, 94, 100].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t"
                style={{
                  height: `${h}%`,
                  backgroundColor: "var(--orange)",
                  opacity: 0.4 + i * 0.05,
                }}
              />
            ))}
          </div>
        ) : (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="navGradient" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="#ff6d00"
                  stopOpacity={0.25}
                />
                <stop offset="95%" stopColor="#ff6d00" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="unitGradient" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="#4d9fff"
                  stopOpacity={0.2}
                />
                <stop offset="95%" stopColor="#4d9fff" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="2 4"
              stroke="#1e1e1e"
              vertical={false}
            />
            <XAxis
              dataKey="quarter"
              tick={{ fill: "#555", fontSize: 10, fontFamily: "IBM Plex Mono" }}
              axisLine={{ stroke: "#1e1e1e" }}
              tickLine={false}
              interval={2}
            />
            <YAxis
              yAxisId="nav"
              orientation="left"
              tickFormatter={(v) => `$${(v / 1e9).toFixed(1)}B`}
              tick={{ fill: "#555", fontSize: 10, fontFamily: "IBM Plex Mono" }}
              axisLine={false}
              tickLine={false}
              width={55}
            />
            <YAxis
              yAxisId="unit"
              orientation="right"
              domain={[95, 120]}
              tickFormatter={(v) => `$${v}`}
              tick={{ fill: "#555", fontSize: 10, fontFamily: "IBM Plex Mono" }}
              axisLine={false}
              tickLine={false}
              width={45}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine
              yAxisId="unit"
              y={100}
              stroke="#555"
              strokeDasharray="3 3"
              label={{
                value: "Inception",
                fill: "#555",
                fontSize: 9,
                fontFamily: "IBM Plex Mono",
              }}
            />
            <Area
              yAxisId="nav"
              type="monotone"
              dataKey="nav"
              stroke="#ff6d00"
              strokeWidth={2}
              fill="url(#navGradient)"
              dot={false}
              activeDot={{ r: 4, fill: "#ff6d00", stroke: "#000", strokeWidth: 2 }}
            />
            <Area
              yAxisId="unit"
              type="monotone"
              dataKey="navPerUnit"
              stroke="#4d9fff"
              strokeWidth={1.5}
              fill="url(#unitGradient)"
              dot={false}
              activeDot={{ r: 3, fill: "#4d9fff", stroke: "#000", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
