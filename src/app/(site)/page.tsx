import Hero from "@/components/home/Hero";
import StatsBar from "@/components/home/StatsBar";
import TechStackBanner from "@/components/home/TechStackBanner";
import TrendingCourses from "@/components/home/TrendingCourses";
import AsSeenOn from "@/components/home/AsSeenOn";
import GrowSkill from "@/components/home/GrowSkill";
import RandomPromo from "@/components/home/RandomPromo";
import BrowseTopCourses from "@/components/home/BrowseTopCourses";
import Link from "next/link";
import FaqAccordion from "@/components/ui/FaqAccordion";
import CTABanner from "@/components/ui/CTABanner";
import SectionHeading from "@/components/ui/SectionHeading";
import { prisma } from "@/lib/prisma";
import { mapCourse } from "@/lib/mappers";
import { safeJsonParse } from "@/lib/json";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [heroSlides, stats, trustLogos, blocks, courses, faqs, categories, coursesByRecency] = await Promise.all([
    prisma.heroSlide.findMany({ orderBy: { order: "asc" } }),
    prisma.homepageStat.findMany({ orderBy: { order: "asc" } }),
    prisma.trustLogo.findMany({ orderBy: { order: "asc" } }),
    prisma.contentBlock.findMany({
      where: {
        key: { in: ["home_tech_stack", "home_grow_skill", "home_random_promo", "home_review_badges", "home_trending_courses"] },
      },
    }),
    prisma.course.findMany({
      where: { published: true },
      include: { category: true, mentor: true },
      orderBy: { order: "asc" },
      take: 13,
    }),
    prisma.faq.findMany({ orderBy: { order: "asc" } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.course.findMany({
      where: { published: true },
      select: { category: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const blockMap = Object.fromEntries(blocks.map((b) => [b.key, b.dataJson]));
  const mappedCourses = courses.map((c) => ({ ...mapCourse(c), id: c.id, slug: c.slug }));

  // Category tabs on "Browse Our Top Courses" lead with whichever category most recently
  // received a new course upload; categories with no courses yet fall back to alphabetical.
  const categoriesByRecentUpload: string[] = [];
  for (const c of coursesByRecency) {
    if (c.category && !categoriesByRecentUpload.includes(c.category.name)) {
      categoriesByRecentUpload.push(c.category.name);
    }
  }
  const categoryNames = [
    ...categoriesByRecentUpload,
    ...categories.map((c) => c.name).filter((name) => !categoriesByRecentUpload.includes(name)),
  ];

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
  const reviewBadges = safeJsonParse<{ label: string; rating: string; imageUrl: string }[] | undefined>(
    blockMap["home_review_badges"],
    undefined
  );
  const trendingCoursesBlock = safeJsonParse(blockMap["home_trending_courses"], {
    title: "Trending Courses",
    featuredCourseId: "",
    featuredImageUrl: "",
  });

  const pickedFeatured = mappedCourses.find((c) => c.id === trendingCoursesBlock.featuredCourseId);
  const baseFeaturedCourse = pickedFeatured ?? mappedCourses[Math.min(4, mappedCourses.length - 1)];
  const featuredCourse = baseFeaturedCourse
    ? { ...baseFeaturedCourse, image: trendingCoursesBlock.featuredImageUrl || baseFeaturedCourse.image }
    : undefined;
  const trendingItems = mappedCourses.filter((c) => c.slug !== baseFeaturedCourse?.slug).slice(0, 4);

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
      <StatsBar stats={stats} reviewBadges={reviewBadges} />
      <TechStackBanner block={techStack} />
      {featuredCourse && (
        <TrendingCourses title={trendingCoursesBlock.title || "Trending Courses"} featured={featuredCourse} items={trendingItems} />
      )}
      <AsSeenOn logos={trustLogos} />
      <GrowSkill block={growSkill} />
      <RandomPromo block={randomPromo} />
      <BrowseTopCourses items={mappedCourses} categories={categoryNames} />
      <section className="container-page py-10 sm:py-14">
        <SectionHeading title="FAQs" />
        <div className="mt-8">
          <FaqAccordion items={faqs.slice(0, 8)} />
        </div>
        <div className="mt-8 text-center">
          <Link href="/faq" className="text-sm font-semibold text-brand-pink hover:underline">
            View all FAQs →
          </Link>
        </div>
      </section>
      <CTABanner />
    </>
  );
}
