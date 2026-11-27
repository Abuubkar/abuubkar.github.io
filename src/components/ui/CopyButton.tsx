"use client";

import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { track } from "@/lib/track";

/**
 * Copies `value` to the clipboard, with a brief check-mark confirmation.
 * `withLabel` renders the wider version that says "Copy" in words, for
 * places where the button stands on its own rather than in a row of icons.
 */
export function CopyButton({
  value,
  label,
  withLabel = false,
}: {
  value: string;
  label: string;
  withLabel?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    // track() here, not data-umami-event — that would suppress this handler.
    track(`contact-copy-${label.toLowerCase()}`);
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard may be unavailable (e.g. insecure context) — fail silently.
    }
  };

  return (
    <button
      type="button"
      onClick={onCopy}
      title={copied ? "Copied" : `Copy ${label}`}
      aria-label={copied ? `${label} copied` : `Copy ${label}`}
      aria-live="polite"
      className={
        withLabel
          ? "text-body-md inline-flex h-10 shrink-0 items-center gap-2 rounded-md border border-outline-variant px-4 text-on-surface-variant transition-colors hover:border-primary hover:bg-primary/5 hover:text-primary"
          : "grid size-10 shrink-0 place-items-center rounded-md border border-outline-variant text-on-surface-variant transition-colors hover:border-primary hover:bg-primary/5 hover:text-primary"
      }
    >
      {copied ? (
        <Check className="size-4 text-success" />
      ) : (
        <Copy className="size-4" />
      )}
      {withLabel && (copied ? "Copied" : "Copy")}
    </button>
  );
}
