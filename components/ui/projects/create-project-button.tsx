"use client";

// Reusable create project button component
// Used in: components/ui/projects/projects-sidebar.tsx, components/ui/projects/projects-content.tsx
import { Button } from "@/components/ui/shared/button";
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
    <Button
      variant="gradient"
      size={size}
      className={className}
      onClick={onClick}
    >
      <Plus
        size={18}
        className="mr-3 transition-transform group-hover:rotate-90"
      />
      Create Project
    </Button>
  );
}
