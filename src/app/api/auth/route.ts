import { NextResponse, type NextRequest } from "next/server";
import { siteConfig } from "@/lib/site";
import { isAllowedSiteId, OAUTH_STATE_COOKIE } from "@/lib/cmsAuth";

export const dynamic = "force-dynamic";

/** 纯文本提示页：配置缺失或来源非法时，直接告诉用户在弹窗里该做什么。 */
function notice(message: string): Response {
  const escaped = message.replace(
    /[&<>"']/g,
    (char) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[char] ?? char,
  );

  return new Response(
    `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8" />
<title>内容管理登录</title>
<style>body{margin:0;padding:32px;font-family:system-ui,sans-serif;line-height:1.7;background:#0b0f1a;color:#e6eaf2}</style>
</head><body><h1 style="font-size:18px">无法登录内容管理</h1><p>${escaped}</p></body></html>`,
    {
      status: 400,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store",
        "Referrer-Policy": "no-referrer",
      },
    },
  );
}

/** CMS 登录入口：校验来源后跳转 GitHub 授权页，并用 cookie 保存 state。 */
export async function GET(request: NextRequest): Promise<Response> {
  const url = new URL(request.url);
  const provider = url.searchParams.get("provider") ?? "github";
  const siteId = url.searchParams.get("site_id");
  const clientId = process.env.GITHUB_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GITHUB_OAUTH_CLIENT_SECRET;

  if (provider !== "github") {
    return notice("本站只支持 GitHub 账号登录。");
  }

  if (!isAllowedSiteId(siteId, siteConfig.url)) {
    return notice("该站点未被允许使用此登录入口。");
  }

  if (!clientId || !clientSecret) {
    return notice(
      `尚未配置 GitHub OAuth。请在 Cloudflare Worker 的变量中添加 GITHUB_OAUTH_CLIENT_ID 与 GITHUB_OAUTH_CLIENT_SECRET，并把 OAuth App 的回调地址设为 ${url.origin}/api/callback。`,
    );
  }

  const state = crypto.randomUUID();
  const authorizeUrl = new URL("https://github.com/login/oauth/authorize");
  authorizeUrl.searchParams.set("client_id", clientId);
  authorizeUrl.searchParams.set("redirect_uri", `${url.origin}/api/callback`);
  // 仓库是公开的，只需要 public_repo 就能通过 API 提交内容
  authorizeUrl.searchParams.set("scope", "public_repo");
  authorizeUrl.searchParams.set("state", state);

  const response = NextResponse.redirect(authorizeUrl);
  response.cookies.set(OAUTH_STATE_COOKIE, state, {
    httpOnly: true,
    sameSite: "lax",
    secure: url.protocol === "https:",
    path: "/api",
    maxAge: 600,
  });
  return response;
}
