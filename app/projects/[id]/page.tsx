"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchCanvases } from "@/lib/api/canvas";

export default function ProjectRedirectPage() {
  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    const redirect = async () => {
      if (!id || typeof id !== "string") return;

      try {
        const canvases = await fetchCanvases(id);
        const firstCanvas = canvases[0];
        if (firstCanvas) {
          router.replace(`/projects/${id}/canvas/${firstCanvas.id}`);
        } else {
          router.replace("/projects");
        }
      } catch {
        router.replace("/projects");
      }
    };

    redirect();
  }, [id, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-600 dark:text-slate-400">Loading project...</p>
      </div>
    </div>
  );
}
