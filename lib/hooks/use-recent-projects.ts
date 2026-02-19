"use client";

import { useState, useEffect } from "react";
import { getRecentProjectIds } from "@/lib/recent-projects";

/**
 * Returns the list of recently opened project IDs (from localStorage).
 * Used by the sidebar to display recent projects.
 */
export function useRecentProjectIds(): string[] {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    setIds(getRecentProjectIds());
  }, []);

  return ids;
}
