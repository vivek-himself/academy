import Image from "next/image";
import { Users, BookOpen, Award, TrendingUp, Star } from "lucide-react";

const iconMap: Record<string, typeof Users> = {
  users: Users,
  book: BookOpen,
  award: Award,
  trending: TrendingUp,
};

type Stat = { icon: string; value: string; label: string };
type ReviewBadge = { label: string; rating: string; imageUrl: string };

const DEFAULT_REVIEW_BADGES: ReviewBadge[] = [
  { label: "Google", rating: "★★★★★ 4.6/5", imageUrl: "" },
  { label: "Capterra", rating: "★★★★★ 4.7/5", imageUrl: "" },
  { label: "G2", rating: "★★★★★ 4.3/5", imageUrl: "" },
];

export default function StatsBar({ stats, reviewBadges = DEFAULT_REVIEW_BADGES }: { stats: Stat[]; reviewBadges?: ReviewBadge[] }) {
  return (
    <section className="container-page -mt-6 relative z-10">
      <div className="grid grid-cols-2 gap-4 rounded-2xl border border-brand-border bg-white p-6 shadow-sm sm:grid-cols-4 sm:p-8">
        {stats.map((s) => {
          const Icon = iconMap[s.icon] ?? Star;
          return (
            <div key={s.label} className="flex flex-col items-center gap-2 text-center sm:flex-row sm:text-left">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-pink/10 text-brand-pink">
                <Icon size={18} />
              </span>
              <div>
                <p className="text-lg font-bold text-brand-ink">{s.value}</p>
                <p className="text-xs text-brand-muted">{s.label}</p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-8 opacity-70">
        {reviewBadges.map((b) =>
          b.imageUrl ? (
            <span key={b.label} className="flex items-center gap-2">
              <Image src={b.imageUrl} alt={b.label} width={80} height={20} className="h-5 w-auto object-contain" />
              <span className="text-sm font-semibold text-brand-ink">{b.rating}</span>
            </span>
          ) : (
            <span key={b.label} className="text-sm font-semibold text-brand-ink">
              {b.label} {b.rating}
            </span>
          )
        )}
      </div>
    </section>
  );
}
