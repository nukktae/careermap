/**
 * Fetches full details for the 20 Linkareer jobs (from the jobs grid) and saves
 * one JSON file. Job IDs in the app are (100000 + activityId), e.g. /jobs/399032 → activity 299032.
 *
 * Usage: node scripts/fetch-linkareer-20-jobs-details.js
 * Output: data/linkareer-20-jobs-details.json
 */

const fs = require("fs");
const path = require("path");
const https = require("https");

const LINKAREER_ID_OFFSET = 100000;

// Activity IDs for the 20 jobs (app job id = LINKAREER_ID_OFFSET + activityId)
const ACTIVITY_IDS = [
  "299032", // [대한FSS] 충북 청주지역 인턴영양사
  "298990", // [한국청소년정책연구원] 체험형청년인턴
  "298979", // [클라썸] Project Delivery Intern
  "298977", // [웹케시] 사업기획, 상품기획
  "298963", // 지식교양 콘텐츠 조연출(인턴)
  "298957", // [SK플라즈마] 안동공장 혈액제제
  "298956", // [대학내일] 마케팅(AE)_20대연구소
  "298954", // [대학내일] 마케팅(AE)_익스피리언스플래닝4팀
  "298951", // [대학내일ES] 디자이너_크리에이티브팀
  "298947", // [더랩바이블랑두] 국내영업팀 AMD
  "298944", // 신용카드사회공헌재단 체험형 인턴
  "298907", // [스노우] AI 서비스 콘텐츠 기획
  "298906", // [스노우] AI 영상 콘텐츠 제작
  "298904", // [관세청] 관세국경인재개발원 청년인턴
  "298903", // [관세청] 광주세관 청년인턴
  "298902", // [관세청] 평택세관 청년인턴
  "298901", // [관세청] 서울세관 청년인턴
  "298900", // [EY한영] 세무부문 행정지원
  "298899", // [Kearney Korea] RA(인턴)
  "298898", // [EY한영] 컨설팅 부문 Global Project Management
];

const DATA_DIR = path.join(__dirname, "..", "data");
const OUTPUT_PATH = path.join(DATA_DIR, "linkareer-20-jobs-details.json");

function fetchHtml(url) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const opts = {
      hostname: u.hostname,
      path: u.pathname + u.search,
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
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
    } catch (_) {}
  }
  return null;
}

function extractDetailImageUrl(html) {
  const m = html.match(/https:\/\/media-cdn\.linkareer\.com\/+se2editor\/image\/\d+/);
  return m ? m[0] : null;
}

function extractCompanyType(html) {
  const patterns = [
    /기업형태\s*([^\s<]+(?:\/[^\s<]+)?)/,
    /(공공기관\/공기업|대기업|중소기업|스타트업|외국계|공기업)/,
  ];
  for (const re of patterns) {
    const m = html.match(re);
    if (m?.[1]) return m[1].trim();
  }
  return null;
}

function extractRecruitCategory(html) {
  const m = html.match(/모집직무\s*([^\n<]+)/);
  return m?.[1]?.trim() ?? null;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchOneDetail(activityId) {
  const url = `https://linkareer.com/activity/${activityId}`;
  const html = await fetchHtml(url);
  const jobPosting = extractJobPostingLdJson(html);
  if (!jobPosting) {
    return { activityId, sourceUrl: url, error: "No JobPosting JSON-LD found", fetchedAt: new Date().toISOString() };
  }
  const detailImageUrl = extractDetailImageUrl(html);
  const companyType = extractCompanyType(html);
  const recruitCategory = extractRecruitCategory(html);
  const out = {
    activityId,
    sourceUrl: url,
    jobPosting,
    fetchedAt: new Date().toISOString(),
  };
  if (detailImageUrl) out.detailImageUrl = detailImageUrl;
  if (companyType) out.companyType = companyType;
  if (recruitCategory) out.recruitCategory = recruitCategory;
  return out;
}

async function main() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  const results = [];
  for (let i = 0; i < ACTIVITY_IDS.length; i++) {
    const id = ACTIVITY_IDS[i];
    const appJobId = LINKAREER_ID_OFFSET + parseInt(id, 10);
    process.stdout.write(`[${i + 1}/${ACTIVITY_IDS.length}] activity ${id} (app /jobs/${appJobId}) ... `);
    try {
      const detail = await fetchOneDetail(id);
      results.push(detail);
      console.log(detail.error ? "no JSON-LD" : "ok");
    } catch (e) {
      console.log("error:", e.message);
      results.push({
        activityId: id,
        appJobId,
        error: e.message,
        fetchedAt: new Date().toISOString(),
      });
    }
    if (i < ACTIVITY_IDS.length - 1) await sleep(800);
  }
  const output = {
    fetchedAt: new Date().toISOString(),
    count: results.length,
    linkareerIdOffset: LINKAREER_ID_OFFSET,
    jobs: results,
  };
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2), "utf8");
  console.log("\nSaved:", OUTPUT_PATH);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
