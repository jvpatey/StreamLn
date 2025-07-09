import { Button } from "@/components/ui/shared/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/shared/card";
import { Project } from "./types";

interface ProjectDetailsProps {
  project: Project;
}

export function ProjectDetails({ project }: ProjectDetailsProps) {
  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-200 hover:border-primary/30 hover:bg-card/70 hover:shadow-lg cursor-pointer group">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold transition-colors duration-200 group-hover:text-primary/80">
          Project Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-1">
          <div className="text-sm text-muted-foreground">Project ID</div>
          <div className="flex items-center space-x-2">
            <code className="text-xs bg-muted/50 px-2 py-1 rounded font-mono text-foreground transition-all duration-200 group-hover:bg-primary/10 group-hover:border group-hover:border-primary/20">
              {project.id}
            </code>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs transition-all duration-200 hover:bg-primary/10 hover:text-primary"
              onClick={() => navigator.clipboard.writeText(project.id)}
            >
              Copy
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
