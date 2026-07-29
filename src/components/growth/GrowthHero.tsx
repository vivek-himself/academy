import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import type { GrowthPageView } from "@/lib/mappers";

export default function GrowthHero({ page }: { page: GrowthPageView }) {
  return (
    <section className="container-page grid grid-cols-1 gap-8 py-10 lg:grid-cols-2 lg:items-center sm:py-14">
      <div>
        <h1 className="text-3xl font-bold leading-tight text-brand-ink sm:text-4xl">
          {page.title}
          <br />
          <span className="text-brand-pink">{page.titleHighlight}</span>
        </h1>
        <p className="mt-4 max-w-lg text-sm text-brand-muted sm:text-base">{page.subtitle}</p>

        <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-2">
          {page.checklist.map((item) => (
            <span key={item} className="flex items-center gap-2 text-xs font-medium text-brand-ink sm:text-sm">
              <CheckCircle2 size={15} className="shrink-0 text-emerald-500" /> {item}
            </span>
          ))}
        </div>

        <button className="mt-6 w-full rounded-full bg-brand-pink px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-white hover:bg-brand-pink-dark sm:w-auto">
          {page.ctaLabel}
        </button>

        <div className="mt-4 flex gap-2">
          {["VISA", "MC", "AMEX", "UPI"].map((m) => (
            <span key={m} className="rounded border border-brand-border bg-white px-2 py-1 text-[10px] font-semibold text-brand-muted">
              {m}
            </span>
          ))}
        </div>
      </div>

      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-brand-surface lg:aspect-square">
        <Image
          src={page.heroImageDesktopUrl || "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80"}
          alt={page.titleHighlight}
          fill
          className="object-cover"
        />
      </div>
    </section>
  );
}
