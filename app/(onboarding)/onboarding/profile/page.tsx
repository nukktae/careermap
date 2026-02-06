"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getProfile, updateProfile } from "@/lib/data/profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  CheckCircle,
  AlertCircle,
  Edit3,
  Plus,
  X,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Briefcase,
  Sparkles,
  FileText,
  FileEdit,
} from "lucide-react";

function TickCircleIcon({ className }: { className?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7.75 11.9999L10.58 14.8299L16.25 9.16992" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// AI-recommended job titles based on profile (e.g. from experience/skills)
const RECOMMENDED_JOB_TITLES = [
  "프론트엔드 엔지니어",
  "풀스택 엔지니어",
  "UI/UX 디자이너",
  "프로덕트 매니저",
  "소프트웨어 엔지니어",
];

// Common job titles for modal picker
const COMMON_JOB_TITLES = [
  "프론트엔드 엔지니어",
  "백엔드 엔지니어",
  "풀스택 엔지니어",
  "소프트웨어 엔지니어",
  "UI/UX 디자이너",
  "프로덕트 디자이너",
  "프로덕트 매니저",
  "데이터 엔지니어",
  "데이터 사이언티스트",
  "ML 엔지니어",
  "DevOps 엔지니어",
  "QA 엔지니어",
  "iOS 개발자",
  "Android 개발자",
  "웹 퍼블리셔",
  "그래픽 디자이너",
  "마케팅 매니저",
  "그로스 해커",
  "비즈니스 개발",
  "기획자",
  "PM",
  "CTO",
  "개발자",
];

// Fallback when no profile saved yet (should not happen once we use single source)
const defaultParsedData = {
  name: "아노",
  email: "anu.bn@yahoo.com",
  phone: "01032587720",
  education: {
    university: "국민대학교",
    major: "소프트웨어학과",
    graduationYear: "03/2023 – 03/2027",
    gpa: "-",
    confidence: 0.95,
  },
  skills: [] as { name: string; confidence: number }[],
  experience: [] as { company: string; role: string; duration: string; description: string; confidence: number }[],
  certifications: [] as { name: string; issuer: string; date: string; confidence: number }[],
  projects: [] as { title: string; description: string; techStack: string[]; confidence: number }[],
};

export default function ProfileReviewPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "personal",
    "education",
    "skills",
  ]);
  const [selectedJobTitles, setSelectedJobTitles] = useState<string[]>([
    RECOMMENDED_JOB_TITLES[0],
  ]);
  const [jobModalOpen, setJobModalOpen] = useState(false);
  const [jobSearchQuery, setJobSearchQuery] = useState("");
  const [customJobInput, setCustomJobInput] = useState("");
  const [name, setName] = useState(defaultParsedData.name);
  const [email, setEmail] = useState(defaultParsedData.email);
  const [phone, setPhone] = useState(defaultParsedData.phone);
  const [education, setEducation] = useState(defaultParsedData.education);
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [experience, setExperience] = useState<
    { company: string; role: string; duration: string; description: string; confidence: number }[]
  >([]);
  const [projects, setProjects] = useState<
    { title: string; description: string; techStack: string[]; confidence: number }[]
  >([]);
  const [newTechByProject, setNewTechByProject] = useState<Record<number, string>>({});
  const [certifications, setCertifications] = useState(
    defaultParsedData.certifications.map(({ name, issuer, date, confidence }) => ({
      name,
      issuer,
      date,
      confidence,
    }))
  );
  const [activeTab, setActiveTab] = useState<"resume" | "coverLetter">("resume");
  const [coverLetterText, setCoverLetterText] = useState("");

  useEffect(() => {
    const profile = getProfile();
    setName(profile.name);
    setEmail(profile.email);
    setPhone(profile.phone);
    setEducation({
      university: profile.education.university,
      major: profile.education.major,
      graduationYear: profile.education.graduationYear,
      gpa: profile.education.gpa,
      confidence: 0.95,
    });
    setSkills(profile.skills.length ? profile.skills : defaultParsedData.skills.map((s) => s.name));
    setExperience(
      profile.experience.length > 0
        ? profile.experience.map((e) => ({
            company: e.company,
            role: e.role,
            duration: e.duration,
            description: e.description,
            confidence: 0.95,
          }))
        : defaultParsedData.experience
    );
    setProjects(
      profile.projects.length > 0
        ? profile.projects.map((p) => ({
            title: p.title,
            description: p.description,
            techStack: [...p.techStack],
            confidence: 0.95,
          }))
        : defaultParsedData.projects
    );
    setCoverLetterText(profile.coverLetterText ?? "");
  }, []);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  const addJobTitle = (title: string) => {
    const t = title.trim();
    if (t && !selectedJobTitles.includes(t)) {
      setSelectedJobTitles((prev) => [...prev, t]);
    }
  };

  const removeJobTitle = (title: string) => {
    setSelectedJobTitles((prev) => prev.filter((t) => t !== title));
  };

  const filteredModalJobTitles = useMemo(() => {
    const q = jobSearchQuery.trim().toLowerCase();
    if (!q) return COMMON_JOB_TITLES;
    return COMMON_JOB_TITLES.filter((j) => j.toLowerCase().includes(q));
  }, [jobSearchQuery]);

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const updateExperience = (index: number, field: "role" | "company" | "duration" | "description", value: string) => {
    setExperience((prev) =>
      prev.map((exp, i) => (i === index ? { ...exp, [field]: value } : exp))
    );
  };

  const addExperience = () => {
    setExperience((prev) => [
      ...prev,
      { company: "", role: "", duration: "", description: "", confidence: 0.5 },
    ]);
  };

  const removeExperience = (index: number) => {
    setExperience((prev) => prev.filter((_, i) => i !== index));
  };

  const updateProject = (index: number, field: "title" | "description", value: string) => {
    setProjects((prev) =>
      prev.map((p, i) => (i === index ? { ...p, [field]: value } : p))
    );
  };

  const updateProjectTech = (projectIndex: number, techIndex: number, value: string) => {
    setProjects((prev) =>
      prev.map((p, i) => {
        if (i !== projectIndex) return p;
        const next = [...p.techStack];
        if (value) next[techIndex] = value;
        else next.splice(techIndex, 1);
        return { ...p, techStack: next };
      })
    );
  };

  const addProjectTech = (projectIndex: number, value: string) => {
    if (!value.trim()) return;
    setProjects((prev) =>
      prev.map((p, i) =>
        i === projectIndex ? { ...p, techStack: [...p.techStack, value.trim()] } : p
      )
    );
  };

  const removeProjectTech = (projectIndex: number, techIndex: number) => {
    setProjects((prev) =>
      prev.map((p, i) => {
        if (i !== projectIndex) return p;
        const next = p.techStack.filter((_, j) => j !== techIndex);
        return { ...p, techStack: next };
      })
    );
  };

  const addProject = () => {
    setProjects((prev) => [
      ...prev,
      { title: "", description: "", techStack: [], confidence: 0.5 },
    ]);
  };

  const removeProject = (index: number) => {
    setProjects((prev) => prev.filter((_, i) => i !== index));
  };

  const updateCertification = (index: number, field: "name" | "issuer" | "date", value: string) => {
    setCertifications((prev) =>
      prev.map((c, i) => (i === index ? { ...c, [field]: value } : c))
    );
  };

  const addCertification = () => {
    setCertifications((prev) => [
      ...prev,
      { name: "", issuer: "", date: "", confidence: 0.5 },
    ]);
  };

  const removeCertification = (index: number) => {
    setCertifications((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const educationData = {
        university: education.university,
        major: education.major,
        graduationYear: education.graduationYear,
        gpa: education.gpa,
      };
      const experienceData = experience.map((e, i) => ({
        id: `exp-${i + 1}`,
        company: e.company,
        role: e.role,
        duration: e.duration,
        description: e.description,
      }));
      const projectsData = projects.map((p, i) => ({
        id: `proj-${i + 1}`,
        title: p.title,
        description: p.description,
        techStack: p.techStack,
      }));
      const current = getProfile();
      const educationText = [educationData.university, educationData.major, educationData.graduationYear].filter(Boolean).join(", ") || (educationData.gpa && educationData.gpa !== "-" ? `학점 ${educationData.gpa}` : "");
      const experienceText = experienceData.map((x) => `${x.company} | ${x.role} (${x.duration})`).join("\n");
      const projectsText = projectsData.map((p) => `${p.title} – ${p.description} (${p.techStack.join(", ")})`).join("\n");
      updateProfile({
        name,
        email,
        phone,
        education: educationData,
        skills,
        experience: experienceData,
        projects: projectsData,
        coverLetterText: coverLetterText.trim() || undefined,
        resumeSections: {
          ...current.resumeSections,
          education: educationText,
          experience: experienceText,
          projects: projectsText,
          skills: skills.join(", "),
        },
      });
      await new Promise((resolve) => setTimeout(resolve, 500));
    } finally {
      setIsSubmitting(false);
    }
    router.push("/dashboard");
  };

  const ConfidenceBadge = ({ confidence }: { confidence: number }) => {
    if (confidence >= 0.9) {
      return (
        <span className="inline-flex items-center gap-1 text-xs text-success-600 dark:text-success-400">
          <CheckCircle className="w-3.5 h-3.5" />
          확인됨
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-xs text-warning-600 dark:text-warning-400">
        <AlertCircle className="w-3.5 h-3.5" />
        확인 필요
      </span>
    );
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-success-500 text-white flex items-center justify-center text-sm">
              <CheckCircle className="w-5 h-5" />
            </div>
            <span className="text-sm text-foreground-secondary">이력서 업로드</span>
          </div>
          <div className="w-12 h-0.5 bg-primary-500" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center text-sm font-semibold">
              2
            </div>
            <span className="text-sm font-medium text-foreground">프로필 확인</span>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success-badge text-success-600 dark:text-success-400 text-sm font-medium mb-4">
            <TickCircleIcon className="w-4 h-4 shrink-0" />
            분석 완료!
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            프로필을 확인해 주세요
          </h1>
          <p className="text-foreground-secondary">
            AI가 추출한 정보가 맞는지 확인하고, 필요하면 수정해 주세요.
          </p>
        </div>

        {/* Tabs: 이력서 | 자기소개서 */}
        <div className="border-b border-border mb-6">
          <nav className="flex gap-6" aria-label="이력서·자기소개서 탭">
            <button
              type="button"
              onClick={() => setActiveTab("resume")}
              className={`flex items-center gap-2 px-1 py-3 text-sm font-medium border-b-2 transition-colors -mb-px ${
                activeTab === "resume"
                  ? "border-primary-500 text-primary-600 dark:text-primary-400"
                  : "border-transparent text-foreground-secondary hover:text-foreground hover:border-foreground-muted"
              }`}
            >
              <FileText className="w-4 h-4 shrink-0" />
              이력서
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("coverLetter")}
              className={`flex items-center gap-2 px-1 py-3 text-sm font-medium border-b-2 transition-colors -mb-px ${
                activeTab === "coverLetter"
                  ? "border-primary-500 text-primary-600 dark:text-primary-400"
                  : "border-transparent text-foreground-secondary hover:text-foreground hover:border-foreground-muted"
              }`}
            >
              <FileEdit className="w-4 h-4 shrink-0" />
              자기소개서
            </button>
          </nav>
        </div>

        {/* Tab content: 이력서 */}
        {activeTab === "resume" && (
        <div className="space-y-4">
          {/* Personal Info */}
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <button
              className="w-full flex items-center justify-between p-4 hover:bg-background-secondary transition-colors"
              onClick={() => toggleSection("personal")}
            >
              <h2 className="font-semibold text-foreground">기본 정보</h2>
              {expandedSections.includes("personal") ? (
                <ChevronUp className="w-5 h-5 text-foreground-muted" />
              ) : (
                <ChevronDown className="w-5 h-5 text-foreground-muted" />
              )}
            </button>
            {expandedSections.includes("personal") && (
              <div className="px-4 pb-4 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">이름</Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">이메일</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">전화번호</Label>
                    <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
                  </div>
                </div>

                {/* 희망 직무 (Recommended job titles) */}
                <div className="pt-4 border-t border-border">
                  <Label className="text-base font-semibold text-foreground block mb-2">
                    희망 직무
                  </Label>
                  <p className="text-sm text-foreground-muted mb-3">
                    지원하고 싶은 직무를 선택하세요. AI 추천을 골라도 되고, 없으면 직접 추가할 수 있어요.
                  </p>

                  {selectedJobTitles.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {selectedJobTitles.map((title) => (
                        <span
                          key={title}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium"
                          style={{ backgroundColor: "var(--primary-badge-bg)", color: "var(--primary-badge-text)" }}
                        >
                          {title}
                          <button
                            type="button"
                            onClick={() => removeJobTitle(title)}
                            className="rounded-full p-0.5 hover:bg-primary-200 dark:hover:bg-primary-800 text-primary-600 dark:text-primary-400"
                            aria-label={`${title} 제거`}
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="text-xs font-medium text-foreground-muted mr-1 self-center">AI 추천</span>
                    {RECOMMENDED_JOB_TITLES.filter((j) => !selectedJobTitles.includes(j)).map((title) => (
                      <button
                        key={title}
                        type="button"
                        onClick={() => addJobTitle(title)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-border bg-background hover:bg-background-secondary hover:border-primary-300 text-sm text-foreground-secondary hover:text-foreground transition-colors"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-primary-500" />
                        {title}
                      </button>
                    ))}
                    {RECOMMENDED_JOB_TITLES.every((j) => selectedJobTitles.includes(j)) && (
                      <span className="text-xs text-foreground-muted self-center">모두 선택됨</span>
                    )}
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="rounded-full"
                    onClick={() => {
                      setJobSearchQuery("");
                      setCustomJobInput("");
                      setJobModalOpen(true);
                    }}
                  >
                    <Plus className="w-4 h-4 mr-1.5" />
                    다른 직무 선택하기
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Education */}
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <button
              className="w-full flex items-center justify-between p-4 hover:bg-background-secondary transition-colors"
              onClick={() => toggleSection("education")}
            >
              <div className="flex items-center gap-3">
                <h2 className="font-semibold text-foreground">학력</h2>
                <ConfidenceBadge confidence={education.confidence} />
              </div>
              {expandedSections.includes("education") ? (
                <ChevronUp className="w-5 h-5 text-foreground-muted" />
              ) : (
                <ChevronDown className="w-5 h-5 text-foreground-muted" />
              )}
            </button>
            {expandedSections.includes("education") && (
              <div className="px-4 pb-4 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="university">대학교</Label>
                    <Input
                      id="university"
                      value={education.university}
                      onChange={(e) => setEducation((prev) => ({ ...prev, university: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="major">전공</Label>
                    <Input
                      id="major"
                      value={education.major}
                      onChange={(e) => setEducation((prev) => ({ ...prev, major: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="graduationYear">졸업 연도</Label>
                    <Input
                      id="graduationYear"
                      value={education.graduationYear}
                      onChange={(e) => setEducation((prev) => ({ ...prev, graduationYear: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gpa">학점</Label>
                    <Input
                      id="gpa"
                      value={education.gpa}
                      onChange={(e) => setEducation((prev) => ({ ...prev, gpa: e.target.value }))}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Skills */}
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <button
              className="w-full flex items-center justify-between p-4 hover:bg-background-secondary transition-colors"
              onClick={() => toggleSection("skills")}
            >
              <div className="flex items-center gap-3">
                <h2 className="font-semibold text-foreground">스킬</h2>
                <span className="text-xs text-foreground-muted">
                  {skills.length}개
                </span>
              </div>
              {expandedSections.includes("skills") ? (
                <ChevronUp className="w-5 h-5 text-foreground-muted" />
              ) : (
                <ChevronDown className="w-5 h-5 text-foreground-muted" />
              )}
            </button>
            {expandedSections.includes("skills") && (
              <div className="px-4 pb-4">
                <div className="flex flex-wrap gap-2 mb-4">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm"
                      style={{ backgroundColor: "var(--primary-badge-bg)", color: "var(--primary-badge-text)" }}
                    >
                      {skill}
                      <button
                        onClick={() => removeSkill(skill)}
                        className="hover:text-primary-900 dark:hover:text-primary-100"
                        aria-label={`${skill} 제거`}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="스킬 추가..."
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addSkill()}
                  />
                  <Button onClick={addSkill} size="sm">
                    <Plus className="w-4 h-4 mr-1" />
                    추가
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Experience */}
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <button
              className="w-full flex items-center justify-between p-4 hover:bg-background-secondary transition-colors"
              onClick={() => toggleSection("experience")}
            >
              <div className="flex items-center gap-3">
                <h2 className="font-semibold text-foreground">경력</h2>
                <span className="text-xs text-foreground-muted">
                  {experience.length}개
                </span>
              </div>
              {expandedSections.includes("experience") ? (
                <ChevronUp className="w-5 h-5 text-foreground-muted" />
              ) : (
                <ChevronDown className="w-5 h-5 text-foreground-muted" />
              )}
            </button>
            {expandedSections.includes("experience") && (
              <div className="px-4 pb-4 space-y-4">
                {experience.map((exp, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg bg-background-secondary space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 flex-1 min-w-0">
                        <Input
                          placeholder="직무 (예: 프론트엔드 개발 인턴)"
                          value={exp.role}
                          onChange={(e) => updateExperience(index, "role", e.target.value)}
                          className="font-medium"
                        />
                        <Input
                          placeholder="회사명"
                          value={exp.company}
                          onChange={(e) => updateExperience(index, "company", e.target.value)}
                          className="text-sm text-foreground-secondary"
                        />
                        <Input
                          placeholder="기간 (예: 2024.06 - 2024.08)"
                          value={exp.duration}
                          onChange={(e) => updateExperience(index, "duration", e.target.value)}
                          className="text-sm text-foreground-secondary sm:col-span-2"
                        />
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <ConfidenceBadge confidence={exp.confidence} />
                        {experience.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeExperience(index)}
                            className="p-1.5 text-foreground-muted hover:text-error-500 rounded-lg hover:bg-error-50 dark:hover:bg-error-950/20"
                            aria-label="경력 삭제"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                    <Textarea
                      placeholder="업무 내용 설명"
                      value={exp.description}
                      onChange={(e) => updateExperience(index, "description", e.target.value)}
                      className="min-h-[80px]"
                    />
                  </div>
                ))}
                <Button variant="outline" className="w-full" onClick={addExperience}>
                  <Plus className="w-4 h-4 mr-2" />
                  경력 추가
                </Button>
              </div>
            )}
          </div>

          {/* Certifications (자격증) */}
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <button
              className="w-full flex items-center justify-between p-4 hover:bg-background-secondary transition-colors"
              onClick={() => toggleSection("certifications")}
            >
              <div className="flex items-center gap-3">
                <h2 className="font-semibold text-foreground">자격증</h2>
                <span className="text-xs text-foreground-muted">
                  {certifications.length}개
                </span>
              </div>
              {expandedSections.includes("certifications") ? (
                <ChevronUp className="w-5 h-5 text-foreground-muted" />
              ) : (
                <ChevronDown className="w-5 h-5 text-foreground-muted" />
              )}
            </button>
            {expandedSections.includes("certifications") && (
              <div className="px-4 pb-4 space-y-4">
                {certifications.map((cert, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg bg-background-secondary space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 flex-1 min-w-0">
                        <Input
                          placeholder="자격증명 (예: 정보처리기사)"
                          value={cert.name}
                          onChange={(e) => updateCertification(index, "name", e.target.value)}
                          className="font-medium"
                        />
                        <Input
                          placeholder="발급기관"
                          value={cert.issuer}
                          onChange={(e) => updateCertification(index, "issuer", e.target.value)}
                          className="text-sm text-foreground-secondary"
                        />
                        <Input
                          placeholder="취득일 (예: 2024.05)"
                          value={cert.date}
                          onChange={(e) => updateCertification(index, "date", e.target.value)}
                          className="text-sm text-foreground-secondary sm:col-span-2"
                        />
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <ConfidenceBadge confidence={cert.confidence} />
                        {certifications.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeCertification(index)}
                            className="p-1.5 text-foreground-muted hover:text-error-500 rounded-lg hover:bg-error-50 dark:hover:bg-error-950/20"
                            aria-label="자격증 삭제"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full" onClick={addCertification}>
                  <Plus className="w-4 h-4 mr-2" />
                  자격증 추가
                </Button>
              </div>
            )}
          </div>

          {/* Projects */}
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <button
              className="w-full flex items-center justify-between p-4 hover:bg-background-secondary transition-colors"
              onClick={() => toggleSection("projects")}
            >
              <div className="flex items-center gap-3">
                <h2 className="font-semibold text-foreground">프로젝트</h2>
                <span className="text-xs text-foreground-muted">
                  {projects.length}개
                </span>
              </div>
              {expandedSections.includes("projects") ? (
                <ChevronUp className="w-5 h-5 text-foreground-muted" />
              ) : (
                <ChevronDown className="w-5 h-5 text-foreground-muted" />
              )}
            </button>
            {expandedSections.includes("projects") && (
              <div className="px-4 pb-4 space-y-4">
                {projects.map((project, projectIndex) => (
                  <div
                    key={projectIndex}
                    className="p-4 rounded-lg bg-background-secondary space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <Input
                        placeholder="프로젝트 제목"
                        value={project.title}
                        onChange={(e) => updateProject(projectIndex, "title", e.target.value)}
                        className="font-medium flex-1 min-w-0"
                      />
                      <div className="flex items-center gap-2 shrink-0">
                        <ConfidenceBadge confidence={project.confidence} />
                        {projects.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeProject(projectIndex)}
                            className="p-1.5 text-foreground-muted hover:text-error-500 rounded-lg hover:bg-error-50 dark:hover:bg-error-950/20"
                            aria-label="프로젝트 삭제"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                    <Textarea
                      placeholder="프로젝트 설명"
                      value={project.description}
                      onChange={(e) => updateProject(projectIndex, "description", e.target.value)}
                      className="min-h-[60px]"
                    />
                    <div className="flex flex-wrap items-center gap-1.5">
                      {project.techStack.map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs bg-background border border-border text-foreground-secondary"
                        >
                          <input
                            type="text"
                            value={tech}
                            onChange={(e) => updateProjectTech(projectIndex, techIndex, e.target.value)}
                            className="w-20 min-w-0 bg-transparent border-none p-0 text-xs focus:outline-none focus:ring-0"
                          />
                          <button
                            type="button"
                            onClick={() => removeProjectTech(projectIndex, techIndex)}
                            className="text-foreground-muted hover:text-foreground"
                            aria-label="기술 제거"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs border border-dashed border-border">
                        <input
                          type="text"
                          placeholder="기술 추가"
                          value={newTechByProject[projectIndex] ?? ""}
                          onChange={(e) =>
                            setNewTechByProject((prev) => ({ ...prev, [projectIndex]: e.target.value }))
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              const v = (newTechByProject[projectIndex] ?? "").trim();
                              if (v) {
                                addProjectTech(projectIndex, v);
                                setNewTechByProject((prev) => ({ ...prev, [projectIndex]: "" }));
                              }
                            }
                          }}
                          className="w-24 min-w-0 bg-transparent border-none p-0 text-xs placeholder:text-foreground-muted focus:outline-none focus:ring-0"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const v = (newTechByProject[projectIndex] ?? "").trim();
                            if (v) {
                              addProjectTech(projectIndex, v);
                              setNewTechByProject((prev) => ({ ...prev, [projectIndex]: "" }));
                            }
                          }}
                          className="text-foreground-muted hover:text-primary-500"
                          aria-label="기술 추가"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </span>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full" onClick={addProject}>
                  <Plus className="w-4 h-4 mr-2" />
                  프로젝트 추가
                </Button>
              </div>
            )}
          </div>
        </div>
        )}

        {/* Tab content: 자기소개서 */}
        {activeTab === "coverLetter" && (
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="px-5 py-4">
              <p className="text-xs font-medium text-foreground-muted uppercase tracking-wide mb-1">
                업로드·추출 또는 직접 입력
              </p>
              <p className="text-sm text-foreground-secondary">
                {coverLetterText.trim()
                  ? "내용을 확인하고 필요하면 수정해 주세요."
                  : "자기소개서 파일을 업로드하면 AI가 추출한 내용이 여기 표시됩니다. 직접 입력해도 됩니다."}
              </p>
            </div>
            <div className="px-5 pb-5">
              <Textarea
                placeholder="자기소개서 내용을 입력하거나, PDF/DOCX 업로드 후 추출 결과가 표시됩니다."
                value={coverLetterText}
                onChange={(e) => setCoverLetterText(e.target.value)}
                className="min-h-[320px] resize-y rounded-xl border-border bg-background-secondary/50 text-foreground placeholder:text-foreground-muted focus:bg-background py-4 px-4 text-[15px] leading-relaxed"
              />
              {coverLetterText.trim().length > 0 && (
                <p className="mt-2 text-xs text-foreground-muted">
                  {coverLetterText.trim().length.toLocaleString()}자
                </p>
              )}
            </div>
          </div>
        )}

        {/* Submit button */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Button variant="outline" className="flex-1 h-12">
            <Edit3 className="w-4 h-4 mr-2" />
            더 수정하기
          </Button>
          <Button
            onClick={handleSubmit}
            className="flex-1 h-12"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                저장 중...
              </span>
            ) : (
              <>
                완료하고 매칭 보기
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Job titles picker modal */}
      <Dialog open={jobModalOpen} onOpenChange={setJobModalOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl gap-0 overflow-hidden">
          <DialogHeader className="pb-4 border-b border-border">
            <DialogTitle className="text-lg font-semibold flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-primary-500" />
              직무 선택
            </DialogTitle>
            <DialogDescription className="text-sm text-foreground-muted pt-1">
              지원하고 싶은 직무를 검색하거나 목록에서 골라보세요. 없으면 직접 입력해서 추가할 수 있어요.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4">
            <Input
              placeholder="직무 검색 (예: 프론트엔드)"
              value={jobSearchQuery}
              onChange={(e) => setJobSearchQuery(e.target.value)}
              className="rounded-xl bg-background-secondary border-border"
            />

            <div className="max-h-48 overflow-y-auto rounded-xl border border-border divide-y divide-border">
              {filteredModalJobTitles.length > 0 ? (
                filteredModalJobTitles.map((title) => (
                  <button
                    key={title}
                    type="button"
                    onClick={() => addJobTitle(title)}
                    disabled={selectedJobTitles.includes(title)}
                    className="w-full px-4 py-3 text-left text-sm hover:bg-background-secondary disabled:opacity-50 disabled:pointer-events-none transition-colors first:rounded-t-xl last:rounded-b-xl"
                  >
                    {title}
                    {selectedJobTitles.includes(title) && (
                      <span className="ml-2 text-xs text-primary-500">선택됨</span>
                    )}
                  </button>
                ))
              ) : (
                <div className="px-4 py-6 text-center text-sm text-foreground-muted">
                  검색 결과가 없어요. 아래에서 직접 입력해 추가해보세요.
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="직무 직접 입력"
                value={customJobInput}
                onChange={(e) => setCustomJobInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addJobTitle(customJobInput);
                    setCustomJobInput("");
                  }
                }}
                className="rounded-xl flex-1"
              />
              <Button
                type="button"
                size="sm"
                className="rounded-xl shrink-0"
                onClick={() => {
                  addJobTitle(customJobInput);
                  setCustomJobInput("");
                }}
              >
                추가
              </Button>
            </div>
          </div>

          <DialogFooter className="pt-4 border-t border-border">
            <Button onClick={() => setJobModalOpen(false)} className="rounded-xl">
              완료
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
