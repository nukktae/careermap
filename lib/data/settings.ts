/**
 * Account, Billing, and Help settings.
 * Mock data; account/billing state can be persisted in localStorage for demo.
 */

export interface AccountSettings {
  email: string;
  has2FA: boolean;
  emailNotif: boolean;
  pushNotif: boolean;
}

export interface UsageStats {
  jobMatchesUsed: number;
  jobMatchesLimit: number;
  resumeOptsUsed: number;
  resumeOptsLimit: number;
}

export interface BillingInfo {
  plan: "free" | "premium";
  usageStats: UsageStats;
  nextBillingDate?: number;
  paymentMethod?: string;
  invoices: { id: string; date: number; amount: number; status: string }[];
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const ACCOUNT_STORAGE_KEY = "careermap-account-settings";
const BILLING_STORAGE_KEY = "careermap-billing";

const SEED_ACCOUNT: AccountSettings = {
  email: "minjun.kim@example.com",
  has2FA: false,
  emailNotif: true,
  pushNotif: true,
};

const SEED_BILLING: BillingInfo = {
  plan: "free",
  usageStats: {
    jobMatchesUsed: 15,
    jobMatchesLimit: 20,
    resumeOptsUsed: 1,
    resumeOptsLimit: 1,
  },
  invoices: [
    { id: "inv-1", date: Date.now() - 30 * 86400000, amount: 0, status: "결제 완료" },
    { id: "inv-2", date: Date.now() - 60 * 86400000, amount: 0, status: "결제 완료" },
  ],
};

const SEED_BILLING_PREMIUM: BillingInfo = {
  plan: "premium",
  usageStats: {
    jobMatchesUsed: 120,
    jobMatchesLimit: 999,
    resumeOptsUsed: 15,
    resumeOptsLimit: 999,
  },
  nextBillingDate: Date.now() + 30 * 86400000,
  paymentMethod: "카드 ****1234",
  invoices: [
    { id: "inv-p1", date: Date.now() - 5 * 86400000, amount: 14900, status: "결제 완료" },
    { id: "inv-p2", date: Date.now() - 35 * 86400000, amount: 14900, status: "결제 완료" },
    { id: "inv-p3", date: Date.now() - 65 * 86400000, amount: 14900, status: "결제 완료" },
  ],
};

const FAQ_MOCK: FAQItem[] = [
  {
    id: "faq-1",
    question: "회원 탈퇴는 어떻게 하나요?",
    answer:
      "설정 > 계정 설정에서 '계정 삭제'를 선택하시면 됩니다. 삭제 후 30일 이내에 재가입 시 기존 데이터는 복구되지 않습니다.",
  },
  {
    id: "faq-2",
    question: "이력서 최적화 사용 횟수는 어떻게 되나요?",
    answer:
      "무료 플랜은 월 1회, 프리미엄 플랜은 무제한입니다. 사용량은 설정 > 결제에서 확인할 수 있습니다.",
  },
  {
    id: "faq-3",
    question: "결제를 취소하고 싶어요.",
    answer:
      "설정 > 결제에서 '구독 취소'를 누르시면 다음 결제일부터 무료 플랜으로 전환됩니다. 이미 결제된 기간은 환불되지 않습니다.",
  },
  {
    id: "faq-4",
    question: "채용 매칭 점수는 어떻게 계산되나요?",
    answer:
      "프로필의 학력, 스킬, 경력, 프로젝트를 채용 공고 요구사항과 비교해 산정합니다. 직무별로 가중치가 다를 수 있습니다.",
  },
  {
    id: "faq-5",
    question: "이메일 알림을 끄고 싶어요.",
    answer:
      "설정 > 계정 설정 또는 프로필 > 선호설정에서 알림 옵션을 변경할 수 있습니다.",
  },
];

function loadAccount(): AccountSettings {
  if (typeof window === "undefined") return { ...SEED_ACCOUNT };
  try {
    const raw = localStorage.getItem(ACCOUNT_STORAGE_KEY);
    if (!raw) return { ...SEED_ACCOUNT };
    return { ...SEED_ACCOUNT, ...JSON.parse(raw) };
  } catch {
    return { ...SEED_ACCOUNT };
  }
}

function saveAccount(settings: AccountSettings): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(ACCOUNT_STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // ignore
  }
}

function loadBilling(): BillingInfo {
  if (typeof window === "undefined") return { ...SEED_BILLING };
  try {
    const raw = localStorage.getItem(BILLING_STORAGE_KEY);
    if (!raw) return { ...SEED_BILLING };
    const parsed = JSON.parse(raw) as BillingInfo;
    return { ...SEED_BILLING, ...parsed, usageStats: { ...SEED_BILLING.usageStats, ...parsed.usageStats }, invoices: parsed.invoices ?? SEED_BILLING.invoices };
  } catch {
    return { ...SEED_BILLING };
  }
}

function saveBilling(info: BillingInfo): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(BILLING_STORAGE_KEY, JSON.stringify(info));
  } catch {
    // ignore
  }
}

export function getAccountSettings(): AccountSettings {
  return { ...loadAccount() };
}

export function updateAccountSettings(patch: Partial<AccountSettings>): void {
  const current = loadAccount();
  const next: AccountSettings = { ...current, ...patch };
  saveAccount(next);
}

export function getBillingInfo(): BillingInfo {
  return loadBilling();
}

export function setBillingPlan(plan: "free" | "premium"): void {
  const current = loadBilling();
  const base = plan === "premium" ? SEED_BILLING_PREMIUM : SEED_BILLING;
  saveBilling({
    ...base,
    plan,
    usageStats: current.usageStats,
    invoices: current.invoices?.length ? current.invoices : base.invoices,
  });
}

export function getHelpFAQ(): FAQItem[] {
  return [...FAQ_MOCK];
}

export function getHelpContact(): { email: string; placeholder: string } {
  return {
    email: "support@careermap.kr",
    placeholder: "문의 내용을 입력해 주세요.",
  };
}
