import Image from "next/image";
import Link from "next/link";
import { Users, Layers, Clock, Heart } from "lucide-react";
import type { Course } from "@/lib/data";

const LEVEL_BARS: Record<string, { count: number; color: string }> = {
  Beginner: { count: 1, color: "#22C55E" },
  Intermediate: { count: 2, color: "#F59E0B" },
  Master: { count: 3, color: "#EF4444" },
};

function SignalBarsIcon({ level }: { level: string }) {
  const { count, color } = LEVEL_BARS[level] ?? LEVEL_BARS.Beginner;
  const heights = [5, 8, 12];
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="shrink-0">
      {heights.map((h, i) => (
        <rect
          key={i}
          x={i * 4.75}
          y={12 - h}
          width="2.5"
          height={h}
          rx="0.75"
          fill={i < count ? color : "#E5E7EB"}
        />
      ))}
    </svg>
  );
}

export default function CourseCard({ course }: { course: Course }) {
  return (
    <Link
      href={`/courses/${course.slug}`}
      className="group flex flex-col rounded-2xl border border-brand-border bg-white p-3 transition-shadow hover:shadow-lg"
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl">
        <Image
          src={course.image}
          alt={course.title}
          fill
          sizes="(max-width: 768px) 100vw, 320px"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-brand-ink">
          <Heart size={14} />
        </span>
        <span className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-brand-ink shadow">
          {course.level} <SignalBarsIcon level={course.level} />
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3 pt-4">
        <span className={`w-fit rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${course.badgeColor}`}>
          {course.category}
        </span>
        <h3 className="line-clamp-2 text-base font-semibold leading-snug text-brand-ink">{course.title}</h3>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-brand-muted">
          <span className="flex items-center gap-1.5">
            <Users size={14} /> {course.students} Student
          </span>
          <span className="flex items-center gap-1.5">
            <Layers size={14} /> {course.modules} Modul
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={14} /> {course.duration}
          </span>
        </div>
        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <Image
              src={course.mentorAvatar}
              alt={course.mentor}
              width={28}
              height={28}
              className="rounded-full"
            />
            <span className="text-sm font-medium text-brand-pink">{course.mentor}</span>
          </div>
        </div>
        <div className="flex items-baseline gap-2 border-t border-brand-border pt-3.5">
          <span className="text-base font-bold text-brand-ink">${course.price.toFixed(2)}</span>
          {course.originalPrice && (
            <span className="text-sm text-brand-muted line-through">${course.originalPrice.toFixed(2)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
