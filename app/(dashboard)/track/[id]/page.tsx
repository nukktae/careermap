"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  FileText,
  ChevronDown,
  Calendar,
  MapPin,
  ExternalLink,
  Plus,
  Trash2,
  Share2,
  MoreVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useApplications } from "@/lib/hooks/use-applications";
import { getStatusLabel, APPLICATION_STATUSES } from "@/lib/data/track";
import type { ApplicationStatus, ApplicationContact, ApplicationReminder } from "@/lib/data/track";
import type { Application, ApplicationDetailData, TimelineEvent } from "@/lib/data/track";
import { getJobById } from "@/lib/data/jobs";

function formatShortDate(ts: number): string {
  return new Date(ts).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).replace(/\. /g, ".").replace(/\.$/, "").trim();
}

function formatDateTime(ts: number): string {
  return new Date(ts).toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function daysUntil(ts: number): number {
  const now = new Date();
  const d = new Date(ts);
  now.setHours(0, 0, 0, 0);
  d.setHours(0, 0, 0, 0);
  return Math.ceil((d.getTime() - now.getTime()) / 86400000);
}

const SECTION_TITLE = "text-sm font-bold text-foreground-muted uppercase tracking-wider";

export default function ApplicationDetailPage() {
  const params = useParams();
  const id = params?.id ? String(params.id) : "";
  const {
    getApplicationDetail,
    saveApplicationDetail,
    updateApplication,
  } = useApplications();
  const [detail, setDetail] = useState<(Application & ApplicationDetailData) | null | undefined>(undefined);
  const [notesValue, setNotesValue] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactRole, setContactRole] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [reminderLabel, setReminderLabel] = useState("");
  const [reminderDate, setReminderDate] = useState("");
  const [reminderTime, setReminderTime] = useState("14:00");

  const loadDetail = useCallback(async () => {
    if (!id) return;
    const d = await getApplicationDetail(id);
    setDetail(d ?? null);
    setNotesValue(d?.notes ?? "");
  }, [id, getApplicationDetail]);

  useEffect(() => {
    loadDetail();
  }, [loadDetail]);

  if (id && detail === undefined) {
    return (
      <div className="container-app py-8 text-center text-foreground-secondary">
        로딩 중…
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="container-app py-12 text-center">
        <h2 className="text-xl font-semibold text-foreground mb-2">
          지원을 찾을 수 없어요
        </h2>
        <p className="text-foreground-secondary mb-4">
          해당 지원이 삭제되었거나 존재하지 않습니다.
        </p>
        <Button asChild variant="outline" className="rounded-xl">
          <Link href="/track">지원 현황으로</Link>
        </Button>
      </div>
    );
  }

  const job = getJobById(detail.jobId);
  const timeline = detail.timeline ?? [];
  const currentStatusIndex = APPLICATION_STATUSES.indexOf(detail.status);
  const upcomingSteps: { label: string; status: ApplicationStatus }[] = APPLICATION_STATUSES
    .slice(currentStatusIndex + 1)
    .map((s) => ({ label: getStatusLabel(s), status: s }));

  async function handleStatusChange(newStatus: ApplicationStatus) {
    await updateApplication(id, { status: newStatus });
    await loadDetail();
  }

  async function handleNotesBlur() {
    if (!detail) return;
    if (notesValue !== (detail.notes ?? "")) {
      await saveApplicationDetail(id, { notes: notesValue });
      await loadDetail();
    }
  }

  async function addContact() {
    if (!detail) return;
    if (!contactName.trim()) return;
    const newContact: ApplicationContact = {
      id: "c-" + Date.now(),
      name: contactName.trim(),
      role: contactRole.trim() || "기타",
      email: contactEmail.trim() || undefined,
    };
    const contacts = [...(detail.contacts ?? []), newContact];
    await saveApplicationDetail(id, { contacts });
    await loadDetail();
    setContactName("");
    setContactRole("");
    setContactEmail("");
  }

  async function removeContact(contactId: string) {
    if (!detail) return;
    const contacts = (detail.contacts ?? []).filter((c) => c.id !== contactId);
    await saveApplicationDetail(id, { contacts });
    await loadDetail();
  }

  async function addReminder() {
    if (!detail) return;
    if (!reminderLabel.trim() || !reminderDate) return;
    const t = reminderTime ? reminderTime.split(":").map(Number) : [14, 0];
    const d = new Date(reminderDate);
    d.setHours(t[0] ?? 14, t[1] ?? 0, 0, 0);
    const newReminder: ApplicationReminder = {
      id: "r-" + Date.now(),
      label: reminderLabel.trim(),
      dueAt: d.getTime(),
    };
    const reminders = [...(detail.reminders ?? []), newReminder];
    await saveApplicationDetail(id, { reminders });
    await loadDetail();
    setReminderLabel("");
    setReminderDate("");
    setReminderTime("14:00");
  }

  async function removeReminder(reminderId: string) {
    if (!detail) return;
    const reminders = (detail.reminders ?? []).filter((r) => r.id !== reminderId);
    await saveApplicationDetail(id, { reminders });
    await loadDetail();
  }

  return (
    <div className="container-app pb-12">
      {/* Back navigation */}
      <div className="mb-8">
        <Link
          href="/track"
          className="inline-flex items-center gap-2 text-sm font-medium text-foreground-muted hover:text-primary-500 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          지원 현황으로
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left column: main content */}
        <div className="lg:col-span-8 space-y-6">
          {/* Application header card */}
          <section className="rounded-2xl border border-border bg-card p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
              <div className="flex gap-6">
                <div className="w-20 h-20 rounded-2xl bg-[#FFCD00] flex items-center justify-center text-3xl font-bold text-[#3C1E1E] shrink-0">
                  {job?.logo ?? "—"}
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3 mb-1">
                    <h1 className="text-2xl font-bold text-foreground">
                      {job?.title ?? "—"}
                    </h1>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary-50 text-primary-600 border border-primary-100 dark:bg-primary-600/20 dark:border-primary-500/40 dark:text-primary-300">
                      매칭 점수 {job?.match ?? 0}%
                    </span>
                  </div>
                  <p className="text-lg text-foreground-secondary mb-4">
                    {job?.company ?? "—"}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-foreground-muted">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 shrink-0" />
                      추가일: {formatShortDate(detail.addedAt)}
                    </span>
                    {job?.location && (
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 shrink-0" />
                        {job.location}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                className="shrink-0 rounded-xl border-foreground/20 bg-foreground text-background hover:bg-foreground/90 hover:text-background"
              >
                <Share2 className="w-4 h-4 mr-2" />
                공유하기
              </Button>
            </div>
          </section>

          {/* Status + Timeline grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Status selector */}
            <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h3 className={SECTION_TITLE + " mb-4"}>지원 상태</h3>
              <Select
                value={detail.status}
                onValueChange={(v) => handleStatusChange(v as ApplicationStatus)}
              >
                <SelectTrigger className="h-14 w-full rounded-xl bg-primary-50 dark:bg-primary-800/25 border-2 border-primary-500 px-4 font-bold text-primary-600 dark:text-primary-400 [&>span]:flex [&>span]:items-center [&>span]:gap-3">
                  <span className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-primary-500 animate-pulse" />
                    <SelectValue />
                  </span>
                  <ChevronDown className="w-4 h-4 text-primary-500 ml-auto" />
                </SelectTrigger>
                <SelectContent>
                  {APPLICATION_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {getStatusLabel(s)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="mt-4 text-xs text-foreground-muted leading-relaxed">
                상태를 변경하여 지원 프로세스를 관리하세요.
              </p>
            </section>

            {/* Timeline */}
            <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h3 className={SECTION_TITLE + " mb-4"}>타임라인</h3>
              <div className="relative pl-6 border-l-2 border-border-secondary space-y-6">
                {timeline.map((event: TimelineEvent) => (
                  <div key={event.id} className="relative">
                    <div
                      className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-primary-500 border-4 border-card"
                      aria-hidden
                    />
                    <p className="text-sm font-bold text-foreground">
                      {event.label ?? getStatusLabel(event.status)}
                    </p>
                    <p className="text-xs text-foreground-muted">
                      {formatShortDate(event.date)}
                    </p>
                  </div>
                ))}
                {upcomingSteps.slice(0, 2).map((step) => (
                  <div key={step.status} className="relative opacity-50">
                    <div
                      className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-border border-4 border-card"
                      aria-hidden
                    />
                    <p className="text-sm font-medium text-foreground-muted">
                      {step.label}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Memo */}
          <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className={SECTION_TITLE}>메모</h3>
              <span className="text-xs text-foreground-muted">자동 저장됨</span>
            </div>
            <Textarea
              placeholder="채용 담당자 피드백, 면접 질문, 개인적인 생각 등을 기록하세요..."
              value={notesValue}
              onChange={(e) => setNotesValue(e.target.value)}
              onBlur={handleNotesBlur}
              className="min-h-[200px] w-full rounded-xl bg-background-secondary border-0 p-4 text-sm resize-none focus-visible:ring-2 focus-visible:ring-primary-500 leading-relaxed"
            />
          </section>
        </div>

        {/* Right column: sidebar */}
        <div className="lg:col-span-4 space-y-6">
          {/* Job reference CTA */}
          <section className="rounded-2xl bg-primary-500 p-6 text-primary-foreground shadow-lg shadow-primary-500/20">
            <h3 className="text-sm font-bold opacity-90 mb-4">
              채용 정보 확인
            </h3>
            <p className="text-sm mb-6 leading-relaxed opacity-90">
              원본 공고의 상세 자격 요건과 복리후생을 다시 확인해보세요.
            </p>
            <Button
              asChild
              className="w-full h-12 rounded-xl font-bold text-sm bg-background text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/30"
            >
              <Link href={job ? `/jobs/${job.id}` : "#"}>
                채용 공고 보기
                <ExternalLink className="w-4 h-4 ml-2 inline" />
              </Link>
            </Button>
          </section>

          {/* Documents */}
          <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className={SECTION_TITLE}>첨부 문서</h3>
              <button
                type="button"
                className="text-primary-500 text-xs font-bold hover:underline"
              >
                + 파일 추가
              </button>
            </div>
            <div className="space-y-3">
              {(detail.documents ?? []).map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-background-secondary border border-transparent hover:border-border transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-error-50 dark:bg-error-500/20 text-error-500 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {doc.name}
                      </p>
                      <p className="text-[10px] text-foreground-muted">—</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0 h-8 w-8 text-foreground-muted hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </section>

          {/* Contacts */}
          <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className={SECTION_TITLE + " mb-4"}>연락처 관리</h3>
            <ul className="space-y-3 mb-6">
              {(detail.contacts ?? []).map((c) => (
                <li
                  key={c.id}
                  className="flex items-center justify-between gap-2 py-2 border-b border-border last:border-0"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-foreground">{c.name}</p>
                    <p className="text-sm text-foreground-secondary truncate">
                      {c.role}
                      {c.email && ` · ${c.email}`}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-foreground-muted hover:text-error-500 shrink-0"
                    onClick={() => removeContact(c.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </li>
              ))}
            </ul>
            <div className="space-y-4">
              <div className="space-y-2">
                <Input
                  placeholder="성함"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="h-10 rounded-lg bg-background-secondary border-border"
                />
                <Input
                  placeholder="직책 / 부서"
                  value={contactRole}
                  onChange={(e) => setContactRole(e.target.value)}
                  className="h-10 rounded-lg bg-background-secondary border-border"
                />
                <Input
                  type="email"
                  placeholder="이메일 주소"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="h-10 rounded-lg bg-background-secondary border-border"
                />
              </div>
              <Button
                onClick={addContact}
                variant="secondary"
                className="w-full h-10 rounded-lg font-bold bg-background-tertiary hover:bg-border text-foreground-secondary"
              >
                연락처 추가
              </Button>
            </div>
          </section>

          {/* Reminders */}
          <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className={SECTION_TITLE + " mb-4"}>알림 및 일정</h3>
            <div className="space-y-3 mb-6">
              {(detail.reminders ?? []).map((r) => {
                const d = daysUntil(r.dueAt);
                const badge = d > 0 ? `D-${d}` : d === 0 ? "D-Day" : "지남";
                return (
                  <div
                    key={r.id}
                    className="p-3 rounded-xl bg-warning-50 dark:bg-warning-500/10 border border-warning-100 dark:border-warning-500/20"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={`text-xs font-bold ${
                          d >= 0
                            ? "text-warning-600 dark:text-warning-400"
                            : "text-foreground-muted"
                        }`}
                      >
                        {badge}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-warning-500 hover:text-warning-700"
                        onClick={() => removeReminder(r.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                    <p className="text-sm font-semibold text-foreground">
                      {r.label}
                    </p>
                    <p className="text-[11px] text-foreground-secondary mt-1">
                      {formatDateTime(r.dueAt)}
                    </p>
                  </div>
                );
              })}
            </div>
            <div className="space-y-2">
              <Input
                placeholder="알림 내용"
                value={reminderLabel}
                onChange={(e) => setReminderLabel(e.target.value)}
                className="h-10 rounded-lg bg-background-secondary border-border"
              />
              <div className="flex gap-2">
                <Input
                  type="date"
                  value={reminderDate}
                  onChange={(e) => setReminderDate(e.target.value)}
                  className="flex-1 h-10 rounded-lg bg-background-secondary border-border text-xs"
                />
                <Input
                  type="time"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  className="w-[100px] h-10 rounded-lg bg-background-secondary border-border text-xs"
                />
              </div>
              <Button
                onClick={addReminder}
                className="w-full h-10 rounded-lg font-bold text-sm bg-primary-500 hover:bg-primary-600 text-primary-foreground shadow-md"
              >
                알림 추가
              </Button>
            </div>
          </section>
        </div>
      </div>

      {/* FAB */}
      <div className="fixed bottom-10 right-10 z-40">
        <Button
          size="icon"
          className="w-16 h-16 rounded-full shadow-xl bg-primary-500 hover:bg-primary-600 hover:scale-110 active:scale-95 transition-transform"
        >
          <Plus className="w-7 h-7" />
        </Button>
      </div>
    </div>
  );
}
