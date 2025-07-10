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
    <div className="relative border-b border-slate-200 dark:border-slate-700">
      <Search
        size={20}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
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
      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center space-x-2">
        <Badge variant="outline" className="text-xs">
          {resultCount} results
        </Badge>
      </div>
    </div>
  );
}
