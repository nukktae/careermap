"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Shield, Bell, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  getAccountSettings,
  updateAccountSettings,
} from "@/lib/data/settings";

export default function AccountSettingsPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [settings, setSettings] = useState<ReturnType<typeof getAccountSettings> | null>(null);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) setSettings(getAccountSettings());
  }, [mounted]);

  const handleEmailSubmit = () => {
    if (!newEmail.trim()) return;
    updateAccountSettings({ email: newEmail.trim() });
    setSettings(getAccountSettings());
    setNewEmail("");
    setEmailModalOpen(false);
  };

  const handlePasswordSubmit = () => {
    if (newPassword !== confirmPassword || newPassword.length < 8) return;
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordModalOpen(false);
    if (typeof window !== "undefined") window.alert("비밀번호가 변경되었어요. (데모)");
  };

  const handleDeleteAccount = () => {
    if (deleteConfirmText !== "삭제") return;
    if (typeof window !== "undefined") {
      localStorage.removeItem("careermap-profile");
      localStorage.removeItem("careermap-preferences");
      localStorage.removeItem("careermap-account-settings");
      localStorage.removeItem("careermap-billing");
      localStorage.removeItem("careermap-applications");
      localStorage.removeItem("careermap-application-details");
    }
    setDeleteModalOpen(false);
    router.push("/");
  };

  if (!mounted || !settings) {
    return (
      <div className="container-app py-12 text-center text-foreground-secondary">
        로딩 중…
      </div>
    );
  }

  return (
    <div className="container-app space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-foreground">계정 설정</h1>
        <p className="text-foreground-secondary mt-1">
          이메일, 비밀번호, 알림을 관리하세요.
        </p>
      </div>

      {/* Email */}
      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Mail className="w-5 h-5" />
          이메일
        </h2>
        <div className="flex flex-wrap items-center gap-4">
          <p className="text-foreground-secondary">{settings.email}</p>
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl"
            onClick={() => setEmailModalOpen(true)}
          >
            이메일 변경
          </Button>
        </div>
      </section>

      {/* Password */}
      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Lock className="w-5 h-5" />
          비밀번호
        </h2>
        <Button
          variant="outline"
          size="sm"
          className="rounded-xl"
          onClick={() => setPasswordModalOpen(true)}
        >
          비밀번호 변경
        </Button>
      </section>

      {/* 2FA */}
      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5" />
          2단계 인증
        </h2>
        <div className="flex items-center justify-between">
          <p className="text-sm text-foreground-secondary">
            로그인 시 추가 인증을 요청합니다.
          </p>
          <Switch
            checked={settings.has2FA}
            onCheckedChange={(checked) => {
              updateAccountSettings({ has2FA: checked });
              setSettings(getAccountSettings());
            }}
          />
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
            <Label className="text-foreground">이메일 알림</Label>
            <Switch
              checked={settings.emailNotif}
              onCheckedChange={(checked) => {
                updateAccountSettings({ emailNotif: checked });
                setSettings(getAccountSettings());
              }}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-foreground">푸시 알림</Label>
            <Switch
              checked={settings.pushNotif}
              onCheckedChange={(checked) => {
                updateAccountSettings({ pushNotif: checked });
                setSettings(getAccountSettings());
              }}
            />
          </div>
        </div>
      </section>

      {/* Delete account */}
      <section className="rounded-xl border border-error-200 dark:border-error-900 bg-error-50/30 dark:bg-error-950/20 p-6">
        <h2 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
          <Trash2 className="w-5 h-5 text-error-500" />
          계정 삭제
        </h2>
        <p className="text-sm text-foreground-secondary mb-4">
          계정을 삭제하면 모든 데이터가 영구 삭제됩니다.
        </p>
        <Button
          variant="outline"
          size="sm"
          className="rounded-xl border-error-300 text-error-600 hover:bg-error-100 dark:border-error-800 dark:text-error-400 dark:hover:bg-error-900/30"
          onClick={() => setDeleteModalOpen(true)}
        >
          계정 삭제
        </Button>
      </section>

      {/* Email change modal */}
      <Dialog open={emailModalOpen} onOpenChange={setEmailModalOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>이메일 변경</DialogTitle>
            <DialogDescription>
              새 이메일 주소를 입력하세요.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="new-email">새 이메일</Label>
              <Input
                id="new-email"
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="email@example.com"
                className="rounded-xl"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEmailModalOpen(false)} className="rounded-xl">
              취소
            </Button>
            <Button onClick={handleEmailSubmit} className="rounded-xl" disabled={!newEmail.trim()}>
              변경
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Password change modal */}
      <Dialog open={passwordModalOpen} onOpenChange={setPasswordModalOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>비밀번호 변경</DialogTitle>
            <DialogDescription>
              현재 비밀번호와 새 비밀번호를 입력하세요.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="current-pw">현재 비밀번호</Label>
              <Input
                id="current-pw"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-pw">새 비밀번호</Label>
              <Input
                id="new-pw"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-pw">새 비밀번호 확인</Label>
              <Input
                id="confirm-pw"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="rounded-xl"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPasswordModalOpen(false)} className="rounded-xl">
              취소
            </Button>
            <Button
              onClick={handlePasswordSubmit}
              className="rounded-xl"
              disabled={
                newPassword.length < 8 || newPassword !== confirmPassword
              }
            >
              변경
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete account confirmation */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>계정 삭제</DialogTitle>
            <DialogDescription>
              정말로 계정을 삭제하시겠어요? 모든 데이터가 삭제되며 복구할 수 없습니다. 확인하려면 아래에 &quot;삭제&quot;를 입력하세요.
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <Input
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="삭제"
              className="rounded-xl border-error-300 dark:border-error-800"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)} className="rounded-xl">
              취소
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              className="rounded-xl"
              disabled={deleteConfirmText !== "삭제"}
            >
              계정 삭제
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
