import React from "react";
import { cn } from "@/lib/utils";
import {
  Code,
  FileCode,
  Folder,
  Database,
  Server,
  Globe,
  Smartphone,
  Monitor,
  Palette,
  Zap,
  Rocket,
  Target,
  Lightbulb,
  BookOpen,
  Settings,
  Shield,
  Lock,
  Users,
  GitBranch,
  Package,
  Terminal,
  Cpu,
  HardDrive,
  Wifi,
  Cloud,
  BarChart3,
  TrendingUp,
  Calendar,
  Clock,
  Star,
  Heart,
} from "lucide-react";

// Curated list of dev/coding relevant icons
const devIcons = [
  { name: "Code", icon: Code, description: "General coding" },
  { name: "FileCode", icon: FileCode, description: "Code files" },
  { name: "Folder", icon: Folder, description: "Project folder" },
  { name: "Database", icon: Database, description: "Database project" },
  { name: "Server", icon: Server, description: "Backend/server" },
  { name: "Globe", icon: Globe, description: "Web project" },
  { name: "Smartphone", icon: Smartphone, description: "Mobile app" },
  { name: "Monitor", icon: Monitor, description: "Desktop app" },
  { name: "Palette", icon: Palette, description: "Design project" },
  { name: "Zap", icon: Zap, description: "Fast/performance" },
  { name: "Rocket", icon: Rocket, description: "Launch project" },
  { name: "Target", icon: Target, description: "Goal-oriented" },
  { name: "Lightbulb", icon: Lightbulb, description: "Idea/innovation" },
  { name: "BookOpen", icon: BookOpen, description: "Documentation" },
  { name: "Settings", icon: Settings, description: "Configuration" },
  { name: "Shield", icon: Shield, description: "Security" },
  { name: "Lock", icon: Lock, description: "Privacy/security" },
  { name: "Users", icon: Users, description: "Team project" },
  { name: "GitBranch", icon: GitBranch, description: "Version control" },
  { name: "Package", icon: Package, description: "Library/package" },
  { name: "Terminal", icon: Terminal, description: "CLI tool" },
  { name: "Cpu", icon: Cpu, description: "System/performance" },
  { name: "HardDrive", icon: HardDrive, description: "Storage/data" },
  { name: "Wifi", icon: Wifi, description: "Network/API" },
  { name: "Cloud", icon: Cloud, description: "Cloud service" },
  { name: "BarChart3", icon: BarChart3, description: "Analytics" },
  { name: "TrendingUp", icon: TrendingUp, description: "Growth" },
  { name: "Calendar", icon: Calendar, description: "Scheduled" },
  { name: "Clock", icon: Clock, description: "Time-sensitive" },
  { name: "Star", icon: Star, description: "Featured" },
  { name: "Heart", icon: Heart, description: "Personal" },
];

interface IconPickerProps {
  selectedIcon: string;
  onIconSelect: (iconName: string) => void;
  className?: string;
}

export function IconPicker({
  selectedIcon,
  onIconSelect,
  className,
}: IconPickerProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
        Project Icon <span className="text-slate-400">(optional)</span>
      </label>
      <div className="grid grid-cols-6 gap-2 max-h-48 overflow-y-auto p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50/50 dark:bg-slate-800/50">
        {devIcons.map(({ name, icon: IconComponent, description }) => (
          <button
            key={name}
            type="button"
            onClick={() => onIconSelect(name)}
            className={cn(
              "p-2 rounded-lg border-2 transition-all duration-200 hover:scale-105 hover:shadow-sm",
              "focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2",
              selectedIcon === name
                ? "border-primary-500 bg-primary-50 dark:bg-primary-950/50 text-primary-600 dark:text-primary-400"
                : "border-transparent hover:border-slate-300 dark:hover:border-slate-600 bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
            )}
            title={description}
          >
            <IconComponent className="h-5 w-5" />
          </button>
        ))}
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400">
        Choose an icon to make your project easily identifiable
      </p>
    </div>
  );
}

// Helper function to get icon component by name
export function getIconComponent(iconName: string) {
  const iconData = devIcons.find((icon) => icon.name === iconName);
  return iconData ? iconData.icon : Folder; // Default to Folder if not found
}

// Export the icon names for type safety
export const iconNames = devIcons.map((icon) => icon.name);
export type IconName = (typeof iconNames)[number];
