import Hero from "@/components/home/Hero";
import StatsBar from "@/components/home/StatsBar";
import TechStackBanner from "@/components/home/TechStackBanner";
import TrendingCourses from "@/components/home/TrendingCourses";
import AsSeenOn from "@/components/home/AsSeenOn";
import GrowSkill from "@/components/home/GrowSkill";
import RandomPromo from "@/components/home/RandomPromo";
import BrowseTopCourses from "@/components/home/BrowseTopCourses";
import FaqAccordion from "@/components/ui/FaqAccordion";
import CTABanner from "@/components/ui/CTABanner";
import SectionHeading from "@/components/ui/SectionHeading";
import { prisma } from "@/lib/prisma";
import { mapCourse } from "@/lib/mappers";
import { safeJsonParse } from "@/lib/json";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [heroSlides, stats, trustLogos, blocks, courses, faqs] = await Promise.all([
    prisma.heroSlide.findMany({ orderBy: { order: "asc" } }),
    prisma.homepageStat.findMany({ orderBy: { order: "asc" } }),
    prisma.trustLogo.findMany({ orderBy: { order: "asc" } }),
    prisma.contentBlock.findMany({
      where: { key: { in: ["home_tech_stack", "home_grow_skill", "home_random_promo"] } },
    }),
    prisma.course.findMany({
      where: { published: true },
      include: { category: true, mentor: true },
      orderBy: { order: "asc" },
      take: 13,
    }),
    prisma.faq.findMany({ orderBy: { order: "asc" } }),
  ]);

  const blockMap = Object.fromEntries(blocks.map((b) => [b.key, b.dataJson]));
  const mappedCourses = courses.map((c) => ({ ...mapCourse(c), slug: c.slug }));

  const techStack = safeJsonParse(blockMap["home_tech_stack"], {
    eyebrow: "",
    title: "",
    description: "",
    ctaLabel: "Explore Course",
    imageUrl: "",
  });
  const growSkill = safeJsonParse(blockMap["home_grow_skill"], {
    title: "",
    description: "",
    checklist: [] as string[],
    ctaLabel: "Explore Course",
    imageUrl: "",
  });
  const randomPromo = safeJsonParse(blockMap["home_random_promo"], {
    eyebrow: "",
    title: "",
    description: "",
    ctaLabel: "Explore Course",
    imageUrl: "",
  });

  return (
    <>
      <Hero
        slides={
          heroSlides.length
            ? heroSlides.map((s) => ({
                title: s.title,
                subtitle: s.subtitle,
                ctaLabel: s.ctaLabel,
                ctaHref: s.ctaHref,
                imageDesktopUrl: s.imageDesktopUrl,
              }))
            : [{ title: "Learn something new everyday.", subtitle: "", ctaLabel: "Explore Courses", ctaHref: "/courses" }]
        }
      />
      <StatsBar stats={stats} />
      <TechStackBanner block={techStack} />
      {mappedCourses.length >= 5 && <TrendingCourses featured={mappedCourses[4]} items={mappedCourses.slice(0, 4)} />}
      <AsSeenOn logos={trustLogos} />
      <GrowSkill block={growSkill} />
      <RandomPromo block={randomPromo} />
      <BrowseTopCourses items={mappedCourses.slice(0, 8)} />
      <section className="container-page py-10 sm:py-14">
        <SectionHeading title="FAQs" />
        <div className="mt-8">
          <FaqAccordion items={faqs} />
        </div>
      </section>
      <CTABanner />
    </>
  );
}
