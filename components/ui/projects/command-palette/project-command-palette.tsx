import React, { useState, useEffect, useRef } from "react";
import { Badge } from "@/components/ui/shared/badge";
import { Button } from "@/components/ui/shared/button";
import { Search, Plus, Filter, Folder, ArrowLeft } from "lucide-react";
import { getIconComponent } from "../project-content/icon-picker";

interface Project {
  id: string;
  name: string;
  description?: string;
  status?: string;
  icon?: string;
}

interface ProjectCommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateProject?: () => void;
  initialSearchMode?: boolean;
  projects: Project[];
  onProjectSelect?: (project: Project) => void;
  openFilterPopover?: () => void;
}

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
  const searchInputRef = useRef<HTMLInputElement>(null);

  const actions = [
    {
      id: "create-project",
      title: "Create Project",
      description: "Start a new project workspace",
      icon: <Plus size={16} />,
      shortcut: "⌘⇧P",
      category: "Create",
      onSelect: () => {
        onCreateProject?.();
      },
    },
    {
      id: "search-projects",
      title: "Search Projects",
      description: "Find a project by name or keyword",
      icon: <Search size={16} />,
      shortcut: "⌘/",
      category: "Search",
      onSelect: () => {
        setSearchMode(true);
        setSearch("");
        setTimeout(() => searchInputRef.current?.focus(), 0);
      },
    },
    {
      id: "filter-projects",
      title: "Filter Projects",
      description: "Filter projects by status or type",
      icon: <Filter size={16} />,
      shortcut: "⌘/",
      category: "Filter",
      onSelect: () => {
        openFilterPopover?.();
      },
    },
    {
      id: "browse-all",
      title: "Browse All Projects",
      description: "View all your projects",
      icon: <Folder size={16} />,
      shortcut: "⌘B",
      category: "Browse",
      onSelect: () => {
        setBrowseMode(true);
        setSearch("");
        setTimeout(() => searchInputRef.current?.focus(), 0);
      },
    },
  ];

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

  // For browse mode, show all projects, filtered by search
  const browseProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    if (!open) {
      setSearchMode(false);
      setBrowseMode(false);
      setSearch("");
      setSelectedIndex(0);
      return;
    }
    setSelectedIndex(0);
    setSearchMode(initialSearchMode);
    if (initialSearchMode) {
      setTimeout(() => searchInputRef.current?.focus(), 0);
    }
  }, [open, initialSearchMode]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [search, searchMode, browseMode]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        const listLength = browseMode
          ? browseProjects.length
          : searchMode
          ? filteredProjects.length
          : filteredActions.length;
        setSelectedIndex((prev) => (prev + 1) % listLength);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const listLength = browseMode
          ? browseProjects.length
          : searchMode
          ? filteredProjects.length
          : filteredActions.length;
        setSelectedIndex((prev) => (prev - 1 + listLength) % listLength);
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (browseMode) {
          if (browseProjects[selectedIndex] && onProjectSelect) {
            onProjectSelect(browseProjects[selectedIndex]);
            setSearch("");
            setSelectedIndex(0);
            setBrowseMode(false);
          }
        } else if (searchMode) {
          if (filteredProjects[selectedIndex] && onProjectSelect) {
            onProjectSelect(filteredProjects[selectedIndex]);
            setSearch("");
            setSelectedIndex(0);
            setSearchMode(false);
          }
        } else if (filteredActions[selectedIndex]) {
          filteredActions[selectedIndex].onSelect();
          if (
            filteredActions[selectedIndex].id !== "search-projects" &&
            filteredActions[selectedIndex].id !== "browse-all"
          ) {
            onOpenChange(false);
            setSearch("");
            setSelectedIndex(0);
          }
        }
      } else if (e.key === "Escape") {
        if (browseMode) {
          setBrowseMode(false);
          setSearch("");
          setSelectedIndex(0);
        } else if (searchMode) {
          setSearchMode(false);
          setSearch("");
          setSelectedIndex(0);
        } else {
          onOpenChange(false);
          setSearch("");
          setSelectedIndex(0);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    open,
    selectedIndex,
    filteredActions,
    filteredProjects,
    browseProjects,
    searchMode,
    browseMode,
    onOpenChange,
    onProjectSelect,
  ]);

  if (!open) return null;

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
          {/* Header */}
          <div className="flex items-center border-b border-slate-200 dark:border-slate-700 p-4">
            <div className="flex items-center space-x-3 flex-1">
              <div className="p-2 rounded-lg bg-gradient-to-br from-primary-500/10 to-accent-500/10">
                <Folder
                  size={20}
                  className="text-primary-600 dark:text-primary-400"
                />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                  {browseMode
                    ? "Browse All Projects"
                    : searchMode
                    ? "Search Projects"
                    : "Quick Actions"}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {browseMode
                    ? "Type to filter, navigate with arrows, press Enter to select"
                    : searchMode
                    ? "Type to search your projects. Press Esc or Back to return."
                    : "Type to search, navigate with arrows, press Enter to select"}
                </p>
              </div>
            </div>
            {searchMode || browseMode ? (
              <Button
                variant="ghost"
                size="icon"
                className="ml-2"
                onClick={() => {
                  if (browseMode) setBrowseMode(false);
                  if (searchMode) setSearchMode(false);
                  setSearch("");
                  setSelectedIndex(0);
                  setTimeout(() => searchInputRef.current?.focus(), 0);
                }}
                aria-label="Back to command palette"
              >
                <ArrowLeft size={18} />
              </Button>
            ) : (
              <Badge variant="outline" className="hidden sm:flex">
                Projects
              </Badge>
            )}
          </div>

          {/* Search */}
          <div className="relative border-b border-slate-200 dark:border-slate-700">
            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              ref={searchInputRef}
              type="text"
              placeholder={
                browseMode
                  ? "Filter projects..."
                  : searchMode
                  ? "Search projects..."
                  : "Search project commands..."
              }
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent px-12 py-4 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 outline-none"
              autoFocus
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">
                {browseMode
                  ? `${browseProjects.length} results`
                  : searchMode
                  ? `${filteredProjects.length} results`
                  : `${filteredActions.length} results`}
              </Badge>
            </div>
          </div>

          {/* Actions/Projects List */}
          <ul className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
            {browseMode ? (
              browseProjects.length === 0 ? (
                <li className="p-6 text-center text-slate-500 dark:text-slate-400 text-sm">
                  No projects found.
                </li>
              ) : (
                browseProjects.map((project, idx) => (
                  <li
                    key={project.id}
                    className={`flex items-center px-6 py-4 cursor-pointer transition-colors duration-100 group ${
                      idx === selectedIndex
                        ? "bg-primary-50 dark:bg-primary-900/20"
                        : "hover:bg-slate-100 dark:hover:bg-slate-800/60"
                    }`}
                    onClick={() => {
                      if (onProjectSelect) onProjectSelect(project);
                      setSearch("");
                      setSelectedIndex(0);
                      setBrowseMode(false);
                    }}
                    onMouseEnter={() => setSelectedIndex(idx)}
                  >
                    <div className="mr-4 flex-shrink-0">
                      {React.createElement(
                        getIconComponent(project.icon || "Folder"),
                        {
                          size: 18,
                          className: "text-primary-500",
                        }
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-slate-900 dark:text-slate-100">
                        {project.name}
                      </div>
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
                  </li>
                ))
              )
            ) : searchMode ? (
              filteredProjects.length === 0 ? (
                <li className="p-6 text-center text-slate-500 dark:text-slate-400 text-sm">
                  No projects found.
                </li>
              ) : (
                filteredProjects.map((project, idx) => (
                  <li
                    key={project.id}
                    className={`flex items-center px-6 py-4 cursor-pointer transition-colors duration-100 group ${
                      idx === selectedIndex
                        ? "bg-primary-50 dark:bg-primary-900/20"
                        : "hover:bg-slate-100 dark:hover:bg-slate-800/60"
                    }`}
                    onClick={() => {
                      if (onProjectSelect) onProjectSelect(project);
                      setSearch("");
                      setSelectedIndex(0);
                      setSearchMode(false);
                    }}
                    onMouseEnter={() => setSelectedIndex(idx)}
                  >
                    <div className="mr-4 flex-shrink-0">
                      <Folder size={16} />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-slate-900 dark:text-slate-100">
                        {project.name}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {project.description}
                      </div>
                    </div>
                  </li>
                ))
              )
            ) : filteredActions.length === 0 ? (
              <li className="p-6 text-center text-slate-500 dark:text-slate-400 text-sm">
                No commands found.
              </li>
            ) : (
              filteredActions.map((action, idx) => (
                <li
                  key={action.id}
                  className={`flex items-center px-6 py-4 cursor-pointer transition-colors duration-100 group ${
                    idx === selectedIndex
                      ? "bg-primary-50 dark:bg-primary-900/20"
                      : "hover:bg-slate-100 dark:hover:bg-slate-800/60"
                  }`}
                  onClick={() => {
                    action.onSelect();
                    if (
                      action.id !== "search-projects" &&
                      action.id !== "browse-all"
                    ) {
                      onOpenChange(false);
                      setSearch("");
                      setSelectedIndex(0);
                    }
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                >
                  <div className="mr-4 flex-shrink-0">{action.icon}</div>
                  <div className="flex-1">
                    <div className="font-medium text-slate-900 dark:text-slate-100">
                      {action.title}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {action.description}
                    </div>
                  </div>
                  <div className="ml-4">
                    <Badge variant="outline" className="text-xs">
                      {action.shortcut}
                    </Badge>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProjectCommandPalette;
