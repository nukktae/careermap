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

const SEED_PROFILE: UserProfile = {
  name: "김민준",
  email: "minjun.kim@example.com",
  phone: "010-2345-6789",
  education: {
    university: "서울대학교",
    major: "컴퓨터공학과",
    graduationYear: "2026 (예정)",
    gpa: "3.8 / 4.5",
  },
  skills: ["React", "TypeScript", "Node.js", "Python", "Git", "AWS"],
  experience: [
    {
      id: "exp-1",
      company: "네이버",
      role: "프론트엔드 개발 인턴",
      duration: "2024.06 - 2024.08",
      description:
        "React와 TypeScript 기반 웹 서비스 개발. 대시보드 성능 개선으로 LCP 20% 단축.",
    },
    {
      id: "exp-2",
      company: "카카오",
      role: "백엔드 개발 인턴",
      duration: "2023.12 - 2024.02",
      description:
        "Node.js API 설계 및 배포. 일일 트래픽 10만 건 처리 파이프라인 구축.",
    },
  ],
  projects: [
    {
      id: "proj-1",
      title: "취업 플랫폼 포트폴리오",
      description:
        "Next.js와 Tailwind로 구축한 반응형 포트폴리오 및 채용 매칭 데모.",
      techStack: ["Next.js", "Tailwind CSS", "Vercel"],
    },
    {
      id: "proj-2",
      title: "실시간 협업 툴",
      description:
        "WebSocket 기반 실시간 문서 편집 및 채팅 기능을 갖춘 팀 협업 앱.",
      techStack: ["React", "Node.js", "Socket.io", "MongoDB"],
    },
  ],
  resumeSections: {
    summary:
      "컴퓨터공학을 전공하며 프론트엔드와 백엔드 경험을 쌓았습니다. 사용자 경험과 성능 개선에 관심이 많습니다.",
    education: "서울대학교 컴퓨터공학과 2026년 졸업 예정, 학점 3.8/4.5",
    experience:
      "네이버 프론트엔드 인턴 (2024.06-08)\n카카오 백엔드 인턴 (2023.12-2024.02)",
    projects:
      "취업 플랫폼 포트폴리오 (Next.js)\n실시간 협업 툴 (React, Node.js)",
    skills: "React, TypeScript, Node.js, Python, Git, AWS",
  },
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
