"use client";

import { useState, useEffect } from "react";
import { HelpCircle, Video, Mail, Lightbulb, Bug } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ChevronDown, ChevronUp } from "lucide-react";
import { getHelpFAQ, getHelpContact } from "@/lib/data/settings";

const TUTORIALS = [
  { title: "첫 채용 매칭하기", href: "#" },
  { title: "이력서 최적화 사용법", href: "#" },
  { title: "지원 현황 관리하기", href: "#" },
];

export default function HelpPage() {
  const [mounted, setMounted] = useState(false);
  const [faq, setFaq] = useState<ReturnType<typeof getHelpFAQ>>([]);
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(null);
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [contactSubmitted, setContactSubmitted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) setFaq(getHelpFAQ());
  }, [mounted]);

  const contact = mounted ? getHelpContact() : { email: "", placeholder: "" };

  const toggleFaq = (id: string) => {
    setExpandedFaqId((prev) => (prev === id ? null : id));
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactEmail.trim() || !contactMessage.trim()) return;
    setContactSubmitted(true);
    setContactEmail("");
    setContactMessage("");
  };

  if (!mounted) {
    return (
      <div className="container-app py-12 text-center text-foreground-secondary">
        로딩 중…
      </div>
    );
  }

  return (
    <div className="container-app space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-foreground">고객센터</h1>
        <p className="text-foreground-secondary mt-1">
          자주 묻는 질문, 튜토리얼, 문의하기를 확인하세요.
        </p>
      </div>

      {/* FAQ */}
      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <HelpCircle className="w-5 h-5" />
          자주 묻는 질문
        </h2>
        <ul className="space-y-0">
          {faq.map((item) => (
            <li key={item.id} className="border-b border-border last:border-0">
              <button
                type="button"
                className="w-full flex items-center justify-between p-4 hover:bg-background-secondary transition-colors text-left"
                onClick={() => toggleFaq(item.id)}
              >
                <span className="font-medium text-foreground pr-4">
                  {item.question}
                </span>
                {expandedFaqId === item.id ? (
                  <ChevronUp className="w-5 h-5 text-foreground-muted shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-foreground-muted shrink-0" />
                )}
              </button>
              {expandedFaqId === item.id && (
                <div className="px-4 pb-4 text-sm text-foreground-secondary">
                  {item.answer}
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>

      {/* Tutorials */}
      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Video className="w-5 h-5" />
          동영상 튜토리얼
        </h2>
        <ul className="space-y-2">
          {TUTORIALS.map((t) => (
            <li key={t.title}>
              <a
                href={t.href}
                className="text-primary-600 dark:text-primary-400 hover:underline font-medium"
              >
                {t.title}
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* Contact */}
      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Mail className="w-5 h-5" />
          문의하기
        </h2>
        {contactSubmitted ? (
          <p className="text-success-600 dark:text-success-400 font-medium">
            문의가 접수되었습니다. 빠른 시일 내에 답변 드리겠습니다.
          </p>
        ) : (
          <form onSubmit={handleContactSubmit} className="space-y-4 max-w-md">
            <div className="space-y-2">
              <Label htmlFor="contact-email">이메일</Label>
              <Input
                id="contact-email"
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder={contact.email}
                className="rounded-xl"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-message">메시지</Label>
              <Textarea
                id="contact-message"
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                placeholder={contact.placeholder}
                className="rounded-xl min-h-[120px]"
                required
              />
            </div>
            <Button type="submit" className="rounded-xl">
              문의 보내기
            </Button>
          </form>
        )}
      </section>

      {/* Feature request & Report bug */}
      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          더 도와드릴까요?
        </h2>
        <div className="flex flex-wrap gap-4">
          <a
            href={`mailto:${contact.email}?subject=기능 제안`}
            className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:underline font-medium"
          >
            <Lightbulb className="w-4 h-4" />
            기능 제안
          </a>
          <a
            href={`mailto:${contact.email}?subject=버그 신고`}
            className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:underline font-medium"
          >
            <Bug className="w-4 h-4" />
            버그 신고
          </a>
        </div>
      </section>
    </div>
  );
}
