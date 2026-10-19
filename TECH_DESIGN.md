# 技术设计文档（TECH_DESIGN）

> 对应 PRD：`PRD.md`（个人展示网站 核心版）

---

## 一、技术栈选择

| 层次          | 选型                                                                               | 说明                                                             |
| ------------- | ---------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| 前端框架      | **Next.js 15（App Router）+ React 19 + TypeScript（strict）**                      | 以服务端组件为主，SEO 友好，静态导出即可满足需求                 |
| 样式方案      | **Tailwind CSS v4** + CSS 变量（design tokens）                                    | 用 `@theme` 定义颜色/圆角/缓动，组件内只引用 token，不硬编码色值 |
| 动效          | CSS transition + `IntersectionObserver`；星空用原生 Canvas                         | 不引入重型动画库，控制首屏体积                                   |
| 内容管理      | **Decap CMS（`/admin`）+ 仓库内 JSON 文件**                                        | 表单保存时通过 GitHub API 提交 commit，触发 Cloudflare 重建；无数据库             |
| Markdown 渲染 | `next-mdx-remote/rsc` + `remark-gfm` + `rehype-pretty-code`(Shiki) + `rehype-slug` | 服务端渲染，代码高亮不进客户端 bundle                            |
| 后端          | **Next.js Route Handler / Server Action**（联系表单 + CMS OAuth 回调）              | 无独立后端服务，不做用户系统；OAuth 密钥只在服务端读取            |
| 数据库        | **无数据库**（内容即数据，存于 git）                                               | 表单不落库，校验后转发邮件；如需留档再接入 D1/Upstash            |
| 邮件          | Resend（或任意 SMTP 服务）                                                         | 仅在服务端读取 API Key                                           |
| 校验          | `zod`                                                                              | 表单与 frontmatter 共用 schema                                   |
| 部署          | **Cloudflare Workers（`@opennextjs/cloudflare`）+ 静态资源缓存**                   | 全部页面预渲染为静态，接口走 Worker                              |
| 工具链        | pnpm、ESLint、Prettier、Vitest、Testing Library、Playwright                        |                                                                  |

---

## 二、项目结构

```
personal-website/
├─ src/
│  ├─ app/
│  │  ├─ layout.tsx                 # 全局布局：字体、Navbar、Footer、Starfield
│  │  ├─ page.tsx                   # 首页（Hero / 技能 / 项目 / 博客预览 / 联系）
│  │  ├─ about/page.tsx             # 个人介绍 + 时间线
│  │  ├─ projects/
│  │  │  ├─ page.tsx                # 项目卡片列表
│  │  │  └─ [slug]/page.tsx         # 项目详情（generateStaticParams）
│  │  ├─ blog/
│  │  │  ├─ page.tsx                # 文章列表 + 标签筛选
│  │  │  ├─ [slug]/page.tsx         # MDX 详情 + 代码高亮 + TOC
│  │  │  └─ tags/[tag]/page.tsx     # 按标签归档
│  │  ├─ contact/page.tsx           # 联系页（邮箱复制 / 社交 / 表单）
│  │  ├─ admin/page.tsx             # Decap CMS 入口（noindex）
│  │  ├─ api/
│  │  │  ├─ contact/route.ts        # POST 联系表单
│  │  │  ├─ auth/route.ts           # GitHub OAuth 授权跳转（CMS 登录）
│  │  │  └─ callback/route.ts       # GitHub OAuth 回调，把 token 交给 CMS
│  │  ├─ sitemap.ts / robots.ts / rss.xml/route.ts
│  │  ├─ opengraph-image.tsx
│  │  └─ globals.css                # @theme token、基础样式、星空降级
│  ├─ components/
│  │  ├─ layout/                    # Navbar（吸顶毛玻璃/汉堡）、Footer、Starfield
│  │  ├─ sections/                  # Hero、AboutTimeline、Skills、ProjectGrid、Contact
│  │  ├─ mdx/                       # MDXComponents、CodeBlock、TOC、Callout
│  │  └─ ui/                        # Button、Card、Tag、SectionHeading、Prose
│  ├─ content/
│  │  ├─ blog/*.mdx                 # 文章源文件
│  │  ├─ site.json                  # 站点信息（CMS 可编辑）
│  │  ├─ projects.json              # 项目列表（CMS 可编辑）
│  │  ├─ skills.ts                  # 技能分组数据
│  │  └─ timeline.ts                # 经历/教育时间线
│  ├─ lib/
│  │  ├─ content.ts                 # 读取 + 缓存 posts/projects
│  │  ├─ mdx.ts                     # frontmatter schema、TOC 生成、阅读时长
│  │  ├─ site.ts                    # 站点元信息（从 content/site.json 读入并校验）
│  │  ├─ validation.ts              # zod schema（表单/frontmatter）
│  │  └─ utils.ts                   # cn()、日期格式化
│  └─ types/index.ts                # 全局类型
├─ public/                          # avatar、resume.pdf、静态插图
│  └─ config.yml                   # Decap CMS 配置（集合与字段定义，/admin 读取 /config.yml）
├─ tests/
│  ├─ unit/                         # lib 层
│  └─ e2e/                          # Playwright
├─ next.config.ts / wrangler.jsonc / open-next.config.ts
├─ PRD.md / AGENTS.md / TECH_DESIGN.md
```

约定：路由目录用小写（Next 要求），组件文件用 PascalCase，`lib/` 用 camelCase；`app/` 只放页面与路由，不写业务逻辑。

---

## 三、数据模型

MVP 不做数据库，数据来源是「MDX frontmatter + TS 配置」。核心类型：

```ts
// 博客文章（解析 frontmatter 后）
interface PostMeta {
  slug: string; // 文件名，唯一
  title: string;
  description: string; // 列表摘要
  date: string; // ISO yyyy-mm-dd
  tags: string[];
  cover?: string; // /public 下相对路径
  draft: boolean; // 构建时过滤
  featured?: boolean;
}

interface Post extends PostMeta {
  content: string; // MDX 原文
  headings: { depth: 2 | 3; text: string; id: string }[]; // TOC
  readingTime: number; // 分钟
}
```

```ts
// 项目
interface Project {
  slug: string;
  title: string;
  summary: string;
  cover?: string;
  tech: string[];
  links?: { repo?: string; demo?: string };
  featured: boolean;
  startDate?: string;
  content?: string; // 详情页正文（MDX/字符串）
}

// 技能：分组展示
interface SkillGroup {
  category: string; // 如「前端」「工具」
  items: { name: string; level: 1 | 2 | 3 | 4 | 5; icon?: string }[];
}

// 时间线（经历 / 教育）
interface TimelineItem {
  id: string;
  type: "work" | "education";
  period: string; // "2023.09 — 至今"
  title: string;
  org?: string;
  description?: string;
}

// 站点配置
interface SiteConfig {
  name: string;
  role: string;
  bio: string;
  email: string;
  avatar: string;
  resume: string;
  socials: { label: string; href: string; icon: string }[];
}
```

```ts
// 联系表单（不持久化，仅校验后转发邮件）
const contactSchema = z.object({
  name: z.string().min(1).max(50),
  email: z.string().email(),
  message: z.string().min(10).max(2000),
  honeypot: z.string().max(0).optional(), // 反垃圾
});
```

部署所需的环境变量（只存服务端）：`RESEND_API_KEY`、`CONTACT_TO_EMAIL`、`SITE_URL`、
`GITHUB_OAUTH_CLIENT_ID`、`GITHUB_OAUTH_CLIENT_SECRET`（后两个仅用于 `/admin` 登录）。

### 内容文件（CMS 可写）

`/admin` 后台直接编辑以下两个 JSON，类型仍由 `src/types/index.ts` 约束：

- `src/content/site.json`：`SiteConfig` 对象（姓名、职位、简介、邮箱、头像、导航、社交链接）。
- `src/content/projects.json`：`{ "projects": Project[] }`，`lib` 层读出后断言为 `Project[]`。

组件不直接 `import` JSON，统一经 `lib/site.ts` 与 `content/projects.ts` 暴露，保证类型与默认值集中。

---

## 四、关键技术点

1. **星空 Canvas 性能（PRD 硬指标：移动端 ≥ 50fps）**
   - 单 `<canvas>`，监听 `resize` 时按面积计算粒子数（桌面约 100–140，移动端约 40–60），`devicePixelRatio` 上限取 2。
   - 粒子状态存 `useRef`，动画走单次 `requestAnimationFrame` 循环，绝不放进 React state，避免每帧渲染。
   - `document.visibilitychange` 与 `IntersectionObserver` 控制暂停；视差只读鼠标/滚动偏移做插值，不做复杂物理。
   - `prefers-reduced-motion: reduce` 时降级为静态渐变星点（CSS），不启动 rAF。
   - 叠加在 `body` 固定定位层，`pointer-events: none`，`z-index` 最低，不遮挡交互。

2. **MDX 内容流水线**
   - 内容即文件：构建时扫描 `src/content/blog/*.mdx`，新增文件自动出现在列表（`generateStaticParams`）。
   - frontmatter 用 zod 校验，缺字段直接构建失败，避免线上脏数据。
   - TOC 由服务端解析标题生成锚点 ID，与 `rehype-slug` 保持一致；标题锚点配合 `scroll-margin-top` 抵消吸顶导航高度。
   - 代码高亮在服务端完成，客户端不加载 Shiki；图片走 `next/image`。

3. **设计系统与深色主题**
   - 颜色、圆角、缓动统一定义在 `globals.css` 的 `@theme`，例如 `--color-bg: #0B0F1A`、`--color-fg: #E6EAF2`、`--color-accent`。
   - 只做深色主题，`html { color-scheme: dark }`，避免切换闪烁；对比度按 WCAG AA（正文 ≥ 4.5:1，大字 ≥ 3:1）自检。
   - 动效统一 `--ease-out` 与 150/250/400ms 三档时长。

4. **响应式与 375px 验收**
   - mobile-first：`<640` 单列、`640–1024` 两列、`>1024` 三列，容器 `max-width: 1200px`。
   - 防横向滚动：网格子项加 `min-w-0`，长字符串 `break-words`，`pre/code` 用 `overflow-x: auto` 而不是撑宽父级；375px 下不出现 `overflow-x` 全局隐藏这种掩盖问题的写法。

5. **导航与无障碍**
   - 吸顶毛玻璃：`position: sticky/fixed` + `backdrop-filter`，滚动超过阈值加边框与背景透明度。
   - 汉堡菜单需处理：`aria-expanded`、Esc 关闭、打开时锁定 body 滚动、焦点回到触发器、内部 Tab 循环。
   - 全局提供「跳到主内容」链接、`focus-visible` 焦点环、图片 `alt`、装饰性图标 `aria-hidden`。

6. **联系表单（唯一后端接口）**
   - 客户端校验用于即时反馈，服务端用同一份 zod schema 再校验一次（不信任前端）。
   - 蜜罐字段 + 基于 IP 的简单限流（Worker 内存/Cloudflare 规则）防刷；错误响应返回统一结构，前端区分「校验失败 / 发送失败」并给出可重试提示，附 `mailto:` 兜底。
   - 表单提交用 Server Action 或 `POST /api/contact`，带 `pending` 状态与防重复提交。

7. **SEO 与分发**
   - `metadata` API 统一管理 title/description/OG；提供 `sitemap.ts`、`robots.ts`、`rss.xml`，文章页输出 JSON-LD `BlogPosting`。

8. **构建与部署**
   - 页面默认全静态预渲染；Cloudflare Workers 不支持 Node 的 ISR 依赖，因此避免使用 `revalidate` 以外的动态能力，内容更新靠重新部署。
   - 部署前跑 `pnpm build` + 类型检查 + e2e；静态资源（`_next/static`、字体、图片）单独缓存，`resume.pdf` 设置下载头。

9. **内容管理后台（Decap CMS + GitHub OAuth）**
   - `/admin` 只加载 Decap 的静态脚本（CDN）+ `config.yml`，不进入主站 bundle；页面 `noindex`。
   - 登录链路：CMS → `/api/auth`（校验 `site_id` 来源、写 state cookie）→ GitHub 授权页 → `/api/callback`（校验 state、用 `client_secret` 换 token）→ 用 `postMessage` 把 token 交回 CMS。
   - `client_secret` 只在 Worker 环境变量中；回调页不打印、不落库任何 token；state 用 HttpOnly + SameSite=Lax cookie，防 CSRF。
   - 保存内容时 Decap 通过 GitHub Contents API 提交 commit，Cloudflare 收到 push 后自动重建（约 1–3 分钟）。因此后台是「编辑 → 提交 → 重建」，不是即时生效。
   - 未配置 OAuth 环境变量时，`/api/auth` 返回带配置说明的页面，而不是 500 白屏。
