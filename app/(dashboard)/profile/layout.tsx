"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const profileTabs = [
  { href: "/profile", label: "프로필" },
  { href: "/profile/resume", label: "이력서" },
  { href: "/profile/preferences", label: "선호설정" },
];

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const showTabs = pathname?.startsWith("/profile") ?? false;

  return (
    <div className="space-y-6">
      {showTabs && (
        <div className="flex flex-wrap gap-1 p-1 rounded-lg bg-background-secondary border border-border w-full overflow-x-auto">
          {profileTabs.map((tab) => {
            const isActive =
              tab.href === "/profile"
                ? pathname === "/profile"
                : pathname === tab.href || pathname?.startsWith(tab.href + "/");
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
