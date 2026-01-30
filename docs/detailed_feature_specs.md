# Detailed Feature Specifications by Screen

## AUTHENTICATION & ONBOARDING

### 1. Landing Page
**Purpose**: Convert visitors to sign-ups

**Key Elements:**
- Hero section with value proposition
  - Headline: "취업 준비, 이제 명확하게" (Job prep, now with clarity)
  - Subheadline: "AI가 분석하는 내 경쟁력과 맞춤 준비 전략"
  - CTA: "무료로 시작하기" (Start for free)
- Social proof section
  - Success metrics: "1,000+ students landed jobs"
  - University logos (SNU, Yonsei, KAIST)
  - User testimonials with photos
- Feature highlights (3 columns)
  - Match: Know if you qualify
  - Prepare: Close skill gaps fast
  - Track: Learn from your applications
- Pricing preview
- Footer with links

**Interactions:**
- Scroll-triggered animations
- CTA buttons with hover states
- Video demo (optional)

---

### 2. Sign Up
**Purpose**: Quick, frictionless account creation

**Fields:**
- Email address (with validation)
- Password (min 8 chars, show/hide toggle)
- Agree to Terms & Privacy (checkbox)
- OR: "Sign up with Google" (OAuth)

**Features:**
- Real-time email validation
- Password strength indicator
- Error messages inline
- "Already have account? Log in" link

**Success State:**
- Redirect to Welcome Screen
- Send verification email (background)

---

### 3. Login
**Purpose**: Returning user authentication

**Fields:**
- Email
- Password (show/hide toggle)
- "Remember me" checkbox
- "Forgot password?" link

**Features:**
- "Login with Google" option
- Error handling for wrong credentials
- Loading state during auth

---

### 4. Welcome Screen
**Purpose**: Orient new users

**Content:**
- Welcome message: "환영합니다! 이제 취업 준비를 시작해볼까요?"
- Brief explanation (3 steps):
  1. Upload resume
  2. See job matches
  3. Get preparation plan
- CTA: "이력서 업로드하기" (Upload resume)
- Skip option (bottom): "나중에 하기" (Do later)

**Design:**
- Illustration or animation
- Progress indicator (Step 1 of 3)

---

### 5. Resume Upload
**Purpose**: Capture user's resume for parsing

**Upload Methods:**
- Drag & drop zone
- File picker button
- Supported formats: PDF, DOCX (max 5MB)

**Features:**
- File preview after upload
- Replace file option
- Loading animation during upload
- Error handling (wrong format, too large)

**Processing State:**
- Progress bar: "이력서 분석 중..." (Analyzing resume)
- Estimated time: 20-30 seconds
- Fun facts or tips while waiting

---

### 6. Profile Review
**Purpose**: Verify and edit parsed resume data

**Sections:**
- Personal Info (name, email, phone)
- Education (university, major, graduation year)
- Skills (tags, add/remove)
- Experience (company, role, duration, bullets)
- Projects (title, description, tech stack)

**Features:**
- Editable fields (inline editing)
- Add/remove sections
- Confidence indicators (AI confidence in parsing)
- "Looks good" CTA → Dashboard
- "Edit more" → Full profile editor

**Design:**
- Card-based layout
- Green checkmarks for verified data
- Yellow warnings for low-confidence data
- Edit icons on hover

---

## MAIN DASHBOARD

### 7. Dashboard/Home
**Purpose**: Central hub showing overview and quick actions

**Sections:**

**A. Welcome Banner**
- Personalized greeting: "안녕하세요, [Name]님!"
- Quick stat: "오늘 3개의 새로운 매칭이 있어요"

**B. Match Summary Card**
- Total matched jobs
- Breakdown by category:
  - 🟢 Apply Now (85%+ match): 3 jobs
  - 🟡 Prep Needed (60-85%): 8 jobs
  - 🔴 Stretch Goal (<60%): 5 jobs
- CTA: "모든 채용 보기" (View all jobs)

**C. Active Learning Plans**
- Show current learning plan (if any)
- Progress bar: "Week 2 of 4"
- Next task: "Complete Docker tutorial"
- CTA: "계속하기" (Continue)

**D. Application Status**
- Mini kanban view (Applied: 5, Interview: 2, Offer: 0)
- CTA: "지원 현황 보기" (View applications)

**E. Quick Actions (Icon buttons)**
- Optimize Resume
- Find New Jobs
- Track Application
- View Insights

**F. Insights Teaser** (if user has 10+ applications)
- "새로운 인사이트가 준비되었어요!"
- Preview: "매칭 점수 65% 이상일 때 면접률 70%"
- CTA: "인사이트 보기"

**G. Upgrade Banner** (for free users)
- "프리미엄으로 무제한 기능 이용하기"
- CTA: "업그레이드"

---

## MATCH MODULE

### 8. Job Discovery
**Purpose**: Browse and filter matched jobs

**Header:**
- Search bar (job title, company)
- Filter button (opens filter modal)
- Sort dropdown (Match %, Date, Salary)

**Job List:**
- Job cards (scrollable list)
- Each card shows:
  - Company logo
  - Job title
  - Company name
  - Location
  - Match percentage (large, color-coded)
  - Match badge (Apply Now / Prep Needed / Stretch)
  - Key matched skills (3 tags)
  - Bookmark icon (save for later)

**Interactions:**
- Tap card → Job Detail
- Swipe left → Save
- Swipe right → Not interested
- Pull to refresh

**Empty State:**
- "아직 매칭된 채용이 없어요"
- "프로필을 완성하면 더 많은 매칭을 받을 수 있어요"
- CTA: "프로필 완성하기"

---

### 9. Job Detail
**Purpose**: Show full job posting with match analysis

**Sections:**

**A. Header**
- Company logo and name
- Job title
- Location, job type (정규직, 인턴)
- Salary range (if available)
- Bookmark button
- Share button

**B. Match Score Card** (prominent)
- Large match percentage
- Color-coded badge
- CTA: "매칭 상세 보기" (See match details)

**C. Quick Actions**
- "이 채용 준비하기" (Prepare for this job) → Learning Plan
- "지원 현황에 추가" (Add to tracker)
- "회사 정보 보기" (View company insights) [Premium]

**D. Job Description**
- Collapsible sections:
  - 주요 업무 (Main responsibilities)
  - 자격 요건 (Qualifications)
  - 우대 사항 (Preferred qualifications)
  - 혜택 및 복지 (Benefits)
- Highlight matched keywords in green

**E. Similar Jobs**
- 3-4 similar job cards
- "이런 채용도 있어요"

**F. Application Info**
- Application deadline
- External apply link
- "Apply" CTA button

---

### 10. Match Explanation
**Purpose**: Transparent breakdown of match score

**Triggered by**: Clicking "매칭 상세 보기" on Job Detail

**Layout**: Modal or full screen

**Sections:**

**A. Overall Score**
- Large percentage
- Explanation: "이 점수는 4가지 요소로 계산됩니다"

**B. Score Breakdown** (4 components)
1. **Skills Match (40%)**
   - Your score: 32/40
   - Matched skills: Python, React, Git (green tags)
   - Missing skills: Docker, AWS (red tags)
   - Impact: "+8% if you add Docker"

2. **Experience Level (30%)**
   - Your score: 20/30
   - Required: 1-2 years
   - Your experience: 0 years (student)
   - Gap: "인턴 경험 추가 시 +10%"

3. **Education (15%)**
   - Your score: 15/15 ✅
   - Required: Bachelor's in CS
   - Your education: SNU CS (matches)

4. **Projects/Portfolio (15%)**
   - Your score: 10/15
   - Evaluation: "2 relevant projects"
   - Improvement: "Add 1 more project: +5%"

**C. Action Plan CTA**
- "2주 준비 플랜 보기" (See 2-week prep plan)
- "이력서 최적화하기" (Optimize resume)

---

### 11. Job Filters
**Purpose**: Refine job search

**Filter Options:**
- **Match Score**: All / Apply Now / Prep Needed / Stretch
- **Job Type**: 정규직, 인턴, 계약직
- **Company Type**: 대기업, 공기업, 스타트업, 외국계
- **Location**: Seoul, Gyeonggi, Busan, etc.
- **Salary Range**: Slider (₩0 - ₩100M)
- **Experience Level**: 신입, 경력 1-3년, 3-5년
- **Industry**: IT, Finance, Consulting, etc.

**Features:**
- Multi-select checkboxes
- Clear all filters button
- Show result count as filters change
- Apply button

---

### 12. Saved Jobs
**Purpose**: Bookmarked jobs for later review

**Layout:**
- Same as Job Discovery but filtered to saved jobs
- Option to remove from saved
- Sort by: Date saved, Match %

**Empty State:**
- "저장한 채용이 없어요"
- "관심있는 채용을 저장해보세요"

---

## PREPARE MODULE

### 13. Skill Gap Analysis
**Purpose**: Overview of missing skills across target jobs

**Header:**
- "내가 부족한 스킬" (Skills I'm missing)
- Explanation: "관심있는 채용에서 자주 요구되는 스킬이에요"

**Skill List** (sorted by impact):
- Each skill shows:
  - Skill name (e.g., Docker)
  - Impact: "+8% average match increase"
  - Demand: "15개 채용에서 요구" (Required by 15 jobs)
  - Learning time: "3-5 days"
  - CTA: "학습 플랜 만들기" (Create learning plan)

**Prioritization Algorithm:**
- High priority: High impact + High demand + Low learning time
- Medium priority: Medium impact or demand
- Low priority: Low impact + High learning time

**Visualization:**
- Impact vs. Effort matrix (scatter plot)
- X-axis: Learning time
- Y-axis: Match score impact

---

### 14. Learning Plan
**Purpose**: 2-4 week action plan for specific job

**Triggered by**: "Prepare for this job" on Job Detail

**Header:**
- Target job title and company
- Current match: 68%
- Target match: 82% (after plan completion)
- Duration: 2 weeks

**Weekly Breakdown:**

**Week 1: Learn Docker Basics**
- Task 1: Complete Docker tutorial (Udemy link)
  - Estimated time: 4 hours
  - Checkbox to mark complete
- Task 2: Containerize existing project
  - Estimated time: 2 hours
  - Checkbox
- Task 3: Add Docker to resume
  - CTA: "이력서 업데이트" (Update resume)

**Week 2: Learn AWS EC2**
- Task 1: Complete AWS EC2 basics (YouTube link)
- Task 2: Deploy project to EC2
- Task 3: Update resume with deployment experience

**Progress Tracking:**
- Progress bar: "3 of 6 tasks complete"
- Celebration animation when week completed

**Features:**
- Mark tasks as complete
- Add custom tasks
- Adjust timeline
- Get reminders (push notifications)

---

### 15. Resume Optimizer
**Purpose**: AI-powered resume bullet rewriting

**Input:**
- Select target job (dropdown)
- Select language: Korean formal / English / Casual Korean
- Paste current resume bullet or select from profile

**AI Generation:**
- Loading state: "AI가 최적화 중..." (AI optimizing)
- Time: 5-10 seconds

**Output:**
- Before/After comparison (side-by-side)
- Improvements highlighted:
  - Added keywords (green)
  - Stronger action verbs (blue)
  - Quantified results (purple)
- Explanation: "왜 이렇게 바뀌었나요?" (Why changed?)

**Actions:**
- Copy to clipboard
- Apply to profile
- Regenerate (try again)
- Edit manually

**Limits:**
- Free: 1 optimization per month
- Premium: Unlimited

---

### 16. Resume Preview
**Purpose**: Before/after comparison of resume

**Layout:**
- Split screen (desktop) or toggle (mobile)
- Left: Original resume
- Right: Optimized resume
- Differences highlighted

**Features:**
- Download as PDF
- Share link
- Print

---

### 17. 자소서 Guidance
**Purpose**: Company-specific cover letter guidance

**Input:**
- Select target company
- Select 자소서 prompt (dropdown of common prompts):
  - "지원 동기와 입사 후 포부"
  - "본인의 강점과 약점"
  - "팀 프로젝트 갈등 해결 경험"
  - Custom prompt (text input)

**AI Guidance Output:**
- **Structure Recommendation**
  - Intro: Hook with specific company detail
  - Body: 2-3 relevant experiences
  - Conclusion: Align with company values
  
- **Which Experiences to Emphasize**
  - "Your React project aligns with Naver's tech stack"
  - "Mention your open-source contribution"
  
- **Company Values Alignment**
  - Naver values: "기술 혁신" and "사용자 중심"
  - How to frame: "Emphasize user impact in your stories"
  
- **Sample Phrasing** (NOT full text, just guidance)
  - Opening: "네이버의 [specific product]를 사용하며..."
  - Transition: "이러한 경험을 바탕으로..."

**Important:**
- Clear disclaimer: "이것은 가이드일 뿐, 복사-붙여넣기 하지 마세요"
- Human-in-the-loop: User must write their own text

**Premium Feature**

---

### 18. Interview Prep
**Purpose**: Company-specific interview preparation

**Sections:**

**A. Likely Question Categories**
- Technical: React, System Design
- Behavioral: Teamwork, Problem-solving
- Company-specific: Why Naver? Why this role?

**B. Resume Story Mapping**
- "For technical questions, talk about your React project"
- "For teamwork questions, use your team project story"

**C. Company Culture Framing**
- "Naver values technical depth and user impact"
- "Frame answers to show both"

**D. Practice Questions** (expandable list)
- "Explain React hooks to a non-technical person"
- "Tell me about a time you disagreed with a teammate"
- Sample answer framework (not full answer)

**E. Interview Format Guide** (Korean-specific)
- 인성검사 (Personality test) tips
- 그룹 토론 (Group discussion) strategies
- 발표 면접 (Presentation interview) structure

**Premium Feature**

---

## TRACK MODULE

### 19. Application Tracker
**Purpose**: Organize and track job applications

**Layout**: Kanban board (horizontal scroll on mobile)

**Columns:**
1. **관심있음** (Interested) - Saved jobs
2. **지원함** (Applied) - Submitted applications
3. **서류 통과** (Resume passed) - Moving forward
4. **면접** (Interview) - Interview scheduled
5. **최종** (Final) - Offer or rejection

**Job Cards** (in each column):
- Company logo
- Job title
- Company name
- Match percentage
- Date added
- Notes icon (if notes exist)
- Drag to move between columns

**Interactions:**
- Drag-and-drop to change status
- Tap card → Application Detail
- Swipe left → Archive
- Add new application (FAB button)

**Features:**
- Filter by date, company, status
- Search applications
- Export to CSV

---

### 20. Application Detail
**Purpose**: Track individual application with notes

**Sections:**

**A. Job Info**
- Company and title
- Match percentage
- Application date
- Current status (dropdown to change)

**B. Timeline**
- Visual timeline of status changes
- Dates for each stage

**C. Notes** (rich text editor)
- Interview notes
- Feedback received
- Preparation checklist
- Follow-up reminders

**D. Documents**
- Attach resume version used
- Attach cover letter
- View job description

**E. Contacts**
- Recruiter name and email
- Interviewer names
- Coffee chat connections

**F. Reminders**
- Set reminder for follow-up
- Interview prep reminder

---

### 21. Insights Dashboard
**Purpose**: AI feedback on application patterns

**Triggered**: After user has 10+ applications

**Insights Categories:**

**A. Match Score vs. Success Rate**
- Chart showing correlation
- "You get interviews 70% of time when match > 65%"
- Recommendation: "Focus on jobs with 65%+ match"

**B. Common Rejection Reasons**
- "You've been rejected 3x for lacking system design skills"
- CTA: "Create learning plan for system design"

**C. Application Speed**
- "You apply 5 days after job posting on average"
- "Jobs you applied to within 2 days had 50% higher response rate"
- Recommendation: "Apply faster"

**D. Skill Progress**
- "Your match score improved 12% over 3 weeks"
- Chart showing match score trend
- "You added Docker and AWS to resume"

**E. Industry Insights**
- "You apply mostly to startups (70%)"
- "Your interview rate is higher at mid-size companies (40%)"
- Recommendation: "Consider more mid-size companies"

**Visualization:**
- Line charts for trends
- Bar charts for comparisons
- Donut charts for breakdowns

---

## PROFILE & SETTINGS

### 22. User Profile
**Purpose**: View complete user profile

**Sections:**
- Profile photo (upload/change)
- Personal info (name, email, phone)
- Education
- Skills (tags)
- Experience
- Projects
- Resume file (download)
- Edit button (top right)

---

### 23. Edit Profile
**Purpose**: Update user information

**Form fields** (same structure as Profile Review):
- Editable text inputs
- Add/remove sections
- Save button
- Cancel button

---

### 24. Edit Resume
**Purpose**: Manual resume editing

**Features:**
- Rich text editor
- Section templates
- Bullet point formatting
- Save as PDF
- Preview mode

---

### 25. Preferences
**Purpose**: Job search preferences

**Settings:**
- Preferred job types (checkboxes)
- Preferred locations (multi-select)
- Preferred company types
- Salary expectations (range)
- Notification preferences
- Language preference (Korean / English)

---

### 26. Account Settings
**Purpose**: Account management

**Options:**
- Change email
- Change password
- Two-factor authentication (toggle)
- Email notifications (toggle)
- Push notifications (toggle)
- Delete account (with confirmation)

---

### 27. Subscription/Billing
**Purpose**: Manage premium subscription

**For Free Users:**
- Current plan: Free
- Usage stats:
  - Job matches this month: 15 / 20
  - Resume optimizations: 1 / 1
- Upgrade CTA with pricing
- Feature comparison table

**For Premium Users:**
- Current plan: Premium (₩14,900/month)
- Next billing date
- Payment method (card ending in 1234)
- Update payment method
- Cancel subscription (with confirmation)
- Billing history (downloadable invoices)

---

### 28. Help & Support
**Purpose**: User assistance

**Sections:**
- FAQ (collapsible questions)
- Video tutorials
- Contact support (email form)
- Live chat (if available)
- Feature requests
- Report bug

---

## POST-MVP FEATURES

### 29-33. Connect Module
(Detailed specs available but deferred to post-MVP as per strategic recommendations)

### 34. Success Stories
**Purpose**: Social proof and inspi
(Content truncated due to size limit. Use line ranges to read remaining content)