import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-accent-500/10" />

        <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            {/* Beta badge */}
            <Badge variant="default" className="mb-6">
              🚀 Developer Productivity Platform
            </Badge>

            {/* Main headline */}
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-6xl">
              <span className="bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
                CodexFlow
              </span>
            </h1>
            <p className="mt-4 text-2xl font-semibold text-gray-700 dark:text-gray-300">
              Your second brain for code, tasks, and technical clarity
            </p>

            {/* Subheading */}
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
              Smart technical notes, visual task boards, and lightweight AI
              assistance combined into one interface. Built for solo devs and
              small teams who need structure and clarity.
            </p>

            {/* CTA buttons */}
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button variant="default" size="lg">
                Start Planning & Building
              </Button>
              <Button variant="link" className="leading-6">
                View Demo →
              </Button>
            </div>

            {/* Feature hints */}
            <div className="mt-16 flex items-center justify-center gap-8 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary-500" />
                Smart Notes
              </span>
              <span className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-accent-500" />
                Task Boards
              </span>
              <span className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary-500" />
                AI Copilot
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl">
              Everything you need to{" "}
              <span className="bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
                plan, document, and execute
              </span>
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
              CodexFlow combines smart note-taking, visual task management, and
              AI assistance in a single developer-focused workspace.
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-8">
            {[
              {
                title: "📝 Smart Notes",
                description:
                  "Rich markdown + code editor with tagging and linking. Inline summarization from PDFs and transcripts.",
                icon: "📝",
                highlight: "Tiptap Editor",
              },
              {
                title: "✅ Task Boards",
                description:
                  "Visual Kanban boards with drag-and-drop functionality. Link tasks to notes, add metadata, and organize visually.",
                icon: "✅",
                highlight: "Drag & Drop",
              },
              {
                title: "🔍 Semantic Search",
                description:
                  "Natural language search across all notes and tasks. Filter by tags, links, or content type.",
                icon: "🔍",
                highlight: "AI-Powered",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="hover:border-primary-300 transition-colors"
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{feature.icon}</span>
                    <Badge variant="secondary" className="text-xs">
                      {feature.highlight}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Additional Features Row */}
          <div className="mx-auto mt-8 grid max-w-2xl grid-cols-1 gap-6 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:gap-8">
            {[
              {
                title: "🔗 Knowledge Graph",
                description:
                  "Visualize how notes, tasks, and tags connect. Interactive graph view powered by React Flow.",
                icon: "🔗",
                highlight: "React Flow",
              },
              {
                title: "🧠 AI Copilot",
                description:
                  "Optional sidebar assistant to retrieve related notes, summarize content, and navigate contextually.",
                icon: "🧠",
                highlight: "GPT-4 Powered",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="hover:border-primary-300 transition-colors"
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{feature.icon}</span>
                    <Badge variant="secondary" className="text-xs">
                      {feature.highlight}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
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
                  tasks with CodexFlow. Plan, document, and execute with
                  structure and clarity.
                </p>

                <div className="mt-10 flex items-center justify-center gap-x-6">
                  <Button variant="default" size="lg">
                    Get Early Access
                  </Button>
                  <Button variant="link">Star on GitHub ⭐</Button>
                </div>

                {/* Stats */}
                <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-500">
                      6 weeks
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      to MVP launch
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-500">
                      Free
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      during beta
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-500">
                      Open
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      source friendly
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
