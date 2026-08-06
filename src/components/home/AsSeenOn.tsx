import Image from "next/image";

type Logo = { name: string; imageUrl?: string | null };

export default function AsSeenOn({ logos }: { logos: Logo[] }) {
  if (logos.length === 0) return null;

  // Duplicate the list so the track can loop seamlessly at -50%.
  const track = [...logos, ...logos];

  return (
    <section className="border-y border-brand-border bg-white py-8">
      <div className="container-page">
        <p className="mb-5 text-center text-xs font-semibold uppercase tracking-wide text-brand-muted">As seen on</p>
      </div>
      <div className="overflow-hidden">
        <div className="animate-marquee flex w-max items-center gap-14">
          {track.map((logo, i) => (
            <span key={i} className="flex shrink-0 items-center">
              {logo.imageUrl ? (
                <Image
                  src={logo.imageUrl}
                  alt={logo.name}
                  width={230}
                  height={60}
                  className="h-[54px] w-auto object-contain opacity-70 grayscale"
                  unoptimized
                />
              ) : (
                <span className="whitespace-nowrap text-sm font-serif italic text-brand-ink/60">{logo.name}</span>
              )}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
