/**
 * Fetches a Linkareer activity detail page, extracts the JSON-LD JobPosting,
 * and saves it as JSON and CSV. Usage: node scripts/fetch-linkareer-activity-detail.js [activityId]
 * Default activityId: 298907
 */

const fs = require("fs");
const path = require("path");

const ACTIVITY_ID = process.argv[2] || "298907";
const BASE_URL = "https://linkareer.com/activity/" + ACTIVITY_ID;
const DATA_DIR = path.join(__dirname, "..", "data");

function fetchHtml(url) {
  return new Promise((resolve, reject) => {
    const https = require("https");
    const u = new URL(url);
    const opts = {
      hostname: u.hostname,
      path: u.pathname + u.search,
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.7444.235 Safari/537.36",
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "ko-KR,ko;q=0.9",
      },
    };
    https
      .get(opts, (res) => {
        let body = "";
        res.on("data", (chunk) => (body += chunk));
        res.on("end", () => resolve(body));
      })
      .on("error", reject);
  });
}

function extractJobPostingLdJson(html) {
  const regex = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;
  let match;
  while ((match = regex.exec(html)) !== null) {
    const raw = match[1].trim();
    if (!raw) continue;
    try {
      const obj = JSON.parse(raw);
      if (obj["@type"] === "JobPosting") return obj;
    } catch (_) {
      // skip invalid JSON
    }
  }
  return null;
}

function jobPostingToFlatRow(activityId, jp) {
  const addr = jp.jobLocation?.[0]?.address || {};
  const org = jp.hiringOrganization || {};
  return {
    activityId,
    title: jp.title || "",
    organizationName: org.name || "",
    organizationUrl: org.sameAs || "",
    logoUrl: org.logo || (jp.image && jp.image.contentUrl) || "",
    datePosted: jp.datePosted || "",
    validThrough: jp.validThrough || "",
    employmentType: Array.isArray(jp.employmentType) ? jp.employmentType.join(";") : (jp.employmentType || ""),
    experienceRequirements: Array.isArray(jp.experienceRequirements) ? jp.experienceRequirements.join(";") : (jp.experienceRequirements || ""),
    educationRequirements: jp.educationRequirements || "",
    streetAddress: addr.streetAddress || "",
    addressLocality: addr.addressLocality || "",
    addressRegion: addr.addressRegion || "",
    postalCode: addr.postalCode || "",
    addressCountry: addr.addressCountry || "",
    description: (jp.description || "").replace(/\r?\n/g, " ").slice(0, 500),
    identifierPropertyId: (jp.identifier && jp.identifier.propertyID) || "",
    identifierValue: (jp.identifier && jp.identifier.value) || "",
  };
}

function toCsvRow(obj) {
  return Object.values(obj).map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",");
}

async function main() {
  console.log("Fetching", BASE_URL, "...");
  const html = await fetchHtml(BASE_URL);
  const jobPosting = extractJobPostingLdJson(html);
  if (!jobPosting) {
    console.error("No JobPosting JSON-LD found in page.");
    process.exit(1);
  }

  const output = {
    activityId: ACTIVITY_ID,
    sourceUrl: BASE_URL,
    fetchedAt: new Date().toISOString(),
    jobPosting,
  };

  fs.mkdirSync(DATA_DIR, { recursive: true });

  const jsonPath = path.join(DATA_DIR, `linkareer-activity-${ACTIVITY_ID}.json`);
  fs.writeFileSync(jsonPath, JSON.stringify(output, null, 2), "utf8");
  console.log("Saved JSON:", jsonPath);

  const flat = jobPostingToFlatRow(ACTIVITY_ID, jobPosting);
  const csvHeaders = Object.keys(flat);
  const csvRow = toCsvRow(flat);
  const csvPath = path.join(DATA_DIR, `linkareer-activity-${ACTIVITY_ID}.csv`);
  fs.writeFileSync(csvPath, "\uFEFF" + csvHeaders.join(",") + "\n" + csvRow + "\n", "utf8");
  console.log("Saved CSV:", csvPath);

  console.log("\nExtracted JobPosting fields:", Object.keys(jobPosting));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
