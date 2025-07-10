import { formatDistanceToNow } from "date-fns";
import { Calendar, Clock, Users, BarChart3 } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/shared/card";
import { Project } from "./types";

interface ProjectStatsProps {
  project: Project;
}

export function ProjectStats({ project }: ProjectStatsProps) {
  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return "Unknown";
    }
  };

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-200 hover:border-primary/30 hover:bg-card/70 hover:shadow-lg cursor-pointer group">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center space-x-2 transition-colors duration-200 group-hover:text-primary/80">
          <BarChart3 className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
          <span>Project Overview</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1 transition-all duration-200 hover:scale-105">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>Created</span>
            </div>
            <p className="text-sm font-medium text-foreground">
              {formatDate(project.createdAt)}
            </p>
          </div>
          <div className="space-y-1 transition-all duration-200 hover:scale-105">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>Updated</span>
            </div>
            <p className="text-sm font-medium text-foreground">
              {formatDate(project.updatedAt)}
            </p>
          </div>
        </div>

        <div className="space-y-1 transition-all duration-200 hover:scale-105">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Users className="h-3 w-3" />
            <span>Collaborators</span>
          </div>
          <p className="text-sm font-medium text-foreground">
            Just you for now
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
