import Image from "next/image";
import Link from "next/link";

export default function WebinarCard({ imageUrl }: { imageUrl?: string }) {
  return (
    <div className="relative mt-6 overflow-hidden rounded-2xl bg-brand-purple p-6">
      {imageUrl && (
        <>
          <Image src={imageUrl} alt="" fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-purple via-brand-purple/60 to-brand-purple/20" />
        </>
      )}
      <div className="relative z-10">
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
      </div>
    </div>
  );
}
