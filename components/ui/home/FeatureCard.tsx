import { Card } from "@/components/ui/shared/card";
import { Badge } from "@/components/ui/shared/badge";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// Props interface for the feature card component
interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  highlight: string;
  variant?: "default" | "accent";
}

// Feature card component - consistent text and icon sizes across all cards
export default function FeatureCard({
  title,
  description,
  icon,
  highlight,
  variant = "default",
}: FeatureCardProps) {
  const isAccent = variant === "accent";

  return (
    <Card
      className={cn(
        "group relative flex h-full min-h-0 flex-col overflow-hidden backdrop-blur-xl p-6 transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-2xl",
        isAccent
          ? "bg-accent-500/15 dark:bg-accent-500/25 border-accent-500/40 dark:border-accent-500/40 hover:shadow-xl dark:hover:bg-accent-500/30 hover:border-accent-500/50"
          : "bg-white/50 dark:bg-slate-800/50 border-slate-200/50 dark:border-slate-600/30 hover:shadow-primary-500/10 dark:hover:bg-slate-800/70 hover:border-slate-400/40 dark:hover:border-slate-500/40"
      )}
    >
      {/* Glow effect on hover */}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500",
          isAccent
            ? "bg-gradient-to-br from-accent-500/10 via-transparent to-accent-400/5"
            : "bg-gradient-to-br from-cosmos-cosmic-light/5 via-transparent to-cosmos-star-light/5"
        )}
      />

      <div className="relative z-10 flex flex-1 flex-col">
        {/* Header section with icon and highlight badge */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-xl border transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg",
              isAccent
                ? "bg-accent-500/20 border-accent-500/40 group-hover:border-accent-500/60 group-hover:shadow-accent-500/30"
                : "bg-gradient-to-br from-cosmos-cosmic-dark/20 to-cosmos-cosmic-light/20 border-cosmos-cosmic-light/30 group-hover:from-cosmos-cosmic-light/30 group-hover:to-cosmos-star-light/20 group-hover:border-cosmos-cosmic-light/50 group-hover:shadow-cosmos-cosmic-light/20"
            )}
          >
            <div
              className={cn(
                "transition-all duration-300 group-hover:scale-110",
                isAccent ? "text-accent-600 dark:text-accent-400" : "text-cosmos-cosmic-light"
              )}
            >
              {(() => {
                const Icon = icon;
                return <Icon size={24} />;
              })()}
            </div>
          </div>
          <Badge
            variant={isAccent ? "warning" : "gradient"}
            className="group-hover:scale-105 transition-all duration-300 font-medium px-3 py-1.5 text-xs"
          >
            {highlight}
          </Badge>
        </div>

        <h3 className="mb-3 text-xl font-bold tracking-tight text-gray-900 dark:text-foreground group-hover:drop-shadow-[0_0_4px_rgba(0,0,0,0.08)] dark:group-hover:drop-shadow-[0_0_4px_rgba(255,255,255,0.3)] transition-all duration-300">
          {title}
        </h3>

        <p className="flex-1 text-sm leading-relaxed text-gray-700 dark:text-muted-foreground group-hover:text-gray-900 dark:group-hover:text-foreground transition-colors duration-300">
          {description}
        </p>
      </div>

      <div
        className={cn(
          "pointer-events-none absolute bottom-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500",
          isAccent
            ? "bg-gradient-to-r from-transparent via-accent-500/30 to-transparent"
            : "bg-gradient-to-r from-transparent via-cosmos-cosmic-light/20 to-transparent"
        )}
      />
    </Card>
  );
}
