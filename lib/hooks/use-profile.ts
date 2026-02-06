"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import * as profileLocal from "@/lib/data/profile";
import * as profileSupabase from "@/lib/data/profile-supabase";
import type { UserProfile, UserPreferences } from "@/lib/data/profile";

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (user) {
      const [p, prefs] = await Promise.all([
        profileSupabase.getProfile(user.id),
        profileSupabase.getPreferences(user.id),
      ]);
      setProfile(p);
      setPreferences(prefs);
    } else {
      setProfile(profileLocal.getProfile());
      setPreferences(profileLocal.getPreferences());
    }
    setIsLoading(false);
  }, [user?.id]);

  useEffect(() => {
    if (!user) {
      setProfile(profileLocal.getProfile());
      setPreferences(profileLocal.getPreferences());
      setIsLoading(false);
      return;
    }
    refresh();
  }, [user?.id, refresh]);

  const updateProfile = useCallback(
    async (patch: Partial<UserProfile>) => {
      if (user) {
        await profileSupabase.updateProfile(user.id, patch);
        const next = await profileSupabase.getProfile(user.id);
        setProfile(next);
      } else {
        profileLocal.updateProfile(patch);
        setProfile(profileLocal.getProfile());
      }
    },
    [user?.id]
  );

  const updatePreferences = useCallback(
    async (patch: Partial<UserPreferences>) => {
      if (user) {
        await profileSupabase.updatePreferences(user.id, patch);
        const next = await profileSupabase.getPreferences(user.id);
        setPreferences(next);
      } else {
        profileLocal.updatePreferences(patch);
        setPreferences(profileLocal.getPreferences());
      }
    },
    [user?.id]
  );

  return {
    profile: profile ?? profileLocal.getProfile(),
    preferences: preferences ?? profileLocal.getPreferences(),
    isLoading,
    updateProfile,
    updatePreferences,
    refresh,
  };
}
