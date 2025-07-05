"use client";

// Sidebar component for the projects page - contains quick actions and navigation
// Used in: app/projects/page.tsx
import { Button } from "@/components/ui/shared/button";
import { Badge } from "@/components/ui/shared/badge";
import { Plus, Search, FileText, Zap, X } from "lucide-react";

interface ProjectsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onCommandPaletteOpen: () => void;
}

export function ProjectsSidebar({
  isOpen,
  onClose,
  onCommandPaletteOpen,
}: ProjectsSidebarProps) {
  return (
    <>
      {/* Sidebar Overlay (Mobile) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Collapsible Sidebar */}
      <div
        className={`${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } fixed lg:relative lg:translate-x-0 z-50 w-72 h-screen bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-800/50 transition-transform duration-300 ease-in-out overflow-y-auto`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200/50 dark:border-slate-800/50 lg:hidden">
          <h2 className="font-semibold text-slate-900 dark:text-slate-100">
            Menu
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X size={16} />
          </Button>
        </div>

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
            <Button
              variant="gradient"
              size="lg"
              className="w-full group justify-start"
            >
              <Plus
                size={18}
                className="mr-3 transition-transform group-hover:rotate-90"
              />
              Create Project
            </Button>

            <Button
              variant="outline"
              className="w-full group justify-start h-10"
              onClick={onCommandPaletteOpen}
            >
              <Search
                size={16}
                className="mr-3 transition-transform group-hover:scale-110"
              />
              Search & Command
              <Badge variant="outline" className="ml-auto text-xs">
                ⌘K
              </Badge>
            </Button>

            <Button
              variant="outline"
              className="w-full group justify-start h-10"
            >
              <FileText
                size={16}
                className="mr-3 transition-transform group-hover:scale-110"
              />
              Quick Note
              <Badge variant="outline" className="ml-auto text-xs">
                ⌘N
              </Badge>
            </Button>
          </div>

          {/* Pro tip */}
          <div className="p-4 rounded-lg bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50">
            <div className="flex items-start space-x-3">
              <div className="p-2 rounded-md bg-blue-50 dark:bg-blue-900/30">
                <Zap size={14} className="text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-slate-900 dark:text-slate-100 text-sm mb-1">
                  Pro Tip
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Use{" "}
                  <kbd className="px-1.5 py-0.5 text-xs font-mono bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded text-slate-700 dark:text-slate-300">
                    ⌘K
                  </kbd>{" "}
                  to instantly access any project or create new content
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
