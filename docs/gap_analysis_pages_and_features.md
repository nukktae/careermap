# Gap Analysis: Current Pages vs. Spec

Based on: `product_specification.md`, `screen_inventory_flows.md`, `detailed_feature_specs.md`, and the current app routes.

---

## Current pages (9 routes)

| # | Route | Screen | Features implemented |
|---|-------|--------|----------------------|
| 1 | `/` | **Landing** | Hero, value prop, CTA, features, testimonials, pricing, footer |
| 2 | `/login` | **Login** | Email/password, show/hide password, "Remember me", link to signup & forgot-password |
| 3 | `/signup` | **Sign Up** | Email, password, terms checkbox, link to login |
| 4 | `/welcome` | **Welcome** | 3-step intro, "Upload resume" & "나중에 하기" CTAs |
| 5 | `/onboarding/resume` | **Resume Upload** | Drag-drop, file picker, PDF/DOCX, progress + tips, AI analysis animation → Profile |
| 6 | `/onboarding/profile` | **Profile Review** | Parsed data (education, skills, experience, projects), editable, confidence, "Looks good" → Dashboard |
| 7 | `/dashboard` | **Dashboard/Home** | Welcome, match summary (Apply Now / Prep / Stretch), learning plan teaser, application status, quick actions, insights teaser, upgrade banner |
| 8 | `/jobs` | **Job Discovery** | Job cards (company, title, match %, badge, skills), search, filter/sort UI, bookmark, mock data |
| 9 | `/jobs/[id]` | **Job Detail** | Full posting, match card, "Prepare for job" & "Add to tracker" CTAs, description sections, similar jobs |

**Total: 9 pages.**  
Nav also links to `/prepare`, `/track`, `/profile`, `/settings` — **no routes exist for these yet** (404).

---

## Spec vs built (28 MVP screens)

### Authentication & Onboarding (6 screens)

| Spec screen | Status | Notes |
|-------------|--------|--------|
| Landing | ✅ Built | Matches spec (hero, social proof, features, pricing, footer). |
| Sign Up | ✅ Built | Email, password, terms. No Google OAuth, no verification email. |
| Login | ✅ Built | Email, password, remember me. No Google OAuth. Link to **Forgot Password** but **page missing**. |
| Welcome | ✅ Built | 3 steps, CTAs. |
| Resume Upload | ✅ Built | Drag-drop, file picker, progress, tips, AI animation. |
| Profile Review | ✅ Built | Parsed data, edit, confidence, "Looks good" → Dashboard. |

### Main Dashboard (1 screen)

| Spec screen | Status | Notes |
|-------------|--------|--------|
| Dashboard/Home | ✅ Built | Welcome, match summary, learning plan, application status, quick actions, insights teaser, upgrade. Links to /prepare, /track, /track/insights (pages missing). |

### Match Module (5 screens)

| Spec screen | Status | Notes |
|-------------|--------|--------|
| Job Discovery | ✅ Built | List, search, filter/sort UI, match %, badges, skills. |
| Job Detail | ✅ Built | Posting, match card, prepare/track CTAs. |
| **Match Explanation** | ❌ Missing | Full breakdown: Skills (40%), Experience (30%), Education (15%), Projects (15%), gaps, "See prep plan" CTA. |
| **Job Filters** | ⚠️ Partial | Filter UI on Job Discovery; no dedicated filters screen/modal as in spec. |
| **Saved Jobs** | ❌ Missing | Separate list of bookmarked jobs; empty state. |

### Prepare Module (6 screens)

| Spec screen | Status | Notes |
|-------------|--------|--------|
| **Skill Gap Analysis** | ❌ Missing | "Skills I'm missing", impact/demand/effort, prioritize, Impact vs Effort matrix. |
| **Learning Plan** | ❌ Missing | 2–4 week plan per job, weekly tasks, checkboxes, progress, links to resources. Job Detail links to `/prepare/plan?job=…` (no page). |
| **Resume Optimizer** | ❌ Missing | Target job + language, paste bullet, AI rewrite, before/after, explanations. Dashboard links to `/prepare/resume` (no page). |
| **Resume Preview** | ❌ Missing | Before/after comparison, download PDF. |
| **자소서 Guidance** | ❌ Missing | Company + prompt, structure, themes, sample phrasing (guidance only). Premium. |
| **Interview Prep** | ❌ Missing | Question categories, resume story mapping, company culture, practice questions, Korean formats. Premium. |

### Track Module (3 screens)

| Spec screen | Status | Notes |
|-------------|--------|--------|
| **Application Tracker** | ❌ Missing | Kanban: Interested / Applied / 서류 통과 / Interview / Final, drag-drop, FAB. Dashboard links to `/track` (no page). |
| **Application Detail** | ❌ Missing | Job info, timeline, notes, documents, contacts, reminders. |
| **Insights Dashboard** | ❌ Missing | After 10+ apps: match vs success, rejection reasons, application speed, skill progress. Dashboard links to `/track/insights` (no page). |

### Profile & Settings (7 screens)

| Spec screen | Status | Notes |
|-------------|--------|--------|
| **User Profile** | ❌ Missing | Photo, personal info, education, skills, experience, projects, resume download, Edit. Nav links to `/profile` (no page). |
| **Edit Profile** | ❌ Missing | Same fields as Profile Review, save/cancel. |
| **Edit Resume** | ❌ Missing | Rich text, sections, bullets, PDF, preview. |
| **Preferences** | ❌ Missing | Job types, locations, company types, salary, notifications, language. |
| **Account Settings** | ❌ Missing | Email, password, 2FA, notifications, delete account. Nav links to `/settings` (no page). |
| **Subscription/Billing** | ❌ Missing | Plan, usage, upgrade, payment method, cancel, billing history. |
| **Help & Support** | ❌ Missing | FAQ, tutorials, contact, feature request, report bug. |

---

## Summary: what’s missing

### Missing routes (19 MVP screens)

- **Auth:** Forgot Password (`/forgot-password`)
- **Match:** Match Explanation (e.g. modal or `/jobs/[id]/match`), Saved Jobs (`/jobs/saved` or filter on `/jobs`)
- **Prepare (entire module):**  
  Skill Gap (`/prepare/skills`), Learning Plan (`/prepare/plan`), Resume Optimizer (`/prepare/resume`), Resume Preview (`/prepare/preview`), 자소서 (`/prepare/cover-letter`), Interview Prep (`/prepare/interview`)
- **Track (entire module):**  
  Application Tracker (`/track`), Application Detail (`/track/[id]`), Insights (`/track/insights`)
- **Profile & Settings:**  
  User Profile (`/profile`), Edit Profile (`/profile/edit`), Edit Resume (`/profile/resume`), Preferences (`/profile/preferences`), Account Settings (`/settings`), Subscription (`/settings/billing`), Help (`/help` or `/settings/help`)

### Missing or partial features on existing pages

- **Landing:** Optional video demo, scroll animations (if desired).
- **Sign Up / Login:** Google OAuth, email verification (Sign Up), forgot-password page.
- **Job Discovery:** Full filter modal (match band, job type, company type, location, salary, experience, industry); dedicated Saved Jobs view or clear saved state.
- **Job Detail:** "매칭 상세 보기" opening Match Explanation; optional company insights (premium).

### Post-MVP (not in scope for this gap)

- Connect: Company Insights, Coffee Chat, LinkedIn Analyzer, Message Generator, Networking Tracker.
- Advanced: Success Stories, Resume Library, Community/Forum.

---

## Counts

| Category | Spec (MVP) | Built | Missing |
|----------|------------|--------|--------|
| **Pages (routes)** | 28 | 9 | 19 |
| **Auth + Onboarding** | 6 | 6 | 0 (forgot-password + OAuth optional) |
| **Dashboard** | 1 | 1 | 0 |
| **Match** | 5 | 2 | 3 (Match Explanation, Filters completion, Saved Jobs) |
| **Prepare** | 6 | 0 | 6 |
| **Track** | 3 | 0 | 3 |
| **Profile & Settings** | 7 | 0 | 7 |

**Next priorities (by spec and nav):**

1. Add placeholder or real pages for **Prepare**, **Track**, **Profile**, **Settings** so nav doesn’t 404.
2. **Match Explanation** (from Job Detail).
3. **Forgot Password** (linked from Login).
4. **Saved Jobs** and finish **Job Filters**.
5. Then implement Prepare and Track flows, then full Profile & Settings.
