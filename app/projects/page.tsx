"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import ProjectCommandPalette from "@/components/ui/projects/project-command-palette";
import { ProjectsHeader } from "@/components/ui/projects/projects-header";
import { ProjectsSidebar } from "@/components/ui/projects/projects-sidebar";
import { ProjectsContent } from "@/components/ui/projects/projects-content";
import { CreateProjectModal } from "@/components/ui/projects/create-project-modal";
import { ProjectDetailsSidepanel } from "@/components/ui/projects/project-details-sidepanel";
import {
  fetchProjects,
  createProject,
  deleteProject,
  updateProjectStatus,
} from "@/lib/api/projects";

export default function DashboardPage() {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [sidepanelOpen, setSidepanelOpen] = useState(false);
  const { user } = useUser();

  // Projects state
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const handleCreateProject = () => {
    setCreateModalOpen(true);
  };

  // API integration for creating a project
  const handleCreateProjectApi = async ({
    name,
    description,
  }: {
    name: string;
    description?: string;
  }) => {
    if (!user?.id)
      throw new Error("You must be signed in to create a project.");
    await createProject({ userId: user.id, name, description });
    setCreateModalOpen(false);
    // Refetch projects after creating
    loadProjects();
  };

  // Sidepanel handlers
  const handleProjectClick = (project: any) => {
    setSelectedProject(project);
    setSidepanelOpen(true);
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
        onDelete={handleProjectDelete}
        onStatusChange={handleProjectStatusChange}
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
            projects={projects}
            setProjects={setProjects}
            onProjectClick={handleProjectClick}
            onProjectDelete={handleProjectDelete}
            onProjectStatusChange={handleProjectStatusChange}
          />
        )}
      </div>

      {/* Command Palette */}
      <ProjectCommandPalette
        open={commandPaletteOpen}
        onOpenChange={setCommandPaletteOpen}
      />
    </div>
  );
}
