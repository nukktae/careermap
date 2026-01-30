"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  X,
  Sparkles,
  Lightbulb,
} from "lucide-react";

const tips = [
  "경험을 구체적인 수치로 표현하면 면접관에게 더 강한 인상을 줄 수 있어요.",
  "프로젝트 설명은 '문제-해결-결과' 순서로 작성하면 좋아요.",
  "사용 기술을 나열할 때는 숙련도가 높은 것부터 써보세요.",
  "팀 프로젝트에서 본인의 역할을 명확히 표현하는 것이 중요해요.",
  "최신 경험일수록 더 자세하게 작성하는 것이 좋아요.",
];

export default function ResumeUploadPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentTip, setCurrentTip] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    handleFileSelect(droppedFile);
  }, []);

  const handleFileSelect = (selectedFile: File) => {
    setError(null);

    // Validate file type
    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!validTypes.includes(selectedFile.type)) {
      setError("PDF 또는 DOCX 파일만 업로드할 수 있어요.");
      return;
    }

    // Validate file size (5MB max)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("파일 크기는 5MB 이하여야 해요.");
      return;
    }

    setFile(selectedFile);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setFile(null);
    setError(null);
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const uploadInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(uploadInterval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    await new Promise((resolve) => setTimeout(resolve, 2000));
    clearInterval(uploadInterval);
    setUploadProgress(100);
    setIsUploading(false);

    // Start analyzing
    setIsAnalyzing(true);

    // Rotate tips during analysis
    const tipInterval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % tips.length);
    }, 3000);

    // Simulate analysis time
    await new Promise((resolve) => setTimeout(resolve, 5000));
    clearInterval(tipInterval);

    // Navigate to profile review
    router.push("/onboarding/profile");
  };

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
                이력서를 업로드해 주세요
              </h1>
              <p className="text-foreground-secondary">
                AI가 이력서를 분석해 채용별 적합도를 계산해 드릴게요.
              </p>
            </div>

            {/* Upload zone */}
            <div
              className={`relative border-2 border-dashed rounded-xl p-8 transition-all ${
                isDragging
                  ? "border-primary-500 bg-primary-50 dark:bg-primary-950/20"
                  : file
                  ? "border-success-500 bg-success-50 dark:bg-success-950/20"
                  : "border-border hover:border-primary-300 hover:bg-background-secondary"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {!file ? (
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mx-auto mb-4">
                    <Upload className="w-8 h-8 text-primary-500" />
                  </div>
                  <p className="text-foreground font-medium mb-2">
                    파일을 드래그하거나 클릭해서 업로드
                  </p>
                  <p className="text-sm text-foreground-muted mb-4">
                    PDF, DOCX 지원 (최대 5MB)
                  </p>
                  <input
                    type="file"
                    accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={handleInputChange}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload">
                    <Button asChild>
                      <span>파일 선택</span>
                    </Button>
                  </label>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-success-100 dark:bg-success-900/30 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-success-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">
                      {file.name}
                    </p>
                    <p className="text-sm text-foreground-muted">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    onClick={removeFile}
                    className="p-2 text-foreground-muted hover:text-foreground"
                    aria-label="파일 제거"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}

              {/* Upload progress */}
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
            </div>

            {/* Error message */}
            {error && (
              <div className="flex items-center gap-2 mt-4 p-3 rounded-lg bg-error-50 dark:bg-error-950/20 text-error-600 dark:text-error-400">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* Upload button */}
            <Button
              onClick={handleUpload}
              className="w-full h-12 mt-6"
              disabled={!file || isUploading}
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

            {/* Tips */}
            <div className="mt-8 p-4 rounded-xl bg-background-secondary">
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-warning-500" />
                좋은 이력서 팁
              </h3>
              <ul className="space-y-2 text-sm text-foreground-secondary">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-success-500 mt-0.5 flex-shrink-0" />
                  경험을 구체적인 수치로 표현하세요
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-success-500 mt-0.5 flex-shrink-0" />
                  프로젝트의 문제-해결-결과를 명확히 작성하세요
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-success-500 mt-0.5 flex-shrink-0" />
                  사용 기술은 숙련도 순으로 나열하세요
                </li>
              </ul>
            </div>
          </div>
        ) : (
          /* Analyzing state */
          <div className="bg-card rounded-2xl border border-border shadow-lg p-8 text-center">
            {/* Animated icon */}
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full bg-primary-100 dark:bg-primary-900/30 animate-pulse" />
              <div className="absolute inset-2 rounded-full bg-primary-200 dark:bg-primary-800/30 animate-pulse" style={{ animationDelay: "0.2s" }} />
              <div className="absolute inset-4 rounded-full bg-primary-500 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-foreground mb-2">
              이력서 분석 중...
            </h2>
            <p className="text-foreground-secondary mb-8">
              AI가 이력서를 분석하고 있어요. 잠시만 기다려 주세요.
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
