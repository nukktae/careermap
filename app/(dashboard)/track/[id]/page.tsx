"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Building2,
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  ExternalLink,
  FileText,
  MessageSquare,
  Plus,
  Edit3,
  Trash2,
  CheckCircle2,
  Circle,
  Users,
  Phone,
  Mail,
  Briefcase,
  TrendingUp,
  Star,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

const applicationDetail = {
  id: 1,
  company: "네이버",
  position: "프론트엔드 개발자",
  department: "네이버 파이낸셜",
  location: "판교 그린팩토리",
  type: "정규직",
  salary: "6,000-8,000만원",
  appliedAt: "2024-01-15",
  status: "interview",
  currentStage: 3,
  matchScore: 92,
  logo: "N",
  color: "bg-green-500",
  jobUrl: "https://recruit.navercorp.com/",
  description:
    "네이버 파이낸셜에서 혁신적인 금융 서비스의 프론트엔드를 담당할 개발자를 찾습니다.",
  requirements: [
    "React/Next.js 3년 이상 경험",
    "TypeScript 필수",
    "금융 도메인 경험 우대",
    "성능 최적화 경험",
  ],
  stages: [
    { id: 1, name: "서류 접수", status: "completed", date: "2024-01-15" },
    { id: 2, name: "서류 통과", status: "completed", date: "2024-01-18" },
    {
      id: 3,
      name: "1차 면접",
      status: "completed",
      date: "2024-01-20",
      notes: "코딩 테스트 + 기술 면접",
    },
    {
      id: 4,
      name: "2차 면접",
      status: "current",
      date: "2024-01-25",
      notes: "임원 면접",
    },
    { id: 5, name: "최종 합격", status: "pending", date: null },
  ],
  contacts: [
    { name: "김채용", role: "HR 담당자", email: "recruit@naver.com" },
    { name: "박개발", role: "팀 리드", email: null },
  ],
  notes: [
    {
      id: 1,
      content:
        "1차 면접에서 React 성능 최적화 관련 질문 많았음. useMemo, useCallback 활용 사례 준비 필요.",
      date: "2024-01-20",
    },
    {
      id: 2,
      content: "면접관분이 팀 문화에 대해 자세히 설명해주심. 자율적인 분위기.",
      date: "2024-01-20",
    },
  ],
  documents: [
    { name: "이력서_네이버_v3.pdf", uploadedAt: "2024-01-15" },
    { name: "포트폴리오.pdf", uploadedAt: "2024-01-15" },
    { name: "자기소개서_네이버.docx", uploadedAt: "2024-01-15" },
  ],
};

const interviewTips = [
  {
    title: "기술 면접 예상 질문",
    items: [
      "React 렌더링 최적화 방법",
      "상태 관리 라이브러리 비교",
      "웹 성능 측정 및 개선 경험",
    ],
  },
  {
    title: "회사 리서치 포인트",
    items: [
      "네이버 파이낸셜 최근 서비스",
      "기술 블로그 주요 아티클",
      "조직 문화 및 개발 환경",
    ],
  },
];

export default function ApplicationDetailPage() {
  const [newNote, setNewNote] = useState("");
  const [activeTab, setActiveTab] = useState("timeline");

  const progressPercentage =
    (applicationDetail.currentStage / applicationDetail.stages.length) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Link href="/track">
          <Button variant="ghost" size="icon" className="rounded-xl mt-1">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div
                className={`w-14 h-14 rounded-2xl ${applicationDetail.color} flex items-center justify-center text-white font-bold text-xl`}
              >
                {applicationDetail.logo}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold">
                    {applicationDetail.company}
                  </h1>
                  <Badge className="bg-purple-100 text-purple-700">
                    면접 진행중
                  </Badge>
                </div>
                <p className="text-muted-foreground">
                  {applicationDetail.position}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="rounded-xl" asChild>
                <a
                  href={applicationDetail.jobUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  공고 보기
                </a>
              </Button>
              <Button className="rounded-xl">
                <Edit3 className="w-4 h-4 mr-2" />
                수정
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Info */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
              <MapPin className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">근무지</p>
              <p className="font-medium text-sm">{applicationDetail.location}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">연봉</p>
              <p className="font-medium text-sm">{applicationDetail.salary}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
              <Calendar className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">지원일</p>
              <p className="font-medium text-sm">
                {applicationDetail.appliedAt}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">매칭 점수</p>
              <p className="font-medium text-sm text-primary">
                {applicationDetail.matchScore}%
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">전형 진행률</h3>
            <span className="text-sm text-muted-foreground">
              {applicationDetail.currentStage}/{applicationDetail.stages.length}{" "}
              단계
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2 mb-4" />
          <div className="flex justify-between">
            {applicationDetail.stages.map((stage, index) => (
              <div
                key={stage.id}
                className={`flex flex-col items-center ${
                  index < applicationDetail.stages.length - 1 ? "flex-1" : ""
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    stage.status === "completed"
                      ? "bg-green-500 text-white"
                      : stage.status === "current"
                        ? "bg-primary text-white"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {stage.status === "completed" ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <span className="text-xs font-medium">{stage.id}</span>
                  )}
                </div>
                <p
                  className={`text-xs mt-1 text-center ${
                    stage.status === "current"
                      ? "text-primary font-medium"
                      : "text-muted-foreground"
                  }`}
                >
                  {stage.name}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-4"
          >
            <TabsList className="bg-muted/50 p-1 rounded-2xl">
              <TabsTrigger
                value="timeline"
                className="rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                타임라인
              </TabsTrigger>
              <TabsTrigger
                value="notes"
                className="rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                메모
              </TabsTrigger>
              <TabsTrigger
                value="documents"
                className="rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                문서
              </TabsTrigger>
              <TabsTrigger
                value="prep"
                className="rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                면접 준비
              </TabsTrigger>
            </TabsList>

            {/* Timeline Tab */}
            <TabsContent value="timeline" className="mt-0 space-y-4">
              {applicationDetail.stages.map((stage, index) => (
                <motion.div
                  key={stage.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        stage.status === "completed"
                          ? "bg-green-100"
                          : stage.status === "current"
                            ? "bg-primary/10"
                            : "bg-muted"
                      }`}
                    >
                      {stage.status === "completed" ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      ) : stage.status === "current" ? (
                        <Circle className="w-5 h-5 text-primary fill-primary" />
                      ) : (
                        <Circle className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                    {index < applicationDetail.stages.length - 1 && (
                      <div
                        className={`w-0.5 flex-1 my-2 ${
                          stage.status === "completed"
                            ? "bg-green-200"
                            : "bg-muted"
                        }`}
                      />
                    )}
                  </div>
                  <Card
                    className={`flex-1 border-0 shadow-sm ${
                      stage.status === "current" ? "ring-2 ring-primary/20" : ""
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold">{stage.name}</h4>
                          {stage.date && (
                            <p className="text-sm text-muted-foreground">
                              {stage.date}
                            </p>
                          )}
                          {stage.notes && (
                            <p className="text-sm mt-2 text-muted-foreground">
                              {stage.notes}
                            </p>
                          )}
                        </div>
                        {stage.status === "current" && (
                          <Badge className="bg-primary/10 text-primary">
                            진행중
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </TabsContent>

            {/* Notes Tab */}
            <TabsContent value="notes" className="mt-0 space-y-4">
              <Card className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <Textarea
                    placeholder="면접 후기, 질문 내용, 준비사항 등을 메모하세요..."
                    className="min-h-[100px] rounded-xl resize-none border-0 bg-muted/50"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                  />
                  <div className="flex justify-end mt-3">
                    <Button className="rounded-xl" disabled={!newNote.trim()}>
                      <Plus className="w-4 h-4 mr-2" />
                      메모 추가
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {applicationDetail.notes.map((note) => (
                <Card key={note.id} className="border-0 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <p className="text-sm">{note.content}</p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4 text-muted-foreground" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {note.date}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            {/* Documents Tab */}
            <TabsContent value="documents" className="mt-0 space-y-4">
              <div className="flex justify-end">
                <Button variant="outline" className="rounded-xl">
                  <Plus className="w-4 h-4 mr-2" />
                  문서 추가
                </Button>
              </div>

              {applicationDetail.documents.map((doc, index) => (
                <Card
                  key={index}
                  className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                >
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {doc.uploadedAt} 업로드
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            {/* Interview Prep Tab */}
            <TabsContent value="prep" className="mt-0 space-y-4">
              {interviewTips.map((section, index) => (
                <Card key={index} className="border-0 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Star className="w-4 h-4 text-amber-500" />
                      {section.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {section.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <Circle className="w-2 h-2 text-primary fill-primary flex-shrink-0" />
                        <span className="text-sm">{item}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}

              <Card className="border-0 shadow-sm bg-gradient-to-r from-primary/5 to-primary/10">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center">
                      <Users className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">AI 모의 면접</p>
                      <p className="text-sm text-muted-foreground">
                        네이버 기출 질문으로 연습해보세요
                      </p>
                    </div>
                    <Button className="rounded-xl">시작하기</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contacts */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">담당자 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {applicationDetail.contacts.map((contact, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-xl bg-muted/50"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">
                      {contact.name[0]}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{contact.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {contact.role}
                    </p>
                  </div>
                  {contact.email && (
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Mail className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Requirements */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">자격 요건</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {applicationDetail.requirements.map((req, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  {req}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Actions */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 space-y-2">
              <Button className="w-full rounded-xl" variant="outline">
                <MessageSquare className="w-4 h-4 mr-2" />
                팔로업 메일 작성
              </Button>
              <Button
                className="w-full rounded-xl text-destructive"
                variant="ghost"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                지원 삭제
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
