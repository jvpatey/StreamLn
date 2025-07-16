import React from "react";
import { Archive, CheckCircle, Circle } from "lucide-react";
import { Badge } from "@/components/ui/shared/badge";

export type ProjectStatusType = "active" | "archived" | "draft" | string;

interface ProjectStatusProps {
  status: ProjectStatusType;
  variant?: "badge" | "icon-text" | "text-only" | "icon-only";
  size?: "sm" | "md" | "lg";
  className?: string;
  showIcon?: boolean;
  showText?: boolean;
}

export function ProjectStatus({
  status,
  variant = "badge",
  size = "md",
  className = "",
  showIcon = true,
  showText = true,
}: ProjectStatusProps) {
  const getStatusIcon = () => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "archived":
        return <Archive className="h-4 w-4 text-slate-500" />;
      default:
        return <Circle className="h-4 w-4 text-slate-400" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "active":
        return "text-green-600 dark:text-green-400";
      case "archived":
        return "text-slate-500 dark:text-slate-400";
      default:
        return "text-slate-400";
    }
  };

  const getStatusText = () => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const getBadgeVariant = () => {
    switch (status) {
      case "active":
        return "success";
      case "archived":
        return "subtle";
      default:
        return "outline";
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return {
          icon: "h-3 w-3",
          text: "text-xs",
          badge: "text-xs px-2 py-0.5",
        };
      case "lg":
        return {
          icon: "h-5 w-5",
          text: "text-base",
          badge: "text-sm px-3 py-1",
        };
      default: // md
        return {
          icon: "h-4 w-4",
          text: "text-sm",
          badge: "text-sm px-2.5 py-0.5",
        };
    }
  };

  const sizeClasses = getSizeClasses();

  // Badge variant
  if (variant === "badge") {
    return (
      <Badge
        variant={getBadgeVariant()}
        className={`${sizeClasses.badge} ${className}`}
      >
        {showIcon && (
          <span className="mr-1">
            {React.cloneElement(getStatusIcon(), {
              className: sizeClasses.icon,
            })}
          </span>
        )}
        {showText && getStatusText()}
      </Badge>
    );
  }

  // Icon + Text variant
  if (variant === "icon-text") {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        {showIcon && (
          <span className={getStatusColor()}>
            {React.cloneElement(getStatusIcon(), {
              className: sizeClasses.icon,
            })}
          </span>
        )}
        {showText && (
          <span
            className={`font-medium ${sizeClasses.text} ${getStatusColor()}`}
          >
            {getStatusText()}
          </span>
        )}
      </div>
    );
  }

  // Text only variant
  if (variant === "text-only") {
    return (
      <span
        className={`font-medium ${
          sizeClasses.text
        } ${getStatusColor()} ${className}`}
      >
        {getStatusText()}
      </span>
    );
  }

  // Icon only variant
  if (variant === "icon-only") {
    return (
      <span className={`${getStatusColor()} ${className}`}>
        {React.cloneElement(getStatusIcon(), {
          className: sizeClasses.icon,
        })}
      </span>
    );
  }

  // Default fallback
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {showIcon && (
        <span className={getStatusColor()}>
          {React.cloneElement(getStatusIcon(), {
            className: sizeClasses.icon,
          })}
        </span>
      )}
      {showText && (
        <span className={`font-medium ${sizeClasses.text} ${getStatusColor()}`}>
          {getStatusText()}
        </span>
      )}
    </div>
  );
}

// Convenience components for common use cases
export function ProjectStatusBadge({
  status,
  size = "md",
  className = "",
}: Omit<ProjectStatusProps, "variant">) {
  return (
    <ProjectStatus
      status={status}
      variant="badge"
      size={size}
      className={className}
    />
  );
}

export function ProjectStatusIconText({
  status,
  size = "md",
  className = "",
}: Omit<ProjectStatusProps, "variant">) {
  return (
    <ProjectStatus
      status={status}
      variant="icon-text"
      size={size}
      className={className}
    />
  );
}

export function ProjectStatusText({
  status,
  size = "md",
  className = "",
}: Omit<ProjectStatusProps, "variant">) {
  return (
    <ProjectStatus
      status={status}
      variant="text-only"
      size={size}
      className={className}
    />
  );
}

export function ProjectStatusIcon({
  status,
  size = "md",
  className = "",
}: Omit<ProjectStatusProps, "variant">) {
  return (
    <ProjectStatus
      status={status}
      variant="icon-only"
      size={size}
      className={className}
    />
  );
}
