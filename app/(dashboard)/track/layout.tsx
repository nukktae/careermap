"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const trackTabs = [
  { href: "/track", label: "지원 현황" },
  { href: "/track/insights", label: "인사이트" },
];

function getPageTitle(pathname: string): string {
  if (pathname === "/track/insights") return "인사이트";
  return "지원 현황";
}

export default function TrackLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const showHeader =
    pathname === "/track" || pathname === "/track/insights";
  const pageTitle = getPageTitle(pathname);

  return (
    <div className="space-y-0">
      {showHeader && (
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between mb-6">
          <h1 className="text-2xl font-bold text-foreground">
            {pageTitle}
          </h1>
          <div className="flex rounded-lg bg-background-secondary p-1 w-fit">
            {trackTabs.map((tab) => {
              const isActive =
                tab.href === "/track"
                  ? pathname === "/track"
                  : pathname === tab.href;
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`px-6 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
                    isActive
                      ? "bg-card text-foreground font-semibold shadow-sm border border-border"
                      : "text-foreground-secondary hover:text-foreground"
                  }`}
                >
                  {tab.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
      {children}
    </div>
  );
}
