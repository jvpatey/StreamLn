import React from "react";
import { SimpleThemeToggle } from "@/components/ui/theme-toggle";
import HeroSection from "@/components/sections/home/HeroSection";
import FeaturesSection from "@/components/sections/home/FeaturesSection";
import HowItWorksSection from "@/components/sections/home/HowItWorksSection";

export default function Home() {
  return (
    <>
      {/* Floating theme toggle button */}
      <div className="fixed top-6 right-6 z-50">
        <SimpleThemeToggle />
      </div>

      <main className="min-h-screen bg-gray-50 dark:bg-slate-900">
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
      </main>
    </>
  );
}
