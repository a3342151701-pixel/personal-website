import siteData from "@/content/site.json";
import type { SiteConfig } from "@/types";

/**
 * 站点文案与链接的唯一来源，数据由 `/admin` 后台写入 `src/content/site.json`。
 * 这里只做类型收口，组件不直接读 JSON。
 */
export const siteConfig = siteData satisfies SiteConfig;
