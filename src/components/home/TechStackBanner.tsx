import Link from "next/link";
import { Headset, Award, MessageCircle, CreditCard, ShoppingBag, FileText, Wallet, LayoutGrid } from "lucide-react";

const chips = [
  { icon: Headset, color: "bg-violet-500" },
  { icon: Award, color: "bg-pink-500" },
  { icon: MessageCircle, color: "bg-sky-400" },
  { icon: LayoutGrid, color: "bg-amber-400" },
  { icon: Wallet, color: "bg-purple-600" },
  { icon: CreditCard, color: "bg-emerald-500" },
  { icon: FileText, color: "bg-fuchsia-500" },
  { icon: ShoppingBag, color: "bg-orange-500" },
];

type Block = { eyebrow: string; title: string; description: string; ctaLabel: string };

export default function TechStackBanner({ block }: { block: Block }) {
  return (
    <section className="container-page py-10">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-purple to-fuchsia-800 px-6 py-10 sm:px-12">
        <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-sm">
            <span className="text-xs font-semibold uppercase tracking-wide text-white/60">{block.eyebrow}</span>
            <h3 className="mt-2 text-2xl font-bold text-white sm:text-3xl">{block.title}</h3>
            <p className="mt-3 text-sm text-white/70">{block.description}</p>
            <Link
              href="/courses"
              className="mt-5 inline-block rounded-full bg-brand-pink px-6 py-3 text-sm font-semibold text-white hover:bg-brand-pink-dark"
            >
              {block.ctaLabel}
            </Link>
          </div>
          <div className="grid grid-cols-4 gap-3 sm:gap-4">
            {chips.map((c, i) => (
              <span
                key={i}
                className={`flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-lg sm:h-14 sm:w-14 ${c.color}`}
                style={{ transform: i % 2 === 0 ? "rotate(-6deg)" : "rotate(6deg)" }}
              >
                <c.icon size={20} />
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
