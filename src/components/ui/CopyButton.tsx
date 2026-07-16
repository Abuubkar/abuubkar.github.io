"use client";

import { Copy, Check } from "lucide-react";
import { useState } from "react";

/** Copies `value` to the clipboard, with a brief check-mark confirmation. */
export function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
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
      className="grid size-10 shrink-0 place-items-center rounded-md border border-outline-variant text-on-surface-variant transition-colors hover:border-primary hover:bg-primary/5 hover:text-primary"
    >
      {copied ? (
        <Check className="size-4 text-success" />
      ) : (
        <Copy className="size-4" />
      )}
    </button>
  );
}
