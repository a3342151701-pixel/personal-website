import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "内容管理",
  // 后台页面不应被搜索引擎收录
  robots: { index: false, follow: false },
};

/**
 * Decap CMS 入口：只挂载静态脚本，不引入任何主站组件。
 * Decap 会按当前页面地址解析 `config.yml`（/admin → /config.yml），
 * 因此配置放在 public/config.yml。
 */
export default function AdminPage() {
  return (
    <>
      <main id="nc-root">
        <p className="p-8">正在加载内容管理界面…</p>
        <noscript>内容管理需要启用 JavaScript。</noscript>
      </main>
      <Script
        src="https://unpkg.com/decap-cms@^3.0.0/dist/decap-cms.js"
        strategy="afterInteractive"
      />
    </>
  );
}
