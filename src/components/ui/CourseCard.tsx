import Image from "next/image";
import Link from "next/link";
import { Users, Layers, Clock, Heart, BarChart3 } from "lucide-react";
import type { Course } from "@/lib/data";

export default function CourseCard({ course }: { course: Course }) {
  return (
    <Link
      href={`/courses/${course.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-brand-border bg-white transition-shadow hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <Image
          src={course.image}
          alt={course.title}
          fill
          sizes="(max-width: 768px) 100vw, 300px"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-brand-ink">
          <Heart size={13} />
        </span>
        <span className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-brand-ink shadow">
          {course.level} <BarChart3 size={12} className="text-brand-pink" />
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <span className={`w-fit rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${course.badgeColor}`}>
          {course.category}
        </span>
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-brand-ink">{course.title}</h3>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-brand-muted">
          <span className="flex items-center gap-1">
            <Users size={12} /> {course.students} Student
          </span>
          <span className="flex items-center gap-1">
            <Layers size={12} /> {course.modules} Modul
          </span>
          <span className="flex items-center gap-1">
            <Clock size={12} /> {course.duration}
          </span>
        </div>
        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <Image
              src={course.mentorAvatar}
              alt={course.mentor}
              width={24}
              height={24}
              className="rounded-full"
            />
            <span className="text-xs font-medium text-brand-pink">{course.mentor}</span>
          </div>
        </div>
        <div className="flex items-baseline gap-2 border-t border-brand-border pt-3">
          <span className="text-sm font-bold text-brand-ink">${course.price.toFixed(2)}</span>
          {course.originalPrice && (
            <span className="text-xs text-brand-muted line-through">${course.originalPrice.toFixed(2)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
