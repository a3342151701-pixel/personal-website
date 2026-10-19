import { siteConfig } from "@/lib/site";
import { projects } from "@/content/projects";
import { ProjectCard } from "@/components/ui/ProjectCard";

/** 精选项目：按开始时间倒序，最新的排在前面。 */
const featuredProjects = projects
  .filter((project) => project.featured)
  .sort((a, b) => (b.startDate ?? "").localeCompare(a.startDate ?? ""));

const github = siteConfig.socials.find((social) => social.icon === "github");

export function ProjectsSection() {
  return (
    <section id="projects" className="scroll-mt-24 px-6 py-16 sm:py-20">
      <div className="mx-auto w-full max-w-[1200px]">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              精选项目
            </h2>
            <p className="text-muted mt-2 text-sm">
              都是自己日常会用到的工具，代码开源在 GitHub。
            </p>
          </div>
          {github ? (
            <a
              className="text-accent ease-smooth text-sm font-medium transition-colors duration-200 hover:opacity-80"
              href={github.href}
              target="_blank"
              rel="noreferrer"
            >
              GitHub 全部项目 ↗
            </a>
          ) : null}
        </div>

        <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featuredProjects.map((project) => (
            <li key={project.slug}>
              <ProjectCard project={project} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
