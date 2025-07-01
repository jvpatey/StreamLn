import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Rocket } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden h-screen flex items-center justify-center">
      <div className="relative mx-auto max-w-7xl px-6 w-full">
        <div className="mx-auto max-w-2xl text-center">
          {/* Beta badge */}
          <Badge
            variant="secondary"
            className="group mb-6 bg-card/50 backdrop-blur-sm border border-border/50 text-muted-foreground hover:bg-primary/10 hover:text-primary hover:border-primary/20 transition-all duration-200 px-4 py-2 text-sm font-medium"
          >
            <Rocket className="w-4 h-4 mr-2 text-primary group-hover:text-primary transition-all duration-200 group-hover:rotate-12 group-hover:scale-110" />
            Developer Productivity Platform
          </Badge>

          {/* Enhanced Logo Design */}
          <div className="relative mb-8 group cursor-pointer">
            {/* Main logo text */}
            <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl lg:text-8xl">
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-primary-500 via-primary-600 to-accent-500 bg-clip-text text-transparent">
                  StreamLn
                </span>
              </span>
            </h1>

            {/* Integrated subtext */}
            <div className="mt-2 relative">
              <p className="text-sm font-medium tracking-wide text-muted-foreground/80">
                One workspace for tasks, notes, and flow.
              </p>
              {/* Decorative line */}
              <div className="mx-auto mt-3 w-64 h-0.5 flex justify-center items-center">
                <div className="w-24 h-px bg-gradient-to-r from-transparent via-border to-transparent transition-all duration-[800ms] ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:w-64 group-hover:h-0.5 group-hover:via-primary/50" />
              </div>
            </div>
          </div>

          {/* Subheading */}
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Smart technical notes, visual task boards, and lightweight AI
            assistance streamlined into one interface. Built for solo devs and
            small teams who need structure and clarity.
          </p>

          {/* CTA buttons */}
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button
              variant="default"
              size="lg"
              className="transition-all duration-300 ease-out hover:scale-105 active:scale-95"
            >
              Start Planning & Building
            </Button>
            <Button
              variant="link"
              className="group leading-6 transition-all duration-200 hover:text-primary/80 hover:no-underline"
            >
              <span className="transition-transform duration-200 group-hover:translate-x-1">
                View Demo
              </span>
              <span className="ml-1 transition-transform duration-200 group-hover:translate-x-1 group-hover:scale-110">
                →
              </span>
            </Button>
          </div>

          {/* Feature hints */}
          <div className="mt-16 flex items-center justify-center gap-8 text-sm text-muted-foreground">
            <span className="group flex items-center gap-2 cursor-pointer transition-all duration-200 hover:text-foreground hover:scale-105">
              <div className="h-2 w-2 rounded-full bg-primary-500 transition-all duration-200 group-hover:scale-125" />
              Smart Notes
            </span>
            <span className="group flex items-center gap-2 cursor-pointer transition-all duration-200 hover:text-foreground hover:scale-105">
              <div className="h-2 w-2 rounded-full bg-accent-500 transition-all duration-200 group-hover:scale-125" />
              Task Boards
            </span>
            <span className="group flex items-center gap-2 cursor-pointer transition-all duration-200 hover:text-foreground hover:scale-105">
              <div className="h-2 w-2 rounded-full bg-primary-500 transition-all duration-200 group-hover:scale-125" />
              AI Copilot
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
