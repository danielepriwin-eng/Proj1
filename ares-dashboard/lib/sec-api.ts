/**
 * SEC EDGAR API client for Ares Core Infrastructure Partners
 *
 * SEC EDGAR public APIs (no auth required, User-Agent header required):
 *   - Search:      https://efts.sec.gov/LATEST/search-index?q=...&forms=...
 *   - Submissions: https://data.sec.gov/submissions/CIK{10-digit}.json
 *   - Facts:       https://data.sec.gov/api/xbrl/companyfacts/CIK{10-digit}.json
 *
 * Ares Core Infrastructure Partners files Form D, N-2, and related forms.
 * CIK: 0001803164 (Ares Core Infrastructure Partners, L.P.)
 */

const SEC_BASE = "https://data.sec.gov";
const SEC_SEARCH = "https://efts.sec.gov/LATEST/search-index";
const USER_AGENT = "AresDashboard contact@example.com";
const ARES_CIK = "0001803164";

export interface SecFiling {
  accessionNumber: string;
  filingDate: string;
  reportDate: string;
  form: string;
  primaryDocument: string;
  description: string;
  items: string;
}

export interface CompanySubmissions {
  cik: string;
  name: string;
  sic: string;
  sicDescription: string;
  stateOfIncorporation: string;
  addresses: {
    business?: { street1: string; city: string; stateOrCountry: string; zipCode: string };
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

export interface SearchResult {
  hits: {
    hits: Array<{
      _id: string;
      _source: {
        period_of_report: string;
        entity_name: string;
        file_date: string;
        form_type: string;
        file_num: string;
      };
    }>;
    total: { value: number };
  };
}

const headers = { "User-Agent": USER_AGENT };

export async function fetchCompanySubmissions(
  cik: string = ARES_CIK
): Promise<CompanySubmissions | null> {
  try {
    const padded = cik.replace(/^0+/, "").padStart(10, "0");
    const res = await fetch(`${SEC_BASE}/submissions/CIK${padded}.json`, {
      headers,
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function searchSecFilings(
  query: string = '"Ares Core Infrastructure"',
  forms: string = "N-PORT,N-CSR,N-2,D,ADV"
): Promise<SearchResult | null> {
  try {
    const params = new URLSearchParams({ q: query, forms });
    const res = await fetch(`${SEC_SEARCH}?${params}`, {
      headers,
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export function parseFiling(submissions: CompanySubmissions): SecFiling[] {
  const r = submissions.filings.recent;
  return r.accessionNumber.map((acc, i) => ({
    accessionNumber: acc,
    filingDate: r.filingDate[i],
    reportDate: r.reportDate[i] ?? "",
    form: r.form[i],
    primaryDocument: r.primaryDocument[i],
    description: r.description[i] ?? "",
    items: r.items[i] ?? "",
  }));
}

// ─── Mock data (rendered when SEC API unreachable) ───────────────────────────

export const MOCK_FUND_INFO = {
  name: "Ares Core Infrastructure Partners, L.P.",
  cik: "0001803164",
  manager: "Ares Management Corporation",
  fundType: "Private Evergreen Infrastructure Fund",
  strategy: "Core / Core-Plus Infrastructure",
  geography: "North America, Europe",
  vintage: "2021",
  reportingCurrency: "USD",
  fiscalYearEnd: "December 31",
  lastUpdated: "2024-12-31",
};

export const MOCK_METRICS = {
  nav: 7_340_000_000,
  navPerUnit: 112.34,
  navChange1M: 0.48,
  navChangeYTD: 5.21,
  grossIrr: 11.2,
  netIrr: 9.4,
  tvpi: 1.24,
  dpi: 0.18,
  totalCommitted: 8_200_000_000,
  totalInvested: 6_900_000_000,
  distributions: 290_000_000,
  unrealizedValue: 7_340_000_000,
  numberOfInvestments: 24,
  targetReturn: "8-10% net",
  leverage: 42.3,
  occupancyRate: 97.8,
};

export const MOCK_NAV_HISTORY = [
  { quarter: "Q1 2022", nav: 1_120_000_000, navPerUnit: 100.0 },
  { quarter: "Q2 2022", nav: 1_580_000_000, navPerUnit: 101.2 },
  { quarter: "Q3 2022", nav: 2_100_000_000, navPerUnit: 101.8 },
  { quarter: "Q4 2022", nav: 2_740_000_000, navPerUnit: 102.9 },
  { quarter: "Q1 2023", nav: 3_290_000_000, navPerUnit: 104.1 },
  { quarter: "Q2 2023", nav: 3_860_000_000, navPerUnit: 105.6 },
  { quarter: "Q3 2023", nav: 4_420_000_000, navPerUnit: 106.8 },
  { quarter: "Q4 2023", nav: 5_180_000_000, navPerUnit: 108.2 },
  { quarter: "Q1 2024", nav: 5_710_000_000, navPerUnit: 109.5 },
  { quarter: "Q2 2024", nav: 6_240_000_000, navPerUnit: 110.4 },
  { quarter: "Q3 2024", nav: 6_870_000_000, navPerUnit: 111.6 },
  { quarter: "Q4 2024", nav: 7_340_000_000, navPerUnit: 112.34 },
];

export const MOCK_SECTOR_ALLOCATION = [
  { sector: "Transportation", value: 28.4, color: "#ff6d00" },
  { sector: "Utilities", value: 23.1, color: "#4d9fff" },
  { sector: "Digital Infrastructure", value: 19.7, color: "#00c076" },
  { sector: "Energy Transition", value: 17.2, color: "#ffd000" },
  { sector: "Social Infrastructure", value: 8.4, color: "#a78bfa" },
  { sector: "Other", value: 3.2, color: "#555555" },
];

export const MOCK_GEO_ALLOCATION = [
  { region: "North America", value: 61.3, color: "#ff6d00" },
  { region: "Europe", value: 31.8, color: "#4d9fff" },
  { region: "Asia-Pacific", value: 6.9, color: "#00c076" },
];

export const MOCK_HOLDINGS = [
  {
    id: 1,
    name: "MidAmerica Pipeline Co.",
    sector: "Energy / Midstream",
    geography: "United States",
    entryDate: "2021-09",
    costBasis: 420_000_000,
    fairValue: 512_000_000,
    grossMoic: 1.22,
    ownership: "35%",
    ebitda: 84_000_000,
    status: "Core",
    changePercent: 1.4,
  },
  {
    id: 2,
    name: "EuroRoute Toll Holdings",
    sector: "Transportation",
    geography: "France / Spain",
    entryDate: "2021-11",
    costBasis: 380_000_000,
    fairValue: 478_000_000,
    grossMoic: 1.26,
    ownership: "28%",
    ebitda: 72_000_000,
    status: "Core",
    changePercent: 2.1,
  },
  {
    id: 3,
    name: "Clearwater Utilities Group",
    sector: "Regulated Utilities",
    geography: "United Kingdom",
    entryDate: "2022-03",
    costBasis: 350_000_000,
    fairValue: 421_000_000,
    grossMoic: 1.20,
    ownership: "49%",
    ebitda: 68_000_000,
    status: "Core",
    changePercent: 0.8,
  },
  {
    id: 4,
    name: "NorthTower Data Centers",
    sector: "Digital Infrastructure",
    geography: "United States",
    entryDate: "2022-06",
    costBasis: 290_000_000,
    fairValue: 392_000_000,
    grossMoic: 1.35,
    ownership: "51%",
    ebitda: 61_000_000,
    status: "Core-Plus",
    changePercent: 3.7,
  },
  {
    id: 5,
    name: "Atlantic Wind Consortium",
    sector: "Energy Transition",
    geography: "United States",
    entryDate: "2022-09",
    costBasis: 310_000_000,
    fairValue: 354_000_000,
    grossMoic: 1.14,
    ownership: "40%",
    ebitda: 58_000_000,
    status: "Core",
    changePercent: -0.3,
  },
  {
    id: 6,
    name: "TransAlpine Freight GmbH",
    sector: "Transportation",
    geography: "Germany / Austria",
    entryDate: "2022-11",
    costBasis: 265_000_000,
    fairValue: 318_000_000,
    grossMoic: 1.20,
    ownership: "33%",
    ebitda: 54_000_000,
    status: "Core",
    changePercent: 1.1,
  },
  {
    id: 7,
    name: "SunGrid Solar Platform",
    sector: "Energy Transition",
    geography: "Spain / Italy",
    entryDate: "2023-02",
    costBasis: 240_000_000,
    fairValue: 288_000_000,
    grossMoic: 1.20,
    ownership: "60%",
    ebitda: 47_000_000,
    status: "Core-Plus",
    changePercent: 2.9,
  },
  {
    id: 8,
    name: "PacificFiber Networks",
    sector: "Digital Infrastructure",
    geography: "United States",
    entryDate: "2023-05",
    costBasis: 220_000_000,
    fairValue: 261_000_000,
    grossMoic: 1.19,
    ownership: "45%",
    ebitda: 43_000_000,
    status: "Core-Plus",
    changePercent: 1.8,
  },
  {
    id: 9,
    name: "Nordic Power Grid AB",
    sector: "Regulated Utilities",
    geography: "Sweden / Norway",
    entryDate: "2023-07",
    costBasis: 195_000_000,
    fairValue: 228_000_000,
    grossMoic: 1.17,
    ownership: "38%",
    ebitda: 39_000_000,
    status: "Core",
    changePercent: 0.5,
  },
  {
    id: 10,
    name: "BlueSky Airports Ltd.",
    sector: "Transportation",
    geography: "Australia",
    entryDate: "2023-10",
    costBasis: 180_000_000,
    fairValue: 211_000_000,
    grossMoic: 1.17,
    ownership: "24%",
    ebitda: 36_000_000,
    status: "Core",
    changePercent: -0.9,
  },
];

export const MOCK_FILINGS = [
  {
    accessionNumber: "0001803164-25-000012",
    filingDate: "2025-02-14",
    form: "N-PORT",
    description: "Monthly Portfolio Holdings Report",
    reportDate: "2024-12-31",
    url: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001803164&type=N-PORT",
  },
  {
    accessionNumber: "0001803164-25-000008",
    filingDate: "2025-01-30",
    form: "N-CEN",
    description: "Annual Report for Registered Investment Companies",
    reportDate: "2024-12-31",
    url: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001803164&type=N-CEN",
  },
  {
    accessionNumber: "0001803164-24-000031",
    filingDate: "2024-11-14",
    form: "N-PORT",
    description: "Monthly Portfolio Holdings Report",
    reportDate: "2024-09-30",
    url: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001803164&type=N-PORT",
  },
  {
    accessionNumber: "0001803164-24-000028",
    filingDate: "2024-08-14",
    form: "N-PORT",
    description: "Monthly Portfolio Holdings Report",
    reportDate: "2024-06-30",
    url: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001803164&type=N-PORT",
  },
  {
    accessionNumber: "0001803164-24-000019",
    filingDate: "2024-05-14",
    form: "N-CSR",
    description: "Certified Shareholder Report (Semi-Annual)",
    reportDate: "2024-03-31",
    url: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001803164&type=N-CSR",
  },
  {
    accessionNumber: "0001803164-24-000011",
    filingDate: "2024-02-29",
    form: "N-PORT",
    description: "Monthly Portfolio Holdings Report",
    reportDate: "2023-12-31",
    url: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001803164&type=N-PORT",
  },
  {
    accessionNumber: "0001803164-23-000044",
    filingDate: "2023-11-14",
    form: "N-PORT",
    description: "Monthly Portfolio Holdings Report",
    reportDate: "2023-09-30",
    url: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001803164&type=N-PORT",
  },
  {
    accessionNumber: "0001803164-23-000029",
    filingDate: "2023-08-14",
    form: "N-CSR",
    description: "Certified Shareholder Report (Annual)",
    reportDate: "2023-06-30",
    url: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001803164&type=N-CSR",
  },
];

export const MOCK_QUARTERLY_RETURNS = [
  { quarter: "Q1 2022", gross: 2.1, net: 1.8, benchmark: 1.4 },
  { quarter: "Q2 2022", gross: 1.4, net: 1.1, benchmark: -0.8 },
  { quarter: "Q3 2022", gross: 0.8, net: 0.6, benchmark: -2.1 },
  { quarter: "Q4 2022", gross: 2.8, net: 2.4, benchmark: 1.9 },
  { quarter: "Q1 2023", gross: 3.1, net: 2.7, benchmark: 2.2 },
  { quarter: "Q2 2023", gross: 2.4, net: 2.0, benchmark: 1.6 },
  { quarter: "Q3 2023", gross: 1.9, net: 1.6, benchmark: 0.9 },
  { quarter: "Q4 2023", gross: 2.6, net: 2.2, benchmark: 1.8 },
  { quarter: "Q1 2024", gross: 2.2, net: 1.9, benchmark: 1.5 },
  { quarter: "Q2 2024", gross: 1.8, net: 1.5, benchmark: 1.1 },
  { quarter: "Q3 2024", gross: 2.4, net: 2.1, benchmark: 1.7 },
  { quarter: "Q4 2024", gross: 2.1, net: 1.8, benchmark: 1.4 },
];
