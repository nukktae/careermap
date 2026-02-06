/**
 * Centralized job types and mock data for Match module.
 * Used by Job Discovery, Job Detail, Saved Jobs, and modals.
 */

import {
  computeMatchedMissing,
  extractSkillLikeTokens,
} from "./prepare";

export type MatchBadge = "apply" | "prep" | "stretch";
export type JobTypeValue = "fulltime" | "intern" | "contract";
export type CompanyTypeValue = "대기업" | "공기업" | "스타트업" | "외국계";
export type IndustryValue = "IT" | "Finance" | "Consulting" | "E-commerce";
export type ExperienceLevelValue = "신입" | "경력 1-3년" | "경력 3-5년";
export type LocationFilterValue = "seoul" | "gyeonggi" | "busan" | "remote";

export interface MatchBreakdownSkills {
  score: number;
  total: number;
  matched: string[];
  missing: string[];
  skillsImpact?: string;
}

export interface MatchBreakdownExperience {
  score: number;
  total: number;
  note: string;
  experienceRequired?: string;
  experienceYours?: string;
  experienceGap?: string;
}

export interface MatchBreakdownEducation {
  score: number;
  total: number;
  note: string;
  educationNote?: string;
}

export interface MatchBreakdownProjects {
  score: number;
  total: number;
  note: string;
  projectsImprovement?: string;
}

export interface MatchBreakdown {
  skills: MatchBreakdownSkills;
  experience: MatchBreakdownExperience;
  education: MatchBreakdownEducation;
  projects: MatchBreakdownProjects;
}

export interface Job {
  id: number;
  company: string;
  title: string;
  location: string;
  locationFilter: LocationFilterValue;
  type: string;
  typeValue: JobTypeValue;
  experience: string;
  experienceLevel: ExperienceLevelValue;
  match: number;
  badge: MatchBadge;
  logo: string;
  /** Optional logo image URL (e.g. from Linkareer); when set, card shows image preview. */
  logoUrl?: string;
  matchedSkills: string[];
  missingSkills: string[];
  salary: string;
  salaryMin: number;
  salaryMax: number;
  companyType: CompanyTypeValue;
  industry: IndustryValue;
  postedAt: string;
}

export interface JobDetail extends Job {
  description: string;
  responsibilities: string[];
  requirements: string[];
  preferred: string[];
  benefits: string[];
  deadline: string;
  matchBreakdown: MatchBreakdown;
}

const JOBS: JobDetail[] = [
  {
    id: 1,
    company: "네이버",
    title: "프론트엔드 개발자",
    location: "성남시 분당구",
    locationFilter: "gyeonggi",
    type: "정규직",
    typeValue: "fulltime",
    experience: "신입 ~ 3년",
    experienceLevel: "경력 1-3년",
    match: 72,
    badge: "prep",
    logo: "N",
    matchedSkills: ["React", "TypeScript", "Git"],
    missingSkills: ["Docker", "AWS"],
    salary: "4,500만원 ~ 6,000만원",
    salaryMin: 4500,
    salaryMax: 6000,
    companyType: "대기업",
    industry: "IT",
    postedAt: "2026-01-15",
    description: `네이버의 다양한 서비스를 함께 만들어갈 프론트엔드 개발자를 모집합니다.

네이버는 대한민국 대표 인터넷 기업으로, 검색, 쇼핑, 페이, 클라우드 등 다양한 서비스를 제공하고 있습니다. 우리는 사용자 중심의 서비스 개발을 지향하며, 최신 기술을 적극적으로 도입하고 있습니다.`,
    responsibilities: [
      "네이버 서비스의 웹 프론트엔드 개발 및 유지보수",
      "React, TypeScript를 활용한 SPA 개발",
      "성능 최적화 및 사용자 경험 개선",
      "디자이너, 백엔드 개발자와의 협업",
      "코드 리뷰 및 기술 문서 작성",
    ],
    requirements: [
      "React, TypeScript 경험 필수",
      "HTML, CSS, JavaScript에 대한 깊은 이해",
      "Git을 활용한 협업 경험",
      "RESTful API 연동 경험",
    ],
    preferred: [
      "대규모 서비스 개발 경험",
      "Docker, Kubernetes 경험",
      "AWS 또는 클라우드 서비스 경험",
      "오픈소스 기여 경험",
    ],
    benefits: [
      "유연근무제 (자율 출퇴근)",
      "재택근무 지원",
      "건강검진 및 의료비 지원",
      "교육비 지원 (연 300만원)",
      "사내 카페테리아",
    ],
    deadline: "2026-02-28",
    matchBreakdown: {
      skills: {
        score: 32,
        total: 40,
        matched: ["React", "TypeScript", "Git"],
        missing: ["Docker", "AWS"],
        skillsImpact: "Docker 추가 시 +8%",
      },
      experience: {
        score: 20,
        total: 30,
        note: "인턴 경험으로 기본 점수 획득",
        experienceRequired: "1~3년",
        experienceYours: "0년 (학생)",
        experienceGap: "인턴 경험 추가 시 +10%",
      },
      education: {
        score: 15,
        total: 15,
        note: "학력 요건 충족",
        educationNote: "CS 학사 요건 충족 (서울대 컴공)",
      },
      projects: {
        score: 5,
        total: 15,
        note: "관련 프로젝트 1개 확인",
        projectsImprovement: "관련 프로젝트 1개 더 추가 시 +5%",
      },
    },
  },
  {
    id: 2,
    company: "카카오",
    title: "웹 개발자",
    location: "성남시 판교",
    locationFilter: "gyeonggi",
    type: "정규직",
    typeValue: "fulltime",
    experience: "신입 ~ 3년",
    experienceLevel: "경력 1-3년",
    match: 68,
    badge: "prep",
    logo: "K",
    matchedSkills: ["JavaScript", "React"],
    missingSkills: ["Kubernetes", "CI/CD"],
    salary: "4,000만원 ~ 5,500만원",
    salaryMin: 4000,
    salaryMax: 5500,
    companyType: "대기업",
    industry: "IT",
    postedAt: "2026-01-18",
    description: `카카오와 함께 웹 서비스를 설계하고 개발할 웹 개발자를 찾습니다.`,
    responsibilities: [
      "카카오 서비스 웹 프론트엔드 개발",
      "반응형 웹 구현",
      "크로스 브라우저 대응",
    ],
    requirements: [
      "JavaScript, React 기반 개발 경험",
      "HTML/CSS 이해",
      "협업 및 소통 능력",
    ],
    preferred: [
      "TypeScript 경험",
      "Kubernetes, CI/CD 경험",
      "대규모 트래픽 대응 경험",
    ],
    benefits: [
      "자율 출퇴근",
      "재택근무",
      "스톡옵션",
      "연차 외 휴가",
    ],
    deadline: "2026-03-01",
    matchBreakdown: {
      skills: {
        score: 28,
        total: 40,
        matched: ["JavaScript", "React"],
        missing: ["Kubernetes", "CI/CD"],
        skillsImpact: "Kubernetes 또는 CI/CD 학습 시 +6%",
      },
      experience: {
        score: 18,
        total: 30,
        note: "프로젝트 경험으로 부분 점수",
        experienceRequired: "1~3년",
        experienceYours: "0년",
        experienceGap: "인턴 또는 프로젝트 강화 시 +12%",
      },
      education: {
        score: 15,
        total: 15,
        note: "학력 요건 충족",
        educationNote: "관련 학과 학사 이상",
      },
      projects: {
        score: 7,
        total: 15,
        note: "웹 프로젝트 2개",
        projectsImprovement: "실서비스 연동 프로젝트 추가 시 +5%",
      },
    },
  },
  {
    id: 3,
    company: "토스",
    title: "React 개발자",
    location: "서울 강남구",
    locationFilter: "seoul",
    type: "정규직",
    typeValue: "fulltime",
    experience: "1년 이상",
    experienceLevel: "경력 1-3년",
    match: 89,
    badge: "apply",
    logo: "T",
    matchedSkills: ["React", "TypeScript", "Node.js", "Git"],
    missingSkills: [],
    salary: "5,000만원 ~ 7,000만원",
    salaryMin: 5000,
    salaryMax: 7000,
    companyType: "스타트업",
    industry: "IT",
    postedAt: "2026-01-20",
    description: `토스의 핵심 금융 서비스를 React로 개발합니다.`,
    responsibilities: [
      "React 기반 프론트엔드 개발",
      "TypeScript 활용",
      "성능 및 접근성 개선",
    ],
    requirements: [
      "React, TypeScript 1년 이상 경험",
      "Git 협업 경험",
      "REST API 연동 경험",
    ],
    preferred: ["테스트 코드 작성 경험", "디자인 시스템 경험"],
    benefits: ["무제한 연차", "재택근무", "장비 지원", "교육비"],
    deadline: "2026-02-15",
    matchBreakdown: {
      skills: {
        score: 38,
        total: 40,
        matched: ["React", "TypeScript", "Node.js", "Git"],
        missing: [],
        skillsImpact: "요구 스킬 모두 충족",
      },
      experience: {
        score: 26,
        total: 30,
        note: "인턴 + 프로젝트 경험",
        experienceRequired: "1년 이상",
        experienceYours: "인턴 6개월",
        experienceGap: "정규 경력 1년 시 만점",
      },
      education: {
        score: 15,
        total: 15,
        note: "학력 요건 충족",
        educationNote: "CS/공학 학사",
      },
      projects: {
        score: 10,
        total: 15,
        note: "관련 프로젝트 2개",
        projectsImprovement: "금융/결제 도메인 프로젝트 시 +5%",
      },
    },
  },
  {
    id: 4,
    company: "라인",
    title: "소프트웨어 엔지니어",
    location: "서울 강남구",
    locationFilter: "seoul",
    type: "정규직",
    typeValue: "fulltime",
    experience: "2년 이상",
    experienceLevel: "경력 1-3년",
    match: 54,
    badge: "stretch",
    logo: "L",
    matchedSkills: ["JavaScript", "Python"],
    missingSkills: ["Java", "Spring", "Kotlin"],
    salary: "4,500만원 ~ 6,500만원",
    salaryMin: 4500,
    salaryMax: 6500,
    companyType: "외국계",
    industry: "IT",
    postedAt: "2026-01-10",
    description: `라인 메신저 및 서비스 백엔드/풀스택 개발`,
    responsibilities: [
      "메시징 서비스 백엔드 개발",
      "Java/Spring 기반 API 개발",
      "모니터링 및 운영",
    ],
    requirements: [
      "Java 또는 Kotlin 경험 2년 이상",
      "Spring Framework",
      "DB 설계 경험",
    ],
    preferred: ["대규모 트래픽 경험", "메시징 시스템 경험"],
    benefits: ["해외 근무 기회", "연차", "의료비", "스톡옵션"],
    deadline: "2026-03-10",
    matchBreakdown: {
      skills: {
        score: 18,
        total: 40,
        matched: ["JavaScript", "Python"],
        missing: ["Java", "Spring", "Kotlin"],
        skillsImpact: "Java/Spring 학습 시 +15%",
      },
      experience: {
        score: 12,
        total: 30,
        note: "경력 요건 미달",
        experienceRequired: "2년 이상",
        experienceYours: "0년",
        experienceGap: "인턴 1년 + 프로젝트 강화 시 +18%",
      },
      education: {
        score: 15,
        total: 15,
        note: "학력 충족",
        educationNote: "학사 이상",
      },
      projects: {
        score: 9,
        total: 15,
        note: "웹/스크립트 프로젝트",
        projectsImprovement: "백엔드/서버 프로젝트 추가 시 +4%",
      },
    },
  },
  {
    id: 5,
    company: "쿠팡",
    title: "풀스택 개발자",
    location: "서울 송파구",
    locationFilter: "seoul",
    type: "정규직",
    typeValue: "fulltime",
    experience: "신입 ~ 5년",
    experienceLevel: "경력 1-3년",
    match: 75,
    badge: "prep",
    logo: "C",
    matchedSkills: ["React", "Node.js", "TypeScript"],
    missingSkills: ["AWS", "Redis"],
    salary: "4,800만원 ~ 6,500만원",
    salaryMin: 4800,
    salaryMax: 6500,
    companyType: "대기업",
    industry: "E-commerce",
    postedAt: "2026-01-22",
    description: `쿠팡 이커머스 플랫폼 풀스택 개발`,
    responsibilities: [
      "프론트엔드 및 백엔드 기능 개발",
      "API 설계 및 구현",
      "인프라 협업 (AWS)",
    ],
    requirements: [
      "React 또는 Node.js 경험",
      "TypeScript 사용 경험",
      "RDB 경험",
    ],
    preferred: ["AWS", "Redis", "대용량 트래픽 경험"],
    benefits: ["식대 지원", "건강검진", "교육비", "재택"],
    deadline: "2026-02-20",
    matchBreakdown: {
      skills: {
        score: 30,
        total: 40,
        matched: ["React", "Node.js", "TypeScript"],
        missing: ["AWS", "Redis"],
        skillsImpact: "AWS 또는 Redis 추가 시 +8%",
      },
      experience: {
        score: 22,
        total: 30,
        note: "프로젝트 경험 반영",
        experienceRequired: "신입~5년",
        experienceYours: "0년",
        experienceGap: "인턴 경험 시 +8%",
      },
      education: {
        score: 15,
        total: 15,
        note: "학력 충족",
        educationNote: "학사 이상",
      },
      projects: {
        score: 8,
        total: 15,
        note: "풀스택 프로젝트 1개",
        projectsImprovement: "배포/인프라 포함 프로젝트 시 +5%",
      },
    },
  },
  {
    id: 6,
    company: "배달의민족",
    title: "프론트엔드 엔지니어",
    location: "서울 송파구",
    locationFilter: "seoul",
    type: "정규직",
    typeValue: "fulltime",
    experience: "신입 ~ 5년",
    experienceLevel: "경력 1-3년",
    match: 82,
    badge: "apply",
    logo: "B",
    matchedSkills: ["React", "TypeScript", "Git", "Redux"],
    missingSkills: ["GraphQL"],
    salary: "4,500만원 ~ 6,000만원",
    salaryMin: 4500,
    salaryMax: 6000,
    companyType: "스타트업",
    industry: "E-commerce",
    postedAt: "2026-01-25",
    description: `배민 주문/결제/매장 서비스 프론트엔드 개발`,
    responsibilities: [
      "React/TypeScript 기반 웹 개발",
      "Redux 상태 관리",
      "웹 성능 최적화",
    ],
    requirements: [
      "React, TypeScript 경험",
      "Git 협업",
      "반응형 웹 개발",
    ],
    preferred: ["GraphQL", "Next.js", "테스트 자동화"],
    benefits: ["점심 지원", "재택", "연차", "교육비"],
    deadline: "2026-02-28",
    matchBreakdown: {
      skills: {
        score: 34,
        total: 40,
        matched: ["React", "TypeScript", "Git", "Redux"],
        missing: ["GraphQL"],
        skillsImpact: "GraphQL 추가 시 +4%",
      },
      experience: {
        score: 24,
        total: 30,
        note: "인턴 + 사이드 프로젝트",
        experienceRequired: "신입~5년",
        experienceYours: "인턴 3개월",
        experienceGap: "정규 1년 시 +6%",
      },
      education: {
        score: 15,
        total: 15,
        note: "학력 충족",
        educationNote: "학사 이상",
      },
      projects: {
        score: 9,
        total: 15,
        note: "프론트엔드 프로젝트 2개",
        projectsImprovement: "상용 서비스 프로젝트 시 +4%",
      },
    },
  },
  {
    id: 7,
    company: "당근마켓",
    title: "백엔드 개발자",
    location: "서울 마포구",
    locationFilter: "seoul",
    type: "정규직",
    typeValue: "fulltime",
    experience: "신입 ~ 3년",
    experienceLevel: "신입",
    match: 61,
    badge: "prep",
    logo: "D",
    matchedSkills: ["Python", "Django", "Git"],
    missingSkills: ["Redis", "Kafka"],
    salary: "4,200만원 ~ 5,800만원",
    salaryMin: 4200,
    salaryMax: 5800,
    companyType: "스타트업",
    industry: "E-commerce",
    postedAt: "2026-01-28",
    description: `당근마켓 서비스 백엔드 API 및 인프라 개발`,
    responsibilities: [
      "Django 기반 API 개발",
      "DB 설계 및 쿼리 최적화",
      "캐시/메시지 큐 연동",
    ],
    requirements: [
      "Python 웹 프레임워크 경험",
      "RDB 경험",
      "Git 협업",
    ],
    preferred: ["Redis", "Kafka", "AWS"],
    benefits: ["자율 출퇴근", "재택", "연차", "스낵바"],
    deadline: "2026-03-05",
    matchBreakdown: {
      skills: {
        score: 26,
        total: 40,
        matched: ["Python", "Django", "Git"],
        missing: ["Redis", "Kafka"],
        skillsImpact: "Redis 학습 시 +5%",
      },
      experience: {
        score: 18,
        total: 30,
        note: "신입 가능, 프로젝트 반영",
        experienceRequired: "신입~3년",
        experienceYours: "0년",
        experienceGap: "인턴 또는 오픈소스 기여 시 +10%",
      },
      education: {
        score: 15,
        total: 15,
        note: "학력 충족",
        educationNote: "관련 학과 학사",
      },
      projects: {
        score: 2,
        total: 15,
        note: "백엔드 프로젝트 부족",
        projectsImprovement: "백엔드 프로젝트 2개 추가 시 +10%",
      },
    },
  },
  {
    id: 8,
    company: "크래프톤",
    title: "게임 클라이언트 개발자",
    location: "성남시 분당구",
    locationFilter: "gyeonggi",
    type: "정규직",
    typeValue: "fulltime",
    experience: "1년 이상",
    experienceLevel: "경력 1-3년",
    match: 58,
    badge: "stretch",
    logo: "G",
    matchedSkills: ["C++", "Git"],
    missingSkills: ["Unreal Engine", "DirectX", "멀티스레딩"],
    salary: "5,000만원 ~ 7,500만원",
    salaryMin: 5000,
    salaryMax: 7500,
    companyType: "대기업",
    industry: "IT",
    postedAt: "2026-01-12",
    description: `배틀그라운드 등 게임 클라이언트 엔진/툴 개발`,
    responsibilities: [
      "Unreal Engine 기반 클라이언트 개발",
      "성능 최적화",
      "멀티플레이어 네트워크 연동",
    ],
    requirements: [
      "C++ 1년 이상",
      "Unreal Engine 또는 게임 엔진 경험",
      "DirectX/OpenGL 이해",
    ],
    preferred: ["멀티스레딩", "물리 엔진", "쉐이더"],
    benefits: ["식대", "건강검진", "재택", "스톡옵션"],
    deadline: "2026-02-25",
    matchBreakdown: {
      skills: {
        score: 16,
        total: 40,
        matched: ["C++", "Git"],
        missing: ["Unreal Engine", "DirectX", "멀티스레딩"],
        skillsImpact: "Unreal Engine 학습 시 +12%",
      },
      experience: {
        score: 15,
        total: 30,
        note: "경력 요건 미달",
        experienceRequired: "1년 이상",
        experienceYours: "0년",
        experienceGap: "인턴 또는 게임 프로젝트 시 +15%",
      },
      education: {
        score: 15,
        total: 15,
        note: "학력 충족",
        educationNote: "CS/게임 관련 학사",
      },
      projects: {
        score: 12,
        total: 15,
        note: "게임/시뮬레이션 프로젝트",
        projectsImprovement: "Unreal 프로젝트 추가 시 +3%",
      },
    },
  },
];

/**
 * Compute match %, badge, matchedSkills, missingSkills from profile skills (e.g. from CV / mycv.json).
 * Use this so job cards reflect comparison against the user's actual CV.
 */
export function enrichJobWithProfileMatch<T extends Job>(
  job: T,
  profileSkills: string[]
): T {
  if (profileSkills.length === 0) return job;
  let requiredTokens: string[];
  const withReqs = job as Job & { requirements?: string[]; preferred?: string[] };
  if (Array.isArray(withReqs.requirements) || Array.isArray(withReqs.preferred)) {
    const lines = [
      ...(withReqs.requirements ?? []),
      ...(withReqs.preferred ?? []),
    ];
    requiredTokens = extractSkillLikeTokens(lines);
  } else {
    requiredTokens = [...job.matchedSkills, ...job.missingSkills].filter(Boolean);
  }
  if (requiredTokens.length === 0) return job;
  const { matched, missing } = computeMatchedMissing(requiredTokens, profileSkills);
  const total = matched.length + missing.length;
  const match = total > 0 ? Math.round((matched.length / total) * 100) : 0;
  const badge: MatchBadge =
    match >= 85 ? "apply" : match >= 60 ? "prep" : "stretch";
  return { ...job, match, badge, matchedSkills: matched, missingSkills: missing };
}

export function getJobs(): JobDetail[] {
  return [...JOBS];
}

export function getJobById(id: number | string): JobDetail | undefined {
  const numId = typeof id === "string" ? parseInt(id, 10) : id;
  if (Number.isNaN(numId)) return undefined;
  return JOBS.find((j) => j.id === numId);
}

export interface JobFiltersState {
  matchLevel: "all" | MatchBadge;
  jobTypes: JobTypeValue[];
  companyTypes: CompanyTypeValue[];
  locations: LocationFilterValue[];
  salaryRange: [number, number];
  experienceLevels: ExperienceLevelValue[];
  industries: IndustryValue[];
}

export const DEFAULT_JOB_FILTERS: JobFiltersState = {
  matchLevel: "all",
  jobTypes: [],
  companyTypes: [],
  locations: [],
  salaryRange: [0, 10000],
  experienceLevels: [],
  industries: [],
};

export function filterJobs(
  jobs: JobDetail[],
  filters: JobFiltersState
): JobDetail[] {
  return jobs.filter((job) => {
    if (filters.matchLevel !== "all" && job.badge !== filters.matchLevel)
      return false;
    if (
      filters.jobTypes.length > 0 &&
      !filters.jobTypes.includes(job.typeValue)
    )
      return false;
    if (
      filters.companyTypes.length > 0 &&
      !filters.companyTypes.includes(job.companyType)
    )
      return false;
    if (
      filters.locations.length > 0 &&
      !filters.locations.includes(job.locationFilter)
    )
      return false;
    const [minSal, maxSal] = filters.salaryRange;
    if (job.salaryMax < minSal || job.salaryMin > maxSal) return false;
    if (
      filters.experienceLevels.length > 0 &&
      !filters.experienceLevels.includes(job.experienceLevel)
    )
      return false;
    if (
      filters.industries.length > 0 &&
      !filters.industries.includes(job.industry)
    )
      return false;
    return true;
  });
}

export function getSimilarJobs(jobId: number, limit = 3): JobDetail[] {
  const job = getJobById(jobId);
  if (!job) return [];
  return JOBS.filter((j) => j.id !== jobId)
    .sort((a, b) => Math.abs(b.match - job.match) - Math.abs(a.match - job.match))
    .slice(0, limit);
}
