"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

// Variables matching app globals.css - light theme
const lightVariables = {
  colorPrimary: "hsl(213, 93%, 60%)",
  colorPrimaryForeground: "hsl(0, 0%, 100%)",
  colorForeground: "hsl(225, 39%, 7%)",
  colorBackground: "hsl(0, 0%, 98%)",
  colorMuted: "hsl(0, 0%, 96%)",
  colorMutedForeground: "hsl(0, 0%, 45%)",
  colorDanger: "hsl(0, 84%, 60%)",
  colorInput: "hsl(0, 0%, 96%)",
  colorInputForeground: "hsl(225, 39%, 7%)",
  colorBorder: "hsl(0, 0%, 90%)",
  colorRing: "hsl(213, 93%, 60%)",
  colorModalBackdrop: "rgba(0, 0, 0, 0.5)",
  borderRadius: "0.5rem",
};

// Variables matching app globals.css - dark theme
const darkVariables = {
  colorPrimary: "hsl(213, 93%, 60%)",
  colorPrimaryForeground: "hsl(0, 0%, 100%)",
  colorForeground: "hsl(0, 0%, 100%)",
  colorBackground: "hsl(225, 45%, 10%)",
  colorMuted: "hsl(225, 30%, 15%)",
  colorMutedForeground: "hsl(0, 0%, 65%)",
  colorDanger: "hsl(0, 63%, 31%)",
  colorInput: "hsl(225, 30%, 15%)",
  colorInputForeground: "hsl(0, 0%, 100%)",
  colorBorder: "hsl(225, 30%, 15%)",
  colorRing: "hsl(213, 93%, 60%)",
  colorModalBackdrop: "rgba(0, 0, 0, 0.7)",
  borderRadius: "0.5rem",
};

// Shared element overrides for cohesive styling
const elements = {
  modalBackdrop: "backdrop-blur-sm",
  card: "shadow-xl border border-slate-200 dark:border-slate-700",
};

// Wrapper component that applies the correct Clerk theme based on the current theme
export function ClerkThemeWrapper({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return ClerkProvider without theme during SSR to prevent hydration issues
    return <ClerkProvider>{children}</ClerkProvider>;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <ClerkProvider
      appearance={{
        baseTheme: isDark ? dark : undefined,
        variables: isDark ? darkVariables : lightVariables,
        elements,
      }}
    >
      {children}
    </ClerkProvider>
  );
}
