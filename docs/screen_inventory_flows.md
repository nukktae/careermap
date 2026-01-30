# Complete Screen Inventory & User Flows

## Screen Count Summary
**Total Screens: 28 screens** (MVP) + 8 post-MVP screens = **36 total screens**

---

## MVP SCREENS (28 screens)

### Authentication Flow (3 screens)
1. **Landing Page** - Marketing homepage
2. **Sign Up** - Account creation
3. **Login** - User authentication

### Onboarding Flow (3 screens)
4. **Welcome Screen** - First-time user greeting
5. **Resume Upload** - Upload PDF/DOCX resume
6. **Profile Review** - Review and edit parsed resume data

### Main Dashboard (1 screen)
7. **Dashboard/Home** - Central hub with overview of all features

### Match Module (5 screens)
8. **Job Discovery** - Browse all matched jobs
9. **Job Detail** - Individual job posting with match breakdown
10. **Match Explanation** - Detailed view of match score components
11. **Job Filters** - Filter jobs by criteria
12. **Saved Jobs** - Bookmarked jobs for later

### Prepare Module (6 screens)
13. **Skill Gap Analysis** - View missing skills across target jobs
14. **Learning Plan** - 2-4 week action plan for specific job
15. **Resume Optimizer** - AI-powered resume bullet rewriting
16. **Resume Preview** - Before/after comparison view
17. **자소서 Guidance** - Cover letter structure and tips
18. **Interview Prep** - Company-specific interview preparation

### Track Module (3 screens)
19. **Application Tracker** - Kanban board of applications
20. **Application Detail** - Individual application with notes
21. **Insights Dashboard** - AI feedback on application patterns

### Profile & Settings (7 screens)
22. **User Profile** - Personal information and resume
23. **Edit Profile** - Update user information
24. **Edit Resume** - Manual resume editing
25. **Preferences** - Job search preferences and filters
26. **Account Settings** - Password, email, notifications
27. **Subscription/Billing** - Upgrade to premium, payment
28. **Help & Support** - FAQs, contact support

---

## POST-MVP SCREENS (8 screens)

### Connect Module (5 screens)
29. **Company Insights** - Detailed company profile page
30. **Coffee Chat Guide** - Networking strategy recommendations
31. **LinkedIn Analyzer** - Paste URL to analyze profile
32. **Message Generator** - AI-generated outreach messages
33. **Networking Tracker** - Track coffee chats and connections

### Advanced Features (3 screens)
34. **Success Stories** - User testimonials and case studies
35. **Resume Library** - Browse successful resume examples
36. **Community/Forum** - User discussions and Q&A

---

## DETAILED USER FLOWS

### Flow 1: First-Time User Onboarding (Critical Path)
**Goal: Deliver "aha moment" within 10 minutes**

```
Landing Page 
  → Sign Up (email + password or Google OAuth)
  → Welcome Screen (brief value prop)
  → Resume Upload (drag-drop or file picker)
  → [AI Processing: 20-30 seconds]
  → Profile Review (show parsed data, allow edits)
  → Dashboard (show 10-20 matched jobs immediately)
  → Job Detail (click on job → see match breakdown)
  → [USER HOOKED: understands qualification gaps]
```

**Success Metrics:**
- Time to first match score: < 3 minutes
- % users who view at least 1 job detail: > 80%
- % users who return within 24 hours: > 40%

---

### Flow 2: Job Application Preparation (Core Value)
**Goal: Help user prepare for specific job**

```
Dashboard 
  → Job Discovery (browse matched jobs)
  → Job Detail (select target job, 68% match)
  → See Gap Analysis (missing: Docker, AWS)
  → Click "Prepare for This Job"
  → Learning Plan (2-4 week roadmap)
  → [User completes Week 1 tasks]
  → Resume Optimizer (rewrite bullets to highlight new skills)
  → Resume Preview (before/after comparison)
  → Download Updated Resume
  → 자소서 Guidance (company-specific tips)
  → Interview Prep (likely questions)
  → Application Tracker (mark as "Ready to Apply")
```

**Success Metrics:**
- % users who create learning plan: > 30%
- % users who use resume optimizer: > 50%
- % users who complete at least 1 learning task: > 20%

---

### Flow 3: Application Tracking & Learning
**Goal: Organize applications and learn from patterns**

```
Dashboard 
  → Application Tracker
  → Add New Application (job title, company, status)
  → Update Status (Applied → Interview → Offer/Rejected)
  → Add Notes ("Struggled with system design question")
  → [After 10+ applications]
  → Insights Dashboard (AI shows patterns)
  → See: "You get interviews 70% of time when match > 65%"
  → See: "You've been rejected 3x for system design"
  → Click "Improve System Design"
  → Learning Plan (targeted skill development)
```

**Success Metrics:**
- % users who track > 5 applications: > 40%
- % users who add notes: > 25%
- % users who view insights: > 60% (after 10 apps)

---

### Flow 4: Subscription Conversion (Monetization)
**Goal: Convert free users to paid**

**Trigger Points:**
1. After viewing 10 free job matches (soft limit)
2. When trying to use Resume Optimizer (2nd time)
3. When clicking on 자소서 Guidance
4. When viewing Company Insights

```
[User hits paywall]
  → Upgrade Modal (show premium features)
  → Pricing Page (₩14,900/month or ₩149,000/year)
  → Enter Payment Info
  → Confirmation Screen
  → Return to Feature (now unlocked)
```

**Success Metrics:**
- Free-to-paid conversion rate: > 5%
- Time to conversion: 2-4 weeks average
- Churn rate: < 30% annually

---

## NAVIGATION STRUCTURE

### Primary Navigation (Bottom Tab Bar - Mobile)
1. **Home** (Dashboard icon)
2. **Jobs** (Search icon)
3. **Prepare** (Target icon)
4. **Track** (Checklist icon)
5. **Profile** (User icon)

### Secondary Navigation (Top Bar)
- Notifications (bell icon)
- Settings (gear icon)
- Upgrade to Premium (crown icon - if free user)

### Tertiary Navigation (Contextual)
- Back button (top left)
- Action buttons (top right: Save, Share, Edit)
- FAB (Floating Action Button) for quick actions

---

## SCREEN TRANSITION PATTERNS

### Instant Transitions (No animation)
- Tab switches in bottom navigation
- Modal open/close

### Slide Transitions (0.3s)
- Screen push/pop in navigation stack
- Drawer open/close

### Fade Transitions (0.2s)
- Loading states
- Content updates

### Custom Transitions
- Swipe gestures for job cards (Tinder-style)
- Pull-to-refresh on lists
- Expand/collapse for details

---

## RESPONSIVE DESIGN CONSIDERATIONS

### Mobile (Primary - 360px to 428px width)
- Bottom tab navigation
- Single column layouts
- Thumb-friendly touch targets (min 44x44px)
- Swipe gestures enabled

### Tablet (768px to 1024px width)
- Side navigation drawer
- Two-column layouts where appropriate
- Larger touch targets
- More content visible

### Desktop (1280px+ width)
- Top navigation bar
- Multi-column layouts
- Hover states
- Keyboard shortcuts
- More dense information display

---

## EMPTY STATES & ERROR STATES

### Empty States (First-time users)
- No jobs matched yet → "Upload resume to see matches"
- No applications tracked → "Start applying and track here"
- No saved jobs → "Save jobs you're interested in"

### Error States
- Resume parsing failed → "Try different format or manual entry"
- Network error → "Check connection and retry"
- Payment failed → "Update payment method"

### Loading States
- Resume parsing → Progress bar with "Analyzing your resume..."
- Job matching → Skeleton screens with shimmer effect
- AI generation → Animated dots with "Generating..."

---

## NOTIFICATION SYSTEM

### In-App Notifications
- New job matches (daily digest)
- Learning plan reminders
- Application status updates
- AI insights available

### Push Notifications (Optional, user-controlled)
- High-match job posted (> 85% match)
- Application deadline approaching
- Interview prep reminder
- Weekly progress summary

### Email Notifications (Optional)
- Welcome email
- Weekly job digest
- Monthly insights report
- Billing notifications

---

## GESTURE INTERACTIONS

### Swipe Gestures
- Swipe left on job card → Save for later
- Swipe right on job card → Not interested
- Swipe down → Refresh list
- Swipe left on application → Archive

### Tap Gestures
- Single tap → Open detail
- Double tap → Quick save (like)
- Long press → Show context menu

### Pinch & Zoom
- Resume preview → Zoom in/out
- Charts and graphs → Zoom for details