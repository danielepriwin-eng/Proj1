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
  MOCK_METRICS,
  MOCK_NAV_HISTORY,
  MOCK_SECTOR_ALLOCATION,
  MOCK_GEO_ALLOCATION,
  MOCK_HOLDINGS,
  MOCK_FILINGS,
  MOCK_FUND_INFO,
  MOCK_QUARTERLY_RETURNS,
} from "@/lib/sec-api";

function fmtB(n: number): string {
  return `$${(n / 1e9).toFixed(2)}B`;
}

function fmtM(n: number): string {
  return `$${(n / 1e6).toFixed(0)}M`;
}

export default async function Page() {
  // Attempt to fetch live SEC data; fall back to mock
  let filings = MOCK_FILINGS;
  let filingsSource = "mock";

  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ??
      (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000");

    const res = await fetch(`${baseUrl}/api/sec/submissions`, {
      next: { revalidate: 3600 },
    });

    if (res.ok) {
      const data = await res.json();
      filings = data.filings ?? MOCK_FILINGS;
      filingsSource = data.source ?? "mock";
    }
  } catch {
    // SEC API unreachable — use mock data
  }

  const m = MOCK_METRICS;

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: "var(--bg-primary)" }}>
      <Header />
      <TickerBar />

      <main className="flex-1 p-4 space-y-4" style={{ maxWidth: "1800px", margin: "0 auto", width: "100%" }}>

        {/* ── Row 1: KPI cards ──────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-2">
          <MetricCard
            label="Fund NAV"
            value={fmtB(m.nav)}
            change={m.navChangeYTD}
            changeLabel="YTD"
            accent="orange"
            size="md"
            badge="NAV"
          />
          <MetricCard
            label="NAV Per Unit"
            value={`$${m.navPerUnit.toFixed(2)}`}
            change={m.navChange1M}
            changeLabel="1M"
            accent="orange"
            size="md"
          />
          <MetricCard
            label="Total Committed"
            value={fmtB(m.totalCommitted)}
            subValue={`Invested: ${fmtB(m.totalInvested)}`}
            accent="blue"
          />
          <MetricCard
            label="Net IRR"
            value={`${m.netIrr}%`}
            subValue={`Gross: ${m.grossIrr}%`}
            accent="green"
            badge="INCEPTION"
          />
          <MetricCard
            label="TVPI"
            value={`${m.tvpi}x`}
            subValue={`DPI: ${m.dpi}x`}
            accent="green"
          />
          <MetricCard
            label="Distributions"
            value={fmtM(m.distributions)}
            subValue="Paid to investors"
            accent="yellow"
          />
          <MetricCard
            label="# Investments"
            value={String(m.numberOfInvestments)}
            subValue={`Target: ${m.targetReturn}`}
            accent="blue"
          />
          <MetricCard
            label="Avg Leverage"
            value={`${m.leverage}%`}
            subValue={`Occupancy: ${m.occupancyRate}%`}
            accent="muted"
          />
        </div>

        {/* ── Row 2: NAV chart + Fund info ──────────────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-3">
          <div className="xl:col-span-2">
            <NavChart data={MOCK_NAV_HISTORY} />
          </div>
          <div className="xl:col-span-1">
            <FundInfoPanel info={MOCK_FUND_INFO} />
          </div>
        </div>

        {/* ── Row 3: Returns + Allocation ───────────────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
          <ReturnsChart data={MOCK_QUARTERLY_RETURNS} />
          <AllocationChart
            sectorData={MOCK_SECTOR_ALLOCATION}
            geoData={MOCK_GEO_ALLOCATION}
          />
        </div>

        {/* ── Row 4: Holdings table ─────────────────────────────── */}
        <HoldingsTable holdings={MOCK_HOLDINGS} />

        {/* ── Row 5: SEC Filings ────────────────────────────────── */}
        <FilingsTable filings={filings} source={filingsSource} />

        {/* ── Footer ───────────────────────────────────────────── */}
        <footer
          className="text-[9px] py-3 text-center space-y-1"
          style={{ color: "var(--text-muted)", borderTop: "1px solid var(--border)" }}
        >
          <div>
            Ares Core Infrastructure Partners, L.P. · CIK 0001803164 ·
            SEC EDGAR:{" "}
            <a
              href="https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001803164"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--blue)" }}
            >
              sec.gov
            </a>
          </div>
          <div>
            This dashboard is for informational purposes only. Performance data is
            indicative. Portfolio data sourced from SEC filings and fund
            administrator reports. Ares Management Corporation ("Ares") is a
            leading global alternative investment manager.
          </div>
        </footer>
      </main>
    </div>
  );
}
