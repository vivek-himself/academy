export function ShimmerBlock({ className = "" }: { className?: string }) {
  return <div className={`shimmer rounded-lg ${className}`} />;
}

export function ShimmerCourseGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-brand-border p-3">
          <ShimmerBlock className="aspect-[16/9] w-full" />
          <ShimmerBlock className="mt-4 h-3 w-16" />
          <ShimmerBlock className="mt-3 h-4 w-full" />
          <ShimmerBlock className="mt-2 h-4 w-3/4" />
          <ShimmerBlock className="mt-4 h-4 w-20" />
        </div>
      ))}
    </div>
  );
}

export function ShimmerTable({ rows = 6, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-brand-border bg-brand-card">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-6 border-b border-brand-border px-5 py-4 last:border-0">
          {Array.from({ length: cols }).map((_, j) => (
            <ShimmerBlock key={j} className={`h-4 ${j === 0 ? "w-1/3" : "w-16"}`} />
          ))}
        </div>
      ))}
    </div>
  );
}

export function ShimmerCards({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-brand-border bg-brand-card p-5">
          <ShimmerBlock className="h-4 w-2/3" />
          <ShimmerBlock className="mt-3 h-3 w-1/3" />
        </div>
      ))}
    </div>
  );
}
