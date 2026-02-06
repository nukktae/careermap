"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogContent,
} from "@/components/ui/dialog";
import { AppIcon } from "@/components/ui/app-icon";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export type NotificationType = "match" | "deadline" | "update" | "system";

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  time: string;
  read: boolean;
  href?: string;
}

// Mock notifications – replace with real data/API later
const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "1",
    type: "match",
    title: "새 매칭 추천",
    body: "프론트엔드 엔지니어 직무에 맞는 채용 3건이 올라왔어요.",
    time: "10분 전",
    read: false,
    href: "/jobs",
  },
  {
    id: "2",
    type: "deadline",
    title: "지원 마감 임박",
    body: "네이버 2026 상반기 채용 지원이 3일 후 마감됩니다.",
    time: "1시간 전",
    read: false,
    href: "/jobs",
  },
  {
    id: "3",
    type: "update",
    title: "이력서 분석 완료",
    body: "업로드한 이력서·자기소개서 분석이 완료되었어요. 프로필을 확인해 주세요.",
    time: "어제",
    read: true,
    href: "/onboarding/profile",
  },
  {
    id: "4",
    type: "system",
    title: "잡자 업데이트",
    body: "매칭 정확도가 개선되었어요. 더 나은 추천을 받아보세요.",
    time: "2일 전",
    read: true,
  },
];

const TYPE_CONFIG: Record<
  NotificationType,
  { label: string; icon: "magic-star" | "clock" | "tick-circle" | "document-text" }
> = {
  match: { label: "매칭", icon: "magic-star" },
  deadline: { label: "마감", icon: "clock" },
  update: { label: "업데이트", icon: "tick-circle" },
  system: { label: "공지", icon: "document-text" },
};

interface NotificationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NotificationModal({ open, onOpenChange }: NotificationModalProps) {
  const router = useRouter();
  const [filter, setFilter] = React.useState<"all" | "unread">("all");
  const [items, setItems] = React.useState<NotificationItem[]>(MOCK_NOTIFICATIONS);

  const filtered = React.useMemo(
    () =>
      filter === "unread" ? items.filter((n) => !n.read) : items,
    [items, filter]
  );

  const unreadCount = items.filter((n) => !n.read).length;

  const markAllRead = () => {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleItemClick = (item: NotificationItem) => {
    setItems((prev) =>
      prev.map((n) => (n.id === item.id ? { ...n, read: true } : n))
    );
    if (item.href) {
      onOpenChange(false);
      router.push(item.href);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogContent
          className={cn(
            "fixed right-0 top-0 bottom-0 w-full max-w-[400px] translate-x-0 translate-y-0 rounded-none rounded-l-2xl border-l border-border shadow-xl",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
            "flex flex-col gap-0 p-0 overflow-hidden [&>button]:hidden"
          )}
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={() => onOpenChange(false)}
        >
          {/* Header */}
          <div className="shrink-0 flex items-center justify-between px-5 py-4 border-b border-border bg-card">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold text-foreground">알림</h2>
              {unreadCount > 0 && (
                <span className="rounded-full bg-primary-500 px-2 py-0.5 text-xs font-medium text-white">
                  {unreadCount}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-foreground-secondary hover:text-foreground text-xs"
                  onClick={markAllRead}
                >
                  모두 읽음
                </Button>
              )}
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="p-2 rounded-lg text-foreground-muted hover:text-foreground hover:bg-background-secondary transition-colors"
                aria-label="닫기"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="shrink-0 flex border-b border-border bg-background-secondary/50">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={cn(
                "flex-1 py-3 text-sm font-medium transition-colors",
                filter === "all"
                  ? "text-primary-600 dark:text-primary-400 border-b-2 border-primary-500"
                  : "text-foreground-secondary hover:text-foreground"
              )}
            >
              전체
            </button>
            <button
              type="button"
              onClick={() => setFilter("unread")}
              className={cn(
                "flex-1 py-3 text-sm font-medium transition-colors",
                filter === "unread"
                  ? "text-primary-600 dark:text-primary-400 border-b-2 border-primary-500"
                  : "text-foreground-secondary hover:text-foreground"
              )}
            >
              읽지 않음
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto min-h-0">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                <div className="w-14 h-14 rounded-2xl bg-background-secondary flex items-center justify-center mb-4">
                  <AppIcon name="notification" className="w-7 h-7 text-foreground-muted" />
                </div>
                <p className="text-sm font-medium text-foreground mb-1">
                  {filter === "unread" ? "읽지 않은 알림이 없어요" : "알림이 없어요"}
                </p>
                <p className="text-xs text-foreground-muted">
                  {filter === "unread"
                    ? "모든 알림을 읽었어요."
                    : "새 매칭이나 마감 알림이 여기 표시돼요."}
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {filtered.map((item) => {
                  const config = TYPE_CONFIG[item.type];
                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => handleItemClick(item)}
                        className={cn(
                          "w-full flex items-start gap-3 px-5 py-4 text-left transition-colors hover:bg-background-secondary",
                          !item.read && "border-l-2 border-primary-500 bg-background-secondary"
                        )}
                      >
                        <div
                          className={cn(
                            "shrink-0 w-10 h-10 rounded-xl flex items-center justify-center",
                            item.read
                              ? "bg-background-secondary"
                              : "bg-primary-badge"
                          )}
                        >
                          <AppIcon
                            name={config.icon}
                            className={cn(
                              "w-5 h-5",
                              item.read ? "text-foreground-muted" : "text-primary-600 dark:text-primary-400"
                            )}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span
                              className={cn(
                                "text-sm font-medium",
                                !item.read ? "text-foreground" : "text-foreground-secondary"
                              )}
                            >
                              {item.title}
                            </span>
                            {!item.read && (
                              <span className="shrink-0 w-2 h-2 rounded-full bg-primary-500" />
                            )}
                          </div>
                          <p className="text-xs text-foreground-muted mt-0.5 line-clamp-2">
                            {item.body}
                          </p>
                          <p className="text-xs text-foreground-muted mt-1">{item.time}</p>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
