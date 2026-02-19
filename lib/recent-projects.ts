/**
 * Recent projects - stores project IDs in localStorage for quick access.
 * Used by the Project Hub sidebar to show recently opened projects.
 */

const STORAGE_KEY = "streamln-recent-project-ids";
const MAX_RECENT = 5;

export function getRecentProjectIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function addProjectToRecent(projectId: string): void {
  if (typeof window === "undefined") return;
  const ids = getRecentProjectIds();
  const next = [projectId, ...ids.filter((id) => id !== projectId)].slice(
    0,
    MAX_RECENT
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}
