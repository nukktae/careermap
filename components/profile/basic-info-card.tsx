"use client";

export interface ProfileBasicInfoCardProps {
  name: string;
  email: string;
  phone: string;
}

const Label = ({ children }: { children: React.ReactNode }) => (
  <label className="text-xs font-bold text-foreground-muted uppercase tracking-wider">
    {children}
  </label>
);

export function ProfileBasicInfoCard({
  name,
  email,
  phone,
}: ProfileBasicInfoCardProps) {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
      <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
        <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-sm">
          i
        </span>
        기본 정보
      </h3>
      <div className="space-y-0">
        <div>
          <Label>이름</Label>
          <p className="text-foreground font-medium mt-1">{name}</p>
        </div>
        <div className="pt-4 border-t border-border/50">
          <Label>이메일</Label>
          <p className="text-foreground font-medium mt-1">{email}</p>
        </div>
        <div className="pt-4 border-t border-border/50">
          <Label>전화번호</Label>
          <p className="text-foreground font-medium mt-1">{phone}</p>
        </div>
      </div>
    </div>
  );
}
