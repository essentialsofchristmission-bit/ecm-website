"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

type Photo = { src: string; alt: string; width?: number; height?: number };

export default function Gallery({
  photos,
  layout = "grid",
  initialCount,
}: {
  photos: Photo[];
  layout?: "grid" | "masonry";
  initialCount?: number;
}) {
  const [index, setIndex] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);
  const visible = initialCount && !showAll ? photos.slice(0, initialCount) : photos;
  const close = useCallback(() => setIndex(null), []);
  const step = useCallback(
    (d: number) => setIndex((i) => (i === null ? i : (i + d + photos.length) % photos.length)),
    [photos.length]
  );

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [index, close, step]);

  return (
    <>
      {layout === "masonry" ? (
        <ul className="columns-2 gap-3 sm:gap-4 md:columns-3 lg:columns-4">
          {visible.map((p, i) => (
            <li key={p.src + i} className="mb-3 break-inside-avoid sm:mb-4">
              <button
                type="button"
                onClick={() => setIndex(i)}
                className="group block w-full overflow-hidden rounded-2xl"
                aria-label={`Open photo: ${p.alt}`}
              >
                <Image src={p.src} alt={p.alt} width={p.width ?? 1200} height={p.height ?? 900} sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw" className="h-auto w-full transition duration-500 group-hover:scale-105" />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
          {visible.map((p, i) => (
            <li key={p.src + i} className={i === 0 ? "col-span-2 row-span-2 md:col-span-1 md:row-span-1" : ""}>
              <button
                type="button"
                onClick={() => setIndex(i)}
                className="group relative block aspect-[4/3] w-full overflow-hidden rounded-2xl"
                aria-label={`Open photo: ${p.alt}`}
              >
                <Image src={p.src} alt={p.alt} fill sizes="(min-width: 768px) 33vw, 50vw" className="object-cover transition duration-500 group-hover:scale-105" />
              </button>
            </li>
          ))}
        </ul>
      )}
      {initialCount && photos.length > initialCount && (
        <div className="mt-10 text-center">
          <button
            type="button"
            onClick={() => setShowAll((v) => !v)}
            className="inline-flex items-center justify-center rounded-full bg-ecm-green px-6 py-3 font-bold text-white transition hover:bg-ecm-navy"
          >
            {showAll ? "Show fewer photos" : `Show all ${photos.length} photos`}
          </button>
        </div>
      )}

      {index !== null && (
        <div role="dialog" aria-modal="true" aria-label="Photo viewer" className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4" onClick={close}>
          <button type="button" onClick={close} className="absolute right-4 top-4 rounded-full bg-white/10 p-3 text-white hover:bg-white/20" aria-label="Close" autoFocus>
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
          <button type="button" onClick={(e) => { e.stopPropagation(); step(-1); }} className="absolute left-2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 sm:left-6" aria-label="Previous photo">
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
          <figure className="relative h-[75vh] w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <Image src={photos[index].src} alt={photos[index].alt} fill sizes="100vw" className="object-contain" />
            <figcaption className="absolute -bottom-10 left-0 right-0 text-center text-sm text-white/90">{photos[index].alt}</figcaption>
          </figure>
          <button type="button" onClick={(e) => { e.stopPropagation(); step(1); }} className="absolute right-2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 sm:right-6" aria-label="Next photo">
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true"><path d="M9 18l6-6-6-6" /></svg>
          </button>
        </div>
      )}
    </>
  );
}
