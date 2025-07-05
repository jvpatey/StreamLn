"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/shared/button";
import { Badge } from "@/components/ui/shared/badge";
import {
  Command,
  Search,
  Plus,
  FileText,
  Maximize2,
  Layers,
  Network,
  Brain,
  Zap,
  Settings,
  User,
  Calendar,
  Clock,
  Hash,
  ArrowRight,
  Sparkles,
} from "lucide-react";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CommandPalette({
  open,
  onOpenChange,
}: CommandPaletteProps) {
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const commands = [
    {
      id: "new-canvas",
      title: "Create New Canvas",
      description: "Start with a blank infinite canvas",
      icon: <Plus size={16} />,
      badge: "Canvas",
      shortcut: "⌘N",
      category: "Create",
    },
    {
      id: "quick-note",
      title: "Quick Note",
      description: "Add a note block to your canvas",
      icon: <FileText size={16} />,
      badge: "Note",
      shortcut: "⌘⇧N",
      category: "Create",
    },
    {
      id: "task-board",
      title: "New Task Board",
      description: "Create a Kanban-style task board",
      icon: <Maximize2 size={16} />,
      badge: "Board",
      shortcut: "⌘B",
      category: "Create",
    },
    {
      id: "search",
      title: "Search Everything",
      description: "Semantic search across all content",
      icon: <Search size={16} />,
      badge: "Search",
      shortcut: "⌘K",
      category: "Navigate",
    },
    {
      id: "knowledge-graph",
      title: "Knowledge Graph",
      description: "Visualize connections between content",
      icon: <Network size={16} />,
      badge: "Graph",
      shortcut: "⌘G",
      category: "Navigate",
    },
    {
      id: "ai-copilot",
      title: "AI Copilot",
      description: "Get help with your canvas",
      icon: <Brain size={16} />,
      badge: "AI",
      shortcut: "⌘⇧A",
      category: "AI",
    },
    {
      id: "templates",
      title: "Browse Templates",
      description: "Start from pre-built canvas templates",
      icon: <Layers size={16} />,
      badge: "Templates",
      shortcut: "⌘T",
      category: "Browse",
    },
    {
      id: "settings",
      title: "Settings",
      description: "Configure your workspace",
      icon: <Settings size={16} />,
      badge: "Settings",
      shortcut: "⌘,",
      category: "System",
    },
  ];

  const filteredCommands = commands.filter(
    (command) =>
      command.title.toLowerCase().includes(search.toLowerCase()) ||
      command.description.toLowerCase().includes(search.toLowerCase()) ||
      command.category.toLowerCase().includes(search.toLowerCase())
  );

  const categories = Array.from(
    new Set(filteredCommands.map((cmd) => cmd.category))
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex(
          (prev) =>
            (prev - 1 + filteredCommands.length) % filteredCommands.length
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          // Handle command execution
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
  }, [open, selectedIndex, filteredCommands, onOpenChange]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 dark:bg-slate-900/80 backdrop-blur-sm">
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl">
        <div className="mx-4 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="flex items-center border-b border-slate-200 dark:border-slate-700 p-4">
            <div className="flex items-center space-x-3 flex-1">
              <div className="p-2 rounded-lg bg-gradient-to-br from-primary-500/10 to-accent-500/10">
                <Command
                  size={20}
                  className="text-primary-600 dark:text-primary-400"
                />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                  Command Palette
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Type to search, navigate with arrows, press Enter to select
                </p>
              </div>
            </div>
            <Badge variant="outline" className="hidden sm:flex">
              <Sparkles size={12} className="mr-1" />
              Smart
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
              placeholder="Search commands, canvases, or content..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent px-12 py-4 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 outline-none"
              autoFocus
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">
                {filteredCommands.length} results
              </Badge>
            </div>
          </div>

          {/* Results */}
          <div className="max-h-80 overflow-y-auto p-2">
            {categories.map((category, categoryIndex) => {
              const categoryCommands = filteredCommands.filter(
                (cmd) => cmd.category === category
              );

              return (
                <div key={category} className={categoryIndex > 0 ? "mt-4" : ""}>
                  <div className="px-3 py-2 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    {category}
                  </div>
                  <div className="space-y-1">
                    {categoryCommands.map((command, index) => {
                      const globalIndex = filteredCommands.indexOf(command);
                      const isSelected = globalIndex === selectedIndex;

                      return (
                        <div
                          key={command.id}
                          className={`group relative overflow-hidden rounded-lg p-3 cursor-pointer transition-all duration-150 ${
                            isSelected
                              ? "bg-gradient-to-r from-primary-500/10 to-accent-500/10 border border-primary-300 dark:border-primary-600"
                              : "hover:bg-slate-50 dark:hover:bg-slate-800"
                          }`}
                          onClick={() => {
                            onOpenChange(false);
                            setSearch("");
                            setSelectedIndex(0);
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div
                                className={`p-2 rounded-lg transition-all duration-200 ${
                                  isSelected
                                    ? "bg-gradient-to-br from-primary-500/20 to-accent-500/20 scale-110"
                                    : "bg-slate-100 dark:bg-slate-800 group-hover:bg-slate-200 dark:group-hover:bg-slate-700"
                                }`}
                              >
                                <span
                                  className={`transition-colors ${
                                    isSelected
                                      ? "text-primary-600 dark:text-primary-400"
                                      : "text-slate-600 dark:text-slate-400"
                                  }`}
                                >
                                  {command.icon}
                                </span>
                              </div>
                              <div>
                                <div
                                  className={`font-medium transition-colors ${
                                    isSelected
                                      ? "text-primary-900 dark:text-primary-100"
                                      : "text-slate-900 dark:text-slate-100"
                                  }`}
                                >
                                  {command.title}
                                </div>
                                <div className="text-sm text-slate-600 dark:text-slate-400">
                                  {command.description}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className="text-xs">
                                {command.badge}
                              </Badge>
                              <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                                {command.shortcut}
                              </div>
                              {isSelected && (
                                <ArrowRight
                                  size={16}
                                  className="text-primary-500 animate-pulse"
                                />
                              )}
                            </div>
                          </div>
                          {isSelected && (
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 opacity-100 transition-opacity duration-200" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="border-t border-slate-200 dark:border-slate-700 p-4">
            <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <kbd className="px-2 py-1 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded">
                    ↑↓
                  </kbd>
                  <span>Navigate</span>
                </div>
                <div className="flex items-center space-x-1">
                  <kbd className="px-2 py-1 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded">
                    ↵
                  </kbd>
                  <span>Select</span>
                </div>
                <div className="flex items-center space-x-1">
                  <kbd className="px-2 py-1 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded">
                    esc
                  </kbd>
                  <span>Close</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Zap size={14} className="text-accent-500" />
                <span>Powered by AI</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
