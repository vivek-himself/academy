import Image from "next/image";
import Link from "next/link";

type Block = { eyebrow: string; title: string; description: string; ctaLabel: string; imageUrl?: string };

export default function TechStackBanner({ block }: { block: Block }) {
  return (
    <section className="container-page py-10">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-purple to-fuchsia-800 px-6 py-10 sm:px-12">
        {block.imageUrl && <Image src={block.imageUrl} alt="" fill className="object-cover" />}
        <div className="relative z-10 max-w-sm">
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
      </div>
    </section>
  );
}
