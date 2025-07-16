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
      variant="ghost"
      size={size}
      className={`${className} rounded-xl font-semibold shadow-md border-0 bg-blue-100/60 dark:bg-blue-900/40 hover:bg-blue-200/80 dark:hover:bg-blue-800/60 focus:ring-2 focus:ring-blue-400/40 text-blue-700 dark:text-blue-200 flex items-center transition-all duration-200`}
      style={{
        boxShadow: "0 0 0 2px #3b82f630, 0 0 16px #3b82f618",
        border: "1.5px solid #3b82f630",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow =
          "0 0 0 2px #3b82f680, 0 0 24px #3b82f640, 0 8px 32px rgba(0,0,0,0.10)";
        e.currentTarget.style.border = "1.5px solid #3b82f680";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow =
          "0 0 0 2px #3b82f630, 0 0 16px #3b82f618";
        e.currentTarget.style.border = "1.5px solid #3b82f630";
      }}
      onClick={onClick}
    >
      <Plus
        size={18}
        className="mr-3 text-blue-600 dark:text-blue-300 transition-transform group-hover:rotate-90"
      />
      Create Project
    </Button>
  );
}
