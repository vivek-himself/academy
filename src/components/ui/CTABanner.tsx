import Link from "next/link";
import DecorativeBlobs from "./DecorativeBlobs";
import { prisma } from "@/lib/prisma";
import { safeJsonParse } from "@/lib/json";

export default async function CTABanner({
  title,
  description,
  buttonLabel,
  href,
}: {
  title?: string;
  description?: string;
  buttonLabel?: string;
  href?: string;
}) {
  let resolved = { title, description, buttonLabel, href };

  if (!title) {
    const block = await prisma.contentBlock.findUnique({ where: { key: "cta_banner_default" } });
    const data = safeJsonParse<{ title: string; description: string; ctaLabel: string; href: string }>(
      block?.dataJson,
      {
        title: "Join a course now to get 35% off",
        description: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration.",
        ctaLabel: "Join Academy",
        href: "/courses",
      }
    );
    resolved = { title: data.title, description: data.description, buttonLabel: data.ctaLabel, href: data.href };
  }

  return (
    <section className="container-page py-10 sm:py-14">
      <div className="relative overflow-hidden rounded-2xl bg-brand-purple px-6 py-10 sm:px-12 sm:py-14">
        <div className="relative z-10 max-w-xl">
          <h3 className="text-2xl font-bold text-white sm:text-3xl">{resolved.title}</h3>
          <p className="mt-3 text-sm text-white/70 sm:text-base">{resolved.description}</p>
          <Link
            href={resolved.href ?? "/courses"}
            className="mt-6 inline-block rounded-full bg-brand-pink px-6 py-3 text-sm font-semibold text-white hover:bg-brand-pink-dark"
          >
            {resolved.buttonLabel}
          </Link>
        </div>
        <DecorativeBlobs className="pointer-events-none absolute -bottom-8 -right-4 h-40 w-44 sm:h-52 sm:w-56" />
      </div>
    </section>
  );
}
