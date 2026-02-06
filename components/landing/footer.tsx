import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer
      id="footer"
      className="py-8 bg-background-secondary border-t border-border"
    >
      <div className="container-app flex flex-col items-center gap-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold text-primary-500"
        >
          <Image
            src="/assets/logos/logojobja.jpg"
            alt="잡자"
            width={28}
            height={28}
            className="w-7 h-7 rounded-lg object-contain"
          />
          <span>잡자</span>
        </Link>
        <p className="text-sm text-foreground-muted">
          © 2026 잡자. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
