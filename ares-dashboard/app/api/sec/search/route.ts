import { NextResponse } from "next/server";
import { MOCK_FILINGS } from "@/lib/sec-api";

// Note: BDC search is better served via the submissions API.
// This route is retained for completeness; it returns known filings.
export async function GET() {
  return NextResponse.json({ source: "mock", filings: MOCK_FILINGS });
}
