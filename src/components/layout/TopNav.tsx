"use client";

import { useEffect, useState } from "react";
import { ChevronRight, Menu, X } from "lucide-react";
import { siteConfig } from "@/config/site";
import { useActiveSection } from "@/lib/useActiveSection";

const { nav, profile } = siteConfig;
const ids = nav.map((n) => n.id);

function Wordmark() {
  return (
    <a
      href="#home"
      className="flex items-center gap-2 text-on-surface"
      aria-label={profile.brand}
    >
      <span
        className="grid size-6 place-items-center rounded-sm bg-on-surface text-background"
        aria-hidden
      >
        <ChevronRight className="size-4" strokeWidth={2.5} />
      </span>
      <span className="text-code-sm font-semibold lowercase tracking-tight">
        {profile.brand}
      </span>
    </a>
  );
}

export function TopNav() {
  const active = useActiveSection(ids);
  const [menuOpen, setMenuOpen] = useState(false);

  // Lock body scroll + allow Esc to close while the overlay is open.
  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  return (
    <>
    <header className="fixed inset-x-0 top-0 z-40 h-[var(--spacing-nav-height)] border-b border-outline-variant bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-full max-w-[var(--container-max)] items-center justify-between gap-4 px-5 sm:px-6">
        <Wordmark />

        {/* Desktop links */}
        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {nav.map((item) => {
              const isActive = active === item.id;
              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    aria-current={isActive ? "page" : undefined}
                    className={`relative block whitespace-nowrap text-label-caps lowercase transition-colors ${
                      isActive
                        ? "text-on-surface"
                        : "text-on-surface-variant hover:text-on-surface"
                    }`}
                  >
                    {item.label}
                    {isActive && (
                      <span className="absolute inset-x-0 -bottom-2 h-0.5 rounded-full bg-primary" />
                    )}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-label="Open navigation"
          aria-expanded={menuOpen}
          className="grid size-10 place-items-center rounded-md text-on-surface transition-colors hover:bg-surface-container-high lg:hidden"
        >
          <Menu className="size-5" />
        </button>
      </div>
    </header>

      {/* Full-screen overlay menu (mobile) — sibling of header so the header's
          backdrop-filter doesn't trap this fixed element in a 64px containing block */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-background lg:hidden">
          <div className="flex h-[var(--spacing-nav-height)] items-center justify-between gap-4 border-b border-outline-variant px-5 sm:px-6">
            <span className="text-code-sm text-on-surface-variant">
              <span className="text-primary">//</span> navigation
            </span>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Close navigation"
              className="grid size-10 place-items-center rounded-md text-on-surface transition-colors hover:bg-surface-container-high"
            >
              <X className="size-5" />
            </button>
          </div>

          <nav
            aria-label="Mobile"
            className="flex flex-1 flex-col items-center justify-center gap-8"
          >
            {nav.map((item) => {
              const isActive = active === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => setMenuOpen(false)}
                  aria-current={isActive ? "page" : undefined}
                  className={`text-headline-lg lowercase transition-colors ${
                    isActive
                      ? "text-on-surface"
                      : "text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>
        </div>
      )}
    </>
  );
}
