"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/shared/button";
import { Badge } from "@/components/ui/shared/badge";
import { LiquidGlassButton } from "@/components/ui/shared/liquid-glass-button";
import {
  LiquidGlassSurface,
  getLiquidGlassSurfaceClassName,
} from "@/components/ui/shared/liquid-glass-surface";
import { getIconComponent } from "@/components/ui/projects/project-content/icon-picker";
import { ProjectStatusBadge } from "@/components/ui/projects/shared";
import { useTheme } from "next-themes";
import {
  ArrowLeft,
  Layers,
  Eye,
  Edit3,
  Share2,
  Settings,
  Users,
  MoreVertical,
  PanelLeftOpen,
  PanelLeftClose,
  Download,
  BookOpen,
  Sun,
  Moon,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/shared/popover";
import React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cn } from "@/lib/utils";

function Tooltip({
  children,
  content,
}: {
  children: React.ReactNode;
  content: string;
}) {
  return (
    <TooltipPrimitive.Root delayDuration={200}>
      <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          side="bottom"
          align="center"
          className="z-50 rounded-md bg-slate-900/90 text-white px-3 py-1.5 text-xs shadow-lg animate-in fade-in-0"
        >
          {content}
          <TooltipPrimitive.Arrow className="fill-slate-900/90" />
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  );
}

interface Project {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  status: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface CanvasHeaderProps {
  project: Project;
  viewMode: "edit" | "present";
  onViewModeChange: (mode: "edit" | "present") => void;
  onSidebarToggle: () => void;
  sidebarOpen: boolean;
}

// Canvas header component used in the canvas page
export function CanvasHeader({
  project,
  viewMode,
  onViewModeChange,
  onSidebarToggle,
  sidebarOpen,
}: CanvasHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <LiquidGlassSurface asChild variant="header" intensity="2xl">
      <header>
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left section */}
            <div className="flex items-center space-x-4">
              {/* Back to Projects */}
              <Tooltip content="Back to Projects">
                <Link href="/projects">
                  <Button
                    variant="glass"
                    size="sm"
                    className="rounded-xl p-0 h-9 w-9 flex items-center justify-center"
                  >
                    <ArrowLeft
                      size={20}
                      className="text-slate-600 dark:text-slate-300"
                    />
                  </Button>
                </Link>
              </Tooltip>

              {/* Divider */}
              <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />

              {/* Project Info */}
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
                  {React.createElement(
                    getIconComponent(project.icon || "Folder"),
                    {
                      className: "h-5 w-5 text-primary",
                    }
                  )}
                </div>
                <div>
                  <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100 truncate max-w-[200px] sm:max-w-[300px]">
                    {project.name}
                  </h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Canvas • Updated {formatDate(project.updatedAt)}
                  </p>
                </div>
              </div>

              {/* Status Badge */}
              <div className="hidden sm:flex">
                <ProjectStatusBadge status={project.status} />
              </div>
            </div>

            {/* Center section - View Mode Toggle */}
            <div
              role="radiogroup"
              aria-label="View mode"
              className={cn(
                "hidden md:flex items-center p-1 gap-0.5 relative",
                getLiquidGlassSurfaceClassName({
                  variant: "toolbar",
                  intensity: "xl",
                  rounded: "2xl",
                  className: "inline-flex",
                })
              )}
            >
              {/* Sliding indicator */}
              <div
                className={cn(
                  "absolute left-1 top-1 h-9 w-24 rounded-xl pointer-events-none transition-transform duration-200 ease-out",
                  "bg-gradient-to-r from-primary-500/25 via-primary-400/30 to-accent-500/25 dark:from-primary-500/20 dark:via-primary-400/25 dark:to-accent-500/20",
                  "backdrop-blur-2xl",
                  "border border-white/30 dark:border-white/20",
                  "shadow-[0_8px_32px_rgba(59,130,246,0.2),0_2px_8px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.3)]",
                  "dark:shadow-[0_8px_32px_rgba(59,130,246,0.15),0_2px_8px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.1)]"
                )}
                style={{
                  transform:
                    viewMode === "present"
                      ? "translateX(calc(100% + 2px))"
                      : "translateX(0)",
                }}
              />
              <button
                type="button"
                role="radio"
                aria-checked={viewMode === "edit"}
                onClick={() => onViewModeChange("edit")}
                className={cn(
                  "relative z-10 text-xs rounded-xl h-9 w-24 flex items-center justify-center font-medium transition-colors duration-200",
                  viewMode === "edit"
                    ? "text-slate-900 dark:text-white"
                    : "text-slate-600 dark:text-slate-400 hover:bg-white/10 dark:hover:bg-slate-500/10 hover:text-slate-900 dark:hover:text-slate-100"
                )}
              >
                <Edit3 size={16} className="mr-2" />
                Edit
              </button>
              <button
                type="button"
                role="radio"
                aria-checked={viewMode === "present"}
                onClick={() => onViewModeChange("present")}
                className={cn(
                  "relative z-10 text-xs rounded-xl h-9 w-24 flex items-center justify-center font-medium transition-colors duration-200",
                  viewMode === "present"
                    ? "text-slate-900 dark:text-white"
                    : "text-slate-600 dark:text-slate-400 hover:bg-white/10 dark:hover:bg-slate-500/10 hover:text-slate-900 dark:hover:text-slate-100"
                )}
              >
                <Eye size={16} className="mr-2" />
                View
              </button>
            </div>

            {/* Right section */}
            <div className="flex items-center space-x-2">
              {/* Quick Actions */}
              <div className="hidden sm:flex items-center space-x-2">
                <LiquidGlassButton
                  gradient="blue"
                  size="sm"
                  className="rounded-xl h-9 px-4 flex items-center justify-center"
                >
                  <Users size={16} className="mr-2" />
                  Share
                </LiquidGlassButton>
                <LiquidGlassButton
                  gradient="blue"
                  size="sm"
                  className="rounded-xl h-9 px-4 flex items-center justify-center"
                >
                  <Download size={16} className="mr-2" />
                  Export
                </LiquidGlassButton>
              </div>
              {/* Sidebar Toggle */}
              <Tooltip content={sidebarOpen ? "Hide sidebar" : "Show sidebar"}>
                <Button
                  variant="glass"
                  size="sm"
                  onClick={onSidebarToggle}
                  className="rounded-xl p-0 h-9 w-9 flex items-center justify-center"
                >
                  {sidebarOpen ? (
                    <PanelLeftClose
                      size={20}
                      className="text-blue-600 dark:text-blue-300"
                    />
                  ) : (
                    <PanelLeftOpen
                      size={20}
                      className="text-blue-600 dark:text-blue-300"
                    />
                  )}
                </Button>
              </Tooltip>

              {/* Theme Toggle */}
              <Button
                variant="glass"
                size="sm"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="rounded-xl p-0 h-9 w-9 flex items-center justify-center relative"
              >
                <Sun
                  className={`h-5 w-5 rotate-0 scale-100 transition-all duration-300 ${
                    theme === "dark"
                      ? "dark:-rotate-90 dark:scale-0 text-yellow-400/60"
                      : "text-yellow-500"
                  }`}
                />
                <Moon
                  className={`absolute h-5 w-5 rotate-90 scale-0 transition-all duration-300 ${
                    theme === "dark"
                      ? "dark:rotate-0 dark:scale-100 text-blue-400"
                      : "text-blue-400/60"
                  }`}
                />
              </Button>

              {/* More Menu */}
              <Popover open={menuOpen} onOpenChange={setMenuOpen}>
                <PopoverTrigger asChild>
                  <Tooltip content="Canvas settings">
                    <Button
                      variant="glass"
                      size="sm"
                      className="rounded-xl p-0 h-9 w-9 flex items-center justify-center"
                    >
                      <MoreVertical
                        size={20}
                        className="text-purple-600 dark:text-purple-300"
                      />
                    </Button>
                  </Tooltip>
                </PopoverTrigger>
                <PopoverContent
                  align="end"
                  className={getLiquidGlassSurfaceClassName({
                    variant: "popover",
                    intensity: "xl",
                    rounded: "xl",
                    className: "w-48 p-2",
                  })}
                >
                  <div className="space-y-1">
                    {/* Mobile View Mode Toggle */}
                    <div
                      role="radiogroup"
                      aria-label="View mode"
                      className="md:hidden space-y-1 pb-2 border-b border-slate-200 dark:border-slate-700 mb-2"
                    >
                      <button
                        type="button"
                        role="radio"
                        aria-checked={viewMode === "edit"}
                        onClick={() => {
                          onViewModeChange("edit");
                          setMenuOpen(false);
                        }}
                        className={`w-full flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${
                          viewMode === "edit"
                            ? "bg-primary/10 text-primary"
                            : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                      >
                        <Edit3 size={14} className="mr-2" />
                        Edit Mode
                      </button>
                      <button
                        type="button"
                        role="radio"
                        aria-checked={viewMode === "present"}
                        onClick={() => {
                          onViewModeChange("present");
                          setMenuOpen(false);
                        }}
                        className={`w-full flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${
                          viewMode === "present"
                            ? "bg-primary/10 text-primary"
                            : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                      >
                        <Eye size={14} className="mr-2" />
                        View Mode
                      </button>
                    </div>

                    {/* Mobile Actions */}
                    <div className="sm:hidden space-y-1 pb-2 border-b border-slate-200 dark:border-slate-700 mb-2">
                      <button className="w-full flex items-center px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                        <Share2 size={14} className="mr-2" />
                        Share Canvas
                      </button>
                      <button className="w-full flex items-center px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                        <Download size={14} className="mr-2" />
                        Export Canvas
                      </button>
                    </div>

                    <button className="w-full flex items-center px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                      <BookOpen size={14} className="mr-2" />
                      Canvas Guide
                    </button>
                    <button className="w-full flex items-center px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                      <Settings size={14} className="mr-2" />
                      Canvas Settings
                    </button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      </header>
    </LiquidGlassSurface>
  );
}
