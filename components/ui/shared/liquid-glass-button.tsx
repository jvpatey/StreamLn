"use client";

import { Button } from "@/components/ui/shared/button";
import { ButtonProps } from "@/components/ui/shared/button";
import { cn } from "@/lib/utils";

interface LiquidGlassButtonProps extends ButtonProps {
  gradient?: "primary" | "accent" | "blue";
}

export function LiquidGlassButton({
  children,
  className,
  gradient = "primary",
  ...props
}: LiquidGlassButtonProps) {
  const gradientClasses = {
    primary:
      "bg-gradient-to-r from-primary-500/20 via-primary-400/25 to-accent-500/20 dark:from-primary-500/15 dark:via-primary-400/20 dark:to-accent-500/15",
    accent:
      "bg-gradient-to-r from-accent-500/20 via-accent-400/25 to-primary-500/20 dark:from-accent-500/15 dark:via-accent-400/20 dark:to-primary-500/15",
    blue: "bg-gradient-to-r from-blue-500/20 via-blue-400/25 to-blue-600/20 dark:from-blue-500/15 dark:via-blue-400/20 dark:to-blue-600/15",
  };

  return (
    <Button
      variant="ghost"
      className={cn(
        "rounded-full font-semibold",
        "backdrop-blur-2xl",
        gradientClasses[gradient],
        "border border-white/30 dark:border-white/20",
        "hover:border-white/40 dark:hover:border-white/30",
        "focus:border-white/40 dark:focus:border-white/30",
        "active:border-white/40 dark:active:border-white/30",
        "hover:!bg-transparent",
        "focus:!bg-transparent",
        "active:!bg-transparent",
        "text-slate-900 dark:text-white",
        "hover:!text-slate-900 dark:hover:!text-white",
        "focus:!text-slate-900 dark:focus:!text-white",
        "active:!text-slate-900 dark:active:!text-white",
        "shadow-[0_8px_32px_rgba(59,130,246,0.2),0_2px_8px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.3)]",
        "dark:shadow-[0_8px_32px_rgba(59,130,246,0.15),0_2px_8px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.1)]",
        "hover:shadow-[0_12px_40px_rgba(59,130,246,0.25),0_4px_12px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.35)]",
        "dark:hover:shadow-[0_12px_40px_rgba(59,130,246,0.18),0_4px_12px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.12)]",
        "hover:scale-[1.01] active:scale-[0.99]",
        "transition-all duration-200",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
}

