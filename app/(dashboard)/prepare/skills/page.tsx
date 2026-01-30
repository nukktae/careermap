"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AppIcon } from "@/components/ui/app-icon";
import { getSkillGapSkills } from "@/lib/data/prepare";
import { ImpactEffortMatrix } from "@/components/prepare/impact-effort-matrix";

export default function PrepareSkillsPage() {
  const skills = getSkillGapSkills();
  const matrixPoints = skills.map((s) => ({
    id: s.id,
    name: s.name,
    impactPercent: s.impactPercent,
    learningDays: (s.learningDaysMin + s.learningDaysMax) / 2,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-1">
          내가 부족한 스킬
        </h1>
        <p className="text-foreground-secondary">
          관심있는 채용에서 자주 요구되는 스킬이에요
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {skills.map((skill) => (
            <div
              key={skill.id}
              className="bg-card rounded-xl border border-border p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            >
              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  {skill.name}
                </h3>
                <div className="flex flex-wrap gap-3 text-sm text-foreground-secondary">
                  <span>
                    영향: +{skill.impactPercent}% 평균 매칭 상승
                  </span>
                  <span>{skill.demandCount}개 채용에서 요구</span>
                  <span>
                    학습: {skill.learningDaysMin}~{skill.learningDaysMax}일
                  </span>
                </div>
              </div>
              <Button asChild size="sm" className="shrink-0">
                <Link href="/prepare/plan">학습 플랜 만들기</Link>
              </Button>
            </div>
          ))}
        </div>

        <div className="bg-card rounded-xl border border-border p-4">
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <AppIcon name="chart" className="w-5 h-5 text-primary-500" />
            영향 vs 학습 시간
          </h3>
          <p className="text-xs text-foreground-secondary mb-4">
            왼쪽 위(우선 추천): 영향 크고 학습 시간 짧은 스킬
          </p>
          <ImpactEffortMatrix points={matrixPoints} />
        </div>
      </div>
    </div>
  );
}
