"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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
  LayoutGrid,
  FileText,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/shared/popover";
import React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cn } from "@/lib/utils";
import { CreateCanvasModal } from "./create-canvas-modal";
import { CanvasGuideModal } from "./canvas-guide-modal";
import { CanvasSettingsModal } from "./canvas-settings-modal";
import { SortableCanvasList, SortableCanvasItem } from "./sortable-canvas-list";
import {
  ExportDropdown,
  type DocumentEditorExportHandle,
} from "./export-dropdown";
import type { CanvasBlock } from "@/lib/types/canvas";

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
  projectId?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface DocumentItem {
  id: string;
  name: string;
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

interface CanvasHeaderProps {
  project: Project;
  canvas?: CanvasItem;
  canvases?: CanvasItem[];
  primaryMode: "canvas" | "document";
  onPrimaryModeChange: (mode: "canvas" | "document") => void;
  onCanvasCreate?: (name: string) => void;
  onCanvasRename?: (canvasId: string, name: string) => void;
  onCanvasDelete?: (canvasId: string) => void;
  onCanvasReorder?: (reordered: CanvasItem[]) => void;
  documents?: DocumentItem[];
  currentDocument?: DocumentItem | null;
  onDocumentSelect?: (documentId: string) => void;
  onDocumentCreate?: () => void;
  onDocumentRename?: (
    canvasId: string,
    documentId: string,
    name: string,
  ) => void;
  onDocumentDelete?: (canvasId: string, documentId: string) => void;
  onDocumentReorder?: (reordered: DocumentItem[]) => void;
  /** Opens export dropdown (e.g. from settings modal) */
  onExportClick?: () => void;
  blocks?: CanvasBlock[];
  onExportPNG?: () => void;
  onExportPDF?: () => void;
  documentEditorRef?: React.RefObject<DocumentEditorExportHandle | null>;
  exportDropdownOpen?: boolean;
  onExportDropdownOpenChange?: (open: boolean) => void;
  onShareClick?: () => void;
  showGrid?: boolean;
  onGridToggle?: () => void;
  zoomLevel?: number;
  onZoomChange?: (zoom: number) => void;
  sidebarOpen?: boolean;
  onSidebarOpenChange?: (open: boolean) => void;
  toolbarOpen?: boolean;
  onToolbarOpenChange?: (open: boolean) => void;
  lastSavedAt?: string | null;
}

// Canvas header component used in the canvas page
export function CanvasHeader({
  project,
  canvas,
  canvases = [],
  primaryMode,
  onPrimaryModeChange,
  onCanvasCreate,
  onCanvasRename,
  onCanvasDelete,
  onCanvasReorder,
  documents = [],
  currentDocument = null,
  onDocumentSelect,
  onDocumentCreate,
  onDocumentRename,
  onDocumentDelete,
  onDocumentReorder,
  onExportClick,
  blocks = [],
  onExportPNG,
  onExportPDF,
  documentEditorRef,
  exportDropdownOpen,
  onExportDropdownOpenChange,
  onShareClick,
  showGrid = true,
  onGridToggle,
  zoomLevel = 1,
  onZoomChange,
  sidebarOpen = true,
  onSidebarOpenChange,
  toolbarOpen = true,
  onToolbarOpenChange,
  lastSavedAt = null,
}: CanvasHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [canvasSwitcherOpen, setCanvasSwitcherOpen] = useState(false);
  const [createCanvasModalOpen, setCreateCanvasModalOpen] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [renameCanvasId, setRenameCanvasId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [renameDocumentId, setRenameDocumentId] = useState<string | null>(null);
  const [renameDocumentValue, setRenameDocumentValue] = useState("");
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [themeMounted, setThemeMounted] = useState(false);
  useEffect(() => {
    setThemeMounted(true);
  }, []);
  const { user } = useUser();
  const { signOut } = useClerk();

  const userName = user?.fullName ?? user?.firstName ?? "User";
  const userEmail = user?.primaryEmailAddress?.emailAddress ?? "";
  const userImage = user?.imageUrl ?? "";
  const userInitials =
    user?.firstName?.[0] && user?.lastName?.[0]
      ? `${user.firstName[0]}${user.lastName[0]}`
      : (user?.firstName?.[0] ??
        user?.emailAddresses?.[0]?.emailAddress?.[0] ??
        "?");

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <>
      <LiquidGlassSurface asChild variant="header" intensity="2xl">
        <header className="animate-navbar-enter">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-[1fr_auto_1fr] items-center h-16 gap-2 sm:gap-4 min-w-0">
              {/* Left section - Back | Project (prominent) | Canvas | Active */}
              <div className="flex items-center gap-2 sm:gap-4 min-w-0 overflow-hidden">
                <Tooltip content="Back to Projects">
                  <Link href="/projects">
                    <Button
                      variant="glass"
                      size="sm"
                      className="rounded-xl p-0 h-11 w-11 flex items-center justify-center shrink-0 text-xs"
                    >
                      <ArrowLeft
                        size={18}
                        className="text-slate-600 dark:text-slate-300"
                      />
                    </Button>
                  </Link>
                </Tooltip>
                <div className="h-11 w-px bg-slate-200 dark:bg-slate-700 shrink-0 hidden sm:block" />

                {/* Document mode: simplified (Back + project name only) */}
                <AnimatePresence mode="wait">
                {primaryMode === "document" ? (
                  <motion.div
                    key="document"
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 8 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="flex items-center min-w-0"
                  >
                  <Link
                    href={`/projects/${project.id}`}
                    className="flex items-center gap-3 h-11 rounded-xl px-4 min-w-0
                    border border-white/10 dark:border-white/10
                    bg-white/5 dark:bg-white/5 backdrop-blur-md
                    hover:bg-white/10 dark:hover:bg-slate-800/50 hover:border-white/20 dark:hover:border-white/20
                    transition-colors group"
                  >
                    <div className="p-1.5 rounded-lg bg-primary/10 dark:bg-primary/20 shrink-0">
                      {React.createElement(
                        getIconComponent(project.icon || "Folder"),
                        {
                          className:
                            "h-4 w-4 text-primary-600 dark:text-primary-400",
                        },
                      )}
                    </div>
                    <span className="text-lg font-bold text-slate-900 dark:text-slate-100 truncate">
                      {project.name}
                    </span>
                    <ProjectStatusBadge status={project.status} size="sm" />
                  </Link>
                  </motion.div>
                ) : (
                  /* Canvas mode: full breadcrumb dropdown */
                  <motion.div
                    key="canvas"
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="flex items-center min-w-0"
                  >
                  <Popover
                    open={canvasSwitcherOpen}
                    onOpenChange={(open) => {
                      setCanvasSwitcherOpen(open);
                      if (!open) {
                        setRenameCanvasId(null);
                        setRenameDocumentId(null);
                      }
                    }}
                  >
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className="flex items-center gap-3 h-11 rounded-xl px-4 min-w-0
                      border border-white/10 dark:border-white/10
                      bg-white/5 dark:bg-white/5 backdrop-blur-md
                      hover:bg-white/10 dark:hover:bg-slate-800/50 hover:border-white/20 dark:hover:border-white/20
                      focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:ring-inset
                      transition-colors group cursor-pointer"
                      >
                        <div className="p-1.5 rounded-lg bg-primary/10 dark:bg-primary/20 shrink-0">
                          {React.createElement(
                            getIconComponent(project.icon || "Folder"),
                            {
                              className:
                                "h-4 w-4 text-primary-600 dark:text-primary-400",
                            },
                          )}
                        </div>
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-lg font-bold text-slate-900 dark:text-slate-100 truncate">
                            {project.name}
                          </span>
                          <span className="text-slate-400 dark:text-slate-500 text-xs">
                            /
                          </span>
                          <span className="text-sm font-medium text-slate-600 dark:text-slate-300 truncate">
                            {canvas?.name ?? "Canvas"}
                          </span>
                        </div>
                        <ChevronDown
                          size={14}
                          className="text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 shrink-0"
                        />
                        <ProjectStatusBadge status={project.status} size="sm" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent
                      align="start"
                      className={getLiquidGlassSurfaceClassName({
                        variant: "popover",
                        intensity: "xl",
                        rounded: "xl",
                        className: "w-64 p-0 overflow-hidden",
                      })}
                    >
                      {/* Project header */}
                      <div className="p-3 border-b border-slate-200/50 dark:border-slate-700/50">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-md bg-primary/10 dark:bg-primary/20">
                            {React.createElement(
                              getIconComponent(project.icon || "Folder"),
                              {
                                className:
                                  "h-5 w-5 text-primary-600 dark:text-primary-400",
                              },
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-slate-100">
                              {project.name}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                              Updated{" "}
                              {formatDate(
                                canvas?.updatedAt ?? project.updatedAt,
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                      {/* Canvas list */}
                      <div className="p-2 max-h-64 overflow-y-auto">
                        {onCanvasReorder && canvases.length > 1 ? (
                          <SortableCanvasList
                            canvases={canvases}
                            onReorder={onCanvasReorder}
                          >
                            <div className="space-y-1">
                              {canvases.map((c) => (
                                <SortableCanvasItem
                                  key={c.id}
                                  id={c.id}
                                  className={cn(
                                    "rounded-lg px-3 py-2 group",
                                    c.id === canvas?.id
                                      ? "bg-primary/10 text-primary"
                                      : "hover:bg-slate-100 dark:hover:bg-slate-800",
                                  )}
                                  dragHandleClassName="shrink-0 cursor-grab active:cursor-grabbing p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:text-slate-300 dark:hover:bg-slate-700 touch-none opacity-60 hover:opacity-100"
                                >
                                  {renameCanvasId === c.id ? (
                                    <input
                                      type="text"
                                      value={renameValue}
                                      onChange={(e) =>
                                        setRenameValue(e.target.value)
                                      }
                                      onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                          onCanvasRename?.(
                                            c.id,
                                            renameValue.trim() || c.name,
                                          );
                                          setRenameCanvasId(null);
                                        }
                                        if (e.key === "Escape") {
                                          setRenameCanvasId(null);
                                          setRenameValue(c.name);
                                        }
                                      }}
                                      onBlur={() => {
                                        if (renameValue.trim()) {
                                          onCanvasRename?.(
                                            c.id,
                                            renameValue.trim(),
                                          );
                                        }
                                        setRenameCanvasId(null);
                                      }}
                                      autoFocus
                                      className="flex-1 bg-transparent border-none outline-none text-sm min-w-0"
                                    />
                                  ) : (
                                    <>
                                      <button
                                        type="button"
                                        className="flex-1 text-left text-sm truncate min-w-0"
                                        onClick={() => {
                                          if (c.id !== canvas?.id) {
                                            router.push(
                                              `/projects/${project.id}/canvas/${c.id}`,
                                            );
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
                                          className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 shrink-0"
                                          aria-label="Rename canvas"
                                        >
                                          <Pencil size={12} />
                                        </button>
                                      )}
                                      {onCanvasDelete &&
                                        canvases.length > 1 && (
                                          <button
                                            type="button"
                                            onClick={() => {
                                              if (c.id === canvas?.id) {
                                                const next = canvases.find(
                                                  (x) => x.id !== c.id,
                                                );
                                                if (next)
                                                  router.push(
                                                    `/projects/${project.id}/canvas/${next.id}`,
                                                  );
                                              }
                                              onCanvasDelete(c.id);
                                              setCanvasSwitcherOpen(false);
                                            }}
                                            className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-500/20 text-red-600 dark:text-red-400 shrink-0"
                                            aria-label="Delete canvas"
                                          >
                                            <Trash2 size={12} />
                                          </button>
                                        )}
                                    </>
                                  )}
                                </SortableCanvasItem>
                              ))}
                            </div>
                          </SortableCanvasList>
                        ) : (
                          canvases.map((c) => (
                            <div
                              key={c.id}
                              className={cn(
                                "flex items-center gap-2 rounded-lg px-3 py-2 group",
                                c.id === canvas?.id
                                  ? "bg-primary/10 text-primary"
                                  : "hover:bg-slate-100 dark:hover:bg-slate-800",
                              )}
                            >
                              {renameCanvasId === c.id ? (
                                <input
                                  type="text"
                                  value={renameValue}
                                  onChange={(e) =>
                                    setRenameValue(e.target.value)
                                  }
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      onCanvasRename?.(
                                        c.id,
                                        renameValue.trim() || c.name,
                                      );
                                      setRenameCanvasId(null);
                                    }
                                    if (e.key === "Escape") {
                                      setRenameCanvasId(null);
                                      setRenameValue(c.name);
                                    }
                                  }}
                                  onBlur={() => {
                                    if (renameValue.trim()) {
                                      onCanvasRename?.(
                                        c.id,
                                        renameValue.trim(),
                                      );
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
                                        router.push(
                                          `/projects/${project.id}/canvas/${c.id}`,
                                        );
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
                                        if (c.id === canvas?.id) {
                                          const next = canvases.find(
                                            (x) => x.id !== c.id,
                                          );
                                          if (next)
                                            router.push(
                                              `/projects/${project.id}/canvas/${next.id}`,
                                            );
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
                          ))
                        )}
                      </div>
                      {onCanvasCreate && (
                        <div className="p-2 border-t border-slate-200/50 dark:border-slate-700/50">
                          <button
                            type="button"
                            onClick={() => {
                              setCanvasSwitcherOpen(false);
                              setCreateCanvasModalOpen(true);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-primary hover:bg-primary/10 rounded-lg transition-colors"
                          >
                            <Plus size={14} />
                            Add canvas
                          </button>
                        </div>
                      )}
                    </PopoverContent>
                  </Popover>
                  </motion.div>
                )}
                </AnimatePresence>
              </div>

              {/* Center section - Primary mode (Canvas/Document) - fixed center position */}
              <div className="flex items-center justify-center">
                <div
                  role="radiogroup"
                  aria-label="Primary mode"
                  className={cn(
                    "hidden md:flex items-center p-1 gap-0.5 relative",
                    getLiquidGlassSurfaceClassName({
                      variant: "toolbar",
                      intensity: "xl",
                      rounded: "2xl",
                      className: "inline-flex",
                    }),
                  )}
                >
                  <motion.div
                    className={cn(
                      "absolute left-1 top-1 h-9 w-28 rounded-xl pointer-events-none",
                      "bg-gradient-to-r from-primary-500/25 via-primary-400/30 to-accent-500/25 dark:from-primary-500/20 dark:via-primary-400/25 dark:to-accent-500/20",
                      "backdrop-blur-2xl",
                      "border border-white/30 dark:border-white/20",
                      "shadow-[0_8px_32px_rgba(59,130,246,0.2),0_2px_8px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.3)]",
                      "dark:shadow-[0_8px_32px_rgba(59,130,246,0.15),0_2px_8px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.1)]",
                    )}
                    animate={{
                      x: primaryMode === "document" ? "calc(100% + 2px)" : 0,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 35,
                      mass: 0.8,
                    }}
                  />
                  <button
                    type="button"
                    role="radio"
                    aria-checked={primaryMode === "canvas"}
                    onClick={() => onPrimaryModeChange("canvas")}
                    className={cn(
                      "relative z-10 text-xs rounded-xl h-9 w-28 flex items-center justify-center gap-2 font-medium transition-colors duration-200 px-4",
                      primaryMode === "canvas"
                        ? "text-slate-900 dark:text-white"
                        : "text-slate-600 dark:text-slate-400 hover:bg-white/10 dark:hover:bg-slate-500/10 hover:text-slate-900 dark:hover:text-slate-100",
                    )}
                  >
                    <LayoutGrid size={16} className="shrink-0" />
                    Canvas
                  </button>
                  <button
                    type="button"
                    role="radio"
                    aria-checked={primaryMode === "document"}
                    onClick={() => onPrimaryModeChange("document")}
                    className={cn(
                      "relative z-10 text-xs rounded-xl h-9 w-28 flex items-center justify-center gap-2 font-medium transition-colors duration-200 px-4",
                      primaryMode === "document"
                        ? "text-slate-900 dark:text-white"
                        : "text-slate-600 dark:text-slate-400 hover:bg-white/10 dark:hover:bg-slate-500/10 hover:text-slate-900 dark:hover:text-slate-100",
                    )}
                  >
                    <FileText size={16} className="shrink-0" />
                    Document
                  </button>
                </div>
              </div>

              {/* Right section */}
              <div className="flex items-center gap-2 justify-end">
                {/* Quick Actions */}
                <div className="hidden sm:flex items-center gap-2">
                  <LiquidGlassButton
                    gradient="blue"
                    size="sm"
                    className="rounded-xl h-11 px-4 text-xs font-medium flex items-center justify-center"
                    onClick={onShareClick}
                  >
                    <Users size={14} className="mr-2" />
                    Share
                  </LiquidGlassButton>
                  <ExportDropdown
                    primaryMode={primaryMode}
                    currentDocument={currentDocument ?? null}
                    project={project}
                    canvas={{
                      id: canvas?.id ?? "",
                      name: canvas?.name ?? "",
                      order: canvas?.order ?? 0,
                      projectId: canvas?.projectId ?? project.id,
                      createdAt: canvas?.createdAt,
                      updatedAt: canvas?.updatedAt,
                    }}
                    blocks={blocks}
                    onExportPNG={onExportPNG}
                    onExportPDF={onExportPDF}
                    documentEditorRef={documentEditorRef}
                    open={exportDropdownOpen}
                    onOpenChange={onExportDropdownOpenChange}
                    trigger={
                      <LiquidGlassButton
                        gradient="blue"
                        size="sm"
                        className="rounded-xl h-11 px-4 text-xs font-medium flex items-center justify-center"
                      >
                        <Download size={14} className="mr-2" />
                        Export
                      </LiquidGlassButton>
                    }
                  />
                </div>

                {/* Theme Toggle - delay theme-dependent UI until mounted to avoid hydration mismatch */}
                <Button
                  variant="glass"
                  size="sm"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="rounded-xl p-0 h-11 w-11 flex items-center justify-center relative text-xs"
                >
                  {themeMounted ? (
                    <>
                      <Sun
                        className={`h-4 w-4 rotate-0 scale-100 transition-all duration-300 ${
                          theme === "dark"
                            ? "dark:-rotate-90 dark:scale-0 text-yellow-400/60"
                            : "text-yellow-500"
                        }`}
                      />
                      <Moon
                        className={`absolute h-4 w-4 rotate-90 scale-0 transition-all duration-300 ${
                          theme === "dark"
                            ? "dark:rotate-0 dark:scale-100 text-blue-400"
                            : "text-blue-400/60"
                        }`}
                      />
                    </>
                  ) : (
                    <>
                      <Sun className="h-4 w-4 rotate-0 scale-100 text-yellow-400/60" />
                      <Moon className="absolute h-4 w-4 rotate-90 scale-0 text-blue-400/60" />
                    </>
                  )}
                </Button>

                {/* User Menu (avatar trigger) */}
                <Popover open={menuOpen} onOpenChange={setMenuOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="glass"
                      size="sm"
                      className="rounded-full p-0 h-11 w-11 flex items-center justify-center overflow-hidden"
                      title="Account & canvas options"
                      aria-label="Account & canvas options"
                    >
                      {themeMounted && userImage ? (
                        <img
                          src={userImage}
                          alt={userName}
                          className="h-11 w-11 object-cover pointer-events-none"
                        />
                      ) : (
                        <span className="h-11 w-11 flex items-center justify-center rounded-full bg-primary/20 text-primary text-sm font-medium pointer-events-none">
                          {themeMounted ? userInitials : "?"}
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
                        {themeMounted && userImage ? (
                          <img
                            src={userImage}
                            alt={userName}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <span className="h-10 w-10 flex items-center justify-center rounded-full bg-primary/20 text-primary text-sm font-medium shrink-0">
                            {themeMounted ? userInitials : "?"}
                          </span>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                            {themeMounted ? userName : "User"}
                          </p>
                          {themeMounted && userEmail && (
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                              {userEmail}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="p-2">
                      {/* Mobile Primary Mode Toggle */}
                      <div
                        role="radiogroup"
                        aria-label="Primary mode"
                        className="md:hidden space-y-1 pb-2 mb-2 border-b border-slate-200 dark:border-slate-700"
                      >
                        <button
                          type="button"
                          role="radio"
                          aria-checked={primaryMode === "canvas"}
                          onClick={() => {
                            onPrimaryModeChange("canvas");
                            setMenuOpen(false);
                          }}
                          className={cn(
                            "w-full flex items-center px-3 py-2 text-sm rounded-lg transition-colors",
                            primaryMode === "canvas"
                              ? "bg-primary/10 text-primary"
                              : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800",
                          )}
                        >
                          <LayoutGrid size={14} className="mr-2" />
                          Canvas Mode
                        </button>
                        <button
                          type="button"
                          role="radio"
                          aria-checked={primaryMode === "document"}
                          onClick={() => {
                            onPrimaryModeChange("document");
                            setMenuOpen(false);
                          }}
                          className={cn(
                            "w-full flex items-center px-3 py-2 text-sm rounded-lg transition-colors",
                            primaryMode === "document"
                              ? "bg-primary/10 text-primary"
                              : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800",
                          )}
                        >
                          <FileText size={14} className="mr-2" />
                          Document Mode
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
                        onClick={() => {
                          onShareClick?.();
                          setMenuOpen(false);
                        }}
                        className="w-full flex items-center px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                      >
                        <Share2 size={14} className="mr-2 shrink-0" />
                        Share Canvas
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          onExportClick?.();
                          setMenuOpen(false);
                        }}
                        className="w-full flex items-center px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                      >
                        <Download size={14} className="mr-2 shrink-0" />
                        Export
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setGuideOpen(true);
                          setMenuOpen(false);
                        }}
                        className="w-full flex items-center px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                      >
                        <BookOpen size={14} className="mr-2 shrink-0" />
                        Canvas Guide
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSettingsOpen(true);
                          setMenuOpen(false);
                        }}
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
      {onCanvasCreate && (
        <CreateCanvasModal
          open={createCanvasModalOpen}
          onOpenChange={setCreateCanvasModalOpen}
          onCreate={onCanvasCreate}
        />
      )}
      <CanvasGuideModal open={guideOpen} onOpenChange={setGuideOpen} />
      <CanvasSettingsModal
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        canvas={canvas}
        onCanvasRename={onCanvasRename}
        showGrid={showGrid}
        onGridToggle={onGridToggle ?? (() => {})}
        zoomLevel={zoomLevel}
        onZoomChange={onZoomChange ?? (() => {})}
        sidebarOpen={sidebarOpen}
        onSidebarOpenChange={onSidebarOpenChange ?? (() => {})}
        toolbarOpen={toolbarOpen}
        onToolbarOpenChange={onToolbarOpenChange ?? (() => {})}
        lastSavedAt={lastSavedAt ?? null}
        onOpenGuide={() => setGuideOpen(true)}
        onShareClick={onShareClick}
        onExportClick={() => {
          setSettingsOpen(false);
          onExportClick?.();
        }}
      />
    </>
  );
}
