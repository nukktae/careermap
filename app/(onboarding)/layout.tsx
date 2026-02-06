"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth-context";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      const search = pathname ? `?redirect=${encodeURIComponent(pathname)}` : "";
      router.replace(`/login${search}`);
    }
  }, [user, isLoading, pathname, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-foreground-secondary">
            {isLoading ? "로딩 중..." : "로그인 페이지로 이동합니다."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container-app">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/assets/logos/logojobja.jpg"
                alt="잡자"
                width={32}
                height={32}
                className="w-8 h-8 rounded-lg object-contain"
              />
              <span className="text-xl font-bold text-foreground">잡자</span>
            </Link>

            <Link
              href="/dashboard"
              className="text-sm text-foreground-secondary hover:text-foreground"
            >
              건너뛰기
            </Link>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="pt-16">{children}</main>
    </div>
  );
}
