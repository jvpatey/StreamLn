"use client";

// Reusable create project button component
// Used in: components/ui/projects/projects-sidebar.tsx, components/ui/projects/projects-content.tsx
import { LiquidGlassButton } from "@/components/ui/shared/liquid-glass-button";
import { Plus } from "lucide-react";

interface CreateProjectButtonProps {
  onClick?: () => void;
  size?: "default" | "lg";
  className?: string;
}

export function CreateProjectButton({
  onClick,
  size = "lg",
  className = "w-full group justify-start",
}: CreateProjectButtonProps) {
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
