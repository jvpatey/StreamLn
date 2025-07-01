import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// Button component with multiple visual variants and sizes using class-variance-authority
const buttonVariants = cva(
  // Base styles applied to all buttons
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Standard variants
        default:
          "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-lg hover:shadow-xl hover:from-primary/90 hover:to-primary/80 hover:scale-105 active:scale-95",
        destructive:
          "bg-gradient-to-r from-destructive to-destructive/90 text-destructive-foreground shadow-lg hover:shadow-xl hover:from-destructive/90 hover:to-destructive/80 hover:scale-105 active:scale-95",
        outline:
          "border border-border/50 bg-background/50 backdrop-blur-sm shadow-sm hover:bg-background/80 hover:border-border hover:shadow-md hover:scale-105 active:scale-95",
        secondary:
          "bg-gradient-to-r from-secondary to-secondary/90 text-secondary-foreground shadow-lg hover:shadow-xl hover:from-secondary/90 hover:to-secondary/80 hover:scale-105 active:scale-95",
        ghost:
          "hover:bg-accent/50 hover:text-accent-foreground backdrop-blur-sm hover:shadow-sm hover:scale-105 active:scale-95",
        link: "text-primary underline-offset-4 hover:underline hover:scale-105 active:scale-95",
        // Modern design variants
        gradient:
          "bg-gradient-to-r from-primary via-primary/90 to-accent text-primary-foreground shadow-lg hover:shadow-xl hover:from-primary/90 hover:via-primary/80 hover:to-accent/90 hover:scale-105 active:scale-95",
        glass:
          "border border-white/10 bg-white/5 backdrop-blur-md text-foreground shadow-lg hover:bg-white/10 hover:border-white/20 hover:shadow-xl hover:scale-105 active:scale-95",
        subtle:
          "bg-muted/40 text-muted-foreground shadow-sm hover:bg-muted/60 hover:shadow-md hover:scale-105 active:scale-95",
        // Status variants
        success:
          "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg hover:shadow-xl hover:from-green-600 hover:to-green-700 hover:scale-105 active:scale-95",
        warning:
          "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg hover:shadow-xl hover:from-yellow-600 hover:to-yellow-700 hover:scale-105 active:scale-95",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-lg px-3 text-xs",
        lg: "h-12 rounded-xl px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

// Props interface extending HTML button attributes, variant props, and asChild prop
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

// Button component - renders a styled button with various visual variants and sizes
// Supports asChild prop to render as different element using Radix Slot
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
