import { NextResponse } from "next/server";
import { searchSecFilings, MOCK_FILINGS } from "@/lib/sec-api";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? '"Ares Core Infrastructure"';
  const forms = searchParams.get("forms") ?? "N-PORT,N-CSR,N-2,D";

  const results = await searchSecFilings(q, forms);

  if (results?.hits?.hits?.length) {
    return NextResponse.json({ source: "sec-edgar", results });
  }

  return NextResponse.json({ source: "mock", filings: MOCK_FILINGS });
}
