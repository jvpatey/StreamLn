"use client";

// Sidebar component for the projects page - contains quick actions and navigation
// Used in: app/projects/page.tsx
import { Button } from "@/components/ui/shared/button";
import { LiquidGlassSurface } from "@/components/ui/shared/liquid-glass-surface";
import { useRecentProjectIds } from "@/lib/hooks/use-recent-projects";
import { Upload, FolderOpen } from "lucide-react";
import { CreateProjectButton } from "../project-content/create-project/create-project-button";

interface Project {
  id: string;
  name: string;
}

interface ProjectsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProject?: () => void;
  onImportProject?: () => void;
  projects?: Project[];
  onOpenProject?: (project: Project) => void;
}

export function ProjectsSidebar({
  isOpen,
  onClose,
  onCreateProject,
  onImportProject,
  projects = [],
  onOpenProject,
}: ProjectsSidebarProps) {
  const recentIds = useRecentProjectIds();
  const recentProjects = recentIds
    .map((id) => projects.find((p) => p.id === id))
    .filter((p): p is Project => !!p)
    .slice(0, 5);
  return (
    <>
      {/* Collapsible Sidebar - Hidden on mobile. CSS animation runs immediately (before hydration). */}
      <div
        className={`${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } fixed lg:relative lg:translate-x-0 z-40 w-72 
        lg:rounded-[24px] lg:mt-2 lg:mb-2 lg:ml-2 lg:h-[calc(100vh-4.5rem)] lg:min-h-[calc(100vh-4.5rem)]
        transition-transform duration-300 ease-in-out overflow-hidden hidden lg:block
        animate-sidebar-enter`}
      >
        <LiquidGlassSurface
          variant="panel"
          intensity="2xl"
          className="w-full h-full overflow-y-auto lg:rounded-[24px]"
        >
        <div className="p-6">
          {/* Welcome Section */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-1">
              Project Hub
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-snug">
              Your central hub for creating, organizing, and managing all your
              projects with speed and efficiency.
            </p>
          </div>

          {/* Primary Actions */}
          <div className="space-y-3 mb-8">
            <CreateProjectButton
              variant="hero"
              onClick={onCreateProject}
              className="w-full"
            />
            {onImportProject && (
              <Button
                variant="outline"
                size="default"
                className="w-full justify-start rounded-full h-10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                onClick={onImportProject}
              >
                <Upload
                  size={16}
                  className="mr-3 text-slate-500 dark:text-slate-500"
                />
                Import Project
              </Button>
            )}
          </div>

          {/* Recent Projects */}
          {recentProjects.length > 0 && onOpenProject && (
            <div className="mb-8">
              <h3 className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                Recent
              </h3>
              <div className="space-y-1">
                {recentProjects.map((project) => (
                  <button
                    key={project.id}
                    type="button"
                    onClick={() => onOpenProject(project)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                  >
                    <FolderOpen
                      size={14}
                      className="shrink-0 text-slate-500 dark:text-slate-500"
                    />
                    <span className="truncate">{project.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </LiquidGlassSurface>
      </div>
    </>
  );
}
