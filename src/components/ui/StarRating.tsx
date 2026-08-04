import { Star } from "lucide-react";

export default function StarRating({
  rating,
  size = 14,
}: {
  rating: number;
  size?: number;
}) {
  const percent = Math.max(0, Math.min(100, (rating / 5) * 100));
  return (
    <div className="relative flex items-center gap-0.5">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} size={size} className="fill-transparent text-neutral-300" />
        ))}
      </div>
      <div className="absolute inset-0 flex items-center gap-0.5 overflow-hidden" style={{ width: `${percent}%` }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} size={size} className="shrink-0 fill-amber-400 text-amber-400" />
        ))}
      </div>
    </div>
  );
}
