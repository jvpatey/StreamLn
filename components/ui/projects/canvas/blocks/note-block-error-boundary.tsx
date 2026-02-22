"use client";

import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * Catches errors (e.g. ProseMirror domFromPos) that can occur when the editor
 * is in flux during rapid updates. Prevents the whole block from breaking.
 */
export class NoteBlockErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.warn("[NoteBlock] Caught error:", error.message);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div
            className="h-full min-h-0 flex items-center justify-center p-4 text-slate-400 dark:text-slate-500 text-sm cursor-pointer hover:text-slate-600 dark:hover:text-slate-400"
            onClick={() => this.setState({ hasError: false })}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                this.setState({ hasError: false });
              }
            }}
          >
            Click to edit…
          </div>
        )
      );
    }
    return this.props.children;
  }
}
