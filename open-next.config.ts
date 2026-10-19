// OpenNext Cloudflare 配置（未启用 R2 增量缓存：站点全部静态预渲染）
// 需要缓存时参考 https://opennext.js.org/cloudflare/caching
import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig({
	// For best results consider enabling R2 caching
	// See https://opennext.js.org/cloudflare/caching for more details
});
