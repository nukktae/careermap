import Link from "next/link";
import { Suspense } from "react";
import { PrepareTabs } from "./prepare-tabs";

const prepareTabs = [
  { href: "/prepare/skills", label: "스킬 갭" },
  { href: "/prepare/resume", label: "이력서 최적화" },
  { href: "/prepare/preview", label: "이력서 미리보기" },
  { href: "/prepare/cover-letter", label: "자소서" },
  { href: "/prepare/interview", label: "면접 준비" },
];

function PrepareTabsFallback() {
  return null;
}

export default function PrepareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      <Suspense fallback={<PrepareTabsFallback />}>
        <PrepareTabs />
      </Suspense>
      {children}
    </div>
  );
}
