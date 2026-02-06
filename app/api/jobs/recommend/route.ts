import { NextRequest, NextResponse } from "next/server";

/**
 * Proxies POST /api/jobs/recommend to the resume-analyzer service.
 * Body: { user_profile: ResumeAnalysis, job_postings: JobPostingResult[] }
 * Response: JobMatchResult[] (job_postings with match_score and ai_analysis).
 *
 * Set ONEWAVE_API_URL to the analyzer base (e.g. https://resume-analyzer-51897007223.asia-northeast3.run.app).
 */

const RESUME_ANALYZER_URL =
  process.env.ONEWAVE_API_URL?.replace(/\/$/, "") ||
  "https://resume-analyzer-51897007223.asia-northeast3.run.app";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json(
      { error: "Body must be an object with user_profile and job_postings" },
      { status: 400 }
    );
  }

  const res = await fetch(`${RESUME_ANALYZER_URL}/jobs/recommend`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  if (!res.ok) {
    let detail: unknown = text;
    try {
      detail = JSON.parse(text);
    } catch {
      // use raw text
    }
    return NextResponse.json(
      { error: "Recommendation request failed", details: detail },
      { status: res.status >= 500 ? 502 : res.status }
    );
  }

  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON from recommendation service" },
      { status: 502 }
    );
  }

  return NextResponse.json(json);
}
