"use client";

// Reusable create project button component
// Used in: components/ui/projects/projects-sidebar.tsx, components/ui/projects/projects-content.tsx
import { Button } from "@/components/ui/shared/button";
import { LiquidGlassButton } from "@/components/ui/shared/liquid-glass-button";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";

interface CreateProjectButtonProps {
  onClick?: () => void;
  size?: "default" | "lg";
  variant?: "default" | "hero";
  className?: string;
}

export function CreateProjectButton({
  onClick,
  size = "lg",
  variant = "default",
  className = "w-full group justify-start",
}: CreateProjectButtonProps) {
  if (variant === "hero") {
    return (
      <Button
        variant="gradient"
        size="lg"
        className={cn(
          "h-14 w-full justify-start rounded-full text-base font-semibold shadow-xl hover:shadow-2xl",
          className
        )}
        onClick={onClick}
      >
        <Plus
          size={20}
          className="mr-3 transition-transform group-hover:rotate-90"
        />
        Create Project
      </Button>
    );
  }

  return (
    <LiquidGlassButton
      size={size}
      gradient="primary"
      className={className}
      onClick={onClick}
    >
      <Plus
        size={18}
        className="mr-3 text-slate-900 dark:text-white transition-transform group-hover:rotate-90"
      />
      Create Project
    </LiquidGlassButton>
  );
}
