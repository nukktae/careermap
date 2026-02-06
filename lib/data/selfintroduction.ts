/**
 * Self-introduction (자기소개서) content for cover letter preview.
 * Source: careermap/selfintroduction.json
 */

import raw from "../../selfintroduction.json";

export interface SelfIntroductionSections {
  지원동기?: string;
  직무역량?: string;
  문제해결경험?: string;
  협업경험?: string;
  학습능력및성장의지?: string;
  커리어비전?: string;
}

export interface SelfIntroductionData {
  자기소개서: SelfIntroductionSections;
}

const data = raw as SelfIntroductionData;

export function getSelfIntroductionSections(): SelfIntroductionSections {
  return data?.자기소개서 ?? {};
}

const SECTION_ORDER: (keyof SelfIntroductionSections)[] = [
  "지원동기",
  "직무역량",
  "문제해결경험",
  "협업경험",
  "학습능력및성장의지",
  "커리어비전",
];

export function getSelfIntroductionOrderedEntries(): [string, string][] {
  const sections = getSelfIntroductionSections();
  return SECTION_ORDER.filter((key) => sections[key]).map((key) => [key, sections[key]!]);
}

/** Full 자기소개서 text for job match (e.g. so "기획", "서비스" in selfintro count as profile skills). */
export function getSelfIntroductionFullText(): string {
  const sections = getSelfIntroductionSections();
  return SECTION_ORDER.filter((key) => sections[key]).map((key) => sections[key]).join("\n");
}
