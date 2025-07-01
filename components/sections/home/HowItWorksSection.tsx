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
      color: "text-blue-500",
      bgColor: "from-blue-500/10 to-blue-600/5",
    },
    {
      step: "02",
      title: "Organize & Structure",
      description:
        "Transform your notes into actionable tasks using visual boards and knowledge graphs.",
      icon: <ArrowDownUp className="w-6 h-6" />,
      color: "text-purple-500",
      bgColor: "from-purple-500/10 to-purple-600/5",
    },
    {
      step: "03",
      title: "Execute & Deliver",
      description:
        "Stay focused with AI-powered context and seamless navigation between related work.",
      icon: <Target className="w-6 h-6" />,
      color: "text-green-500",
      bgColor: "from-green-500/10 to-green-600/5",
    },
  ];

  return (
    <section className="relative py-24 bg-slate-50 dark:bg-slate-950 overflow-hidden">
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <Badge variant="secondary" className="mb-6 px-4 py-2">
            <GitBranch className="w-4 h-4 mr-2" />
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
                className={`p-8 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 bg-gradient-to-br ${step.bgColor} backdrop-blur-sm relative overflow-hidden`}
              >
                {/* Step number */}
                <div className="absolute top-4 right-4 text-6xl font-bold text-slate-100 dark:text-slate-800 opacity-50">
                  {step.step}
                </div>

                <div className="relative">
                  <div className="flex items-center justify-center mb-6">
                    <div
                      className={`${step.color} bg-white dark:bg-slate-800 p-4 rounded-full shadow-lg`}
                    >
                      {step.icon}
                    </div>
                  </div>

                  <h3 className={`text-2xl font-bold ${step.color} mb-4`}>
                    {step.title}
                  </h3>

                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
