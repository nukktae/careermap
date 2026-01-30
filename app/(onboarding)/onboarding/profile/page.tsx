"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCircle,
  AlertCircle,
  Edit3,
  Plus,
  X,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ArrowRight,
} from "lucide-react";

// Mock parsed data
const parsedData = {
  name: "김철수",
  email: "chulsoo@example.com",
  phone: "010-1234-5678",
  education: {
    university: "서울대학교",
    major: "컴퓨터공학과",
    graduationYear: "2026 (예정)",
    gpa: "3.8 / 4.5",
    confidence: 0.95,
  },
  skills: [
    { name: "React", confidence: 0.98 },
    { name: "TypeScript", confidence: 0.95 },
    { name: "Node.js", confidence: 0.92 },
    { name: "Python", confidence: 0.88 },
    { name: "Git", confidence: 0.99 },
  ],
  experience: [
    {
      company: "스타트업 A",
      role: "프론트엔드 개발 인턴",
      duration: "2024.06 - 2024.08",
      description:
        "React와 TypeScript를 사용한 웹 애플리케이션 개발. 사용자 대시보드 UI 개선으로 페이지 로딩 속도 30% 향상.",
      confidence: 0.92,
    },
  ],
  projects: [
    {
      title: "개인 포트폴리오 웹사이트",
      description:
        "Next.js와 Tailwind CSS를 활용한 반응형 포트폴리오 웹사이트 개발",
      techStack: ["Next.js", "Tailwind CSS", "Vercel"],
      confidence: 0.94,
    },
    {
      title: "팀 프로젝트 관리 앱",
      description:
        "React Native를 사용한 크로스 플랫폼 프로젝트 관리 애플리케이션",
      techStack: ["React Native", "Firebase", "Redux"],
      confidence: 0.91,
    },
  ],
};

export default function ProfileReviewPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "education",
    "skills",
  ]);
  const [skills, setSkills] = useState(parsedData.skills.map((s) => s.name));
  const [newSkill, setNewSkill] = useState("");

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-400 text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            분석 완료!
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            프로필을 확인해 주세요
          </h1>
          <p className="text-foreground-secondary">
            AI가 추출한 정보가 맞는지 확인하고, 필요하면 수정해 주세요.
          </p>
        </div>

        {/* Profile sections */}
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
              <div className="px-4 pb-4 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">이름</Label>
                    <Input id="name" defaultValue={parsedData.name} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">이메일</Label>
                    <Input
                      id="email"
                      type="email"
                      defaultValue={parsedData.email}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">전화번호</Label>
                    <Input id="phone" defaultValue={parsedData.phone} />
                  </div>
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
                <ConfidenceBadge confidence={parsedData.education.confidence} />
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
                      defaultValue={parsedData.education.university}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="major">전공</Label>
                    <Input
                      id="major"
                      defaultValue={parsedData.education.major}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="graduationYear">졸업 연도</Label>
                    <Input
                      id="graduationYear"
                      defaultValue={parsedData.education.graduationYear}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gpa">학점</Label>
                    <Input id="gpa" defaultValue={parsedData.education.gpa} />
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
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm"
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
                  {parsedData.experience.length}개
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
                {parsedData.experience.map((exp, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg bg-background-secondary space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium text-foreground">
                          {exp.role}
                        </h3>
                        <p className="text-sm text-foreground-secondary">
                          {exp.company} · {exp.duration}
                        </p>
                      </div>
                      <ConfidenceBadge confidence={exp.confidence} />
                    </div>
                    <Textarea
                      defaultValue={exp.description}
                      className="min-h-[80px]"
                    />
                  </div>
                ))}
                <Button variant="outline" className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  경력 추가
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
                  {parsedData.projects.length}개
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
                {parsedData.projects.map((project, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg bg-background-secondary space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <Input
                        defaultValue={project.title}
                        className="font-medium bg-transparent border-none p-0 h-auto focus-visible:ring-0"
                      />
                      <ConfidenceBadge confidence={project.confidence} />
                    </div>
                    <Textarea
                      defaultValue={project.description}
                      className="min-h-[60px]"
                    />
                    <div className="flex flex-wrap gap-1.5">
                      {project.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 rounded text-xs bg-background text-foreground-secondary"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  프로젝트 추가
                </Button>
              </div>
            )}
          </div>
        </div>

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
    </div>
  );
}
