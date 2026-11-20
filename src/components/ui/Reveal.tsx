"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Scroll-triggered reveal. Wraps any block so it fades/rises into view once.
 *
 * `data-reveal` is what makes the two fallbacks in globals.css reachable.
 * framer-motion writes `initial` as an inline style, which the static export
 * serves as `opacity:0` — so without that attribute the content is hidden to
 * anyone whose JS never runs, and the blanket reduced-motion rule cannot
 * reach it either, because that rule only kills CSS transitions and this
 * animation is driven from JS. Both overrides therefore need `!important`
 * to beat the inline style.
 */
export function Reveal({
  children,
  delay = 0,
  className = "",
  slideOnly = false,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  /** Rise without fading — for LCP elements, which must paint at full
   *  opacity immediately or LCP stalls until hydration + animation. */
  slideOnly?: boolean;
}) {
  return (
    <motion.div
      data-reveal
      className={className}
      initial={slideOnly ? { y: 24 } : { opacity: 0, y: 24 }}
      whileInView={slideOnly ? { y: 0 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {children}
    </motion.div>
  );
}
