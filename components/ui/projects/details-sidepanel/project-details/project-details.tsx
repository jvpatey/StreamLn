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
    <Card className="backdrop-blur-2xl 
      bg-gradient-to-br from-primary-500/10 via-primary-400/15 to-accent-500/10 
      dark:from-primary-500/5 dark:via-primary-400/10 dark:to-accent-500/5
      border border-white/30 dark:border-white/20
      hover:border-white/40 dark:hover:border-white/30
      transition-all duration-200 hover:shadow-xl cursor-pointer group rounded-xl">
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
              className="h-6 px-2 text-xs rounded-full
                backdrop-blur-sm bg-white/30 dark:bg-slate-800/30
                border border-white/20 dark:border-slate-700/20
                hover:bg-white/50 dark:hover:bg-slate-800/50
                hover:border-white/30 dark:hover:border-slate-700/30
                transition-all duration-200"
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
