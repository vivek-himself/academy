import { Users, BookOpen, Award, TrendingUp, Star } from "lucide-react";

const iconMap: Record<string, typeof Users> = {
  users: Users,
  book: BookOpen,
  award: Award,
  trending: TrendingUp,
};

type Stat = { icon: string; value: string; label: string };

export default function StatsBar({ stats }: { stats: Stat[] }) {
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
        <span className="text-sm font-semibold text-brand-ink">Google ★★★★★ 4.6/5</span>
        <span className="text-sm font-semibold text-brand-ink">Capterra ★★★★★ 4.7/5</span>
        <span className="text-sm font-semibold text-brand-ink">G2 ★★★★★ 4.3/5</span>
      </div>
    </section>
  );
}
