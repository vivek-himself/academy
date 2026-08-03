import type { Metadata } from "next";
import SectionHeading from "@/components/ui/SectionHeading";
import TestimonialCard from "@/components/ui/TestimonialCard";
import CTABanner from "@/components/ui/CTABanner";

export const metadata: Metadata = {
  title: "Partners — Academy",
};

const sections = [
  {
    heading: "Why Partner With Us",
    body: [
      "Academy is built around a simple idea: learning should be relevant, applied, and closely aligned with the real world.",
      "We work with ambitious learners who are looking to go beyond theory, and that requires us to stay deeply connected with industry, technology, and education. Our partnerships allow us to continuously evolve what we offer, bringing in the latest tools, real-world exposure, and practical opportunities that genuinely prepare individuals for what comes next.",
    ],
  },
  {
    heading: "Technology Partnerships",
    body: [
      "Our technology partners play a critical role in shaping how learning is delivered on our platform. We collaborate with companies that provide infrastructure, tools, and systems that power everything from live learning environments to hands-on execution.",
      "This includes platforms across cloud infrastructure, development environments, analytics, artificial intelligence, and security. The focus is not just on integration, but on enabling learners to work with tools that reflect real industry usage, giving them exposure that goes beyond traditional education.",
    ],
  },
  {
    heading: "Educational Partnerships",
    body: [
      "We work closely with educational institutions and knowledge-driven organisations to strengthen the depth and credibility of our learning experience.",
      "These collaborations are designed to go beyond surface-level engagement, often involving curriculum alignment, co-created programs, and shared perspectives on how education should evolve.",
    ],
  },
  {
    heading: "Corporate Partnerships",
    body: [
      "Our corporate partnerships are built around creating real pathways between learning and opportunity. We collaborate with organisations that are actively shaping industries, allowing them to engage with our learner base through hiring initiatives, mentorship, and practical exposure.",
      "These relationships are not just about recruitment, but about building a stronger, more prepared workforce. Companies gain access to individuals who are trained through hands-on learning, while learners gain insight into real-world expectations and career directions.",
    ],
  },
  {
    heading: "What You Gain as a Partner",
    body: [
      "Partnering with Academy is designed to be mutually valuable. It offers the opportunity to build meaningful visibility among a focused and motivated learner base, while also creating access to emerging talent that is already trained in practical skills.",
      "Beyond this, partners are able to contribute to shaping how modern education is delivered, positioning themselves as thought leaders within their space. There is also a strong element of impact, as partnerships contribute to broader educational and community-focused initiatives that we actively support.",
    ],
  },
  {
    heading: "Becoming a Partner",
    body: [
      "We are always open to collaborating with organisations that align with our vision of practical, future-ready education.",
      "The process begins with a conversation to understand mutual goals and areas of alignment, followed by defining how the partnership can create value on both sides. Once the structure is clear, we move towards formalising the collaboration and bringing it to life through coordinated efforts across learning, communication, and engagement.",
    ],
  },
];

const testimonials = [
  {
    quote:
      "Academy is building something different. The depth of learning, combined with real-world application, makes their students stand out instantly.",
    name: "Chief Strategy Officer",
    role: "Accenture",
  },
  {
    quote:
      "What stands out is their commitment to real learning. This isn't theoretical education, it's hands-on, industry-aligned, and exactly what companies need today.",
    name: "Director, Learning & Development",
    role: "Total Energies",
  },
];

export default function PartnersPage() {
  return (
    <>
      <section className="container-page py-12 sm:py-16">
        <SectionHeading
          title="Our Partners"
          description="We work alongside top organizations to create learning experiences that translate into real-world opportunities."
        />

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
        </div>

        <div className="mx-auto mt-12 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-2">
          {testimonials.map((t) => (
            <TestimonialCard key={t.role} quote={t.quote} name={t.name} role={t.role} />
          ))}
        </div>

        <div className="mx-auto mt-12 max-w-3xl">
          <h2 className="text-lg font-semibold text-brand-ink">Contact Our Partnerships Team</h2>
          <div className="mt-2 space-y-1 text-sm leading-relaxed text-brand-muted">
            <p>Let&apos;s create something impactful together. Get in touch to explore partnership opportunities.</p>
            <p className="pt-3 font-medium text-brand-ink">Academy Worldwide</p>
            <p>Email: care@nigelquadros.com</p>
            <p>Phone: +91 96650 64435</p>
          </div>
        </div>
      </section>
      <CTABanner />
    </>
  );
}
