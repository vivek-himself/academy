export default function SectionHeading({
  title,
  highlight,
  description,
  align = "center",
}: {
  title: string;
  highlight?: string;
  description?: string;
  align?: "center" | "left";
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <h2 className="text-2xl font-bold text-brand-ink sm:text-3xl">
        {title} {highlight && <span className="text-brand-pink">{highlight}</span>}
      </h2>
      {description && <p className="mt-3 text-sm text-brand-muted sm:text-base">{description}</p>}
    </div>
  );
}
