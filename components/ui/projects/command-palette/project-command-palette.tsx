import React, { useState } from "react";
import { ProjectCommandPaletteProps } from "./types";
import { createCommandActions } from "./command-actions";
import { useCommandPalette } from "./use-command-palette";
import { CommandPaletteHeader } from "./command-palette-header";
import { SearchInput } from "./search-input";
import { ProjectListItem } from "./project-list-item";
import { ActionListItem } from "./action-list-item";

const ProjectCommandPalette: React.FC<ProjectCommandPaletteProps> = ({
  open,
  onOpenChange,
  onCreateProject,
  initialSearchMode = false,
  projects,
  onProjectSelect,
  openFilterPopover,
}) => {
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [searchMode, setSearchMode] = useState(false);
  const [browseMode, setBrowseMode] = useState(false);

  // Create command actions
  const actions = createCommandActions(
    onCreateProject,
    openFilterPopover,
    setSearchMode,
    setBrowseMode,
    setSearch,
    null // Will be set by the hook
  );

  // Filter data
  const filteredActions = actions.filter(
    (action) =>
      action.title.toLowerCase().includes(search.toLowerCase()) ||
      action.description.toLowerCase().includes(search.toLowerCase()) ||
      action.category.toLowerCase().includes(search.toLowerCase())
  );

  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(search.toLowerCase()) ||
      (project.description &&
        project.description.toLowerCase().includes(search.toLowerCase()))
  );

  const browseProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(search.toLowerCase())
  );

  // Custom hook for keyboard navigation
  const { searchInputRef } = useCommandPalette({
    open,
    initialSearchMode,
    projects,
    filteredActions,
    filteredProjects,
    browseProjects,
    searchMode,
    browseMode,
    selectedIndex,
    onOpenChange,
    onProjectSelect,
    setSearchMode,
    setBrowseMode,
    setSearch,
    setSelectedIndex,
  });

  // Update actions with the correct ref
  const actionsWithRef = createCommandActions(
    onCreateProject,
    openFilterPopover,
    setSearchMode,
    setBrowseMode,
    setSearch,
    searchInputRef
  );

  const filteredActionsWithRef = actionsWithRef.filter(
    (action) =>
      action.title.toLowerCase().includes(search.toLowerCase()) ||
      action.description.toLowerCase().includes(search.toLowerCase()) ||
      action.category.toLowerCase().includes(search.toLowerCase())
  );

  // Handlers
  const handleProjectSelect = (project: any) => {
    if (onProjectSelect) onProjectSelect(project);
    setSearch("");
    setSelectedIndex(0);
    setBrowseMode(false);
    setSearchMode(false);
  };

  const handleActionSelect = (action: any) => {
    action.onSelect();
    if (action.id !== "search-projects" && action.id !== "browse-all") {
      onOpenChange(false);
      setSearch("");
      setSelectedIndex(0);
    }
  };

  const handleBackClick = () => {
    if (browseMode) setBrowseMode(false);
    if (searchMode) setSearchMode(false);
    setSearch("");
    setSelectedIndex(0);
    setTimeout(() => searchInputRef.current?.focus(), 0);
  };

  const handleMouseEnter = (index: number) => {
    setSelectedIndex(index);
  };

  if (!open) return null;

  // Get current data based on mode
  const getCurrentData = () => {
    if (browseMode) return browseProjects;
    if (searchMode) return filteredProjects;
    return filteredActionsWithRef;
  };

  const currentData = getCurrentData();
  const resultCount = currentData.length;

  // Get placeholder text
  const getPlaceholder = () => {
    if (browseMode) return "Filter projects...";
    if (searchMode) return "Search projects...";
    return "Search project commands...";
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/50 dark:bg-slate-900/80 backdrop-blur-sm"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-4 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
          <CommandPaletteHeader
            browseMode={browseMode}
            searchMode={searchMode}
            onBackClick={handleBackClick}
          />

          <SearchInput
            search={search}
            onSearchChange={setSearch}
            placeholder={getPlaceholder()}
            resultCount={resultCount}
            searchInputRef={searchInputRef}
          />

          <ul className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
            {currentData.length === 0 ? (
              <li className="p-6 text-center text-slate-500 dark:text-slate-400 text-sm">
                {browseMode || searchMode
                  ? "No projects found."
                  : "No commands found."}
              </li>
            ) : browseMode || searchMode ? (
              currentData.map((project: any, idx: number) => (
                <ProjectListItem
                  key={project.id}
                  project={project}
                  index={idx}
                  selectedIndex={selectedIndex}
                  onSelect={handleProjectSelect}
                  onMouseEnter={handleMouseEnter}
                  showIcon={browseMode}
                  showStatus={browseMode}
                />
              ))
            ) : (
              currentData.map((action: any, idx: number) => (
                <ActionListItem
                  key={action.id}
                  action={action}
                  index={idx}
                  selectedIndex={selectedIndex}
                  onSelect={handleActionSelect}
                  onMouseEnter={handleMouseEnter}
                />
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProjectCommandPalette;
