import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/shared/badge";
import { Button } from "@/components/ui/shared/button";
import { Search, Plus, Filter, Folder } from "lucide-react";

interface ProjectCommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const actions = [
  {
    id: "create-project",
    title: "Create Project",
    description: "Start a new project workspace",
    icon: <Plus size={16} />,
    shortcut: "⌘N",
    category: "Create",
    onSelect: () => {
      /* TODO: Implement create project */
    },
  },
  {
    id: "search-projects",
    title: "Search Projects",
    description: "Find a project by name or keyword",
    icon: <Search size={16} />,
    shortcut: "⌘K",
    category: "Search",
    onSelect: () => {
      /* TODO: Implement search */
    },
  },
  {
    id: "filter-projects",
    title: "Filter Projects",
    description: "Filter projects by status or type",
    icon: <Filter size={16} />,
    shortcut: "⌘F",
    category: "Filter",
    onSelect: () => {
      /* TODO: Implement filter */
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
      /* TODO: Implement browse */
    },
  },
];

const ProjectCommandPalette: React.FC<ProjectCommandPaletteProps> = ({
  open,
  onOpenChange,
}) => {
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const filteredActions = actions.filter(
    (action) =>
      action.title.toLowerCase().includes(search.toLowerCase()) ||
      action.description.toLowerCase().includes(search.toLowerCase()) ||
      action.category.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filteredActions.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex(
          (prev) => (prev - 1 + filteredActions.length) % filteredActions.length
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filteredActions[selectedIndex]) {
          filteredActions[selectedIndex].onSelect();
          onOpenChange(false);
          setSearch("");
          setSelectedIndex(0);
        }
      } else if (e.key === "Escape") {
        onOpenChange(false);
        setSearch("");
        setSelectedIndex(0);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, selectedIndex, filteredActions, onOpenChange]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

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
                  Project Command Palette
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Type to search, navigate with arrows, press Enter to select
                </p>
              </div>
            </div>
            <Badge variant="outline" className="hidden sm:flex">
              Projects
            </Badge>
          </div>

          {/* Search */}
          <div className="relative border-b border-slate-200 dark:border-slate-700">
            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search project commands..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent px-12 py-4 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 outline-none"
              autoFocus
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">
                {filteredActions.length} results
              </Badge>
            </div>
          </div>

          {/* Actions List */}
          <ul className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
            {filteredActions.length === 0 && (
              <li className="p-6 text-center text-slate-500 dark:text-slate-400 text-sm">
                No commands found.
              </li>
            )}
            {filteredActions.map((action, idx) => (
              <li
                key={action.id}
                className={`flex items-center px-6 py-4 cursor-pointer transition-colors duration-100 group ${
                  idx === selectedIndex
                    ? "bg-primary-50 dark:bg-primary-900/20"
                    : "hover:bg-slate-100 dark:hover:bg-slate-800/60"
                }`}
                onClick={() => {
                  action.onSelect();
                  onOpenChange(false);
                  setSearch("");
                  setSelectedIndex(0);
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
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProjectCommandPalette;
