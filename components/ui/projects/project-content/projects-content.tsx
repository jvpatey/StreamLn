"use client";

import { Button } from "@/components/ui/shared/button";
import { Filter, Grid3x3, List as ListIcon, Plus } from "lucide-react";
import { CreateProjectCard } from "./create-project/create-project-card";
import { CreateProjectListRow } from "./create-project/create-project-list-row";
import { CreateProjectButton } from "./create-project/create-project-button";
import { ProjectCard } from "./project-card";
import { ProjectCardMenu } from "./project-card-menu";
import React, { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { deleteProject, updateProjectStatus } from "@/lib/api/projects";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/shared/popover";
import { FilterBar } from "@/components/ui/projects/navbar";
import { getIconComponent } from "./icon-picker";
import { ProjectStatusText } from "@/components/ui/projects/shared";
import { getKeyboardShortcut } from "@/lib/utils";

function formatTimeAgo(dateString?: string) {
  if (!dateString) return "—";
  const date = new Date(dateString);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;
  return date.toLocaleDateString();
}

interface Project {
  id: string;
  name: string;
  description?: string;
  status?: string;
  updatedAt?: string;
  createdAt?: string;
  blocks?: number;
  canvasCount?: number;
  userId?: string;
  icon?: string;
}

interface ProjectsContentProps {
  onCreateProject?: () => void;
  projects?: Project[];
  totalProjectCount?: number;
  setProjects?: React.Dispatch<React.SetStateAction<Project[]>>;
  onProjectClick?: (project: Project) => void;
  onProjectDelete?: (projectId: string) => Promise<void>;
  onProjectStatusChange?: (
    projectId: string,
    newStatus: string,
  ) => Promise<void>;
  onExportProject?: (project: { id: string; name: string }) => void;
  sortBy: "updated" | "alpha";
  setSortBy: (val: "updated" | "alpha") => void;
  statusFilter: "all" | "active" | "archived";
  setStatusFilter: (val: "all" | "active" | "archived") => void;
  filterPopoverOpen: boolean;
  setFilterPopoverOpen: (open: boolean) => void;
  viewMode?: "grid" | "list";
  onViewModeChange?: (mode: "grid" | "list") => void;
}

// Projects Content component, used in projects-page.tsx
export function ProjectsContent({
  onCreateProject,
  projects = [],
  totalProjectCount,
  setProjects,
  onProjectClick,
  onProjectDelete,
  onProjectStatusChange,
  onExportProject,
  sortBy,
  setSortBy,
  statusFilter,
  setStatusFilter,
  filterPopoverOpen,
  setFilterPopoverOpen,
  viewMode: viewModeProp,
  onViewModeChange,
}: ProjectsContentProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [statusChangingId, setStatusChangingId] = useState<string | null>(null);
  const [viewModeLocal, setViewModeLocal] = useState<"grid" | "list">("grid");
  const isControlled = viewModeProp !== undefined && onViewModeChange !== undefined;
  const viewMode = isControlled ? viewModeProp : viewModeLocal;
  const setViewMode = isControlled ? onViewModeChange : setViewModeLocal;
  const shouldReduceMotion = useReducedMotion();

  const activeCount = projects.filter(
    (p) => (p.status || "active") === "active",
  ).length;
  const archivedCount = projects.filter((p) => p.status === "archived").length;

  const headingText =
    statusFilter === "active"
      ? "Active Projects"
      : statusFilter === "archived"
        ? "Archived Projects"
        : "All Projects";

  const filterButtonLabel =
    statusFilter !== "all"
      ? `Filter · ${statusFilter === "active" ? "Active" : "Archived"}`
      : sortBy !== "updated"
        ? `Filter · ${sortBy === "alpha" ? "Alphabetically" : "Status"}`
        : "Filter";

  const subtitleKey =
    statusFilter !== "all" && totalProjectCount != null
      ? `filtered-${statusFilter}-${sortBy}-${projects.length}-${totalProjectCount}`
      : `all-${sortBy}-${activeCount}-${archivedCount}`;

  const textTransition = shouldReduceMotion
    ? { duration: 0.01 }
    : { duration: 0.2, ease: "easeOut" as const };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    const projectToRestore = projects.find((p) => p.id === id);
    if (setProjects) {
      setProjects((prev) => prev.filter((p) => p.id !== id));
    }
    try {
      await deleteProject(id);
    } catch (err) {
      console.log("Failed to delete project", err);
      if (setProjects && projectToRestore) {
        setProjects((prev) => [...prev, projectToRestore]);
      }
    } finally {
      setDeletingId(null);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    setStatusChangingId(id);
    try {
      await updateProjectStatus(id, newStatus);
      if (setProjects) {
        setProjects((prev) =>
          prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p)),
        );
      }
    } catch (err) {
      console.log("Failed to update project status", err);
    } finally {
      setStatusChangingId(null);
    }
  };

  return (
    <div className="flex-1 min-h-screen">
      <div className="p-6 lg:p-8">
        {/* Mobile Project Hub Header */}
        <div className="lg:hidden mb-8">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mb-1">
            Project Hub
          </h2>
          <p className="text-sm text-slate-400 dark:text-slate-400 mb-4">
            Create and manage your projects in one place.
          </p>
        </div>

        {/* Content Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 space-y-4 sm:space-y-0">
          <div className="min-w-0">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 sm:text-2xl overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.span
                  key={headingText}
                  initial={
                    shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 6 }
                  }
                  animate={{ opacity: 1, y: 0 }}
                  exit={
                    shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -6 }
                  }
                  transition={textTransition}
                  className="inline-block"
                >
                  {headingText}
                </motion.span>
              </AnimatePresence>
            </h3>
            <p className="text-xs mt-1 sm:text-sm overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.span
                  key={subtitleKey}
                  initial={
                    shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 4 }
                  }
                  animate={{ opacity: 1, y: 0 }}
                  exit={
                    shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -4 }
                  }
                  transition={textTransition}
                  className="inline-block"
                >
                  {statusFilter !== "all" && totalProjectCount != null ? (
                    <span className="text-slate-600 dark:text-slate-400">
                      Showing {projects.length} of {totalProjectCount} project
                      {totalProjectCount === 1 ? "" : "s"}
                      {sortBy !== "updated" && (
                        <span className="text-slate-400 dark:text-slate-500">
                          {" · "}Sorted by{" "}
                          {sortBy === "alpha" ? "Alphabetically" : "Status"}
                        </span>
                      )}
                    </span>
                  ) : (
                    <>
                      <span className="text-emerald-600 dark:text-emerald-500">
                        {activeCount} active project
                        {activeCount === 1 ? "" : "s"}
                      </span>
                      {archivedCount > 0 && (
                        <>
                          <span className="text-slate-400 dark:text-slate-500">
                            {" "}
                            ·{" "}
                          </span>
                          <span className="text-slate-400 dark:text-slate-500">
                            {archivedCount} archived project
                            {archivedCount === 1 ? "" : "s"}
                          </span>
                        </>
                      )}
                      {sortBy !== "updated" && (
                        <span className="text-slate-400 dark:text-slate-500">
                          {" · "}Sorted by{" "}
                          {sortBy === "alpha" ? "Alphabetically" : "Status"}
                        </span>
                      )}
                    </>
                  )}
                </motion.span>
              </AnimatePresence>
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Popover
              open={filterPopoverOpen}
              onOpenChange={setFilterPopoverOpen}
            >
              <PopoverTrigger asChild>
                <Button
                  variant={
                    statusFilter !== "all" || sortBy !== "updated"
                      ? "default"
                      : "ghost"
                  }
                  size="sm"
                  className={
                    statusFilter === "all" && sortBy === "updated"
                      ? "backdrop-blur-md bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-slate-700/30 hover:bg-white/70 dark:hover:bg-slate-800/70 hover:border-white/40 dark:hover:border-slate-700/40 shadow-sm"
                      : ""
                  }
                >
                  <Filter size={16} className="mr-2 shrink-0" />
                  <span className="overflow-hidden inline-block min-w-[4ch]">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={filterButtonLabel}
                        initial={
                          shouldReduceMotion
                            ? { opacity: 1 }
                            : { opacity: 0, y: 4 }
                        }
                        animate={{ opacity: 1, y: 0 }}
                        exit={
                          shouldReduceMotion
                            ? { opacity: 1 }
                            : { opacity: 0, y: -4 }
                        }
                        transition={textTransition}
                        className="inline-block"
                      >
                        {filterButtonLabel}
                      </motion.span>
                    </AnimatePresence>
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-4 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-white/30 dark:border-slate-700/30">
                <FilterBar
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                  statusFilter={statusFilter}
                  setStatusFilter={setStatusFilter}
                />
              </PopoverContent>
            </Popover>
            <div className="flex items-center space-x-1">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                aria-label="Grid view"
                onClick={() => setViewMode("grid")}
                className={
                  viewMode === "grid"
                    ? ""
                    : "backdrop-blur-md bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-slate-700/30 hover:bg-white/70 dark:hover:bg-slate-800/70 hover:border-white/40 dark:hover:border-slate-700/40 shadow-sm"
                }
              >
                <Grid3x3 size={16} />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                aria-label="List view"
                onClick={() => setViewMode("list")}
                className={
                  viewMode === "list"
                    ? ""
                    : "backdrop-blur-md bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-slate-700/30 hover:bg-white/70 dark:hover:bg-slate-800/70 hover:border-white/40 dark:hover:border-slate-700/40 shadow-sm"
                }
              >
                <ListIcon size={16} />
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Create Project Button */}
        <div className="lg:hidden mb-6">
          <CreateProjectButton
            onClick={onCreateProject}
            className="w-full group justify-center"
          />
        </div>

        {/* Projects Grid or List */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
            <AnimatePresence mode="wait">
              {projects.length === 0 ? (
                <motion.div
                  key="empty-state"
                  initial={
                    shouldReduceMotion
                      ? { opacity: 1 }
                      : { opacity: 0, y: 16, scale: 0.98 }
                  }
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                  }}
                  exit={
                    shouldReduceMotion
                      ? { opacity: 1 }
                      : { opacity: 0, y: -12, scale: 0.98 }
                  }
                  transition={{
                    duration: shouldReduceMotion ? 0.01 : 0.35,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                  className="col-span-full flex flex-col items-center gap-6"
                >
                  <div className="hidden lg:block w-full max-w-md">
                    <CreateProjectCard onClick={onCreateProject} />
                  </div>
                  <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-700 rounded-2xl px-8 py-6 shadow-lg max-w-md w-full">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                      Welcome to StreamLn
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                      Get started by creating your first project or importing
                      from a backup.
                    </p>
                    <div className="space-y-2 text-xs text-slate-500 dark:text-slate-500">
                      <p>• Create Project — sidebar or card above</p>
                      <p>• Import from JSON — sidebar</p>
                      <p>
                        • Press {getKeyboardShortcut("⌘K")} to search and create
                      </p>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="projects-grid"
                  initial={
                    shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }
                  }
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={
                    shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -12 }
                  }
                  transition={{
                    duration: shouldReduceMotion ? 0.01 : 0.35,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                  className="col-span-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6"
                >
                  <AnimatePresence mode="popLayout">
                    {projects.map((project, index) => (
                      <ProjectCard
                        key={project.id}
                        index={index}
                        id={project.id}
                        name={project.name}
                        type={project.description || "Project Workspace"}
                        lastModified={formatTimeAgo(project.updatedAt)}
                        blocks={
                          typeof project.blocks === "number"
                            ? project.blocks
                            : 0
                        }
                        canvasCount={
                          typeof project.canvasCount === "number"
                            ? project.canvasCount
                            : 1
                        }
                        status={project.status || "active"}
                        description={project.description}
                        icon={project.icon}
                        createdAt={
                          project.createdAt || new Date().toISOString()
                        }
                        updatedAt={
                          project.updatedAt || new Date().toISOString()
                        }
                        userId={project.userId || ""}
                        onClick={() => onProjectClick?.(project)}
                        onDelete={() =>
                          onProjectDelete?.(project.id) ||
                          handleDelete(project.id)
                        }
                        onStatusChange={(newStatus) =>
                          onProjectStatusChange?.(project.id, newStatus) ||
                          handleStatusChange(project.id, newStatus)
                        }
                        onExportProject={() =>
                          onExportProject?.({
                            id: project.id,
                            name: project.name,
                          })
                        }
                      />
                    ))}
                  </AnimatePresence>
                  {/* Create New Project Card - Hidden on mobile when no projects */}
                  <div className="hidden lg:block">
                    <CreateProjectCard onClick={onCreateProject} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <div className="divide-y divide-slate-200 dark:divide-slate-700">
            {/* List View Headers */}
            <div className="flex items-center px-4 py-2 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/40 rounded-t-md">
              <div className="w-8" /> {/* Icon column */}
              <div className="flex-1 min-w-0">Name</div>
              <div className="w-24 text-center">Status</div>
              <div className="w-36 text-center">Actions</div>
            </div>
            {projects.length === 0 ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key="list-empty-state"
                  initial={
                    shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 }
                  }
                  animate={{ opacity: 1, y: 0 }}
                  exit={
                    shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -8 }
                  }
                  transition={{
                    duration: shouldReduceMotion ? 0.01 : 0.3,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                  className="flex flex-col items-center gap-6 py-12"
                >
                  <button
                    type="button"
                    onClick={onCreateProject}
                    className="flex items-center gap-4 w-full max-w-md px-6 py-4 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-primary-400 dark:hover:border-primary-500 bg-slate-50/50 dark:bg-slate-800/50 hover:bg-slate-100/50 dark:hover:bg-slate-700/50 transition-all duration-200 cursor-pointer group"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <Plus
                        size={20}
                        className="text-primary-600 dark:text-primary-400"
                      />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-slate-700 dark:text-slate-200">
                        Create Project
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Click to create a project workspace
                      </p>
                    </div>
                  </button>
                  <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-700 rounded-2xl px-8 py-6 shadow-lg max-w-md w-full">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                      Welcome to StreamLn
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                      Get started by creating your first project or importing
                      from a backup.
                    </p>
                    <div className="space-y-2 text-xs text-slate-500 dark:text-slate-500">
                      <p>• Create Project — button above or sidebar</p>
                      <p>• Import from JSON — sidebar</p>
                      <p>
                        • Press {getKeyboardShortcut("⌘K")} to search and create
                      </p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            ) : (
              <>
                <AnimatePresence mode="popLayout">
                  {projects.map((project, index) => (
                    <motion.div
                      key={project.id}
                      layout
                      initial={
                        shouldReduceMotion
                          ? { opacity: 1 }
                          : { opacity: 0, x: -8 }
                      }
                      animate={{ opacity: 1, x: 0 }}
                      exit={
                        shouldReduceMotion
                          ? { opacity: 1 }
                          : { opacity: 0, x: 8 }
                      }
                      transition={{
                        duration: shouldReduceMotion ? 0.01 : 0.25,
                        delay: shouldReduceMotion ? 0 : index * 0.04,
                        ease: [0.25, 0.46, 0.45, 0.94],
                      }}
                      className="flex items-center px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      {/* Icon */}
                      <div className="w-8 flex-shrink-0">
                        {React.createElement(
                          getIconComponent(project.icon || "Folder"),
                          {
                            size: 20,
                            className:
                              project.status === "archived"
                                ? "text-slate-400 dark:text-slate-500"
                                : "text-primary-500",
                          },
                        )}
                      </div>
                      {/* Name & Description */}
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-slate-900 dark:text-slate-100 truncate">
                          {project.name}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          {project.description}
                        </div>
                      </div>
                      {/* Status */}
                      <div className="w-24 text-center">
                        <ProjectStatusText
                          status={project.status || "active"}
                          size="sm"
                        />
                      </div>
                      {/* Actions */}
                      <div
                        className="w-36 flex items-center justify-center gap-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button
                          size="sm"
                          variant="outline"
                          className="font-semibold hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors shrink-0"
                          onClick={() => onProjectClick?.(project)}
                        >
                          View
                        </Button>
                        <ProjectCardMenu
                          triggerVariant="outline"
                          isArchived={project.status === "archived"}
                          onArchive={() =>
                            onProjectStatusChange?.(project.id, "archived") ||
                            handleStatusChange(project.id, "archived")
                          }
                          onUnarchive={() =>
                            onProjectStatusChange?.(project.id, "active") ||
                            handleStatusChange(project.id, "active")
                          }
                          onDelete={() =>
                            onProjectDelete?.(project.id) ||
                            handleDelete(project.id)
                          }
                          onExport={() =>
                            onExportProject?.({
                              id: project.id,
                              name: project.name,
                            })
                          }
                        />
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {/* Create Project row - dotted outline, matches grid card */}
                <div className="px-4 pt-4 pb-2">
                  <CreateProjectListRow onClick={onCreateProject} />
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
