"use client";

import { useDroppable } from "@dnd-kit/core";
import { ReactNode } from "react";
import type { ApplicationStatus } from "@/lib/data/track";

export interface KanbanColumnProps {
  status: ApplicationStatus;
  label: string;
  count: number;
  children: ReactNode;
}

export function KanbanColumn({
  status,
  label,
  count,
  children,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div
      ref={setNodeRef}
      className={`shrink-0 w-[260px] min-h-[320px] flex flex-col rounded-xl border bg-background-secondary transition-colors ${
        isOver ? "border-primary-400 dark:border-primary-500 bg-primary-50/50 dark:bg-primary-950/30" : "border-border"
      }`}
    >
      <div className="p-3 border-b border-border">
        <h3 className="font-semibold text-foreground text-sm">{label}</h3>
        <p className="text-xs text-foreground-muted mt-0.5">{count}건</p>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-2">{children}</div>
    </div>
  );
}
