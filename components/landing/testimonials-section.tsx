"use client";

import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "김지현",
    role: "서울대학교 컴퓨터공학과",
    company: "네이버 합격",
    image: "/testimonials/user1.jpg",
    content:
      "막연하게 취업 준비를 하다가 CareerMap을 알게 됐어요. 내가 어떤 스킬이 부족한지, 무엇을 준비해야 하는지 명확하게 보여줘서 효율적으로 준비할 수 있었습니다.",
    rating: 5,
  },
  {
    name: "이준서",
    role: "연세대학교 경영학과",
    company: "삼성전자 합격",
    image: "/testimonials/user2.jpg",
    content:
      "스킬 갭 분석 기능이 정말 유용했어요. 다른 플랫폼에서는 그냥 채용 공고만 보여주는데, 여기는 내가 얼마나 적합한지, 뭘 더 준비해야 하는지 알려줘서 좋았습니다.",
    rating: 5,
  },
  {
    name: "박소연",
    role: "KAIST 전산학과",
    company: "카카오 합격",
    image: "/testimonials/user3.jpg",
    content:
      "이력서 최적화 기능으로 제 경험을 더 임팩트 있게 표현할 수 있었어요. 면접에서도 이력서 내용으로 질문이 많이 나왔는데, 자신있게 답변할 수 있었습니다.",
    rating: 5,
  },
  {
    name: "최민준",
    role: "고려대학교 산업공학과",
    company: "LG CNS 합격",
    image: "/testimonials/user4.jpg",
    content:
      "지원 현황 추적 기능과 AI 인사이트가 좋았어요. 어떤 회사에서 반응이 좋은지, 어떤 부분을 개선해야 하는지 데이터로 보여줘서 전략적으로 지원할 수 있었습니다.",
    rating: 5,
  },
];

const universities = [
  { name: "서울대학교", logo: "SNU" },
  { name: "연세대학교", logo: "연세" },
  { name: "고려대학교", logo: "고려" },
  { name: "KAIST", logo: "KAIST" },
  { name: "포항공대", logo: "POSTECH" },
  { name: "성균관대학교", logo: "성균관" },
];

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-20 lg:py-32 bg-background-secondary">
      <div className="container-app">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-warning-100 dark:bg-warning-900/30 text-warning-700 dark:text-warning-300 text-sm font-medium mb-4">
            성공 후기
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 text-balance">
            1,000명 이상이 취업에 성공했습니다
          </h2>
          <p className="text-lg text-foreground-secondary">
            CareerMap으로 목표 회사에 합격한 선배들의 이야기를 들어보세요.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.name}
              className="bg-card rounded-2xl p-6 lg:p-8 border border-border"
            >
              {/* Quote icon */}
              <Quote className="w-10 h-10 text-primary-200 dark:text-primary-800 mb-4" />

              {/* Content */}
              <p className="text-foreground leading-relaxed mb-6">
                "{testimonial.content}"
              </p>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-warning-400 text-warning-400"
                  />
                ))}
              </div>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-foreground">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-foreground-secondary">
                    {testimonial.role}
                  </div>
                  <div className="text-sm font-medium text-success-600 dark:text-success-400">
                    {testimonial.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* University Logos */}
        <div className="text-center">
          <p className="text-sm text-foreground-muted mb-6">
            전국 주요 대학 학생들이 이용하고 있습니다
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-12">
            {universities.map((uni) => (
              <div
                key={uni.name}
                className="text-xl font-bold text-foreground-muted/50 hover:text-foreground-secondary transition-colors"
              >
                {uni.logo}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
