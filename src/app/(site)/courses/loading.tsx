import { ShimmerBlock, ShimmerCourseGrid } from "@/components/ui/Shimmer";

export default function CoursesLoading() {
  return (
    <div>
      <div className="container-page pt-8">
        <ShimmerBlock className="h-[164px] w-full rounded-2xl sm:h-[188px]" />
      </div>
      <div className="container-page py-10 sm:py-14">
        <ShimmerBlock className="h-7 w-48" />
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <ShimmerBlock className="h-11 min-w-[220px] flex-1 rounded-full" />
          <ShimmerBlock className="h-11 w-24 rounded-full" />
          <ShimmerBlock className="h-11 w-28 rounded-full" />
          <ShimmerBlock className="h-11 w-32 rounded-full" />
        </div>
        <div className="mt-8">
          <ShimmerCourseGrid />
        </div>
      </div>
    </div>
  );
}
