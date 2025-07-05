import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { SimpleThemeToggle } from "@/components/ui/theme-toggle";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                StreamLn Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <SimpleThemeToggle />
              <UserButton />
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome to Your Canvas!
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Your infinite canvas for dev notes, planning, and execution is
            ready.
          </p>
          <Button variant="gradient" size="lg">
            Create New Canvas
          </Button>
        </div>
      </main>
    </div>
  );
}
