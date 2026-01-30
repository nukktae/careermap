"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const trackTabs = [
  { href: "/track", label: "지원 현황" },
  { href: "/track/insights", label: "인사이트" },
];

export default function TrackLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const showTabs =
    pathname === "/track" ||
    pathname === "/track/insights";

  return (
    <div className="space-y-6">
      {showTabs && (
        <div className="flex gap-1 p-1 rounded-lg bg-background-secondary border border-border w-fit overflow-x-auto">
          {trackTabs.map((tab) => {
            const isActive =
              tab.href === "/track"
                ? pathname === "/track"
                : pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
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
