# Design System & Visual Style Guidelines

## Design Philosophy

**Core Principle**: "Clarity through simplicity, confidence through transparency"

The design system balances Korean UI/UX preferences (information density, speed, functionality) with Gen Z expectations (visual appeal, personalization, authenticity) to create an experience that feels both professional and approachable.

---

## Color System

### Primary Colors

**Brand Primary - Confidence Blue**
- Primary 500: `#2563EB` (Main brand color)
- Primary 400: `#3B82F6` (Hover states)
- Primary 600: `#1D4ED8` (Active states)
- Primary 700: `#1E40AF` (Dark mode primary)

**Usage**: CTAs, links, active states, match score indicators (high match)

**Rationale**: Blue conveys trust and professionalism, essential for career platform. Vibrant enough to attract Gen Z attention.

---

### Secondary Colors

**Success Green**
- Success 500: `#10B981` (Matched skills, positive indicators)
- Success 100: `#D1FAE5` (Success backgrounds)

**Warning Yellow**
- Warning 500: `#F59E0B` (Prep needed, medium priority)
- Warning 100: `#FEF3C7` (Warning backgrounds)

**Error Red**
- Error 500: `#EF4444` (Missing skills, rejections)
- Error 100: `#FEE2E2` (Error backgrounds)

**Usage**: 
- Green: Matched skills, completed tasks, positive feedback
- Yellow: Prep needed jobs, medium priority items
- Red: Missing skills, gaps, urgent items

---

### Neutral Colors

**Light Mode**
- Gray 50: `#F9FAFB` (Background)
- Gray 100: `#F3F4F6` (Card backgrounds)
- Gray 200: `#E5E7EB` (Borders)
- Gray 400: `#9CA3AF` (Placeholder text)
- Gray 600: `#4B5563` (Secondary text)
- Gray 900: `#111827` (Primary text)

**Dark Mode**
- Gray 900: `#111827` (Background)
- Gray 800: `#1F2937` (Card backgrounds)
- Gray 700: `#374151` (Borders)
- Gray 500: `#6B7280` (Placeholder text)
- Gray 300: `#D1D5DB` (Secondary text)
- Gray 50: `#F9FAFB` (Primary text)

---

### Match Score Colors (Gradient)

**High Match (85-100%)**: Green gradient
- From: `#10B981` To: `#059669`

**Medium Match (60-84%)**: Yellow-Orange gradient
- From: `#F59E0B` To: `#D97706`

**Low Match (0-59%)**: Red-Pink gradient
- From: `#EF4444` To: `#DC2626`

**Rationale**: Color-coded match scores provide instant visual feedback, aligning with Korean preference for information density.

---

## Typography

### Font Families

**Korean Text**: Pretendard Variable
- Modern, highly readable Korean font
- Excellent rendering at all sizes
- Variable font for performance

**English Text**: Inter Variable
- Clean, professional sans-serif
- Excellent for UI and body text
- Variable font for performance

**Monospace** (for code): JetBrains Mono
- Used for technical content, code snippets

---

### Type Scale

**Mobile (Base: 16px)**

| Style | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| H1 | 28px | 700 | 36px | Page titles |
| H2 | 24px | 700 | 32px | Section headers |
| H3 | 20px | 600 | 28px | Card titles |
| H4 | 18px | 600 | 24px | Subsection headers |
| Body Large | 16px | 400 | 24px | Primary body text |
| Body | 14px | 400 | 20px | Secondary body text |
| Body Small | 12px | 400 | 16px | Captions, labels |
| Button | 16px | 600 | 24px | Button text |
| Link | 14px | 500 | 20px | Inline links |

**Desktop (Base: 16px)**

| Style | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| H1 | 36px | 700 | 44px | Page titles |
| H2 | 30px | 700 | 38px | Section headers |
| H3 | 24px | 600 | 32px | Card titles |
| H4 | 20px | 600 | 28px | Subsection headers |
| Body Large | 18px | 400 | 28px | Primary body text |
| Body | 16px | 400 | 24px | Secondary body text |
| Body Small | 14px | 400 | 20px | Captions, labels |

---

### Text Hierarchy

**Primary Text**: Gray 900 (light mode) / Gray 50 (dark mode)
- Main content, headlines

**Secondary Text**: Gray 600 (light mode) / Gray 300 (dark mode)
- Supporting text, descriptions

**Tertiary Text**: Gray 400 (light mode) / Gray 500 (dark mode)
- Placeholders, disabled text

**Emphasis**: Primary 500 or Success 500
- Important keywords, matched skills

---

## Spacing System

**Base Unit**: 4px

**Scale**: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96

**Common Usage:**
- 4px: Icon padding, tight spacing
- 8px: Small gaps, form field padding
- 12px: Medium gaps, button padding
- 16px: Standard card padding, list item spacing
- 24px: Section spacing, card gaps
- 32px: Large section spacing
- 48px: Page section dividers
- 64px: Hero section padding

**Responsive Adjustments:**
- Mobile: Use smaller spacing (16px standard)
- Tablet: Medium spacing (20px standard)
- Desktop: Larger spacing (24px standard)

---

## Layout & Grid

### Mobile (360px - 428px)

**Container:**
- Max width: 100%
- Padding: 16px horizontal

**Grid:**
- Single column
- Gap: 16px

---

### Tablet (768px - 1024px)

**Container:**
- Max width: 768px
- Padding: 24px horizontal

**Grid:**
- 2 columns (for cards)
- Gap: 24px

---

### Desktop (1280px+)

**Container:**
- Max width: 1280px
- Padding: 32px horizontal
- Centered

**Grid:**
- 12 columns
- Gap: 24px
- Flexible column spans

---

## Components

### Buttons

**Primary Button**
- Background: Primary 500
- Text: White, 16px, weight 600
- Padding: 12px 24px
- Border radius: 8px
- Hover: Primary 400
- Active: Primary 600
- Disabled: Gray 300, cursor not-allowed

**Secondary Button**
- Background: Transparent
- Border: 2px solid Primary 500
- Text: Primary 500
- Padding: 10px 22px (account for border)
- Border radius: 8px
- Hover: Background Primary 50
- Active: Background Primary 100

**Ghost Button**
- Background: Transparent
- Text: Gray 600
- Padding: 12px 24px
- Border radius: 8px
- Hover: Background Gray 100
- Active: Background Gray 200

**Icon Button**
- Size: 40x40px
- Icon: 20x20px
- Border radius: 8px
- Hover: Background Gray 100
- Active: Background Gray 200

**Loading State**
- Show spinner icon
- Disable button
- Maintain size (no layout shift)

---

### Cards

**Standard Card**
- Background: White (light) / Gray 800 (dark)
- Border: 1px solid Gray 200 (light) / Gray 700 (dark)
- Border radius: 12px
- Padding: 16px
- Shadow: 0 1px 3px rgba(0,0,0,0.1)
- Hover: Shadow 0 4px 6px rgba(0,0,0,0.1), translate -2px

**Job Card** (specific)
- All standard card properties
- Plus: Match badge (top right)
- Company logo (48x48px, rounded)
- Title (H4, truncate after 2 lines)
- Company name (Body Small, Gray 600)
- Match percentage (H3, color-coded)
- Matched skills (3 tags max)
- Bookmark icon (top right)

---

### Form Inputs

**Text Input**
- Height: 44px (mobile), 40px (desktop)
- Padding: 12px 16px
- Border: 1px solid Gray 300
- Border radius: 8px
- Font: Body
- Focus: Border Primary 500, shadow 0 0 0 3px Primary 100
- Error: Border Error 500, shadow Error 100
- Disabled: Background Gray 100, cursor not-allowed

**Text Area**
- Min height: 120px
- Padding: 12px 16px
- Resizable: vertical
- Other properties same as text input

**Select Dropdown**
- Same as text input
- Chevron icon (right side)
- Dropdown menu: White background, shadow, max-height 300px, scroll

**Checkbox**
- Size: 20x20px
- Border: 2px solid Gray 400
- Border radius: 4px
- Checked: Background Primary 500, white checkmark
- Focus: Shadow 0 0 0 3px Primary 100

**Radio Button**
- Size: 20x20px
- Border: 2px solid Gray 400
- Border radius: 50%
- Selected: Border Primary 500, inner dot Primary 500 (8x8px)

**Toggle Switch**
- Width: 44px, Height: 24px
- Background: Gray 300 (off), Primary 500 (on)
- Border radius: 12px
- Knob: 20x20px, white, shadow
- Transition: 0.2s ease

---

### Tags/Chips

**Skill Tag**
- Padding: 6px 12px
- Border radius: 16px (pill shape)
- Font: Body Small, weight 500
- Matched skill: Background Success 100, text Success 700
- Missing skill: Background Error 100, text Error 700
- Neutral: Background Gray 100, text Gray 700
- Close icon (optional): 16x16px, clickable

---

### Badges

**Match Badge**
- Padding: 4px 8px
- Border radius: 4px
- Font: Body Small, weight 600
- Apply Now: Background Success 500, text white
- Prep Needed: Background Warning 500, text white
- Stretch Goal: Background Error 500, text white

**Notification Badge**
- Size: 20x20px (or auto-width for 2+ digits)
- Border radius: 10px (circle)
- Background: Error 500
- Text: White, 12px, weight 600
- Position: Top right of icon, -8px offset

---

### Progress Indicators

**Progress Bar**
- Height: 8px
- Border radius: 4px
- Background: Gray 200
- Fill: Primary 500 gradient
- Animated: Shimmer effect during loading

**Circular Progress** (for percentages)
- Size: 120px (large), 80px (medium), 48px (small)
- Stroke width: 8px (large), 6px (medium), 4px (small)
- Background stroke: Gray 200
- Progress stroke: Color-coded by match score
- Center text: Percentage, H3 (large), H4 (medium), Body (small)

**Skeleton Loader**
- Background: Gray 200
- Shimmer: Gray 300 to Gray 100, 1.5s animation
- Border radius: Match component shape

---

### Modals

**Standard Modal**
- Background: White (light) / Gray 800 (dark)
- Border radius: 16px
- Padding: 24px
- Max width: 600px (mobile: 90vw)
- Shadow: 0 20px 25px rgba(0,0,0,0.15)
- Backdrop: rgba(0,0,0,0.5), blur 4px
- Close button: Top right, icon button
- Animation: Fade in + scale from 0.95 to 1

**Bottom Sheet** (mobile alternative)
- Slide up from bottom
- Border radius: 16px 16px 0 0
- Drag handle: 32x4px, Gray 300, centered top
- Swipe down to close

---

### Toasts/Notifications

**Toast**
- Width: 360px (desktop), 90vw (mobile)
- Padding: 16px
- Border radius: 8px
- Shadow: 0 4px 6px rgba(0,0,0,0.1)
- Position: Top right (desktop), top center (mobile)
- Animation: Slide in from right (desktop), slide down (mobile)
- Auto-dismiss: 4 seconds
- Types:
  - Success: Background Success 500, text white, checkmark icon
  - Error: Background Error 500, text white, X icon
  - Info: Background Primary 500, text white, info icon
  - Warning: Background Warning 500, text white, alert icon

---

### Navigation

**Bottom Tab Bar** (mobile)
- Height: 64px
- Background: White (light) / Gray 900 (dark)
- Border top: 1px solid Gray 200 (light) / Gray 700 (dark)
- 5 tabs, evenly spaced
- Each tab:
  - Icon: 24x24px
  - Label: 10px, weight 500
  - Active: Primary 500 (icon + text)
  - Inactive: Gray 400 (icon + text)
  - Tap: Scale to 0.95, bounce back

**Top Navigation Bar** (desktop)
- Height: 64px
- Background: White (light) / Gray 900 (dark)
- Border bottom: 1px solid Gray 200 (light) / Gray 700 (dark)
- Logo: Left (height 32px)
- Nav links: Center (Body, weight 500)
- Actions: Right (notifications, profile)

**Side Drawer** (tablet/desktop)
- Width: 280px
- Background: White (light) / Gray 900 (dark)
- Border right: 1px solid Gray 200 (light) / Gray 700 (dark)
- Nav items:
  - Height: 48px
  - Padding: 12px 16px
  - Icon: 20x20px, left
  - Text: Body, weight 500
  - Active: Background Primary 50, text Primary 600
  - Hover: Background Gray 100

---

## Iconography

**Icon Library**: Heroicons (outline and solid variants)

**Sizes:**
- Small: 16x16px (inline with text)
- Medium: 20x20px (buttons, nav)
- Large: 24x24px (headers, feature icons)
- XL: 32x32px (empty states)

**Style:**
- Use outline icons for inactive states
- Use solid icons for active states
- Stroke width: 2px (outline)
- Color: Inherit from parent or Gray 600

**Common Icons:**
- Home: house
- Jobs: magnifying-glass
- Prepare: target
- Track: clipboard-list
- Profile: user-circle
- Notification: bell
- Settings: cog
- Edit: pencil
- Delete: trash
- Save: bookmark
- Share: share
- Close: x-mark
- Check: check
- Plus: plus
- Arrow right: arrow-right
- Chevron down: chevron-down

---

## Illustrations & Graphics

**Style**: Modern, friendly, minimal
- Flat design with subtle gradients
- Rounded shapes
- Limited color palette (brand colors)
- Relatable scenarios (students, laptops, resumes)

**Usage:**
- Empty states (no data yet)
- Onboarding screens
- Success/error states
- Feature highlights on landing page

**Sources:**
- Custom illustrations (preferred)
- Undraw.co (free, customizable)
- Storyset by Freepik (free with attribution)

**File Format**: SVG (scalable, small file size)

---

## Animations & Micro-interactions

**Principles:**
- Purposeful: Every animation should have a reason
- Fast: 200-300ms for most transitions
- Smooth: Use easing functions (ease-out, ease-in-out)
- Subtle: Don't distract from content

**Common Animations:**

**Button Hover**
- Scale: 1.02
- Shadow: Increase
- Duration: 200ms
- Easing: ease-out

**Button Press**
- Scale: 0.98
- Duration: 100ms
- Easing: ease-in

**Card Hover**
- Translate: -2px vertical
- Shadow: Increase
- Duration: 200ms
- Easing: ease-out

**Page Transition**
- Fade in: 300ms
- Slide in: 300ms (from right for forward, left for back)
- Easing: ease-in-out

**Loading Spinner**
- Rotate: 360deg
- Duration: 1s
- Easing: linear
- Infinite loop

**Progress Bar Fill**
- Width: Animate from 0 to target %
- Duration: 1s
- Easing: ease-out

**Toast Notification**
- Slide in: 300ms
- Slide out: 300ms
- Easing: ease-in-out

**Skeleton Shimmer**
- Gradient move: Left to right
- Duration: 1.5s
- Easing: ease-in-out
- Infinite loop

**Success Checkmark**
- Draw path: 500ms
- Scale: 0.8 to 1.1 to 1
- Duration: 600ms
- Easing: ease-out

---

## Accessibility

**WCAG 2.1 Level AA Compliance**

**Color Contrast:**
- Text on background: Minimum 4.5:1 (body text), 3:1 (large text)
- All color combinations tested for contrast
- Never rely on color alone to convey information

**Keyboard Navigation:**
- All interactive elements focusable
- Focus indicator: 2px solid Primary 500, 3px offset
- Logical tab order
- Keyboard shortcuts for power users

**Screen Readers:**
- Semantic HTML (headings, lists, nav, main, etc.)
- ARIA labels for icons and interactive elements
- Alt text for all images
- Skip to main content link

**Touch Targets:**
- Minimum size: 44x44px (mobile)
- Adequate spacing between targets (8px minimum)

**Motion:**
- Respect prefers-reduced-motion
- Disable animations if user prefers reduced motion
- Provide alternative static states

**Forms:**
- Clear labels for all inputs
- Error messages associated with inputs (aria-describedby)
- Required fields marked (aria-required)
- Validation feedback (visual + text)

---

## Responsive Breakpoints

```css
/* Mobile first approach */
/* Extra small devices (phones, less than 640px) */
/* Default styles */

/* Small devices (large phones, 640px and up) */
@media (min-width: 640px) { }

/* Medium devices (tablets, 768px and up) */
@media (min-width: 768px) { }

/* Large devices (desktops, 1024px and up) */
@media (min-width: 1024px) { }

/* Extra large devices (large desktops, 1280px and up) */
@media (min-width: 1280px) { }

/* 2XL devices (larger desktops, 1536px and up) */
@media (min-width: 1536px) { }
```

---

## Dark Mode

**Implementation**: CSS custom properties (variables) with class toggle

**Strategy:**
- Respect system preference (prefers-color-scheme)
- Allow manual toggle (user preference saved)
- Smooth transition between modes (200ms)

**Color Adjustments:**
- Reduce contrast slightly (pure black → Gray 900)
- Increase color saturation slightly for vibrancy
- Adjust shadows (lighter, more subtle)
- Test all components in both modes

**Images:**
- Use SVGs with currentColor where possible
- Provide dark mode variants for illustrations
- Reduce opacity of photos slightly in dark mode

---

## Performance Considerations

**Images:**
- Use WebP format with fallback
- Lazy load images below the fold
- Provide multiple sizes (srcset) for responsive images
- Compress images (80-85% quality)

**Fonts:**
- Use variable fonts (single file, multiple weights)
- Subset fonts (Korean + Latin only)
- Preload critical fonts
- Use font-display: swap

**Animations:**
- Use CSS transforms (GPU-accelerated)
- Avoid animating layout properties (width, height, margin)
- Use will-change sparingly
- Disable animations on low-end devices

**Code Splitting:**
- Lazy load routes
- Lazy load heavy components (charts, editors)
- Tree-shake unused code

---

## Design Tokens (CSS Variables)

```css
:root {
  /* Colors */
  --color-primary-500: #2563EB;
  --color-success-500: #10B981;
  --color-warning-500: #F59E0B;
  --color-error-500: #EF4444;
  --color-gray-50: #F9FAFB;
  --color-gray-900: #111827;
  
  /* Spacing */
  --spacing-xs: 
(Content truncated due to size limit. Use line ranges to read remaining content)


