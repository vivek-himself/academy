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

export default function Hero({ slide }: { slide: Slide }) {
  return (
    <section className="container-page pt-8">
      <div className="relative min-h-[340px] overflow-hidden rounded-2xl bg-brand-purple sm:min-h-[400px] lg:min-h-[460px]">
        {slide.imageDesktopUrl && (
          <Image src={slide.imageDesktopUrl} alt="" fill priority className="object-cover" />
        )}
        <div className="relative z-10 px-6 py-10 sm:px-10 sm:py-14 lg:py-24">
          <div>
            <h1 className="max-w-sm text-3xl font-bold leading-tight text-white sm:text-4xl">{slide.title}</h1>
            <p className="mt-4 max-w-sm text-sm text-white/70">{slide.subtitle}</p>
            <Link
              href={slide.ctaHref}
              className="mt-6 inline-block rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand-purple hover:bg-white/90"
            >
              {slide.ctaLabel}
            </Link>
          </div>
        </div>
        <button
          aria-label="Previous slide"
          className="absolute left-3 top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white sm:flex"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          aria-label="Next slide"
          className="absolute right-3 top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white sm:flex"
        >
          <ChevronRight size={18} />
        </button>
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
          {[0, 1, 2].map((i) => (
            <span key={i} className={`h-1.5 rounded-full ${i === 0 ? "w-5 bg-white" : "w-1.5 bg-white/40"}`} />
          ))}
        </div>
      </div>
    </section>
  );
}
