"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface ExperienceItem {
  id: string;
  title: string;
  role: string;
  location?: string;
  period: string;
  details: string[];
}

export interface ProfileExperienceListProps {
  items: ExperienceItem[];
  addExperienceHref?: string;
}

function formatBulletList(details: string[]) {
  return details.map((d, i) => (
    <li key={i} className="flex gap-2 text-foreground-secondary text-sm leading-relaxed">
      <span className="text-primary shrink-0">•</span>
      <span>{d}</span>
    </li>
  ));
}

export function ProfileExperienceList({
  items,
  addExperienceHref = "/profile/edit",
}: ProfileExperienceListProps) {
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">프로젝트 / 경험 목록</h2>
        <span className="text-sm text-foreground-muted">총 {items.length}개의 항목</span>
      </div>

      <ul className="space-y-6">
        {items.map((item) => (
          <li
            key={item.id}
            className="bg-card border border-border rounded-2xl p-8 hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4">
              <div>
                <h3 className="text-xl font-bold text-foreground mb-1">
                  {item.title}
                </h3>
                <div className="flex flex-wrap items-center gap-2 text-sm text-foreground-muted">
                  <span className="font-semibold text-primary">{item.role}</span>
                  {(item.location || item.period) && (
                    <>
                      <span className="w-1 h-1 bg-border rounded-full shrink-0" />
                      {item.location && <span>{item.location}</span>}
                      {item.location && item.period && (
                        <span className="w-1 h-1 bg-border rounded-full shrink-0" />
                      )}
                      {item.period && <span>{item.period}</span>}
                    </>
                  )}
                </div>
              </div>
            </div>
            {item.details.length > 0 && (
              <ul className="space-y-2">{formatBulletList(item.details)}</ul>
            )}
          </li>
        ))}
      </ul>

      <Button
        asChild
        variant="ghost"
        className="w-full h-14 border-2 border-dashed border-border rounded-2xl text-foreground-muted font-bold hover:bg-background-secondary hover:border-primary hover:text-primary transition-all"
      >
        <Link href={addExperienceHref}>
          <Plus className="w-4 h-4 mr-2" />
          새로운 경험 추가하기
        </Link>
      </Button>
    </section>
  );
}
