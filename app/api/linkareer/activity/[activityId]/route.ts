import { NextRequest, NextResponse } from "next/server";

const LINKAREER_ORIGIN = "https://linkareer.com";

function extractJobPostingLdJson(html: string): object | null {
  const regex = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;
  let match;
  while ((match = regex.exec(html)) !== null) {
    const raw = match[1].trim();
    if (!raw) continue;
    try {
      const obj = JSON.parse(raw);
      if (obj["@type"] === "JobPosting") return obj;
    } catch {
      // skip invalid JSON
    }
  }
  return null;
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ activityId: string }> }
) {
  const { activityId } = await params;
  if (!activityId) {
    return NextResponse.json(
      { error: "Missing activityId" },
      { status: 400 }
    );
  }

  const url = `${LINKAREER_ORIGIN}/activity/${activityId}`;
  let html: string;
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "ko-KR,ko;q=0.9",
      },
    });
    if (!res.ok) {
      return NextResponse.json(
        { error: `Linkareer returned ${res.status}` },
        { status: 502 }
      );
    }
    html = await res.text();
  } catch (e) {
    return NextResponse.json(
      { error: "Failed to fetch Linkareer page" },
      { status: 502 }
    );
  }

  const jobPosting = extractJobPostingLdJson(html);
  if (!jobPosting) {
    return NextResponse.json(
      { error: "No JobPosting JSON-LD found on page" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    activityId,
    sourceUrl: url,
    jobPosting,
  });
}
