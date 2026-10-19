# 个人展示网站

深色主题的个人网站，包含首页 Hero、精选项目与联系区，以及 `/admin` 内容管理后台。
需求见 `PRD.md`，技术方案见 `TECH_DESIGN.md`，协作约定见 `AGENTS.md`。
线上地址：https://personal-website.a3342151701.workers.dev

## 技术栈

- Next.js 15（App Router）+ React 19 + TypeScript（strict）
- Tailwind CSS 4（`@tailwindcss/postcss`，设计 token 定义在 `src/app/globals.css` 的 `@theme`）
- Decap CMS（`/admin`）+ GitHub OAuth，内容存仓库内的 JSON
- ESLint 9（flat config）+ Prettier（含 `prettier-plugin-tailwindcss`）
- `clsx` + `tailwind-merge`（`src/lib/utils.ts` 的 `cn()`）
- 部署：Cloudflare Workers（`@opennextjs/cloudflare`）
- 包管理：pnpm

## 常用命令

```bash
pnpm install      # 安装依赖
pnpm dev          # 本地开发（http://localhost:3000）
pnpm cms          # 启动 decap-server，配合 pnpm dev 本地使用后台
pnpm build        # 生产构建（页面静态预渲染）
pnpm start        # 运行生产构建
pnpm preview      # 用 Cloudflare Workers 运行时本地预览（OpenNext）
pnpm deploy       # 构建并部署到 Cloudflare Workers
pnpm lint         # ESLint
pnpm typecheck    # 仅做类型检查
pnpm format       # Prettier 格式化
```

## 目录结构

```
src/
├─ app/                    # 路由、布局、metadata
│  ├─ layout.tsx           # 站点级布局：字体、中文 lang、默认 metadata、页脚
│  ├─ page.tsx             # 首页（Hero / 精选项目 / 联系）
│  ├─ admin/page.tsx       # Decap CMS 入口（noindex）
│  └─ api/
│     ├─ auth/route.ts     # CMS 登录：跳转 GitHub 授权
│     └─ callback/route.ts # CMS 登录：code 换 token 并交回前端
├─ components/
│  ├─ layout/              # SiteFooter
│  ├─ sections/            # Hero、ProjectsSection、ContactSection
│  ├─ mdx/                 # MDX 组件（待实现）
│  └─ ui/                  # ButtonLink、ProjectCard、CopyEmailButton
├─ content/
│  ├─ site.json            # 站点信息（后台可编辑）
│  ├─ projects.json        # 项目列表（后台可编辑）
│  └─ blog/                # 文章 *.mdx（待实现）
├─ lib/
│  ├─ site.ts              # 读入 site.json 并做类型收口
│  ├─ cmsAuth.ts           # Decap 登录的 state 校验与 postMessage 协议
│  └─ utils.ts             # cn()
└─ types/index.ts          # 站点与内容类型定义
public/
├─ avatar.png              # 头像
├─ resume.pdf              # 简历（放入后自动出现下载按钮）
└─ config.yml              # 后台集合与字段配置（Decap 读取 /config.yml）
```

## 修改内容的三条路径

1. **后台**：打开 `/admin`，用 GitHub 登录，表单保存后会自动向仓库提交 commit，Cloudflare 收到 push 后重建（约 1–3 分钟）。
2. **改文件**：编辑 `src/content/site.json`（姓名、简介、邮箱、社交链接等）或 `src/content/projects.json`（项目列表），提交并 push。
3. **加简历**：把 PDF 放到 `public/resume.pdf`，重新构建后首页出现「下载简历」按钮。

## 后台登录配置（只需一次）

线上 `/admin` 依赖 GitHub OAuth，密钥只放在 Cloudflare 环境变量里。

1. 打开 https://github.com/settings/developers → **New OAuth App**
   - Homepage URL：`https://personal-website.a3342151701.workers.dev`
   - Authorization callback URL：`https://personal-website.a3342151701.workers.dev/api/callback`
2. 记下 **Client ID**，点 **Generate a new client secret** 生成 **Client secret**。
3. Cloudflare Dashboard → Workers & Pages → `personal-website` → Settings → Variables and Secrets：
   - `GITHUB_OAUTH_CLIENT_ID`（普通文本）
   - `GITHUB_OAUTH_CLIENT_SECRET`（加密 Secret）
4. 重新部署一次让变量生效，然后访问 `/admin` 登录。

本地调试后台：复制 `.dev.vars.example` 为 `.dev.vars` 并填入上面两个值，然后同时运行 `pnpm cms` 与 `pnpm dev`，打开
http://localhost:3000/admin —— 本地模式（`local_backend`）会直接把改动写进工作区文件，不经过 GitHub。

> 注意：`/admin` 只对拥有该仓库写权限的 GitHub 账号开放，其他账号登录后无法提交。
> `public/config.yml` 里的 `repo`、`base_url` 如更换域名需要同步修改。

## 部署

```bash
pnpm deploy    # 或直接 push 到 main，让 Cloudflare 自动构建
```

部署目标是 Cloudflare Workers，配置见 `wrangler.jsonc` 与 `open-next.config.ts`。
