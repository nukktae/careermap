import Link from "next/link";
import Image from "next/image";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
