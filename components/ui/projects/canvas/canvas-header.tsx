"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useUser, useClerk } from "@clerk/nextjs";
import { Button } from "@/components/ui/shared/button";
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
  Eye,
  Edit3,
  Share2,
  Settings,
  Users,
  Download,
  BookOpen,
  Sun,
  Moon,
  LogOut,
  Plus,
  ChevronDown,
  Pencil,
  Trash2,
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

interface CanvasItem {
  id: string;
  name: string;
  order: number;
  updatedAt?: string;
}

interface CanvasHeaderProps {
  project: Project;
  canvas?: CanvasItem;
  canvases?: CanvasItem[];
  viewMode: "edit" | "present";
  onViewModeChange: (mode: "edit" | "present") => void;
  onCanvasCreate?: () => void;
  onCanvasRename?: (canvasId: string, name: string) => void;
  onCanvasDelete?: (canvasId: string) => void;
}

// Canvas header component used in the canvas page
export function CanvasHeader({
  project,
  canvas,
  canvases = [],
  viewMode,
  onViewModeChange,
  onCanvasCreate,
  onCanvasRename,
  onCanvasDelete,
}: CanvasHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [canvasSwitcherOpen, setCanvasSwitcherOpen] = useState(false);
  const [renameCanvasId, setRenameCanvasId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { user } = useUser();
  const { signOut } = useClerk();

  const userName = user?.fullName ?? user?.firstName ?? "User";
  const userEmail = user?.primaryEmailAddress?.emailAddress ?? "";
  const userImage = user?.imageUrl ?? "";
  const userInitials = user?.firstName?.[0] && user?.lastName?.[0]
    ? `${user.firstName[0]}${user.lastName[0]}`
    : user?.firstName?.[0] ?? user?.emailAddresses?.[0]?.emailAddress?.[0] ?? "?";

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

              {/* Project Info + Canvas Switcher */}
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
                  {React.createElement(
                    getIconComponent(project.icon || "Folder"),
                    {
                      className: "h-5 w-5 text-primary",
                    }
                  )}
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3">
                  <div>
                    <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100 truncate max-w-[200px] sm:max-w-[300px]">
                      {project.name}
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {canvas
                        ? `${canvas.name} • Updated ${formatDate(canvas.updatedAt ?? project.updatedAt)}`
                        : `Canvas • Updated ${formatDate(project.updatedAt)}`}
                    </p>
                  </div>
                  {/* Canvas Switcher - when multiple canvases */}
                  {canvases.length > 0 && (
                    <Popover
                      open={canvasSwitcherOpen}
                      onOpenChange={(open) => {
                        setCanvasSwitcherOpen(open);
                        if (!open) {
                          setRenameCanvasId(null);
                        }
                      }}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="glass"
                          size="sm"
                          className="rounded-xl h-9 px-3 flex items-center gap-1.5 text-sm font-medium"
                        >
                          {canvas?.name ?? "Canvas"}
                          <ChevronDown size={14} />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        align="start"
                        className={getLiquidGlassSurfaceClassName({
                          variant: "popover",
                          intensity: "xl",
                          rounded: "xl",
                          className: "w-56 p-2",
                        })}
                      >
                        <div className="space-y-0.5 max-h-64 overflow-y-auto">
                          {canvases.map((c) => (
                            <div
                              key={c.id}
                              className={cn(
                                "flex items-center gap-2 rounded-lg px-3 py-2 group",
                                c.id === canvas?.id
                                  ? "bg-primary/10 text-primary"
                                  : "hover:bg-slate-100 dark:hover:bg-slate-800"
                              )}
                            >
                              {renameCanvasId === c.id ? (
                                <input
                                  type="text"
                                  value={renameValue}
                                  onChange={(e) => setRenameValue(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      onCanvasRename?.(c.id, renameValue.trim() || c.name);
                                      setRenameCanvasId(null);
                                    }
                                    if (e.key === "Escape") {
                                      setRenameCanvasId(null);
                                      setRenameValue(c.name);
                                    }
                                  }}
                                  onBlur={() => {
                                    if (renameValue.trim()) {
                                      onCanvasRename?.(c.id, renameValue.trim());
                                    }
                                    setRenameCanvasId(null);
                                  }}
                                  autoFocus
                                  className="flex-1 bg-transparent border-none outline-none text-sm"
                                />
                              ) : (
                                <>
                                  <button
                                    type="button"
                                    className="flex-1 text-left text-sm truncate"
                                    onClick={() => {
                                      if (c.id !== canvas?.id) {
                                        router.push(`/projects/${project.id}/canvas/${c.id}`);
                                        setCanvasSwitcherOpen(false);
                                      }
                                    }}
                                  >
                                    {c.name}
                                  </button>
                                  {onCanvasRename && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setRenameCanvasId(c.id);
                                        setRenameValue(c.name);
                                      }}
                                      className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700"
                                      aria-label="Rename canvas"
                                    >
                                      <Pencil size={12} />
                                    </button>
                                  )}
                                  {onCanvasDelete && canvases.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (c.id === canvas?.id && canvases[0]) {
                                          const next = canvases.find((x) => x.id !== c.id);
                                          if (next) router.push(`/projects/${project.id}/canvas/${next.id}`);
                                        }
                                        onCanvasDelete(c.id);
                                        setCanvasSwitcherOpen(false);
                                      }}
                                      className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-500/20 text-red-600 dark:text-red-400"
                                      aria-label="Delete canvas"
                                    >
                                      <Trash2 size={12} />
                                    </button>
                                  )}
                                </>
                              )}
                            </div>
                          ))}
                        </div>
                        {onCanvasCreate && (
                          <button
                            type="button"
                            onClick={() => {
                              onCanvasCreate();
                              setCanvasSwitcherOpen(false);
                            }}
                            className="w-full mt-2 flex items-center gap-2 px-3 py-2 text-sm text-primary hover:bg-primary/10 rounded-lg transition-colors"
                          >
                            <Plus size={14} />
                            Add canvas
                          </button>
                        )}
                      </PopoverContent>
                    </Popover>
                  )}
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
              {/* Sliding indicator - spring animation matches sidebar */}
              <motion.div
                className={cn(
                  "absolute left-1 top-1 h-9 w-32 rounded-xl pointer-events-none",
                  "bg-gradient-to-r from-primary-500/25 via-primary-400/30 to-accent-500/25 dark:from-primary-500/20 dark:via-primary-400/25 dark:to-accent-500/20",
                  "backdrop-blur-2xl",
                  "border border-white/30 dark:border-white/20",
                  "shadow-[0_8px_32px_rgba(59,130,246,0.2),0_2px_8px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.3)]",
                  "dark:shadow-[0_8px_32px_rgba(59,130,246,0.15),0_2px_8px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.1)]"
                )}
                animate={{
                  x: viewMode === "present" ? "calc(100% + 4px)" : 0,
                }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 30,
                }}
              />
              <button
                type="button"
                role="radio"
                aria-checked={viewMode === "edit"}
                onClick={() => onViewModeChange("edit")}
                className={cn(
                  "relative z-10 text-xs rounded-xl h-9 w-32 flex items-center justify-center font-medium transition-colors duration-200",
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
                  "relative z-10 text-xs rounded-xl h-9 w-32 flex items-center justify-center font-medium transition-colors duration-200",
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

              {/* User Menu (avatar trigger) */}
              <Popover open={menuOpen} onOpenChange={setMenuOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="glass"
                    size="sm"
                    className="rounded-full p-0 h-9 w-9 flex items-center justify-center overflow-hidden"
                    title="Account & canvas options"
                    aria-label="Account & canvas options"
                  >
                    {userImage ? (
                      <img
                        src={userImage}
                        alt={userName}
                        className="h-9 w-9 object-cover pointer-events-none"
                      />
                    ) : (
                      <span className="h-9 w-9 flex items-center justify-center rounded-full bg-primary/20 text-primary text-sm font-medium pointer-events-none">
                        {userInitials}
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  align="end"
                  className={getLiquidGlassSurfaceClassName({
                    variant: "popover",
                    intensity: "xl",
                    rounded: "xl",
                    className: "w-56 p-0 overflow-hidden",
                  })}
                >
                  {/* User info header */}
                  <div className="p-3 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                      {userImage ? (
                        <img
                          src={userImage}
                          alt={userName}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <span className="h-10 w-10 flex items-center justify-center rounded-full bg-primary/20 text-primary text-sm font-medium shrink-0">
                          {userInitials}
                        </span>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                          {userName}
                        </p>
                        {userEmail && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                            {userEmail}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="p-2">
                    {/* Mobile View Mode Toggle */}
                    <div
                      role="radiogroup"
                      aria-label="View mode"
                      className="md:hidden space-y-1 pb-2 mb-2 border-b border-slate-200 dark:border-slate-700"
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

                    {/* Back to Projects */}
                    <Link
                      href="/projects"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    >
                      <ArrowLeft size={14} className="mr-2 shrink-0" />
                      Back to Projects
                    </Link>

                    <div className="h-px bg-slate-200 dark:bg-slate-700 my-2" />

                    {/* Canvas actions */}
                    <button
                      type="button"
                      className="w-full flex items-center px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    >
                      <Share2 size={14} className="mr-2 shrink-0" />
                      Share Canvas
                    </button>
                    <button
                      type="button"
                      className="w-full flex items-center px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    >
                      <Download size={14} className="mr-2 shrink-0" />
                      Export Canvas
                    </button>
                    <button
                      type="button"
                      className="w-full flex items-center px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    >
                      <BookOpen size={14} className="mr-2 shrink-0" />
                      Canvas Guide
                    </button>
                    <button
                      type="button"
                      className="w-full flex items-center px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    >
                      <Settings size={14} className="mr-2 shrink-0" />
                      Canvas Settings
                    </button>

                    <div className="h-px bg-slate-200 dark:bg-slate-700 my-2" />

                    {/* Sign out */}
                    <button
                      type="button"
                      onClick={() => {
                        signOut();
                        setMenuOpen(false);
                      }}
                      className="w-full flex items-center px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    >
                      <LogOut size={14} className="mr-2 shrink-0" />
                      Sign out
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
