import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// Badge component with multiple visual variants using class-variance-authority
const badgeVariants = cva(
  // Base styles applied to all badges
  "inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 backdrop-blur-sm",
  {
    variants: {
      variant: {
        // Standard variants
        default:
          "border-primary/20 bg-primary/8 text-primary shadow-sm hover:bg-primary/12 hover:border-primary/30 hover:shadow-md hover:scale-105",
        secondary:
          "border-secondary/20 bg-secondary/8 text-secondary-foreground shadow-sm hover:bg-secondary/12 hover:border-secondary/30 hover:shadow-md hover:scale-105",
        destructive:
          "border-destructive/20 bg-destructive/8 text-destructive shadow-sm hover:bg-destructive/12 hover:border-destructive/30 hover:shadow-md hover:scale-105",
        outline:
          "border-border/50 bg-background/50 text-foreground shadow-sm hover:bg-background/80 hover:border-border hover:shadow-md hover:scale-105",
        // Modern design variants
        subtle:
          "border-transparent bg-muted/40 text-muted-foreground shadow-sm hover:bg-muted/60 hover:shadow-md hover:scale-105",
        gradient:
          "border-transparent bg-gradient-to-r from-primary/10 via-primary/8 to-accent/10 text-primary shadow-sm hover:from-primary/15 hover:via-primary/12 hover:to-accent/15 hover:shadow-md hover:scale-105",
        glass:
          "border-white/10 bg-white/5 backdrop-blur-md text-foreground shadow-lg hover:bg-white/10 hover:border-white/20 hover:shadow-xl hover:scale-105",
        // Status variants
        success:
          "border-green-500/20 bg-green-500/8 text-green-600 shadow-sm hover:bg-green-500/12 hover:border-green-500/30 hover:shadow-md hover:scale-105",
        warning:
          "border-yellow-500/20 bg-yellow-500/8 text-yellow-600 shadow-sm hover:bg-yellow-500/12 hover:border-yellow-500/30 hover:shadow-md hover:scale-105",
        info: "border-blue-500/20 bg-blue-500/8 text-blue-600 shadow-sm hover:bg-blue-500/12 hover:border-blue-500/30 hover:shadow-md hover:scale-105",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

// Props interface extending HTML div attributes and variant props
export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

// Badge component - renders a styled badge with various visual variants
function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
