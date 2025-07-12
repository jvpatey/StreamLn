"use client";

import { useState, useEffect, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { ProjectCommandPalette } from "@/components/ui/projects/command-palette";
import { ProjectsHeader } from "@/components/ui/projects/navbar";
import { ProjectsSidebar } from "@/components/ui/projects/sidebar";
import { ProjectsContent } from "@/components/ui/projects/project-content";
import { CreateProjectModal } from "@/components/ui/projects/project-content";
import { ProjectDetailsSidepanel } from "@/components/ui/projects/details-sidepanel";
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
  }: {
    name: string;
    description?: string;
    icon?: string;
  }) => {
    if (!user?.id)
      throw new Error("You must be signed in to create a project.");
    await createProject({ userId: user.id, name, description, icon });
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

  const handleOpenCanvas = (project: any) => {
    // Navigate to canvas view
    router.push(`/projects/${project.id}`);
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
    newStatus: string
  ) => {
    try {
      await updateProjectStatus(projectId, newStatus);
      loadProjects();
      // Update selected project if it's the one being modified
      if (selectedProject && selectedProject.id === projectId) {
        setSelectedProject({ ...selectedProject, status: newStatus });
      }
    } catch (error) {
      console.error("Failed to update project status:", error);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
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
      />
      {/* Modern Header */}
      <ProjectsHeader
        onCommandPaletteOpen={() => setCommandPaletteOpen(true)}
        onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main Layout */}
      <div className="flex relative">
        {/* Sidebar */}
        <ProjectsSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onCommandPaletteOpen={() => setCommandPaletteOpen(true)}
          onCreateProject={handleCreateProject}
        />

        {/* Main Content Area */}
        {loading ? (
          <div className="flex-1 flex items-center justify-center text-slate-500 dark:text-slate-400 text-lg">
            Loading projects...
          </div>
        ) : error ? (
          <div className="flex-1 flex items-center justify-center text-destructive-500 dark:text-destructive-400 text-lg">
            {error}
          </div>
        ) : (
          <ProjectsContent
            onCreateProject={handleCreateProject}
            projects={filteredAndSortedProjects}
            setProjects={setProjects}
            onProjectClick={handleProjectClick}
            onProjectDelete={handleProjectDelete}
            onProjectStatusChange={handleProjectStatusChange}
            sortBy={sortBy}
            setSortBy={setSortBy}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            filterPopoverOpen={filterPopoverOpen}
            setFilterPopoverOpen={setFilterPopoverOpen}
          />
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
