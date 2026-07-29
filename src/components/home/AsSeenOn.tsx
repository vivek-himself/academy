export default function AsSeenOn({ logos }: { logos: { name: string }[] }) {
  return (
    <section className="border-y border-brand-border bg-white py-8">
      <div className="container-page">
        <p className="mb-5 text-center text-xs font-semibold uppercase tracking-wide text-brand-muted">As seen on</p>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {logos.map((b) => (
            <span key={b.name} className="text-sm font-serif italic text-brand-ink/60">
              {b.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
