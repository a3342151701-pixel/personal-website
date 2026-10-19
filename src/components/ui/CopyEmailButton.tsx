"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type CopyState = "idle" | "copied" | "failed";

/**
 * 复制邮箱：Clipboard API 在部分浏览器（或非安全上下文）不可用，
 * 退回 execCommand 兜底；两者都失败时提示手动选中，不做静默失败。
 */
async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    let copied = false;
    try {
      copied = document.execCommand("copy");
    } catch {
      copied = false;
    }
    textarea.remove();
    return copied;
  }
}

export function CopyEmailButton({ email }: { email: string }) {
  const [state, setState] = useState<CopyState>("idle");

  async function handleCopy() {
    setState((await copyText(email)) ? "copied" : "failed");
  }

  const label =
    state === "copied"
      ? "已复制"
      : state === "failed"
        ? "复制失败"
        : "复制邮箱";

  return (
    <>
      <button
        type="button"
        onClick={handleCopy}
        className={cn(
          "rounded-control border-border bg-surface ease-smooth hover:border-accent/60 border px-3.5 py-2 text-sm font-medium transition-colors duration-200",
          state === "copied" && "text-accent",
        )}
      >
        {label}
      </button>
      <span aria-live="polite" className="sr-only">
        {state === "copied"
          ? "邮箱已复制到剪贴板"
          : state === "failed"
            ? "复制失败，请手动选中邮箱地址"
            : ""}
      </span>
    </>
  );
}
