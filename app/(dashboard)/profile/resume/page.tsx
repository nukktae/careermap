"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FileText, Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getProfile, updateProfile } from "@/lib/data/profile";

const SECTION_KEYS = ["summary", "education", "experience", "projects", "skills"] as const;
const SECTION_LABELS: Record<(typeof SECTION_KEYS)[number], string> = {
  summary: "자기소개",
  education: "학력",
  experience: "경력",
  projects: "프로젝트",
  skills: "스킬",
};

export default function EditResumePage() {
  const [mounted, setMounted] = useState(false);
  const [sections, setSections] = useState<Record<string, string>>({});
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      const profile = getProfile();
      const rs = profile.resumeSections ?? {};
      const next: Record<string, string> = {};
      SECTION_KEYS.forEach((k) => {
        next[k] = rs[k] ?? "";
      });
      setSections(next);
    }
  }, [mounted]);

  const updateSection = (key: string, value: string) => {
    setSections((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    updateProfile({ resumeSections: sections });
    if (typeof window !== "undefined") window.alert("저장되었어요.");
  };

  const handlePreview = () => {
    setPreview((p) => !p);
  };

  const handlePdfDownload = () => {
    const profile = getProfile();
    const rs = profile.resumeSections ?? {};
    const lines: string[] = [
      profile.name,
      profile.email,
      profile.phone,
      "",
      "--- 자기소개 ---",
      rs.summary ?? "",
      "",
      "--- 학력 ---",
      rs.education ?? "",
      "",
      "--- 경력 ---",
      rs.experience ?? "",
      "",
      "--- 프로젝트 ---",
      rs.projects ?? "",
      "",
      "--- 스킬 ---",
      rs.skills ?? "",
    ];
    const blob = new Blob(["\uFEFF" + lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `이력서_${profile.name}_${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!mounted) {
    return (
      <div className="container-app py-12 text-center text-foreground-secondary">
        로딩 중…
      </div>
    );
  }

  return (
    <div className="container-app space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">이력서</h1>
          <p className="text-foreground-secondary mt-1">
            섹션별로 내용을 편집하고 미리보기·PDF로 저장하세요.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="rounded-xl" onClick={handlePreview}>
            <Eye className="w-4 h-4 mr-2" />
            {preview ? "편집" : "미리보기"}
          </Button>
          <Button variant="outline" className="rounded-xl" onClick={handlePdfDownload}>
            <Download className="w-4 h-4 mr-2" />
            PDF 저장
          </Button>
          <Button className="rounded-xl" onClick={handleSave}>
            저장
          </Button>
        </div>
      </div>

      {preview ? (
        <section className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            미리보기
          </h2>
          <div className="prose prose-sm dark:prose-invert max-w-none text-foreground space-y-4">
            {SECTION_KEYS.map((key) => (
              <div key={key}>
                <h3 className="font-semibold text-foreground mt-4 first:mt-0">
                  {SECTION_LABELS[key]}
                </h3>
                <p className="text-foreground-secondary whitespace-pre-wrap mt-1">
                  {sections[key] || "(비어 있음)"}
                </p>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <div className="space-y-6">
          {SECTION_KEYS.map((key) => (
            <section
              key={key}
              className="rounded-xl border border-border bg-card p-6"
            >
              <Label className="text-lg font-semibold text-foreground">
                {SECTION_LABELS[key]}
              </Label>
              <Textarea
                value={sections[key] ?? ""}
                onChange={(e) => updateSection(key, e.target.value)}
                placeholder={`${SECTION_LABELS[key]} 내용을 입력하세요.`}
                className="mt-3 min-h-[120px] rounded-xl"
              />
            </section>
          ))}
        </div>
      )}

      <p className="text-sm text-foreground-muted">
        PDF 저장은 현재 텍스트 파일로 다운로드됩니다. 인쇄 시 브라우저에서
        &quot;PDF로 저장&quot;을 선택할 수 있어요.
      </p>
    </div>
  );
}
