"use client";

import { useEffect, useState } from "react";

/**
 * Tracks the active section by scroll position (rAF-throttled).
 * Deterministic edge handling: pinned-to-top → first id, bottom → last id,
 * otherwise the last section whose top has passed a detection line at 35% vh.
 *
 * `ids` must be the ordered list of section element ids.
 */
export function useActiveSection(ids: string[]): string {
  const [active, setActive] = useState(ids[0] ?? "");

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const scrollY = window.scrollY;

      if (scrollY < 120) {
        setActive(ids[0]);
        return;
      }
      if (
        window.innerHeight + scrollY >=
        document.documentElement.scrollHeight - 2
      ) {
        setActive(ids[ids.length - 1]);
        return;
      }
      const line = scrollY + window.innerHeight * 0.35;
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top + scrollY <= line) current = id;
      }
      setActive(current);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return active;
}
