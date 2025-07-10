export interface Project {
  id: string;
  name: string;
  description?: string;
  status?: string;
  icon?: string;
}

export interface ProjectCommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateProject?: () => void;
  initialSearchMode?: boolean;
  projects: Project[];
  onProjectSelect?: (project: Project) => void;
  openFilterPopover?: () => void;
}

export interface CommandAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  shortcut: string;
  category: string;
  onSelect: () => void;
}
