import type { ReactNode } from "react";
import { SiteFooter } from "@/components/layout/SiteFooter";

/** 对外页面共用的外壳：跳转链接 + 页脚；`/admin` 不套这层，避免后台被页脚干扰。 */
export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main"
        className="rounded-control bg-surface text-fg sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:text-sm"
      >
        跳到主要内容
      </a>
      {children}
      <SiteFooter />
    </div>
  );
}
