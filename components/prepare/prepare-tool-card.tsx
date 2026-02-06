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
  locked?: boolean;
  onLockedClick?: () => void;
}

export function PrepareToolCard({
  href,
  icon,
  title,
  description,
  premium = false,
  locked = false,
  onLockedClick,
}: PrepareToolCardProps) {
  const cardContent = (
    <>
      {(premium || locked) && (
        <span className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-primary-badge text-primary-badge-text">
          {locked ? (
            <>
              <LockIcon className="w-3.5 h-3.5" />
              잠김
            </>
          ) : (
            "프리미엄"
          )}
        </span>
      )}
      <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-950/30 flex items-center justify-center text-primary-500 mb-4 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/50 transition-colors">
        <AppIcon name={icon} className="w-6 h-6" />
      </div>
      <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
        {title}
      </h3>
      <p className="text-sm text-foreground-secondary">{description}</p>
    </>
  );

  const baseClass =
    "bg-card rounded-xl border border-border p-6 transition-all group block relative";

  if (locked) {
    return (
      <button
        type="button"
        onClick={onLockedClick}
        className={`${baseClass} opacity-90 border-dashed cursor-pointer text-left hover:border-primary-300 dark:hover:border-primary-700 hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2`}
        aria-label={`${title} (구독 후 이용 가능)`}
      >
        {cardContent}
      </button>
    );
  }

  return (
    <Link
      href={href}
      className={`${baseClass} hover:border-primary-200 dark:hover:border-primary-800 hover:shadow-md`}
    >
      {cardContent}
    </Link>
  );
}

function LockIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
      />
    </svg>
  );
}
