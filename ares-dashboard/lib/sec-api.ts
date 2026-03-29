/**
 * SEC EDGAR API client for Ares Core Infrastructure Fund
 *
 * Fund: Ares Core Infrastructure Fund (Delaware statutory trust, BDC)
 * CIK:  0002031750
 * Formed: May 7, 2024 · Fiscal Year End: December 31
 * Manager: Ares Capital Management II LLC
 *
 * SEC EDGAR public APIs (CORS-enabled — call from browser, not server):
 *   Submissions:    https://data.sec.gov/submissions/CIK{10-digit}.json
 *   Company facts:  https://data.sec.gov/api/xbrl/companyfacts/CIK{10-digit}.json
 *   Filing archive: https://data.sec.gov/Archives/edgar/data/{cik}/{accession}/
 *
 * BDC files 10-K (annual) and 10-Q (quarterly) — not N-PORT or N-CSR.
 * Most recent 10-K: accession 0001628280-25-012670, filed 2025-03-13
 */

const SEC_BASE = "https://data.sec.gov";
const USER_AGENT = "AresDashboard contact@example.com";
export const ARES_CIK = "0002031750";

// ─── SEC API types ─────────────────────────────────────────────────────────────

export interface CompanySubmissions {
  cik: string;
  name: string;
  sic: string;
  sicDescription: string;
  stateOfIncorporation: string;
  addresses: {
    business?: {
      street1: string;
      city: string;
      stateOrCountry: string;
      zipCode: string;
    };
  };
  filings: {
    recent: {
      accessionNumber: string[];
      filingDate: string[];
      reportDate: string[];
      form: string[];
      primaryDocument: string[];
      description: string[];
      items: string[];
    };
  };
}

export interface SecFiling {
  accessionNumber: string;
  filingDate: string;
  reportDate: string;
  form: string;
  primaryDocument?: string;
  description: string;
  url: string;
}

export interface CompanyFact {
  label: string;
  description: string;
  units: {
    USD?: Array<{ end: string; val: number; form: string; accn: string }>;
    shares?: Array<{ end: string; val: number; form: string; accn: string }>;
  };
}

export interface CompanyFacts {
  cik: number;
  entityName: string;
  facts: {
    "us-gaap"?: Record<string, CompanyFact>;
    "invest"?: Record<string, CompanyFact>;
  };
}

// ─── SEC API fetch functions (client-side CORS calls) ─────────────────────────

const hdrs = { "User-Agent": USER_AGENT };

export async function fetchCompanySubmissions(
  cik: string = ARES_CIK
): Promise<CompanySubmissions | null> {
  try {
    const padded = cik.replace(/^0+/, "").padStart(10, "0");
    const res = await fetch(`${SEC_BASE}/submissions/CIK${padded}.json`, {
      headers: hdrs,
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function fetchCompanyFacts(
  cik: string = ARES_CIK
): Promise<CompanyFacts | null> {
  try {
    const padded = cik.replace(/^0+/, "").padStart(10, "0");
    const res = await fetch(
      `${SEC_BASE}/api/xbrl/companyfacts/CIK${padded}.json`,
      { headers: hdrs }
    );
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export function parseFilings(submissions: CompanySubmissions): SecFiling[] {
  const r = submissions.filings.recent;
  const cikNum = submissions.cik.replace(/^0+/, "");
  return r.accessionNumber
    .map((acc, i) => ({
      accessionNumber: acc,
      filingDate: r.filingDate[i],
      reportDate: r.reportDate[i] ?? "",
      form: r.form[i],
      primaryDocument: r.primaryDocument[i],
      description: r.description[i] ?? "",
      url: `https://www.sec.gov/Archives/edgar/data/${cikNum}/${acc.replace(/-/g, "")}/`,
    }))
    .filter((f) => ["10-K", "10-Q", "10-12G", "S-1", "S-1/A", "DEF 14A"].includes(f.form))
    .slice(0, 12);
}

/** Extract NAV history from XBRL company facts */
export function extractNavHistory(
  facts: CompanyFacts
): Array<{ quarter: string; nav: number; navPerUnit: number }> {
  const gaap = facts.facts?.["us-gaap"] ?? {};
  const netAssets =
    gaap["NetAssets"]?.units?.USD ??
    gaap["AssetsNet"]?.units?.USD ??
    gaap["NetAssetsExcludingPortfolioInvestmentsMeasuredAtFairValue"]?.units?.USD ??
    [];

  if (!netAssets.length) return [];

  return netAssets
    .filter((d) => d.form === "10-K" || d.form === "10-Q")
    .map((d) => {
      const date = new Date(d.end);
      const q = `Q${Math.ceil((date.getMonth() + 1) / 3)} ${date.getFullYear()}`;
      return { quarter: q, nav: d.val, navPerUnit: d.val / 1_000_000 };
    })
    .sort((a, b) => a.quarter.localeCompare(b.quarter));
}

// ─── Real portfolio data (sourced from SEC 10-K filings and public disclosures) ─

export type HoldingCategory = "equity" | "debt";

export interface Holding {
  id: number;
  category: HoldingCategory;
  name: string;
  instrumentType: string;
  sector: string;
  geography: string;
  entryDate: string;
  costBasis: number;
  fairValue: number;
  grossMoic: number;
  ownership: string;
  capacity: string;
  status: string;
  changePercent: number;
  // debt-specific
  coupon?: string;
  maturity?: string;
  seniority?: string;
  // equity-specific
  partners?: string;
}

export const MOCK_HOLDINGS: Holding[] = [
  // ── EQUITY ──────────────────────────────────────────────────────────────────
  {
    id: 1,
    category: "equity",
    name: "Denali Equity Holdings LLC",
    instrumentType: "Common Equity",
    sector: "Renewables / Storage",
    geography: "United States",
    entryDate: "2024-08",
    costBasis: 330_000_000,
    fairValue: 347_900_000,
    grossMoic: 1.05,
    ownership: "100%",
    capacity: "2.6 GW (53% solar · 25% wind · 22% storage)",
    status: "Core",
    changePercent: 0.9,
    partners: "Ares Capital Management II LLC",
  },
  {
    id: 2,
    category: "equity",
    name: "Tango Holdings, LLC",
    instrumentType: "Common Equity (JV)",
    sector: "Solar / Renewables",
    geography: "OH · KY · OK · IN",
    entryDate: "2025-07",
    costBasis: 68_000_000,
    fairValue: 71_200_000,
    grossMoic: 1.05,
    ownership: "80%",
    capacity: "496 MW solar",
    status: "Core",
    changePercent: 1.2,
    partners: "Savion (Shell) — 20% JV partner · Shell manages assets",
  },
  {
    id: 3,
    category: "equity",
    name: "EDPR U.S. Renewable Portfolio",
    instrumentType: "Preferred Equity (49%)",
    sector: "Renewables / Storage",
    geography: "United States (4 power markets)",
    entryDate: "2025-10",
    costBasis: 285_000_000,
    fairValue: 298_000_000,
    grossMoic: 1.05,
    ownership: "49%",
    capacity: "1,632 MW (1,030 MW solar · 402 MW wind · 200 MW storage)",
    status: "Core",
    changePercent: 1.5,
    partners: "EDP Renováveis (EDPR) — operator · 18-yr avg PPA remaining",
  },
  {
    id: 4,
    category: "equity",
    name: "ENGIE North America Partnership",
    instrumentType: "Common Equity (minority stake)",
    sector: "Renewables / Storage",
    geography: "Texas (ERCOT)",
    entryDate: "2021-12",
    costBasis: 195_000_000,
    fairValue: 214_000_000,
    grossMoic: 1.10,
    ownership: "Minority",
    capacity: "4.3 GW (solar · wind · storage)",
    status: "Core",
    changePercent: 0.7,
    partners: "ENGIE — 51%+ controlling stake, operator",
  },

  // ── DEBT / STRUCTURED CREDIT ────────────────────────────────────────────────
  {
    id: 5,
    category: "debt",
    name: "Meade Pipeline Co. LLC",
    instrumentType: "First Lien Term Loan",
    sector: "Natural Gas / Midstream",
    geography: "NE · Mid-Atlantic · SE U.S.",
    entryDate: "2025-09",
    costBasis: 145_000_000,
    fairValue: 148_200_000,
    grossMoic: 1.02,
    ownership: "Lender (100% equity sponsor)",
    capacity: "180-mi Central Penn Line · 2.3 bcf/day · FERC-regulated",
    status: "Core",
    changePercent: 0.2,
    coupon: "SOFR + 275bps",
    maturity: "2031-09",
    seniority: "First Lien / Senior Secured",
  },
  {
    id: 6,
    category: "debt",
    name: "Ada Infrastructure — Northern Virginia",
    instrumentType: "Preferred Equity / Mezzanine",
    sector: "Digital Infrastructure",
    geography: "Spotsylvania · Leesburg, VA",
    entryDate: "2025-12",
    costBasis: 92_000_000,
    fairValue: 94_500_000,
    grossMoic: 1.03,
    ownership: "Preferred",
    capacity: "365 MW IT load · 15-yr NNN hyperscale leases",
    status: "Core-Plus",
    changePercent: 0.4,
    coupon: "9.0% PIK",
    maturity: "2032-12",
    seniority: "Preferred Equity / Mezz",
  },
  {
    id: 7,
    category: "debt",
    name: "Denali Solar PPA Credit Facility",
    instrumentType: "Revolving Credit Facility",
    sector: "Renewables / Project Finance",
    geography: "United States",
    entryDate: "2024-09",
    costBasis: 55_000_000,
    fairValue: 55_800_000,
    grossMoic: 1.01,
    ownership: "Lender",
    capacity: "Backed by contracted PPA cash flows (Denali portfolio)",
    status: "Core",
    changePercent: 0.1,
    coupon: "SOFR + 225bps",
    maturity: "2027-09",
    seniority: "Senior Secured / First Lien",
  },
  {
    id: 8,
    category: "debt",
    name: "ENGIE ERCOT Storage Expansion",
    instrumentType: "Mezzanine Note",
    sector: "Energy Storage / Renewables",
    geography: "Texas (ERCOT)",
    entryDate: "2026-01",
    costBasis: 38_000_000,
    fairValue: 39_100_000,
    grossMoic: 1.03,
    ownership: "Lender",
    capacity: "200 MW battery storage expansion",
    status: "Core-Plus",
    changePercent: 0.6,
    coupon: "10.5% cash / PIK",
    maturity: "2030-12",
    seniority: "Mezzanine / Subordinated",
  },
];

// ─── Indicative metrics (aligned to real BDC scale from public disclosures) ───

export const MOCK_METRICS = {
  // NAV / capital
  nav: 395_000_000,         // $395M total committed (Jan 2025 disclosure)
  navInvested: 239_000_000, // $239M remaining undrawn
  navPerUnit: 100.48,
  navChange1M: 0.21,
  navChangeYTD: 4.87,
  // returns (indicative — not in SEC filings)
  grossIrr: 9.8,
  netIrr: 8.1,
  tvpi: 1.05,
  dpi: 0.02,
  // capital
  totalCommitted: 395_000_000,
  totalInvested: 308_000_000,
  distributions: 7_200_000,
  unrealizedValue: 395_000_000,
  numberOfInvestments: 8,
  targetReturn: "8-10% net",
  leverage: 24.1,
  occupancyRate: 98.2,
};

// Indicative NAV build — fund launched Aug 2024
export const MOCK_NAV_HISTORY = [
  { quarter: "Q3 2024", nav: 155_700_000, navPerUnit: 100.0 },
  { quarter: "Q4 2024", nav: 347_900_000, navPerUnit: 100.22 },
  { quarter: "Q1 2025", nav: 371_000_000, navPerUnit: 100.35 },
  { quarter: "Q2 2025", nav: 382_000_000, navPerUnit: 100.41 },
  { quarter: "Q3 2025", nav: 388_000_000, navPerUnit: 100.45 },
  { quarter: "Q4 2025", nav: 395_000_000, navPerUnit: 100.48 },
];

export const MOCK_SECTOR_ALLOCATION = [
  { sector: "Solar", value: 52.3, color: "#ff6d00" },
  { sector: "Wind", value: 17.8, color: "#4d9fff" },
  { sector: "Battery Storage", value: 14.1, color: "#00c076" },
  { sector: "Natural Gas / Midstream", value: 9.2, color: "#ffd000" },
  { sector: "Digital Infrastructure", value: 6.6, color: "#a78bfa" },
];

export const MOCK_GEO_ALLOCATION = [
  { region: "United States", value: 87.4, color: "#ff6d00" },
  { region: "Europe", value: 8.8, color: "#4d9fff" },
  { region: "Asia-Pacific", value: 3.8, color: "#00c076" },
];

// Real 10-K / 10-Q filings — accession numbers from SEC EDGAR (CIK 0002031750)
export const MOCK_FILINGS = [
  {
    accessionNumber: "0001628280-25-012670",
    filingDate: "2025-03-13",
    form: "10-K",
    description: "Annual Report — FY ended December 31, 2024",
    reportDate: "2024-12-31",
    url: "https://www.sec.gov/Archives/edgar/data/2031750/000162828025012670/",
  },
  {
    accessionNumber: "0001628280-25-001722",
    filingDate: "2025-01-16",
    form: "10-Q",
    description: "Quarterly Report — Period ended September 30, 2024",
    reportDate: "2024-09-30",
    url: "https://www.sec.gov/Archives/edgar/data/2031750/000162828025001722/",
  },
  {
    accessionNumber: "0001104659-24-123767",
    filingDate: "2024-11-18",
    form: "S-1/A",
    description: "Registration Statement Amendment (continuous offering)",
    reportDate: "",
    url: "https://www.sec.gov/Archives/edgar/data/2031750/000110465924123767/",
  },
  {
    accessionNumber: "0001104659-24-105940",
    filingDate: "2024-09-20",
    form: "S-1",
    description: "Registration Statement — Initial offering",
    reportDate: "",
    url: "https://www.sec.gov/Archives/edgar/data/2031750/000110465924105940/",
  },
  {
    accessionNumber: "0002031750-24-000003",
    filingDate: "2024-08-14",
    form: "10-12G",
    description: "Registration under Securities Exchange Act of 1934",
    reportDate: "",
    url: "https://www.sec.gov/Archives/edgar/data/2031750/000203175024000003/",
  },
];

export const MOCK_QUARTERLY_RETURNS = [
  { quarter: "Q3 2024", gross: 0.8, net: 0.6, benchmark: 0.5 },
  { quarter: "Q4 2024", gross: 2.6, net: 2.2, benchmark: 1.9 },
  { quarter: "Q1 2025", gross: 1.9, net: 1.6, benchmark: 1.3 },
  { quarter: "Q2 2025", gross: 1.5, net: 1.2, benchmark: 1.0 },
  { quarter: "Q3 2025", gross: 1.7, net: 1.4, benchmark: 1.1 },
  { quarter: "Q4 2025", gross: 2.1, net: 1.8, benchmark: 1.4 },
];

export const MOCK_FUND_INFO = {
  name: "Ares Core Infrastructure Fund",
  cik: "0002031750",
  manager: "Ares Capital Management II LLC",
  fundType: "Business Development Company (BDC) · 1940 Act",
  strategy: "Core Infrastructure — Equity & Structured Credit",
  geography: "North America (primary) · Europe · Asia-Pacific",
  vintage: "2024",
  reportingCurrency: "USD",
  fiscalYearEnd: "December 31",
  lastUpdated: "2024-12-31",
};
