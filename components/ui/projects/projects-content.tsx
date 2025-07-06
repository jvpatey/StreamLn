"use client";

import { Button } from "@/components/ui/shared/button";
import { Filter, Grid3x3 } from "lucide-react";
import { CreateProjectCard } from "./create-project-card";
import { CreateProjectButton } from "./create-project-button";
import { ProjectCard } from "./project-card";
import React, { useState } from "react";
import { deleteProject, updateProjectStatus } from "@/lib/api/projects";

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
}

// Projects Content component, used in projects-page.tsx
export function ProjectsContent({
  onCreateProject,
  projects = [],
  setProjects,
  onProjectClick,
  onProjectDelete,
  onProjectStatusChange,
}: ProjectsContentProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [statusChangingId, setStatusChangingId] = useState<string | null>(null);

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

  const activeProjects = projects
    .filter((p) => (p.status || "active") === "active")
    .sort(
      (a, b) =>
        new Date(b.updatedAt || b.createdAt || 0).getTime() -
        new Date(a.updatedAt || a.createdAt || 0).getTime()
    );

  const archivedProjects = projects
    .filter((p) => p.status === "archived")
    .sort(
      (a, b) =>
        new Date(b.updatedAt || b.createdAt || 0).getTime() -
        new Date(a.updatedAt || a.createdAt || 0).getTime()
    );

  const sortedProjects = [...activeProjects, ...archivedProjects];

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

        {/* Mobile Create Project Button */}
        <div className="lg:hidden mb-6">
          <CreateProjectButton
            onClick={onCreateProject}
            className="w-full group justify-center"
          />
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
          {sortedProjects.map((project) => (
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
      </div>
    </div>
  );
}
