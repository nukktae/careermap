"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  GraduationCap,
  Award,
  Link as LinkIcon,
  Edit3,
  Camera,
  Plus,
  ChevronRight,
  Github,
  Linkedin,
  Globe,
  FileText,
  Star,
  TrendingUp,
  Target,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const profileData = {
  name: "김개발",
  email: "devkim@email.com",
  phone: "010-1234-5678",
  location: "서울특별시",
  birthYear: 1998,
  profileImage: null,
  headline: "프론트엔드 개발자를 꿈꾸는 대학생",
  bio: "사용자 경험을 중시하는 프론트엔드 개발자가 되고 싶습니다. React와 TypeScript를 주로 사용하며, 클린 코드와 테스트 코드 작성에 관심이 많습니다.",
  profileCompleteness: 85,
  links: {
    github: "github.com/devkim",
    linkedin: "linkedin.com/in/devkim",
    portfolio: "devkim.dev",
  },
};

const education = [
  {
    id: 1,
    school: "서울대학교",
    major: "컴퓨터공학부",
    degree: "학사",
    startYear: 2017,
    endYear: 2024,
    status: "졸업예정",
    gpa: "3.8/4.5",
  },
];

const experiences = [
  {
    id: 1,
    company: "스타트업A",
    position: "프론트엔드 개발 인턴",
    type: "인턴",
    startDate: "2023.06",
    endDate: "2023.08",
    description:
      "React 기반 어드민 대시보드 개발, 컴포넌트 라이브러리 구축, 코드 리뷰 참여",
    skills: ["React", "TypeScript", "Storybook"],
  },
  {
    id: 2,
    company: "대학교 동아리",
    position: "웹 개발 팀장",
    type: "동아리",
    startDate: "2022.03",
    endDate: "2023.12",
    description: "동아리 홈페이지 개발 및 운영, 신입 부원 멘토링",
    skills: ["Next.js", "Tailwind CSS", "Vercel"],
  },
];

const projects = [
  {
    id: 1,
    name: "TODO 앱",
    description: "React + TypeScript로 만든 할일 관리 앱",
    techStack: ["React", "TypeScript", "Recoil"],
    link: "github.com/devkim/todo-app",
    highlight: true,
  },
  {
    id: 2,
    name: "날씨 앱",
    description: "OpenWeather API를 활용한 날씨 정보 앱",
    techStack: ["Next.js", "TailwindCSS", "SWR"],
    link: "github.com/devkim/weather-app",
    highlight: false,
  },
  {
    id: 3,
    name: "포트폴리오 웹사이트",
    description: "개인 포트폴리오 웹사이트",
    techStack: ["Next.js", "Framer Motion", "Vercel"],
    link: "devkim.dev",
    highlight: true,
  },
];

const skills = {
  languages: ["JavaScript", "TypeScript", "Python", "Java"],
  frameworks: ["React", "Next.js", "Node.js", "Express"],
  tools: ["Git", "Figma", "VS Code", "Notion"],
  databases: ["PostgreSQL", "MongoDB", "Firebase"],
};

const certificates = [
  {
    id: 1,
    name: "정보처리기사",
    issuer: "한국산업인력공단",
    date: "2023.06",
    status: "취득",
  },
  {
    id: 2,
    name: "SQLD",
    issuer: "한국데이터산업진흥원",
    date: "2023.03",
    status: "취득",
  },
  {
    id: 3,
    name: "OPIC",
    issuer: "ACTFL",
    date: "2023.09",
    status: "IH",
  },
];

const targetCompanies = [
  { name: "네이버", matchScore: 92 },
  { name: "카카오", matchScore: 87 },
  { name: "토스", matchScore: 89 },
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card className="border-0 shadow-sm overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/5" />
        <CardContent className="relative px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12">
            <div className="relative">
              <Avatar className="w-24 h-24 border-4 border-background shadow-lg">
                <AvatarImage src={profileData.profileImage || undefined} />
                <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                  {profileData.name[0]}
                </AvatarFallback>
              </Avatar>
              <Button
                size="icon"
                variant="secondary"
                className="absolute bottom-0 right-0 w-8 h-8 rounded-full shadow-md"
              >
                <Camera className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex-1 sm:pb-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h1 className="text-2xl font-bold">{profileData.name}</h1>
                  <p className="text-muted-foreground">
                    {profileData.headline}
                  </p>
                </div>
                <Button className="rounded-xl w-fit">
                  <Edit3 className="w-4 h-4 mr-2" />
                  프로필 수정
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Info */}
          <div className="flex flex-wrap gap-4 mt-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Mail className="w-4 h-4" />
              {profileData.email}
            </span>
            <span className="flex items-center gap-1">
              <Phone className="w-4 h-4" />
              {profileData.phone}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {profileData.location}
            </span>
          </div>

          {/* Social Links */}
          <div className="flex gap-2 mt-4">
            {profileData.links.github && (
              <Button variant="outline" size="sm" className="rounded-xl">
                <Github className="w-4 h-4 mr-2" />
                GitHub
              </Button>
            )}
            {profileData.links.linkedin && (
              <Button variant="outline" size="sm" className="rounded-xl">
                <Linkedin className="w-4 h-4 mr-2" />
                LinkedIn
              </Button>
            )}
            {profileData.links.portfolio && (
              <Button variant="outline" size="sm" className="rounded-xl">
                <Globe className="w-4 h-4 mr-2" />
                Portfolio
              </Button>
            )}
          </div>

          {/* Profile Completeness */}
          <div className="mt-6 p-4 rounded-xl bg-muted/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">프로필 완성도</span>
              <span className="text-sm text-primary font-medium">
                {profileData.profileCompleteness}%
              </span>
            </div>
            <Progress
              value={profileData.profileCompleteness}
              className="h-2"
            />
            <p className="text-xs text-muted-foreground mt-2">
              경력 사항을 추가하면 기업 매칭 정확도가 높아져요!
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="w-full justify-start bg-muted/50 p-1 rounded-2xl overflow-x-auto">
          <TabsTrigger
            value="overview"
            className="rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm px-4"
          >
            개요
          </TabsTrigger>
          <TabsTrigger
            value="experience"
            className="rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm px-4"
          >
            경험
          </TabsTrigger>
          <TabsTrigger
            value="projects"
            className="rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm px-4"
          >
            프로젝트
          </TabsTrigger>
          <TabsTrigger
            value="skills"
            className="rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm px-4"
          >
            스킬
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-0">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Bio */}
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center justify-between">
                    자기소개
                    <Button variant="ghost" size="sm" className="rounded-xl">
                      <Edit3 className="w-4 h-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{profileData.bio}</p>
                </CardContent>
              </Card>

              {/* Education */}
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-primary" />
                      학력
                    </span>
                    <Button variant="ghost" size="sm" className="rounded-xl">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {education.map((edu) => (
                    <div
                      key={edu.id}
                      className="flex items-start gap-4 p-3 rounded-xl bg-muted/50"
                    >
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <GraduationCap className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{edu.school}</h4>
                          <Badge variant="secondary">{edu.status}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {edu.major} · {edu.degree}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {edu.startYear} - {edu.endYear} · GPA {edu.gpa}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Recent Experience */}
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-primary" />
                      경험
                    </span>
                    <Button variant="ghost" size="sm" className="rounded-xl">
                      전체 보기
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {experiences.slice(0, 2).map((exp) => (
                    <div
                      key={exp.id}
                      className="flex items-start gap-4 p-3 rounded-xl bg-muted/50"
                    >
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Briefcase className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{exp.company}</h4>
                          <Badge variant="outline">{exp.type}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {exp.position}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {exp.startDate} - {exp.endDate}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {exp.skills.map((skill) => (
                            <Badge
                              key={skill}
                              variant="secondary"
                              className="text-xs"
                            >
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Target Companies */}
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" />
                    관심 기업
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {targetCompanies.map((company) => (
                    <div
                      key={company.name}
                      className="flex items-center justify-between p-3 rounded-xl bg-muted/50"
                    >
                      <span className="font-medium">{company.name}</span>
                      <Badge
                        className={
                          company.matchScore >= 90
                            ? "bg-green-100 text-green-700"
                            : "bg-amber-100 text-amber-700"
                        }
                      >
                        {company.matchScore}% 매칭
                      </Badge>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    className="w-full rounded-xl"
                    size="sm"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    기업 추가
                  </Button>
                </CardContent>
              </Card>

              {/* Certificates */}
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Award className="w-5 h-5 text-primary" />
                    자격증
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {certificates.map((cert) => (
                    <div
                      key={cert.id}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium text-sm">{cert.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {cert.issuer} · {cert.date}
                        </p>
                      </div>
                      <Badge variant="secondary">{cert.status}</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="border-0 shadow-sm bg-gradient-to-br from-primary/5 to-primary/10">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      총 지원
                    </span>
                    <span className="font-semibold">24건</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      면접률
                    </span>
                    <span className="font-semibold text-green-600">45%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      경쟁력 점수
                    </span>
                    <span className="font-semibold text-primary">72점</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Experience Tab */}
        <TabsContent value="experience" className="mt-0 space-y-4">
          <div className="flex justify-end">
            <Button className="rounded-xl">
              <Plus className="w-4 h-4 mr-2" />
              경험 추가
            </Button>
          </div>
          {experiences.map((exp, index) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Briefcase className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{exp.company}</h3>
                            <Badge variant="outline">{exp.type}</Badge>
                          </div>
                          <p className="text-muted-foreground">
                            {exp.position}
                          </p>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit3 className="w-4 h-4" />
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {exp.startDate} - {exp.endDate}
                      </p>
                      <p className="text-sm mt-3">{exp.description}</p>
                      <div className="flex flex-wrap gap-1 mt-3">
                        {exp.skills.map((skill) => (
                          <Badge key={skill} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </TabsContent>

        {/* Projects Tab */}
        <TabsContent value="projects" className="mt-0 space-y-4">
          <div className="flex justify-end">
            <Button className="rounded-xl">
              <Plus className="w-4 h-4 mr-2" />
              프로젝트 추가
            </Button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  className={`border-0 shadow-sm hover:shadow-md transition-shadow h-full ${
                    project.highlight ? "ring-1 ring-primary/20" : ""
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold">{project.name}</h3>
                      {project.highlight && (
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-3">
                      {project.techStack.map((tech) => (
                        <Badge key={tech} variant="secondary" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-3 rounded-xl p-0 h-auto text-primary"
                    >
                      <LinkIcon className="w-3 h-3 mr-1" />
                      {project.link}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Skills Tab */}
        <TabsContent value="skills" className="mt-0">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">언어</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {skills.languages.map((skill) => (
                  <Badge key={skill} className="rounded-full px-3 py-1">
                    {skill}
                  </Badge>
                ))}
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">프레임워크</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {skills.frameworks.map((skill) => (
                  <Badge key={skill} className="rounded-full px-3 py-1">
                    {skill}
                  </Badge>
                ))}
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">도구</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {skills.tools.map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="rounded-full px-3 py-1"
                  >
                    {skill}
                  </Badge>
                ))}
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">데이터베이스</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {skills.databases.map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="rounded-full px-3 py-1"
                  >
                    {skill}
                  </Badge>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
