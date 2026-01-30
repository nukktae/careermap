"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  BookOpen,
  Target,
  ChevronRight,
  Play,
  Clock,
  Star,
  Zap,
  CheckCircle2,
  Circle,
  Lock,
  Sparkles,
  BarChart3,
  Brain,
  Code,
  Briefcase,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

const skillGapData = {
  overallScore: 72,
  targetRole: "프론트엔드 개발자",
  targetCompany: "네이버",
  skills: [
    {
      name: "React/Next.js",
      current: 85,
      required: 90,
      gap: 5,
      status: "good",
      priority: "low",
    },
    {
      name: "TypeScript",
      current: 70,
      required: 85,
      gap: 15,
      status: "moderate",
      priority: "high",
    },
    {
      name: "시스템 설계",
      current: 45,
      required: 75,
      gap: 30,
      status: "critical",
      priority: "critical",
    },
    {
      name: "테스트 코드",
      current: 60,
      required: 80,
      gap: 20,
      status: "moderate",
      priority: "high",
    },
    {
      name: "성능 최적화",
      current: 55,
      required: 70,
      gap: 15,
      status: "moderate",
      priority: "medium",
    },
    {
      name: "협업/커뮤니케이션",
      current: 80,
      required: 85,
      gap: 5,
      status: "good",
      priority: "low",
    },
  ],
};

const learningPlan = {
  totalWeeks: 8,
  currentWeek: 3,
  completedModules: 7,
  totalModules: 24,
  weeklyGoal: 10,
  weeklyProgress: 6,
  modules: [
    {
      id: 1,
      week: 1,
      title: "TypeScript 심화",
      description: "제네릭, 유틸리티 타입, 고급 패턴",
      duration: "6시간",
      status: "completed",
      resources: 5,
      skill: "TypeScript",
    },
    {
      id: 2,
      week: 1,
      title: "타입 시스템 마스터",
      description: "조건부 타입, 매핑된 타입",
      duration: "4시간",
      status: "completed",
      resources: 3,
      skill: "TypeScript",
    },
    {
      id: 3,
      week: 2,
      title: "시스템 설계 기초",
      description: "확장성, 가용성, 일관성",
      duration: "8시간",
      status: "completed",
      resources: 6,
      skill: "시스템 설계",
    },
    {
      id: 4,
      week: 2,
      title: "분산 시스템 개념",
      description: "CAP 이론, 마이크로서비스",
      duration: "6시간",
      status: "in-progress",
      resources: 4,
      skill: "시스템 설계",
    },
    {
      id: 5,
      week: 3,
      title: "테스트 전략",
      description: "단위, 통합, E2E 테스트",
      duration: "5시간",
      status: "locked",
      resources: 4,
      skill: "테스트 코드",
    },
    {
      id: 6,
      week: 3,
      title: "Jest & React Testing Library",
      description: "실전 테스트 작성법",
      duration: "6시간",
      status: "locked",
      resources: 5,
      skill: "테스트 코드",
    },
  ],
};

const recommendedResources = [
  {
    id: 1,
    title: "TypeScript Deep Dive",
    type: "인강",
    platform: "인프런",
    duration: "12시간",
    rating: 4.9,
    reviews: 2340,
    price: "55,000원",
    skill: "TypeScript",
    isNew: true,
  },
  {
    id: 2,
    title: "시스템 디자인 인터뷰",
    type: "도서",
    platform: "위키북스",
    pages: 320,
    rating: 4.8,
    reviews: 890,
    price: "32,000원",
    skill: "시스템 설계",
    isNew: false,
  },
  {
    id: 3,
    title: "프론트엔드 테스트 완벽 가이드",
    type: "인강",
    platform: "유데미",
    duration: "8시간",
    rating: 4.7,
    reviews: 1560,
    price: "29,000원",
    skill: "테스트 코드",
    isNew: true,
  },
];

function getStatusColor(status: string) {
  switch (status) {
    case "good":
      return "text-green-600 bg-green-50";
    case "moderate":
      return "text-amber-600 bg-amber-50";
    case "critical":
      return "text-red-600 bg-red-50";
    default:
      return "text-muted-foreground bg-muted";
  }
}

function getPriorityBadge(priority: string) {
  switch (priority) {
    case "critical":
      return (
        <Badge variant="destructive" className="text-xs">
          긴급
        </Badge>
      );
    case "high":
      return (
        <Badge className="bg-amber-100 text-amber-700 text-xs">높음</Badge>
      );
    case "medium":
      return (
        <Badge variant="secondary" className="text-xs">
          보통
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="text-xs">
          낮음
        </Badge>
      );
  }
}

export default function PreparePage() {
  const [activeTab, setActiveTab] = useState("skill-gap");

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">준비하기</h1>
        <p className="text-muted-foreground">
          AI가 분석한 스킬 갭과 맞춤 학습 계획
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Target className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">경쟁력 점수</p>
                <p className="text-xl font-bold">{skillGapData.overallScore}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">완료 모듈</p>
                <p className="text-xl font-bold">
                  {learningPlan.completedModules}/{learningPlan.totalModules}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">이번 주 진행</p>
                <p className="text-xl font-bold">
                  {learningPlan.weeklyProgress}/{learningPlan.weeklyGoal}시간
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">학습 진행률</p>
                <p className="text-xl font-bold">
                  {Math.round(
                    (learningPlan.currentWeek / learningPlan.totalWeeks) * 100
                  )}
                  %
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Target Info Card */}
      <Card className="border-0 shadow-sm bg-gradient-to-r from-primary/5 to-primary/10">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">목표 포지션</p>
                <p className="font-semibold">
                  {skillGapData.targetCompany} · {skillGapData.targetRole}
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="rounded-xl">
              변경
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="w-full justify-start bg-muted/50 p-1 rounded-2xl">
          <TabsTrigger
            value="skill-gap"
            className="rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm px-6"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            스킬 분석
          </TabsTrigger>
          <TabsTrigger
            value="learning-plan"
            className="rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm px-6"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            학습 계획
          </TabsTrigger>
          <TabsTrigger
            value="resources"
            className="rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm px-6"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            추천 리소스
          </TabsTrigger>
        </TabsList>

        {/* Skill Gap Tab */}
        <TabsContent value="skill-gap" className="space-y-6 mt-0">
          {/* Skill Gap Chart */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">스킬 갭 분석</CardTitle>
                <Badge variant="outline" className="rounded-xl">
                  <Brain className="w-3 h-3 mr-1" />
                  AI 분석
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {skillGapData.skills.map((skill, index) => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{skill.name}</span>
                      {getPriorityBadge(skill.priority)}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {skill.current}% / {skill.required}%
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(skill.status)}`}
                      >
                        -{skill.gap}%
                      </span>
                    </div>
                  </div>
                  <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="absolute left-0 top-0 h-full bg-primary rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.current}%` }}
                      transition={{ delay: index * 0.1 + 0.2, duration: 0.5 }}
                    />
                    <div
                      className="absolute top-0 h-full w-0.5 bg-foreground/30"
                      style={{ left: `${skill.required}%` }}
                    />
                  </div>
                </motion.div>
              ))}

              <div className="flex items-center gap-4 pt-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  현재 수준
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-0.5 bg-foreground/30" />
                  목표 수준
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Priority Actions */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-500" />
                우선 개선 영역
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {skillGapData.skills
                .filter((s) => s.priority === "critical" || s.priority === "high")
                .map((skill) => (
                  <Link
                    key={skill.name}
                    href="/prepare/skill"
                    className="flex items-center justify-between p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          skill.priority === "critical"
                            ? "bg-red-100"
                            : "bg-amber-100"
                        }`}
                      >
                        {skill.name.includes("시스템") ? (
                          <Code className="w-5 h-5 text-red-600" />
                        ) : skill.name.includes("TypeScript") ? (
                          <FileText className="w-5 h-5 text-amber-600" />
                        ) : (
                          <Target className="w-5 h-5 text-amber-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{skill.name}</p>
                        <p className="text-xs text-muted-foreground">
                          갭: {skill.gap}% · 예상 학습시간: {skill.gap * 2}시간
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </Link>
                ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Learning Plan Tab */}
        <TabsContent value="learning-plan" className="space-y-6 mt-0">
          {/* Weekly Progress */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  {learningPlan.currentWeek}주차 학습
                </CardTitle>
                <span className="text-sm text-muted-foreground">
                  {learningPlan.currentWeek}/{learningPlan.totalWeeks}주
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">주간 목표 달성률</span>
                  <span className="font-medium">
                    {Math.round(
                      (learningPlan.weeklyProgress / learningPlan.weeklyGoal) *
                        100
                    )}
                    %
                  </span>
                </div>
                <Progress
                  value={
                    (learningPlan.weeklyProgress / learningPlan.weeklyGoal) * 100
                  }
                  className="h-2"
                />
                <p className="text-xs text-muted-foreground">
                  이번 주 {learningPlan.weeklyGoal - learningPlan.weeklyProgress}
                  시간 더 학습하면 목표 달성!
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Learning Modules */}
          <div className="space-y-4">
            {learningPlan.modules.map((module, index) => (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card
                  className={`border-0 shadow-sm transition-all ${
                    module.status === "locked"
                      ? "opacity-60"
                      : "hover:shadow-md cursor-pointer"
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          module.status === "completed"
                            ? "bg-green-100"
                            : module.status === "in-progress"
                              ? "bg-primary/10"
                              : "bg-muted"
                        }`}
                      >
                        {module.status === "completed" ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        ) : module.status === "in-progress" ? (
                          <Play className="w-5 h-5 text-primary" />
                        ) : (
                          <Lock className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{module.title}</h3>
                              {module.status === "in-progress" && (
                                <Badge className="bg-primary/10 text-primary text-xs">
                                  진행 중
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-0.5">
                              {module.description}
                            </p>
                          </div>
                          <Badge variant="outline" className="flex-shrink-0">
                            {module.week}주차
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {module.duration}
                          </span>
                          <span className="flex items-center gap-1">
                            <BookOpen className="w-3 h-3" />
                            리소스 {module.resources}개
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            {module.skill}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    {module.status === "in-progress" && (
                      <div className="mt-4 pt-4 border-t">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-muted-foreground">
                            진행률 65%
                          </span>
                        </div>
                        <Progress value={65} className="h-1.5" />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Resources Tab */}
        <TabsContent value="resources" className="space-y-6 mt-0">
          <div className="space-y-4">
            {recommendedResources.map((resource, index) => (
              <motion.div
                key={resource.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center flex-shrink-0">
                        {resource.type === "인강" ? (
                          <Play className="w-6 h-6 text-primary" />
                        ) : (
                          <BookOpen className="w-6 h-6 text-primary" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{resource.title}</h3>
                              {resource.isNew && (
                                <Badge className="bg-green-100 text-green-700 text-xs">
                                  NEW
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-0.5">
                              {resource.platform} · {resource.type}
                            </p>
                          </div>
                          <span className="font-semibold text-primary">
                            {resource.price}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 mt-3">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                            <span className="text-sm font-medium">
                              {resource.rating}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              ({resource.reviews.toLocaleString()})
                            </span>
                          </div>
                          {resource.duration && (
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {resource.duration}
                            </span>
                          )}
                          <Badge variant="secondary" className="text-xs">
                            {resource.skill}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* More Resources Button */}
          <div className="text-center pt-4">
            <Button variant="outline" className="rounded-xl">
              더 많은 리소스 보기
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
