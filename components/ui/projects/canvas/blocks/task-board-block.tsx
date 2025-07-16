"use client";

interface CanvasBlock {
  id: string;
  type: string;
  content: any;
  color?: string;
  title?: string;
}

interface TaskBoardBlockProps {
  block: CanvasBlock;
  onUpdate: (updates: Partial<CanvasBlock>) => void;
  isEditable: boolean;
}

export function TaskBoardBlock({
  block,
  onUpdate,
  isEditable,
}: TaskBoardBlockProps) {
  return (
    <div className="h-full flex items-center justify-center p-4">
      <div className="text-center text-slate-400 dark:text-slate-500">
        <div className="text-sm mb-2">Task Board Block</div>
        <div className="text-xs">Coming soon...</div>
      </div>
    </div>
  );
}
