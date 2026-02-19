"use client";

// Shimmer overlay for skeleton blocks
const Shimmer = () => (
  <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent dark:via-white/10" />
);

// Single skeleton block placeholder
function SkeletonBlock({
  width,
  height,
  left,
  top,
  delay,
}: {
  width: number;
  height: number;
  left: number;
  top: number;
  delay?: number;
}) {
  return (
    <div
      className="absolute rounded-xl overflow-hidden bg-white/70 dark:bg-slate-800/70 backdrop-blur-md border border-slate-200/50 dark:border-slate-700/50 shadow-lg"
      style={{
        width,
        height,
        left,
        top,
        animationDelay: delay ? `${delay}ms` : undefined,
      }}
    >
      <Shimmer />
      <div className="p-4 h-full flex flex-col">
        <div className="h-4 w-3/4 rounded bg-slate-200/60 dark:bg-slate-700/60 mb-3" />
        <div className="space-y-2 flex-1">
          <div className="h-3 rounded bg-slate-200/60 dark:bg-slate-700/60 w-full" />
          <div className="h-3 rounded bg-slate-200/60 dark:bg-slate-700/60 w-5/6" />
          <div className="h-3 rounded bg-slate-200/60 dark:bg-slate-700/60 w-4/6" />
        </div>
      </div>
    </div>
  );
}

// Skeleton blocks arranged in center of workspace (mimics typical block layout)
const SKELETON_BLOCKS = [
  { width: 280, height: 180, left: 100, top: 80, delay: 0 },
  { width: 260, height: 160, left: 420, top: 60, delay: 50 },
  { width: 240, height: 140, left: 120, top: 300, delay: 100 },
  { width: 300, height: 120, left: 400, top: 280, delay: 150 },
  { width: 200, height: 100, left: 200, top: 480, delay: 200 },
  { width: 220, height: 110, left: 450, top: 450, delay: 250 },
];

export function CanvasWorkspaceSkeleton() {
  return (
    <div
      className="relative w-full h-full overflow-hidden select-none"
      style={{
        background: `
          radial-gradient(circle, rgba(148, 163, 184, 0.4) 1px, transparent 1px)
        `,
        backgroundSize: "20px 20px",
      }}
    >
      <div className="relative origin-top-left" style={{ transform: "translate(0, 0) scale(1)" }}>
        {SKELETON_BLOCKS.map((block, index) => (
          <SkeletonBlock
            key={index}
            width={block.width}
            height={block.height}
            left={block.left}
            top={block.top}
            delay={block.delay}
          />
        ))}
        {/* Canvas origin indicator */}
        <div
          className="absolute w-4 h-4 border-2 border-slate-400 dark:border-slate-600 rounded-full bg-white dark:bg-slate-800 pointer-events-none opacity-30"
          style={{ left: -8, top: -8 }}
        />
      </div>
    </div>
  );
}
