import Link from "next/link";
import { Sparkles, Gift } from "lucide-react";

type Block = { eyebrow: string; title: string; description: string; ctaLabel: string };

export default function RandomPromo({ block }: { block: Block }) {
  return (
    <section className="container-page py-10">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-fuchsia-600 to-amber-400 px-6 py-10 sm:px-12">
        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-md">
            <span className="text-xs font-semibold uppercase tracking-wide text-white/80">{block.eyebrow}</span>
            <h3 className="mt-2 text-2xl font-bold text-white sm:text-3xl">{block.title}</h3>
            <p className="mt-3 text-sm text-white/85">{block.description}</p>
            <Link
              href="/courses"
              className="mt-5 inline-block rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand-purple hover:bg-white/90"
            >
              {block.ctaLabel}
            </Link>
          </div>
          <div className="hidden shrink-0 items-center gap-3 sm:flex">
            <span className="flex h-24 w-24 rotate-[-8deg] items-center justify-center rounded-2xl bg-white/20 text-white backdrop-blur">
              <Gift size={40} />
            </span>
            <span className="flex h-28 w-28 rotate-[6deg] items-center justify-center rounded-2xl bg-white text-brand-purple shadow-xl">
              <Sparkles size={44} />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
