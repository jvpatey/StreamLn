"use client";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

/** Minimal shape for sortable canvas items - id and order required for reordering */
export interface SortableCanvasItemShape {
  id: string;
  order: number;
}

interface SortableCanvasItemProps {
  id: string;
  children: React.ReactNode;
  className?: string;
  dragHandleClassName?: string;
}

/** Wraps canvas row content with a drag handle. Use inside SortableCanvasList. */
export function SortableCanvasItem({
  id,
  children,
  className,
  dragHandleClassName = "shrink-0 cursor-grab active:cursor-grabbing p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:text-slate-300 dark:hover:bg-slate-700 touch-none opacity-60 hover:opacity-100",
}: SortableCanvasItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn("flex items-center gap-2", className)}
    >
      <button
        type="button"
        className={dragHandleClassName}
        aria-label="Drag to reorder"
        {...listeners}
        {...attributes}
      >
        <GripVertical size={14} />
      </button>
      {children}
    </div>
  );
}

interface SortableCanvasListProps<T extends SortableCanvasItemShape> {
  canvases: T[];
  onReorder: (reordered: T[]) => void;
  children: React.ReactNode;
}

/** Provides DndContext and SortableContext for canvas reordering. Children should be SortableCanvasItems. */
export function SortableCanvasList<T extends SortableCanvasItemShape>({
  canvases,
  onReorder,
  children,
}: SortableCanvasListProps<T>) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = canvases.findIndex((c) => c.id === active.id);
    const newIndex = canvases.findIndex((c) => c.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(canvases, oldIndex, newIndex).map((c, i) => ({
      ...c,
      order: i,
    }));
    onReorder(reordered);
  };

  const itemIds = canvases.map((c) => c.id);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={itemIds}
        strategy={verticalListSortingStrategy}
      >
        {children}
      </SortableContext>
    </DndContext>
  );
}
