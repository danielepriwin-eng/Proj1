"use client";

import { useState, useEffect } from "react";

export default function Header() {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZone: "America/New_York",
        })
      );
      setDate(
        now.toLocaleDateString("en-US", {
          weekday: "short",
          year: "numeric",
          month: "short",
          day: "2-digit",
          timeZone: "America/New_York",
        })
      );
    };
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <header
      style={{
        backgroundColor: "var(--bg-secondary)",
        borderBottom: "2px solid var(--orange)",
      }}
    >
      {/* Top strip */}
      <div
        className="flex items-center justify-between px-4 py-2"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        {/* Left: brand */}
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center w-8 h-8 text-xs font-bold"
            style={{
              backgroundColor: "var(--orange)",
              color: "#000",
              letterSpacing: "0.05em",
            }}
          >
            A
          </div>
          <div>
            <div
              className="text-sm font-semibold tracking-widest uppercase"
              style={{ color: "var(--orange)", letterSpacing: "0.15em" }}
            >
              Ares Management
            </div>
            <div
              className="text-[10px] tracking-wider uppercase"
              style={{ color: "var(--text-muted)" }}
            >
              Infrastructure — Portfolio Intelligence
            </div>
          </div>
        </div>

        {/* Center: fund name */}
        <div className="hidden md:flex flex-col items-center">
          <div
            className="text-xs font-bold tracking-widest uppercase"
            style={{ color: "var(--text-secondary)", letterSpacing: "0.2em" }}
          >
            Core Infrastructure Partners, L.P.
          </div>
          <div
            className="text-[10px] mt-0.5"
            style={{ color: "var(--text-muted)" }}
          >
            SEC Registered · Evergreen · CIK 0001803164
          </div>
        </div>

        {/* Right: clock */}
        <div className="flex flex-col items-end gap-0.5">
          <div className="flex items-center gap-2">
            <span className="live-dot w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: "var(--green)" }} />
            <span className="text-xs font-bold tabular-nums" style={{ color: "var(--green)" }}>
              {time} ET
            </span>
          </div>
          <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>
            {date}
          </div>
        </div>
      </div>

      {/* Nav bar */}
      <div className="flex items-center gap-0 px-4 h-8 text-xs" style={{ color: "var(--text-muted)" }}>
        {["OVERVIEW", "HOLDINGS", "PERFORMANCE", "FILINGS", "RISK"].map((tab, i) => (
          <button
            key={tab}
            className="px-4 h-full transition-colors text-[11px] tracking-widest uppercase"
            style={{
              color: i === 0 ? "var(--orange)" : "var(--text-muted)",
              borderBottom: i === 0 ? "2px solid var(--orange)" : "2px solid transparent",
              background: "transparent",
              cursor: "pointer",
            }}
          >
            {tab}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-3 text-[10px]">
          <span style={{ color: "var(--text-muted)" }}>AS OF</span>
          <span style={{ color: "var(--text-secondary)" }}>DEC 31, 2024</span>
          <span
            className="px-2 py-0.5 text-[9px] font-bold tracking-wider"
            style={{
              backgroundColor: "rgba(255,109,0,0.1)",
              color: "var(--orange)",
              border: "1px solid rgba(255,109,0,0.3)",
            }}
          >
            QUARTERLY
          </span>
        </div>
      </div>
    </header>
  );
}
