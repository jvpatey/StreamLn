import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/shared/card";

export function CanvasPreview() {
  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-200 hover:border-primary/30 hover:bg-card/70 hover:shadow-lg cursor-pointer group">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold transition-colors duration-200 group-hover:text-primary/80">
          Canvas Preview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative h-32 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-lg overflow-hidden flex items-center justify-center border border-border/50 transition-all duration-200 group-hover:border-primary/30 group-hover:shadow-md">
          {/* Placeholder grid blocks */}
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 200 80"
            fill="none"
            className="transition-transform duration-200 group-hover:scale-105"
          >
            <rect
              x="12"
              y="12"
              width="50"
              height="20"
              rx="4"
              fill="#3b82f6"
              fillOpacity="0.18"
            />
            <rect
              x="70"
              y="12"
              width="40"
              height="15"
              rx="4"
              fill="#f59e42"
              fillOpacity="0.18"
            />
            <rect
              x="120"
              y="12"
              width="30"
              height="25"
              rx="4"
              fill="#3b82f6"
              fillOpacity="0.18"
            />
            <rect
              x="30"
              y="35"
              width="40"
              height="15"
              rx="4"
              fill="#f59e42"
              fillOpacity="0.18"
            />
            <rect
              x="80"
              y="35"
              width="50"
              height="12"
              rx="4"
              fill="#3b82f6"
              fillOpacity="0.18"
            />
            <rect
              x="140"
              y="35"
              width="35"
              height="18"
              rx="4"
              fill="#f59e42"
              fillOpacity="0.18"
            />
          </svg>
          <div className="absolute top-3 left-3 bg-white/90 dark:bg-slate-900/90 text-xs text-slate-700 dark:text-slate-200 px-2 py-1 rounded-full font-medium shadow-sm border border-border/50 transition-all duration-200 group-hover:bg-primary/10 group-hover:border-primary/30 group-hover:text-primary-700 dark:group-hover:text-primary-300">
            6 blocks
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
