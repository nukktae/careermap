"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const settingsTabs = [
  { href: "/settings", label: "계정 설정" },
  { href: "/settings/billing", label: "결제" },
  { href: "/settings/help", label: "고객센터" },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const showTabs = pathname?.startsWith("/settings") ?? false;

  return (
    <div className="space-y-6">
      {showTabs && (
        <div className="flex flex-wrap gap-1 p-1 rounded-lg bg-background-secondary border border-border w-full overflow-x-auto">
          {settingsTabs.map((tab) => {
            const isActive =
              tab.href === "/settings"
                ? pathname === "/settings"
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
