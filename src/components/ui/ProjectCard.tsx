import type { Project } from "@/types";

/** 项目卡片：项目详情页上线前，卡片直接链到源码仓库。 */
export function ProjectCard({ project }: { project: Project }) {
  const repo = project.links?.repo;

  return (
    <article className="rounded-card border-border bg-surface ease-smooth hover:border-accent/60 flex h-full flex-col border p-6 transition-colors duration-200">
      <h3 className="text-lg font-medium tracking-tight">{project.title}</h3>
      <p className="text-muted mt-2 flex-1 text-sm leading-relaxed">
        {project.summary}
      </p>

      <ul className="mt-4 flex flex-wrap gap-2">
        {project.tech.map((tech) => (
          <li
            key={tech}
            className="rounded-control border-border text-muted border px-2.5 py-1 text-xs"
          >
            {tech}
          </li>
        ))}
      </ul>

      {repo ? (
        <a
          className="text-accent ease-smooth mt-5 inline-flex items-center gap-1 self-start text-sm font-medium transition-colors duration-200 hover:opacity-80"
          href={repo}
          target="_blank"
          rel="noreferrer"
        >
          查看源码
          <span aria-hidden>↗</span>
          <span className="sr-only">
            （在新标签页打开 {project.title} 的 GitHub 仓库）
          </span>
        </a>
      ) : null}
    </article>
  );
}
