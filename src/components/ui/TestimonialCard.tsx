import Image from "next/image";

export default function TestimonialCard({
  quote,
  name,
  role,
  avatar,
}: {
  quote: string;
  name: string;
  role: string;
  avatar?: string;
}) {
  return (
    <div className="rounded-xl border border-brand-border bg-white p-5">
      <p className="text-xs leading-relaxed text-brand-muted sm:text-sm">{quote}</p>
      <div className="mt-4 flex items-center gap-3">
        {avatar ? (
          <Image src={avatar} alt={name} width={32} height={32} className="h-8 w-8 rounded-full object-cover" />
        ) : (
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-purple text-xs font-semibold text-white">
            {name.charAt(0)}
          </span>
        )}
        <div>
          <p className="text-sm font-semibold text-brand-ink">{name}</p>
          <p className="text-xs text-brand-pink">{role}</p>
        </div>
      </div>
    </div>
  );
}
