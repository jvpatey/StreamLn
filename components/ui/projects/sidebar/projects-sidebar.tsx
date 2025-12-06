"use client";

// Sidebar component for the projects page - contains quick actions and navigation
// Used in: app/projects/page.tsx
import { Button } from "@/components/ui/shared/button";
import { Badge } from "@/components/ui/shared/badge";
import { getKeyboardShortcut } from "@/lib/utils";
import { Search, FileText, Zap, X, Sparkles } from "lucide-react";
import { CreateProjectButton } from "../project-content/create-project/create-project-button";

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
        } fixed lg:relative lg:translate-x-0 z-50 w-72 
        backdrop-blur-2xl bg-white/40 dark:bg-slate-900/30 
        border border-slate-300/60 dark:border-slate-600/50
        lg:rounded-[24px] lg:mt-2 lg:mb-2 lg:ml-2 lg:h-[calc(100%-1rem)] lg:max-h-[calc(100%-1rem)]
        transition-transform duration-300 ease-in-out overflow-y-auto hidden lg:block
        shadow-lg`}
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

            <div className="backdrop-blur-2xl bg-gradient-to-br from-primary-500/10 via-primary-400/15 to-accent-500/10 dark:from-primary-500/5 dark:via-primary-400/10 dark:to-accent-500/5 border border-white/30 dark:border-white/20 rounded-2xl p-4 space-y-3 shadow-lg">
              <Button
                variant="outline"
                className="w-full flex items-center justify-between h-10 px-3 font-medium
                  backdrop-blur-2xl 
                  bg-gradient-to-br from-primary-500/10 via-primary-400/15 to-accent-500/10 
                  dark:from-primary-500/5 dark:via-primary-400/10 dark:to-accent-500/5
                  border-white/30 dark:border-white/20
                  hover:from-primary-500/15 hover:via-primary-400/20 hover:to-accent-500/15
                  dark:hover:from-primary-500/8 dark:hover:via-primary-400/12 dark:hover:to-accent-500/8
                  focus:from-primary-500/15 focus:via-primary-400/20 focus:to-accent-500/15
                  dark:focus:from-primary-500/8 dark:focus:via-primary-400/12 dark:focus:to-accent-500/8
                  active:from-primary-500/15 active:via-primary-400/20 active:to-accent-500/15
                  dark:active:from-primary-500/8 dark:active:via-primary-400/12 dark:active:to-accent-500/8
                  hover:border-white/40 dark:hover:border-white/30
                  focus:border-white/40 dark:focus:border-white/30
                  shadow-lg hover:shadow-xl focus:shadow-xl
                  transition-all duration-200 rounded-full"
                onClick={onCommandPaletteOpen}
              >
                <span className="flex items-center">
                  <Sparkles size={16} className="mr-2 text-primary-500" />
                  Quick Actions
                </span>
                <Badge variant="outline" className="text-xs flex-shrink-0 backdrop-blur-sm bg-white/40 dark:bg-slate-800/40 border-white/30 dark:border-slate-700/30">
                  {getKeyboardShortcut("⌘K")}
                </Badge>
              </Button>

              {/* Pro tip */}
              <div className="p-3 rounded-2xl backdrop-blur-xl bg-white/20 dark:bg-slate-800/15 border border-white/25 dark:border-slate-700/25">
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
                        {getKeyboardShortcut("⌘K")}
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
