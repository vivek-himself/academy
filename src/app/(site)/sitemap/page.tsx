import type { Metadata } from "next";
import Link from "next/link";
import SectionHeading from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Sitemap",
};

const columns: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Main Pages",
    links: [
      { label: "Home", href: "/" },
      { label: "About", href: "/about" },
      { label: "Get in Touch", href: "/contact" },
      { label: "FAQ's", href: "/faq" },
    ],
  },
  {
    title: "Learning",
    links: [
      { label: "Courses", href: "/courses" },
      { label: "Mentors", href: "/mentors" },
      { label: "Success Stories", href: "/success-stories" },
      { label: "Resources", href: "/knowledgebase" },
    ],
  },
  {
    title: "Growth Services",
    links: [
      { label: "Complete CV Rebrand", href: "/growth/cv-rebrand" },
      { label: "LinkedIn Optimization", href: "/growth/linkedin-optimisation" },
      { label: "Interview Preparation", href: "/growth/job-search-consultation" },
      { label: "Packages", href: "/growth/packages" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Careers", href: "/careers" },
      { label: "Partners", href: "/partners" },
      { label: "Philanthropy", href: "/philanthropy" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms & Conditions", href: "/terms" },
      { label: "Refund & Cancellation Policy", href: "/refund-policy" },
      { label: "Cookie Policy", href: "/cookie-policy" },
      { label: "Modern Slavery Act", href: "/modern-slavery-act" },
    ],
  },
];

export default function SitemapPage() {
  return (
    <section className="container-page py-12 sm:py-16">
      <SectionHeading title="Sitemap" description="Find everything you need on Academy." />
      <div className="mt-12 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {columns.map((col) => (
          <div key={col.title}>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-brand-ink">{col.title}</h2>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-brand-muted hover:text-brand-pink">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
