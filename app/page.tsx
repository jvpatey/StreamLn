import React from "react";
import HeroSection from "@/components/sections/home/HeroSection";
import FeaturesSection from "@/components/sections/home/FeaturesSection";
import HowItWorksSection from "@/components/sections/home/HowItWorksSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
    </main>
  );
}
