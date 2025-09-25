"use client";
import Image from "next/image";
import { useState } from "react";

type Props = {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
};

export default function ImageWithFallback({ src, alt, width, height, className }: Props) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div
        className={className}
        style={{ width, height }}
        aria-label={alt}
        role="img"
      >
        <div className="flex items-center justify-center w-full h-full rounded-lg bg-black/70 border border-white/10">
          <span className="text-white/80 text-lg">?</span>
        </div>
      </div>
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}


