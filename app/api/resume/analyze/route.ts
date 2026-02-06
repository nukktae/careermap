import { NextRequest, NextResponse } from "next/server";
import mycv from "@/lib/data/mycv.json";

/** Response shape expected by onboarding resume page (OnewaveResumeAnalysis) */
interface OnewaveEducation {
  university: string;
  major: string;
  graduation_year: string;
  gpa?: string | null;
}
interface OnewaveProject {
  name: string;
  description: string;
  tech_stack: string[];
}
interface OnewaveResumeAnalysis {
  name: string;
  email: string;
  phone: string;
  desired_job?: string;
  educations: OnewaveEducation[];
  skills: string[];
  experiences: string[];
  certificates: string[];
  projects: OnewaveProject[];
  awards: string[];
}

type Mycv = typeof mycv;

function mapMycvToOnewave(data: Mycv): OnewaveResumeAnalysis {
  const { profile, experience, projects_and_activities, education, skills } = data;
  const contact = profile?.contact as { phone?: string; email?: string } | undefined;
  const edu = education as { university?: string; major?: string; double_major?: string; period?: { start?: string; end?: string } } | undefined;

  const graduationYear = edu?.period?.end
    ? edu.period.end === "Present"
      ? String(new Date().getFullYear())
      : edu.period.end.split("-")[0]
    : "";

  const skillsFlat: string[] = [];
  if (skills && typeof skills === "object" && !Array.isArray(skills)) {
    for (const arr of Object.values(skills)) {
      if (Array.isArray(arr)) skillsFlat.push(...arr);
    }
  }

  const experiences: string[] = (experience ?? []).map((exp: { role?: string; company?: string; period?: { start?: string; end?: string }; highlights?: string[] }) => {
    const period = exp.period ? `${exp.period.start ?? ""}-${exp.period.end ?? ""}` : "";
    const desc = (exp.highlights ?? []).join(" ");
    return [exp.role, exp.company].filter(Boolean).join(" at ") + (period ? ` (${period}). ` : " ") + desc;
  });

  const projects: OnewaveProject[] = (projects_and_activities ?? []).map(
    (p: { project?: string; details?: string[] }) => ({
      name: p.project ?? "",
      description: Array.isArray(p.details) ? p.details.join(" ") : "",
      tech_stack: [],
    })
  );

  return {
    name: profile?.name_kr ?? profile?.name_en ?? "",
    email: contact?.email ?? "",
    phone: contact?.phone ?? "",
    desired_job: profile?.title ?? undefined,
    educations: [
      {
        university: edu?.university ?? "",
        major: [edu?.major, edu?.double_major].filter(Boolean).join(" / "),
        graduation_year: graduationYear,
        gpa: null,
      },
    ],
    skills: skillsFlat,
    experiences,
    certificates: [],
    projects,
    awards: [],
  };
}

export async function POST(_request: NextRequest) {
  try {
    const analysis = mapMycvToOnewave(mycv as Mycv);
    return NextResponse.json(analysis);
  } catch (err) {
    return NextResponse.json(
      { error: "Resume analysis failed", details: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
