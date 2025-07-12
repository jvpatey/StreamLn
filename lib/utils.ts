import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Platform-aware keyboard shortcut utility
export function getKeyboardShortcut(macShortcut: string): string {
  if (typeof window === "undefined") return macShortcut;

  const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;

  if (isMac) {
    return macShortcut;
  } else {
    // Convert Mac shortcuts to Windows/Linux equivalents
    return macShortcut
      .replace(/⌘/g, "Ctrl")
      .replace(/⇧/g, "Shift")
      .replace(/⌥/g, "Alt")
      .replace(/⌃/g, "Ctrl");
  }
}
