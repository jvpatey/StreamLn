/**
 * Recent documents - stores document references in localStorage for quick access.
 * Used by the Document Sidebar to show recently opened documents.
 */

const STORAGE_KEY = "streamln-recent-documents";
const MAX_RECENT = 8;

export interface RecentDocument {
  projectId: string;
  canvasId: string;
  documentId: string;
  documentName: string;
  canvasName: string;
}

export function getRecentDocuments(projectId?: string): RecentDocument[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const list: RecentDocument[] = stored ? JSON.parse(stored) : [];
    if (projectId) {
      return list.filter((d) => d.projectId === projectId);
    }
    return list;
  } catch {
    return [];
  }
}

export function addDocumentToRecent(
  projectId: string,
  canvasId: string,
  documentId: string,
  documentName: string,
  canvasName: string
): void {
  if (typeof window === "undefined") return;
  const list = getRecentDocuments();
  const entry: RecentDocument = {
    projectId,
    canvasId,
    documentId,
    documentName,
    canvasName,
  };
  const next = [
    entry,
    ...list.filter(
      (d) =>
        !(
          d.projectId === projectId &&
          d.canvasId === canvasId &&
          d.documentId === documentId
        )
    ),
  ].slice(0, MAX_RECENT);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export function removeDocumentFromRecent(
  projectId: string,
  canvasId: string,
  documentId: string
): void {
  if (typeof window === "undefined") return;
  try {
    const list = getRecentDocuments();
    const next = list.filter(
      (d) =>
        !(
          d.projectId === projectId &&
          d.canvasId === canvasId &&
          d.documentId === documentId
        )
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
}
