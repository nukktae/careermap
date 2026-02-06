"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import * as trackLocal from "@/lib/data/track";
import * as trackSupabase from "@/lib/data/track-supabase";
import type { Application, ApplicationDetailData, ApplicationStatus } from "@/lib/data/track";

export function useApplications() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      if (user) {
        const list = await trackSupabase.getApplications(user.id);
        setApplications(list);
      } else {
        setApplications(trackLocal.getApplications());
      }
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (!user) {
      setApplications(trackLocal.getApplications());
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    refresh();
  }, [user?.id, refresh]);

  const addApplication = useCallback(
    async (jobId: number, status: ApplicationStatus = "interested") => {
      if (user) {
        await trackSupabase.addApplication(user.id, jobId, status);
        await refresh();
      } else {
        trackLocal.addApplication(jobId, status);
        setApplications(trackLocal.getApplications());
      }
    },
    [user?.id, refresh]
  );

  const updateApplication = useCallback(
    async (id: string, patch: Partial<Application>) => {
      if (user) {
        await trackSupabase.updateApplication(user.id, id, patch);
        await refresh();
      } else {
        trackLocal.updateApplication(id, patch);
        setApplications(trackLocal.getApplications());
      }
    },
    [user?.id, refresh]
  );

  const deleteApplication = useCallback(
    async (id: string) => {
      if (user) {
        await trackSupabase.deleteApplication(user.id, id);
        await refresh();
      } else {
        trackLocal.deleteApplication(id);
        setApplications(trackLocal.getApplications());
      }
    },
    [user?.id, refresh]
  );

  const getApplicationDetail = useCallback(
    async (id: string): Promise<(Application & ApplicationDetailData) | null> => {
      if (user) return trackSupabase.getApplicationDetail(user.id, id);
      return trackLocal.getApplicationDetail(id) ?? null;
    },
    [user?.id]
  );

  const saveApplicationDetail = useCallback(
    async (id: string, data: Partial<ApplicationDetailData>) => {
      if (user) {
        await trackSupabase.saveApplicationDetail(user.id, id, data);
      } else {
        trackLocal.saveApplicationDetail(id, data);
      }
    },
    [user?.id]
  );

  return {
    applications,
    isLoading,
    addApplication,
    updateApplication,
    deleteApplication,
    getApplicationDetail,
    saveApplicationDetail,
    refresh,
  };
}
