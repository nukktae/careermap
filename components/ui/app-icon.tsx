"use client";

import { cn } from "@/lib/utils";

// All icons from public/assets/icons/linear only
const LINEAR_ICON_PATHS = {
  home: "linear/essentials/vuesax/linear/home.svg",
  search: "linear/search/vuesax/linear/search-normal.svg",
  flag: "linear/essentials/vuesax/linear/flag.svg",
  user: "linear/users/vuesax/linear/user.svg",
  notification: "linear/notification/vuesax/linear/notification.svg",
  setting: "linear/settings/vuesax/linear/setting.svg",
  menu: "linear/essentials/vuesax/linear/menu.svg",
  close: "linear/essentials/vuesax/linear/close-circle.svg",
  crown: "linear/essentials/vuesax/linear/crown.svg",
  lamp: "linear/essentials/vuesax/linear/lamp.svg",
  "arrow-right": "linear/arrows/vuesax/linear/arrow-right.svg",
  chart: "linear/essentials/vuesax/linear/chart.svg",
  clock: "linear/time/vuesax/linear/clock.svg",
  "magic-star": "linear/support-like/vuesax/linear/magic-star.svg",
  "tick-circle": "linear/essentials/vuesax/linear/tick-circle.svg",
  "document-text": "linear/document-edit/vuesax/linear/document-text.svg",
  "clipboard-text": "linear/document-edit/vuesax/linear/clipboard-text.svg",
  book: "linear/school-learning/vuesax/linear/book.svg",
  task: "linear/document-edit/vuesax/linear/task.svg",
  "message-text": "linear/email-chat/vuesax/linear/message-text.svg",
  code: "linear/programming/vuesax/linear/code.svg",
  "document-download": "linear/document-edit/vuesax/linear/document-download.svg",
  "message-question": "linear/support-like/vuesax/linear/message-question.svg",
} as const;

export type AppIconName = keyof typeof LINEAR_ICON_PATHS;

type AppIconProps = {
  name: AppIconName;
  className?: string;
  "aria-hidden"?: boolean;
};

export function AppIcon({
  name,
  className,
  "aria-hidden": ariaHidden = true,
}: AppIconProps) {
  const path = LINEAR_ICON_PATHS[name];
  const src = `/assets/icons/${path}`;
  return (
    <span
      role="img"
      aria-hidden={ariaHidden}
      className={cn("inline-block shrink-0 bg-current", className)}
      style={{
        maskImage: `url(${src})`,
        WebkitMaskImage: `url(${src})`,
        maskSize: "contain",
        maskRepeat: "no-repeat",
        maskPosition: "center",
        WebkitMaskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
      }}
    />
  );
}
