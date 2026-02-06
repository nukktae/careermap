"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  FileText,
  User,
  Bell,
  Calendar,
  ExternalLink,
  Plus,
  Trash2,
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
import type { Application, ApplicationDetailData } from "@/lib/data/track";
import { getJobById } from "@/lib/data/jobs";

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatDateTime(ts: number): string {
  return new Date(ts).toLocaleString("ko-KR", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

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
    const newReminder: ApplicationReminder = {
      id: "r-" + Date.now(),
      label: reminderLabel.trim(),
      dueAt: new Date(reminderDate).getTime(),
    };
    const reminders = [...(detail.reminders ?? []), newReminder];
    await saveApplicationDetail(id, { reminders });
    await loadDetail();
    setReminderLabel("");
    setReminderDate("");
  }

  async function removeReminder(reminderId: string) {
    if (!detail) return;
    const reminders = (detail.reminders ?? []).filter((r) => r.id !== reminderId);
    await saveApplicationDetail(id, { reminders });
    await loadDetail();
  }

  return (
    <div className="container-app space-y-6 pb-12">
      <Link
        href="/track"
        className="inline-flex items-center gap-2 text-sm text-foreground-secondary hover:text-foreground"
      >
        <ArrowLeft className="w-4 h-4" />
        지원 현황으로
      </Link>

      {/* A. Job info */}
      <section className="rounded-xl border border-border bg-card p-6">
        <div className="flex flex-wrap items-start gap-4">
          <div className="w-14 h-14 rounded-xl bg-background-secondary flex items-center justify-center text-foreground font-bold text-xl shrink-0">
            {job?.logo ?? "—"}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-foreground">
              {job?.title ?? "—"}
            </h1>
            <p className="text-foreground-secondary mt-1">{job?.company ?? "—"}</p>
            <div className="flex flex-wrap items-center gap-3 mt-3">
              <span className="inline-block px-2.5 py-1 rounded-full text-sm font-semibold match-medium">
                매칭 {job?.match ?? 0}%
              </span>
              <span className="text-sm text-foreground-muted flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                추가일: {formatDate(detail.addedAt)}
                {detail.appliedAt && ` · 지원일: ${formatDate(detail.appliedAt)}`}
              </span>
            </div>
            <div className="mt-3">
              <label className="text-sm font-medium text-foreground-secondary block mb-1">
                상태
              </label>
              <Select
                value={detail.status}
                onValueChange={(v) => handleStatusChange(v as ApplicationStatus)}
              >
                <SelectTrigger className="w-48 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {APPLICATION_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {getStatusLabel(s)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* B. Timeline */}
      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">타임라인</h2>
        <div className="space-y-0">
          {(detail.timeline ?? []).map((event, i) => (
            <div key={event.id} className="flex gap-4">
              <div className="flex flex-col items-center shrink-0">
                <div className="w-3 h-3 rounded-full bg-primary-500" />
                {i < (detail.timeline?.length ?? 0) - 1 && (
                  <div className="w-px flex-1 min-h-[20px] bg-border mt-1" />
                )}
              </div>
              <div className="pb-4">
                <p className="text-sm font-medium text-foreground">
                  {event.label ?? getStatusLabel(event.status)}
                </p>
                <p className="text-xs text-foreground-muted">
                  {formatDate(event.date)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* C. Notes */}
      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">메모</h2>
        <Textarea
          placeholder="면접 노트, 피드백, 준비 체크리스트 등을 적어보세요."
          value={notesValue}
          onChange={(e) => setNotesValue(e.target.value)}
          onBlur={handleNotesBlur}
          className="min-h-[140px] rounded-xl"
        />
      </section>

      {/* D. Documents */}
      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          첨부 문서
        </h2>
        <ul className="space-y-2">
          {(detail.documents ?? []).map((doc) => (
            <li
              key={doc.id}
              className="flex items-center gap-2 text-sm text-foreground-secondary"
            >
              <FileText className="w-4 h-4 shrink-0" />
              {doc.name}
            </li>
          ))}
          <li>
            <Link
              href={job ? `/jobs/${job.id}` : "#"}
              className="inline-flex items-center gap-2 text-sm text-primary-600 dark:text-primary-400 hover:underline"
            >
              <ExternalLink className="w-4 h-4" />
              채용 공고 보기
            </Link>
          </li>
        </ul>
      </section>

      {/* E. Contacts */}
      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <User className="w-5 h-5" />
          연락처
        </h2>
        <ul className="space-y-3 mb-4">
          {(detail.contacts ?? []).map((c) => (
            <li
              key={c.id}
              className="flex items-center justify-between gap-2 py-2 border-b border-border last:border-0"
            >
              <div>
                <p className="font-medium text-foreground">{c.name}</p>
                <p className="text-sm text-foreground-secondary">
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
        <div className="flex flex-wrap gap-2">
          <Input
            placeholder="이름"
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            className="rounded-xl max-w-[120px]"
          />
          <Input
            placeholder="역할"
            value={contactRole}
            onChange={(e) => setContactRole(e.target.value)}
            className="rounded-xl max-w-[120px]"
          />
          <Input
            placeholder="이메일"
            type="email"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            className="rounded-xl flex-1 min-w-[160px]"
          />
          <Button onClick={addContact} className="rounded-xl" size="sm">
            <Plus className="w-4 h-4 mr-1" />
            추가
          </Button>
        </div>
      </section>

      {/* F. Reminders */}
      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5" />
          알림
        </h2>
        <ul className="space-y-3 mb-4">
          {(detail.reminders ?? []).map((r) => (
            <li
              key={r.id}
              className="flex items-center justify-between gap-2 py-2 border-b border-border last:border-0"
            >
              <div>
                <p className="font-medium text-foreground">{r.label}</p>
                <p className="text-sm text-foreground-muted">
                  {formatDateTime(r.dueAt)}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-foreground-muted hover:text-error-500 shrink-0"
                onClick={() => removeReminder(r.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-2 items-center">
          <Input
            placeholder="내용"
            value={reminderLabel}
            onChange={(e) => setReminderLabel(e.target.value)}
            className="rounded-xl flex-1 min-w-[140px]"
          />
          <Input
            type="datetime-local"
            value={reminderDate}
            onChange={(e) => setReminderDate(e.target.value)}
            className="rounded-xl w-48"
          />
          <Button onClick={addReminder} className="rounded-xl" size="sm">
            <Plus className="w-4 h-4 mr-1" />
            알림 추가
          </Button>
        </div>
      </section>
    </div>
  );
}
