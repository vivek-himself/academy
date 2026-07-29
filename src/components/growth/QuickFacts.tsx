import type { GrowthPageView } from "@/lib/mappers";

export default function QuickFacts({ page }: { page: GrowthPageView }) {
  return (
    <section className="container-page py-10 sm:py-14">
      <h2 className="mb-8 text-2xl font-bold text-brand-pink sm:text-3xl">Quick Facts</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {page.quickFacts.map((fact) => (
          <div key={fact.title} className="rounded-2xl bg-brand-surface p-6">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-purple text-xs font-bold text-white">
              {fact.badge}
            </span>
            <h3 className="mt-4 text-base font-bold text-brand-ink">{fact.title}</h3>
            <p className="mt-2 text-xs leading-relaxed text-brand-muted">{fact.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
