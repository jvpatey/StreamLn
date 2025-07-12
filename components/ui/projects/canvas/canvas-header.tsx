"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/shared/button";
import { Badge } from "@/components/ui/shared/badge";
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
    <header className="backdrop-blur-xl bg-white/80 dark:bg-slate-950/80 border-b border-slate-200/50 dark:border-slate-800/50 sticky top-0 z-50">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left section */}
          <div className="flex items-center space-x-4">
            {/* Back to Projects */}
            <Link href="/projects">
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
              >
                <ArrowLeft size={16} className="mr-2" />
                Projects
              </Button>
            </Link>

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
          <div className="hidden md:flex items-center space-x-2 p-1 rounded-lg">
            <Button
              variant={viewMode === "edit" ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewModeChange("edit")}
              className={`text-xs rounded-xl p-0 h-9 w-24 flex items-center justify-center shadow-md transition-colors duration-150
                ${
                  viewMode === "edit"
                    ? "bg-primary-600 hover:bg-primary-700 text-white"
                    : "bg-transparent hover:bg-primary-100 dark:hover:bg-primary-900/40 text-primary-600 dark:text-primary-300 hover:text-primary-600 dark:hover:text-primary-300"
                }
              `}
            >
              <Edit3
                size={16}
                className={`mr-2 ${
                  viewMode === "edit"
                    ? "text-white"
                    : "text-primary-700 dark:text-primary-300"
                }`}
              />
              Edit
            </Button>
            <Button
              variant={viewMode === "present" ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewModeChange("present")}
              className={`text-xs rounded-xl p-0 h-9 w-24 flex items-center justify-center shadow-md transition-colors duration-150
                ${
                  viewMode === "present"
                    ? "bg-primary-600 hover:bg-primary-700 text-white"
                    : "bg-transparent hover:bg-primary-100 dark:hover:bg-primary-900/40 text-primary-600 dark:text-primary-300 hover:text-primary-600 dark:hover:text-primary-300"
                }
              `}
            >
              <Eye
                size={16}
                className={`mr-2 ${
                  viewMode === "present"
                    ? "text-white"
                    : "text-primary-700 dark:text-primary-300"
                }`}
              />
              View
            </Button>
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-2">
            {/* Quick Actions */}
            <div className="hidden sm:flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className="rounded-xl p-0 h-9 px-4 flex items-center justify-center shadow-md bg-blue-100/60 dark:bg-blue-900/40 hover:bg-blue-200/80 dark:hover:bg-blue-800/60 text-blue-600 dark:text-blue-300 focus:ring-2 focus:ring-blue-400/40"
              >
                <Users
                  size={16}
                  className="mr-2 text-blue-600 dark:text-blue-300"
                />
                Share
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-xl p-0 h-9 px-4 flex items-center justify-center shadow-md bg-blue-100/60 dark:bg-blue-900/40 hover:bg-blue-200/80 dark:hover:bg-blue-800/60 text-blue-600 dark:text-blue-300 focus:ring-2 focus:ring-blue-400/40"
              >
                <Download
                  size={16}
                  className="mr-2 text-blue-600 dark:text-blue-300"
                />
                Export
              </Button>
            </div>
            {/* Sidebar Toggle */}
            <Tooltip content={sidebarOpen ? "Hide sidebar" : "Show sidebar"}>
              <Button
                variant="ghost"
                size="sm"
                onClick={onSidebarToggle}
                className="rounded-xl p-0 h-9 w-9 flex items-center justify-center shadow-md border-0 bg-blue-100/60 dark:bg-blue-900/40 hover:bg-blue-200/80 dark:hover:bg-blue-800/60 focus:ring-2 focus:ring-blue-400/40"
                style={{
                  boxShadow: "0 0 0 2px #3b82f630, 0 0 8px #3b82f620",
                }}
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
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-xl p-0 h-9 w-9 flex items-center justify-center shadow-md border-0 bg-yellow-100/60 dark:bg-blue-900/40 hover:bg-yellow-200/80 dark:hover:bg-blue-800/60 focus:ring-2 focus:ring-yellow-400/40 relative"
              style={{
                boxShadow:
                  theme === "dark"
                    ? "0 0 0 2px #3b82f630, 0 0 8px #3b82f620"
                    : "0 0 0 2px #f59e0b30, 0 0 8px #f59e0b20",
              }}
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
                    variant="ghost"
                    size="sm"
                    className="rounded-xl p-0 h-9 w-9 flex items-center justify-center shadow-md border-0 bg-purple-100/60 dark:bg-purple-900/40 hover:bg-purple-200/80 dark:hover:bg-purple-800/60 focus:ring-2 focus:ring-purple-400/40"
                    style={{
                      boxShadow: "0 0 0 2px #a78bfa30, 0 0 8px #a78bfa20",
                    }}
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
                className="w-48 p-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-700 shadow-xl rounded-xl"
              >
                <div className="space-y-1">
                  {/* Mobile View Mode Toggle */}
                  <div className="md:hidden space-y-1 pb-2 border-b border-slate-200 dark:border-slate-700 mb-2">
                    <button
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
  );
}
