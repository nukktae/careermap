"use client";

import { useRef } from "react";
import { Camera } from "lucide-react";

export interface ProfileAvatarCardProps {
  photoUrl?: string | null;
  initials: string;
  onPhotoChange?: (file: File) => void;
}

export function ProfileAvatarCard({
  photoUrl,
  initials,
  onPhotoChange,
}: ProfileAvatarCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleClick() {
    fileInputRef.current?.click();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    onPhotoChange?.(file);
  }

  return (
    <div className="bg-card border border-border rounded-2xl p-8 flex flex-col items-center text-center shadow-sm">
      <div className="relative mb-4">
        <div className="w-32 h-32 rounded-full flex items-center justify-center text-3xl font-bold text-primary border-4 border-background bg-background-secondary overflow-hidden">
          {photoUrl ? (
            <img src={photoUrl} alt="" className="w-full h-full object-cover" />
          ) : (
            initials
          )}
        </div>
        <button
          type="button"
          onClick={handleClick}
          className="absolute bottom-0 right-0 w-10 h-10 bg-card border border-border rounded-full flex items-center justify-center shadow-md hover:bg-background-secondary transition-colors"
        >
          <Camera className="w-4 h-4 text-foreground-muted" />
        </button>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      <button
        type="button"
        onClick={handleClick}
        className="text-sm font-semibold text-primary hover:underline"
      >
        사진 변경
      </button>
    </div>
  );
}
