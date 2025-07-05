"use client";

// Main content area for the projects page - contains project grid and header
// Used in: app/projects/page.tsx
import { Button } from "@/components/ui/shared/button";
import { Filter, Grid3x3 } from "lucide-react";
import { CreateProjectCard } from "./create-project-card";
import { CreateProjectButton } from "./create-project-button";

interface ProjectsContentProps {
  onCreateProject?: () => void;
}

export function ProjectsContent({ onCreateProject }: ProjectsContentProps) {
  return (
    <div className="flex-1 min-h-screen">
      <div className="p-6 lg:p-8">
        {/* Mobile Project Hub Header */}
        <div className="lg:hidden mb-8">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mb-1">
            Project Hub
          </h2>
          <p className="text-sm text-slate-400 dark:text-slate-400 mb-4">
            Your central hub for creating, organizing, and managing all your
            projects with speed and efficiency.
          </p>
        </div>

        {/* Content Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 space-y-4 sm:space-y-0">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 sm:text-2xl">
              All Projects
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 sm:text-sm">
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

        {/* Mobile Create Project Button */}
        <div className="lg:hidden mb-6">
          <CreateProjectButton
            onClick={onCreateProject}
            className="w-full group justify-center"
          />
        </div>

        {/* Spatial Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
          {/* Create New Project Card - Hidden on mobile when no projects */}
          <div className="hidden lg:block">
            <CreateProjectCard onClick={onCreateProject} />
          </div>
        </div>
      </div>
    </div>
  );
}
