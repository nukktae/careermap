"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { AppIcon } from "@/components/ui/app-icon";
import { SavedJobsProvider } from "@/lib/saved-jobs-context";
import { useAuth } from "@/lib/auth-context";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, User, LogOut } from "lucide-react";

const SIDEBAR_COLLAPSED_KEY = "careermap-sidebar-collapsed";

const navItems = [
  { href: "/dashboard", label: "홈", icon: "home" as const },
  { href: "/jobs", label: "채용", icon: "search" as const },
  { href: "/prepare", label: "준비", icon: "flag" as const },
  { href: "/track", label: "추적", icon: "clipboard-text" as const },
  { href: "/profile", label: "프로필", icon: "user" as const },
];

function getInitials(user: { user_metadata?: { full_name?: string }; email?: string } | null): string {
  if (!user) return "?";
  const name = user.user_metadata?.full_name?.trim();
  if (name) {
    const parts = name.split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  }
  if (user.email) return user.email.slice(0, 2).toUpperCase();
  return "?";
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      const search = pathname ? `?redirect=${encodeURIComponent(pathname)}` : "";
      router.replace(`/login${search}`);
    }
  }, [user, isLoading, pathname, router]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem(SIDEBAR_COLLAPSED_KEY);
      setSidebarCollapsed(stored === "true");
    } catch {
      // ignore
    }
  }, []);

  const toggleSidebar = () => {
    setSidebarCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

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

  // Sidebar: collapsed = w-16 (icons only), expanded = w-64 (icons + labels). Toggle persists in localStorage.
  return (
    <SavedJobsProvider>
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar - collapsible: 접기 (collapse) / 펼치기 (expand) via bottom button */}
      <aside
        className={`fixed left-0 top-0 bottom-0 bg-card border-r border-border hidden lg:flex flex-col z-40 transition-[width] duration-200 ease-in-out overflow-hidden ${sidebarCollapsed ? "w-16" : "w-64"}`}
        aria-expanded={!sidebarCollapsed}
      >
        {/* Logo */}
        <div className="h-16 flex items-center shrink-0 border-b border-border px-3">
          <Link
            href="/dashboard"
            className={`flex items-center gap-2 min-w-0 ${sidebarCollapsed ? "justify-center w-full" : "px-3"}`}
          >
            <Image
              src="/assets/logos/logojobja.jpg"
              alt="잡자"
              width={32}
              height={32}
              className="w-8 h-8 rounded-lg object-contain shrink-0"
            />
            {!sidebarCollapsed && (
              <span className="text-xl font-bold text-foreground truncate">
                잡자
              </span>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto overflow-x-hidden">
          {navItems.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                title={sidebarCollapsed ? item.label : undefined}
                className={`flex items-center rounded-lg transition-colors shrink-0 ${
                  sidebarCollapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2.5"
                } ${
                  isActive
                    ? "bg-primary-50 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400 font-medium"
                    : "text-foreground-secondary hover:bg-background-secondary hover:text-foreground"
                }`}
              >
                <AppIcon name={item.icon} className="w-5 h-5 shrink-0" />
                {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Collapse / Expand toggle */}
        <div className="shrink-0 p-2 border-t border-border">
          <button
            type="button"
            onClick={toggleSidebar}
            aria-expanded={!sidebarCollapsed}
            aria-label={sidebarCollapsed ? "사이드바 펼치기" : "사이드바 접기"}
            title={sidebarCollapsed ? "사이드바 펼치기" : "사이드바 접기"}
            className={`w-full flex items-center justify-center p-2 rounded-lg text-foreground-muted hover:text-foreground hover:bg-background-secondary transition-colors ${
              sidebarCollapsed ? "" : "gap-2"
            }`}
          >
            {sidebarCollapsed ? (
              <ChevronRight className="w-5 h-5 shrink-0" aria-hidden />
            ) : (
              <>
                <ChevronLeft className="w-5 h-5 shrink-0" aria-hidden />
                <span className="text-sm font-medium">접기</span>
              </>
            )}
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="fixed top-0 left-0 right-0 h-14 bg-card border-b border-border flex items-center justify-between px-4 lg:hidden z-50">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Image
            src="/assets/logos/logojobja.jpg"
            alt="잡자"
            width={32}
            height={32}
            className="w-8 h-8 rounded-lg object-contain"
          />
          <span className="text-lg font-bold text-foreground">잡자</span>
        </Link>
        <div className="flex items-center gap-2">
          <button
            className="p-2 text-foreground-secondary hover:text-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <AppIcon name="close" className="w-5 h-5" />
            ) : (
              <AppIcon name="menu" className="w-5 h-5" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="absolute top-14 right-0 w-64 bg-card border-l border-border h-[calc(100vh-3.5rem)] shadow-xl animate-slide-in-right">
            <nav className="py-4 px-3 space-y-1">
              {navItems.map((item) => {
                const isActive =
                  item.href === "/dashboard"
                    ? pathname === "/dashboard"
                    : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                      isActive
                        ? "bg-primary-50 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400 font-medium"
                        : "text-foreground-secondary hover:bg-background-secondary hover:text-foreground"
                    }`}
                  >
                    <AppIcon name={item.icon} className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              <div className="pt-4 border-t border-border mt-4">
                <Link
                  href="/settings"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-foreground-secondary hover:bg-background-secondary hover:text-foreground"
                >
                  <AppIcon name="setting" className="w-5 h-5" />
                  <span>설정</span>
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}

      {/* Desktop Top Bar */}
      <header
        className={`fixed top-0 right-0 h-16 bg-card/80 backdrop-blur-xl border-b border-border hidden lg:flex items-center justify-between px-6 z-30 transition-[left] duration-200 ease-in-out ${sidebarCollapsed ? "lg:left-16" : "lg:left-64"}`}
      >
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative">
            <AppIcon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
            <input
              type="text"
              placeholder="채용, 회사 검색..."
              className="w-64 h-10 pl-10 pr-4 rounded-lg bg-background-secondary border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/settings"
            className="p-2 text-foreground-secondary hover:text-foreground rounded-lg hover:bg-background-secondary"
          >
            <AppIcon name="setting" className="w-5 h-5" />
          </Link>
          <button
            type="button"
            onClick={() => setUserMenuOpen(true)}
            className="ml-2 w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold text-sm hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            aria-label="계정 메뉴"
          >
            {getInitials(user)}
          </button>
        </div>
      </header>

      {/* User account modal */}
      <Dialog open={userMenuOpen} onOpenChange={setUserMenuOpen}>
        <DialogContent className="sm:max-w-xs">
          <DialogHeader>
            <DialogTitle>계정</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-1 py-2">
            <Link
              href="/profile"
              onClick={() => setUserMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-foreground hover:bg-background-secondary transition-colors"
            >
              <User className="w-5 h-5 text-foreground-muted" />
              <span>프로필 보기</span>
            </Link>
            <button
              type="button"
              onClick={async () => {
                setUserMenuOpen(false);
                await signOut();
                router.push("/login");
              }}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-foreground hover:bg-background-secondary transition-colors text-left w-full"
            >
              <LogOut className="w-5 h-5 text-foreground-muted" />
              <span>로그아웃</span>
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-card border-t border-border flex items-center justify-around lg:hidden z-50 safe-bottom">
        {navItems.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 py-2 px-3 ${
                isActive
                  ? "text-primary-500"
                  : "text-foreground-muted"
              }`}
            >
              <AppIcon name={item.icon} className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Main Content */}
      <main
        className={`pt-14 lg:pt-16 pb-20 lg:pb-8 min-h-screen transition-[margin-left] duration-200 ease-in-out ${sidebarCollapsed ? "lg:ml-16" : "lg:ml-64"}`}
      >
        <div className="container-app py-6">{children}</div>
      </main>
    </div>
    </SavedJobsProvider>
  );
}
