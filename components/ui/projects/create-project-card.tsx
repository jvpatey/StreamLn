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
    <div className="group relative">
      <Card
        className="h-full border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-primary-400 dark:hover:border-primary-600 transition-all duration-200 cursor-pointer bg-slate-50/50 dark:bg-slate-800/50 hover:bg-slate-100/50 dark:hover:bg-slate-700/50"
        onClick={onClick}
      >
        <div className="h-32 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
              <Plus
                size={20}
                className="text-primary-600 dark:text-primary-400"
              />
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              New Project
            </p>
          </div>
        </div>
        <div className="p-4">
          <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
            Click to create a new project workspace
          </p>
        </div>
      </Card>
    </div>
  );
}
