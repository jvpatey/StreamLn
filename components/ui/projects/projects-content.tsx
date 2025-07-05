"use client";

// Main content area for the projects page - contains project grid and header
// Used in: app/projects/page.tsx
import { Button } from "@/components/ui/shared/button";
import { Filter, Grid3x3 } from "lucide-react";
import { CreateProjectCard } from "./create-project-card";

interface ProjectsContentProps {
  onCreateProject?: () => void;
}

export function ProjectsContent({ onCreateProject }: ProjectsContentProps) {
  return (
    <div className="flex-1 min-h-screen">
      <div className="p-6 lg:p-8">
        {/* Content Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 space-y-4 sm:space-y-0">
          <div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              All Projects
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
              0 active projects
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm">
              <Filter size={16} className="mr-2" />
              Filter
            </Button>
            <Button variant="ghost" size="sm">
              <Grid3x3 size={16} className="mr-2" />
              View
            </Button>
          </div>
        </div>

        {/* Spatial Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
          {/* Create New Project Card */}
          <CreateProjectCard onClick={onCreateProject} />
        </div>
      </div>
    </div>
  );
}
