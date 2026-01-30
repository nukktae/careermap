"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Download,
  Copy,
  RefreshCw,
  Lightbulb,
  Target,
  TrendingUp,
  Zap,
  Eye,
  Edit3,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";

const resumeAnalysis = {
  overallScore: 78,
  sections: [
    { name: "경력 설명", score: 85, status: "good" },
    { name: "프로젝트 성과", score: 72, status: "moderate" },
    { name: "기술 스택", score: 90, status: "good" },
    { name: "자기소개", score: 65, status: "needs-work" },
    { name: "수치화된 성과", score: 58, status: "needs-work" },
  ],
  improvements: [
    {
      id: 1,
      type: "critical",
      title: "성과를 수치로 표현하세요",
      description:
        '\"매출 증가에 기여\"보다 \"전년 대비 매출 23% 증가 달성\"이 더 설득력 있습니다.',
      before: "서비스 성능 개선에 기여했습니다.",
      after: "API 응답 시간을 평균 2.3초에서 0.8초로 65% 개선했습니다.",
    },
    {
      id: 2,
      type: "high",
      title: "STAR 기법을 활용하세요",
      description:
        "상황(Situation)-과제(Task)-행동(Action)-결과(Result) 구조로 경험을 정리하세요.",
      before: "React 프로젝트를 진행했습니다.",
      after:
        "레거시 jQuery 코드베이스(S)를 React로 마이그레이션하는 프로젝트를 리드(T)하여, 컴포넌트 기반 아키텍처를 설계하고 팀원들을 코칭(A)한 결과, 개발 생산성 40% 향상 및 버그 발생률 60% 감소(R)를 달성했습니다.",
    },
    {
      id: 3,
      type: "medium",
      title: "키워드 최적화",
      description:
        "목표 회사의 채용 공고에서 자주 등장하는 키워드를 포함하세요.",
      keywords: ["TypeScript", "테스트 코드", "협업", "문서화", "성능 최적화"],
    },
  ],
};

const coverLetterSuggestions = [
  {
    section: "지원 동기",
    score: 72,
    feedback:
      "회사에 대한 구체적인 이해를 보여주세요. 회사의 최근 프로젝트나 기술 블로그를 언급하면 좋습니다.",
    suggestion:
      "네이버 파이낸셜의 '마이데이터 서비스' 출시 이후 사용자 경험 개선에 대한 기술 블로그를 읽으며, 사용자 중심의 금융 서비스를 만들어가는 비전에 깊이 공감했습니다.",
  },
  {
    section: "역량 어필",
    score: 68,
    feedback:
      "구체적인 수치와 함께 역량을 증명하세요. 단순히 '잘한다'보다 '어떻게, 얼마나'가 중요합니다.",
    suggestion:
      "최근 프로젝트에서 웹 성능 최적화를 담당하여 Lighthouse 점수를 45점에서 92점으로 개선했으며, 이 과정에서 코드 스플리팅, 이미지 최적화, 캐싱 전략 등의 기술을 활용했습니다.",
  },
  {
    section: "성장 가능성",
    score: 85,
    feedback: "좋습니다! 구체적인 학습 계획과 목표가 잘 드러나 있습니다.",
    suggestion: null,
  },
];

function getScoreColor(score: number) {
  if (score >= 80) return "text-green-600";
  if (score >= 60) return "text-amber-600";
  return "text-red-600";
}

function getScoreBg(score: number) {
  if (score >= 80) return "bg-green-100";
  if (score >= 60) return "bg-amber-100";
  return "bg-red-100";
}

export default function ResumeOptimizerPage() {
  const [activeTab, setActiveTab] = useState("analysis");
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [selectedImprovement, setSelectedImprovement] = useState<number | null>(
    null
  );

  const handleOptimize = () => {
    setIsOptimizing(true);
    setTimeout(() => setIsOptimizing(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Link href="/prepare">
          <Button variant="ghost" size="icon" className="rounded-xl">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight">이력서 최적화</h1>
          <p className="text-muted-foreground">
            AI가 분석하고 개선점을 제안합니다
          </p>
        </div>
        <Button className="rounded-xl" onClick={handleOptimize}>
          {isOptimizing ? (
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4 mr-2" />
          )}
          다시 분석
        </Button>
      </div>

      {/* Score Overview */}
      <Card className="border-0 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div
                className={`w-20 h-20 rounded-2xl ${getScoreBg(resumeAnalysis.overallScore)} flex items-center justify-center`}
              >
                <span
                  className={`text-3xl font-bold ${getScoreColor(resumeAnalysis.overallScore)}`}
                >
                  {resumeAnalysis.overallScore}
                </span>
              </div>
              <div>
                <h2 className="text-xl font-semibold">이력서 완성도</h2>
                <p className="text-muted-foreground mt-1">
                  3가지 개선사항을 반영하면 예상 점수:{" "}
                  <span className="font-semibold text-green-600">92점</span>
                </p>
              </div>
            </div>
            <div className="hidden md:flex gap-2">
              <Button variant="outline" className="rounded-xl">
                <Eye className="w-4 h-4 mr-2" />
                미리보기
              </Button>
              <Button variant="outline" className="rounded-xl">
                <Download className="w-4 h-4 mr-2" />
                다운로드
              </Button>
            </div>
          </div>
        </div>

        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {resumeAnalysis.sections.map((section) => (
              <div key={section.name} className="text-center">
                <div
                  className={`w-12 h-12 rounded-xl mx-auto mb-2 flex items-center justify-center ${getScoreBg(section.score)}`}
                >
                  <span
                    className={`text-lg font-bold ${getScoreColor(section.score)}`}
                  >
                    {section.score}
                  </span>
                </div>
                <p className="text-sm font-medium">{section.name}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="w-full justify-start bg-muted/50 p-1 rounded-2xl">
          <TabsTrigger
            value="analysis"
            className="rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm px-6"
          >
            <Lightbulb className="w-4 h-4 mr-2" />
            개선 제안
          </TabsTrigger>
          <TabsTrigger
            value="cover-letter"
            className="rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm px-6"
          >
            <FileText className="w-4 h-4 mr-2" />
            자기소개서
          </TabsTrigger>
          <TabsTrigger
            value="editor"
            className="rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm px-6"
          >
            <Edit3 className="w-4 h-4 mr-2" />
            편집하기
          </TabsTrigger>
        </TabsList>

        {/* Analysis Tab */}
        <TabsContent value="analysis" className="space-y-4 mt-0">
          {resumeAnalysis.improvements.map((improvement, index) => (
            <motion.div
              key={improvement.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className={`border-0 shadow-sm cursor-pointer transition-all ${
                  selectedImprovement === improvement.id
                    ? "ring-2 ring-primary"
                    : "hover:shadow-md"
                }`}
                onClick={() =>
                  setSelectedImprovement(
                    selectedImprovement === improvement.id
                      ? null
                      : improvement.id
                  )
                }
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        improvement.type === "critical"
                          ? "bg-red-100"
                          : improvement.type === "high"
                            ? "bg-amber-100"
                            : "bg-blue-100"
                      }`}
                    >
                      {improvement.type === "critical" ? (
                        <AlertCircle className="w-5 h-5 text-red-600" />
                      ) : improvement.type === "high" ? (
                        <Zap className="w-5 h-5 text-amber-600" />
                      ) : (
                        <Lightbulb className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{improvement.title}</h3>
                        <Badge
                          variant={
                            improvement.type === "critical"
                              ? "destructive"
                              : "secondary"
                          }
                          className="text-xs"
                        >
                          {improvement.type === "critical"
                            ? "필수"
                            : improvement.type === "high"
                              ? "권장"
                              : "선택"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {improvement.description}
                      </p>

                      <AnimatePresence>
                        {selectedImprovement === improvement.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="mt-4 space-y-3 overflow-hidden"
                          >
                            {improvement.before && (
                              <div className="p-3 rounded-xl bg-red-50 border border-red-100">
                                <p className="text-xs font-medium text-red-600 mb-1">
                                  Before
                                </p>
                                <p className="text-sm text-red-800">
                                  {improvement.before}
                                </p>
                              </div>
                            )}
                            {improvement.after && (
                              <div className="p-3 rounded-xl bg-green-50 border border-green-100">
                                <p className="text-xs font-medium text-green-600 mb-1">
                                  After
                                </p>
                                <p className="text-sm text-green-800">
                                  {improvement.after}
                                </p>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="mt-2 h-8 text-green-600"
                                >
                                  <Copy className="w-3 h-3 mr-1" />
                                  복사하기
                                </Button>
                              </div>
                            )}
                            {improvement.keywords && (
                              <div className="flex flex-wrap gap-2">
                                {improvement.keywords.map((keyword) => (
                                  <Badge
                                    key={keyword}
                                    variant="outline"
                                    className="rounded-full"
                                  >
                                    {keyword}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    <ChevronRight
                      className={`w-5 h-5 text-muted-foreground transition-transform ${
                        selectedImprovement === improvement.id
                          ? "rotate-90"
                          : ""
                      }`}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </TabsContent>

        {/* Cover Letter Tab */}
        <TabsContent value="cover-letter" className="space-y-4 mt-0">
          {coverLetterSuggestions.map((item, index) => (
            <motion.div
              key={item.section}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      {item.section}
                      <span
                        className={`text-sm font-normal ${getScoreColor(item.score)}`}
                      >
                        {item.score}점
                      </span>
                    </CardTitle>
                    {item.score >= 80 ? (
                      <Badge className="bg-green-100 text-green-700">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        좋음
                      </Badge>
                    ) : (
                      <Badge variant="secondary">개선 필요</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    {item.feedback}
                  </p>
                  {item.suggestion && (
                    <div className="p-3 rounded-xl bg-primary/5 border border-primary/10">
                      <p className="text-xs font-medium text-primary mb-1">
                        AI 제안
                      </p>
                      <p className="text-sm">{item.suggestion}</p>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="mt-2 h-8 text-primary"
                      >
                        <Copy className="w-3 h-3 mr-1" />
                        복사하기
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </TabsContent>

        {/* Editor Tab */}
        <TabsContent value="editor" className="space-y-4 mt-0">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">자기소개서 편집</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  지원 동기
                </label>
                <Textarea
                  placeholder="지원 동기를 작성해주세요..."
                  className="min-h-[120px] rounded-xl resize-none"
                  defaultValue="네이버 파이낸셜에서 사용자 중심의 금융 서비스를 만들어가는 비전에 공감하여 지원하게 되었습니다."
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  역량 및 경험
                </label>
                <Textarea
                  placeholder="관련 역량과 경험을 작성해주세요..."
                  className="min-h-[120px] rounded-xl resize-none"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <Button className="rounded-xl">
                  <Sparkles className="w-4 h-4 mr-2" />
                  AI로 개선하기
                </Button>
                <Button variant="outline" className="rounded-xl">
                  저장하기
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
