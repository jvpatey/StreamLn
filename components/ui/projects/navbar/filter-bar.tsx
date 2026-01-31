import React from "react";
import { LiquidGlassButton } from "@/components/ui/shared/liquid-glass-button";
import { cn } from "@/lib/utils";

interface FilterBarProps {
  sortBy: "updated" | "alpha";
  setSortBy: (val: "updated" | "alpha") => void;
  statusFilter: "all" | "active" | "archived";
  setStatusFilter: (val: "all" | "active" | "archived") => void;
}

const statusOptions = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Archived", value: "archived" },
];

const sortOptions = [
  { label: "Last Updated", value: "updated" },
  { label: "Alphabetically", value: "alpha" },
  { label: "Status", value: "status" },
];

const FilterBar: React.FC<FilterBarProps> = ({
  sortBy,
  setSortBy,
  statusFilter,
  setStatusFilter,
}) => {
  return (
    <div className="flex flex-col gap-4 min-w-[220px]">
      <div>
        <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1">
          Filter by
        </div>
        <div className="flex gap-2">
          {statusOptions.map((opt) => (
            <LiquidGlassButton
              key={opt.value}
              type="button"
              gradient="primary"
              className={cn(
                "px-3 py-1 h-auto rounded-xl text-sm font-medium",
                statusFilter === opt.value
                  ? "text-white bg-primary-600/80 dark:bg-primary-500/35 border-primary-400/40 dark:border-primary-300/20 shadow-lg"
                  : "text-slate-700 dark:text-slate-200",
              )}
              onClick={() => {
                if (statusFilter === opt.value) {
                  setStatusFilter("all");
                } else {
                  setStatusFilter(opt.value as any);
                }
              }}
            >
              {opt.label}
            </LiquidGlassButton>
          ))}
        </div>
      </div>
      <hr className="my-2 border-slate-200 dark:border-slate-700" />
      <div>
        <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1">
          Sort by
        </div>
        <div className="flex gap-2">
          {sortOptions.map((opt) => (
            <LiquidGlassButton
              key={opt.value}
              type="button"
              gradient="primary"
              className={cn(
                "px-3 py-1 h-auto rounded-xl text-sm font-medium",
                sortBy === opt.value
                  ? "text-white bg-primary-600/80 dark:bg-primary-500/35 border-primary-400/40 dark:border-primary-300/20 shadow-lg"
                  : "text-slate-700 dark:text-slate-200",
              )}
              onClick={() => {
                if (sortBy === opt.value) {
                  setSortBy("updated");
                } else {
                  setSortBy(opt.value as any);
                }
              }}
            >
              {opt.label}
            </LiquidGlassButton>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
