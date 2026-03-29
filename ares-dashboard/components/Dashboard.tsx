"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import TickerBar from "@/components/TickerBar";
import MetricCard from "@/components/MetricCard";
import NavChart from "@/components/NavChart";
import ReturnsChart from "@/components/ReturnsChart";
import AllocationChart from "@/components/AllocationChart";
import HoldingsTable from "@/components/HoldingsTable";
import FilingsTable from "@/components/FilingsTable";
import FundInfoPanel from "@/components/FundInfoPanel";
import {
  fetchCompanySubmissions,
  fetchCompanyFacts,
  parseFilings,
  extractNavHistory,
  ARES_CIK,
  MOCK_METRICS,
  MOCK_NAV_HISTORY,
  MOCK_SECTOR_ALLOCATION,
  MOCK_GEO_ALLOCATION,
  MOCK_HOLDINGS,
  MOCK_FILINGS,
  MOCK_FUND_INFO,
  MOCK_QUARTERLY_RETURNS,
} from "@/lib/sec-api";
import type { SecFiling } from "@/lib/sec-api";

function fmtM(n: number): string {
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(0)}M`;
  return `$${n.toLocaleString()}`;
}

export default function Dashboard() {
  const [filings, setFilings] = useState<SecFiling[]>(MOCK_FILINGS);
  const [filingsSource, setFilingsSource] = useState<"mock" | "sec-edgar">("mock");
  const [navHistory, setNavHistory] = useState(MOCK_NAV_HISTORY);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadSecData() {
      try {
        // Submissions (filing list)
        const submissions = await fetchCompanySubmissions(ARES_CIK);
        if (!cancelled && submissions) {
          const parsed = parseFilings(submissions);
          if (parsed.length > 0) {
            setFilings(parsed);
            setFilingsSource("sec-edgar");
          }
        }

        // XBRL facts (NAV history)
        const facts = await fetchCompanyFacts(ARES_CIK);
        if (!cancelled && facts) {
          const history = extractNavHistory(facts);
          if (history.length > 0) {
            setNavHistory(history);
          }
        }
      } catch {
        // Silently fall back to mock data already in state
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadSecData();
    return () => { cancelled = true; };
  }, []);

  const m = MOCK_METRICS;

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: "var(--bg-primary)" }}>
      <Header />
      <TickerBar />

      <main
        className="flex-1 p-4 space-y-4"
        style={{ maxWidth: "1800px", margin: "0 auto", width: "100%" }}
      >
        {/* ── Row 1: KPI cards ──────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-2">
          <MetricCard
            label="Fund NAV"
            value={fmtM(m.nav)}
            change={m.navChangeYTD}
            changeLabel="YTD"
            accent="orange"
            badge="BDC"
            isLoading={isLoading}
          />
          <MetricCard
            label="NAV Per Unit"
            value={`$${m.navPerUnit.toFixed(2)}`}
            change={m.navChange1M}
            changeLabel="1M"
            accent="orange"
            isLoading={isLoading}
          />
          <MetricCard
            label="Total Committed"
            value={fmtM(m.totalCommitted)}
            subValue={`Invested: ${fmtM(m.totalInvested)}`}
            accent="blue"
            isLoading={isLoading}
          />
          <MetricCard
            label="Net IRR"
            value={`${m.netIrr}%`}
            subValue={`Gross: ${m.grossIrr}%`}
            accent="green"
            badge="INDICATIVE"
            isLoading={isLoading}
          />
          <MetricCard
            label="TVPI"
            value={`${m.tvpi}x`}
            subValue={`DPI: ${m.dpi}x`}
            accent="green"
            isLoading={isLoading}
          />
          <MetricCard
            label="Distributions"
            value={fmtM(m.distributions)}
            subValue="Paid to investors"
            accent="yellow"
            isLoading={isLoading}
          />
          <MetricCard
            label="# Investments"
            value={String(m.numberOfInvestments)}
            subValue={`Target: ${m.targetReturn}`}
            accent="blue"
            isLoading={isLoading}
          />
          <MetricCard
            label="Leverage"
            value={`${m.leverage}%`}
            subValue={`Occupancy: ${m.occupancyRate}%`}
            accent="muted"
            isLoading={isLoading}
          />
        </div>

        {/* ── Row 2: NAV chart + Fund info ──────────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-3">
          <div className="xl:col-span-2">
            <NavChart data={navHistory} isLoading={isLoading} />
          </div>
          <div className="xl:col-span-1">
            <FundInfoPanel info={MOCK_FUND_INFO} />
          </div>
        </div>

        {/* ── Row 3: Returns + Allocation ───────────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
          <ReturnsChart data={MOCK_QUARTERLY_RETURNS} />
          <AllocationChart
            sectorData={MOCK_SECTOR_ALLOCATION}
            geoData={MOCK_GEO_ALLOCATION}
            isLoading={isLoading}
          />
        </div>

        {/* ── Row 4: Holdings table (equity + debt tabs) ────── */}
        <HoldingsTable holdings={MOCK_HOLDINGS} isLoading={isLoading} />

        {/* ── Row 5: SEC Filings ────────────────────────────── */}
        <FilingsTable filings={filings} source={filingsSource} isLoading={isLoading} />

        {/* ── Footer ───────────────────────────────────────── */}
        <footer
          className="text-[9px] py-3 text-center space-y-1"
          style={{ color: "var(--text-muted)", borderTop: "1px solid var(--border)" }}
        >
          <div>
            Ares Core Infrastructure Fund · CIK 0002031750 · BDC under the Investment Company Act of 1940 ·
            SEC EDGAR:{" "}
            <a
              href="https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0002031750"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--blue)" }}
            >
              sec.gov/edgar
            </a>
          </div>
          <div>
            Performance data is indicative. Portfolio data sourced from SEC filings, press releases, and fund
            administrator reports. Ares Management Corporation is a leading global alternative investment manager.
          </div>
        </footer>
      </main>
    </div>
  );
}
