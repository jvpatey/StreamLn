import { useState, useEffect, useRef } from "react";
import { Project, CommandAction } from "./types";

interface UseCommandPaletteProps {
  open: boolean;
  initialSearchMode: boolean;
  projects: Project[];
  filteredActions: CommandAction[];
  filteredProjects: Project[];
  browseProjects: Project[];
  searchMode: boolean;
  browseMode: boolean;
  selectedIndex: number;
  onOpenChange: (open: boolean) => void;
  onProjectSelect?: (project: Project) => void;
  setSearchMode: (mode: boolean) => void;
  setBrowseMode: (mode: boolean) => void;
  setSearch: (search: string) => void;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number>>;
}

export function useCommandPalette({
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
}: UseCommandPaletteProps) {
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Reset state when modal opens/closes
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
  }, [
    open,
    initialSearchMode,
    setSearchMode,
    setBrowseMode,
    setSearch,
    setSelectedIndex,
  ]);

  // Reset selected index when search or mode changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [searchMode, browseMode, setSelectedIndex]);

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return;

      const getListLength = () => {
        if (browseMode) return browseProjects.length;
        if (searchMode) return filteredProjects.length;
        return filteredActions.length;
      };

      const listLength = getListLength();

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % listLength);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + listLength) % listLength);
      } else if (e.key === "Enter") {
        e.preventDefault();
        handleEnterKey();
      } else if (e.key === "Escape") {
        handleEscapeKey();
      }
    };

    const handleEnterKey = () => {
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
        const action = filteredActions[selectedIndex];
        action.onSelect();
        if (action.id !== "search-projects" && action.id !== "browse-all") {
          onOpenChange(false);
          setSearch("");
          setSelectedIndex(0);
        }
      }
    };

    const handleEscapeKey = () => {
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
    setSearchMode,
    setBrowseMode,
    setSearch,
    setSelectedIndex,
  ]);

  return { searchInputRef };
}
