"use client";

// Sidebar component for the projects page - contains quick actions and navigation
// Used in: app/projects/page.tsx
import { Badge } from "@/components/ui/shared/badge";
import { LiquidGlassSurface } from "@/components/ui/shared/liquid-glass-surface";
import { LiquidGlassButton } from "@/components/ui/shared/liquid-glass-button";
import { getKeyboardShortcut } from "@/lib/utils";
import { Zap, Sparkles, Upload } from "lucide-react";
import { CreateProjectButton } from "../project-content/create-project/create-project-button";

interface ProjectsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onCommandPaletteOpen: () => void;
  onCreateProject?: () => void;
  onImportProject?: () => void;
}

export function ProjectsSidebar({
  isOpen,
  onClose,
  onCommandPaletteOpen,
  onCreateProject,
  onImportProject,
}: ProjectsSidebarProps) {
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
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
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
              className="mb-2 w-full"
            />
            {onImportProject && (
              <LiquidGlassButton
                variant="glass"
                size="lg"
                className="mb-4 w-full group justify-start"
                onClick={onImportProject}
              >
                <Upload
                  size={18}
                  className="mr-3 text-slate-600 dark:text-slate-400"
                />
                Import Project
              </LiquidGlassButton>
            )}

            <LiquidGlassSurface
              variant="panel"
              intensity="xl"
              rounded="2xl"
              className="p-4 space-y-3 bg-gradient-to-br from-primary-500/10 via-primary-400/15 to-accent-500/10 dark:from-primary-500/6 dark:via-primary-400/10 dark:to-accent-500/6"
            >
              <LiquidGlassButton
                gradient="primary"
                className="w-full flex items-center justify-between h-10 px-3 font-medium rounded-full"
                onClick={onCommandPaletteOpen}
              >
                <span className="flex items-center">
                  <Sparkles size={16} className="mr-2 text-primary-500" />
                  Quick Actions
                </span>
                <Badge
                  variant="glass"
                  className="text-xs flex-shrink-0 px-2 py-1"
                >
                  {getKeyboardShortcut("⌘K")}
                </Badge>
              </LiquidGlassButton>

              {/* Pro tip */}
              <LiquidGlassSurface
                variant="panel"
                intensity="md"
                rounded="2xl"
                className="p-3 bg-white/20 dark:bg-slate-800/15"
              >
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
                      to instantly access any project or create a new one
                    </p>
                  </div>
                </div>
              </LiquidGlassSurface>
            </LiquidGlassSurface>
          </div>
        </div>
      </LiquidGlassSurface>
      </div>
    </>
  );
}
