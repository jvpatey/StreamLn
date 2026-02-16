"use client";

import { useState, useEffect, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { ProjectCommandPalette } from "@/components/ui/projects/command-palette";
import { ProjectsHeader } from "@/components/ui/projects/navbar";
import { ProjectsSidebar } from "@/components/ui/projects/sidebar";
import { ProjectsContent } from "@/components/ui/projects/project-content";
import { CreateProjectModal } from "@/components/ui/projects/project-content";
import { ProjectSkeletonGrid } from "@/components/ui/projects/project-content/project-skeleton";
import { ProjectDetailsSidepanel } from "@/components/ui/projects/details-sidepanel";
import { ProjectExportModal } from "@/components/ui/projects/canvas/project-export-modal";
import {
  fetchProjects,
  createProject,
  deleteProject,
  updateProjectStatus,
  updateProject,
} from "@/lib/api/projects";

export default function DashboardPage() {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [commandPaletteSearchMode, setCommandPaletteSearchMode] =
    useState(false);
  const [commandPaletteBrowseMode, setCommandPaletteBrowseMode] =
    useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [sidepanelOpen, setSidepanelOpen] = useState(false);
  const [exportModalProject, setExportModalProject] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [filterPopoverOpen, setFilterPopoverOpen] = useState(false);
  const { user } = useUser();
  const router = useRouter();

  // Projects state
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"updated" | "alpha">("updated");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "archived"
  >("all");

  // Fetch projects from API
  const loadProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchProjects();
      setProjects(data);
    } catch (err: any) {
      setError(err?.message || "Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  // Handler functions (defined before useEffect to avoid initialization errors)
  const handleCreateProject = useCallback(() => {
    setCommandPaletteOpen(false); // Close the command palette if open
    setCreateModalOpen(true);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandPaletteOpen(true);
        setCommandPaletteSearchMode(false);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "/") {
        e.preventDefault();
        setFilterPopoverOpen(true);
        setCommandPaletteOpen(false);
      }
      if (
        (e.metaKey || e.ctrlKey) &&
        e.shiftKey &&
        e.key.toLowerCase() === "s"
      ) {
        e.preventDefault();
        // Always reset states first
        setCommandPaletteSearchMode(false);
        setCommandPaletteBrowseMode(false);

        // If command palette is already open, just switch to search mode
        if (commandPaletteOpen) {
          setTimeout(() => {
            setCommandPaletteSearchMode(true);
          }, 0);
        } else {
          // Open command palette and set search mode
          setCommandPaletteOpen(true);
          setTimeout(() => {
            setCommandPaletteSearchMode(true);
          }, 0);
        }
      }
      if (
        (e.metaKey || e.ctrlKey) &&
        e.shiftKey &&
        e.key.toLowerCase() === "p"
      ) {
        e.preventDefault();
        handleCreateProject();
      }
      if (
        (e.metaKey || e.ctrlKey) &&
        e.shiftKey &&
        e.key.toLowerCase() === "b"
      ) {
        e.preventDefault();
        // Always reset states first
        setCommandPaletteSearchMode(false);
        setCommandPaletteBrowseMode(false);

        // If command palette is already open, just switch to browse mode
        if (commandPaletteOpen) {
          setTimeout(() => {
            setCommandPaletteBrowseMode(true);
          }, 0);
        } else {
          // Open command palette and set browse mode
          setCommandPaletteOpen(true);
          setTimeout(() => {
            setCommandPaletteBrowseMode(true);
          }, 0);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [sidebarOpen, commandPaletteOpen, handleCreateProject]);

  // API integration for creating a project
  const handleCreateProjectApi = async ({
    name,
    description,
    icon,
    canvasName,
  }: {
    name: string;
    description?: string;
    icon?: string;
    canvasName?: string;
  }) => {
    if (!user?.id)
      throw new Error("You must be signed in to create a project.");
    await createProject({ name, description, icon, canvasName });
    setCreateModalOpen(false);
    // Refetch projects after creating
    loadProjects();
  };

  // Sidepanel handlers
  const handleProjectClick = (project: any) => {
    // Open project details sidebar
    setSelectedProject(project);
    setSidepanelOpen(true);
  };

  const handleProjectDetails = (project: any) => {
    setSelectedProject(project);
    setSidepanelOpen(true);
  };

  const handleOpenCanvas = (project: any, canvasId?: string) => {
    if (canvasId) {
      router.push(`/projects/${project.id}/canvas/${canvasId}`);
    } else {
      router.push(`/projects/${project.id}`);
    }
  };

  const handleProjectDelete = async (projectId: string) => {
    try {
      await deleteProject(projectId);
      loadProjects();
      setSidepanelOpen(false);
      setSelectedProject(null);
    } catch (error) {
      console.error("Failed to delete project:", error);
    }
  };

  const handleProjectStatusChange = async (
    projectId: string,
    newStatus: string,
  ) => {
    const previousProjects = projects;
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId ? { ...p, status: newStatus } : p
      )
    );
    if (selectedProject?.id === projectId) {
      setSelectedProject({ ...selectedProject, status: newStatus });
    }
    try {
      await updateProjectStatus(projectId, newStatus);
    } catch (error) {
      console.error("Failed to update project status:", error);
      setProjects(previousProjects);
      if (selectedProject?.id === projectId) {
        setSelectedProject(selectedProject);
      }
    }
  };

  const handleProjectEdit = async (updatedProject: any) => {
    try {
      await updateProject(updatedProject.id, {
        name: updatedProject.name,
        description: updatedProject.description,
        icon: updatedProject.icon,
      });
      loadProjects();
      // Update selected project if it's the one being modified
      if (selectedProject && selectedProject.id === updatedProject.id) {
        setSelectedProject(updatedProject);
      }
    } catch (error) {
      console.error("Failed to update project:", error);
    }
  };

  // Handler for selecting a project from the command palette
  const handleProjectSelectFromPalette = (project) => {
    setSelectedProject(project);
    setSidepanelOpen(true);
    setCommandPaletteOpen(false);
  };

  // Filter and sort projects before rendering
  const filteredAndSortedProjects = projects
    .filter((project) => {
      if (statusFilter === "all") return true;
      if (statusFilter === "active") return project.status === "active";
      if (statusFilter === "archived") return project.status === "archived";
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "updated") {
        return (
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      } else if (sortBy === "alpha") {
        return a.name.localeCompare(b.name);
      } else if (sortBy === "status") {
        // Active first, then archived, then others
        const statusOrder = (status: string | undefined) => {
          if (status === "active") return 0;
          if (status === "archived") return 1;
          return 2;
        };
        return statusOrder(a.status) - statusOrder(b.status);
      }
      return 0;
    });

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-100 via-primary-50/40 to-slate-100 dark:from-[#0b0d17] dark:via-[#151c2e] dark:to-[#1e3a8a]">
      <CreateProjectModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onCreate={handleCreateProjectApi}
      />
      <ProjectDetailsSidepanel
        project={selectedProject}
        isOpen={sidepanelOpen}
        onClose={() => {
          setSidepanelOpen(false);
          setSelectedProject(null);
        }}
        onEdit={handleProjectEdit}
        onDelete={handleProjectDelete}
        onStatusChange={handleProjectStatusChange}
        onOpenCanvas={handleOpenCanvas}
        onExportProject={(p) => setExportModalProject({ id: p.id, name: p.name })}
      />

      <ProjectExportModal
        open={!!exportModalProject}
        onOpenChange={(open) => !open && setExportModalProject(null)}
        project={exportModalProject ?? { id: "", name: "" }}
      />
      {/* Header - sticky, always on top */}
      <div className="shrink-0 relative z-[60]">
        <ProjectsHeader
          onCommandPaletteOpen={() => setCommandPaletteOpen(true)}
          onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
        />
      </div>

      {/* Main Layout - flex row, content scrolls internally */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Sidebar */}
        <ProjectsSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onCommandPaletteOpen={() => setCommandPaletteOpen(true)}
          onCreateProject={handleCreateProject}
        />

        {/* Main Content Area - only this scrolls */}
        {loading ? (
          <div className="flex-1 min-h-0 overflow-y-auto">
            <div className="p-6 lg:p-8">
              <div className="mb-8">
                <div className="h-8 w-48 rounded-lg bg-slate-200/60 dark:bg-slate-700/60 mb-2 animate-pulse" />
                <div className="h-4 w-64 rounded bg-slate-200/60 dark:bg-slate-700/60 animate-pulse" />
              </div>
              <ProjectSkeletonGrid count={8} />
            </div>
          </div>
        ) : error ? (
          <div className="flex-1 flex items-center justify-center text-destructive-500 dark:text-destructive-400 text-lg min-h-0 overflow-y-auto">
            {error}
          </div>
        ) : (
          <div className="flex-1 min-h-0 overflow-y-auto">
          <ProjectsContent
            onCreateProject={handleCreateProject}
            projects={filteredAndSortedProjects}
            setProjects={setProjects}
            onProjectClick={handleProjectClick}
            onProjectDelete={handleProjectDelete}
            onProjectStatusChange={handleProjectStatusChange}
            onExportProject={(p) => setExportModalProject(p)}
            sortBy={sortBy}
            setSortBy={setSortBy}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            filterPopoverOpen={filterPopoverOpen}
            setFilterPopoverOpen={setFilterPopoverOpen}
          />
          </div>
        )}
      </div>

      {/* Command Palette */}
      <ProjectCommandPalette
        open={commandPaletteOpen}
        onOpenChange={(open) => {
          setCommandPaletteOpen(open);
          if (!open) {
            setCommandPaletteSearchMode(false);
            setCommandPaletteBrowseMode(false);
          }
        }}
        onCreateProject={handleCreateProject}
        initialSearchMode={commandPaletteSearchMode}
        initialBrowseMode={commandPaletteBrowseMode}
        projects={projects}
        onProjectSelect={handleProjectSelectFromPalette}
        openFilterPopover={() => setFilterPopoverOpen(true)}
      />
    </div>
  );
}
