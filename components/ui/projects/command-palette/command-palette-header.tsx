import React from "react";
import { Button } from "@/components/ui/shared/button";
import { Badge } from "@/components/ui/shared/badge";
import { Folder, ArrowLeft } from "lucide-react";

interface CommandPaletteHeaderProps {
  browseMode: boolean;
  searchMode: boolean;
  onBackClick: () => void;
}

export function CommandPaletteHeader({
  browseMode,
  searchMode,
  onBackClick,
}: CommandPaletteHeaderProps) {
  const getTitle = () => {
    if (browseMode) return "Browse All Projects";
    if (searchMode) return "Search Projects";
    return "Quick Actions";
  };

  const getDescription = () => {
    if (browseMode)
      return "Type to filter, navigate with arrows, press Enter to select";
    if (searchMode)
      return "Type to search your projects. Press Esc or Back to return.";
    return "Type to search, navigate with arrows, press Enter to select";
  };

  return (
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
            {getTitle()}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {getDescription()}
          </p>
        </div>
      </div>
      {searchMode || browseMode ? (
        <Button
          variant="ghost"
          size="icon"
          className="ml-2"
          onClick={onBackClick}
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
  );
}
