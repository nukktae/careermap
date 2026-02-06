"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getJobs } from "@/lib/data/jobs";
import { addApplication, invalidateApplicationsCache } from "@/lib/data/track";

export interface AddApplicationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdded?: () => void;
  /** When provided (e.g. from useApplications), used instead of local addApplication */
  onAddApplication?: (jobId: number) => void | Promise<void>;
}

export function AddApplicationModal({
  open,
  onOpenChange,
  onAdded,
  onAddApplication,
}: AddApplicationModalProps) {
  const [selectedJobId, setSelectedJobId] = useState<string>("");
  const jobs = getJobs();

  async function handleSubmit() {
    const jobId = selectedJobId ? Number(selectedJobId) : null;
    if (jobId == null || Number.isNaN(jobId)) return;
    if (onAddApplication) {
      await onAddApplication(jobId);
    } else {
      addApplication(jobId, "interested");
      invalidateApplicationsCache();
    }
    setSelectedJobId("");
    onOpenChange(false);
    onAdded?.();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>채용 선택</DialogTitle>
          <DialogDescription>
            지원 현황에 추가할 채용을 선택하세요. 관심있음 단계로 추가됩니다.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              채용 공고
            </label>
            <Select
              value={selectedJobId}
              onValueChange={setSelectedJobId}
            >
              <SelectTrigger>
                <SelectValue placeholder="채용을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {jobs.map((job) => (
                  <SelectItem key={job.id} value={String(job.id)}>
                    {job.company} · {job.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <p className="text-sm text-foreground-secondary">
            <Link
              href="/jobs"
              className="text-primary-600 dark:text-primary-400 hover:underline font-medium"
            >
              채용 찾기에서 고르기
            </Link>
            로 이동해서 더 많은 채용을 볼 수 있어요.
          </p>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            취소
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!selectedJobId}
          >
            추가
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
