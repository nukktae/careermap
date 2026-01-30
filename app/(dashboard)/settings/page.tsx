"use client";

import { useState } from "react";
import {
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  CreditCard,
  LogOut,
  ChevronRight,
  Moon,
  Sun,
  Smartphone,
  Mail,
  MessageSquare,
  Calendar,
  Trash2,
  Download,
  HelpCircle,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const settingsSections = [
  { id: "account", label: "계정", icon: User },
  { id: "notifications", label: "알림", icon: Bell },
  { id: "appearance", label: "테마", icon: Palette },
  { id: "privacy", label: "개인정보", icon: Shield },
  { id: "subscription", label: "구독", icon: CreditCard },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("account");
  const [theme, setTheme] = useState("system");
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    newJobs: true,
    applicationUpdates: true,
    weeklyDigest: true,
    marketing: false,
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">설정</h1>
        <p className="text-muted-foreground">
          계정 및 앱 설정을 관리하세요
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <Card className="border-0 shadow-sm h-fit lg:sticky lg:top-6">
          <CardContent className="p-2">
            <nav className="space-y-1">
              {settingsSections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      activeSection === section.id
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {section.label}
                  </button>
                );
              })}
            </nav>
          </CardContent>
        </Card>

        {/* Settings Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Account Settings */}
          {activeSection === "account" && (
            <>
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>계정 정보</CardTitle>
                  <CardDescription>
                    기본 계정 정보를 관리합니다
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium">이메일</p>
                      <p className="text-sm text-muted-foreground">
                        devkim@email.com
                      </p>
                    </div>
                    <Button variant="outline" size="sm" className="rounded-xl">
                      변경
                    </Button>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium">비밀번호</p>
                      <p className="text-sm text-muted-foreground">
                        마지막 변경: 30일 전
                      </p>
                    </div>
                    <Button variant="outline" size="sm" className="rounded-xl">
                      변경
                    </Button>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium">전화번호</p>
                      <p className="text-sm text-muted-foreground">
                        010-1234-5678
                      </p>
                    </div>
                    <Button variant="outline" size="sm" className="rounded-xl">
                      변경
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>연동된 계정</CardTitle>
                  <CardDescription>
                    소셜 로그인 및 외부 서비스 연동
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center">
                        <span className="text-white font-bold">G</span>
                      </div>
                      <div>
                        <p className="font-medium">Google</p>
                        <p className="text-sm text-muted-foreground">
                          연동됨
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="rounded-xl">
                      연동 해제
                    </Button>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-yellow-400 flex items-center justify-center">
                        <span className="text-black font-bold">K</span>
                      </div>
                      <div>
                        <p className="font-medium">카카오</p>
                        <p className="text-sm text-muted-foreground">
                          연동되지 않음
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="rounded-xl">
                      연동하기
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm border-destructive/20">
                <CardHeader>
                  <CardTitle className="text-destructive">위험 구역</CardTitle>
                  <CardDescription>
                    되돌릴 수 없는 작업입니다
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium">데이터 내보내기</p>
                      <p className="text-sm text-muted-foreground">
                        모든 데이터를 JSON 파일로 다운로드
                      </p>
                    </div>
                    <Button variant="outline" size="sm" className="rounded-xl">
                      <Download className="w-4 h-4 mr-2" />
                      내보내기
                    </Button>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium text-destructive">계정 삭제</p>
                      <p className="text-sm text-muted-foreground">
                        계정과 모든 데이터가 영구 삭제됩니다
                      </p>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="rounded-xl"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      삭제
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Notification Settings */}
          {activeSection === "notifications" && (
            <>
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>알림 채널</CardTitle>
                  <CardDescription>
                    알림 받을 방법을 선택하세요
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                        <Mail className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">이메일</p>
                        <p className="text-sm text-muted-foreground">
                          devkim@email.com
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={notifications.email}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, email: checked })
                      }
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                        <Smartphone className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">푸시 알림</p>
                        <p className="text-sm text-muted-foreground">
                          브라우저 및 모바일
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={notifications.push}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, push: checked })
                      }
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">SMS</p>
                        <p className="text-sm text-muted-foreground">
                          010-1234-5678
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={notifications.sms}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, sms: checked })
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>알림 유형</CardTitle>
                  <CardDescription>받고 싶은 알림을 선택하세요</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium">새 채용공고</p>
                      <p className="text-sm text-muted-foreground">
                        매칭되는 새 공고가 등록되면 알림
                      </p>
                    </div>
                    <Switch
                      checked={notifications.newJobs}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, newJobs: checked })
                      }
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium">지원 현황 업데이트</p>
                      <p className="text-sm text-muted-foreground">
                        서류/면접 결과 등 지원 현황 변경 시 알림
                      </p>
                    </div>
                    <Switch
                      checked={notifications.applicationUpdates}
                      onCheckedChange={(checked) =>
                        setNotifications({
                          ...notifications,
                          applicationUpdates: checked,
                        })
                      }
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium">주간 리포트</p>
                      <p className="text-sm text-muted-foreground">
                        매주 월요일 취업 활동 요약 리포트
                      </p>
                    </div>
                    <Switch
                      checked={notifications.weeklyDigest}
                      onCheckedChange={(checked) =>
                        setNotifications({
                          ...notifications,
                          weeklyDigest: checked,
                        })
                      }
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium">마케팅</p>
                      <p className="text-sm text-muted-foreground">
                        이벤트, 프로모션 및 새로운 기능 소식
                      </p>
                    </div>
                    <Switch
                      checked={notifications.marketing}
                      onCheckedChange={(checked) =>
                        setNotifications({
                          ...notifications,
                          marketing: checked,
                        })
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Appearance Settings */}
          {activeSection === "appearance" && (
            <>
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>테마</CardTitle>
                  <CardDescription>앱의 외관을 설정하세요</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <button
                      onClick={() => setTheme("light")}
                      className={`p-4 rounded-2xl border-2 transition-all ${
                        theme === "light"
                          ? "border-primary bg-primary/5"
                          : "border-muted hover:border-muted-foreground/20"
                      }`}
                    >
                      <div className="w-full aspect-video rounded-lg bg-white border mb-3 flex items-center justify-center">
                        <Sun className="w-6 h-6 text-amber-500" />
                      </div>
                      <p className="font-medium text-sm">라이트</p>
                    </button>
                    <button
                      onClick={() => setTheme("dark")}
                      className={`p-4 rounded-2xl border-2 transition-all ${
                        theme === "dark"
                          ? "border-primary bg-primary/5"
                          : "border-muted hover:border-muted-foreground/20"
                      }`}
                    >
                      <div className="w-full aspect-video rounded-lg bg-gray-900 border border-gray-700 mb-3 flex items-center justify-center">
                        <Moon className="w-6 h-6 text-blue-400" />
                      </div>
                      <p className="font-medium text-sm">다크</p>
                    </button>
                    <button
                      onClick={() => setTheme("system")}
                      className={`p-4 rounded-2xl border-2 transition-all ${
                        theme === "system"
                          ? "border-primary bg-primary/5"
                          : "border-muted hover:border-muted-foreground/20"
                      }`}
                    >
                      <div className="w-full aspect-video rounded-lg bg-gradient-to-r from-white to-gray-900 border mb-3 flex items-center justify-center">
                        <Smartphone className="w-6 h-6 text-gray-500" />
                      </div>
                      <p className="font-medium text-sm">시스템</p>
                    </button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>언어</CardTitle>
                  <CardDescription>앱 표시 언어를 선택하세요</CardDescription>
                </CardHeader>
                <CardContent>
                  <Select defaultValue="ko">
                    <SelectTrigger className="w-full rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ko">한국어</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
            </>
          )}

          {/* Privacy Settings */}
          {activeSection === "privacy" && (
            <>
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>프로필 공개 설정</CardTitle>
                  <CardDescription>
                    내 정보 공개 범위를 설정하세요
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium">프로필 검색 허용</p>
                      <p className="text-sm text-muted-foreground">
                        기업에서 내 프로필을 검색할 수 있습니다
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium">이력서 공개</p>
                      <p className="text-sm text-muted-foreground">
                        기업 담당자가 이력서를 열람할 수 있습니다
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium">활동 상태 표시</p>
                      <p className="text-sm text-muted-foreground">
                        구직 활동 중임을 표시합니다
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>데이터 및 개인정보</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    variant="ghost"
                    className="w-full justify-between rounded-xl h-auto py-3"
                  >
                    <span className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-muted-foreground" />
                      개인정보 처리방침
                    </span>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-between rounded-xl h-auto py-3"
                  >
                    <span className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-muted-foreground" />
                      서비스 이용약관
                    </span>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </Button>
                </CardContent>
              </Card>
            </>
          )}

          {/* Subscription Settings */}
          {activeSection === "subscription" && (
            <>
              <Card className="border-0 shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-primary to-primary/80 p-6 text-primary-foreground">
                  <Badge className="bg-white/20 text-white mb-2">
                    현재 플랜
                  </Badge>
                  <h2 className="text-2xl font-bold">무료 플랜</h2>
                  <p className="text-primary-foreground/80 mt-1">
                    기본 기능을 무료로 이용하세요
                  </p>
                </div>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                        <span className="text-green-600 text-xs">✓</span>
                      </span>
                      AI 이력서 분석 3회/월
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                        <span className="text-green-600 text-xs">✓</span>
                      </span>
                      기본 채용공고 매칭
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                        <span className="text-green-600 text-xs">✓</span>
                      </span>
                      지원 현황 추적 10건
                    </div>
                  </div>
                  <Button className="w-full mt-6 rounded-xl">
                    Pro로 업그레이드
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>결제 정보</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    등록된 결제 수단이 없습니다
                  </p>
                  <Button variant="outline" className="mt-4 rounded-xl">
                    <CreditCard className="w-4 h-4 mr-2" />
                    결제 수단 추가
                  </Button>
                </CardContent>
              </Card>
            </>
          )}

          {/* Help & Logout */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start rounded-xl h-auto py-3"
              >
                <HelpCircle className="w-5 h-5 mr-3 text-muted-foreground" />
                도움말 센터
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start rounded-xl h-auto py-3 text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <LogOut className="w-5 h-5 mr-3" />
                로그아웃
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
