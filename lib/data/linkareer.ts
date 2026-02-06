/**
 * Linkareer recruit list: types and mapper to Job-like shape for the jobs grid.
 * Data is fetched from /data/linkareer-recruits.json (saved from api.linkareer.com/graphql).
 */

import type { Job } from "./jobs";

export interface LinkareerActivityNode {
  id: string;
  title: string;
  organizationName: string;
  jobTypes?: string[];
  recruitCloseAt?: number;
  viewCount?: number;
  logoImage?: { url?: string };
  categories?: { name: string }[];
  regions?: { name: string }[];
  regionDistricts?: { region?: { name: string } }[];
  addresses?: { sido?: string; sigungu?: string }[];
}

export interface LinkareerResponse {
  data?: {
    activities?: {
      nodes?: LinkareerActivityNode[];
      totalCount?: number;
    };
  };
}

export const LINKAREER_ID_OFFSET = 100000;

/** Map a Linkareer node to our Job type for display in the same grid. */
export function mapLinkareerNodeToJob(node: LinkareerActivityNode): Job {
  const id = LINKAREER_ID_OFFSET + parseInt(node.id, 10) || 0;
  const location = node.addresses?.[0]
    ? [node.addresses[0].sido, node.addresses[0].sigungu].filter(Boolean).join(" ")
    : node.regions?.[0]?.name ?? "";
  const categoryNames = (node.categories ?? []).map((c) => c.name).slice(0, 5);
  const jobTypeLabel = (node.jobTypes ?? []).includes("INTERN") ? "인턴" : "채용";

  return {
    id,
    company: node.organizationName ?? "",
    title: node.title ?? "",
    location: location || "—",
    locationFilter: "seoul",
    type: jobTypeLabel,
    typeValue: "intern",
    experience: "신입",
    experienceLevel: "신입",
    match: 0,
    badge: "stretch",
    logo: (node.organizationName ?? "L").charAt(0),
    logoUrl: node.logoImage?.url,
    matchedSkills: [],
    missingSkills: categoryNames,
    salary: "—",
    salaryMin: 0,
    salaryMax: 0,
    companyType: "스타트업",
    industry: "IT",
    postedAt: node.recruitCloseAt
      ? new Date(node.recruitCloseAt).toISOString().slice(0, 10)
      : "",
  };
}

export function getLinkareerActivityUrl(nodeId: string): string {
  return `https://linkareer.com/activity/${nodeId}`;
}
