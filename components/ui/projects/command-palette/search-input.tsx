import React from "react";
import { Search } from "lucide-react";
import { Badge } from "@/components/ui/shared/badge";

interface SearchInputProps {
  search: string;
  onSearchChange: (value: string) => void;
  placeholder: string;
  resultCount: number;
  searchInputRef: React.RefObject<HTMLInputElement>;
}

export function SearchInput({
  search,
  onSearchChange,
  placeholder,
  resultCount,
  searchInputRef,
}: SearchInputProps) {
  return (
    <div className="relative border-b border-white/20 dark:border-slate-700/30 backdrop-blur-xl bg-white/30 dark:bg-slate-900/30">
      <Search
        size={20}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
      />
      <input
        ref={searchInputRef}
        type="text"
        placeholder={placeholder}
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full bg-transparent px-12 py-4 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 outline-none"
        autoFocus
      />
      {search && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center space-x-2">
          <Badge variant="outline" className="text-xs backdrop-blur-sm bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/20">
            {resultCount} results
          </Badge>
        </div>
      )}
    </div>
  );
}
