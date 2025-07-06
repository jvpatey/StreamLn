"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import ProjectCommandPalette from "@/components/ui/projects/project-command-palette";
import { ProjectsHeader } from "@/components/ui/projects/projects-header";
import { ProjectsSidebar } from "@/components/ui/projects/projects-sidebar";
import { ProjectsContent } from "@/components/ui/projects/projects-content";
import { CreateProjectModal } from "@/components/ui/projects/create-project-modal";
import { fetchProjects, createProject } from "@/lib/api/projects";

export default function DashboardPage() {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <CreateProjectModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onCreate={handleCreateProjectApi}
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
