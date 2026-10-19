import type { NextRequest } from "next/server";
import { OAUTH_STATE_COOKIE, renderAuthResponse } from "@/lib/cmsAuth";

export const dynamic = "force-dynamic";

interface TokenResponse {
  access_token?: string;
  error?: string;
  error_description?: string;
}

/** GitHub OAuth 回调：校验 state 后用 code 换 token，再把 token 交回 CMS。 */
export async function GET(request: NextRequest): Promise<Response> {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const denied = url.searchParams.get("error");
  const savedState = request.cookies.get(OAUTH_STATE_COOKIE)?.value;

  if (denied) {
    return renderAuthResponse("error", {
      message: `GitHub 授权未完成（${denied}）。`,
    });
  }

  if (!code || !state || !savedState || state !== savedState) {
    return renderAuthResponse("error", {
      message: "登录状态校验失败，请回到 /admin 重新登录。",
    });
  }

  const clientId = process.env.GITHUB_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GITHUB_OAUTH_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return renderAuthResponse("error", {
      message: "服务端缺少 GitHub OAuth 配置。",
    });
  }

  const tokenResponse = await fetch(
    "https://github.com/login/oauth/access_token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: `${url.origin}/api/callback`,
      }),
    },
  );

  if (!tokenResponse.ok) {
    return renderAuthResponse("error", {
      message: "GitHub 拒绝了 token 请求，请稍后重试。",
    });
  }

  const data = (await tokenResponse.json()) as TokenResponse;
  if (!data.access_token) {
    return renderAuthResponse("error", {
      message: data.error_description ?? "GitHub 未返回 access token。",
    });
  }

  const response = renderAuthResponse("success", {
    token: data.access_token,
    provider: "github",
  });
  // state 用过即废，避免被重放
  response.headers.append(
    "Set-Cookie",
    `${OAUTH_STATE_COOKIE}=; Path=/api; Max-Age=0; HttpOnly; SameSite=Lax`,
  );
  return response;
}
