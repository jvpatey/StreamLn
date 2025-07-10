"use client";

import { Button } from "@/components/ui/shared/button";
import { Filter, Grid3x3, List as ListIcon } from "lucide-react";
import { CreateProjectCard } from "./create-project-card";
import { CreateProjectButton } from "./create-project-button";
import { ProjectCard } from "./project-card";
import React, { useState } from "react";
import { deleteProject, updateProjectStatus } from "@/lib/api/projects";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/shared/popover";
import FilterBar from "@/components/ui/projects/filter-bar";
import { getIconComponent } from "./icon-picker";

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
  progress?: number;
  updatedAt?: string;
  createdAt?: string;
  collaborators?: number;
  blocks?: number;
  userId?: string;
  icon?: string;
}

interface ProjectsContentProps {
  onCreateProject?: () => void;
  projects?: Project[];
  setProjects?: React.Dispatch<React.SetStateAction<Project[]>>;
  onProjectClick?: (project: Project) => void;
  onProjectDelete?: (projectId: string) => Promise<void>;
  onProjectStatusChange?: (
    projectId: string,
    newStatus: string
  ) => Promise<void>;
  sortBy: "updated" | "alpha";
  setSortBy: (val: "updated" | "alpha") => void;
  statusFilter: "all" | "active" | "archived";
  setStatusFilter: (val: "all" | "active" | "archived") => void;
  filterPopoverOpen: boolean;
  setFilterPopoverOpen: (open: boolean) => void;
}

// Projects Content component, used in projects-page.tsx
export function ProjectsContent({
  onCreateProject,
  projects = [],
  setProjects,
  onProjectClick,
  onProjectDelete,
  onProjectStatusChange,
  sortBy,
  setSortBy,
  statusFilter,
  setStatusFilter,
  filterPopoverOpen,
  setFilterPopoverOpen,
}: ProjectsContentProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [statusChangingId, setStatusChangingId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const activeCount = projects.filter(
    (p) => (p.status || "active") === "active"
  ).length;
  const archivedCount = projects.filter((p) => p.status === "archived").length;

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteProject(id);
      if (setProjects) {
        setProjects((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (err) {
      console.log("Failed to delete project", err);
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
          prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
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
            Your central hub for creating, organizing, and managing all your
            projects with speed and efficiency.
          </p>
        </div>

        {/* Content Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 space-y-4 sm:space-y-0">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 sm:text-2xl">
              All Projects
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 sm:text-sm">
              {activeCount} active project{activeCount === 1 ? "" : "s"}
              {archivedCount > 0 && <> &middot; {archivedCount} archived</>}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Popover
              open={filterPopoverOpen}
              onOpenChange={setFilterPopoverOpen}
            >
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Filter size={16} className="mr-2" />
                  Filter
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-4">
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
              >
                <Grid3x3 size={16} />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                aria-label="List view"
                onClick={() => setViewMode("list")}
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
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                id={project.id}
                name={project.name}
                type={project.description || "Project Workspace"}
                progress={
                  typeof project.progress === "number" ? project.progress : 0
                }
                lastModified={formatTimeAgo(project.updatedAt)}
                collaborators={
                  typeof project.collaborators === "number"
                    ? project.collaborators
                    : 1
                }
                blocks={typeof project.blocks === "number" ? project.blocks : 0}
                status={project.status || "active"}
                description={project.description}
                icon={project.icon}
                createdAt={project.createdAt || new Date().toISOString()}
                updatedAt={project.updatedAt || new Date().toISOString()}
                userId={project.userId || ""}
                onClick={() => onProjectClick?.(project)}
                onDelete={() =>
                  onProjectDelete?.(project.id) || handleDelete(project.id)
                }
                onStatusChange={(newStatus) =>
                  onProjectStatusChange?.(project.id, newStatus) ||
                  handleStatusChange(project.id, newStatus)
                }
              />
            ))}
            {/* Create New Project Card - Hidden on mobile when no projects */}
            <div className="hidden lg:block">
              <CreateProjectCard onClick={onCreateProject} />
            </div>
          </div>
        ) : (
          <div className="divide-y divide-slate-200 dark:divide-slate-700">
            {/* List View Headers */}
            <div className="flex items-center px-4 py-2 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/40 rounded-t-md">
              <div className="w-8" /> {/* Icon column */}
              <div className="flex-1 min-w-0">Name</div>
              <div className="w-24 text-center">Status</div>
              <div className="w-20 text-center">Actions</div>
            </div>
            {projects.map((project) => (
              <div
                key={project.id}
                className="flex items-center px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              >
                {/* Icon */}
                <div className="w-8 flex-shrink-0">
                  {React.createElement(
                    getIconComponent(project.icon || "Folder"),
                    {
                      size: 20,
                      className: "text-primary-500",
                    }
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
                  <div
                    className={`text-xs font-semibold ${
                      project.status === "archived"
                        ? "text-slate-500 dark:text-slate-400"
                        : "text-green-600 dark:text-green-400"
                    }`}
                  >
                    {project.status
                      ? project.status.charAt(0).toUpperCase() +
                        project.status.slice(1)
                      : "Active"}
                  </div>
                </div>
                {/* Actions */}
                <div className="w-20 text-center">
                  <Button
                    size="sm"
                    variant="outline"
                    className="font-semibold hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors"
                    onClick={() => onProjectClick?.(project)}
                  >
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
