"use client";

import { useState } from "react";
import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { Plus, Download, Filter, MousePointer2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getStatusLabel, exportApplicationsToCSVFromList, APPLICATION_STATUSES } from "@/lib/data/track";
import { getJobById } from "@/lib/data/jobs";
import { useApplications } from "@/lib/hooks/use-applications";
import { KanbanColumn, type CompanyProfileItem } from "@/components/track/kanban-column";
import { DraggableApplicationCard } from "@/components/track/draggable-application-card";
import { AddApplicationModal } from "@/components/track/add-application-modal";
import type { Application, ApplicationStatus } from "@/lib/data/track";

function downloadCSV(csv: string, filename: string) {
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function TrackPage() {
  const {
    applications,
    isLoading,
    updateApplication,
    refresh,
    addApplication,
  } = useApplications();
  const [searchQuery, setSearchQuery] = useState("");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [dragJustEnded, setDragJustEnded] = useState(false);
  const [dragHintDismissed, setDragHintDismissed] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor)
  );

  async function handleDragEnd(event: DragEndEvent) {
    setDragJustEnded(true);
    setTimeout(() => setDragJustEnded(false), 200);
    const { active, over } = event;
    if (!over?.id || typeof active.id !== "string") return;
    const app = applications.find((a) => a.id === active.id);
    if (!app) return;

    const overId = String(over.id);
    const isOverColumn = APPLICATION_STATUSES.includes(overId as ApplicationStatus);
    const overApp = applications.find((a) => a.id === overId);
    const newStatus: ApplicationStatus = isOverColumn
      ? (overId as ApplicationStatus)
      : overApp?.status ?? app.status;

    if (app.status === newStatus) return;
    const patch: Partial<Application> = { status: newStatus };
    if (newStatus === "applied" && !app.appliedAt) patch.appliedAt = Date.now();
    await updateApplication(active.id, patch);
  }

  const filteredBySearch = applications.filter((app) => {
    if (!searchQuery.trim()) return true;
    const job = getJobById(app.jobId);
    if (!job) return false;
    const q = searchQuery.toLowerCase();
    return (
      job.company.toLowerCase().includes(q) ||
      job.title.toLowerCase().includes(q)
    );
  });

  const byStatus = APPLICATION_STATUSES.reduce(
    (acc, status) => {
      const items = filteredBySearch
        .filter((a) => a.status === status)
        .sort((a, b) => (a.sortOrder ?? 999) - (b.sortOrder ?? 999));
      acc[status] = items;
      return acc;
    },
    {} as Record<ApplicationStatus, Application[]>
  );

  const companyProfilesByStatus = APPLICATION_STATUSES.reduce(
    (acc, status) => {
      const seen = new Set<string>();
      const profiles: CompanyProfileItem[] = [];
      for (const app of byStatus[status]) {
        const job = getJobById(app.jobId);
        if (job && !seen.has(job.company)) {
          seen.add(job.company);
          profiles.push({ company: job.company, companyType: job.companyType });
        }
      }
      acc[status] = profiles;
      return acc;
    },
    {} as Record<ApplicationStatus, CompanyProfileItem[]>
  );

  function handleExport() {
    const csv = exportApplicationsToCSVFromList(applications);
    downloadCSV(
      csv,
      `careermap-지원현황-${new Date().toISOString().slice(0, 10)}.csv`
    );
  }

  return (
    <div className="space-y-0">
      {/* Toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between py-6 border-b border-border">
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <span className="text-sm font-medium text-foreground-secondary">
            <strong className="text-primary-500">{filteredBySearch.length}</strong>
            건의 지원
          </span>
          <div className="hidden sm:block h-4 w-px bg-border" aria-hidden />
          <div className="relative w-full sm:w-[280px]">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
            <Input
              type="text"
              placeholder="지원 항목 필터링..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 border-border rounded-lg bg-card text-sm focus-visible:ring-primary-500 focus-visible:border-primary-500"
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="h-10 px-4 rounded-lg border-border font-semibold text-foreground-secondary hover:bg-background-secondary"
          >
            <Download className="w-4 h-4 mr-2" />
            내보내기
          </Button>
          <Button
            size="sm"
            onClick={() => setAddModalOpen(true)}
            className="h-10 px-5 rounded-lg font-semibold shadow-sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            지원 추가
          </Button>
        </div>
      </div>

      {/* Kanban Board */}
      {isLoading ? (
        <div className="py-12 rounded-xl border border-border bg-background-secondary text-center">
          <p className="text-foreground-secondary">불러오는 중...</p>
        </div>
      ) : applications.length === 0 ? (
        <div className="py-12 rounded-xl border border-border bg-background-secondary text-center">
          <p className="text-foreground-secondary mb-4">아직 지원이 없어요</p>
          <Button onClick={() => setAddModalOpen(true)} className="rounded-xl">
            지원 추가
          </Button>
        </div>
      ) : (
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
          <div className="flex gap-6 overflow-x-auto py-8 min-h-[360px] pb-4">
            {APPLICATION_STATUSES.map((status) => (
              <KanbanColumn
                key={status}
                status={status}
                label={getStatusLabel(status)}
                count={byStatus[status].length}
                sortableItemIds={byStatus[status].map((a) => a.id)}
                companyProfiles={companyProfilesByStatus[status]}
                onAddClick={() => setAddModalOpen(true)}
              >
                {byStatus[status].map((app) => (
                  <DraggableApplicationCard
                    key={app.id}
                    application={app}
                    job={getJobById(app.jobId)}
                    preventLinkNavigation={dragJustEnded}
                  />
                ))}
              </KanbanColumn>
            ))}
          </div>
        </DndContext>
      )}

      {/* Drag hint - desktop, dismissible */}
      {applications.length > 0 && !dragHintDismissed && (
        <button
          type="button"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-20 hidden lg:flex items-center gap-3 bg-foreground text-background px-6 py-3 rounded-full shadow-lg text-sm font-medium cursor-pointer hover:opacity-90 transition-opacity border-0"
          onClick={() => setDragHintDismissed(true)}
          aria-label="닫기: 카드를 드래그하여 단계를 변경하세요"
        >
          <MousePointer2 className="w-5 h-5 text-primary-400 shrink-0" />
          <span>카드를 드래그하여 단계를 변경하세요</span>
        </button>
      )}

      {/* FAB - mobile */}
      <div className="fixed bottom-6 right-6 z-30 lg:hidden">
        <Button
          size="icon"
          className="rounded-full w-14 h-14 shadow-xl"
          onClick={() => setAddModalOpen(true)}
          aria-label="지원 추가"
        >
          <Plus className="w-6 h-6" />
        </Button>
      </div>

      <AddApplicationModal
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
        onAdded={refresh}
        onAddApplication={async (jobId) => addApplication(jobId, "interested")}
      />
    </div>
  );
}
