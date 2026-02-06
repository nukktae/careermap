"use client";

import { useState, useEffect, useMemo } from "react";
import {
  GreetingSection,
  QuickActionsGrid,
  MatchingStatusCard,
  ApplicationStatusCard,
  RecentJobsSection,
  InsightsHighlight,
} from "@/components/dashboard";
import { defaultDashboardData, type DashboardRecentJob } from "@/lib/data/dashboard";
import { LINKAREER_ID_OFFSET } from "@/lib/data/linkareer";
import type { LinkareerResponse } from "@/lib/data/linkareer";

function buildLogoUrlMap(nodes: { id: string; logoImage?: { url?: string } }[]): Map<number, string> {
  const map = new Map<number, string>();
  for (const node of nodes) {
    const url = node.logoImage?.url;
    if (url) {
      const jobId = LINKAREER_ID_OFFSET + parseInt(node.id, 10) || 0;
      map.set(jobId, url);
    }
  }
  return map;
}

export default function DashboardPage() {
  const data = defaultDashboardData;
  const [logoUrlMap, setLogoUrlMap] = useState<Map<number, string>>(new Map());

  useEffect(() => {
    fetch("/data/linkareer-recruits.json")
      .then((res) => res.json())
      .then((json: LinkareerResponse) => {
        const nodes = json.data?.activities?.nodes ?? [];
        setLogoUrlMap(buildLogoUrlMap(nodes));
      })
      .catch(() => {});
  }, []);

  const recentJobsWithLogos = useMemo((): DashboardRecentJob[] => {
    return data.recentJobs.map((job) => {
      const logoUrl = logoUrlMap.get(job.id);
      return logoUrl ? { ...job, logoUrl } : job;
    });
  }, [data.recentJobs, logoUrlMap]);

  return (
    <div className="space-y-8">
      <GreetingSection user={data.user} />

      <QuickActionsGrid />

      <div className="grid grid-cols-12 gap-6 lg:gap-8">
        <MatchingStatusCard summary={data.matchSummary} />
        <ApplicationStatusCard summary={data.applications} />
      </div>

      <RecentJobsSection jobs={recentJobsWithLogos} />

      <InsightsHighlight />
    </div>
  );
}
