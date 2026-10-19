const stack = [
  "Next.js 15 App Router",
  "React 19",
  "TypeScript",
  "Tailwind CSS 4",
] as const;

const modules = [
  { title: "首页 Hero", desc: "头像、姓名与职位、一句话介绍、CTA" },
  { title: "个人介绍", desc: "简介、经历时间线、教育背景" },
  { title: "项目展示", desc: "卡片列表 + 详情页，含技术标签与链接" },
  { title: "博客", desc: "MDX 渲染、代码高亮、目录" },
  { title: "技能展示", desc: "分组展示图标、名称与熟练度" },
  { title: "联系", desc: "邮箱复制、社交链接、表单校验与反馈" },
] as const;

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[1200px] flex-col justify-center gap-10 px-6 py-16">
      <header className="flex flex-col gap-4">
        <p className="text-accent text-sm font-medium tracking-[0.2em] uppercase">
          Personal Website
        </p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          脚手架已就绪
        </h1>
        <p className="text-muted max-w-2xl">
          项目已按 PRD 的深色主题初始化：背景、文字与强调色来自
          <code className="bg-surface mx-1 rounded-md px-1.5 py-0.5 font-mono text-sm">
            src/app/globals.css
          </code>
          中的设计 token。下面列出待实现的模块，页面本身还是占位。
        </p>
      </header>

      <ul className="flex flex-wrap gap-2">
        {stack.map((item) => (
          <li
            key={item}
            className="rounded-control border-border bg-surface text-muted border px-3 py-1.5 text-sm"
          >
            {item}
          </li>
        ))}
      </ul>

      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {modules.map((module) => (
          <li
            key={module.title}
            className="rounded-card border-border bg-surface ease-smooth hover:border-accent/60 border p-5 transition-colors"
          >
            <h2 className="text-base font-medium">{module.title}</h2>
            <p className="text-muted mt-1.5 text-sm">{module.desc}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
