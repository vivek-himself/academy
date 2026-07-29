import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function ExploreHero() {
  return (
    <section className="container-page pt-8">
      <div className="relative overflow-hidden rounded-2xl bg-brand-purple px-6 py-10 sm:px-12 sm:py-14">
        <span className="text-xs font-semibold uppercase tracking-wide text-white/60">Online Course</span>
        <h1 className="mt-2 max-w-lg text-2xl font-bold text-white sm:text-3xl">
          Sharpen Your Skills With Professional Online Courses
        </h1>
        <Link
          href="#grid"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-pink px-6 py-3 text-sm font-semibold text-white hover:bg-brand-pink-dark"
        >
          Join Now <span aria-hidden>➤</span>
        </Link>
        <Sparkles className="pointer-events-none absolute right-10 top-8 hidden text-white/20 sm:block" size={90} />
        <Sparkles className="pointer-events-none absolute bottom-6 right-32 hidden text-white/10 sm:block" size={40} />
      </div>
    </section>
  );
}
