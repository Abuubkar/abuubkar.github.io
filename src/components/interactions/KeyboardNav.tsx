"use client";

import { useEffect, useRef, useState } from "react";
import { siteConfig } from "@/config/site";
import { useActiveSection } from "@/lib/useActiveSection";

const { nav } = siteConfig;
const ids = nav.map((n) => n.id);
// First letter → section id (g-chord targets). e.g. h→home, a→arsenal…
const letterToId: Record<string, string> = Object.fromEntries(
  nav.map((n) => [n.id[0].toLowerCase(), n.id]),
);

function isTypingTarget(el: EventTarget | null): boolean {
  const node = el as HTMLElement | null;
  if (!node) return false;
  const tag = node.tagName;
  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT" ||
    node.isContentEditable
  );
}

const NAV_OFFSET = 64; // fixed top nav height

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const target = el.closest("section") ?? el;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const top = target.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
  window.scrollTo({ top: Math.max(0, top), behavior: reduce ? "auto" : "smooth" });
}

export function KeyboardNav() {
  const [helpOpen, setHelpOpen] = useState(false);
  const active = useActiveSection(ids);

  // Keep the latest active id in a ref so the key handler can stay attached once.
  const activeRef = useRef(active);
  activeRef.current = active;

  useEffect(() => {
    let gChord = false;
    let gTimer = 0;

    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setHelpOpen(false);
        return;
      }
      if (isTypingTarget(e.target) || e.metaKey || e.ctrlKey || e.altKey) return;

      if (e.key === "?") {
        e.preventDefault();
        setHelpOpen((v) => !v);
        return;
      }

      const idx = ids.indexOf(activeRef.current);

      if (e.key === "j") {
        e.preventDefault();
        scrollToId(ids[Math.min(ids.length - 1, idx + 1)]);
      } else if (e.key === "k") {
        e.preventDefault();
        scrollToId(ids[Math.max(0, idx - 1)]);
      } else if (e.key === "g") {
        e.preventDefault();
        gChord = true;
        window.clearTimeout(gTimer);
        gTimer = window.setTimeout(() => {
          gChord = false;
        }, 1000);
      } else if (gChord && letterToId[e.key]) {
        e.preventDefault();
        gChord = false;
        window.clearTimeout(gTimer);
        scrollToId(letterToId[e.key]);
      }
    };

    window.addEventListener("keydown", handler);
    return () => {
      window.removeEventListener("keydown", handler);
      window.clearTimeout(gTimer);
    };
  }, []);

  if (!helpOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-on-surface/20 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Keyboard shortcuts"
      onClick={() => setHelpOpen(false)}
    >
      <div
        className="w-full max-w-md rounded-md border border-outline bg-surface-container-lowest p-6 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.35)]"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-code-sm mb-4 text-on-surface-variant">
          <span className="text-primary">//</span> keyboard-shortcuts
        </p>
        <ul className="flex flex-col gap-3">
          <Row keys={["j"]} desc="Next section" />
          <Row keys={["k"]} desc="Previous section" />
          {nav.map((n) => (
            <Row key={n.id} keys={["g", n.id[0]]} desc={`Jump to ${n.label}`} />
          ))}
          <Row keys={["?"]} desc="Toggle this help" />
          <Row keys={["esc"]} desc="Close" />
        </ul>
      </div>
    </div>
  );
}

function Row({ keys, desc }: { keys: string[]; desc: string }) {
  return (
    <li className="flex items-center justify-between gap-4">
      <span className="text-body-md text-on-surface">{desc}</span>
      <span className="flex items-center gap-1">
        {keys.map((k) => (
          <kbd
            key={k}
            className="text-code-sm rounded border border-outline-variant bg-surface-container px-2 py-0.5 text-on-surface"
          >
            {k}
          </kbd>
        ))}
      </span>
    </li>
  );
}
