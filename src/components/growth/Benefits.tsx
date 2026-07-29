import { Users, Award, Flag, Lock, Clock, Send, Search, Star } from "lucide-react";
import type { GrowthPageView } from "@/lib/mappers";

const icons: Record<string, typeof Users> = {
  users: Users,
  award: Award,
  flag: Flag,
  lock: Lock,
  clock: Clock,
  send: Send,
  search: Search,
  star: Star,
};

export default function Benefits({ page }: { page: GrowthPageView }) {
  return (
    <section className="container-page py-10 text-center sm:py-14">
      <h2 className="text-2xl font-bold text-brand-ink sm:text-3xl">{page.benefitsTitle}</h2>
      <div className="mx-auto mt-10 grid max-w-3xl grid-cols-1 gap-8 sm:grid-cols-3">
        {page.benefits.map((benefit) => {
          const Icon = icons[benefit.icon] ?? Star;
          return (
            <div key={benefit.title} className="flex flex-col items-center gap-3">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-pink/10 text-brand-pink">
                <Icon size={24} />
              </span>
              <h3 className="text-sm font-bold text-brand-ink">{benefit.title}</h3>
              <p className="text-xs text-brand-muted">{benefit.description}</p>
            </div>
          );
        })}
      </div>
      <button className="mt-8 rounded-full bg-brand-pink px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-white hover:bg-brand-pink-dark">
        {page.benefitsCta}
      </button>
    </section>
  );
}
