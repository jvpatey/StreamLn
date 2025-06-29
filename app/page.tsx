import React from "react";
import HeroSection from "@/components/sections/home/HeroSection";
import FeaturesSection from "@/components/sections/home/FeaturesSection";
import CTASection from "@/components/sections/home/CTASection";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <HeroSection />
      <FeaturesSection />
      <CTASection />
    </main>
  );
}
