"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type PointerEvent, type ReactNode } from "react";

type Slide = { src: string; alt: string };

const SLIDE_MS = 4000;

export default function HeroCarousel({
  slides,
  className = "",
  children,
}: {
  slides: Slide[];
  className?: string;
  children: ReactNode;
}) {
  const count = slides.length;
  // runs[i] counts how many times slide i has been shown; it restarts the zoom and tells us which slides to load.
  const [state, setState] = useState({ index: 0, prev: -1, runs: slides.map((_, i) => (i === 0 ? 1 : 0)) });
  const [motion, setMotion] = useState(false);
  const [loaded, setLoaded] = useState(() => slides.map(() => false));
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const touch = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setMotion(!mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const go = useCallback(
    (n: number) =>
      setState((s) => {
        const next = ((n % count) + count) % count;
        if (next === s.index) return s;
        const runs = [...s.runs];
        runs[next] += 1;
        return { index: next, prev: s.index, runs };
      }),
    [count]
  );

  const paused = hovered || focused;
  // Pause only while the mouse is on the arrows or dots: the hero fills the screen, so pausing on the whole hero would stop it almost always.
  const pauseOnHover = {
    onPointerEnter: (e: PointerEvent) => e.pointerType === "mouse" && setHovered(true),
    onPointerLeave: () => setHovered(false),
  };
  const active = motion && count > 1;
  const index = active ? state.index : 0;

  useEffect(() => {
    if (!active || paused) return;
    const t = setTimeout(() => go(state.index + 1), SLIDE_MS);
    return () => clearTimeout(t);
  }, [active, paused, state.index, go]);

  const incomingReady = state.index === 0 || loaded[state.index];
  useEffect(() => {
    if (state.prev < 0 || !incomingReady) return;
    const t = setTimeout(() => setState((s) => (s.prev < 0 ? s : { ...s, prev: -1 })), 1300);
    return () => clearTimeout(t);
  }, [state.prev, incomingReady]);

  return (
    <section
      className={`group touch-pan-y ${className}`}
      onFocus={(e) => e.target.matches(":focus-visible") && setFocused(true)}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setFocused(false)}
      onTouchStart={(e) => {
        const t = e.touches[0];
        touch.current = { x: t.clientX, y: t.clientY };
      }}
      onTouchEnd={(e) => {
        const start = touch.current;
        touch.current = null;
        if (!start || !active) return;
        const t = e.changedTouches[0];
        const dx = t.clientX - start.x;
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(t.clientY - start.y)) go(state.index + (dx < 0 ? 1 : -1));
      }}
    >
      <div className="absolute inset-0 -z-10 bg-ecm-green">
        {slides.map((slide, i) => {
          const shown = i === index;
          // Load the first slide straight away, then each slide just before it is due, so later photos never compete with the first.
          const load = i === 0 || (active && (state.runs[i] > 0 || (loaded[0] && i ===(index + 1) % count)));
          if (!load) return null;
          const leaving = active && i === state.prev;
          const zoom = active && (shown || leaving);
          // The new slide fades in on top once its photo has arrived; the old one stays underneath until then, so there is never a gap.
          const visible = (shown && (i === 0 || loaded[i])) || leaving;
          return (
            <div
              key={slide.src}
              aria-hidden={!shown}
              className={`absolute inset-0 transition-opacity duration-[1200ms] ease-in-out ${shown ? "z-2" : leaving ? "z-1" : "z-0"} ${visible ? "opacity-100" : "opacity-0"}`}
            >
              <div
                className={`absolute inset-0 ${zoom ? "hero-zoom" : ""}`}
                style={zoom ? { animationName: state.runs[i] % 2 ? "hero-zoom-a" : "hero-zoom-b", animationPlayState: paused ? "paused" : "running" } : undefined}
              >
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  priority={i === 0}
                  sizes="100vw"
                  className="object-cover"
                  onLoad={() => setLoaded((l) => (l[i] ? l : l.map((v, j) => v || j === i)))}
                />
              </div>
            </div>
          );
        })}
      </div>

      {children}

      {active && (
        <>
          <button
            type="button"
            onClick={() => go(state.index - 1)}
            {...pauseOnHover}
            className="absolute bottom-5 left-3 z-10 rounded-full bg-white/15 p-2.5 text-white backdrop-blur transition hover:bg-white/30 focus-visible:opacity-100 sm:left-6 2xl:bottom-auto 2xl:top-1/2 2xl:-translate-y-1/2 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100"
            aria-label="Previous slide"
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
          <button
            type="button"
            onClick={() => go(state.index + 1)}
            {...pauseOnHover}
            className="absolute bottom-5 right-3 z-10 rounded-full bg-white/15 p-2.5 text-white backdrop-blur transition hover:bg-white/30 focus-visible:opacity-100 sm:right-6 2xl:bottom-auto 2xl:top-1/2 2xl:-translate-y-1/2 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100"
            aria-label="Next slide"
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true"><path d="M9 18l6-6-6-6" /></svg>
          </button>
          <ul className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2" {...pauseOnHover}>
            {slides.map((slide, i) => (
              <li key={slide.src}>
                <button
                  type="button"
                  onClick={() => go(i)}
                  className="flex h-11 w-8 items-center justify-center"
                  aria-label={`Show slide ${i + 1} of ${count}`}
                  aria-current={i === index ? "true" : undefined}
                >
                  <span className={`h-2.5 w-2.5 rounded-full shadow transition-colors ${i === index ? "bg-ecm-red" : "bg-white"}`} />
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
