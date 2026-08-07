"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Slide = {
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  imageDesktopUrl?: string | null;
};

const AUTO_ADVANCE_MS = 3000;

export default function Hero({ slides }: { slides: Slide[] }) {
  const n = slides.length;
  const looped = n > 1;
  // Clone the last slide before the first and the first slide after the last, so stepping
  // past either end lands on a lookalike frame instead of snapping backward across the whole track.
  const track = looped ? [slides[n - 1], ...slides, slides[0]] : slides;
  const firstRealIndex = looped ? 1 : 0;
  const lastRealIndex = looped ? n : 0;

  const [position, setPosition] = useState(firstRealIndex);
  const [instant, setInstant] = useState(false);
  const [paused, setPaused] = useState(false);

  const activeIndex = looped ? (((position - 1) % n) + n) % n : 0;

  const goTo = (i: number) => setPosition(firstRealIndex + i);
  const step = (delta: number) => setPosition((p) => p + delta);

  useEffect(() => {
    if (!looped || paused) return;
    const id = setInterval(() => step(1), AUTO_ADVANCE_MS);
    return () => clearInterval(id);
  }, [looped, paused]);

  function handleTransitionEnd(e: React.TransitionEvent<HTMLDivElement>) {
    if (!looped || e.propertyName !== "transform" || e.target !== e.currentTarget) return;
    if (position > lastRealIndex) {
      setInstant(true);
      setPosition(firstRealIndex);
    } else if (position < firstRealIndex) {
      setInstant(true);
      setPosition(lastRealIndex);
    }
  }

  useEffect(() => {
    if (!instant) return;
    // Let the jump apply with no transition, then restore it for the next real step.
    const id = requestAnimationFrame(() => setInstant(false));
    return () => cancelAnimationFrame(id);
  }, [instant]);

  return (
    <section className="container-page pt-8">
      <div
        className="relative min-h-[340px] overflow-hidden rounded-2xl bg-brand-purple sm:min-h-[400px] lg:min-h-[460px]"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div
          onTransitionEnd={handleTransitionEnd}
          className={`flex h-full ${instant ? "" : "transition-transform duration-700 ease-in-out"}`}
          style={{ width: `${track.length * 100}%`, transform: `translateX(-${position * (100 / track.length)}%)` }}
        >
          {track.map((slide, i) => (
            <div key={i} className="relative min-h-[340px] shrink-0 sm:min-h-[400px] lg:min-h-[460px]" style={{ width: `${100 / track.length}%` }}>
              {slide.imageDesktopUrl && (
                <Image src={slide.imageDesktopUrl} alt="" fill priority={i === firstRealIndex} className="object-cover" />
              )}
              <div className="relative z-10 px-6 py-10 sm:px-10 sm:py-14 lg:py-24">
                <div>
                  {i === position ? (
                    <h1 className="max-w-sm text-3xl font-bold leading-tight text-white sm:text-4xl">{slide.title}</h1>
                  ) : (
                    <p aria-hidden="true" className="max-w-sm text-3xl font-bold leading-tight text-white sm:text-4xl">
                      {slide.title}
                    </p>
                  )}
                  <p className="mt-4 max-w-sm text-sm text-white/70">{slide.subtitle}</p>
                  <Link
                    href={slide.ctaHref}
                    className="mt-6 inline-block rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand-purple hover:bg-white/90"
                  >
                    {slide.ctaLabel}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        {looped && (
          <>
            <button
              type="button"
              aria-label="Previous slide"
              onClick={() => step(-1)}
              className="absolute left-3 top-1/2 z-20 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 sm:flex"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              aria-label="Next slide"
              onClick={() => step(1)}
              className="absolute right-3 top-1/2 z-20 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 sm:flex"
            >
              <ChevronRight size={18} />
            </button>
            <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-1.5">
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Go to slide ${i + 1}`}
                  onClick={() => goTo(i)}
                  className={`h-1.5 rounded-full transition-all ${i === activeIndex ? "w-5 bg-white" : "w-1.5 bg-white/40"}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
