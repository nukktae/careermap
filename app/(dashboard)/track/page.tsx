"use client";

import { useState, useEffect, useCallback } from "react";
import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { Plus, Download, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  getApplications,
  getStatusLabel,
  moveApplication,
  reorderApplicationsInStatus,
  exportApplicationsToCSV,
  APPLICATION_STATUSES,
  type Application,
  type ApplicationStatus,
} from "@/lib/data/track";
import { getJobById } from "@/lib/data/jobs";
import { KanbanColumn } from "@/components/track/kanban-column";
import { DraggableApplicationCard } from "@/components/track/draggable-application-card";
import { AddApplicationModal } from "@/components/track/add-application-modal";

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
  const [applications, setApplications] = useState<Application[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [dragJustEnded, setDragJustEnded] = useState(false);

  const refreshApplications = useCallback(() => {
    setApplications(getApplications());
  }, []);

  useEffect(() => {
    refreshApplications();
  }, [refreshApplications]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor)
  );

  function handleDragEnd(event: DragEndEvent) {
    setDragJustEnded(true);
    setTimeout(() => setDragJustEnded(false), 200);
    const { active, over } = event;
    if (!over?.id || typeof active.id !== "string") return;
    const app = applications.find((a) => a.id === active.id);
    if (!app) return;

    const overId = String(over.id);
    const isOverColumn = APPLICATION_STATUSES.includes(overId as ApplicationStatus);
    const overApp = applications.find((a) => a.id === overId);

    if (overApp && !isOverColumn) {
      // 다른 카드 위에 드롭: 같은 컬럼이면 순서 변경, 다르면 상태 변경
      if (overApp.status === app.status) {
        const ids = byStatus[app.status].map((a) => a.id);
        const oldIndex = ids.indexOf(active.id);
        const newIndex = ids.indexOf(overId);
        if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
          const [removed] = ids.splice(oldIndex, 1);
          ids.splice(newIndex, 0, removed);
          reorderApplicationsInStatus(app.status, ids);
          refreshApplications();
        }
      } else {
        moveApplication(active.id, overApp.status);
        refreshApplications();
      }
    } else if (isOverColumn) {
      // 컬럼(빈 영역)에 드롭: 상태 변경
      const newStatus = overId as ApplicationStatus;
      if (app.status !== newStatus) {
        moveApplication(active.id, newStatus);
        refreshApplications();
      }
    }
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

  function handleExport() {
    const csv = exportApplicationsToCSV();
    downloadCSV(
      csv,
      `careermap-지원현황-${new Date().toISOString().slice(0, 10)}.csv`
    );
  }

  return (
    <div className="container-app space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">지원 현황</h1>
          <p className="text-foreground-secondary mt-1">
            {applications.length}건의 지원
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 sm:flex-initial sm:w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
            <Input
              placeholder="회사·직무 검색"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 rounded-xl"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="rounded-xl"
          >
            <Download className="w-4 h-4 mr-1.5" />
            내보내기
          </Button>
          <Button
            onClick={() => setAddModalOpen(true)}
            className="rounded-xl sm:inline-flex"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            지원 추가
          </Button>
        </div>
      </div>

      {applications.length === 0 ? (
        <div className="rounded-xl border border-border bg-background-secondary p-12 text-center">
          <p className="text-foreground-secondary mb-4">아직 지원이 없어요</p>
          <Button onClick={() => setAddModalOpen(true)}>채용 찾기</Button>
        </div>
      ) : (
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
          <div className="flex gap-4 overflow-x-auto pb-4 min-h-[360px]">
            {APPLICATION_STATUSES.map((status) => (
              <KanbanColumn
                key={status}
                status={status}
                label={getStatusLabel(status)}
                count={byStatus[status].length}
                sortableItemIds={byStatus[status].map((a) => a.id)}
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

      {/* FAB on mobile */}
      <div className="fixed bottom-6 right-6 z-30 lg:hidden">
        <Button
          size="icon"
          className="rounded-full w-14 h-14 shadow-lg"
          onClick={() => setAddModalOpen(true)}
          aria-label="지원 추가"
        >
          <Plus className="w-6 h-6" />
        </Button>
      </div>

      <AddApplicationModal
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
        onAdded={refreshApplications}
      />
    </div>
  );
}
