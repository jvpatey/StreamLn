"use client";

import { useState, useEffect } from "react";
import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/shared/button";
import { Badge } from "@/components/ui/shared/badge";
import { SimpleThemeToggle } from "@/components/ui/shared/theme-toggle";
import { Card } from "@/components/ui/shared/card";
import CommandPalette from "@/components/ui/projects/command-palette";
import { CanvasPreview } from "@/components/ui/projects/canvas-preview";
import {
  Plus,
  Search,
  Layers,
  FileText,
  Zap,
  Sparkles,
  Grid3x3,
  Menu,
  X,
  Filter,
} from "lucide-react";

export default function DashboardPage() {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "b") {
        e.preventDefault();
        setSidebarOpen(!sidebarOpen);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [sidebarOpen]);

  // Mock data for demonstration
  const recentProjects = [
    {
      id: "1",
      title: "E-commerce Platform Redesign",
      description:
        "Complete overhaul of the checkout experience and mobile interface",
      type: "development" as const,
      lastModified: "2 hours ago",
      tasksTotal: 24,
      tasksCompleted: 16,
      collaborators: 3,
      progress: 68,
      status: "active" as const,
      starred: true,
      shared: true,
      dueDate: "Dec 15, 2024",
    },
    {
      id: "2",
      title: "Market Research Analysis",
      description: "Competitive analysis and user research for Q1 planning",
      type: "research" as const,
      lastModified: "1 day ago",
      tasksTotal: 12,
      tasksCompleted: 5,
      collaborators: 1,
      progress: 45,
      status: "planning" as const,
      starred: false,
      shared: false,
      dueDate: "Jan 10, 2025",
    },
    {
      id: "3",
      title: "Bug Fix Sprint",
      description: "Critical bug fixes for the next release",
      type: "development" as const,
      lastModified: "3 days ago",
      tasksTotal: 8,
      tasksCompleted: 7,
      collaborators: 5,
      progress: 87,
      status: "review" as const,
      starred: false,
      shared: true,
      dueDate: "Dec 1, 2024",
    },
    {
      id: "4",
      title: "Documentation Overhaul",
      description: "Update all API docs and create developer guides",
      type: "documentation" as const,
      lastModified: "1 week ago",
      tasksTotal: 16,
      tasksCompleted: 15,
      collaborators: 2,
      progress: 95,
      status: "completed" as const,
      starred: true,
      shared: false,
      dueDate: "Nov 30, 2024",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Modern Header */}
      <header className="backdrop-blur-xl bg-white/80 dark:bg-slate-950/80 border-b border-slate-200/50 dark:border-slate-800/50 sticky top-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14">
            {/* Left section */}
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden"
              >
                <Menu size={18} />
              </Button>
              <div className="flex items-center space-x-3">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                  <Layers size={16} className="text-white" />
                </div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-slate-100 dark:via-slate-200 dark:to-slate-100 bg-clip-text text-transparent">
                  StreamLn
                </h1>
                <Badge
                  variant="outline"
                  className="hidden sm:inline-flex text-xs"
                >
                  <Sparkles size={10} className="mr-1" />
                  Project Hub
                </Badge>
              </div>
            </div>

            {/* Center - Command Palette Trigger */}
            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <Button
                variant="outline"
                className="w-full justify-start text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-700 border-dashed"
                onClick={() => setCommandPaletteOpen(true)}
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
                onClick={() => setCommandPaletteOpen(true)}
              >
                <Search size={16} />
              </Button>
              <SimpleThemeToggle />
              <UserButton />
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex relative">
        {/* Sidebar Overlay (Mobile) */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Collapsible Sidebar */}
        <div
          className={`${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } fixed lg:relative lg:translate-x-0 z-50 w-72 h-screen bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-800/50 transition-transform duration-300 ease-in-out overflow-y-auto`}
        >
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-200/50 dark:border-slate-800/50 lg:hidden">
            <h2 className="font-semibold text-slate-900 dark:text-slate-100">
              Menu
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
            >
              <X size={16} />
            </Button>
          </div>

          <div className="p-6">
            {/* Welcome Section */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                Welcome back! 👋
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Your project command center. Create, organize, and navigate with
                speed.
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
                onClick={() => setCommandPaletteOpen(true)}
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

        {/* Main Content Area */}
        <div className="flex-1 min-h-screen">
          <div className="p-6 lg:p-8">
            {/* Content Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 space-y-4 sm:space-y-0">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  All Projects
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                  {recentProjects.length} active projects
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Button variant="ghost" size="sm">
                  <Filter size={16} className="mr-2" />
                  Filter
                </Button>
                <Button variant="ghost" size="sm">
                  <Grid3x3 size={16} className="mr-2" />
                  View
                </Button>
              </div>
            </div>

            {/* Spatial Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
              {recentProjects.map((project, index) => (
                <div
                  key={project.id}
                  className="group relative"
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  <CanvasPreview
                    id={project.id}
                    title={project.title}
                    type={
                      project.type === "development"
                        ? "project"
                        : project.type === "research"
                        ? "notes"
                        : project.type === "documentation"
                        ? "notes"
                        : "project"
                    }
                    lastModified={project.lastModified}
                    blocks={project.tasksTotal}
                    collaborators={project.collaborators}
                    progress={project.progress}
                    starred={project.starred}
                    shared={project.shared}
                    onClick={() => {
                      console.log(`Opening project: ${project.title}`);
                    }}
                  />
                </div>
              ))}

              {/* Create New Project Card */}
              <div className="group relative">
                <Card className="h-full border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-primary-400 dark:hover:border-primary-600 transition-all duration-200 cursor-pointer bg-slate-50/50 dark:bg-slate-800/50 hover:bg-slate-100/50 dark:hover:bg-slate-700/50">
                  <div className="h-32 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                        <Plus
                          size={20}
                          className="text-primary-600 dark:text-primary-400"
                        />
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        New Project
                      </p>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                      Click to create a new project workspace
                    </p>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Command Palette */}
      <CommandPalette
        open={commandPaletteOpen}
        onOpenChange={setCommandPaletteOpen}
      />
    </div>
  );
}
