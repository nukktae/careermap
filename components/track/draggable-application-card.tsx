"use client";

import { useDraggable } from "@dnd-kit/core";
import { GripVertical } from "lucide-react";
import type { Application } from "@/lib/data/track";
import type { Job } from "@/lib/data/jobs";
import { ApplicationCard } from "./application-card";

export interface DraggableApplicationCardProps {
  application: Application;
  job: Job | undefined;
}

export function DraggableApplicationCard({
  application,
  job,
}: DraggableApplicationCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    isDragging,
  } = useDraggable({ id: application.id });

  const dragHandle = (
    <button
      type="button"
      ref={setActivatorNodeRef}
      {...listeners}
      {...attributes}
      className="touch-none p-1 -ml-1 rounded text-foreground-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500"
      aria-label="드래그하여 이동"
    >
      <GripVertical className="w-4 h-4" />
    </button>
  );

  return (
    <div
      ref={setNodeRef}
      className={isDragging ? "opacity-50" : undefined}
    >
      <ApplicationCard
        application={application}
        job={job}
        dragHandle={dragHandle}
      />
    </div>
  );
}
