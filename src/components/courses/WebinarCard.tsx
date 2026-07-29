import Link from "next/link";
import DecorativeBlobs from "@/components/ui/DecorativeBlobs";

export default function WebinarCard() {
  return (
    <div className="relative mt-6 overflow-hidden rounded-2xl bg-brand-purple p-6">
      <span className="inline-block rounded bg-brand-pink px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
        Webinar
      </span>
      <p className="mt-4 text-sm font-medium text-white/80">Anusha Malar</p>
      <h4 className="mt-1 text-xl font-bold leading-snug text-white">
        Masterclass in Design Thinking, Innovation &amp; Creativity
      </h4>
      <Link
        href="/courses"
        className="mt-5 inline-block rounded-full border border-white/40 px-5 py-2 text-xs font-semibold text-white hover:bg-white/10"
      >
        Learn More
      </Link>
      <DecorativeBlobs className="pointer-events-none absolute -bottom-8 -right-6 h-40 w-44" />
    </div>
  );
}
