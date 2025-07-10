import React, { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/shared/badge";
import { Button } from "@/components/ui/shared/button";
import { Card } from "@/components/ui/shared/card";
import { Plus } from "lucide-react";
import { IconPicker } from "../icon-picker";

interface CreateProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate?: (data: {
    name: string;
    description?: string;
    icon?: string;
  }) => Promise<void> | void;
}

// Create Project Modal - Used in: app/projects/page.tsx
export function CreateProjectModal({
  open,
  onOpenChange,
  onCreate,
}: CreateProjectModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus the name input when modal opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setName("");
      setDescription("");
      setSelectedIcon("");
      setError(null);
      setLoading(false);
    }
  }, [open]);

  // Keyboard shortcuts
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onOpenChange(false);
      } else if (
        e.key === "Enter" &&
        document.activeElement === inputRef.current
      ) {
        handleSubmit();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line
  }, [open, name, description]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError("Project name is required.");
      inputRef.current?.focus();
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await onCreate?.({
        name: name.trim(),
        description: description.trim() || undefined,
        icon: selectedIcon || undefined,
      });
      onOpenChange(false);
    } catch (err: any) {
      setError(err?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/50 dark:bg-slate-900/80 backdrop-blur-sm flex items-center justify-center"
      onClick={() => onOpenChange(false)}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-4 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="flex items-center border-b border-slate-200 dark:border-slate-700 p-4">
            <div className="flex items-center space-x-3 flex-1">
              <div className="p-2 rounded-lg bg-gradient-to-br from-primary-500/10 to-accent-500/10">
                <Plus
                  size={20}
                  className="text-primary-600 dark:text-primary-400"
                />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                  Create New Project
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Start a new workspace for your ideas, tasks, and notes.
                </p>
              </div>
            </div>
            <Badge variant="outline" className="hidden sm:flex">
              Project
            </Badge>
          </div>

          {/* Form */}
          <form
            className="space-y-6 p-6"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            autoComplete="off"
          >
            <div>
              <label
                htmlFor="project-name"
                className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1"
              >
                Project Name <span className="text-primary-500">*</span>
              </label>
              <input
                id="project-name"
                ref={inputRef}
                type="text"
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/60 px-4 py-3 text-base text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition"
                placeholder="e.g. Your Next Big Idea..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                maxLength={64}
                disabled={loading}
                autoFocus
              />
            </div>
            <div>
              <label
                htmlFor="project-description"
                className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1"
              >
                Description <span className="text-slate-400">(optional)</span>
              </label>
              <textarea
                id="project-description"
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/60 px-4 py-3 text-base text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition min-h-[64px] resize-none"
                placeholder="Describe your project, goals, or ideas..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={256}
                disabled={loading}
              />
            </div>

            <IconPicker
              selectedIcon={selectedIcon}
              onIconSelect={setSelectedIcon}
            />
            {error && (
              <div className="text-sm text-destructive-600 dark:text-destructive-400 font-medium">
                {error}
              </div>
            )}
            <div className="flex items-center justify-end space-x-3 pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="gradient"
                disabled={loading || !name.trim()}
                className="px-6"
              >
                {loading ? "Creating..." : "Create Project"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
