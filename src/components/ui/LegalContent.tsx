type LegalSection = {
  heading?: string;
  body: string[];
};

export default function LegalContent({
  title,
  sections,
}: {
  title: string;
  sections: LegalSection[];
}) {
  return (
    <section className="container-page py-12 sm:py-16">
      <h1 className="text-2xl font-bold text-brand-ink sm:text-3xl">{title}</h1>
      <div className="mt-8 max-w-3xl space-y-8">
        {sections.map((section, i) => (
          <div key={i}>
            {section.heading && (
              <h2 className="text-lg font-semibold text-brand-ink">{section.heading}</h2>
            )}
            <div className="mt-2 space-y-3 text-sm leading-relaxed text-brand-muted">
              {section.body.map((p, j) => (
                <p key={j}>{p}</p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
