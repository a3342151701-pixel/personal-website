/** Decap CMS 登录约定的 cookie 名与 OAuth 协议封装。 */
export const OAUTH_STATE_COOKIE = "cms_oauth_state";

/** 只容许本站与本地开发地址发起登录，避免被别的站点当作 OAuth 代理使用。 */
export function isAllowedSiteId(
  siteId: string | null,
  siteUrl: string,
): boolean {
  if (!siteId) {
    return false;
  }

  try {
    const allowed = new Set([
      new URL(siteUrl).origin,
      "http://localhost:3000",
      "http://127.0.0.1:3000",
    ]);
    return allowed.has(new URL(siteId).origin);
  } catch {
    return false;
  }
}

/**
 * 按 Decap 的 postMessage 协议把结果交回 CMS 窗口。
 * CMS 先发 "authorizing:github"，本页收到后再把带 token 的消息发回原 origin。
 */
export function renderAuthResponse(
  status: "success" | "error",
  payload: Record<string, string>,
): Response {
  const message = JSON.stringify(JSON.stringify(payload));
  const html = `<!doctype html>
<html lang="zh-CN">
  <head><meta charset="utf-8" /><title>登录</title></head>
  <body>
    <p>正在返回内容管理界面…</p>
    <script>
      (function () {
        var payload = ${message};
        if (!window.opener) return;
        function receiveMessage(event) {
          window.opener.postMessage(
            "authorization:github:${status}:" + payload,
            event.origin,
          );
          window.removeEventListener("message", receiveMessage, false);
        }
        window.addEventListener("message", receiveMessage, false);
        window.opener.postMessage("authorizing:github", "*");
      })();
    </script>
  </body>
</html>`;

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "Referrer-Policy": "no-referrer",
    },
  });
}
