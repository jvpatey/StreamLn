"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/shared/button";
import { Tooltip } from "@/components/ui/shared/tooltip";
import {
  Share2,
  Link2,
  Copy,
  Trash2,
  Users,
  Check,
  Loader2,
} from "lucide-react";
import {
  createShareToken,
  listShareTokens,
  revokeShareToken,
  type ShareToken,
} from "@/lib/api/share";
import {
  getDefaultShareExpiry,
  setDefaultShareExpiry,
} from "@/lib/canvas-preferences";

interface ShareCanvasModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  canvasId: string;
  projectName: string;
  canvasName: string;
}

const EXPIRY_OPTIONS = [
  { value: undefined, label: "Never" },
  { value: 7, label: "7 days" },
  { value: 30, label: "30 days" },
] as const;

export function ShareCanvasModal({
  open,
  onOpenChange,
  projectId,
  canvasId,
  projectName,
  canvasName,
}: ShareCanvasModalProps) {
  const [tokens, setTokens] = useState<ShareToken[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [revoking, setRevoking] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expiresIn, setExpiresIn] = useState<number | undefined>(
    () => getDefaultShareExpiry()
  );
  const [error, setError] = useState<string | null>(null);

  const loadTokens = useCallback(async () => {
    if (!open || !projectId || !canvasId) return;
    setLoading(true);
    setError(null);
    try {
      const { tokens: list } = await listShareTokens(projectId, canvasId);
      setTokens(list);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [open, projectId, canvasId]);

  useEffect(() => {
    loadTokens();
  }, [loadTokens]);

  useEffect(() => {
    if (open) {
      setExpiresIn(getDefaultShareExpiry());
    }
  }, [open]);

  const getShareUrl = (token: string) => {
    const base =
      typeof window !== "undefined"
        ? window.location.origin
        : process.env.NEXT_PUBLIC_APP_URL ?? "";
    return `${base}/s/${token}`;
  };

  const handleCreateLink = async () => {
    setCreating(true);
    setError(null);
    try {
      const created = await createShareToken(
        projectId,
        canvasId,
        expiresIn
      );
      setTokens((prev) => [created, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create link");
    } finally {
      setCreating(false);
    }
  };

  const handleCopy = async (shareToken: ShareToken) => {
    const url = getShareUrl(shareToken.token);
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        throw new Error("Clipboard not available");
      }
    } catch {
      try {
        const textarea = document.createElement("textarea");
        textarea.value = url;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      } catch {
        setError("Failed to copy link");
        return;
      }
    }
    setCopiedId(shareToken.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRevoke = async (tokenId: string) => {
    setRevoking(tokenId);
    setError(null);
    try {
      await revokeShareToken(projectId, canvasId, tokenId);
      setTokens((prev) => prev.filter((t) => t.id !== tokenId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to revoke");
    } finally {
      setRevoking(null);
    }
  };

  const activeTokens = tokens.filter(
    (t) => !t.expiresAt || new Date(t.expiresAt) > new Date()
  );

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 bg-slate-900/50 dark:bg-slate-900/80 backdrop-blur-sm flex items-center justify-center py-8 px-4 sm:py-20 sm:px-8"
          onClick={() => onOpenChange(false)}
          aria-modal="true"
          role="dialog"
        >
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="w-full max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-2xl">
          {/* Header */}
          <div className="flex items-center border-b border-slate-200 dark:border-slate-700 p-4">
            <div className="flex items-center space-x-3 flex-1">
              <div className="p-2 rounded-lg bg-gradient-to-br from-primary-500/10 to-accent-500/10">
                <Share2
                  size={20}
                  className="text-primary-600 dark:text-primary-400"
                />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                  Share Canvas & Documents
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Copy a link to share canvas and documents
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 space-y-6">
            {/* Section 1: Anyone with the link */}
            <div>
              <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                View-only link
              </h4>

              {loading ? (
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 py-4">
                  <Loader2 size={16} className="animate-spin" />
                  Loading...
                </div>
              ) : (
                <>
                  {activeTokens.length === 0 ? (
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <select
                          value={expiresIn ?? ""}
                          onChange={(e) => {
                            const val = e.target.value
                              ? Number(e.target.value)
                              : undefined;
                            setExpiresIn(val);
                            setDefaultShareExpiry(val);
                          }}
                          className="rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 px-3 py-2"
                        >
                          {EXPIRY_OPTIONS.map((opt) => (
                            <option
                              key={opt.label}
                              value={opt.value ?? ""}
                            >
                              Expires: {opt.label}
                            </option>
                          ))}
                        </select>
                        <Button
                          onClick={handleCreateLink}
                          disabled={creating}
                          className="shrink-0"
                        >
                          {creating ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <>
                              <Link2 size={16} className="mr-2" />
                              Create link
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {activeTokens.map((t) => (
                        <div
                          key={t.id}
                          className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate font-mono">
                              {getShareUrl(t.token)}
                            </p>
                            {t.expiresAt && (
                              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                                Expires {new Date(t.expiresAt).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <Tooltip
                              content={copiedId === t.id ? "Copied!" : "Copy link"}
                              side="top"
                            >
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleCopy(t)}
                                className="h-8 w-8 p-0"
                              >
                                {copiedId === t.id ? (
                                  <Check size={16} className="text-green-600" />
                                ) : (
                                  <Copy size={16} />
                                )}
                              </Button>
                            </Tooltip>
                            <Tooltip content="Revoke link" side="top">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRevoke(t.id)}
                                disabled={revoking === t.id}
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                              >
                                {revoking === t.id ? (
                                  <Loader2 size={16} className="animate-spin" />
                                ) : (
                                  <Trash2 size={16} />
                                )}
                              </Button>
                            </Tooltip>
                          </div>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCreateLink}
                        disabled={creating}
                        className="w-full"
                      >
                        {creating ? (
                          <Loader2 size={16} className="animate-spin mr-2" />
                        ) : (
                          <Link2 size={16} className="mr-2" />
                        )}
                        Add another link
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Section 2: Invite to collaborate - placeholder */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
              <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Collaborate
              </h4>
              <Tooltip
                content="Coming soon — invite others to edit this canvas with you"
                side="top"
              >
                <button
                  type="button"
                  disabled
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 text-slate-400 dark:text-slate-500 cursor-not-allowed opacity-75"
                >
                  <div className="p-2 rounded-lg bg-slate-200 dark:bg-slate-700 shrink-0">
                    <Users size={18} />
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-medium">Invite others to edit</p>
                    <p className="text-xs">Real-time collaboration</p>
                  </div>
                  <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 shrink-0">
                    Coming soon
                  </span>
                </button>
              </Tooltip>
            </div>

            {error && (
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            )}
          </div>

          <div className="flex items-center justify-end p-4 pt-2 border-t border-slate-200 dark:border-slate-700">
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              Done
            </Button>
          </div>
        </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
