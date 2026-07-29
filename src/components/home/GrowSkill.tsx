import Image from "next/image";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

type Block = { title: string; description: string; checklist: string[]; ctaLabel: string; imageUrl: string };

export default function GrowSkill({ block }: { block: Block }) {
  return (
    <section className="bg-brand-surface py-14">
      <div className="container-page grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
        <div className="relative mx-auto aspect-square w-full max-w-sm">
          <Image
            src={block.imageUrl || "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=700&q=80"}
            alt={block.title}
            fill
            className="rounded-2xl object-cover"
          />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-brand-ink sm:text-3xl">{block.title}</h2>
          <p className="mt-3 max-w-md text-sm text-brand-muted">{block.description}</p>
          <ul className="mt-5 space-y-2.5">
            {block.checklist.map((c, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-brand-ink">
                <CheckCircle2 size={16} className="text-brand-pink" /> {c}
              </li>
            ))}
          </ul>
          <Link
            href="/courses"
            className="mt-6 inline-block rounded-full bg-brand-pink px-6 py-3 text-sm font-semibold text-white hover:bg-brand-pink-dark"
          >
            {block.ctaLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
