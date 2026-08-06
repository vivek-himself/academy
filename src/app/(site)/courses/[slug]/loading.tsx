import { ShimmerBlock } from "@/components/ui/Shimmer";

export default function CourseDetailLoading() {
  return (
    <div className="container-page py-8">
      <ShimmerBlock className="h-3 w-40" />
      <ShimmerBlock className="mt-3 h-8 w-3/4" />
      <div className="mt-3 flex items-center gap-3">
        <ShimmerBlock className="h-4 w-24" />
        <ShimmerBlock className="h-4 w-32" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[1.7fr_1fr]">
        <div>
          <ShimmerBlock className="aspect-video w-full rounded-2xl" />

          <div className="mt-6 flex items-center justify-between gap-4 border-y border-brand-border py-3">
            <ShimmerBlock className="h-4 w-40" />
            <ShimmerBlock className="h-4 w-24" />
          </div>

          <div className="mt-6 rounded-2xl border border-brand-border p-6">
            <div className="flex gap-6 border-b border-brand-border pb-3">
              <ShimmerBlock className="h-4 w-14" />
              <ShimmerBlock className="h-4 w-24" />
              <ShimmerBlock className="h-4 w-16" />
            </div>
            <div className="mt-5 space-y-3">
              <ShimmerBlock className="h-4 w-full" />
              <ShimmerBlock className="h-4 w-full" />
              <ShimmerBlock className="h-4 w-2/3" />
            </div>
          </div>
        </div>

        <ShimmerBlock className="h-[420px] w-full rounded-2xl" />
      </div>
    </div>
  );
}
