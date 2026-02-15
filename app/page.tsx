"use client";
import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";
import { ScrollSpyNav } from "@/components/sections/home/ScrollSpyNav";
import HeroSection from "@/components/sections/home/HeroSection";
import FeaturesSection from "@/components/sections/home/FeaturesSection";
import HowItWorksSection from "@/components/sections/home/HowItWorksSection";

// Main Home page component
export default function Home() {
  const { isSignedIn, isLoaded } = useAuth();

  useEffect(() => {
    if (isSignedIn) {
      window.location.href = "/projects";
    }
  }, [isSignedIn]);

  if (!isLoaded) {
    // Optionally show a loading spinner while Clerk loads
    return null;
  }

  if (isSignedIn) {
    // Optionally show nothing or a spinner while redirecting
    return null;
  }

  return (
    <>
      {/* Scroll-spy nav with theme toggle - positioned at top-right */}
      <ScrollSpyNav />

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
