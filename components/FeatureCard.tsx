import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ReactNode } from "react";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  highlight: string;
}

export default function FeatureCard({
  title,
  description,
  icon,
  highlight,
}: FeatureCardProps) {
  return (
    <Card className="group relative bg-card/50 backdrop-blur-sm border border-border/50 p-6 transition-all duration-200 ease-out hover:border-primary/30 hover:bg-card/80 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5">
      <div className="flex items-start justify-between mb-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 group-hover:bg-primary/20 group-hover:border-primary/30 group-hover:scale-105 transition-all duration-200">
          <div className="text-primary group-hover:text-primary transition-colors duration-200 group-hover:rotate-2 group-hover:scale-110">
            {icon}
          </div>
        </div>
        <Badge
          variant="secondary"
          className="bg-secondary/50 border-border/50 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary group-hover:border-primary/20 transition-all duration-200 font-medium px-3 py-1 text-xs"
        >
          {highlight}
        </Badge>
      </div>

      <h3 className="text-xl font-bold tracking-tight mb-3 text-foreground group-hover:text-primary transition-colors duration-200">
        {title}
      </h3>

      <p className="text-muted-foreground leading-relaxed text-sm group-hover:text-foreground/80 transition-colors duration-200">
        {description}
      </p>
    </Card>
  );
}
