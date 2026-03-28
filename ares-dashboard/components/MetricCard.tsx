interface MetricCardProps {
  label: string;
  value: string;
  subValue?: string;
  change?: number;
  changeLabel?: string;
  accent?: "orange" | "green" | "blue" | "yellow" | "muted";
  size?: "sm" | "md" | "lg";
  badge?: string;
}

const accentColors = {
  orange: "var(--orange)",
  green: "var(--green)",
  blue: "var(--blue)",
  yellow: "var(--yellow)",
  muted: "var(--text-muted)",
};

export default function MetricCard({
  label,
  value,
  subValue,
  change,
  changeLabel,
  accent = "orange",
  size = "md",
  badge,
}: MetricCardProps) {
  const color = accentColors[accent];
  const isPositive = change !== undefined && change > 0;
  const isNegative = change !== undefined && change < 0;

  return (
    <div
      className="relative overflow-hidden p-4 transition-colors"
      style={{
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderTop: `2px solid ${color}`,
      }}
    >
      {/* Top-right badge */}
      {badge && (
        <div
          className="absolute top-2 right-2 text-[9px] px-1.5 py-0.5 tracking-wider font-bold"
          style={{
            backgroundColor: `${color}15`,
            color: color,
            border: `1px solid ${color}30`,
          }}
        >
          {badge}
        </div>
      )}

      {/* Label */}
      <div
        className="text-[10px] tracking-widest uppercase mb-2 font-medium"
        style={{ color: "var(--text-muted)" }}
      >
        {label}
      </div>

      {/* Main value */}
      <div
        className={`font-bold tabular-nums ${
          size === "lg" ? "text-2xl" : size === "md" ? "text-xl" : "text-base"
        }`}
        style={{ color: "var(--text-primary)", letterSpacing: "-0.01em" }}
      >
        {value}
      </div>

      {/* Sub value */}
      {subValue && (
        <div
          className="text-xs mt-1 tabular-nums"
          style={{ color: "var(--text-secondary)" }}
        >
          {subValue}
        </div>
      )}

      {/* Change */}
      {change !== undefined && (
        <div className="flex items-center gap-1.5 mt-2">
          <span
            className="text-xs font-semibold tabular-nums"
            style={{
              color: isPositive
                ? "var(--green)"
                : isNegative
                  ? "var(--red)"
                  : "var(--text-muted)",
            }}
          >
            {isPositive ? "+" : ""}
            {change.toFixed(2)}%
          </span>
          {changeLabel && (
            <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>
              {changeLabel}
            </span>
          )}
        </div>
      )}

      {/* Bottom accent line */}
      <div
        className="absolute bottom-0 left-0 h-px"
        style={{
          width: "40%",
          backgroundColor: color,
          opacity: 0.4,
        }}
      />
    </div>
  );
}
