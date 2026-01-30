"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const jobTabs = [
  { href: "/jobs", label: "채용 찾기" },
  { href: "/jobs/saved", label: "저장한 채용" },
];

export default function JobsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const showTabs =
    pathname === "/jobs" || pathname === "/jobs/saved";

  return (
    <div className="space-y-6">
      {showTabs && (
        <div className="flex gap-1 p-1 rounded-lg bg-background-secondary border border-border w-fit">
          {jobTabs.map((tab) => {
            const isActive =
              tab.href === "/jobs"
                ? pathname === "/jobs"
                : pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-card text-foreground shadow-sm border border-border"
                    : "text-foreground-secondary hover:text-foreground"
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
