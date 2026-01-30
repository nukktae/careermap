"use client";

import Link from "next/link";
import { AppIcon } from "@/components/ui/app-icon";
import type { AppIconName } from "@/components/ui/app-icon";

export interface PrepareToolCardProps {
  href: string;
  icon: AppIconName;
  title: string;
  description: string;
  premium?: boolean;
}

export function PrepareToolCard({
  href,
  icon,
  title,
  description,
  premium = false,
}: PrepareToolCardProps) {
  return (
    <Link
      href={href}
      className="bg-card rounded-xl border border-border p-6 hover:border-primary-200 dark:hover:border-primary-800 hover:shadow-md transition-all group block relative"
    >
      {premium && (
        <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-xs font-medium bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400">
          프리미엄
        </span>
      )}
      <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-950/30 flex items-center justify-center text-primary-500 mb-4 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/50 transition-colors">
        <AppIcon name={icon} className="w-6 h-6" />
      </div>
      <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
        {title}
      </h3>
      <p className="text-sm text-foreground-secondary">{description}</p>
    </Link>
  );
}
