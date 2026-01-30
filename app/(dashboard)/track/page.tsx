"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Filter,
  Calendar,
  Building2,
  MapPin,
  Clock,
  ChevronRight,
  MoreHorizontal,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Send,
  FileText,
  Users,
  Trophy,
  TrendingUp,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

const applicationStats = {
  total: 24,
  inProgress: 8,
  interviews: 3,
  offers: 1,
  rejected: 12,
  weeklyChange: "+3",
  responseRate: 45,
  avgResponseDays: 7.2,
};

const applications = [
  {
    id: 1,
    company: "네이버",
    position: "프론트엔드 개발자",
    location: "판교",
    status: "interview",
    stage: "2차 면접",
    appliedAt: "2024-01-15",
    nextAction: "기술 면접 준비",
    nextDate: "2024-01-25",
    matchScore: 92,
    salary: "6,000-8,000만원",
    logo: "N",
    color: "bg-green-500",
  },
  {
    id: 2,
    company: "카카오",
    position: "React 개발자",
    location: "판교",
    status: "document",
    stage: "서류 검토중",
    appliedAt: "2024-01-20",
    nextAction: null,
    nextDate: null,
    matchScore: 87,
    salary: "5,500-7,500만원",
    logo: "K",
    color: "bg-yellow-500",
  },
  {
    id: 3,
    company: "토스",
    position: "프론트엔드 엔지니어",
    location: "서울",
    status: "interview",
    stage: "1차 면접 완료",
    appliedAt: "2024-01-10",
    nextAction: "결과 대기",
    nextDate: "2024-01-22",
    matchScore: 89,
    salary: "6,500-9,000만원",
    logo: "T",
    color: "bg-blue-500",
  },
  {
    id: 4,
    company: "쿠팡",
    position: "웹 개발자",
    location: "서울",
    status: "offer",
    stage: "오퍼 수령",
    appliedAt: "2024-01-05",
    nextAction: "연봉 협상",
    nextDate: "2024-01-28",
    matchScore: 85,
    salary: "6,000만원 제시",
    logo: "C",
    color: "bg-red-500",
  },
  {
    id: 5,
    company: "라인",
    position: "Frontend Developer",
    location: "판교",
    status: "rejected",
    stage: "불합격",
    appliedAt: "2024-01-08",
    nextAction: null,
    nextDate: null,
    matchScore: 78,
    salary: "5,500-7,000만원",
    logo: "L",
    color: "bg-green-600",
  },
  {
    id: 6,
    company: "배달의민족",
    position: "React 개발자",
    location: "서울",
    status: "document",
    stage: "지원 완료",
    appliedAt: "2024-01-22",
    nextAction: null,
    nextDate: null,
    matchScore: 83,
    salary: "5,000-7,000만원",
    logo: "B",
    color: "bg-cyan-500",
  },
];

const upcomingEvents = [
  {
    id: 1,
    type: "interview",
    company: "네이버",
    title: "2차 기술 면접",
    date: "2024-01-25",
    time: "14:00",
    location: "판교 그린팩토리",
  },
  {
    id: 2,
    type: "deadline",
    company: "쿠팡",
    title: "오퍼 응답 마감",
    date: "2024-01-28",
    time: "23:59",
    location: null,
  },
  {
    id: 3,
    type: "result",
    company: "토스",
    title: "1차 면접 결과 발표",
    date: "2024-01-22",
    time: null,
    location: null,
  },
];

function getStatusInfo(status: string) {
  switch (status) {
    case "document":
      return {
        label: "서류",
        color: "bg-blue-100 text-blue-700",
        icon: FileText,
      };
    case "interview":
      return {
        label: "면접",
        color: "bg-purple-100 text-purple-700",
        icon: Users,
      };
    case "offer":
      return {
        label: "오퍼",
        color: "bg-green-100 text-green-700",
        icon: Trophy,
      };
    case "rejected":
      return {
        label: "불합격",
        color: "bg-gray-100 text-gray-500",
        icon: XCircle,
      };
    default:
      return {
        label: "대기",
        color: "bg-gray-100 text-gray-600",
        icon: Clock,
      };
  }
}

function getEventTypeInfo(type: string) {
  switch (type) {
    case "interview":
      return { color: "bg-purple-500", icon: Users };
    case "deadline":
      return { color: "bg-red-500", icon: AlertCircle };
    case "result":
      return { color: "bg-blue-500", icon: CheckCircle2 };
    default:
      return { color: "bg-gray-500", icon: Calendar };
  }
}

export default function TrackPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredApplications = applications.filter((app) => {
    if (activeFilter !== "all" && app.status !== activeFilter) return false;
    if (
      searchQuery &&
      !app.company.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !app.position.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">지원 현황</h1>
          <p className="text-muted-foreground">
            내 지원 현황을 한눈에 관리하세요
          </p>
        </div>
        <Button className="rounded-xl">
          <Plus className="w-4 h-4 mr-2" />
          지원 추가
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">총 지원</p>
                <p className="text-2xl font-bold">{applicationStats.total}</p>
              </div>
              <div className="flex items-center text-green-600 text-xs">
                <ArrowUpRight className="w-3 h-3" />
                {applicationStats.weeklyChange}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">진행 중</p>
                <p className="text-2xl font-bold text-purple-600">
                  {applicationStats.inProgress}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                <Send className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">면접 예정</p>
                <p className="text-2xl font-bold text-blue-600">
                  {applicationStats.interviews}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">오퍼</p>
                <p className="text-2xl font-bold text-green-600">
                  {applicationStats.offers}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insights Card */}
      <Card className="border-0 shadow-sm bg-gradient-to-r from-primary/5 to-primary/10">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-semibold">이번 주 인사이트</p>
              <p className="text-sm text-muted-foreground">
                서류 통과율이 평균보다{" "}
                <span className="text-green-600 font-medium">15% 높아요</span>.
                면접 준비에 더 집중해보세요!
              </p>
            </div>
            <Button variant="ghost" size="sm" className="rounded-xl">
              자세히
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Applications List */}
        <div className="lg:col-span-2 space-y-4">
          {/* Search and Filter */}
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="회사명, 포지션 검색..."
                className="pl-9 rounded-xl border-0 bg-muted/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="rounded-xl">
                  <Filter className="w-4 h-4 mr-2" />
                  필터
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onClick={() => setActiveFilter("all")}>
                  전체
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveFilter("document")}>
                  서류
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveFilter("interview")}>
                  면접
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveFilter("offer")}>
                  오퍼
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveFilter("rejected")}>
                  불합격
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {[
              { key: "all", label: "전체", count: applications.length },
              {
                key: "document",
                label: "서류",
                count: applications.filter((a) => a.status === "document")
                  .length,
              },
              {
                key: "interview",
                label: "면접",
                count: applications.filter((a) => a.status === "interview")
                  .length,
              },
              {
                key: "offer",
                label: "오퍼",
                count: applications.filter((a) => a.status === "offer").length,
              },
              {
                key: "rejected",
                label: "불합격",
                count: applications.filter((a) => a.status === "rejected")
                  .length,
              },
            ].map((filter) => (
              <Button
                key={filter.key}
                variant={activeFilter === filter.key ? "default" : "outline"}
                size="sm"
                className="rounded-xl flex-shrink-0"
                onClick={() => setActiveFilter(filter.key)}
              >
                {filter.label}
                <Badge
                  variant="secondary"
                  className={`ml-2 ${activeFilter === filter.key ? "bg-white/20" : ""}`}
                >
                  {filter.count}
                </Badge>
              </Button>
            ))}
          </div>

          {/* Applications */}
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {filteredApplications.map((app, index) => {
                const statusInfo = getStatusInfo(app.status);
                const StatusIcon = statusInfo.icon;

                return (
                  <motion.div
                    key={app.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link href={`/track/${app.id}`}>
                      <Card
                        className={`border-0 shadow-sm hover:shadow-md transition-all cursor-pointer ${
                          app.status === "rejected" ? "opacity-60" : ""
                        }`}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            <div
                              className={`w-12 h-12 rounded-xl ${app.color} flex items-center justify-center text-white font-bold text-lg flex-shrink-0`}
                            >
                              {app.logo}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h3 className="font-semibold">
                                      {app.company}
                                    </h3>
                                    <Badge
                                      className={`text-xs ${statusInfo.color}`}
                                    >
                                      <StatusIcon className="w-3 h-3 mr-1" />
                                      {app.stage}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground mt-0.5">
                                    {app.position}
                                  </p>
                                </div>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8"
                                      onClick={(e) => e.preventDefault()}
                                    >
                                      <MoreHorizontal className="w-4 h-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem>
                                      상태 변경
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      메모 추가
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="text-destructive">
                                      삭제
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>

                              <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {app.location}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {app.appliedAt}
                                </span>
                                <span className="flex items-center gap-1">
                                  <TrendingUp className="w-3 h-3" />
                                  매칭 {app.matchScore}%
                                </span>
                              </div>

                              {app.nextAction && (
                                <div className="mt-3 p-2 rounded-lg bg-primary/5 text-sm">
                                  <span className="text-primary font-medium">
                                    다음 액션:
                                  </span>{" "}
                                  {app.nextAction}
                                  {app.nextDate && (
                                    <span className="text-muted-foreground">
                                      {" "}
                                      · {app.nextDate}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Events */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                다가오는 일정
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingEvents.map((event) => {
                const eventInfo = getEventTypeInfo(event.type);
                const EventIcon = eventInfo.icon;

                return (
                  <div
                    key={event.id}
                    className="flex items-start gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                  >
                    <div
                      className={`w-8 h-8 rounded-lg ${eventInfo.color} flex items-center justify-center flex-shrink-0`}
                    >
                      <EventIcon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{event.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {event.company}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {event.date} {event.time && `· ${event.time}`}
                      </p>
                    </div>
                  </div>
                );
              })}

              <Button
                variant="ghost"
                className="w-full rounded-xl text-muted-foreground"
              >
                캘린더에서 보기
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">응답률 분석</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">
                    서류 통과율
                  </span>
                  <span className="text-sm font-medium">
                    {applicationStats.responseRate}%
                  </span>
                </div>
                <Progress
                  value={applicationStats.responseRate}
                  className="h-2"
                />
              </div>

              <div className="flex items-center justify-between py-3 border-t">
                <span className="text-sm text-muted-foreground">
                  평균 응답 소요
                </span>
                <span className="text-sm font-medium">
                  {applicationStats.avgResponseDays}일
                </span>
              </div>

              <div className="p-3 rounded-xl bg-amber-50 text-amber-800 text-sm">
                <p className="font-medium">팁</p>
                <p className="text-xs mt-1">
                  지원 후 1주일이 지났다면 팔로업 메일을 보내보세요. 응답률이
                  30% 높아져요!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
