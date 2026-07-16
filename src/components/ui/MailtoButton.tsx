"use client";

import { ArrowUpRight, ExternalLink, Copy, Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const btnCls =
  "grid size-10 place-items-center rounded-md border border-outline-variant text-on-surface-variant transition-colors hover:border-primary hover:bg-primary/5 hover:text-primary";

const itemCls =
  "flex w-full items-center gap-2.5 rounded px-2.5 py-2 text-left text-body-md text-on-surface transition-colors hover:bg-surface-container-high";

/**
 * Email "open" action: fires a normal mailto: (works for anyone with a mail
 * handler), but detects when nothing happened — no app took over the click —
 * and reveals a fallback menu (Gmail / Outlook / copy) so the click is never dead.
 */
export function MailtoButton({
  email,
  title,
}: {
  email: string;
  title: string;
}) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const gmail = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}`;
  const outlook = `https://outlook.live.com/mail/0/deeplink/compose?to=${encodeURIComponent(email)}`;

  // Close the fallback on outside click / Esc.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node))
        setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Let the native mailto proceed; if the page never loses focus/visibility,
  // assume no mail app handled it and offer fallbacks.
  const handleClick = () => {
    let switched = false;
    const onHide = () => {
      if (document.hidden) switched = true;
    };
    const onBlur = () => {
      switched = true;
    };
    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("blur", onBlur);
    window.setTimeout(() => {
      document.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("blur", onBlur);
      // If nothing took focus away (no mail app / new tab opened), the click
      // was a dead end → reveal the fallback options.
      if (!switched) setOpen(true);
    }, 1200);
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  };

  return (
    <div ref={wrapRef} className="relative">
      <a
        href={`mailto:${email}`}
        onClick={handleClick}
        title={title}
        aria-label={title}
        aria-haspopup="menu"
        aria-expanded={open}
        className={btnCls}
      >
        <ArrowUpRight className="size-4" />
      </a>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-12 z-30 w-60 rounded-md border border-outline bg-surface-container-lowest p-2 shadow-[0_16px_48px_-16px_rgba(0,0,0,0.35)]"
        >
          <p className="text-code-sm px-2.5 py-1.5 text-on-surface-variant">
            No mail app opened — try:
          </p>
          <a
            href={gmail}
            target="_blank"
            rel="noopener noreferrer"
            role="menuitem"
            onClick={() => setOpen(false)}
            className={itemCls}
          >
            <ExternalLink className="size-4 shrink-0 text-on-surface-variant" />
            Compose in Gmail
          </a>
          <a
            href={outlook}
            target="_blank"
            rel="noopener noreferrer"
            role="menuitem"
            onClick={() => setOpen(false)}
            className={itemCls}
          >
            <ExternalLink className="size-4 shrink-0 text-on-surface-variant" />
            Compose in Outlook
          </a>
          <button
            type="button"
            role="menuitem"
            onClick={copyEmail}
            className={itemCls}
          >
            {copied ? (
              <Check className="size-4 shrink-0 text-success" />
            ) : (
              <Copy className="size-4 shrink-0 text-on-surface-variant" />
            )}
            {copied ? "Copied" : "Copy address"}
          </button>
        </div>
      )}
    </div>
  );
}
