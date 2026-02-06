"use client";

import { useState, useEffect } from "react";
import { Briefcase, MapPin, Building2, Bell, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useProfile } from "@/lib/hooks/use-profile";
import {
  JOB_TYPE_LABELS,
  LOCATION_LABELS,
  LANGUAGE_LABELS,
  type JobTypePref,
  type LocationPref,
  type CompanyTypePref,
  type LanguagePref,
} from "@/lib/data/profile";

const JOB_TYPES: JobTypePref[] = ["fulltime", "intern", "contract"];
const LOCATIONS: LocationPref[] = ["seoul", "gyeonggi", "busan", "remote"];
const COMPANY_TYPES: CompanyTypePref[] = ["대기업", "공기업", "스타트업", "외국계"];
const SALARY_MIN = 0;
const SALARY_MAX = 10000; // 만원

export default function PreferencesPage() {
  const { preferences: initialPrefs, isLoading, updatePreferences } = useProfile();
  const [saved, setSaved] = useState(false);
  const [prefs, setPrefs] = useState<ReturnType<typeof useProfile>["preferences"] | null>(null);

  useEffect(() => {
    if (!isLoading && initialPrefs) setPrefs(initialPrefs);
  }, [isLoading, initialPrefs]);

  const toggleJobType = (t: JobTypePref) => {
    if (!prefs) return;
    const next = prefs.jobTypes.includes(t)
      ? prefs.jobTypes.filter((x) => x !== t)
      : [...prefs.jobTypes, t];
    setPrefs({ ...prefs, jobTypes: next });
  };

  const toggleLocation = (loc: LocationPref) => {
    if (!prefs) return;
    const next = prefs.locations.includes(loc)
      ? prefs.locations.filter((x) => x !== loc)
      : [...prefs.locations, loc];
    setPrefs({ ...prefs, locations: next });
  };

  const toggleCompanyType = (c: CompanyTypePref) => {
    if (!prefs) return;
    const next = prefs.companyTypes.includes(c)
      ? prefs.companyTypes.filter((x) => x !== c)
      : [...prefs.companyTypes, c];
    setPrefs({ ...prefs, companyTypes: next });
  };

  const handleSave = async () => {
    if (!prefs) return;
    await updatePreferences(prefs);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  if (isLoading || !prefs) {
    return (
      <div className="py-12 text-center text-foreground-secondary">
        로딩 중…
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-foreground">선호설정</h1>
        <p className="text-foreground-secondary mt-1">
          채용 추천에 반영되는 선호를 설정하세요.
        </p>
      </div>

      {/* Job types */}
      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Briefcase className="w-5 h-5" />
          희망 근무 형태
        </h2>
        <div className="flex flex-wrap gap-4">
          {JOB_TYPES.map((t) => (
            <label
              key={t}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Checkbox
                checked={prefs.jobTypes.includes(t)}
                onCheckedChange={() => toggleJobType(t)}
              />
              <span className="text-sm font-medium text-foreground">
                {JOB_TYPE_LABELS[t]}
              </span>
            </label>
          ))}
        </div>
      </section>

      {/* Locations */}
      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          희망 지역
        </h2>
        <div className="flex flex-wrap gap-4">
          {LOCATIONS.map((loc) => (
            <label
              key={loc}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Checkbox
                checked={prefs.locations.includes(loc)}
                onCheckedChange={() => toggleLocation(loc)}
              />
              <span className="text-sm font-medium text-foreground">
                {LOCATION_LABELS[loc]}
              </span>
            </label>
          ))}
        </div>
      </section>

      {/* Company types */}
      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Building2 className="w-5 h-5" />
          선호 기업 유형
        </h2>
        <div className="flex flex-wrap gap-4">
          {COMPANY_TYPES.map((c) => (
            <label
              key={c}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Checkbox
                checked={prefs.companyTypes.includes(c)}
                onCheckedChange={() => toggleCompanyType(c)}
              />
              <span className="text-sm font-medium text-foreground">{c}</span>
            </label>
          ))}
        </div>
      </section>

      {/* Salary */}
      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          희망 연봉 (만원)
        </h2>
        <div className="space-y-4">
          <Slider
            value={[prefs.salaryMin, prefs.salaryMax]}
            onValueChange={([min, max]) =>
              setPrefs({ ...prefs, salaryMin: min, salaryMax: max })
            }
            min={SALARY_MIN}
            max={SALARY_MAX}
            step={100}
          />
          <p className="text-sm text-foreground-secondary">
            {prefs.salaryMin}만원 ~ {prefs.salaryMax}만원
          </p>
        </div>
      </section>

      {/* Notifications */}
      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5" />
          알림
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="email-notif" className="text-foreground">
              이메일 알림
            </Label>
            <Switch
              id="email-notif"
              checked={prefs.emailNotifications}
              onCheckedChange={(checked) =>
                setPrefs({ ...prefs, emailNotifications: checked })
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="push-notif" className="text-foreground">
              푸시 알림
            </Label>
            <Switch
              id="push-notif"
              checked={prefs.pushNotifications}
              onCheckedChange={(checked) =>
                setPrefs({ ...prefs, pushNotifications: checked })
              }
            />
          </div>
        </div>
      </section>

      {/* Language */}
      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5" />
          언어
        </h2>
        <Select
          value={prefs.language}
          onValueChange={(v) =>
            setPrefs({ ...prefs, language: v as LanguagePref })
          }
        >
          <SelectTrigger className="w-48 rounded-xl">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(LANGUAGE_LABELS) as LanguagePref[]).map((lang) => (
              <SelectItem key={lang} value={lang}>
                {LANGUAGE_LABELS[lang]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </section>

      <div className="flex justify-end">
        <Button
          className="rounded-xl"
          onClick={handleSave}
        >
          {saved ? "저장됨" : "저장"}
        </Button>
      </div>
    </div>
  );
}
