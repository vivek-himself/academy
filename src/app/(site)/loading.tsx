import { ShimmerBlock } from "@/components/ui/Shimmer";

export default function Loading() {
  return (
    <div className="container-page py-10 sm:py-14">
      <ShimmerBlock className="h-56 w-full rounded-2xl sm:h-72" />
      <div className="mt-10 space-y-3">
        <ShimmerBlock className="h-6 w-1/3" />
        <ShimmerBlock className="h-4 w-full" />
        <ShimmerBlock className="h-4 w-full" />
        <ShimmerBlock className="h-4 w-2/3" />
      </div>
      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <ShimmerBlock key={i} className="h-40 w-full" />
        ))}
      </div>
    </div>
  );
}
