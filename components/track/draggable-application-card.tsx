"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import type { Application } from "@/lib/data/track";
import type { Job } from "@/lib/data/jobs";
import { ApplicationCard } from "./application-card";

export interface DraggableApplicationCardProps {
  application: Application;
  job: Job | undefined;
  preventLinkNavigation?: boolean;
}

export function DraggableApplicationCard({
  application,
  job,
  preventLinkNavigation = false,
}: DraggableApplicationCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    isDragging,
    transform,
    transition,
  } = useSortable({ id: application.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const dragHandle = (
    <button
      type="button"
      ref={setActivatorNodeRef}
      {...listeners}
      {...attributes}
      className="touch-none p-1 -ml-1 rounded text-foreground-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-grab active:cursor-grabbing"
      aria-label="드래그하여 순서 변경"
    >
      <GripVertical className="w-4 h-4" />
    </button>
  );

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={isDragging ? "opacity-50" : undefined}
    >
      <ApplicationCard
        application={application}
        job={job}
        dragHandle={dragHandle}
        preventLinkNavigation={preventLinkNavigation}
      />
    </div>
  );
}
