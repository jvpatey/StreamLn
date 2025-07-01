import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ReactNode } from "react";

// Props interface for the feature card component
interface FeatureCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  highlight: string;
}

// Feature card component with cosmic-themed styling and hover effects
export default function FeatureCard({
  title,
  description,
  icon,
  highlight,
}: FeatureCardProps) {
  return (
    <Card className="group relative overflow-hidden backdrop-blur-xl p-6 transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-2xl hover:shadow-cosmos-cosmic-light/10 dark:bg-cosmos-surface/30 bg-white/40 dark:border-cosmos-cosmic-light/20 border-cosmos-cosmic-light/30 dark:hover:border-cosmos-cosmic-light/40 hover:border-cosmos-cosmic-light/50 dark:hover:bg-cosmos-surface/50 hover:bg-white/70">
      {/* Cosmic glow effect on hover */}
      <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-br from-cosmos-cosmic-light/5 via-transparent to-cosmos-star-light/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative z-10">
        {/* Header section with icon and highlight badge */}
        <div className="flex items-start justify-between mb-6">
          {/* Icon container with gradient background and hover animations */}
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cosmos-cosmic-dark/20 to-cosmos-cosmic-light/20 border border-cosmos-cosmic-light/30 group-hover:from-cosmos-cosmic-light/30 group-hover:to-cosmos-star-light/20 group-hover:border-cosmos-cosmic-light/50 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-cosmos-cosmic-light/20 transition-all duration-300">
            <div className="text-cosmos-cosmic-light group-hover:text-cosmos-cosmic-light transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.6)] group-hover:scale-110">
              {icon}
            </div>
          </div>
          {/* Highlight badge with gradient variant */}
          <Badge
            variant="gradient"
            className="group-hover:scale-105 transition-all duration-300 font-medium px-4 py-2 text-sm"
          >
            {highlight}
          </Badge>
        </div>

        {/* Title with hover text effects */}
        <h3 className="text-xl font-bold tracking-tight mb-3 text-gray-900 dark:text-foreground group-hover:text-gray-900 dark:group-hover:text-foreground group-hover:drop-shadow-[0_0_4px_rgba(0,0,0,0.08)] dark:group-hover:drop-shadow-[0_0_4px_rgba(255,255,255,0.3)] transition-all duration-300">
          {title}
        </h3>

        {/* Description with color transitions */}
        <p className="leading-relaxed text-sm text-gray-700 dark:text-muted-foreground group-hover:text-gray-900 dark:group-hover:text-foreground transition-colors duration-300">
          {description}
        </p>
      </div>

      {/* Subtle bottom glow effect on hover */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cosmos-cosmic-light/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </Card>
  );
}
