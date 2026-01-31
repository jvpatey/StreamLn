"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  pointerWithin,
  rectIntersection,
  getFirstCollision,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  defaultDropAnimationSideEffects,
  type CollisionDetection,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Plus, GripVertical, LayoutList } from "lucide-react";
import { Button } from "@/components/ui/shared/button";
import {
  getTaskBoardContent,
  createId,
  type TaskBoardContent,
  type TaskBoardColumn,
  type TaskBoardCard,
} from "./task-board-defaults";

const DEBOUNCE_MS = 300;

const dropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: { active: { opacity: "0.4" } },
  }),
  duration: 200,
  easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
};

interface CanvasBlock {
  id: string;
  type: string;
  content: unknown;
  color?: string;
  title?: string;
}

interface TaskBoardBlockProps {
  block: CanvasBlock;
  onUpdate: (updates: Partial<CanvasBlock>) => void;
  isEditable: boolean;
}

/** Presentational card content - used in list and drag overlay */
function CardContent({
  card,
  isEditable,
  showGrip = true,
  isOverlay = false,
  onTextChange,
}: {
  card: TaskBoardCard;
  isEditable: boolean;
  showGrip?: boolean;
  isOverlay?: boolean;
  onTextChange: (text: string) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [localText, setLocalText] = useState(card.text);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLocalText(card.text);
  }, [card.text]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleBlur = () => {
    setIsEditing(false);
    if (localText.trim() !== card.text) {
      onTextChange(localText.trim() || "Untitled");
    }
  };

  return (
    <div
      data-no-block-drag
      className={`flex items-start gap-2 rounded-lg border px-2.5 py-2 ${
        isOverlay
          ? "cursor-grabbing border-slate-300/80 bg-white shadow-xl dark:border-slate-500/80 dark:bg-slate-800"
          : "border-slate-200/80 bg-white shadow-sm transition-shadow hover:shadow dark:border-slate-600/80 dark:bg-slate-800/80"
      }`}
    >
      {isEditable && showGrip && !isOverlay && (
        <div className="mt-0.5 shrink-0 rounded p-0.5 text-slate-400">
          <GripVertical size={14} />
        </div>
      )}
      {isOverlay && (
        <div className="mt-0.5 shrink-0 rounded p-0.5 text-slate-400">
          <GripVertical size={14} />
        </div>
      )}
      {isEditing && !isOverlay ? (
        <input
          ref={inputRef}
          type="text"
          value={localText}
          onChange={(e) => setLocalText(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              (e.target as HTMLInputElement).blur();
            }
            if (e.key === "Escape") {
              setLocalText(card.text);
              setIsEditing(false);
              (e.target as HTMLInputElement).blur();
            }
          }}
          className="min-w-0 flex-1 bg-transparent text-sm text-slate-800 outline-none dark:text-slate-200"
          onMouseDown={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
        />
      ) : (
        <button
          type="button"
          className="min-w-0 flex-1 text-left text-sm text-slate-800 dark:text-slate-200"
          onClick={() => !isOverlay && isEditable && setIsEditing(true)}
          onMouseDown={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
        >
          {card.text || "Untitled"}
        </button>
      )}
    </div>
  );
}

function SortableCard({
  card,
  isEditable,
  onTextChange,
}: {
  card: TaskBoardCard;
  isEditable: boolean;
  onTextChange: (text: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0 : 1,
    pointerEvents: isDragging ? ("none" as const) : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      data-no-block-drag
      className="group flex"
    >
      {isEditable && (
        <button
          type="button"
          className="shrink-0 cursor-grab touch-none rounded p-1 text-slate-400 opacity-0 transition-opacity hover:bg-slate-100 hover:text-slate-600 group-hover:opacity-100 active:cursor-grabbing dark:hover:bg-slate-700 dark:hover:text-slate-300"
          aria-label="Drag to reorder"
          {...listeners}
          {...attributes}
        >
          <GripVertical size={14} />
        </button>
      )}
      <div className="min-w-0 flex-1">
        <CardContent
          card={card}
          isEditable={isEditable}
          showGrip={false}
          isOverlay={false}
          onTextChange={onTextChange}
        />
      </div>
    </div>
  );
}

function Column({
  column,
  cards,
  isEditable,
  blockColor,
  onAddCard,
  onColumnTitleChange,
  onCardTextChange,
}: {
  column: TaskBoardColumn;
  cards: Record<string, TaskBoardCard>;
  isEditable: boolean;
  blockColor: string;
  onAddCard: () => void;
  onColumnTitleChange: (title: string) => void;
  onCardTextChange: (cardId: string, text: string) => void;
}) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [localTitle, setLocalTitle] = useState(column.title);
  const inputRef = useRef<HTMLInputElement>(null);

  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: { type: "container", children: column.cardIds },
  });

  useEffect(() => {
    setLocalTitle(column.title);
  }, [column.title]);

  useEffect(() => {
    if (isEditingTitle && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditingTitle]);

  const handleTitleBlur = () => {
    setIsEditingTitle(false);
    const trimmed = localTitle.trim();
    if (trimmed !== column.title) {
      onColumnTitleChange(trimmed);
      setLocalTitle(trimmed);
    } else {
      setLocalTitle(column.title);
    }
  };

  const columnCards = column.cardIds
    .map((id) => cards[id])
    .filter((c): c is TaskBoardCard => !!c);

  return (
    <div
      ref={setNodeRef}
      data-no-block-drag
      className={`flex w-52 shrink-0 flex-col rounded-xl border bg-slate-50/80 dark:bg-slate-900/50 ${
        isOver
          ? "border-slate-300 dark:border-slate-500"
          : "border-slate-200/80 dark:border-slate-700/80"
      }`}
      style={{
        borderTopWidth: 3,
        borderTopColor: isOver ? blockColor : "transparent",
      }}
    >
      <div
        className="flex items-center justify-between gap-2 border-b border-slate-200/80 px-3 py-2 dark:border-slate-700/80"
        style={{ background: `${blockColor}12` }}
      >
        {isEditingTitle ? (
          <input
            ref={inputRef}
            type="text"
            value={localTitle}
            onChange={(e) => setLocalTitle(e.target.value)}
            onBlur={handleTitleBlur}
            onKeyDown={(e) => {
              if (e.key === "Enter") (e.target as HTMLInputElement).blur();
              if (e.key === "Escape") {
                setLocalTitle(column.title);
                setIsEditingTitle(false);
                (e.target as HTMLInputElement).blur();
              }
            }}
            className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-slate-800 outline-none dark:text-slate-200"
            onMouseDown={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
          />
        ) : (
          <button
            type="button"
            className="min-w-0 flex-1 text-left text-sm font-semibold text-slate-800 dark:text-slate-200"
            onClick={() => isEditable && setIsEditingTitle(true)}
            onMouseDown={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
          >
            {column.title || (
              <span className="text-slate-400 dark:text-slate-500">Add title…</span>
            )}
          </button>
        )}
        {isEditable && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            onClick={(e) => {
              e.stopPropagation();
              onAddCard();
            }}
            onMouseDown={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            aria-label="Add card"
          >
            <Plus size={14} />
          </Button>
        )}
      </div>
      <div className="flex min-h-[80px] flex-1 flex-col gap-2 overflow-y-auto p-2">
        <SortableContext
          items={column.cardIds}
          strategy={verticalListSortingStrategy}
        >
          {columnCards.map((card) => (
            <SortableCard
              key={card.id}
              card={card}
              isEditable={isEditable}
              onTextChange={(text) => onCardTextChange(card.id, text)}
            />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}

export function TaskBoardBlock({
  block,
  onUpdate,
  isEditable,
}: TaskBoardBlockProps) {
  const content = getTaskBoardContent(block.content);
  const [localContent, setLocalContent] = useState(content);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const contentRef = useRef(localContent);
  const clonedContentRef = useRef<TaskBoardContent | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onUpdateRef = useRef(onUpdate);
  const lastOverId = useRef<UniqueIdentifier | null>(null);
  const recentlyMovedToNewContainer = useRef(false);
  const blockColor = block.color || "#10b981";

  contentRef.current = localContent;
  onUpdateRef.current = onUpdate;

  useEffect(() => {
    const next = getTaskBoardContent(block.content);
    setLocalContent(next);
  }, [block.content]);

  const persist = useCallback((next: TaskBoardContent) => {
    setLocalContent(next);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      debounceRef.current = null;
      onUpdateRef.current({ content: next });
    }, DEBOUNCE_MS);
  }, []);

  const findContainer = useCallback(
    (id: UniqueIdentifier, data?: TaskBoardContent): string | undefined => {
      const dataSource = data ?? contentRef.current;
      if (dataSource.columns.some((c) => c.id === id)) return id as string;
      for (const col of dataSource.columns) {
        if (col.cardIds.includes(id as string)) return col.id;
      }
      return undefined;
    },
    []
  );

  const collisionDetection: CollisionDetection = useCallback((args) => {
    const pointerIntersections = pointerWithin(args);
    const intersections =
      pointerIntersections.length > 0 ? pointerIntersections : rectIntersection(args);
    let overId = getFirstCollision(intersections, "id") ?? null;

    if (overId != null) {
      const current = contentRef.current;
      const overColumn = current.columns.find((c) => c.id === overId);
      if (overColumn && overColumn.cardIds.length > 0) {
        const closestCard = closestCenter({
          ...args,
          droppableContainers: args.droppableContainers.filter((c) =>
            overColumn.cardIds.includes(c.id as string)
          ),
        })[0];
        if (closestCard) overId = closestCard.id;
      }
      lastOverId.current = overId;
      return [{ id: overId }];
    }
    if (recentlyMovedToNewContainer.current) {
      lastOverId.current = args.active.id;
    }
    return lastOverId.current ? [{ id: lastOverId.current }] : [];
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      const { active, over } = event;
      if (!over?.id) return;

      const activeContainer = findContainer(active.id);
      if (!activeContainer) return;

      if (contentRef.current.columns.some((c) => c.id === active.id)) return;

      const overId = over.id as string;
      const overContainer = findContainer(overId);
      if (!overContainer || activeContainer === overContainer) return;

      recentlyMovedToNewContainer.current = true;
      const current = contentRef.current;
      const newColumns = current.columns.map((col) => {
        if (col.id === activeContainer) {
          return {
            ...col,
            cardIds: col.cardIds.filter((id) => id !== active.id),
          };
        }
        if (col.id === overContainer) {
          const overIndex = col.cardIds.indexOf(overId);
          const insertIndex = overIndex >= 0 ? overIndex : col.cardIds.length;
          const newIds = [...col.cardIds];
          newIds.splice(insertIndex, 0, active.id as string);
          return { ...col, cardIds: newIds };
        }
        return col;
      });
      const next: TaskBoardContent = { ...current, columns: newColumns };
      contentRef.current = next;
      setLocalContent(next);
    },
    [findContainer]
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over?.id) {
        if (clonedContentRef.current) {
          contentRef.current = clonedContentRef.current;
          setLocalContent(clonedContentRef.current);
          clonedContentRef.current = null;
        }
        lastOverId.current = null;
        setActiveId(null);
        return;
      }

      const current = contentRef.current;
      const activeContainer = findContainer(active.id);
      if (!activeContainer) {
        lastOverId.current = null;
        setActiveId(null);
        return;
      }

      if (current.columns.some((c) => c.id === active.id)) {
        lastOverId.current = null;
        setActiveId(null);
        return;
      }

      const overContainer = findContainer(over.id);
      if (!overContainer) {
        lastOverId.current = null;
        setActiveId(null);
        return;
      }

      if (activeContainer === overContainer) {
        const col = current.columns.find((c) => c.id === overContainer)!;
        const activeIndex = col.cardIds.indexOf(active.id as string);
        const overIndex = col.cardIds.indexOf(over.id as string);
        if (activeIndex !== overIndex) {
          const newCardIds = arrayMove(col.cardIds, activeIndex, overIndex);
          const next: TaskBoardContent = {
            ...current,
            columns: current.columns.map((c) =>
              c.id === overContainer ? { ...c, cardIds: newCardIds } : c
            ),
          };
          contentRef.current = next;
          setLocalContent(next);
          persist(next);
        }
      }

      requestAnimationFrame(() => {
        recentlyMovedToNewContainer.current = false;
      });
      lastOverId.current = null;
      setActiveId(null);
      persist(contentRef.current);
    },
    [findContainer, persist]
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id);
    clonedContentRef.current = JSON.parse(JSON.stringify(contentRef.current));
  }, []);

  const handleDragCancel = useCallback(() => {
    if (clonedContentRef.current) {
      contentRef.current = clonedContentRef.current;
      setLocalContent(clonedContentRef.current);
      clonedContentRef.current = null;
    }
    setActiveId(null);
    lastOverId.current = null;
  }, []);

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
        debounceRef.current = null;
      }
    };
  }, []);

  const handleAddCard = useCallback(
    (columnId: string) => {
      const current = contentRef.current;
      const cardId = createId();
      const newCard: TaskBoardCard = { id: cardId, text: "New task" };
      const next: TaskBoardContent = {
        columns: current.columns.map((col) =>
          col.id === columnId
            ? { ...col, cardIds: [...col.cardIds, cardId] }
            : col
        ),
        cards: { ...current.cards, [cardId]: newCard },
      };
      persist(next);
    },
    [persist]
  );

  const handleAddColumn = useCallback(() => {
    const current = contentRef.current;
    const newColumn: TaskBoardColumn = {
      id: createId(),
      title: "",
      cardIds: [],
    };
    const next: TaskBoardContent = {
      ...current,
      columns: [...current.columns, newColumn],
    };
    persist(next);
  }, [persist]);

  const handleColumnTitleChange = useCallback(
    (columnId: string, title: string) => {
      const current = contentRef.current;
      const next: TaskBoardContent = {
        ...current,
        columns: current.columns.map((col) =>
          col.id === columnId ? { ...col, title } : col
        ),
      };
      persist(next);
    },
    [persist]
  );

  const handleCardTextChange = useCallback(
    (cardId: string, text: string) => {
      const current = contentRef.current;
      const card = current.cards[cardId];
      if (!card) return;
      const next: TaskBoardContent = {
        ...current,
        cards: { ...current.cards, [cardId]: { ...card, text } },
      };
      persist(next);
    },
    [persist]
  );

  return (
    <div
      className="h-full min-h-0 overflow-auto p-3"
      data-no-block-drag
      onMouseDown={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
    >
      <DndContext
        sensors={sensors}
        collisionDetection={collisionDetection}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div className="flex gap-3 overflow-x-auto pb-2">
          {localContent.columns.map((column) => (
            <Column
              key={column.id}
              column={column}
              cards={localContent.cards}
              isEditable={isEditable}
              blockColor={blockColor}
              onAddCard={() => handleAddCard(column.id)}
              onColumnTitleChange={(title) =>
                handleColumnTitleChange(column.id, title)
              }
              onCardTextChange={handleCardTextChange}
            />
          ))}
          {isEditable && (
            <button
              type="button"
              onClick={handleAddColumn}
              onMouseDown={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              data-no-block-drag
              className="flex w-52 shrink-0 items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/50 py-8 text-sm font-medium text-slate-500 transition-colors hover:border-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:border-slate-600 dark:bg-slate-900/30 dark:text-slate-400 dark:hover:border-slate-500 dark:hover:bg-slate-800/50 dark:hover:text-slate-300"
            >
              <LayoutList size={18} />
              Add board
            </button>
          )}
        </div>

        {typeof document !== "undefined" &&
          createPortal(
            <DragOverlay dropAnimation={dropAnimation}>
              {activeId && localContent.cards[activeId as string] ? (
                <CardContent
                  card={localContent.cards[activeId as string]}
                  isEditable={false}
                  showGrip={true}
                  isOverlay={true}
                  onTextChange={() => {}}
                />
              ) : null}
            </DragOverlay>,
            document.body
          )}
      </DndContext>
    </div>
  );
}
