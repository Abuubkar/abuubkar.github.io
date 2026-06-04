"use client";

import Image from "next/image";
import { useState } from "react";

/** Project screenshot that falls back to a large faint initial if the image
 *  is missing or fails to load. */
export function ProjectImage({
  src,
  alt,
  letter,
}: {
  src: string;
  alt: string;
  letter: string;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="absolute inset-0 grid place-items-center">
        <span
          aria-hidden
          className="text-display-lg select-none font-bold text-on-surface/15"
        >
          {letter}
        </span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(max-width: 768px) 100vw, 520px"
      className="object-cover object-center"
      onError={() => setFailed(true)}
    />
  );
}
