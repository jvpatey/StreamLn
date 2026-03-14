"use client";

// Header component for the projects page - contains logo, search, and user controls
// Used in: app/projects/page.tsx
import dynamic from "next/dynamic";

const UserButton = dynamic(
  () => import("@clerk/nextjs").then((mod) => mod.UserButton),
  { ssr: false }
);
import { Button } from "@/components/ui/shared/button";
import { Badge } from "@/components/ui/shared/badge";
import { LiquidGlassButton } from "@/components/ui/shared/liquid-glass-button";
import { LiquidGlassSurface } from "@/components/ui/shared/liquid-glass-surface";
import { getKeyboardShortcut } from "@/lib/utils";
import { SimpleThemeToggle } from "@/components/ui/shared/theme-toggle";
import { Search, Layers, BookOpen } from "lucide-react";
import Link from "next/link";

interface ProjectsHeaderProps {
  onCommandPaletteOpen: () => void;
  onGuideOpen?: () => void;
}

export function ProjectsHeader({
  onCommandPaletteOpen,
  onGuideOpen,
}: ProjectsHeaderProps) {
  return (
    <LiquidGlassSurface asChild variant="header" intensity="2xl">
      <header className="animate-navbar-enter">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-14">
            {/* Left section */}
            <div className="flex items-center space-x-3 flex-1 min-w-0">
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
            <div className="hidden md:flex flex-1 justify-center min-w-0 px-4">
              <LiquidGlassButton
                gradient="primary"
                className="w-full max-w-lg justify-start text-slate-600 dark:text-slate-300 rounded-full"
                onClick={onCommandPaletteOpen}
              >
                <Search size={16} className="mr-3" />
                Search projects, create new...
                <Badge
                  variant="glass"
                  className="ml-auto text-xs px-2 py-1 border-white/25 dark:border-white/15"
                >
                  {getKeyboardShortcut("⌘K")}
                </Badge>
              </LiquidGlassButton>
            </div>

            {/* Right section */}
            <div className="flex items-center justify-end space-x-3 flex-1 min-w-0">
              <Button
                variant="glass"
                size="sm"
                className="md:hidden rounded-full"
                onClick={onCommandPaletteOpen}
              >
                <Search size={16} />
              </Button>
              {onGuideOpen && (
                <Button
                  variant="glass"
                  size="sm"
                  className="rounded-full"
                  onClick={onGuideOpen}
                  aria-label="Projects guide"
                  title="Projects guide"
                >
                  <BookOpen size={16} />
                </Button>
              )}
              <SimpleThemeToggle />
              <UserButton />
            </div>
          </div>
        </div>
      </header>
    </LiquidGlassSurface>
  );
}
