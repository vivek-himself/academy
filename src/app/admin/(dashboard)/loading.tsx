import { ShimmerBlock, ShimmerTable } from "@/components/ui/Shimmer";

export default function AdminLoading() {
  return (
    <div>
      <ShimmerBlock className="mb-2 h-7 w-56" />
      <ShimmerBlock className="mb-8 h-4 w-80" />
      <ShimmerTable />
    </div>
  );
}
