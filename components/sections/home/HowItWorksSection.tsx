import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  FileText,
  ArrowDownUp,
  Target,
  GitBranch,
} from "lucide-react";

export default function HowItWorksSection() {
  const steps = [
    {
      step: "01",
      title: "Capture & Plan",
      description:
        "Quickly capture ideas, tasks, and project requirements in rich markdown notes with smart tagging.",
      icon: <FileText className="w-6 h-6" />,
      color: "text-cosmos-cosmic-light",
      bgColor:
        "from-cosmos-cosmic-light/10 via-cosmos-cosmic-dark/5 to-cosmos-cosmic-light/5",
      iconBg: "from-cosmos-cosmic-light/20 to-cosmos-cosmic-dark/20",
      borderColor: "border-cosmos-cosmic-light/30",
      hoverBorderColor: "group-hover:border-cosmos-cosmic-light/50",
    },
    {
      step: "02",
      title: "Organize & Structure",
      description:
        "Transform your notes into actionable tasks using visual boards and knowledge graphs.",
      icon: <ArrowDownUp className="w-6 h-6" />,
      color: "text-nebula-500",
      bgColor: "from-nebula-500/10 via-nebula-600/5 to-nebula-500/5",
      iconBg: "from-nebula-500/20 to-nebula-600/20",
      borderColor: "border-nebula-500/30",
      hoverBorderColor: "group-hover:border-nebula-500/50",
    },
    {
      step: "03",
      title: "Execute & Deliver",
      description:
        "Stay focused with AI-powered context and seamless navigation between related work.",
      icon: <Target className="w-6 h-6" />,
      color: "text-cosmos-star-light",
      bgColor:
        "from-cosmos-star-light/10 via-cosmos-star-dark/5 to-cosmos-star-light/5",
      iconBg: "from-cosmos-star-light/20 to-cosmos-star-dark/20",
      borderColor: "border-cosmos-star-light/30",
      hoverBorderColor: "group-hover:border-cosmos-star-light/50",
    },
  ];

  return (
    <section className="relative py-24 bg-slate-50 dark:bg-slate-950 overflow-hidden">
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <Badge variant="gradient" className="mb-6 px-4 py-2 text-sm group">
            <GitBranch className="w-4 h-4 mr-2 transition-all duration-300 group-hover:rotate-12 group-hover:scale-110 group-hover:text-yellow-500" />
            Simple workflow
          </Badge>

          <h2 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-5xl lg:text-6xl">
            How{" "}
            <span className="bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
              StreamLn works
            </span>
          </h2>

          <p className="mt-8 text-xl leading-8 text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            From scattered thoughts to structured execution. StreamLn adapts to
            your workflow, not the other way around.
          </p>
        </div>

        {/* Steps */}
        <div className="mx-auto mt-20 grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-3">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connecting arrow - only show between steps on large screens */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 z-10">
                  <ArrowRight className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                </div>
              )}

              <Card
                className={`group relative overflow-hidden backdrop-blur-xl p-8 text-center transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-2xl hover:shadow-cosmos-cosmic-light/10 dark:bg-cosmos-surface/30 bg-white/40 dark:border-cosmos-cosmic-light/20 border-cosmos-cosmic-light/30 dark:hover:border-cosmos-cosmic-light/40 hover:border-cosmos-cosmic-light/50 dark:hover:bg-cosmos-surface/50 hover:bg-white/70 ${step.borderColor} ${step.hoverBorderColor}`}
              >
                {/* Cosmic glow effect on hover */}
                <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-br from-cosmos-cosmic-light/5 via-transparent to-cosmos-star-light/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Step number - now much more visible */}
                <div className="absolute top-4 right-4 text-6xl font-bold text-cosmos-cosmic-light/30 dark:text-cosmos-cosmic-light/25 group-hover:text-cosmos-cosmic-light/40 dark:group-hover:text-cosmos-cosmic-light/35 transition-all duration-500">
                  {step.step}
                </div>

                <div className="relative z-10">
                  <div className="flex items-center justify-center mb-6">
                    <div
                      className={`${step.color} bg-gradient-to-br ${step.iconBg} border border-cosmos-cosmic-light/30 group-hover:border-cosmos-cosmic-light/50 p-4 rounded-full shadow-lg group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-cosmos-cosmic-light/20 transition-all duration-300`}
                    >
                      <div className="group-hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.6)] group-hover:scale-110 transition-all duration-300">
                        {step.icon}
                      </div>
                    </div>
                  </div>

                  <h3
                    className={`text-2xl font-bold ${step.color} mb-4 group-hover:drop-shadow-[0_0_4px_rgba(0,0,0,0.08)] dark:group-hover:drop-shadow-[0_0_4px_rgba(255,255,255,0.3)] transition-all duration-300`}
                  >
                    {step.title}
                  </h3>

                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors duration-300">
                    {step.description}
                  </p>
                </div>

                {/* Subtle bottom glow */}
                <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cosmos-cosmic-light/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
