"use client";

import { useState, useEffect } from "react";
import ProjectCommandPalette from "@/components/ui/projects/project-command-palette";
import { ProjectsHeader } from "@/components/ui/projects/projects-header";
import { ProjectsSidebar } from "@/components/ui/projects/projects-sidebar";
import { ProjectsContent } from "@/components/ui/projects/projects-content";
import { CreateProjectModal } from "@/components/ui/projects/create-project-modal";

export default function DashboardPage() {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <CreateProjectModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onCreate={() => setCreateModalOpen(false)}
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
        <ProjectsContent onCreateProject={handleCreateProject} />
      </div>

      {/* Command Palette */}
      <ProjectCommandPalette
        open={commandPaletteOpen}
        onOpenChange={setCommandPaletteOpen}
      />
    </div>
  );
}
