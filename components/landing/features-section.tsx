"use client";

import Image from "next/image";
import {
  Target,
  BarChart3,
  FileText,
  LayoutGrid,
  Lightbulb,
} from "lucide-react";

const FEATURE_IMAGES = {
  matching:
    "https://gmcnqdpighpxhzpesqwf.supabase.co/storage/v1/object/public/generated-images/image-cc794f12-fe14-4cbf-a86c-4de21e53c06f.jpg",
  skillgap:
    "https://gmcnqdpighpxhzpesqwf.supabase.co/storage/v1/object/public/generated-images/image-73865d3c-fda0-4240-9691-5150016313f5.jpg",
  optimize:
    "https://gmcnqdpighpxhzpesqwf.supabase.co/storage/v1/object/public/generated-images/image-952268f7-68dd-434b-9896-63218a2f724c.jpg",
  tracking:
    "https://gmcnqdpighpxhzpesqwf.supabase.co/storage/v1/object/public/generated-images/image-aa9bbc7e-6689-4764-bf3b-d92165d4ae4e.jpg",
  guide:
    "https://gmcnqdpighpxhzpesqwf.supabase.co/storage/v1/object/public/generated-images/image-d7c58bb4-c49f-4e61-8738-88a51146cd8b.jpg",
} as const;

type FeatureItem = {
  id: string;
  icon: typeof Target;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  wide?: boolean;
};

const features: FeatureItem[] = [
  {
    id: "matching",
    icon: Target,
    title: "AI 매칭 점수",
    description:
      "내 이력서와 채용 공고의 적합도를 정량화된 점수로 확인하세요. 어디에 지원해야 할지 더 이상 고민하지 않아도 됩니다.",
    image: FEATURE_IMAGES.matching,
    imageAlt:
      "Data visualization showing a high matching score between a resume and a job description with circular progress bar",
  },
  {
    id: "skillgap",
    icon: BarChart3,
    title: "스킬 갭 분석",
    description:
      "목표 직무에서 요구하는 역량과 현재 나의 보유 기술을 비교하여, 지금 당장 보완이 필요한 핵심 스킬을 알려드립니다.",
    image: FEATURE_IMAGES.skillgap,
    imageAlt:
      "Comparison chart showing current skills vs required skills for a software engineer role",
  },
  {
    id: "optimize",
    icon: FileText,
    title: "이력서 최적화",
    description:
      "특정 직무에 맞춰 AI가 이력서 내용을 재구성합니다. 키워드 정렬과 문구 강화로 서류 합격률을 극대화하세요.",
    image: FEATURE_IMAGES.optimize,
    imageAlt:
      "AI interface highlighting and rewriting resume bullet points for better impact",
  },
  {
    id: "tracking",
    icon: LayoutGrid,
    title: "지원 현황 추적",
    description:
      "칸반 보드 형식으로 모든 지원 상태를 한눈에 관리하세요. AI가 각 단계별 개선점과 패턴을 분석하여 전략적인 지원을 돕습니다.",
    image: FEATURE_IMAGES.tracking,
    imageAlt:
      "Kanban board showing job application stages: applied, interview, offer",
    wide: true,
  },
  {
    id: "guide",
    icon: Lightbulb,
    title: "자소서 & 면접 가이드",
    description:
      "기업별 맞춤 자소서 팁과 예상 면접 질문을 제공합니다. 한국 채용 시장에 특화된 실전 가이드로 자신감을 얻으세요.",
    image: FEATURE_IMAGES.guide,
    imageAlt:
      "A dashboard showing company-specific interview tips and common questions",
  },
];

function FeatureCard({ feature }: { feature: FeatureItem }) {
  const Icon = feature.icon;
  const isWide = feature.wide;

  if (isWide) {
    return (
      <div
        id={`feature-${feature.id}`}
        className="col-span-2 p-10 bg-background-secondary rounded-[32px] flex flex-col md:flex-row items-center gap-10 border border-transparent hover:border-primary-200 hover:bg-card hover:shadow-2xl hover:shadow-primary-100/50 dark:hover:border-primary-800 dark:hover:shadow-primary-900/20 transition-all duration-300 group"
      >
        <div className="flex-1 w-full">
          <div className="w-14 h-14 bg-card rounded-2xl flex items-center justify-center shadow-sm mb-8 group-hover:bg-primary-500 group-hover:text-white transition-colors">
            <Icon className="w-7 h-7 text-primary-600 dark:text-primary-400 group-hover:text-white" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-4">
            {feature.title}
          </h3>
          <p className="text-foreground-secondary leading-relaxed">
            {feature.description}
          </p>
        </div>
        <div className="flex-1 w-full relative h-64 rounded-2xl shadow-lg overflow-hidden">
          <Image
            src={feature.image}
            alt={feature.imageAlt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      </div>
    );
  }

  return (
    <div
      id={`feature-${feature.id}`}
      className="p-10 bg-background-secondary rounded-[32px] border border-transparent hover:border-primary-200 hover:bg-card hover:shadow-2xl hover:shadow-primary-100/50 dark:hover:border-primary-800 dark:hover:shadow-primary-900/20 transition-all duration-300 group"
    >
      <div className="w-14 h-14 bg-card rounded-2xl flex items-center justify-center shadow-sm mb-8 group-hover:bg-primary-500 group-hover:text-white transition-colors">
        <Icon className="w-7 h-7 text-primary-600 dark:text-primary-400 group-hover:text-white" />
      </div>
      <h3 className="text-xl font-bold text-foreground mb-4">{feature.title}</h3>
      <p className="text-foreground-secondary leading-relaxed mb-6">
        {feature.description}
      </p>
      <div className="relative w-full h-48 rounded-xl overflow-hidden">
        <Image
          src={feature.image}
          alt={feature.imageAlt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
    </div>
  );
}

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-background">
      <div className="container-app">
        <div className="text-center mb-20">
          <span className="inline-block px-4 py-1.5 bg-primary-50 text-primary-600 dark:bg-primary-badge dark:text-primary-badge-text text-xs font-bold rounded-full mb-4">
            FEATURES
          </span>
          <h2 className="text-4xl font-bold text-foreground mb-6 tracking-tight">
            취업 준비의 모든 것을 한 곳에서
          </h2>
          <p className="text-xl text-foreground-secondary max-w-2xl mx-auto leading-relaxed">
            데이터에 기반한 취업 준비로 막연함을 확신으로 바꾸세요.
            <br className="hidden sm:block" />
            복잡한 분석은 AI에게 맡기고, 당신은 실행에만 집중하세요.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.id}
              className={feature.wide ? "md:col-span-2" : undefined}
            >
              <FeatureCard feature={feature} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
