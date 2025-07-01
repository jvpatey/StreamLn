"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

// Theme provider wrapper that enables dark/light mode functionality
// Wraps the next-themes provider to handle theme switching throughout the app
export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
