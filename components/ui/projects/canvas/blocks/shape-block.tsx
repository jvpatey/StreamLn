"use client";

import { getShapeContent } from "./shape-defaults";

interface CanvasBlock {
  id: string;
  type: string;
  content: unknown;
  color?: string;
  width?: number;
  height?: number;
}

interface ShapeBlockProps {
  block: CanvasBlock;
  onUpdate: (updates: Partial<CanvasBlock>) => void;
  isEditable: boolean;
}

export function ShapeBlock({ block }: ShapeBlockProps) {
  const content = getShapeContent(block.content);
  const w = block.width ?? 120;
  const h = block.height ?? 80;
  const stroke = content.strokeColor ?? "hsl(var(--foreground) / 0.4)";
  const fill = content.fillColor ?? "transparent";
  const strokeWidth = content.strokeWidth ?? 2;

  const renderShape = () => {
    switch (content.shapeKind) {
      case "rectangle":
        return (
          <rect
            x={strokeWidth / 2}
            y={strokeWidth / 2}
            width={w - strokeWidth}
            height={h - strokeWidth}
            rx={4}
            ry={4}
            fill={fill}
            stroke={stroke}
            strokeWidth={strokeWidth}
          />
        );
      case "circle":
        return (
          <ellipse
            cx={w / 2}
            cy={h / 2}
            rx={Math.max(0, (w - strokeWidth) / 2)}
            ry={Math.max(0, (h - strokeWidth) / 2)}
            fill={fill}
            stroke={stroke}
            strokeWidth={strokeWidth}
          />
        );
      case "line":
        return (
          <line
            x1={strokeWidth}
            y1={h / 2}
            x2={w - strokeWidth}
            y2={h / 2}
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
        );
      case "arrow": {
        const headSize = Math.min(12, w * 0.15, h * 0.5);
        const lineEnd = w - strokeWidth - headSize;
        return (
          <g>
            <line
              x1={strokeWidth}
              y1={h / 2}
              x2={lineEnd}
              y2={h / 2}
              stroke={stroke}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <polygon
              points={`${w - strokeWidth},${h / 2} ${w - strokeWidth - headSize},${h / 2 - headSize / 2} ${w - strokeWidth - headSize},${h / 2 + headSize / 2}`}
              fill={stroke}
            />
          </g>
        );
      }
      default:
        return (
          <rect
            x={strokeWidth / 2}
            y={strokeWidth / 2}
            width={w - strokeWidth}
            height={h - strokeWidth}
            rx={4}
            ry={4}
            fill={fill}
            stroke={stroke}
            strokeWidth={strokeWidth}
          />
        );
    }
  };

  return (
    <div className="h-full w-full flex items-center justify-center p-0">
      <svg
        width={w}
        height={h}
        className="overflow-visible"
        style={{ maxWidth: "100%", maxHeight: "100%" }}
      >
        {renderShape()}
      </svg>
    </div>
  );
}
