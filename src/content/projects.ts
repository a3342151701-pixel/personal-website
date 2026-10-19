import projectData from "@/content/projects.json";
import type { Project } from "@/types";

/**
 * Decap 的 list 控件可能把标签存成字符串或 `{ tech }` 对象，
 * 这里统一成 string[]，避免后台保存一次就让构建挂掉。
 */
function normalizeTech(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((item) => {
    if (typeof item === "string") {
      return [item];
    }
    if (item && typeof item === "object" && "tech" in item) {
      const tech = (item as { tech: unknown }).tech;
      return typeof tech === "string" ? [tech] : [];
    }
    return [];
  });
}

/** 项目列表，数据由 `/admin` 后台写入 `src/content/projects.json`。 */
export const projects: Project[] = projectData.projects.map((project) => ({
  ...project,
  tech: normalizeTech(project.tech),
}));
