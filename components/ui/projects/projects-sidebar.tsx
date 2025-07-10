"use client";

// Sidebar component for the projects page - contains quick actions and navigation
// Used in: app/projects/page.tsx
import { Button } from "@/components/ui/shared/button";
import { Badge } from "@/components/ui/shared/badge";
import { Search, FileText, Zap, X, Sparkles } from "lucide-react";
import { CreateProjectButton } from "./create-project-button";

interface ProjectsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onCommandPaletteOpen: () => void;
  onCreateProject?: () => void;
}

export function ProjectsSidebar({
  isOpen,
  onClose,
  onCommandPaletteOpen,
  onCreateProject,
}: ProjectsSidebarProps) {
  return (
    <>
      {/* Collapsible Sidebar - Hidden on mobile */}
      <div
        className={`${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } fixed lg:relative lg:translate-x-0 z-50 w-72 h-screen bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-800/50 transition-transform duration-300 ease-in-out overflow-y-auto hidden lg:block`}
      >
        <div className="p-6">
          {/* Welcome Section */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              Project Hub
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              Your central hub for creating, organizing, and managing all your
              projects with speed and efficiency.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="space-y-2 mb-8">
            <CreateProjectButton
              onClick={onCreateProject}
              className="mb-4 w-full"
            />

            <div className="bg-slate-50/60 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 rounded-lg p-4 space-y-3">
              <Button
                variant="outline"
                className="w-full flex items-center justify-between h-10 px-3 font-medium"
                onClick={onCommandPaletteOpen}
              >
                <span className="flex items-center">
                  <Sparkles size={16} className="mr-2 text-primary-500" />
                  Quick Actions
                </span>
                <Badge variant="outline" className="text-xs flex-shrink-0">
                  ⌘K
                </Badge>
              </Button>

              {/* Pro tip */}
              <div className="p-3 rounded-lg bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50">
                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-md bg-blue-50 dark:bg-blue-900/30">
                    <Zap
                      size={14}
                      className="text-blue-600 dark:text-blue-400"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-slate-900 dark:text-slate-100 text-sm mb-1">
                      Pro Tip
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      Use
                      <kbd className="px-1.5 py-0.5 text-xs font-mono bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded text-slate-700 dark:text-slate-300 ml-1">
                        ⌘K
                      </kbd>
                      {"\u00A0"}
                      to instantly access any project or create new content
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
