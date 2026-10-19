import type { SiteConfig } from "@/types";

/** 全站文案与链接的唯一来源，组件内不硬编码。 */
export const siteConfig = {
  name: "你的名字",
  role: "前端开发者",
  bio: "一句话介绍自己：正在搭建的个人展示网站。",
  email: "you@example.com",
  url: "https://example.com",
  avatar: "/avatar.png",
  resume: "/resume.pdf",
  nav: [
    { label: "首页", href: "/" },
    { label: "关于", href: "/about" },
    { label: "项目", href: "/projects" },
    { label: "博客", href: "/blog" },
    { label: "联系", href: "/contact" },
  ],
  socials: [
    { label: "GitHub", href: "https://github.com/your-name", icon: "github" },
    { label: "邮箱", href: "mailto:you@example.com", icon: "mail" },
  ],
} as const satisfies SiteConfig;
