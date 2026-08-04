import Link from "next/link";
import Image from "next/image";

export type DashboardCourse = {
  slug: string;
  title: string;
  imageDesktopUrl: string | null;
  category: { name: string } | null;
  mentor: { name: string; imageDesktopUrl: string | null } | null;
};

export default function DashboardCourseCard({ course, percent }: { course: DashboardCourse; percent: number }) {
  return (
    <Link
      href={`/dashboard/courses/${course.slug}`}
      className="block shrink-0 overflow-hidden rounded-2xl border border-brand-border bg-white"
    >
      <div className="relative aspect-[16/10] w-full bg-brand-surface">
        {course.imageDesktopUrl ? (
          <Image src={course.imageDesktopUrl} alt={course.title} fill className="object-cover" unoptimized />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-brand-muted">No image</div>
        )}
      </div>
      <div className="p-3.5">
        {course.category && (
          <span className="mb-1.5 inline-block rounded-full bg-brand-pink/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-brand-pink">
            {course.category.name}
          </span>
        )}
        <h3 className="line-clamp-2 text-sm font-semibold text-brand-ink">{course.title}</h3>
        <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-brand-border">
          <div className="h-full rounded-full bg-brand-pink" style={{ width: `${percent}%` }} />
        </div>
        {course.mentor && (
          <div className="mt-3 flex items-center gap-2">
            {course.mentor.imageDesktopUrl ? (
              <Image
                src={course.mentor.imageDesktopUrl}
                alt={course.mentor.name}
                width={22}
                height={22}
                className="h-[22px] w-[22px] rounded-full object-cover"
                unoptimized
              />
            ) : (
              <span className="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-brand-purple text-[10px] font-semibold text-white">
                {course.mentor.name.charAt(0)}
              </span>
            )}
            <span className="text-xs text-brand-muted">{course.mentor.name}</span>
          </div>
        )}
      </div>
    </Link>
  );
}
