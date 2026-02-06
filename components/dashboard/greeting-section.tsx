"use client";

import type { DashboardUser } from "@/lib/data/dashboard";

interface GreetingSectionProps {
  user: DashboardUser;
}

export function GreetingSection({ user }: GreetingSectionProps) {
  return (
    <section
      id="greeting-section"
      className="flex flex-col gap-1"
      aria-label="환영 메시지"
    >
      <h1 className="text-3xl font-bold text-foreground">
        안녕하세요, {user.name}님! 👋
      </h1>
      <p className="text-lg text-foreground-secondary">
        오늘{" "}
        <span className="text-primary-600 dark:text-primary-400 font-bold">
          {user.newMatchesCount}개
        </span>
        의 새로운 매칭이 있어요. 확인해보시겠어요?
      </p>
    </section>
  );
}
