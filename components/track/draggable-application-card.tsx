"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
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
    isDragging,
    transform,
    transition,
  } = useSortable({ id: application.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`touch-none ${isDragging ? "opacity-50 z-50" : ""}`}
    >
      <ApplicationCard
        application={application}
        job={job}
        preventLinkNavigation={preventLinkNavigation}
      />
    </div>
  );
}
