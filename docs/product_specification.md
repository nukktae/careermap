# AI Career Platform: Product Specification & Design System

**Date**: January 30, 2026  
**Author**: Manus AI

## 1. Introduction

This document provides a comprehensive product specification for the AI-powered career platform, tailored for Korean university students and early-career professionals. It outlines the design philosophy, visual style, complete screen inventory, user flows, and detailed feature requirements necessary to build a successful and engaging product. The specification is grounded in research on modern Korean UI/UX trends, Gen Z design preferences, and best practices from successful digital products like Toss.

## 2. Design Philosophy & Principles

The design philosophy is centered on the core principle: **"Clarity through simplicity, confidence through transparency."** The goal is to create an experience that is both professional and approachable, balancing the information density favored in Korean UI with the clean, visually engaging aesthetic expected by Gen Z.

### Core Design Principles:

*   **Problem-Solving First**: Following the Toss methodology, the design must first and foremost solve the user's fundamental problems of career uncertainty and preparation anxiety. Aesthetics serve to enhance, not replace, core functionality [1].
*   **Speed & Efficiency**: Every interaction should be fast and purposeful. The design must respect the user's time by minimizing clicks, providing clear navigation, and ensuring instant load times, aligning with both Korean user expectations and Gen Z's short attention spans [2, 3].
*   **Visual Clarity**: While information-rich, the interface must not be cluttered. A strong visual hierarchy, clear text labels, and strategic use of color will guide the user's attention and make complex data easy to understand.
*   **Authenticity & Transparency**: The platform must communicate with users in an authentic, human tone. AI-driven insights should be explained clearly, and the platform's processes should be transparent to build trust.
*   **Mobile-First**: The experience must be designed for mobile from the ground up, with a responsive design that adapts seamlessly to tablet and desktop environments.

## 3. Visual Style & Design System

This section details the visual language of the platform, ensuring a consistent and high-quality user experience across all screens.

### 3.1. Color System

The color palette is designed to be professional, modern, and functional.

| Color Role | Hex Code | Usage |
| :--- | :--- | :--- |
| **Brand Primary** | `#2563EB` | Main CTAs, links, active states, high match scores. Conveys trust and confidence. |
| **Success Green** | `#10B981` | Matched skills, completed tasks, positive feedback. |
| **Warning Yellow** | `#F59E0B` | "Prep Needed" jobs, medium-priority items, cautionary notes. |
| **Error Red** | `#EF4444` | Missing skills, gaps, error messages, urgent items. |
| **Primary Text** | `#111827` | Main content and headlines for maximum readability. |
| **Secondary Text** | `#4B5563` | Supporting text, descriptions, and labels. |
| **Background** | `#F9FAFB` | Clean, light background to keep the focus on content. |

**Dark Mode**: A full dark mode palette is specified, using shades of dark gray (e.g., `#111827` for the background) to reduce eye strain and provide a sleek, modern feel, a feature highly preferred by Gen Z [3].

### 3.2. Typography

The typography system is designed for high readability in both Korean and English.

| Language | Font Family | Rationale |
| :--- | :--- | :--- |
| **Korean** | **Pretendard Variable** | A modern, highly readable sans-serif font that renders beautifully on screens of all sizes. |
| **English** | **Inter Variable** | A clean, professional sans-serif that pairs perfectly with Pretendard and is optimized for UI. |

**Type Scale**: A responsive type scale is defined, with a base size of 16px on mobile and 18px on desktop for body text, ensuring comfortable reading. Headings are set in a clear hierarchy with bold weights to guide the user's eye.

### 3.3. Components

A comprehensive set of reusable components will form the building blocks of the UI. Key components include:

*   **Buttons**: Primary, secondary, and ghost styles with defined states (hover, active, disabled).
*   **Cards**: For job postings, dashboard summaries, and insights, with consistent padding, shadows, and hover effects.
*   **Form Inputs**: Text fields, dropdowns, checkboxes, and toggles with clear focus and error states.
*   **Tags & Badges**: For displaying skills, job status, and match scores with functional color-coding.
*   **Progress Indicators**: Linear and circular progress bars to visualize learning plans and match scores.

## 4. Screen Inventory & User Flows

The platform is composed of **28 MVP screens** and **8 post-MVP screens**, organized into logical modules.

### 4.1. Screen Inventory Summary

| Module | MVP Screens | Post-MVP Screens |
| :--- | :--- | :--- |
| **Authentication & Onboarding** | 3 | 0 |
| **Main Dashboard** | 1 | 0 |
| **Match Module** | 5 | 0 |
| **Prepare Module** | 6 | 0 |
| **Track Module** | 3 | 0 |
| **Profile & Settings** | 7 | 0 |
| **Connect Module** | 0 | 5 |
| **Advanced Features** | 0 | 3 |
| **Total** | **28** | **8** |

### 4.2. Critical User Flows

Four critical user flows are defined to ensure the platform delivers on its core promises.

1.  **First-Time User Onboarding**: This flow is designed to deliver an "aha!" moment within the first 10 minutes. The user signs up, uploads their resume, and immediately sees their job matches with transparent qualification gaps. This is the primary hook to drive engagement.

2.  **Job Application Preparation**: This is the core value loop. The user selects a target job, receives a personalized learning plan to close skill gaps, optimizes their resume with AI, and gets guidance for their cover letter and interview.

3.  **Application Tracking & Learning**: The user tracks their applications on a Kanban board. After several applications, the AI provides insights into their performance, helping them understand what works and what doesn't.

4.  **Subscription Conversion**: Free users are presented with a clear and compelling upgrade path when they access premium features like advanced preparation tools or company insights.

## 5. Detailed Feature Specifications

This section provides a detailed breakdown of the features for each key screen in the MVP.

### 5.1. Onboarding & Dashboard

| Screen | Key Features |
| :--- | :--- |
| **Landing Page** | Clear value proposition, social proof (testimonials, university logos), feature highlights, and a prominent "Start for Free" CTA. |
| **Resume Upload** | Drag-and-drop and file picker for PDF/DOCX resumes, with a progress bar and fun tips during the 20-30 second AI parsing process. |
| **Profile Review** | Displays the parsed resume data in editable fields, allowing the user to verify and correct the information before proceeding. |
| **Dashboard** | The central hub, featuring a personalized welcome, a summary of job matches categorized by qualification level, active learning plans, and an overview of application statuses. |

### 5.2. Match Module

| Screen | Key Features |
| :--- | :--- |
| **Job Discovery** | A scrollable list of job cards, each showing the company, title, and a large, color-coded match percentage. Supports search, filtering, and sorting. |
| **Job Detail** | Displays the full job description alongside a prominent match score card. Includes CTAs to "Prepare for this job" and "Add to tracker." |
| **Match Explanation** | A detailed, transparent breakdown of the match score, showing how it's calculated from skills, experience, education, and projects, and highlighting specific gaps. |

### 5.3. Prepare Module

| Screen | Key Features |
| :--- | :--- |
| **Skill Gap Analysis** | An overview of the user's most common missing skills across their target jobs, prioritized by impact, demand, and learning effort. |
| **Learning Plan** | A 2-4 week action plan for a specific job, with links to learning resources and tasks that directly improve the user's match score. |
| **Resume Optimizer** | An AI-powered tool that rewrites resume bullet points to be more impactful, with before/after comparisons and explanations. |
| **자소서 (Cover Letter) Guidance** | Provides structure, key themes, and phrasing suggestions for common Korean cover letter prompts, tailored to the target company. |

### 5.4. Track Module

| Screen | Key Features |
| :--- | :--- |
| **Application Tracker** | A Kanban board for managing job applications, with columns for "Interested," "Applied," "Interview," and "Final." |
| **Insights Dashboard** | After 10+ applications, this screen provides AI-driven feedback on the user's job search strategy, such as the correlation between match score and interview rates. |

## 6. Conclusion

This product specification document provides a detailed blueprint for creating a highly effective and engaging career platform for the Korean market. By adhering to these guidelines, the development team can build a product that is not only visually appealing and easy to use but also deeply valuable to its target users. The combination of data-driven clarity, personalized preparation, and cultural relevance will position the platform as an indispensable tool for the next generation of Korean professionals.

## 7. References

[1] Kang, S. (2025, April 12). *How Toss Became a Design Powerhouse: 10 Years of UX Evolution*. Medium. [https://medium.com/@posinity/how-toss-became-a-design-powerhouse-10-years-of-ux-evolution-e9fc0c51d180](https://medium.com/@posinity/how-toss-became-a-design-powerhouse-10-years-of-ux-evolution-e9fc0c51d180)

[2] Teqnoid. (2025, May 9). *How Korean UI/UX Design Stands Out from Global Trends*. [https://teqnoid.com/the-logic-behind-korean-ui-ux-design/](https://teqnoid.com/the-logic-behind-korean-ui-ux-design/)

[3] Mobisoft Infotech. (2024, December 3). *Designing for Gen Z: A Guide to UX and Digital Experience*. [https://mobisoftinfotech.com/resources/blog/ui-ux-design/gen-z-ux-design-guide](https://mobisoftinfotech.com/resources/blog/ui-ux-design/gen-z-ux-design-guide)
