"use client";

import { FileText, Kanban, Code2, Image, Link, LayoutList } from "lucide-react";

/** Polished hero preview mimicking the canvas workspace - dark theme for premium feel */
export function HeroCanvasPreview() {
  const blockColor = "#10b981";
  return (
    <div className="relative rounded-2xl border border-slate-700/80 bg-slate-900/95 backdrop-blur-sm shadow-2xl overflow-hidden ring-1 ring-white/5">
      {/* Canvas with dot grid */}
      <div
        className="relative h-56 sm:h-64 bg-slate-900"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(148, 163, 184, 0.35) 1px, transparent 1px)`,
          backgroundSize: "14px 14px",
        }}
      >
        {/* Blocks - positioned with improved spacing */}
        <div className="absolute inset-0 p-3 sm:p-4">
          {/* Image block - top left with sample image */}
          <div
            className="absolute rounded-xl overflow-hidden shadow-lg border border-amber-500/30 flex flex-col"
            style={{
              left: "2%",
              top: "4%",
              width: "24%",
              height: "40%",
              background:
                "linear-gradient(135deg, rgba(245,158,11,0.15) 0%, rgba(217,119,6,0.12) 100%)",
            }}
          >
            <div
              className="flex items-center gap-1.5 px-2 py-1 border-b border-amber-500/20 shrink-0"
              style={{ background: "rgba(245,158,11,0.12)" }}
            >
              <Image size={8} className="text-amber-400" />
              <span className="text-[8px] font-medium text-slate-200 truncate">
                Designs
              </span>
            </div>
            <div className="flex-1 min-h-0 relative bg-slate-800/80">
              <img
                src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=200&h=120&fit=crop"
                alt=""
                className="w-full h-full object-cover opacity-90"
              />
            </div>
          </div>

          {/* Task-board block - Kanban - fits within bounds, no overflow */}
          <div
            className="absolute rounded-xl overflow-hidden shadow-lg border border-emerald-500/30 flex flex-col"
            style={{
              left: "28%",
              top: "2%",
              width: "70%",
              height: "44%",
              background:
                "linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(5,150,105,0.12) 100%)",
            }}
          >
            <div
              className="shrink-0 flex items-center gap-1.5 px-2 py-1 border-b border-emerald-500/20"
              style={{ background: `${blockColor}12` }}
            >
              <Kanban size={8} className="text-emerald-400" />
              <span className="text-[8px] font-medium text-slate-200 truncate">
                Sprint Planning
              </span>
            </div>
            <div className="flex-1 min-h-0 p-2 flex gap-2 overflow-x-auto overflow-y-hidden">
              {/* To Do column - header shrink-0, content scrolls */}
              <div
                className="flex w-24 shrink-0 flex-col overflow-hidden rounded-2xl border border-slate-600/80 bg-slate-800/95 shadow-sm min-h-0"
                style={{ borderTopWidth: 2, borderTopColor: "rgba(148,163,184,0.4)" }}
              >
                <div
                  className="shrink-0 border-b border-slate-600/80 px-1.5 py-0.5 leading-none flex items-center"
                  style={{ background: `${blockColor}12` }}
                >
                  <span className="text-[8px] font-medium text-slate-200">To Do</span>
                </div>
                <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-1.5 flex flex-col gap-1.5">
                  <div className="rounded-xl border border-slate-600/80 bg-slate-800/80 px-2 py-1.5 shadow-sm shrink-0">
                    <span className="text-[7px] text-slate-200 leading-tight block">Set up project</span>
                  </div>
                  <div className="rounded-xl border border-slate-600/80 bg-slate-800/80 px-2 py-1.5 shadow-sm shrink-0">
                    <span className="text-[7px] text-slate-200 leading-tight block">Review design</span>
                  </div>
                </div>
              </div>
              {/* In Progress column */}
              <div
                className="flex w-24 shrink-0 flex-col overflow-hidden rounded-2xl border border-emerald-500/40 bg-slate-800/95 shadow-sm min-h-0"
                style={{ borderTopWidth: 3, borderTopColor: blockColor }}
              >
                <div
                  className="shrink-0 border-b border-slate-600/80 px-1.5 py-0.5 leading-none flex items-center"
                  style={{ background: `${blockColor}12` }}
                >
                  <span className="text-[8px] font-medium text-slate-200">In Progress</span>
                </div>
                <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-1.5 flex flex-col gap-1.5">
                  <div className="rounded-xl border border-emerald-500/30 bg-slate-800/80 px-2 py-1.5 shadow-sm shrink-0">
                    <span className="text-[7px] text-slate-200 leading-tight block">Build canvas UI</span>
                  </div>
                  <div className="rounded-xl border border-emerald-500/30 bg-slate-800/80 px-2 py-1.5 shadow-sm shrink-0">
                    <span className="text-[7px] text-slate-200 leading-tight block">API integration</span>
                  </div>
                </div>
              </div>
              {/* Done column */}
              <div
                className="flex w-24 shrink-0 flex-col overflow-hidden rounded-2xl border border-slate-600/80 bg-slate-800/95 shadow-sm min-h-0"
                style={{ borderTopWidth: 2, borderTopColor: "rgba(148,163,184,0.4)" }}
              >
                <div
                  className="shrink-0 border-b border-slate-600/80 px-1.5 py-0.5 leading-none flex items-center"
                  style={{ background: `${blockColor}12` }}
                >
                  <span className="text-[8px] font-medium text-slate-200">Done</span>
                </div>
                <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-1.5 flex flex-col gap-1.5">
                  <div className="rounded-xl border border-slate-600/80 bg-slate-800/60 px-2 py-1.5 shadow-sm shrink-0">
                    <span className="text-[7px] text-slate-500 line-through leading-tight block">Initial setup</span>
                  </div>
                  <div className="rounded-xl border border-slate-600/80 bg-slate-800/60 px-2 py-1.5 shadow-sm shrink-0">
                    <span className="text-[7px] text-slate-500 line-through leading-tight block">Design review</span>
                  </div>
                </div>
              </div>
              {/* Add board */}
              <div className="flex w-24 shrink-0 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-500/60 bg-slate-800/40 py-4">
                <LayoutList size={12} className="text-slate-500 opacity-70" />
                <span className="text-[7px] font-medium text-slate-500 mt-1">Add board</span>
              </div>
            </div>
          </div>

          {/* Note block - bottom left */}
          <div
            className="absolute rounded-xl overflow-hidden shadow-lg border border-blue-500/30"
            style={{
              left: "2%",
              top: "48%",
              width: "24%",
              height: "46%",
              background:
                "linear-gradient(135deg, rgba(59,130,246,0.15) 0%, rgba(37,99,235,0.12) 100%)",
            }}
          >
            <div
              className="flex items-center gap-1.5 px-2 py-1 border-b border-blue-500/20"
              style={{ background: "rgba(59,130,246,0.12)" }}
            >
              <FileText size={8} className="text-blue-400" />
              <span className="text-[8px] font-medium text-slate-200 truncate">
                API Notes
              </span>
            </div>
            <div className="p-2 space-y-1">
              <div className="text-[7px] text-slate-300 leading-tight">
                API refactor notes
              </div>
              <div className="text-[7px] text-slate-500 leading-tight">
                • Move auth to middleware
              </div>
              <div className="text-[7px] text-slate-500 leading-tight">
                • Add rate limiting
              </div>
            </div>
          </div>

          {/* Link block - bottom center with sample link */}
          <div
            className="absolute rounded-xl overflow-hidden shadow-lg border border-cyan-500/30"
            style={{
              left: "28%",
              top: "48%",
              width: "34%",
              height: "46%",
              background:
                "linear-gradient(135deg, rgba(6,182,212,0.15) 0%, rgba(8,145,178,0.12) 100%)",
            }}
          >
            <div
              className="flex items-center gap-1.5 px-2 py-1 border-b border-cyan-500/20"
              style={{ background: "rgba(6,182,212,0.12)" }}
            >
              <Link size={8} className="text-cyan-400" />
              <span className="text-[8px] font-medium text-slate-200 truncate">
                Docs
              </span>
            </div>
            <div className="p-2 space-y-1.5">
              <div className="flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-1.5 py-1">
                <span className="text-[6px] text-emerald-400 shrink-0">✓</span>
                <div className="min-w-0 flex-1">
                  <div className="text-[7px] text-slate-200 truncate">docs.streamln.dev</div>
                  <div className="text-[6px] text-slate-500 truncate">Getting Started</div>
                </div>
              </div>
              <div className="h-2.5 rounded bg-slate-700/50 border border-slate-600/50 flex items-center gap-1 px-1">
                <Link size={6} className="text-slate-500 shrink-0" />
                <span className="text-[7px] text-slate-500 truncate">Paste a link or type a URL</span>
              </div>
              <div className="h-2.5 rounded bg-slate-700/50 border border-slate-600/50 flex items-center px-1">
                <span className="text-[7px] text-slate-500">Label (optional)</span>
              </div>
            </div>
          </div>

          {/* Code block - bottom right */}
          <div
            className="absolute rounded-xl overflow-hidden shadow-lg border border-violet-500/30"
            style={{
              left: "64%",
              top: "48%",
              width: "34%",
              height: "46%",
              background:
                "linear-gradient(135deg, rgba(139,92,246,0.15) 0%, rgba(124,58,237,0.12) 100%)",
            }}
          >
            <div
              className="flex items-center justify-between gap-1.5 px-2 py-1 border-b border-violet-500/20"
              style={{ background: "rgba(139,92,246,0.12)" }}
            >
              <div className="flex items-center gap-1.5">
                <Code2 size={8} className="text-violet-400" />
                <span className="text-[8px] font-medium text-slate-200 truncate">
                  API
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[7px] text-slate-400">JavaScript</span>
                <span className="text-[7px] text-slate-500">Copy</span>
              </div>
            </div>
            <div className="p-1.5 font-mono text-[7px] bg-slate-950/80 space-y-0.5">
              <div className="flex gap-2">
                <span className="text-slate-500 select-none w-3">1</span>
                <span className="text-violet-300">const</span>
                <span className="text-slate-300"> app =</span>
                <span className="text-amber-300"> express</span>
                <span className="text-slate-400">();</span>
              </div>
              <div className="flex gap-2">
                <span className="text-slate-500 select-none w-3">2</span>
                <span className="text-slate-400">app.</span>
                <span className="text-cyan-300">get</span>
                <span className="text-slate-400">(</span>
                <span className="text-emerald-400">&apos;/api&apos;</span>
                <span className="text-slate-400">, ...);</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
