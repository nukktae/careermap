"use client";

export interface ProfileSummaryIndicatorsProps {
  educationLabel: string;
  gpa: string;
  skillsCount: number;
  experienceCount: number;
  projectsCount: number;
}

const Indicator = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => (
  <div className="bg-card border border-border rounded-xl p-4 text-center hover:border-primary/40 transition-colors cursor-default">
    <div className="text-xs font-bold text-foreground-muted mb-1">{label}</div>
    <div className="text-lg font-bold text-foreground">{value}</div>
  </div>
);

export function ProfileSummaryIndicators({
  educationLabel,
  gpa,
  skillsCount,
  experienceCount,
  projectsCount,
}: ProfileSummaryIndicatorsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      <Indicator label="학력" value={educationLabel} />
      <Indicator label="학점" value={gpa} />
      <Indicator label="스킬" value={`${skillsCount}개`} />
      <Indicator label="경력" value={`${experienceCount}개`} />
      <Indicator label="프로젝트" value={`${projectsCount}개`} />
    </div>
  );
}
