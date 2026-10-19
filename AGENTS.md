# AGENTS.md

本文件为 AI 与人类协作者共用的项目约定。开始任何改动前先读 `PRD.md`（需求）与 `TECH_DESIGN.md`（方案）。

## 一、项目概述

个人展示网站，面向求职/个人品牌：深色主题 + Canvas 星空背景，包含首页 Hero、个人介绍与时间线、技能、项目列表与详情、MDX 博客、联系页。

- 技术栈：Next.js 15 App Router + React 19 + TypeScript + Tailwind CSS v4，内容为仓库内 MDX 文件。
- 无数据库、无用户系统；唯一的服务端接口是联系表单。
- 部署目标：Cloudflare Workers（`@opennextjs/cloudflare`），页面静态预渲染。
- 语言：界面与文档以中文为主，代码标识符、注释用英文。

## 二、开发规范

1. **需求优先**：只实现 PRD 列出的模块；新增功能先更新 PRD/技术文档再写代码。
2. **目录职责**：`app/` 只放页面、布局、路由与 metadata；业务逻辑进 `lib/`；可复用 UI 进 `components/ui/`；页面区块组件进 `components/sections/`。
3. **服务端优先**：默认写成服务端组件，仅在需要状态/事件/浏览器 API 时加 `"use client"`（如 Navbar、Starfield、TOC、表单）。`"use client"` 尽量下沉到叶子组件。
4. **内容驱动**：博客与项目数据一律来自 `src/content/`，不要在组件里硬编码文案、技能列表或社交链接；站点信息集中在 `lib/site.ts`。
5. **样式 token 化**：颜色、圆角（12–16px）、缓动、间距层级统一取自 `globals.css` 的 `@theme` 变量，禁止在组件里写死十六进制色值。
6. **无破坏性重构**：不擅自升级主版本依赖、不改目录结构、不删除现有内容；需要时先说明理由。
7. **提交粒度**：一个改动只解决一件事；提交信息用 `feat/fix/docs/style/refactor/chore: 说明`。

## 三、代码风格

- TypeScript `strict`，禁用 `any`（确需时用 `unknown` + 类型收窄）；对外导出的函数写明参数与返回值类型。
- 组件用函数式 + 具名导出（`export function Hero()`），页面默认导出 `default`；组件文件 PascalCase（`ProjectCard.tsx`），工具函数 camelCase（`formatDate.ts`）。
- 用 `cn()`（clsx + tailwind-merge）合并 className；类名顺序交给 `prettier-plugin-tailwindcss`，不手工排序。
- 空值处理：优先可选链与提前返回，嵌套三元超过两层就抽函数。
- CSS：优先 Tailwind 工具类；仅星空、毛玻璃、prose 排版等复杂样式写少量自定义 CSS，并放在 `globals.css` 分区注释下。
- 注释解释「为什么」，不复述代码；不保留被注释掉的代码块与调试 `console.log`。

## 四、测试要求

- **单元测试（Vitest）**：`lib/mdx.ts`（frontmatter 校验、TOC 生成、阅读时长）、`lib/content.ts`（排序、草稿过滤、标签聚合）、`lib/validation.ts` 必测。
- **组件测试（Testing Library）**：联系表单（空值/非法邮箱/成功/失败反馈）、汉堡菜单（开合、Esc、`aria-expanded`）、邮箱复制按钮。
- **端到端（Playwright）**：首页 → 项目详情 → 博客详情（含代码块与 TOC 锚点跳转）→ 提交联系表单；标签页筛选。
- **验收项必须自动化或手动留证**：
  - 375px 宽度无横向滚动（e2e 断言 `scrollWidth <= clientWidth`）；
  - 移动端星空 ≥ 50fps（DevTools Performance 手动记录，移动仿真 + CPU 4x 降速）；
  - 新增 MD 文件后博客列表自动出现（构建后断言）。
- 新增或修改行为时同步补测试；提交前本地跑 `pnpm lint && pnpm test && pnpm build`。

## 五、注意事项

- **Canvas**：粒子状态放 `useRef`，不要每帧 `setState`；必须处理 `resize`、`visibilitychange` 和组件卸载时的 `cancelAnimationFrame`；不要引入动画库替代现有实现。
- **SSR 安全**：`window`/`document`/`localStorage` 只能在 `useEffect` 或事件回调中访问；避免水合不一致（不要用 `Date.now()`、随机数直接渲染）。
- **无障碍是验收项**：交互元素用语义标签或 `button`，不写裸 `div` 点击；图标按钮必须有 `aria-label`；保持 AA 对比度；所有图片有 `alt`。
- **表单安全**：API Key 只出现在服务端环境变量；服务端必须重新校验；不要在前端日志打印用户提交内容。
- **性能预算**：单个客户端组件尽量小，禁止整体引入图标库（按需具名导入）；图片给宽高或 `sizes`；不在客户端引入 Markdown/高亮解析器。
- **吸顶导航**：锚点跳转需配合 `scroll-margin-top`，否则标题被遮挡；移动端菜单打开时要锁滚动。
- **日期与时区**：文章日期统一 `yyyy-mm-dd` 字符串解析，比较用 UTC，避免本地时区导致同日文章顺序漂移。
- **不要提交**：`.env*`、构建产物（`.next/`、`.open-next/`、`out/`）、编辑器本地配置。
