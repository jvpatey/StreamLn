import React from "react";
import { Badge } from "@/components/ui/shared/badge";
import { CommandAction } from "./types";

interface ActionListItemProps {
  action: CommandAction;
  index: number;
  selectedIndex: number;
  onSelect: (action: CommandAction) => void;
  onMouseEnter: (index: number) => void;
}

export function ActionListItem({
  action,
  index,
  selectedIndex,
  onSelect,
  onMouseEnter,
}: ActionListItemProps) {
  const isSelected = index === selectedIndex;

  return (
    <li
      className={`flex items-center px-6 py-4 cursor-pointer transition-colors duration-100 group ${
        isSelected
          ? "bg-primary-50 dark:bg-primary-900/20"
          : "hover:bg-slate-100 dark:hover:bg-slate-800/60"
      }`}
      onClick={() => onSelect(action)}
      onMouseEnter={() => onMouseEnter(index)}
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
  );
}
