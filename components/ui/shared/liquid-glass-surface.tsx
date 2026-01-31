"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

type LiquidGlassVariant = "panel" | "header" | "toolbar" | "popover";
type LiquidGlassIntensity = "md" | "xl" | "2xl";

const liquidGlassSurfaceVariants = cva("text-slate-900 dark:text-slate-100", {
  variants: {
    variant: {
      panel: "",
      header: "sticky top-0 z-50",
      toolbar: "",
      popover: "z-50",
    },
    intensity: {
      md: "backdrop-blur-md bg-white/40 dark:bg-slate-900/40",
      xl: "backdrop-blur-xl bg-white/70 dark:bg-slate-900/70",
      "2xl": "backdrop-blur-2xl bg-white/80 dark:bg-slate-950/80",
    },
    rounded: {
      none: "",
      lg: "rounded-lg",
      xl: "rounded-xl",
      "2xl": "rounded-2xl",
    },
  },
  defaultVariants: {
    variant: "panel",
    intensity: "xl",
    rounded: "2xl",
  },
});

function borderClasses(variant: LiquidGlassVariant, border: boolean) {
  if (!border) return "";
  if (variant === "header") {
    return "border-b border-white/30 dark:border-white/10";
  }
  return "border border-white/30 dark:border-white/20";
}

function shadowClasses(variant: LiquidGlassVariant, shadow: boolean) {
  if (!shadow) return "";

  const base =
    "shadow-[0_8px_32px_rgba(59,130,246,0.12),0_2px_10px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.25)]";
  const baseDark =
    "dark:shadow-[0_8px_32px_rgba(59,130,246,0.10),0_2px_10px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.10)]";

  switch (variant) {
    case "header":
      return cn("shadow-lg", baseDark);
    case "toolbar":
      return cn(base, baseDark);
    case "popover":
      return cn("shadow-xl", baseDark);
    case "panel":
    default:
      return cn("shadow-xl", baseDark);
  }
}

export function getLiquidGlassSurfaceClassName({
  variant = "panel",
  intensity = "xl",
  rounded,
  border = true,
  shadow = true,
  className,
}: {
  variant?: LiquidGlassVariant;
  intensity?: LiquidGlassIntensity;
  rounded?: VariantProps<typeof liquidGlassSurfaceVariants>["rounded"];
  border?: boolean;
  shadow?: boolean;
  className?: string;
}) {
  const resolvedRounded =
    rounded ??
    (variant === "header"
      ? "none"
      : variant === "popover"
        ? "xl"
        : variant === "toolbar"
          ? "xl"
          : "2xl");

  return cn(
    liquidGlassSurfaceVariants({
      variant,
      intensity,
      rounded: resolvedRounded,
    }),
    borderClasses(variant, border),
    shadowClasses(variant, shadow),
    className,
  );
}

export interface LiquidGlassSurfaceProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof liquidGlassSurfaceVariants> {
  asChild?: boolean;
  border?: boolean;
  shadow?: boolean;
}

export const LiquidGlassSurface = React.forwardRef<
  HTMLDivElement,
  LiquidGlassSurfaceProps
>(
  (
    {
      className,
      asChild = false,
      variant = "panel",
      intensity = "xl",
      rounded,
      border = true,
      shadow = true,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "div";

    return (
      <Comp
        ref={ref}
        className={getLiquidGlassSurfaceClassName({
          variant: variant as LiquidGlassVariant,
          intensity: intensity as LiquidGlassIntensity,
          rounded,
          border,
          shadow,
          className,
        })}
        {...props}
      />
    );
  },
);

LiquidGlassSurface.displayName = "LiquidGlassSurface";

export { liquidGlassSurfaceVariants };
