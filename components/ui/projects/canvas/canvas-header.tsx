"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/shared/button";
import { Badge } from "@/components/ui/shared/badge";
import { getIconComponent } from "@/components/ui/projects/project-content/icon-picker";
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
            <Badge
              variant={project.status === "active" ? "success" : "subtle"}
              className="hidden sm:flex"
            >
              {project.status === "active" ? "Active" : "Archived"}
            </Badge>
          </div>

          {/* Center section - View Mode Toggle */}
          <div className="hidden md:flex items-center space-x-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
            <Button
              variant={viewMode === "edit" ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewModeChange("edit")}
              className="text-xs"
            >
              <Edit3 size={14} className="mr-1.5" />
              Edit
            </Button>
            <Button
              variant={viewMode === "present" ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewModeChange("present")}
              className="text-xs"
            >
              <Eye size={14} className="mr-1.5" />
              Present
            </Button>
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-2">
            {/* Quick Actions */}
            <div className="hidden sm:flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Users size={14} className="mr-2" />
                Share
              </Button>

              <Button variant="outline" size="sm">
                <Download size={14} className="mr-2" />
                Export
              </Button>
            </div>

            {/* Sidebar Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onSidebarToggle}
              className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
            >
              {sidebarOpen ? (
                <PanelLeftClose size={16} />
              ) : (
                <PanelLeftOpen size={16} />
              )}
            </Button>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 relative"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100" />
            </Button>

            {/* More Menu */}
            <Popover open={menuOpen} onOpenChange={setMenuOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                >
                  <MoreVertical size={16} />
                </Button>
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
                      Present Mode
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
