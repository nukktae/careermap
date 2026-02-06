/**
 * Centralized Profile and Preferences data.
 * Persisted in localStorage; used by profile view, edit, resume, preferences.
 */

export interface Education {
  university: string;
  major: string;
  graduationYear: string;
  gpa: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  duration: string;
  description: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  photoUrl?: string;
  education: Education;
  skills: string[];
  experience: Experience[];
  projects: Project[];
  /** Plain text or section-based resume content for Edit Resume page */
  resumeSections?: Record<string, string>;
  /** Extracted or manually entered cover letter (자기소개서) content */
  coverLetterText?: string;
}

export type JobTypePref = "fulltime" | "intern" | "contract";
export type LocationPref = "seoul" | "gyeonggi" | "busan" | "remote";
export type CompanyTypePref = "대기업" | "공기업" | "스타트업" | "외국계";
export type LanguagePref = "ko" | "en";

export interface UserPreferences {
  jobTypes: JobTypePref[];
  locations: LocationPref[];
  companyTypes: CompanyTypePref[];
  salaryMin: number;
  salaryMax: number;
  emailNotifications: boolean;
  pushNotifications: boolean;
  language: LanguagePref;
}

const PROFILE_STORAGE_KEY = "careermap-profile";
const PREFERENCES_STORAGE_KEY = "careermap-preferences";

/** Single source of truth: default profile (resume data). Used when no profile is saved. */
const SEED_PROFILE: UserProfile = {
  name: "아노 BIEGDEMBEREL ANU",
  email: "anu.bn@yahoo.com",
  phone: "01032587720",
  education: {
    university: "국민대학교",
    major: "소프트웨어학과",
    graduationYear: "03/2023 – 03/2027",
    gpa: "-",
  },
  skills: [
    "HTML5", "CSS3", "React.js", "Tailwind CSS", "Vue.js", "Javascript", "Angular",
    "Flutter", "TypeScript", "Three.js", "Node.js", "Express.js", "Django", "Spring Boot",
    "Flask", "RESTful APIs", "Firebase", "PostgreSQL", "dynamoDB", "MySQL", "Figma", "Canva",
    "AWS", "Docker", "TensorFlow.js", "OpenAI", "스크럼", "팀 협업",
  ],
  experience: [
    {
      id: "exp-1",
      company: "Bestia Group LLC",
      role: "UI/UX 디자이너 & 프론트엔드 개발자 인턴",
      duration: "2025.08 – 2025.11",
      description:
        "맨해튼 비치, 캘리포니아, 미국. 부동산 에이전트와 UI/UX 분석, 100+ 사전등록, LeadBoard Lite 제품 데모 UI/UX 및 HTML-CSS 프론트엔드 설계, Figma 기반 반응형 React + HTML/CSS 구현, 온보딩 시간 단축 및 에이전트 업무 50+ 시간 절감.",
    },
    {
      id: "exp-2",
      company: "Friendly",
      role: "UI/UX 디자이너 & 풀스택 개발자",
      duration: "2025.08 – 2025.12",
      description:
        "국민대, 서울, 한국. 대학생 대상 AI 기반 학습 관리 모바일 앱, UI/UX 설계, 학습 일정/과제/강의/AI 요약 사용자 플로우, Figma IA·화면 플로우, React Native(Expo) 및 Firebase MVP, OpenAI API 연동.",
    },
    {
      id: "exp-3",
      company: "Handiers Inc.",
      role: "UI/UX 디자이너 인턴",
      duration: "2025.03 – 2025.09",
      description:
        "토런스, 캘리포니아. 모바일 앱 2종 및 마케팅 웹사이트 프론트엔드 설계·개발, 핵심 사용자 플로우(채팅, 예약, 견적 요청) 대규모 UX 리디자인, 데이터 기반 개선, Figma 기반 Flutter 반응형 인터페이스, 백엔드·CEO와 실시간 카메라 입력 및 AI 견적 협업.",
    },
    {
      id: "exp-4",
      company: "G-PBL 연구 활동",
      role: "UI/UX 디자이너 & 프론트엔드 개발자",
      duration: "2024.09 – 2024.12",
      description:
        "얼바인, 캘리포니아. IoT BLE 통신 Flutter 앱, Firebase Cloud Messaging으로 알림 전달 95%, MVVM 아키텍처, 재사용 컴포넌트, 다국어(영/한), iOS 14+ 및 Android 8+ 호환.",
    },
    {
      id: "exp-5",
      company: "RealMo",
      role: "AWS 백엔드 개발",
      duration: "2024.11 – 2025.01",
      description:
        "얼바인, 캘리포니아. AWS Kinesis 및 Rekognition 실시간 콘텐츠 관리(정확도 95%, 오탐 20% 감소), 고효율·저지연 검수 파이프라인.",
    },
  ],
  projects: [],
  resumeSections: {
    summary:
      "크로스 플랫폼 모바일과 웹 앱을 개발하는 풀스택 개발자입니다. Flutter, React, Node.js, PostgreSQL에 익숙하며, AI 기능과 안정적인 아키텍처 설계에 자신이 있습니다. 혁신적이고 사용자 친화적인 서비스를 만드는 데 열정을 쏟고 있습니다.",
    education: "국민대학교 소프트웨어학과, 03/2023 – 03/2027",
    experience:
      "Bestia Group LLC | UI/UX 디자이너 & 프론트엔드 개발자 인턴 (2025.08–2025.11)\nFriendly | UI/UX 디자이너 & 풀스택 개발자 (2025.08–2025.12)\nHandiers Inc. | UI/UX 디자이너 인턴 (2025.03–2025.09)\nG-PBL 연구 활동 | UI/UX 디자이너 & 프론트엔드 개발자 (2024.09–2024.12)\nRealMo | AWS 백엔드 개발 (2024.11–2025.01)",
    projects:
      "Friendly – 대학생 대상 AI 학습 관리 앱 (React Native, Firebase, OpenAI)\nG-PBL – IoT BLE Flutter 앱 (Firebase FCM, MVVM)\nRealMo – AWS Kinesis·Rekognition 실시간 콘텐츠 관리",
    skills:
      "HTML5, CSS3, React.js, Tailwind CSS, Vue.js, Javascript, Angular, Flutter, TypeScript, Three.js, Node.js, Express.js, Django, Spring Boot, Flask, RESTful APIs, Firebase, PostgreSQL, dynamoDB, MySQL, Figma, Canva, AWS, Docker, TensorFlow.js, OpenAI, 스크럼, 팀 협업",
  },
  coverLetterText: `자기소개서

1. 지원 동기
실제 사용자의 목소리를 듣고 문제를 정의하며, 디자인을 통해 이를 해결하는 과정 속에서 UI/UX 디자이너로서의 방향성을 확립해 왔습니다. 미국 스타트업 Bestia의 실제 서비스 프로젝트에 참여하며 부동산 중개사들과 주간 피드백 세션을 진행했고, 사용자 중심의 디자인이 실제 비즈니스 성과로 이어질 수 있음을 직접 경험했습니다.

2. 직무 역량
저는 사용자 연구를 기반으로 문제를 정의하고, 디자인과 기술을 연결해 실현 가능한 해결책을 만드는 UI/UX 디자이너입니다. Bestia 프로젝트에서는 사용자 인사이트를 기반으로 디자인 시스템을 구축했고, ClearGuide 프로젝트에서는 77개의 React 컴포넌트를 설계해 AI 기반 문서 분석 기능을 직관적인 UI로 구현했습니다.

3. 문제 해결 경험
Handiers Inc에서 핸디맨 매칭 플랫폼의 모바일 앱 UX 리디자인을 담당했습니다. 사용자 인터뷰와 데이터 분석을 바탕으로 정보 구조를 재정비하고, 전환 흐름이 안정화되는 결과를 만들었습니다.

4. 협업 경험
경진대회에서 5명의 팀 리더로서 Jira, Slack, Notion, GitHub를 도입해 Scrum 기반 Sprint를 운영했고, 3개월 동안 5개의 스프린트를 완주하며 100명 이상의 사전 대기 신청을 확보했습니다.

5. 학습 능력 및 성장 의지
몽골, 미국, 중국, 한국에서의 생활 경험을 통해 낯선 환경에서도 빠르게 학습하는 능력을 키워왔습니다. ClearGuide 프로젝트에서는 AI 기반 문서 분석이라는 낯선 도메인을 빠르게 학습해 복잡한 기능을 직관적인 UI로 구현했습니다.

6. 커리어 비전
UI/UX 디자이너로서 사용자 연구를 통해 본질적인 문제를 정의하고 이를 실제 서비스로 연결하는 역량을 커리어 전반의 핵심으로 삼고 있습니다. 풀스택 개발 경험을 바탕으로 디자인을 구현 가능한 형태로 설계하고, 개발자와 효율적으로 협업하는 것이 저의 강점입니다.`,
};

const SEED_PREFERENCES: UserPreferences = {
  jobTypes: ["fulltime", "intern"],
  locations: ["seoul", "remote"],
  companyTypes: ["스타트업", "대기업"],
  salaryMin: 4000,
  salaryMax: 6000,
  emailNotifications: true,
  pushNotifications: true,
  language: "ko",
};

function loadProfile(): UserProfile {
  if (typeof window === "undefined") return SEED_PROFILE;
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!raw) {
      saveProfile(SEED_PROFILE);
      return { ...SEED_PROFILE };
    }
    const parsed = JSON.parse(raw) as UserProfile;
    return { ...SEED_PROFILE, ...parsed };
  } catch {
    return { ...SEED_PROFILE };
  }
}

function saveProfile(profile: UserProfile): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
  } catch {
    // ignore
  }
}

function loadPreferences(): UserPreferences {
  if (typeof window === "undefined") return { ...SEED_PREFERENCES };
  try {
    const raw = localStorage.getItem(PREFERENCES_STORAGE_KEY);
    if (!raw) {
      savePreferences(SEED_PREFERENCES);
      return { ...SEED_PREFERENCES };
    }
    const parsed = JSON.parse(raw) as Partial<UserPreferences>;
    return { ...SEED_PREFERENCES, ...parsed };
  } catch {
    return { ...SEED_PREFERENCES };
  }
}

function savePreferences(prefs: UserPreferences): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    // ignore
  }
}

export function getProfile(): UserProfile {
  const p = loadProfile();
  return { ...p };
}

const RESUME_SECTION_KEYS = ["summary", "education", "experience", "projects", "skills"] as const;

/** Build resumeSections from structured profile so one source of truth is used everywhere. */
export function getResumeSectionsForDisplay(profile: UserProfile): Record<string, string> {
  const rs = profile.resumeSections ?? {};
  const hasAll = RESUME_SECTION_KEYS.every((k) => (rs[k] ?? "").trim().length > 0);
  if (hasAll) {
    const out: Record<string, string> = {};
    RESUME_SECTION_KEYS.forEach((k) => {
      out[k] = rs[k] ?? "";
    });
    return out;
  }
  const e = profile.education;
  const educationText = [e.university, e.major, e.graduationYear].filter(Boolean).join(", ") || (e.gpa && e.gpa !== "-" ? `학점 ${e.gpa}` : "") || "";
  const experienceText = profile.experience
    .map((x) => `${x.company} | ${x.role} (${x.duration})`)
    .join("\n");
  const projectsText = profile.projects
    .map((p) => `${p.title} – ${p.description} (${p.techStack.join(", ")})`)
    .join("\n");
  return {
    summary: (rs.summary ?? "").trim() || "",
    education: (rs.education ?? "").trim() || educationText,
    experience: (rs.experience ?? "").trim() || experienceText,
    projects: (rs.projects ?? "").trim() || projectsText,
    skills: (rs.skills ?? "").trim() || profile.skills.join(", ") || "",
  };
}

export function updateProfile(patch: Partial<UserProfile>): void {
  const current = loadProfile();
  const next: UserProfile = {
    ...current,
    ...patch,
    education: patch.education ? { ...current.education, ...patch.education } : current.education,
    experience: patch.experience ?? current.experience,
    projects: patch.projects ?? current.projects,
    skills: patch.skills ?? current.skills,
  };
  saveProfile(next);
}

export function getPreferences(): UserPreferences {
  const p = loadPreferences();
  return { ...p };
}

export function updatePreferences(patch: Partial<UserPreferences>): void {
  const current = loadPreferences();
  const next: UserPreferences = { ...current, ...patch };
  savePreferences(next);
}

export const JOB_TYPE_LABELS: Record<JobTypePref, string> = {
  fulltime: "정규직",
  intern: "인턴",
  contract: "계약직",
};

export const LOCATION_LABELS: Record<LocationPref, string> = {
  seoul: "서울",
  gyeonggi: "경기",
  busan: "부산",
  remote: "리모트",
};

export const LANGUAGE_LABELS: Record<LanguagePref, string> = {
  ko: "한국어",
  en: "English",
};
