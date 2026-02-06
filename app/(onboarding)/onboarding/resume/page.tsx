"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  FileText,
  AlertCircle,
  X,
  Sparkles,
  Lightbulb,
  FileEdit,
} from "lucide-react";
import { useProfile } from "@/lib/hooks/use-profile";
import type { UserProfile } from "@/lib/data/profile";

/** Onewave /api/resume/analyze response shape (from onewave-hackathon models.py) */
interface OnewaveEducation {
  university: string;
  major: string;
  graduation_year: string;
  gpa?: string | null;
}
interface OnewaveProject {
  name: string;
  description: string;
  tech_stack: string[];
}
interface OnewaveResumeAnalysis {
  name: string;
  email: string;
  phone: string;
  desired_job?: string;
  educations: OnewaveEducation[];
  skills: string[];
  experiences: string[];
  certificates: string[];
  projects: OnewaveProject[];
  awards: string[];
}

function mapOnewaveToProfile(data: OnewaveResumeAnalysis): Partial<UserProfile> {
  const education = data.educations?.[0];
  return {
    name: data.name ?? "",
    email: data.email ?? "",
    phone: data.phone ?? "",
    education: education
      ? {
          university: education.university ?? "",
          major: education.major ?? "",
          graduationYear: education.graduation_year ?? "",
          gpa: education.gpa ?? "",
        }
      : undefined,
    skills: Array.isArray(data.skills) ? data.skills : [],
    experience: (data.experiences ?? []).map((desc, i) => ({
      id: `exp-${i + 1}`,
      company: "",
      role: "",
      duration: "",
      description: desc,
    })),
    projects: (data.projects ?? []).map((p, i) => ({
      id: `proj-${i + 1}`,
      title: p.name ?? "",
      description: p.description ?? "",
      techStack: Array.isArray(p.tech_stack) ? p.tech_stack : [],
    })),
  };
}

const ACCEPT =
  ".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document";
const MAX_MB = 5;
const validTypes = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const tips = [
  "경험을 구체적인 수치로 표현하면 면접관에게 더 강한 인상을 줄 수 있어요.",
  "프로젝트 설명은 '문제-해결-결과' 순서로 작성하면 좋아요.",
  "사용 기술을 나열할 때는 숙련도가 높은 것부터 써보세요.",
  "팀 프로젝트에서 본인의 역할을 명확히 표현하는 것이 중요해요.",
  "최신 경험일수록 더 자세하게 작성하는 것이 좋아요.",
];

type UploadType = "resume" | "coverLetter";

function validateFile(file: File): string | null {
  if (!validTypes.includes(file.type)) return "PDF 또는 DOCX만 업로드할 수 있어요.";
  if (file.size > MAX_MB * 1024 * 1024) return `파일 크기는 ${MAX_MB}MB 이하여야 해요.`;
  return null;
}

interface UploadZoneProps {
  type: UploadType;
  label: string;
  required: boolean;
  file: File | null;
  isDragging: boolean;
  onDragOver: (e: React.DragEvent, type: UploadType) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, type: UploadType) => void;
  onFileSelect: (type: UploadType, file: File) => void;
  onRemove: (type: UploadType) => void;
  accept: string;
  inputId: string;
}

function UploadZone({
  type,
  label,
  required,
  file,
  isDragging,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileSelect,
  onRemove,
  accept,
  inputId,
}: UploadZoneProps) {
  const Icon = type === "resume" ? FileText : FileEdit;
  return (
    <div
      className={`relative border-2 border-dashed rounded-xl p-6 transition-all min-h-[180px] flex flex-col ${
        isDragging
          ? "border-primary-500 bg-primary-50 dark:bg-primary-950/20"
          : file
            ? "border-success-500 bg-success-50 dark:bg-success-950/20"
            : "border-border hover:border-primary-300 hover:bg-[#fafafa] dark:hover:bg-background-secondary"
      }`}
      onDragOver={(e) => onDragOver(e, type)}
      onDragLeave={onDragLeave}
      onDrop={(e) => onDrop(e, type)}
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="text-sm font-semibold text-foreground">{label}</span>
        {required && (
          <span className="text-xs text-error-500 font-medium">필수</span>
        )}
        {!required && (
          <span className="text-xs text-foreground-muted">선택</span>
        )}
      </div>
      {!file ? (
        <label
          htmlFor={inputId}
          className="flex-1 flex flex-col items-center justify-center cursor-pointer text-center"
        >
          <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 text-primary-500">
            <Icon className="w-6 h-6" />
          </div>
          <p className="text-sm font-medium text-foreground mb-1">
            드래그하거나 클릭
          </p>
          <p className="text-xs text-foreground-muted">PDF, DOCX (최대 {MAX_MB}MB)</p>
          <input
            type="file"
            accept={accept}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onFileSelect(type, f);
              e.target.value = "";
            }}
            className="hidden"
            id={inputId}
          />
        </label>
      ) : (
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 rounded-lg bg-success-100 dark:bg-success-900/30 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5 text-success-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {file.name}
            </p>
            <p className="text-xs text-foreground-muted">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
          <button
            type="button"
            onClick={() => onRemove(type)}
            className="p-1.5 text-foreground-muted hover:text-foreground rounded-lg hover:bg-background-secondary"
            aria-label={`${label} 제거`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

export default function ResumeUploadPage() {
  const router = useRouter();
  const { updateProfile } = useProfile();
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [coverLetterFile, setCoverLetterFile] = useState<File | null>(null);
  const [draggingOver, setDraggingOver] = useState<UploadType | null>(null);
  type Phase = "idle" | "uploading" | "analyzing" | "done" | "saving";
  const [phase, setPhase] = useState<Phase>("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<OnewaveResumeAnalysis | null>(null);
  const [currentTip, setCurrentTip] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const setFile = useCallback((type: UploadType, file: File | null) => {
    if (type === "resume") setResumeFile(file);
    else setCoverLetterFile(file);
    setError(null);
  }, []);

  const handleFileSelect = useCallback(
    (type: UploadType, selectedFile: File) => {
      const err = validateFile(selectedFile);
      if (err) {
        setError(err);
        return;
      }
      setFile(type, selectedFile);
    },
    [setFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent, type: UploadType) => {
    e.preventDefault();
    e.stopPropagation();
    setDraggingOver(type);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDraggingOver(null);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent, type: UploadType) => {
      e.preventDefault();
      setDraggingOver(null);
      const dropped = e.dataTransfer.files[0];
      if (dropped) handleFileSelect(type, dropped);
    },
    [handleFileSelect]
  );

  const removeFile = useCallback((type: UploadType) => {
    setFile(type, null);
  }, [setFile]);

  const handleAnalyze = async () => {
    if (!resumeFile) return;

    setError(null);
    setPhase("uploading");
    setUploadProgress(0);

    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 85) return prev;
        return prev + Math.random() * 8 + 4;
      });
    }, 400);

    try {
      setPhase("analyzing");
      const formData = new FormData();
      formData.set("file", resumeFile, resumeFile.name);

      const res = await fetch("/api/resume/analyze", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        const message =
          (errBody as { details?: string; error?: string })?.details ??
          (errBody as { error?: string })?.error ??
          "이력서 분석에 실패했어요. 다시 시도해 주세요.";
        setError(typeof message === "string" ? message : "이력서 분석에 실패했어요.");
        setPhase("idle");
        return;
      }

      const analysis = (await res.json()) as OnewaveResumeAnalysis;
      setAnalysisResult(analysis);
      setPhase("done");
    } catch (e) {
      clearInterval(progressInterval);
      setError(
        e instanceof Error ? e.message : "이력서 분석 중 오류가 발생했어요. 다시 시도해 주세요."
      );
      setPhase("idle");
    }
  };

  const handleSaveAndContinue = async () => {
    if (!analysisResult) return;
    setError(null);
    setPhase("saving");
    try {
      const patch = mapOnewaveToProfile(analysisResult);
      await updateProfile(patch);
      router.push("/onboarding/profile");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "프로필 저장에 실패했어요.");
      setPhase("done");
    }
  };

  const canSubmit = !!resumeFile && phase === "idle";
  const isInProgress = phase === "uploading" || phase === "analyzing" || phase === "saving";

  useEffect(() => {
    if (phase !== "uploading" && phase !== "analyzing") return;
    const interval = setInterval(() => setCurrentTip((prev) => (prev + 1) % tips.length), 3000);
    return () => clearInterval(interval);
  }, [phase]);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-2xl">
        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center text-sm font-semibold">
              1
            </div>
            <span className="text-sm font-medium text-foreground">이력서 업로드</span>
          </div>
          <div className="w-12 h-0.5 bg-border" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-background-secondary border border-border text-foreground-muted flex items-center justify-center text-sm font-semibold">
              2
            </div>
            <span className="text-sm text-foreground-muted">프로필 확인</span>
          </div>
        </div>

        {/* Main content */}
        {phase === "idle" ? (
          <div className="bg-card rounded-2xl border border-border shadow-lg p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-foreground mb-2">
                이력서 & 자기소개서 업로드
              </h1>
              <p className="text-foreground-secondary">
                이력서는 필수, 자기소개서는 선택이에요. PDF 또는 DOCX (최대 {MAX_MB}MB)
              </p>
            </div>

            {/* Two upload zones */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {/* 이력서 */}
              <UploadZone
                type="resume"
                label="이력서"
                required
                file={resumeFile}
                isDragging={draggingOver === "resume"}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onFileSelect={handleFileSelect}
                onRemove={removeFile}
                accept={ACCEPT}
                inputId="file-upload-resume"
              />
              {/* 자기소개서 */}
              <UploadZone
                type="coverLetter"
                label="자기소개서"
                required={false}
                file={coverLetterFile}
                isDragging={draggingOver === "coverLetter"}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onFileSelect={handleFileSelect}
                onRemove={removeFile}
                accept={ACCEPT}
                inputId="file-upload-cover"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 mt-4 p-3 rounded-lg bg-error-50 dark:bg-error-950/20 text-error-600 dark:text-error-400">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            <Button
              onClick={handleAnalyze}
              className="w-full h-12 mt-6"
              disabled={!canSubmit}
            >
              <Sparkles className="w-5 h-5 mr-2" />
              AI 분석 시작
            </Button>
          </div>
        ) : phase === "uploading" || phase === "analyzing" ? (
          /* Real-time analysis progress */
          <div className="bg-card rounded-2xl border border-border shadow-lg p-8 text-center">
            <div className="relative w-20 h-20 mx-auto mb-6">
              <svg
                viewBox="0 0 64 64"
                className="w-full h-full text-primary-500"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              >
                <circle cx="32" cy="32" r="28" className="text-primary-500/30" strokeDasharray="8 4" style={{ animation: "ai-scan-rotate 3s linear infinite" }} />
                <circle cx="32" cy="32" r="20" className="text-primary-500/50" strokeDasharray="6 3" style={{ animation: "ai-scan-rotate 2.5s linear infinite reverse" }} />
                <circle cx="32" cy="32" r="4" fill="currentColor" className="animate-pulse opacity-90" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-foreground mb-1">
              {phase === "uploading" ? "파일 업로드 중" : "이력서 분석 중"}
            </h2>
            <p className="text-foreground-secondary text-sm mb-6">
              {phase === "uploading"
                ? "서버로 전송하고 있어요."
                : "AI가 내용을 추출하고 있어요. 잠시만 기다려 주세요."}
            </p>
            <div className="max-w-xs mx-auto">
              <div className="h-2 bg-background-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, uploadProgress)}%` }}
                />
              </div>
              <p className="text-xs text-foreground-muted mt-2">{Math.min(100, Math.round(uploadProgress))}%</p>
            </div>
            <div className="mt-6 p-3 rounded-xl bg-background-secondary/80 max-w-sm mx-auto">
              <div className="flex items-center gap-2 text-sm text-foreground-secondary justify-center">
                <Lightbulb className="w-4 h-4 text-warning-500 shrink-0" />
                <span key={currentTip}>{tips[currentTip]}</span>
              </div>
            </div>
          </div>
        ) : (phase === "done" || phase === "saving") && analysisResult ? (
          /* Analysis result — clean summary before saving to profile */
          <div className="bg-card rounded-2xl border border-border shadow-lg overflow-hidden">
            <div className="p-6 border-b border-border bg-primary-50 dark:bg-primary-950/20">
              <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400">
                <Sparkles className="w-5 h-5" />
                <span className="font-semibold">분석 완료</span>
              </div>
              <p className="text-sm text-foreground-secondary mt-1">이력서에서 추출한 정보예요. 프로필에 저장할 수 있어요.</p>
            </div>
            <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
              <section>
                <h3 className="text-xs font-semibold text-foreground-muted uppercase tracking-wider mb-2">기본 정보</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                  {analysisResult.name && <div><span className="text-foreground-muted">이름</span> <span className="text-foreground">{analysisResult.name}</span></div>}
                  {analysisResult.email && <div><span className="text-foreground-muted">이메일</span> <span className="text-foreground">{analysisResult.email}</span></div>}
                  {analysisResult.phone && <div><span className="text-foreground-muted">연락처</span> <span className="text-foreground">{analysisResult.phone}</span></div>}
                  {analysisResult.desired_job && <div className="sm:col-span-2"><span className="text-foreground-muted">희망 직무</span> <span className="text-foreground">{analysisResult.desired_job}</span></div>}
                </div>
              </section>
              {analysisResult.educations?.length > 0 && (
                <section>
                  <h3 className="text-xs font-semibold text-foreground-muted uppercase tracking-wider mb-2">학력</h3>
                  <ul className="space-y-1 text-sm text-foreground">
                    {analysisResult.educations.map((ed, i) => (
                      <li key={i}>{ed.university} · {ed.major} ({ed.graduation_year}){ed.gpa ? ` · ${ed.gpa}` : ""}</li>
                    ))}
                  </ul>
                </section>
              )}
              {analysisResult.skills?.length > 0 && (
                <section>
                  <h3 className="text-xs font-semibold text-foreground-muted uppercase tracking-wider mb-2">스킬</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {analysisResult.skills.slice(0, 20).map((s, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-background-secondary text-sm text-foreground">{s}</span>
                    ))}
                    {analysisResult.skills.length > 20 && <span className="text-foreground-muted text-sm">+{analysisResult.skills.length - 20}</span>}
                  </div>
                </section>
              )}
              {analysisResult.experiences?.length > 0 && (
                <section>
                  <h3 className="text-xs font-semibold text-foreground-muted uppercase tracking-wider mb-2">경력 요약</h3>
                  <ul className="space-y-2 text-sm text-foreground">
                    {analysisResult.experiences.slice(0, 5).map((exp, i) => (
                      <li key={i} className="pl-3 border-l-2 border-primary-200 dark:border-primary-800">{exp}</li>
                    ))}
                  </ul>
                </section>
              )}
              {analysisResult.projects?.length > 0 && (
                <section>
                  <h3 className="text-xs font-semibold text-foreground-muted uppercase tracking-wider mb-2">프로젝트</h3>
                  <ul className="space-y-2 text-sm">
                    {analysisResult.projects.slice(0, 3).map((p, i) => (
                      <li key={i}>
                        <span className="font-medium text-foreground">{p.name}</span>
                        {p.tech_stack?.length > 0 && <span className="text-foreground-muted"> · {p.tech_stack.slice(0, 3).join(", ")}</span>}
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
            <div className="p-6 border-t border-border bg-background-secondary/30">
              {error && (
                <div className="flex items-center gap-2 mb-4 p-3 rounded-lg bg-error-50 dark:bg-error-950/20 text-error-600 dark:text-error-400 text-sm">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <p>{error}</p>
                </div>
              )}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => { setPhase("idle"); setAnalysisResult(null); setError(null); }}
                  disabled={phase === "saving"}
                >
                  다시 분석
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleSaveAndContinue}
                  disabled={phase === "saving"}
                >
                  {phase === "saving" ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" aria-hidden>
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      저장 중...
                    </span>
                  ) : (
                    "프로필에 저장하고 계속"
                  )}
                </Button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
