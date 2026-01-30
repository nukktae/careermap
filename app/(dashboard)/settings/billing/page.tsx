"use client";

import { useState, useEffect } from "react";
import { CreditCard, Download, Crown, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getBillingInfo,
  setBillingPlan,
} from "@/lib/data/settings";

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatCurrency(amount: number): string {
  if (amount === 0) return "무료";
  return `₩${amount.toLocaleString()}`;
}

export default function BillingPage() {
  const [mounted, setMounted] = useState(false);
  const [billing, setBilling] = useState<ReturnType<typeof getBillingInfo> | null>(null);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) setBilling(getBillingInfo());
  }, [mounted]);

  const handleUpgrade = () => {
    setBillingPlan("premium");
    setBilling(getBillingInfo());
  };

  const handleCancelSubscription = () => {
    setBillingPlan("free");
    setBilling(getBillingInfo());
    setCancelModalOpen(false);
  };

  const handleDownloadInvoice = (id: string, date: number, amount: number) => {
    const blob = new Blob(
      [`영수증 ${id}\n날짜: ${formatDate(date)}\n금액: ${formatCurrency(amount)}`],
      { type: "text/plain;charset=utf-8" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `영수증_${id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!mounted || !billing) {
    return (
      <div className="container-app py-12 text-center text-foreground-secondary">
        로딩 중…
      </div>
    );
  }

  const isPremium = billing.plan === "premium";

  return (
    <div className="container-app space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-foreground">결제</h1>
        <p className="text-foreground-secondary mt-1">
          구독 플랜과 결제 내역을 확인하세요.
        </p>
      </div>

      {/* Plan */}
      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Crown className="w-5 h-5" />
          현재 플랜
        </h2>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xl font-bold text-foreground">
              {isPremium ? "프리미엄" : "무료"}
            </p>
            {isPremium && (
              <p className="text-sm text-foreground-secondary mt-1">
                ₩14,900/월
              </p>
            )}
          </div>
          {!isPremium && (
            <Button className="rounded-xl" onClick={handleUpgrade}>
              <Zap className="w-4 h-4 mr-2" />
              업그레이드
            </Button>
          )}
        </div>
      </section>

      {/* Usage (Free) or Next billing (Premium) */}
      {!isPremium && (
        <section className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            이번 달 사용량
          </h2>
          <ul className="space-y-2 text-foreground-secondary">
            <li>
              채용 매칭: {billing.usageStats.jobMatchesUsed} /{" "}
              {billing.usageStats.jobMatchesLimit}
            </li>
            <li>
              이력서 최적화: {billing.usageStats.resumeOptsUsed} /{" "}
              {billing.usageStats.resumeOptsLimit}
            </li>
          </ul>
        </section>
      )}

      {isPremium && (
        <>
          {billing.nextBillingDate && (
            <section className="rounded-xl border border-border bg-card p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                다음 결제일
              </h2>
              <p className="text-foreground-secondary">
                {formatDate(billing.nextBillingDate)}
              </p>
            </section>
          )}

          {billing.paymentMethod && (
            <section className="rounded-xl border border-border bg-card p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                결제 수단
              </h2>
              <p className="text-foreground-secondary mb-2">
                {billing.paymentMethod}
              </p>
              <Button variant="outline" size="sm" className="rounded-xl">
                결제 수단 변경
              </Button>
            </section>
          )}

          <section className="rounded-xl border border-border bg-card p-6">
            <Button
              variant="outline"
              className="rounded-xl border-warning-300 text-warning-600 hover:bg-warning-50 dark:border-warning-800 dark:text-warning-400 dark:hover:bg-warning-950/30"
              onClick={() => setCancelModalOpen(true)}
            >
              구독 취소
            </Button>
          </section>
        </>
      )}

      {/* Billing history */}
      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          결제 내역
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-foreground-muted">
                <th className="py-3 font-medium">날짜</th>
                <th className="py-3 font-medium">금액</th>
                <th className="py-3 font-medium">상태</th>
                <th className="py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {billing.invoices.map((inv) => (
                <tr key={inv.id} className="border-b border-border last:border-0">
                  <td className="py-3 text-foreground">{formatDate(inv.date)}</td>
                  <td className="py-3 text-foreground">
                    {formatCurrency(inv.amount)}
                  </td>
                  <td className="py-3 text-foreground-secondary">{inv.status}</td>
                  <td className="py-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-lg text-primary-600 dark:text-primary-400"
                      onClick={() =>
                        handleDownloadInvoice(inv.id, inv.date, inv.amount)
                      }
                    >
                      <Download className="w-4 h-4 mr-1" />
                      다운로드
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Cancel confirmation modal */}
      {cancelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="rounded-2xl border bg-card p-6 max-w-md w-full shadow-lg">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              구독 취소
            </h3>
            <p className="text-sm text-foreground-secondary mb-4">
              다음 결제일부터 무료 플랜으로 전환됩니다. 이미 결제된 기간은
              환불되지 않습니다.
            </p>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                className="rounded-xl"
                onClick={() => setCancelModalOpen(false)}
              >
                유지
              </Button>
              <Button
                variant="outline"
                className="rounded-xl border-error-300 text-error-600 hover:bg-error-50 dark:border-error-800 dark:text-error-400"
                onClick={handleCancelSubscription}
              >
                구독 취소
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
