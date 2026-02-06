"use client";

import { useState, useCallback } from "react";
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
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
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

  const handleUpload = async () => {
    if (!resumeFile) return;

    setError(null);
    setIsUploading(true);
    setUploadProgress(0);

    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + 10;
      });
    }, 200);

    try {
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
        setIsUploading(false);
        return;
      }

      const analysis = (await res.json()) as OnewaveResumeAnalysis;
      const patch = mapOnewaveToProfile(analysis);
      await updateProfile(patch);
    } catch (e) {
      clearInterval(progressInterval);
      setError(
        e instanceof Error ? e.message : "이력서 분석 중 오류가 발생했어요. 다시 시도해 주세요."
      );
      setIsUploading(false);
      return;
    }

    setIsUploading(false);
    setIsAnalyzing(true);

    const tipInterval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % tips.length);
    }, 3000);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    clearInterval(tipInterval);
    router.push("/onboarding/profile");
  };

  const canSubmit = resumeFile && !isUploading;

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
        {!isAnalyzing ? (
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

            {isUploading && (
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-foreground-secondary">업로드 중...</span>
                  <span className="text-foreground">{uploadProgress}%</span>
                </div>
                <div className="h-2 bg-background-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary-500 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            <Button
              onClick={handleUpload}
              className="w-full h-12 mt-6"
              disabled={!canSubmit}
            >
              {isUploading ? (
                "업로드 중..."
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  AI 분석 시작
                </>
              )}
            </Button>
          </div>
        ) : (
          /* Analyzing state */
          <div className="bg-card rounded-2xl border border-border shadow-lg p-8 text-center">
            {/* AI smart lines animation */}
            <div className="relative w-24 h-24 mx-auto mb-6">
              <svg
                viewBox="0 0 64 64"
                className="w-full h-full text-primary-500"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              >
                {/* Outer scan ring */}
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  className="text-primary-500/40"
                  strokeDasharray="8 4"
                  style={{
                    animation: "ai-scan-rotate 3s linear infinite",
                  }}
                />
                {/* Inner ring */}
                <circle
                  cx="32"
                  cy="32"
                  r="20"
                  className="text-primary-500/60"
                  strokeDasharray="6 3"
                  style={{
                    animation: "ai-scan-rotate 2.5s linear infinite reverse",
                  }}
                />
                {/* Neural / connection lines */}
                <path
                  d="M32 12 L32 24 M32 40 L32 52 M12 32 L24 32 M40 32 L52 32 M18 18 L26 26 M38 38 L46 46 M46 18 L38 26 M18 46 L26 38"
                  strokeDasharray="40 80"
                  style={{
                    animation: "ai-line-draw 2s ease-in-out infinite alternate",
                  }}
                />
                {/* Center node */}
                <circle cx="32" cy="32" r="4" fill="currentColor" className="animate-pulse opacity-90" />
                {/* Orbiting nodes */}
                <circle cx="32" cy="14" r="2" fill="currentColor" className="text-primary-400 opacity-80" style={{ animation: "ai-node-pulse 1.5s ease-in-out infinite" }} />
                <circle cx="50" cy="32" r="2" fill="currentColor" className="text-primary-400 opacity-80" style={{ animation: "ai-node-pulse 1.5s ease-in-out infinite 0.2s" }} />
                <circle cx="32" cy="50" r="2" fill="currentColor" className="text-primary-400 opacity-80" style={{ animation: "ai-node-pulse 1.5s ease-in-out infinite 0.4s" }} />
                <circle cx="14" cy="32" r="2" fill="currentColor" className="text-primary-400 opacity-80" style={{ animation: "ai-node-pulse 1.5s ease-in-out infinite 0.6s" }} />
              </svg>
            </div>

            <h2 className="text-2xl font-bold text-foreground mb-2">
              이력서·자기소개서 분석 중...
            </h2>
            <p className="text-foreground-secondary mb-8">
              AI가 이력서와 자기소개서를 분석하고 있어요. 잠시만 기다려 주세요.
            </p>

            {/* Progress bar */}
            <div className="max-w-sm mx-auto mb-8">
              <div className="h-2 bg-background-secondary rounded-full overflow-hidden">
                <div className="h-full bg-primary-500 rounded-full animate-shimmer" style={{ width: "60%" }} />
              </div>
            </div>

            {/* Rotating tips */}
            <div className="p-4 rounded-xl bg-background-secondary max-w-sm mx-auto">
              <div className="flex items-center gap-2 text-sm text-foreground-secondary">
                <Lightbulb className="w-4 h-4 text-warning-500 flex-shrink-0" />
                <p className="animate-fade-in" key={currentTip}>
                  {tips[currentTip]}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
