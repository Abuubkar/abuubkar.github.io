"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

/**
 * Floating "back to top" control. Fades in once the user has scrolled past a
 * threshold, and smoothly returns to the top on click (honors reduced motion).
 */
export function ScrollToTop({ threshold = 700 }: { threshold?: number }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const show = window.scrollY > threshold;
      setVisible((v) => (v === show ? v : show));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  const toTop = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <button
      type="button"
      onClick={toTop}
      aria-label="Back to top"
      title="Back to top"
      className={`fixed bottom-6 right-6 z-30 grid size-12 place-items-center rounded-full border border-outline bg-surface-container-lowest text-on-surface-variant shadow-[0_8px_24px_-12px_rgba(0,0,0,0.3)] transition-all duration-200 hover:border-primary hover:text-primary ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <ArrowUp className="size-5" />
    </button>
  );
}
