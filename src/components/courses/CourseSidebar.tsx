"use client";

import Image from "next/image";
import { Users, Layers, Clock } from "lucide-react";
import type { Course, CourseModule } from "@/lib/data";
import { useCurrency } from "@/components/providers/CurrencyProvider";

export default function CourseSidebar({ course, modules }: { course: Course; modules: CourseModule[] }) {
  const { format } = useCurrency();
  return (
    <div className="rounded-2xl border border-brand-border bg-white p-5">
      <h3 className="text-base font-bold text-brand-ink">{course.title}</h3>
      <div className="mt-3 flex items-center gap-2">
        <Image src={course.mentorAvatar} alt={course.mentor} width={28} height={28} className="h-7 w-7 rounded-full object-cover" />
        <span className="text-sm text-brand-muted">{course.mentor}</span>
        <span className="ml-auto flex items-center gap-1 text-sm font-semibold text-brand-ink">
          ★ {course.rating}
        </span>
      </div>
      <div className="mt-4 flex items-center gap-4 text-xs text-brand-muted">
        <span className="flex items-center gap-1">
          <Users size={13} /> {course.students} Students
        </span>
        <span className="flex items-center gap-1">
          <Layers size={13} /> {course.modules} Modules
        </span>
        <span className="flex items-center gap-1">
          <Clock size={13} /> 12 Days
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-brand-border pt-4">
        <span className="text-sm font-semibold text-brand-ink">{course.modules} Modules</span>
        <span className="text-lg font-bold text-brand-ink">{format(course.price)}</span>
      </div>

      <ul className="relative mt-3 max-h-60 space-y-1 overflow-y-auto border-l-2 border-brand-pink/20 pl-0">
        {modules.map((m, i) => (
          <li key={m.title} className="relative flex items-center gap-3 py-2 pl-4">
            <span
              className={`absolute -left-[9px] flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold ${
                i === 0 ? "bg-brand-pink text-white" : "bg-white text-brand-muted ring-1 ring-brand-border"
              }`}
            >
              {i + 1}
            </span>
            <span className="flex-1 text-sm text-brand-ink/80">{m.title}</span>
            <span className="text-xs text-brand-muted">{m.duration}</span>
          </li>
        ))}
      </ul>

      <button className="mt-5 w-full rounded-full bg-brand-pink py-3 text-sm font-semibold text-white hover:bg-brand-pink-dark">
        Enroll Now
      </button>
    </div>
  );
}
