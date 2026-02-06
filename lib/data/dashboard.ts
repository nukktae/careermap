/**
 * Dashboard page: types and default mock data.
 * Replace with API/hooks when backend is ready.
 */

export interface DashboardUser {
  name: string;
  newMatchesCount: number;
}

export interface MatchSummary {
  total: number;
  applyNow: number;
  prepNeeded: number;
  stretchGoal: number;
}

export interface ApplicationSummary {
  applied: number;
  interview: number;
  offer: number;
}

export interface DashboardRecentJob {
  id: number;
  company: string;
  title: string;
  location: string;
  match: number;
  logoUrl?: string;
  logo: string;
  updatedAt: string;
}

export interface DashboardData {
  user: DashboardUser;
  matchSummary: MatchSummary;
  applications: ApplicationSummary;
  recentJobs: DashboardRecentJob[];
}

export const defaultDashboardData: DashboardData = {
  user: {
    name: "아노",
    newMatchesCount: 3,
  },
  matchSummary: {
    total: 16,
    applyNow: 3,
    prepNeeded: 8,
    stretchGoal: 5,
  },
  applications: {
    applied: 5,
    interview: 2,
    offer: 0,
  },
  recentJobs: [
    {
      id: 398956,
      company: "(주)대학내일",
      title: "[대학내일] 마케팅(AE)_20대연구소_인턴(체험형)",
      location: "서울 마포구",
      match: 100,
      logo: "대",
      updatedAt: "2025.05",
    },
    {
      id: 398907,
      company: "스노우",
      title: "[스노우] AI 서비스 콘텐츠 기획 체험형 인턴",
      location: "경기 성남시 분당구",
      match: 100,
      logo: "스",
      updatedAt: "2025.05",
    },
    {
      id: 398944,
      company: "신용카드사회공헌재단",
      title: "2026년 신용카드사회공헌재단 사무국 대학(원)생 체험형 인턴 채용공고",
      location: "서울 중구",
      match: 100,
      logo: "신",
      updatedAt: "2025.05",
    },
  ],
};
