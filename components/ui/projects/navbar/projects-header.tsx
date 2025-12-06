"use client";

// Header component for the projects page - contains logo, search, and user controls
// Used in: app/projects/page.tsx
import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/shared/button";
import { Badge } from "@/components/ui/shared/badge";
import { getKeyboardShortcut } from "@/lib/utils";
import { SimpleThemeToggle } from "@/components/ui/shared/theme-toggle";
import { Search, Layers } from "lucide-react";
import Link from "next/link";

interface ProjectsHeaderProps {
  onCommandPaletteOpen: () => void;
  onSidebarToggle: () => void;
}

export function ProjectsHeader({
  onCommandPaletteOpen,
  onSidebarToggle,
}: ProjectsHeaderProps) {
  return (
    <header className="backdrop-blur-2xl bg-white/80 dark:bg-slate-950/80 border-b border-white/30 dark:border-slate-800/40 sticky top-0 z-50 shadow-lg">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          {/* Left section */}
          <div className="flex items-center space-x-3">
            <Link href="/projects" aria-label="Go to Projects Dashboard">
              <span className="inline-flex items-center space-x-2 cursor-pointer transition-transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-primary-400 rounded-md group">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg">
                  <Layers size={16} className="text-white" />
                </div>
                <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100 transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-primary-500 group-hover:via-primary-600 group-hover:to-accent-500 group-hover:bg-clip-text group-hover:text-transparent group-focus-visible:bg-gradient-to-r group-focus-visible:from-primary-500 group-focus-visible:via-primary-600 group-focus-visible:to-accent-500 group-focus-visible:bg-clip-text group-focus-visible:text-transparent">
                  StreamLn
                </h1>
              </span>
            </Link>
          </div>

          {/* Center - Command Palette Trigger */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <Button
              variant="outline"
              className="w-full justify-start text-slate-500 dark:text-slate-400 
                backdrop-blur-xl bg-white/50 dark:bg-slate-800/50 
                border border-white/40 dark:border-slate-700/40
                hover:bg-white/70 dark:hover:bg-slate-800/70 
                hover:border-white/50 dark:hover:border-slate-700/50
                shadow-md hover:shadow-lg transition-all duration-200"
              onClick={onCommandPaletteOpen}
            >
              <Search size={16} className="mr-3" />
              Search projects, create new...
              <Badge variant="outline" className="ml-auto text-xs backdrop-blur-sm bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/20">
                {getKeyboardShortcut("⌘K")}
              </Badge>
            </Button>
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden backdrop-blur-xl bg-white/40 dark:bg-slate-800/40 border border-white/30 dark:border-slate-700/30 hover:bg-white/60 dark:hover:bg-slate-800/60"
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
