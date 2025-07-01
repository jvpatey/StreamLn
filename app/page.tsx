import React from "react";
import { SimpleThemeToggle } from "@/components/ui/theme-toggle";
import HeroSection from "@/components/sections/home/HeroSection";
import FeaturesSection from "@/components/sections/home/FeaturesSection";
import HowItWorksSection from "@/components/sections/home/HowItWorksSection";

// Main Home page component
export default function Home() {
  return (
    <>
      {/* Floating theme toggle button - positioned in top-right corner */}
      <div className="fixed top-6 right-6 z-50">
        <SimpleThemeToggle />
      </div>

      {/* Main content area with responsive background */}
      <main className="min-h-screen bg-gray-50 dark:bg-slate-900">
        {/* Hero section - main landing area */}
        <HeroSection />
        {/* Features section - showcases product capabilities */}
        <FeaturesSection />
        {/* How it works section - explains the process */}
        <HowItWorksSection />
      </main>
    </>
  );
}
