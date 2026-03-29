"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface AllocationItem {
  sector?: string;
  region?: string;
  value: number;
  color: string;
}

interface AllocationChartProps {
  sectorData: AllocationItem[];
  geoData: AllocationItem[];
  isLoading?: boolean;
}

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; payload: { color: string } }>;
}) => {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div
      className="text-xs p-2.5"
      style={{
        backgroundColor: "#1a1a1a",
        border: `1px solid ${d.payload.color}40`,
        color: "var(--text-primary)",
      }}
    >
      <div style={{ color: d.payload.color, fontWeight: 600 }}>{d.name}</div>
      <div style={{ color: "var(--text-secondary)" }}>
        {d.value.toFixed(1)}% of portfolio
      </div>
    </div>
  );
};

function DonutChart({
  data,
  title,
  subtitle,
  accentColor,
}: {
  data: AllocationItem[];
  title: string;
  subtitle: string;
  accentColor: string;
}) {
  return (
    <div
      className="p-4 flex-1"
      style={{
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderTop: `2px solid ${accentColor}`,
      }}
    >
      <div className="mb-3">
        <div
          className="text-[10px] tracking-widest uppercase font-medium"
          style={{ color: "var(--text-muted)" }}
        >
          {subtitle}
        </div>
        <div
          className="text-sm font-bold mt-0.5"
          style={{ color: "var(--text-primary)" }}
        >
          {title}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Donut */}
        <div style={{ width: 110, height: 110, flexShrink: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={32}
                outerRadius={50}
                paddingAngle={2}
                dataKey="value"
                nameKey="sector|region"
                startAngle={90}
                endAngle={-270}
                strokeWidth={0}
              >
                {data.map((entry, i) => (
                  <Cell key={i} fill={entry.color} opacity={0.9} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-1.5 flex-1">
          {data.map((item) => (
            <div key={item.sector ?? item.region} className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span
                  className="text-[10px] truncate"
                  style={{ color: "var(--text-secondary)", maxWidth: "110px" }}
                >
                  {item.sector ?? item.region}
                </span>
              </div>
              <span
                className="text-[10px] tabular-nums font-semibold ml-2"
                style={{ color: item.color }}
              >
                {item.value.toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AllocationSkeleton({ accentColor }: { accentColor: string }) {
  return (
    <div
      className="p-4 flex-1"
      style={{
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderTop: `2px solid ${accentColor}`,
      }}
    >
      <div className="h-2 w-16 rounded mb-2" style={{ backgroundColor: "var(--border-bright)", opacity: 0.6 }} />
      <div className="h-3 w-24 rounded mb-4" style={{ backgroundColor: "var(--border-bright)", opacity: 0.5 }} />
      <div className="flex items-center gap-4">
        <div className="w-[110px] h-[110px] rounded-full border-[18px]" style={{ borderColor: "var(--border-bright)", opacity: 0.4, flexShrink: 0 }} />
        <div className="flex flex-col gap-2 flex-1">
          {[80, 65, 90, 55, 70].map((w, i) => (
            <div key={i} className="flex justify-between">
              <div className="h-2 rounded" style={{ width: `${w}%`, backgroundColor: "var(--border-bright)", opacity: 0.4 }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AllocationChart({
  sectorData,
  geoData,
  isLoading,
}: AllocationChartProps) {
  if (isLoading) {
    return (
      <div className="flex gap-3">
        <AllocationSkeleton accentColor="var(--orange)" />
        <AllocationSkeleton accentColor="var(--blue)" />
      </div>
    );
  }

  return (
    <div className="flex gap-3">
      <DonutChart
        data={sectorData}
        title="By Sector"
        subtitle="Allocation"
        accentColor="var(--orange)"
      />
      <DonutChart
        data={geoData}
        title="By Geography"
        subtitle="Allocation"
        accentColor="var(--blue)"
      />
    </div>
  );
}
