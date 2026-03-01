/**
 * Canvas preferences - stored in localStorage for view defaults and share settings.
 * Used by the canvas page and Canvas Settings modal.
 */

const GRID_KEY = "streamln-canvas-show-grid";
const ZOOM_KEY = "streamln-canvas-default-zoom";
const SIDEBAR_KEY = "streamln-canvas-sidebar-open";
const TOOLBAR_KEY = "streamln-canvas-toolbar-open";
const SHARE_EXPIRY_KEY = "streamln-canvas-share-expiry";

const DEFAULT_ZOOM = 1;
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 1.5;

export function getDefaultShowGrid(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const stored = localStorage.getItem(GRID_KEY);
    return stored !== null ? JSON.parse(stored) : true;
  } catch {
    return true;
  }
}

export function setDefaultShowGrid(value: boolean): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(GRID_KEY, JSON.stringify(value));
}

export function getDefaultZoom(): number {
  if (typeof window === "undefined") return DEFAULT_ZOOM;
  try {
    const stored = localStorage.getItem(ZOOM_KEY);
    const parsed = stored ? parseFloat(stored) : DEFAULT_ZOOM;
    return Number.isFinite(parsed) && parsed >= MIN_ZOOM && parsed <= MAX_ZOOM
      ? parsed
      : DEFAULT_ZOOM;
  } catch {
    return DEFAULT_ZOOM;
  }
}

export function setDefaultZoom(value: number): void {
  if (typeof window === "undefined") return;
  const clamped = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, value));
  localStorage.setItem(ZOOM_KEY, String(clamped));
}

export function getDefaultSidebarOpen(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const stored = localStorage.getItem(SIDEBAR_KEY);
    return stored !== null ? JSON.parse(stored) : true;
  } catch {
    return true;
  }
}

export function setDefaultSidebarOpen(value: boolean): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(SIDEBAR_KEY, JSON.stringify(value));
}

export function getDefaultToolbarOpen(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const stored = localStorage.getItem(TOOLBAR_KEY);
    return stored !== null ? JSON.parse(stored) : true;
  } catch {
    return true;
  }
}

export function setDefaultToolbarOpen(value: boolean): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOOLBAR_KEY, JSON.stringify(value));
}

export function getDefaultShareExpiry(): number | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const stored = localStorage.getItem(SHARE_EXPIRY_KEY);
    if (stored === null || stored === "null") return undefined;
    const parsed = parseInt(stored, 10);
    return Number.isFinite(parsed) ? parsed : undefined;
  } catch {
    return undefined;
  }
}

export function setDefaultShareExpiry(value: number | undefined): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(SHARE_EXPIRY_KEY, value === undefined ? "null" : String(value));
}
