"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import {
  getSavedJobs,
  toggleSavedJob as toggleSavedJobSupabase,
} from "@/lib/data/saved-jobs-supabase";

const STORAGE_KEY = "careermap-saved-jobs";

export interface SavedJobEntry {
  jobId: number;
  savedAt: number;
}

interface SavedJobsContextValue {
  savedIds: number[];
  savedWithDates: SavedJobEntry[];
  toggleSaved: (jobId: number) => void;
  isSaved: (jobId: number) => boolean;
}

const SavedJobsContext = createContext<SavedJobsContextValue | null>(null);

function loadFromStorage(): SavedJobEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SavedJobEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveToStorage(entries: SavedJobEntry[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // ignore
  }
}

export function SavedJobsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [entries, setEntries] = useState<SavedJobEntry[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (user) {
      getSavedJobs(user.id).then(setEntries);
      setMounted(true);
    } else {
      setEntries(loadFromStorage());
      setMounted(true);
    }
  }, [user?.id]);

  const toggleSaved = useCallback(
    async (jobId: number) => {
      if (user) {
        await toggleSavedJobSupabase(user.id, jobId);
        const next = await getSavedJobs(user.id);
        setEntries(next);
      } else {
        setEntries((prev) => {
          const existing = prev.find((e) => e.jobId === jobId);
          const next = existing
            ? prev.filter((e) => e.jobId !== jobId)
            : [...prev, { jobId, savedAt: Date.now() }];
          if (typeof window !== "undefined") {
            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
            } catch {
              // ignore
            }
          }
          return next;
        });
      }
    },
    [user?.id]
  );

  const isSaved = useCallback(
    (jobId: number) => entries.some((e) => e.jobId === jobId),
    [entries]
  );

  const savedIds = mounted ? entries.map((e) => e.jobId) : [];
  const savedWithDates = mounted ? [...entries] : [];

  const value: SavedJobsContextValue = {
    savedIds,
    savedWithDates,
    toggleSaved,
    isSaved,
  };

  return (
    <SavedJobsContext.Provider value={value}>
      {children}
    </SavedJobsContext.Provider>
  );
}

export function useSavedJobs(): SavedJobsContextValue {
  const ctx = useContext(SavedJobsContext);
  if (!ctx) {
    throw new Error("useSavedJobs must be used within SavedJobsProvider");
  }
  return ctx;
}
