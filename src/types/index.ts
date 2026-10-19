/** 站点级静态配置：站点信息、导航、社交链接。 */
export interface SiteConfig {
  name: string;
  role: string;
  bio: string;
  email: string;
  url: string;
  avatar: string;
  resume: string;
  nav: readonly NavItem[];
  socials: readonly SocialLink[];
}

export interface NavItem {
  label: string;
  href: string;
}

export interface SocialLink {
  label: string;
  href: string;
  icon: string;
}

/** 博客文章：frontmatter 解析结果。 */
export interface PostMeta {
  slug: string;
  title: string;
  description: string;
  /** ISO 日期，yyyy-mm-dd */
  date: string;
  tags: string[];
  cover?: string;
  draft: boolean;
  featured?: boolean;
}

export interface Heading {
  depth: 2 | 3;
  text: string;
  id: string;
}

export interface Post extends PostMeta {
  content: string;
  headings: Heading[];
  /** 预计阅读时长（分钟） */
  readingTime: number;
}

/** 项目条目。 */
export interface Project {
  slug: string;
  title: string;
  summary: string;
  cover?: string;
  tech: string[];
  links?: {
    repo?: string;
    demo?: string;
  };
  featured: boolean;
  startDate?: string;
  content?: string;
}

/** 技能分组。 */
export interface SkillGroup {
  category: string;
  items: SkillItem[];
}

export interface SkillItem {
  name: string;
  /** 熟练度 1–5 */
  level: 1 | 2 | 3 | 4 | 5;
  icon?: string;
}

/** 经历 / 教育时间线。 */
export interface TimelineItem {
  id: string;
  type: "work" | "education";
  period: string;
  title: string;
  org?: string;
  description?: string;
}
