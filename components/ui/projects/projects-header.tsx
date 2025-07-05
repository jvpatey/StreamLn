"use client";

// Header component for the projects page - contains logo, search, and user controls
// Used in: app/projects/page.tsx
import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/shared/button";
import { Badge } from "@/components/ui/shared/badge";
import { SimpleThemeToggle } from "@/components/ui/shared/theme-toggle";
import { Search, Layers } from "lucide-react";

interface ProjectsHeaderProps {
  onCommandPaletteOpen: () => void;
  onSidebarToggle: () => void;
}

export function ProjectsHeader({
  onCommandPaletteOpen,
  onSidebarToggle,
}: ProjectsHeaderProps) {
  return (
    <header className="backdrop-blur-xl bg-white/80 dark:bg-slate-950/80 border-b border-slate-200/50 dark:border-slate-800/50 sticky top-0 z-50">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          {/* Left section */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                <Layers size={16} className="text-white" />
              </div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-slate-100 dark:via-slate-200 dark:to-slate-100 bg-clip-text text-transparent">
                StreamLn
              </h1>
            </div>
          </div>

          {/* Center - Command Palette Trigger */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <Button
              variant="outline"
              className="w-full justify-start text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-700 border-dashed"
              onClick={onCommandPaletteOpen}
            >
              <Search size={16} className="mr-3" />
              Search projects, create new...
              <Badge variant="outline" className="ml-auto text-xs">
                ⌘K
              </Badge>
            </Button>
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={onCommandPaletteOpen}
            >
              <Search size={16} />
            </Button>
            <SimpleThemeToggle />
            <UserButton />
          </div>
        </div>
      </div>
    </header>
  );
}
