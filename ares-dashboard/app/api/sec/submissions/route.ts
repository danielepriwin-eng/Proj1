import { NextResponse } from "next/server";
import {
  fetchCompanySubmissions,
  parseFilings,
  MOCK_FILINGS,
  MOCK_FUND_INFO,
} from "@/lib/sec-api";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cik = searchParams.get("cik") ?? undefined;

  const submissions = await fetchCompanySubmissions(cik);

  if (submissions) {
    const filings = parseFilings(submissions).slice(0, 20);
    return NextResponse.json({
      source: "sec-edgar",
      company: {
        name: submissions.name,
        cik: submissions.cik,
        sic: submissions.sic,
        sicDescription: submissions.sicDescription,
      },
      filings,
    });
  }

  // Fallback to mock data
  return NextResponse.json({
    source: "mock",
    company: MOCK_FUND_INFO,
    filings: MOCK_FILINGS,
  });
}
