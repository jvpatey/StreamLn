import React from "react";
import { Search, Plus, Filter, Folder } from "lucide-react";
import { getKeyboardShortcut } from "@/lib/utils";
import { CommandAction } from "./types";

export const createCommandActions = (
  onCreateProject: (() => void) | undefined,
  openFilterPopover: (() => void) | undefined,
  setSearchMode: (mode: boolean) => void,
  setBrowseMode: (mode: boolean) => void,
  setSearch: (search: string) => void,
  searchInputRef?: React.RefObject<HTMLInputElement>
): CommandAction[] => [
  {
    id: "create-project",
    title: "Create Project",
    description: "Start a new project workspace",
    icon: <Plus size={16} />,
    shortcut: getKeyboardShortcut("⌘⇧P"),
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
    shortcut: getKeyboardShortcut("⌘/"),
    category: "Search",
    onSelect: () => {
      setSearchMode(true);
      setSearch("");
      setTimeout(() => searchInputRef?.current?.focus(), 0);
    },
  },
  {
    id: "filter-projects",
    title: "Filter Projects",
    description: "Filter projects by status or type",
    icon: <Filter size={16} />,
    shortcut: getKeyboardShortcut("⌘/"),
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
    shortcut: getKeyboardShortcut("⌘B"),
    category: "Browse",
    onSelect: () => {
      setBrowseMode(true);
      setSearch("");
      setTimeout(() => searchInputRef?.current?.focus(), 0);
    },
  },
];
