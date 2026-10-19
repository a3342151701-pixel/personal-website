import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-accent text-bg hover:bg-accent/90",
  secondary: "border-border bg-surface text-fg hover:border-accent/60 border",
  ghost: "text-muted hover:text-fg",
};

interface ButtonLinkProps extends ComponentProps<"a"> {
  variant?: ButtonVariant;
}

/** 链接形态的按钮：统一 CTA 的尺寸、圆角与缓动，避免各处重复拼类名。 */
export function ButtonLink({
  variant = "primary",
  className,
  ...props
}: ButtonLinkProps) {
  return (
    <a
      className={cn(
        "rounded-control ease-smooth inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium transition-colors duration-200",
        variantStyles[variant],
        className,
      )}
      {...props}
    />
  );
}
