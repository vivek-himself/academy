import type { Metadata } from "next";
import SectionHeading from "@/components/ui/SectionHeading";
import CTABanner from "@/components/ui/CTABanner";

export const metadata: Metadata = {
  title: "Philanthropy",
};

const stats = [
  { value: "2,750+", label: "Students Supported" },
  { value: "INR 12,50,000+", label: "Donated to Education" },
  { value: "8+", label: "Partner Organizations" },
];

const sections = [
  {
    heading: "Our Commitment to Purpose",
    body: [
      "At Academy, everything we build is rooted in purpose. We believe that education should not be limited by access or affordability, and more importantly, that growth should create impact beyond the individual.",
      "This is why philanthropy is not something we add later; it is built into how our platform works from the start. Every decision we make is guided by a simple principle: if it does not create value, it does not belong here.",
    ],
  },
  {
    heading: "How Our Philanthropy Model Works",
    body: [
      "When you enrol in a course, you have the option to be part of our philanthropy initiative through a structured contribution of 2%, 5%, or 7%.",
      "This is not an added charge placed on you separately, and it is not treated as an external donation. Instead, it is thoughtfully built into the overall value structure of the platform, allowing us to allocate this portion directly towards impact-driven initiatives.",
      "The intent is simple. Instead of you having to find the right place to donate, verify organisations, or ensure your contribution is reaching the right people, we take on that responsibility.",
      "We work closely with trusted institutions and communities to ensure that every contribution is directed where it is genuinely needed.",
    ],
  },
  {
    heading: "Where the Impact Goes",
    body: [
      "The contributions are used to support individuals and communities that require access to education and basic learning resources.",
      "This includes helping students in rural areas with essentials such as school supplies, uniforms, and digital access, as well as supporting learning environments where resources are limited.",
      "We focus on identifying real needs, not surface-level initiatives. This often means working in rural regions and underserved communities where even small support can create meaningful change. The goal is not scale for visibility, but impact with intention.",
    ],
  },
  {
    heading: "Why This Matters",
    body: [
      "A small contribution, when directed correctly, can create a much larger outcome. We strongly believe that even the smallest effort, when done with clarity and purpose, can lead to meaningful global impact over time.",
      "This is not about charity. It is about responsibility, and about ensuring that growth creates value beyond itself.",
    ],
  },
  {
    heading: "Recognition and Transparency",
    body: [
      "We believe in acknowledging those who choose to be part of this initiative. Every quarter, we highlight contributors through our communication platforms and publications, recognising their role in enabling real impact.",
      "In certain cases, partner organisations also host felicitation initiatives, creating opportunities for contributors to be recognised and, where possible, directly connected to the communities they support.",
      "At the same time, we maintain transparency in how contributions are utilised, ensuring that the impact is clear, measurable, and meaningful.",
    ],
  },
];

export default function PhilanthropyPage() {
  return (
    <>
      <section className="container-page py-12 sm:py-16">
        <SectionHeading
          title="Philanthropy"
          description="Learning that creates impact beyond the individual."
        />

        <div className="mx-auto mt-10 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
          {stats.map((s) => (
            <div key={s.label} className="rounded-xl border border-brand-border p-5 text-center">
              <p className="text-2xl font-bold text-brand-ink">{s.value}</p>
              <p className="mt-1 text-xs text-brand-muted">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-12 max-w-3xl space-y-8">
          {sections.map((section) => (
            <div key={section.heading}>
              <h2 className="text-lg font-semibold text-brand-ink">{section.heading}</h2>
              <div className="mt-2 space-y-3 text-sm leading-relaxed text-brand-muted">
                {section.body.map((p, j) => (
                  <p key={j}>{p}</p>
                ))}
              </div>
            </div>
          ))}

          <div>
            <h2 className="text-lg font-semibold text-brand-ink">Contact Our Philanthropy Team</h2>
            <div className="mt-2 space-y-1 text-sm leading-relaxed text-brand-muted">
              <p>Interested in contributing, applying, or collaborating? Get in touch to explore our philanthropic initiatives.</p>
              <p className="pt-3 font-medium text-brand-ink">Academy Worldwide</p>
              <p>Email: care@nigelquadros.com</p>
              <p>Phone: +91 96650 64435</p>
            </div>
          </div>
        </div>
      </section>
      <CTABanner />
    </>
  );
}
