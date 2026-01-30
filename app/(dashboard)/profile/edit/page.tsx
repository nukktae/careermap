"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  getProfile,
  updateProfile,
  type UserProfile,
  type Education,
  type Experience,
  type Project,
} from "@/lib/data/profile";

export default function EditProfilePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [expanded, setExpanded] = useState<string[]>(["personal", "education", "skills", "experience", "projects"]);
  const [form, setForm] = useState<UserProfile | null>(null);
  const [newSkill, setNewSkill] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) setForm(getProfile());
  }, [mounted]);

  const toggleSection = (id: string) => {
    setExpanded((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const updatePersonal = (key: keyof UserProfile, value: string) => {
    if (!form) return;
    setForm({ ...form, [key]: value });
  };

  const updateEducation = (key: keyof Education, value: string) => {
    if (!form) return;
    setForm({
      ...form,
      education: { ...form.education, [key]: value },
    });
  };

  const setSkills = (skills: string[]) => {
    if (!form) return;
    setForm({ ...form, skills });
  };

  const addSkillFromValue = (value: string) => {
    const s = value.trim();
    if (!s || form?.skills.includes(s)) return;
    setSkills([...form!.skills, s]);
    setNewSkill("");
  };

  const removeSkill = (skill: string) => {
    setSkills(form?.skills.filter((s) => s !== skill) ?? []);
  };

  const setExperience = (experience: Experience[]) => {
    if (!form) return;
    setForm({ ...form, experience });
  };

  const updateExperience = (id: string, patch: Partial<Experience>) => {
    setExperience(
      form!.experience.map((e) => (e.id === id ? { ...e, ...patch } : e))
    );
  };

  const addExperience = () => {
    setExperience([
      ...form!.experience,
      {
        id: "exp-" + Date.now(),
        company: "",
        role: "",
        duration: "",
        description: "",
      },
    ]);
  };

  const removeExperience = (id: string) => {
    setExperience(form!.experience.filter((e) => e.id !== id));
  };

  const setProjects = (projects: Project[]) => {
    if (!form) return;
    setForm({ ...form, projects });
  };

  const updateProject = (id: string, patch: Partial<Project>) => {
    setProjects(
      form!.projects.map((p) => (p.id === id ? { ...p, ...patch } : p))
    );
  };

  const addProject = () => {
    setProjects([
      ...form!.projects,
      {
        id: "proj-" + Date.now(),
        title: "",
        description: "",
        techStack: [],
      },
    ]);
  };

  const removeProject = (id: string) => {
    setProjects(form!.projects.filter((p) => p.id !== id));
  };

  const handleSave = async () => {
    if (!form) return;
    setSaving(true);
    updateProfile(form);
    await new Promise((r) => setTimeout(r, 400));
    setSaving(false);
    router.push("/profile");
  };

  if (!mounted || !form) {
    return (
      <div className="container-app py-12 text-center text-foreground-secondary">
        로딩 중…
      </div>
    );
  }

  const section = (id: string, title: string, count?: number) => (
    <button
      type="button"
      className="w-full flex items-center justify-between p-4 hover:bg-background-secondary transition-colors text-left"
      onClick={() => toggleSection(id)}
    >
      <h2 className="font-semibold text-foreground">
        {title}
        {count != null && (
          <span className="text-xs text-foreground-muted font-normal ml-2">
            {count}개
          </span>
        )}
      </h2>
      {expanded.includes(id) ? (
        <ChevronUp className="w-5 h-5 text-foreground-muted" />
      ) : (
        <ChevronDown className="w-5 h-5 text-foreground-muted" />
      )}
    </button>
  );

  return (
    <div className="container-app space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-foreground">프로필 수정</h1>
        <p className="text-foreground-secondary mt-1">
          정보를 수정한 뒤 저장하세요.
        </p>
      </div>

      <div className="space-y-4">
        {/* 기본 정보 */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          {section("personal", "기본 정보")}
          {expanded.includes("personal") && (
            <div className="px-4 pb-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">이름</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => updatePersonal("name", e.target.value)}
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">이메일</Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => updatePersonal("email", e.target.value)}
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">전화번호</Label>
                  <Input
                    id="phone"
                    value={form.phone}
                    onChange={(e) => updatePersonal("phone", e.target.value)}
                    className="rounded-xl"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 학력 */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          {section("education", "학력")}
          {expanded.includes("education") && (
            <div className="px-4 pb-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="university">대학교</Label>
                  <Input
                    id="university"
                    value={form.education.university}
                    onChange={(e) => updateEducation("university", e.target.value)}
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="major">전공</Label>
                  <Input
                    id="major"
                    value={form.education.major}
                    onChange={(e) => updateEducation("major", e.target.value)}
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="graduationYear">졸업 연도</Label>
                  <Input
                    id="graduationYear"
                    value={form.education.graduationYear}
                    onChange={(e) => updateEducation("graduationYear", e.target.value)}
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gpa">학점</Label>
                  <Input
                    id="gpa"
                    value={form.education.gpa}
                    onChange={(e) => updateEducation("gpa", e.target.value)}
                    className="rounded-xl"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 스킬 */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          {section("skills", "스킬", form.skills.length)}
          {expanded.includes("skills") && (
            <div className="px-4 pb-4">
              <div className="flex flex-wrap gap-2 mb-4">
                {form.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="hover:text-primary-900 dark:hover:text-primary-100"
                      aria-label={`${skill} 제거`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="스킬 추가..."
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  className="rounded-xl flex-1"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addSkillFromValue(newSkill);
                    }
                  }}
                />
                <Button
                  type="button"
                  size="sm"
                  className="rounded-xl"
                  onClick={() => addSkillFromValue(newSkill)}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  추가
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* 경력 */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          {section("experience", "경력", form.experience.length)}
          {expanded.includes("experience") && (
            <div className="px-4 pb-4 space-y-4">
              {form.experience.map((exp) => (
                <div
                  key={exp.id}
                  className="p-4 rounded-lg bg-background-secondary space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <span className="text-sm font-medium text-foreground">경력</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-foreground-muted hover:text-error-500"
                      onClick={() => removeExperience(exp.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>회사</Label>
                      <Input
                        value={exp.company}
                        onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>직무</Label>
                      <Input
                        value={exp.role}
                        onChange={(e) => updateExperience(exp.id, { role: e.target.value })}
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label>기간</Label>
                      <Input
                        value={exp.duration}
                        onChange={(e) => updateExperience(exp.id, { duration: e.target.value })}
                        placeholder="예: 2024.06 - 2024.08"
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label>설명</Label>
                      <Textarea
                        value={exp.description}
                        onChange={(e) => updateExperience(exp.id, { description: e.target.value })}
                        className="rounded-xl min-h-[80px]"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <Button type="button" variant="outline" className="w-full rounded-xl" onClick={addExperience}>
                <Plus className="w-4 h-4 mr-2" />
                경력 추가
              </Button>
            </div>
          )}
        </div>

        {/* 프로젝트 */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          {section("projects", "프로젝트", form.projects.length)}
          {expanded.includes("projects") && (
            <div className="px-4 pb-4 space-y-4">
              {form.projects.map((proj) => (
                <div
                  key={proj.id}
                  className="p-4 rounded-lg bg-background-secondary space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <span className="text-sm font-medium text-foreground">프로젝트</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-foreground-muted hover:text-error-500"
                      onClick={() => removeProject(proj.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label>제목</Label>
                      <Input
                        value={proj.title}
                        onChange={(e) => updateProject(proj.id, { title: e.target.value })}
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>설명</Label>
                      <Textarea
                        value={proj.description}
                        onChange={(e) => updateProject(proj.id, { description: e.target.value })}
                        className="rounded-xl min-h-[60px]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>기술 스택 (쉼표로 구분)</Label>
                      <Input
                        value={proj.techStack.join(", ")}
                        onChange={(e) =>
                          updateProject(proj.id, {
                            techStack: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                          })
                        }
                        placeholder="Next.js, React, TypeScript"
                        className="rounded-xl"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <Button type="button" variant="outline" className="w-full rounded-xl" onClick={addProject}>
                <Plus className="w-4 h-4 mr-2" />
                프로젝트 추가
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button variant="outline" className="rounded-xl flex-1" asChild>
          <Link href="/profile">취소</Link>
        </Button>
        <Button
          className="rounded-xl flex-1"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "저장 중…" : "저장"}
        </Button>
      </div>
    </div>
  );
}
