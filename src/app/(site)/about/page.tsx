import type { Metadata } from "next";
import { Award, Users, CheckCircle, TrendingUp, Heart } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import CTABanner from "@/components/ui/CTABanner";

export const metadata: Metadata = {
  title: "About",
};

const values = [
  { icon: Award, title: "Excellence", body: "We bring a consistent standard of excellence into every course, interaction, and experience we create." },
  { icon: Users, title: "Community", body: "We foster a collaborative environment where marketers learn, grow, and succeed together." },
  { icon: CheckCircle, title: "Quality", body: "Our programs are built on real-world expertise, ensuring practical and relevant learning." },
  { icon: TrendingUp, title: "Growth", body: "We focus on continuous development, helping professionals adapt and stay ahead." },
  { icon: Heart, title: "Passion", body: "We are driven by a genuine commitment to education and meaningful impact." },
];

const timeline = [
  { year: "2017", title: "Founded", body: "Founded with a vision to redefine marketing education through practical learning." },
  { year: "2019", title: "Initial Programs", body: "Launched initial programs and built the first cohort-based learning model." },
  { year: "2020", title: "Live Learning", body: "Reached a strong base of learners and refined hands-on, live learning formats." },
  { year: "2021", title: "Expanded Categories", body: "Expanded course categories across marketing, design, and strategy." },
  { year: "2022", title: "Industry Recognition", body: "Gained industry recognition for delivering outcome-driven education." },
  { year: "2023", title: "Mentor Network", body: "Scaled mentor network and strengthened global student participation." },
  { year: "2024", title: "Advanced Tools", body: "Enhanced learning experience with advanced tools and real-world integrations." },
  { year: "2025", title: "Global Expansion", body: "Expanded globally, supporting learners across multiple countries with a growing community." },
];

export default function AboutPage() {
  return (
    <>
      <section className="container-page py-12 sm:py-16">
        <SectionHeading
          title="Learn It. Apply It. Own It."
          description="More than a platform, this is where driven marketers come together to learn, apply, and grow continuously. No fluff, no passive learning, just a focused environment built for serious growth and real outcomes."
        />

        <div className="mx-auto mt-12 max-w-3xl">
          <h2 className="text-lg font-semibold text-brand-ink">Our Mission</h2>
          <p className="mt-2 text-sm leading-relaxed text-brand-muted">
            To empower marketing professionals with the knowledge, skills, and confidence required to succeed in a
            constantly evolving digital world. At Academy, we believe education should not only be accessible but
            also practical, relevant, and truly transformative in the way it shapes careers and thinking.
          </p>
        </div>

        <div className="mx-auto mt-10 grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {values.map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-xl border border-brand-border p-5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-purple/10 text-brand-purple">
                <Icon size={18} />
              </span>
              <p className="mt-3 text-sm font-semibold text-brand-ink">{title}</p>
              <p className="mt-1 text-xs leading-relaxed text-brand-muted">{body}</p>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-14 max-w-3xl">
          <h2 className="text-lg font-semibold text-brand-ink">The Story Behind the Academy</h2>
          <div className="mt-2 space-y-3 text-sm leading-relaxed text-brand-muted">
            <p>
              Academy was founded in 2017 with a clear and considered realization that traditional marketing
              education was not evolving at the pace of the industry. As the digital landscape advanced rapidly,
              much of the learning available remained theoretical, often disconnected from real-world execution and
              practical application.
            </p>
            <p>
              Built on a strong foundation of real-world expertise across marketing, advertising, design,
              leadership, artificial intelligence, and strategy, the Academy was created to bridge the growing gap
              between theoretical learning and practical execution.
            </p>
            <p>
              Today, this approach is supported by a diverse group of mentors whose combined experience exceeds a
              century, bringing depth, perspective, and real-world relevance into every learning experience.
            </p>
          </div>
        </div>

        <div className="mx-auto mt-14 max-w-3xl">
          <h2 className="text-lg font-semibold text-brand-ink">Our Impact So Far</h2>
          <p className="mt-2 text-sm leading-relaxed text-brand-muted">
            Over the years, Academy has supported more than <span className="font-semibold text-brand-ink">11,000+</span> learners in reshaping their careers.
          </p>
          <ol className="mt-6 space-y-5 border-l border-brand-border pl-6">
            {timeline.map((item) => (
              <li key={item.year} className="relative">
                <span className="absolute -left-[27px] top-1 h-2.5 w-2.5 rounded-full bg-brand-pink" />
                <p className="text-xs font-semibold text-brand-pink">{item.year}</p>
                <p className="mt-0.5 text-sm font-semibold text-brand-ink">{item.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-brand-muted">{item.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <CTABanner />
    </>
  );
}
