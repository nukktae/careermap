"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { User, Mail, Phone, GraduationCap, Code, Briefcase, FileText, Download, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getProfile, updateProfile } from "@/lib/data/profile";

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase() || "?";
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<ReturnType<typeof getProfile> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setProfile(getProfile());
  }, []);

  function handlePhotoClick() {
    fileInputRef.current?.click();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if file is an image
    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 업로드할 수 있어요.");
      return;
    }

    // Limit size to 2MB for localStorage
    if (file.size > 2 * 1024 * 1024) {
      alert("파일 크기가 너무 커요. 2MB 이하의 이미지를 사용해주세요.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        updateProfile({ photoUrl: base64 });
        setProfile((prev) => prev ? { ...prev, photoUrl: base64 } : null);
      }
    };
    reader.readAsDataURL(file);
  }

  function handleResumeDownload() {
    // Mock: trigger download or open print
    if (typeof window !== "undefined") {
      const blob = new Blob(["이력서 미리보기는 프로필 > 이력서에서 PDF로 저장할 수 있어요."], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "resume.txt";
      a.click();
      URL.revokeObjectURL(url);
    }
  }

  if (!profile) {
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
          <h1 className="text-2xl font-bold text-foreground">프로필</h1>
          <p className="text-foreground-secondary mt-1">내 정보를 확인하고 수정하세요.</p>
        </div>
        <Button asChild className="rounded-xl shrink-0">
          <Link href="/profile/edit">수정</Link>
        </Button>
      </div>

      {/* Photo */}
      <section className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center gap-6">
          <div className="group">
            <button
              type="button"
              onClick={handlePhotoClick}
              className="relative shrink-0 w-24 h-24 rounded-full bg-background-secondary flex items-center justify-center text-2xl font-bold text-foreground-muted hover:bg-background-tertiary transition-colors overflow-hidden border border-border"
            >
              {profile.photoUrl ? (
                <img src={profile.photoUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                getInitials(profile.name)
              )}
              
              <div className="absolute inset-0 w-full h-full rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-6 h-6 text-white" />
              </div>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">프로필 사진</p>
            <button
              type="button"
              onClick={handlePhotoClick}
              className="text-sm text-primary-600 dark:text-primary-400 hover:underline mt-1"
            >
              사진 변경
            </button>
          </div>
        </div>
      </section>

      {/* 기본 정보 */}
      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <User className="w-5 h-5" />
          기본 정보
        </h2>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <dt className="text-sm text-foreground-muted">이름</dt>
            <dd className="font-medium text-foreground mt-0.5">{profile.name}</dd>
          </div>
          <div>
            <dt className="text-sm text-foreground-muted flex items-center gap-1">
              <Mail className="w-4 h-4" /> 이메일
            </dt>
            <dd className="font-medium text-foreground mt-0.5">{profile.email}</dd>
          </div>
          <div>
            <dt className="text-sm text-foreground-muted flex items-center gap-1">
              <Phone className="w-4 h-4" /> 전화번호
            </dt>
            <dd className="font-medium text-foreground mt-0.5">{profile.phone}</dd>
          </div>
        </dl>
      </section>

      {/* 학력 */}
      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <GraduationCap className="w-5 h-5" />
          학력
        </h2>
        <p className="font-medium text-foreground">{profile.education.university}</p>
        <p className="text-foreground-secondary mt-1">
          {profile.education.major} · {profile.education.graduationYear}
        </p>
        <p className="text-sm text-foreground-muted mt-1">학점 {profile.education.gpa}</p>
      </section>

      {/* 스킬 */}
      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Code className="w-5 h-5" />
          스킬
        </h2>
        <div className="flex flex-wrap gap-2">
          {profile.skills.map((skill) => (
            <span
              key={skill}
              className="px-3 py-1.5 rounded-full bg-primary-badge text-primary-badge-text text-sm"
            >
              {skill}
            </span>
          ))}
        </div>
      </section>

      {/* 경력 */}
      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Briefcase className="w-5 h-5" />
          경력
        </h2>
        <ul className="space-y-4">
          {profile.experience.map((exp) => (
            <li key={exp.id} className="border-b border-border last:border-0 pb-4 last:pb-0">
              <p className="font-medium text-foreground">{exp.role}</p>
              <p className="text-sm text-foreground-secondary">{exp.company} · {exp.duration}</p>
              <p className="text-sm text-foreground-secondary mt-2">{exp.description}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* 프로젝트 */}
      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Code className="w-5 h-5" />
          프로젝트
        </h2>
        <ul className="space-y-4">
          {profile.projects.map((proj) => (
            <li key={proj.id} className="border-b border-border last:border-0 pb-4 last:pb-0">
              <p className="font-medium text-foreground">{proj.title}</p>
              <p className="text-sm text-foreground-secondary mt-1">{proj.description}</p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {proj.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-0.5 rounded text-xs bg-background-secondary text-foreground-secondary"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* 이력서 다운로드 */}
      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          이력서
        </h2>
        <p className="text-sm text-foreground-secondary mb-4">
          이력서 편집 및 PDF 저장은 프로필 수정 &gt; 이력서에서 할 수 있어요.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="rounded-xl" onClick={handleResumeDownload}>
            <Download className="w-4 h-4 mr-2" />
            이력서 다운로드
          </Button>
          <Button asChild variant="outline" className="rounded-xl">
            <Link href="/profile/resume">이력서 편집</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
