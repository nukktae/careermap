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
    const { active, over } = event;
    if (!over?.id || typeof active.id !== "string") return;
    const newStatus = over.id as ApplicationStatus;
    if (!APPLICATION_STATUSES.includes(newStatus)) return;
    const app = applications.find((a) => a.id === active.id);
    if (!app || app.status === newStatus) return;
    moveApplication(active.id, newStatus);
    refreshApplications();
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
      acc[status] = filteredBySearch.filter((a) => a.status === status);
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
              >
                {byStatus[status].map((app) => (
                  <DraggableApplicationCard
                    key={app.id}
                    application={app}
                    job={getJobById(app.jobId)}
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
