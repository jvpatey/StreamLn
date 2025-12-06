"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/shared/button";

// Simple theme toggle button that switches between light and dark modes
export function SimpleThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button 
        variant="ghost" 
        size="icon" 
        className="relative rounded-full
          backdrop-blur-2xl bg-white/40 dark:bg-slate-800/40 
          border border-white/30 dark:border-slate-700/30
          hover:bg-white/50 dark:hover:bg-slate-800/50
          hover:border-white/40 dark:hover:border-slate-700/40
          shadow-lg hover:shadow-xl transition-all duration-200"
      >
        <div className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="relative group rounded-full
        backdrop-blur-2xl bg-white/40 dark:bg-slate-800/40 
        border border-white/30 dark:border-slate-700/30
        hover:bg-white/50 dark:hover:bg-slate-800/50
        hover:border-white/40 dark:hover:border-slate-700/40
        shadow-lg hover:shadow-xl transition-all duration-200"
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0 text-gray-700 dark:text-gray-300 group-hover:text-yellow-500 group-hover:rotate-90" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100 text-gray-700 dark:text-gray-300 group-hover:text-blue-400 group-hover:rotate-90" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
