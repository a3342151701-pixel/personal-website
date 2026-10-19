# 个人展示网站

深色主题 + 星空背景的个人网站，包含首页 Hero、个人介绍、技能、项目、博客与联系页。
需求见 `PRD.md`，技术方案见 `TECH_DESIGN.md`，协作约定见 `AGENTS.md`。

## 技术栈

- Next.js 15（App Router）+ React 19 + TypeScript（strict）
- Tailwind CSS 4（`@tailwindcss/postcss`，设计 token 定义在 `src/app/globals.css` 的 `@theme`）
- ESLint 9（flat config）+ Prettier（含 `prettier-plugin-tailwindcss`）
- `clsx` + `tailwind-merge`（`src/lib/utils.ts` 的 `cn()`）
- 包管理：pnpm

## 常用命令

```bash
pnpm install      # 安装依赖
pnpm dev          # 本地开发（http://localhost:3000）
pnpm build        # 生产构建（所有页面静态预渲染）
pnpm start        # 运行生产构建
pnpm lint         # ESLint
pnpm typecheck    # 仅做类型检查
pnpm format       # Prettier 格式化
```

## 目录结构

```
src/
├─ app/                  # 路由、布局、metadata、全局样式
│  ├─ layout.tsx         # 站点级布局：字体、中文 lang、默认 metadata
│  ├─ page.tsx           # 首页（当前为占位）
│  └─ globals.css        # Tailwind 引入 + 设计 token + 基础样式
├─ components/
│  ├─ layout/            # Navbar、Footer、Starfield
│  ├─ sections/          # Hero、About、Skills、Projects、Contact
│  ├─ mdx/               # MDXComponents、CodeBlock、TOC
│  └─ ui/                # Button、Card、Tag、SectionHeading
├─ content/
│  ├─ blog/              # 文章 *.mdx
│  └─ projects/          # 项目 *.mdx
├─ lib/
│  ├─ site.ts            # 站点信息、导航、社交链接（唯一文案来源）
│  └─ utils.ts           # cn() 等工具函数
└─ types/index.ts        # 站点与内容类型定义
tests/
├─ unit/                 # Vitest
└─ e2e/                  # Playwright
```

## 待补的依赖与配置

按 `TECH_DESIGN.md` 的实现顺序，后续页面开发时需要补充：`gray-matter`、`next-mdx-remote`、
`remark-gfm`、`rehype-pretty-code`、`rehype-slug`、`zod`，以及 Vitest / Testing Library /
Playwright 与 Cloudflare Workers（`@opennextjs/cloudflare` + `wrangler.jsonc`）的部署配置。
