"use client";

import Link from "next/link";
import { Pencil, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/lib/hooks/use-profile";
import mycvData from "@/lib/data/mycv.json";
import {
  ProfileAvatarCard,
  ProfileBasicInfoCard,
  ProfileResumeQuickCard,
  ProfileSummaryIndicators,
  ProfileExperienceList,
  type ExperienceItem,
} from "@/components/profile";

type MyCvProject = {
  role: string;
  project: string;
  location?: string;
  period?: { start: string; end: string };
  details?: string[];
};

const mycvProjects: MyCvProject[] =
  (mycvData as { projects_and_activities?: MyCvProject[] }).projects_and_activities ?? [];

function formatPeriod(period: { start: string; end: string } | undefined): string {
  if (!period) return "";
  const end = period.end === "Present" ? "현재" : period.end;
  return `${period.start} – ${end}`;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase() || "?";
}

function buildExperienceItems(): ExperienceItem[] {
  return mycvProjects.map((proj, index) => ({
    id: `proj-${index}-${proj.project}`,
    title: proj.project,
    role: proj.role,
    location: proj.location,
    period: formatPeriod(proj.period),
    details: proj.details ?? [],
  }));
}

export default function ProfilePage() {
  const { profile, isLoading, updateProfile } = useProfile();

  function handlePhotoChange(file: File) {
    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 업로드할 수 있어요.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert("파일 크기가 너무 커요. 2MB 이하의 이미지를 사용해주세요.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) updateProfile({ photoUrl: base64 });
    };
    reader.readAsDataURL(file);
  }

  function handleResumeDownload() {
    if (typeof window === "undefined") return;
    const blob = new Blob(
      ["이력서 미리보기는 프로필 > 이력서에서 PDF로 저장할 수 있어요."],
      { type: "text/plain;charset=utf-8" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "resume.txt";
    a.click();
    URL.revokeObjectURL(url);
  }

  if (isLoading || !profile) {
    return (
      <div className="container-app py-12 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const experienceItems = buildExperienceItems();
  const educationLabel =
    profile.education.university || profile.education.major || "—";
  const gpaDisplay =
    profile.education.gpa && profile.education.gpa !== "-"
      ? profile.education.gpa
      : "—";

  return (
    <div className="container-app pb-12">
      {/* Profile header */}
      <section className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">프로필</h1>
          <p className="text-foreground-muted">내 정보를 확인하고 수정하세요.</p>
        </div>
        <Button asChild className="rounded-lg font-semibold shrink-0 w-fit">
          <Link href="/profile/edit">
            <Pencil className="w-4 h-4 mr-2" />
            수정
          </Link>
        </Button>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left column: identity & basic info & resume */}
        <div className="lg:col-span-4 space-y-6">
          <ProfileAvatarCard
            photoUrl={profile.photoUrl}
            initials={getInitials(profile.name)}
            onPhotoChange={handlePhotoChange}
          />
          <ProfileBasicInfoCard
            name={profile.name}
            email={profile.email}
            phone={profile.phone}
          />
          <ProfileResumeQuickCard onDownload={handleResumeDownload} />
        </div>

        {/* Right column: summary indicators & experience list */}
        <div className="lg:col-span-8 space-y-8">
          <ProfileSummaryIndicators
            educationLabel={educationLabel}
            gpa={gpaDisplay}
            skillsCount={profile.skills.length}
            experienceCount={profile.experience.length}
            projectsCount={experienceItems.length}
          />
          <ProfileExperienceList
            items={experienceItems}
            addExperienceHref="/profile/edit"
          />
        </div>
      </div>
    </div>
  );
}
