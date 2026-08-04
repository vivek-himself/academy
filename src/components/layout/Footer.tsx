import Link from "next/link";
import Image from "next/image";
import Logo from "./Logo";
import { prisma } from "@/lib/prisma";
import { safeJsonParse } from "@/lib/json";
import { SOCIAL_PLATFORMS, normalizeSocialLinks } from "@/lib/socialLinks";

function FooterColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h4 className="mb-4 text-sm font-semibold text-brand-ink">{title}</h4>
      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={link.label}>
            <Link href={link.href} className="text-sm text-brand-muted hover:text-brand-ink">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default async function Footer() {
  const [links, settings, paymentBlock] = await Promise.all([
    prisma.footerLink.findMany({ orderBy: [{ column: "asc" }, { order: "asc" }] }),
    prisma.siteSettings.findUnique({ where: { id: "default" } }),
    prisma.contentBlock.findUnique({ where: { key: "footer_payment_methods" } }),
  ]);

  const byColumn = (col: string) => links.filter((l) => l.column === col);
  const socialLinks = normalizeSocialLinks(safeJsonParse<object>(settings?.socialLinksJson, {}));
  const visibleSocialLinks = SOCIAL_PLATFORMS.filter((p) => {
    const link = socialLinks[p.key];
    return link.url && !link.hidden;
  });
  const paymentMethods = safeJsonParse<{ label: string; imageUrl: string }[]>(paymentBlock?.dataJson, []).filter(
    (pm) => pm.imageUrl
  );

  return (
    <footer className="border-t border-brand-border bg-[#f7f6f9] pt-14">
      <div className="container-page grid grid-cols-1 gap-10 pb-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-[220px] text-sm text-brand-muted">{settings?.tagline || "Marketing Mastery, One Class at a Time."}</p>
          {visibleSocialLinks.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-3">
              {visibleSocialLinks.map(({ key, label, icon: Icon }) => (
                <a
                  key={key}
                  href={socialLinks[key].url}
                  target={socialLinks[key].url.startsWith("mailto:") ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-brand-ink/15 text-brand-ink hover:bg-white"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          )}
          <p className="mt-6 text-xs font-medium text-brand-muted">Payment Methods</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {paymentMethods.length > 0
              ? paymentMethods.map((pm) => (
                  <span
                    key={pm.label}
                    className="flex h-7 w-11 items-center justify-center rounded border border-brand-ink/10 bg-white p-1"
                  >
                    <Image src={pm.imageUrl} alt={pm.label} width={40} height={24} className="h-full w-full object-contain" unoptimized />
                  </span>
                ))
              : ["VISA", "MC", "AMEX", "UPI", "GPay", "PhonePe"].map((m) => (
                  <span
                    key={m}
                    className="rounded border border-brand-ink/10 bg-white px-2 py-1 text-[10px] font-semibold text-brand-muted"
                  >
                    {m}
                  </span>
                ))}
          </div>
        </div>

        <FooterColumn title="Discover" links={byColumn("discover")} />
        <FooterColumn title="Growth" links={byColumn("growth")} />
        <FooterColumn title="More" links={byColumn("more")} />
      </div>

      <div className="border-t border-brand-border">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-5 text-xs text-brand-muted sm:flex-row">
          <p>Made with ❤️ in India 🇮🇳 for the World 🌐</p>
          <p>© 2017 - 2025 | Academy by Nigel Quadros | All Rights Reserved ®</p>
        </div>
      </div>
    </footer>
  );
}
