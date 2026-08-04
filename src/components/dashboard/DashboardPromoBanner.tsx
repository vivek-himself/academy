import Link from "next/link";
import { Play, Sparkles } from "lucide-react";

export default function DashboardPromoBanner() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-brand-purple px-6 py-7 text-white sm:px-8">
      <Sparkles size={70} className="pointer-events-none absolute -right-2 -top-4 text-white/10" />
      <Sparkles size={36} className="pointer-events-none absolute right-16 bottom-2 text-white/10" />
      <p className="text-[11px] font-semibold uppercase tracking-wider text-white/60">Online Course</p>
      <h2 className="mt-2 max-w-md text-2xl font-bold leading-snug sm:text-[28px]">
        Sharpen Your Skills With Professional Online Courses
      </h2>
      <Link
        href="/dashboard/explore"
        className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand-pink px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-pink-dark"
      >
        Join Now
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20">
          <Play size={10} fill="currentColor" />
        </span>
      </Link>
    </div>
  );
}
