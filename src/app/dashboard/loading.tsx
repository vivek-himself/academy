import { ShimmerBlock, ShimmerCards } from "@/components/ui/Shimmer";

export default function DashboardLoading() {
  return (
    <div>
      <ShimmerBlock className="mb-6 h-32 w-full rounded-2xl" />
      <ShimmerCards />
    </div>
  );
}
