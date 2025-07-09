import React from "react";

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
            <button
              key={opt.value}
              className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors ${
                statusFilter === opt.value
                  ? "bg-primary-500 text-white border-primary-500"
                  : "bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-primary-100 dark:hover:bg-primary-900/20"
              }`}
              onClick={() => {
                if (statusFilter === opt.value) {
                  setStatusFilter("all");
                } else {
                  setStatusFilter(opt.value as any);
                }
              }}
            >
              {opt.label}
            </button>
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
            <button
              key={opt.value}
              className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors ${
                sortBy === opt.value
                  ? "bg-primary-500 text-white border-primary-500"
                  : "bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-primary-100 dark:hover:bg-primary-900/20"
              }`}
              onClick={() => {
                if (sortBy === opt.value) {
                  setSortBy("updated");
                } else {
                  setSortBy(opt.value as any);
                }
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
