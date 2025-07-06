"use client";

// Card component for creating new projects - displays in the projects grid
// Used in: components/ui/projects/projects-content.tsx
import { Card } from "@/components/ui/shared/card";
import { Plus } from "lucide-react";

interface CreateProjectCardProps {
  onClick?: () => void;
}

export function CreateProjectCard({ onClick }: CreateProjectCardProps) {
  return (
    <Card
      className="h-full min-h-[192px] flex flex-col justify-center items-center border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-primary-400 dark:hover:border-primary-600 transition-all duration-200 cursor-pointer bg-slate-50/50 dark:bg-slate-800/50 hover:bg-slate-100/50 dark:hover:bg-slate-700/50 rounded-2xl"
      onClick={onClick}
    >
      <div className="flex flex-col items-center justify-center flex-1 py-8">
        <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
          <Plus size={24} className="text-primary-600 dark:text-primary-400" />
        </div>
        <p className="text-base font-medium text-slate-700 dark:text-slate-200 mb-1">
          New Project
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
          Click to create a new project workspace
        </p>
      </div>
    </Card>
  );
}
