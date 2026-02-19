/**
 * Client API for importing projects from JSON
 */

export interface ImportProjectResult {
  id: string;
  name: string;
  firstCanvasId: string | null;
}

/**
 * Import a project from JSON (project or single-canvas export format).
 * Creates a new project with fresh IDs and returns the created project.
 */
export async function importProjectFromJson(
  json: string | object
): Promise<ImportProjectResult> {
  const res = await fetch("/api/projects/import", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: typeof json === "string" ? json : JSON.stringify(json),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    const message =
      data?.details ?? data?.error ?? "Failed to import project";
    throw new Error(message);
  }

  return res.json();
}
