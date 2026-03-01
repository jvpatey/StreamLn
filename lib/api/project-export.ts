/**
 * Fetch project with all canvases and blocks for export.
 */

export interface ExportProjectData {
  project: {
    id: string;
    name: string;
    description?: string | null;
    icon?: string | null;
    status: string;
    createdAt: string;
    updatedAt: string;
  };
  canvases: Array<{
    id: string;
    name: string;
    order: number;
    projectId: string;
    createdAt: string;
    updatedAt: string;
    blocks: Array<{
      id: string;
      type: string;
      x: number;
      y: number;
      width: number;
      height: number;
      content: unknown;
      color?: string | null;
      title?: string | null;
      order: number;
      createdAt: string;
      updatedAt: string;
    }>;
    documents?: Array<{
      id: string;
      name: string;
      order: number;
      content: unknown;
    }>;
  }>;
}

export async function fetchProjectForExport(
  projectId: string
): Promise<ExportProjectData> {
  const res = await fetch(`/api/projects/${projectId}/export`);
  if (!res.ok) throw new Error("Failed to fetch project for export");
  return res.json();
}
