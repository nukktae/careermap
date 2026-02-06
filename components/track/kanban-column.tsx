"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Plus, Send, FileCheck, MessageCircle, Trophy } from "lucide-react";
import { ReactNode } from "react";
import type { ApplicationStatus } from "@/lib/data/track";

export interface CompanyProfileItem {
  company: string;
  companyType?: string;
}


const COLUMN_EMPTY_MESSAGES: Record<ApplicationStatus, string> = {
  interested: "",
  applied: "카드를 이쪽으로 드래그하여\n상태를 업데이트하세요",
  resume_passed: "지원이 없습니다",
  interview: "지원이 없습니다",
  final: "지원이 없습니다",
};

export interface KanbanColumnProps {
  status: ApplicationStatus;
  label: string;
  count: number;
  sortableItemIds?: string[];
  companyProfiles?: CompanyProfileItem[];
  onAddClick?: () => void;
  children: ReactNode;
}

export function KanbanColumn({
  status,
  label,
  count,
  sortableItemIds = [],
  onAddClick,
  children,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status });
  const emptyMsg = COLUMN_EMPTY_MESSAGES[status];
  const showEmptyState = count === 0;
  const showAddPlaceholder = status === "interested";

  return (
    <div
      ref={setNodeRef}
      className={`shrink-0 min-w-[250px] w-[280px] flex flex-col gap-4 rounded-xl transition-colors ${
        isOver
          ? "ring-2 ring-primary-500 ring-offset-2 ring-offset-background bg-primary-50/30 dark:bg-primary-950/20"
          : ""
      }`}
    >
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-foreground-secondary">{label}</h3>
          <span className="rounded-full bg-background-tertiary text-foreground-secondary text-xs font-bold px-2 py-0.5">
            {count}
          </span>
        </div>
        <button
          type="button"
          onClick={onAddClick}
          className="p-1.5 rounded-md text-foreground-muted hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-950/30 transition-colors"
          aria-label={`${label}에 추가`}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="flex flex-col gap-4 flex-1 min-h-[200px]">
        <SortableContext
          items={sortableItemIds}
          strategy={verticalListSortingStrategy}
        >
          {children}
        </SortableContext>

        {showEmptyState && (
          <div className="flex-1 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-background-secondary/50 py-6 px-4 text-center min-h-[120px]">
            <div className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-foreground-muted mb-3 shadow-sm">
              <ColumnEmptyIcon status={status} />
            </div>
            {emptyMsg && (
              <p className="text-xs text-foreground-muted font-medium whitespace-pre-line">
                {emptyMsg}
              </p>
            )}
          </div>
        )}

        {showAddPlaceholder && !showEmptyState && (
          <button
            type="button"
            onClick={onAddClick}
            className="rounded-xl border-2 border-dashed border-border h-24 flex items-center justify-center text-foreground-muted hover:border-primary-500 hover:text-primary-500 transition-colors cursor-pointer"
          >
            <Plus className="w-6 h-6" />
          </button>
        )}
      </div>
    </div>
  );
}

function ColumnEmptyIcon({ status }: { status: ApplicationStatus }) {
  switch (status) {
    case "applied":
      return <Send className="w-5 h-5" />;
    case "resume_passed":
      return <FileCheck className="w-5 h-5" />;
    case "interview":
      return <MessageCircle className="w-5 h-5" />;
    case "final":
      return <Trophy className="w-5 h-5" />;
    default:
      return <Plus className="w-5 h-5" />;
  }
}
