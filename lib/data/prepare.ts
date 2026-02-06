/**
 * Centralized Prepare module types and mock data.
 * Used by Skill Gap, Resume Optimizer/Preview, 자소서, Interview Prep.
 */

export type SkillPriority = "high" | "medium" | "low";
export type HighlightType = "keyword" | "verb" | "quantity";

export interface SkillGapSkill {
  id: string;
  name: string;
  impactPercent: number;
  demandCount: number;
  learningDaysMin: number;
  learningDaysMax: number;
  priority: SkillPriority;
}

export interface ResumeBulletHighlight {
  start: number;
  end: number;
  type: HighlightType;
}

export interface ResumeOptimizerResult {
  before: string;
  after: string;
  highlights: ResumeBulletHighlight[];
  explanation: string[];
}

export interface CoverLetterPrompt {
  id: string;
  label: string;
}

export interface CoverLetterGuidance {
  structure: { intro: string; body: string; conclusion: string };
  experiencesToEmphasize: string[];
  valuesAlignment: string[];
  samplePhrases: { label: string; phrase: string }[];
}

export interface InterviewPrepData {
  questionCategories: { name: string; items: string[] }[];
  resumeStoryMapping: { topic: string; story: string }[];
  companyCultureFraming: string[];
  practiceQuestions: { question: string; framework: string }[];
  formatGuide: { name: string; tips: string }[];
}

const SKILL_GAP_SKILLS: SkillGapSkill[] = [
  { id: "docker", name: "Docker", impactPercent: 8, demandCount: 15, learningDaysMin: 3, learningDaysMax: 5, priority: "high" },
  { id: "aws", name: "AWS", impactPercent: 10, demandCount: 12, learningDaysMin: 5, learningDaysMax: 10, priority: "high" },
  { id: "kubernetes", name: "Kubernetes", impactPercent: 6, demandCount: 8, learningDaysMin: 7, learningDaysMax: 14, priority: "medium" },
  { id: "graphql", name: "GraphQL", impactPercent: 4, demandCount: 6, learningDaysMin: 2, learningDaysMax: 4, priority: "high" },
  { id: "redis", name: "Redis", impactPercent: 5, demandCount: 10, learningDaysMin: 2, learningDaysMax: 3, priority: "high" },
  { id: "cicd", name: "CI/CD", impactPercent: 7, demandCount: 14, learningDaysMin: 3, learningDaysMax: 6, priority: "high" },
  { id: "kotlin", name: "Kotlin", impactPercent: 6, demandCount: 5, learningDaysMin: 10, learningDaysMax: 21, priority: "low" },
  { id: "spring", name: "Spring", impactPercent: 9, demandCount: 11, learningDaysMin: 14, learningDaysMax: 28, priority: "medium" },
];

const RESUME_OPTIMIZER_SAMPLES: { before: string; after: string; explanation: string[] }[] = [
  {
    before: "React를 사용해서 웹 페이지를 만들었습니다.",
    after: "React와 TypeScript로 사용자 5,000명 규모의 대시보드를 개발하여 페이지 로드 시간 30% 단축",
    explanation: [
      "기술 스택을 구체화했습니다 (TypeScript 추가).",
      "규모와 성과를 숫자로 표현해 임팩트를 높였습니다.",
      "동사(개발하여, 단축)로 결과를 명확히 했습니다.",
    ],
  },
  {
    before: "팀 프로젝트에서 백엔드 개발을 담당했습니다.",
    after: "3명 팀에서 REST API 설계 및 Node.js 백엔드 개발을 담당하여 2주 내 MVP 출시에 기여",
    explanation: [
      "팀 규모와 역할을 구체적으로 적었습니다.",
      "REST API, Node.js 등 키워드를 넣어 ATS 통과를 돕습니다.",
      "기한(2주)과 결과(MVP 출시)를 넣어 성과를 보여줍니다.",
    ],
  },
];

/**
 * Saved resume template: "About Me" format and content (10년차 백엔드 개발자).
 * 이력서 형태 및 내용을 그대로 저장하여 미리보기/템플릿 적용에 사용.
 */
export const RESUME_TEMPLATE_ABOUT_ME = {
  /** Section key → label for display (About Me = summary) */
  sectionLabels: { summary: "About Me", education: "Education", experience: "Experience", projects: "Projects", skills: "Skills" } as const,
  /** Full resume sections in this person's format */
  sections: {
    summary: `Java & Spring / NodeJS & TypeScript, AWS 기반의 10년차 서버 백엔드 개발자로 누적 회원수 100만의 에듀테크, MAU 1,500만 & 일 주문 300만 커머스, 일 PV 2,000만 포탈 등의 서비스에서 백엔드 플랫폼 개발 및 AWS 인프라 구축 등을 해왔습니다. 개인이 하고 싶은 일 보다는 회사와 팀에 기여하는 것을 중시합니다.`,
    education: "CS/관련 학과 졸업 (년도)",
    experience:
      "에듀테크 서비스 | 백엔드 개발 (N년) – 누적 회원 100만 규모 백엔드 플랫폼\n커머스 서비스 | 백엔드/인프라 (N년) – MAU 1,500만, 일 주문 300만\n포탈 서비스 | 백엔드 개발 (N년) – 일 PV 2,000만, AWS 인프라 구축",
    projects: "백엔드 플랫폼 설계 및 구축, AWS 인프라 설계 및 운영",
    skills: "Java, Spring, Node.js, TypeScript, AWS, Docker, REST API, SQL",
  },
  /** Single blob for preview (About Me 형태 그대로) */
  fullText: `About Me
Java & Spring / NodeJS & TypeScript, AWS 기반의 10년차 서버 백엔드 개발자로 누적 회원수 100만의 에듀테크, MAU 1,500만 & 일 주문 300만 커머스, 일 PV 2,000만 포탈 등의 서비스에서 백엔드 플랫폼 개발 및 AWS 인프라 구축 등을 해왔습니다. 개인이 하고 싶은 일 보다는 회사와 팀에 기여하는 것을 중시합니다.

Education
CS/관련 학과 졸업 (년도)

Experience
• 에듀테크 서비스 | 백엔드 개발 (N년) – 누적 회원 100만 규모 백엔드 플랫폼
• 커머스 서비스 | 백엔드/인프라 (N년) – MAU 1,500만, 일 주문 300만
• 포탈 서비스 | 백엔드 개발 (N년) – 일 PV 2,000만, AWS 인프라 구축

Projects
백엔드 플랫폼 설계 및 구축, AWS 인프라 설계 및 운영

Skills
Java, Spring, Node.js, TypeScript, AWS, Docker, REST API, SQL`,
} as const;

const RESUME_PREVIEW = {
  original: RESUME_TEMPLATE_ABOUT_ME.fullText,
  optimized: RESUME_TEMPLATE_ABOUT_ME.fullText,
};

const COVER_LETTER_PROMPTS: CoverLetterPrompt[] = [
  { id: "motivation", label: "지원 동기와 입사 후 포부" },
  { id: "strength", label: "본인의 강점과 약점" },
  { id: "conflict", label: "팀 프로젝트 갈등 해결 경험" },
  { id: "custom", label: "직접 입력" },
];

const COVER_LETTER_GUIDANCE: Record<number, CoverLetterGuidance> = {
  1: {
    structure: {
      intro: "회사와 포지션에 대한 구체적인 관심으로 시작하세요. 네이버의 특정 서비스나 기술 스택을 언급하면 좋습니다.",
      body: "2~3개의 경험을 골라, 지원 직무와 연결해 서술하세요. 프로젝트·인턴·동아리 등에서의 성과를 숫자로 보여주세요.",
      conclusion: "네이버의 가치(기술 혁신, 사용자 중심)에 맞춰 입사 후 기여할 부분을 한 문단으로 마무리하세요.",
    },
    experiencesToEmphasize: [
      "React·프론트엔드 프로젝트 경험은 네이버의 웹 서비스와 잘 맞습니다.",
      "오픈소스 또는 사이드 프로젝트가 있다면 간단히 언급하세요.",
    ],
    valuesAlignment: [
      "네이버는 '기술 혁신'과 '사용자 중심'을 중요시합니다.",
      "경험을 서술할 때 사용자 영향(UX, 성능 개선 등)을 강조하세요.",
    ],
    samplePhrases: [
      { label: "시작 문장", phrase: "네이버의 [특정 서비스]를 사용하며..." },
      { label: "전환", phrase: "이러한 경험을 바탕으로..." },
      { label: "마무리", phrase: "입사 후 [직무]에서 사용자 가치를 높이는 데 기여하고 싶습니다." },
    ],
  },
  2: {
    structure: {
      intro: "카카오의 서비스와 문화에 대한 이해를 짧게 보여주는 문장으로 시작하세요.",
      body: "협업·기술 경험 2~3가지를 골라, 카카오가 추구하는 방향과 연결해 서술하세요.",
      conclusion: "카카오에서 성장하고 기여하고 싶은 포부를 한 문단으로 정리하세요.",
    },
    experiencesToEmphasize: [
      "웹/풀스택 프로젝트 경험이 카카오의 웹 서비스와 잘 맞습니다.",
      "협업·코드 리뷰 경험이 있다면 강조하세요.",
    ],
    valuesAlignment: [
      "카카오는 '함께하는 성장'과 '혁신'을 강조합니다.",
      "팀 프로젝트·협업 경험을 프레임에 맞춰 서술하세요.",
    ],
    samplePhrases: [
      { label: "시작", phrase: "카카오의 [서비스명]을 일상에서 사용하며..." },
      { label: "전환", phrase: "위 경험을 바탕으로..." },
      { label: "마무리", phrase: "카카오에서 [역할]로 성장하며 기여하고 싶습니다." },
    ],
  },
};

const INTERVIEW_PREP: Record<number, InterviewPrepData> = {
  1: {
    questionCategories: [
      { name: "기술", items: ["React 생명주기와 hooks", "TypeScript 활용 경험", "성능 최적화 방법"] },
      { name: "행동", items: ["팀워크 경험", "문제 해결 사례", "갈등 조정 경험"] },
      { name: "회사/포지션", items: ["네이버를 지원한 이유", "이 포지션에 맞는 이유", "5년 후 목표"] },
    ],
    resumeStoryMapping: [
      { topic: "React/프론트엔드 질문", story: "React 프로젝트에서 대시보드 개발한 경험으로 답하세요." },
      { topic: "협업/팀워크 질문", story: "팀 프로젝트에서 역할 분담과 소통한 경험을 사용하세요." },
      { topic: "문제 해결 질문", story: "버그 해결이나 성능 개선 경험을 STAR로 정리해 두세요." },
    ],
    companyCultureFraming: [
      "네이버는 기술 깊이와 사용자 임팩트를 모두 중요시합니다.",
      "답변할 때 '기술적 선택 이유'와 '사용자에게 미친 영향'을 함께 얘기하세요.",
    ],
    practiceQuestions: [
      { question: "React hooks를 비개발자에게 어떻게 설명하시겠어요?", framework: "비유(레고 블록처럼 조합 가능한 기능) + 간단한 예시 한 가지." },
      { question: "팀원과 의견이 달랐을 때 어떻게 해결했나요?", framework: "상황 → 역할 → 행동 → 결과 순으로 2분 이내." },
      { question: "네이버를 지원한 이유는?", framework: "서비스 사용 경험 + 기술 스택/문화 + 본인 목표 연결." },
      { question: "가장 어려웠던 버그와 해결 과정은?", framework: "문제 정의 → 시도한 방법 → 최종 해결 → 배운 점." },
    ],
    formatGuide: [
      { name: "인성검사", tips: "일관성 있게 답하세요. 극단적 선택은 피하고, 팀워크·성장·책임감 관련 문항에 준비해 두세요." },
      { name: "그룹 토론", tips: "발언 횟수보다 논리적 흐름이 중요합니다. 다른 의견을 인정한 뒤 자신의 관점을 덧붙이는 방식이 좋습니다." },
      { name: "발표 면접", tips: "시간 배분을 지키고, 서론–본론–결론 구조로 정리하세요. 질문이 오면 침착하게 한 가지씩 답변하세요." },
    ],
  },
  2: {
    questionCategories: [
      { name: "기술", items: ["JavaScript/React 심화", "웹 성능", "크로스 브라우저 대응"] },
      { name: "행동", items: ["협업 경험", "우선순위 결정", "피드백 대응"] },
      { name: "회사/포지션", items: ["카카오 지원 동기", "웹 개발자로서의 목표"] },
    ],
    resumeStoryMapping: [
      { topic: "웹 개발 질문", story: "웹 프로젝트에서 반응형·성능 개선한 경험을 사용하세요." },
      { topic: "협업 질문", story: "Git·코드 리뷰 경험을 구체적으로 준비하세요." },
    ],
    companyCultureFraming: [
      "카카오는 '함께하는 성장'과 빠른 실험을 중시합니다.",
      "협업과 학습 의지를 답변에 녹여내세요.",
    ],
    practiceQuestions: [
      { question: "웹 성능을 어떻게 측정하고 개선했나요?", framework: "Lighthouse, Core Web Vitals 등 도구 + 실제 개선 수치." },
      { question: "코드 리뷰에서 배운 점은?", framework: "구체적 피드백 한 가지 + 그에 따른 개선." },
    ],
    formatGuide: [
      { name: "인성검사", tips: "솔직하고 일관되게 답하세요." },
      { name: "그룹 토론", tips: "논리적 구조와 팀 협력을 보여주세요." },
      { name: "발표 면접", tips: "준비한 내용을 시간 안에 전달하세요." },
    ],
  },
};

export function getSkillGapSkills(): SkillGapSkill[] {
  return [...SKILL_GAP_SKILLS].sort((a, b) => b.impactPercent - a.impactPercent);
}

/** Section score for percentage display (e.g. 자격 요건 2/3, 우대 1/2). */
export interface SkillGapSectionScore {
  label: string;
  matched: number;
  total: number;
  /** Display weight e.g. 50 for "50%" in "자격 요건 (50%)" */
  weightPercent?: number;
}

/** Job-contextual skill gap: requirements from the job vs what the user has. */
export interface SkillGapContext {
  company: string;
  jobTitle: string;
  /** 자격 요건 (full lines from job) */
  requirements: string[];
  /** 우대 사항 (full lines from job) */
  preferred: string[];
  /** Skills user has that match this job */
  matched: string[];
  /** Skills to develop for this job */
  missing: string[];
  /** Optional: section scores for progress bars and overall % (like match modal). */
  breakdown?: {
    overallPercent: number;
    sections: SkillGapSectionScore[];
  };
}

/**
 * Build skill gap context from a mock JobDetail (has matchedSkills / missingSkills).
 */
export function getSkillGapFromJobDetail(job: {
  company: string;
  title: string;
  requirements: string[];
  preferred: string[];
  matchedSkills: string[];
  missingSkills: string[];
}): SkillGapContext {
  const matched = job.matchedSkills ?? [];
  const missing = job.missingSkills ?? [];
  const total = matched.length + missing.length;
  const overallPercent = total > 0 ? Math.round((matched.length / total) * 100) : 0;
  return {
    company: job.company,
    jobTitle: job.title,
    requirements: job.requirements ?? [],
    preferred: job.preferred ?? [],
    matched,
    missing,
    breakdown:
      total > 0
        ? {
            overallPercent,
            sections: [
              {
                label: "기술 스킬",
                matched: matched.length,
                total,
                weightPercent: 100,
              },
            ],
          }
        : undefined,
  };
}

/** Normalize skill string for matching (lowercase, trim). */
export function normalizeSkillToken(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, " ");
}

/**
 * Extract skill-like tokens from requirement/preferred text (lines split by newline, then comma/및).
 * Used for Linkareer or when we only have raw text.
 */
export function extractSkillLikeTokens(lines: string[]): string[] {
  const seen = new Set<string>();
  for (const line of lines) {
    const parts = line.split(/[,،、및\n]+/).map((p) => p.trim()).filter((p) => p.length > 1);
    for (const p of parts) {
      const n = normalizeSkillToken(p);
      if (n.length > 0) seen.add(n);
    }
  }
  return Array.from(seen);
}

/**
 * Check if a requirement line is "covered" by profile skills (any token in the line matches).
 */
function lineMatchesProfile(line: string, profileSkills: string[]): boolean {
  const tokens = line.split(/[,،、및\n]+/).map((p) => normalizeSkillToken(p.trim())).filter((p) => p.length > 1);
  const userNorm = new Set(profileSkills.map(normalizeSkillToken));
  return tokens.some((t) => Array.from(userNorm).some((u) => u.includes(t) || t.includes(u)));
}

/**
 * Classify requirement/preferred lines into matched (user has) vs missing (gap).
 */
export function computeMatchedMissingLines(
  lines: string[],
  profileSkills: string[]
): { matched: string[]; missing: string[] } {
  const matched: string[] = [];
  const missing: string[] = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (lineMatchesProfile(trimmed, profileSkills)) matched.push(trimmed);
    else missing.push(trimmed);
  }
  return { matched, missing };
}

/**
 * Compute matched vs missing skills: requiredTokens vs profileSkills (normalized).
 */
export function computeMatchedMissing(
  requiredTokens: string[],
  profileSkills: string[]
): { matched: string[]; missing: string[] } {
  const userNorm = new Set(profileSkills.map(normalizeSkillToken));
  const matched: string[] = [];
  const missing: string[] = [];
  for (const token of requiredTokens) {
    const n = normalizeSkillToken(token);
    const found = Array.from(userNorm).some((u) => u.includes(n) || n.includes(u));
    if (found) matched.push(token);
    else missing.push(token);
  }
  return { matched, missing };
}

/**
 * Build a single list of profile skills for job matching.
 * Uses profile.skills and resumeSections.skills (e.g. from mycv.json load).
 */
export function getProfileSkillsForMatch(profile: {
  skills?: string[];
  resumeSections?: Record<string, string>;
}): string[] {
  const fromArray = profile.skills ?? [];
  const fromSections = (profile.resumeSections?.skills ?? "")
    .split(/[,،、\n]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  const combined = [...fromArray, ...fromSections];
  return [...new Set(combined)];
}

export function getResumeOptimizerDefaults(): typeof RESUME_OPTIMIZER_SAMPLES {
  return RESUME_OPTIMIZER_SAMPLES;
}

export function getResumeOptimizerResult(beforeText: string): ResumeOptimizerResult | null {
  const sample = RESUME_OPTIMIZER_SAMPLES.find((s) => s.before.trim() === beforeText.trim());
  if (sample) {
    return {
      before: sample.before,
      after: sample.after,
      highlights: [
        { start: 0, end: 6, type: "keyword" },
        { start: 7, end: 15, type: "quantity" },
        { start: 16, end: 22, type: "verb" },
      ],
      explanation: sample.explanation,
    };
  }
  return {
    before: beforeText,
    after: beforeText.replace(/(만들었습니다|담당했습니다)/g, "개발하여 성과를 달성했습니다"),
    highlights: [],
    explanation: ["입력하신 문장을 바탕으로 동작 강화 표현을 적용했습니다.", "실제 이력서에는 숫자와 구체적 성과를 넣으면 더 좋습니다."],
  };
}

export function getResumePreview(): { original: string; optimized: string } {
  return { ...RESUME_PREVIEW };
}

export function getCoverLetterPrompts(): CoverLetterPrompt[] {
  return [...COVER_LETTER_PROMPTS];
}

export function getCoverLetterGuidance(companyId: number): CoverLetterGuidance | undefined {
  return COVER_LETTER_GUIDANCE[companyId] ? { ...COVER_LETTER_GUIDANCE[companyId]! } : COVER_LETTER_GUIDANCE[1];
}

export function getInterviewPrep(jobId: number): InterviewPrepData | undefined {
  return INTERVIEW_PREP[jobId] ? { ...INTERVIEW_PREP[jobId]! } : INTERVIEW_PREP[1];
}

