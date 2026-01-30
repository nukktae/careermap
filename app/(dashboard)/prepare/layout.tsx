"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const prepareTabs = [
  { href: "/prepare/skills", label: "스킬 갭" },
  { href: "/prepare/plan", label: "학습 플랜" },
  { href: "/prepare/resume", label: "이력서 최적화" },
  { href: "/prepare/preview", label: "이력서 미리보기" },
  { href: "/prepare/cover-letter", label: "자소서" },
  { href: "/prepare/interview", label: "면접 준비" },
];

export default function PrepareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const showTabs = pathname !== "/prepare" && pathname.startsWith("/prepare/");

  return (
    <div className="space-y-6">
      {showTabs && (
        <div className="flex flex-wrap gap-1 p-1 rounded-lg bg-background-secondary border border-border w-full overflow-x-auto">
          {prepareTabs.map((tab) => {
            const isActive = pathname === tab.href || pathname.startsWith(tab.href + "?");
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                  isActive
                    ? "bg-card text-foreground shadow-sm border border-border"
                    : "text-foreground-secondary hover:text-foreground hover:bg-background-tertiary"
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>
      )}
      {children}
    </div>
  );
}
