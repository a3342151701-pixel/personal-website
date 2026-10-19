import type { SiteConfig } from "@/types";

/** 全站文案与链接的唯一来源，组件内不硬编码。 */
export const siteConfig = {
  // TODO: 换成真实姓名（GitHub 资料里未填写 name）
  name: "a3342151701-pixel",
  role: "前端开发者",
  bio: "学生，平时用前端技术做一些实用的小工具：课程表、随机点名、电商商品图下载扩展。",
  // TODO: 换成常用邮箱（GitHub 资料里未公开 email）
  email: "you@example.com",
  // TODO: 填 Cloudflare 部署后的实际地址
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
    {
      label: "GitHub",
      href: "https://github.com/a3342151701-pixel",
      icon: "github",
    },
  ],
} as const satisfies SiteConfig;
