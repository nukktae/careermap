# Linkareer Activity Detail – Structure

## How the detail page works

- **URL**: `https://linkareer.com/activity/{activityId}` (e.g. `298907`)
- **Response**: HTML. The page embeds **schema.org JSON-LD** in `<script type="application/ld+json">`. The block with `"@type": "JobPosting"` contains the main job info.

## JobPosting JSON-LD fields (necessary info)

| Field | Type | Description |
|-------|------|-------------|
| `title` | string | 공고 제목 |
| `datePosted` | ISO date | 게시일 |
| `validThrough` | ISO date | 지원 마감일 |
| `employmentType` | string[] | e.g. `["INTERN"]` |
| `experienceRequirements` | string[] | e.g. `["신입"]` |
| `educationRequirements` | string | e.g. `"학력무관"` |
| `jobLocation` | array | `[{ "@type": "Place", "address": { "streetAddress", "addressLocality", "addressRegion", "postalCode", "addressCountry" } }]` |
| `hiringOrganization` | object | `{ "name", "sameAs" (company URL), "logo" }` |
| `description` | string | 공고 본문 (지원자격 등) |
| `identifier` | object | `{ "propertyID": "사업자등록번호", "value": "..." }` |
| `image` | object | `{ "contentUrl", "caption" }` |

We only use this JSON-LD; no HTML scraping.

## Fetch and save (JSON + CSV)

```bash
node scripts/fetch-linkareer-activity-detail.js [activityId]
```

- Default `activityId`: `298907`
- **Output**:
  - `data/linkareer-activity-{id}.json` – full payload: `activityId`, `sourceUrl`, `fetchedAt`, `jobPosting`
  - `data/linkareer-activity-{id}.csv` – one row, flattened fields (activityId, title, organizationName, organizationUrl, logoUrl, datePosted, validThrough, employmentType, experienceRequirements, educationRequirements, streetAddress, addressLocality, addressRegion, postalCode, addressCountry, description, identifierPropertyId, identifierValue)

## Example: activity 298907 (스노우 인턴)

- **JSON**: `data/linkareer-activity-298907.json`
- **CSV**: `data/linkareer-activity-298907.csv`
