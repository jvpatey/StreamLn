import { Button } from "@/components/ui/button";

export default function CTASection() {
  const stats = [
    {
      value: "6 weeks",
      label: "to MVP launch",
    },
    {
      value: "Free",
      label: "during beta",
    },
    {
      value: "Open",
      label: "source friendly",
    },
  ];

  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-accent-500/10" />

          <div className="relative px-6 py-16 sm:px-16">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl">
                Ready to boost your{" "}
                <span className="bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
                  developer productivity?
                </span>
              </h2>

              <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
                Join developers who are organizing their projects, ideas, and
                tasks with CodexFlow. Plan, document, and execute with structure
                and clarity.
              </p>

              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Button variant="default" size="lg">
                  Get Early Access
                </Button>
                <Button variant="link">Star on GitHub ⭐</Button>
              </div>

              {/* Stats */}
              <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-bold text-primary-500">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
