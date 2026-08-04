import { prisma } from "@/lib/prisma";
import { safeJsonParse } from "@/lib/json";
import PageHeader from "../../components/PageHeader";
import HomepageEditor from "./HomepageEditor";

export const dynamic = "force-dynamic";

export default async function HomepageContentPage() {
  const [heroSlides, stats, trustLogos, blocks] = await Promise.all([
    prisma.heroSlide.findMany({ orderBy: { order: "asc" } }),
    prisma.homepageStat.findMany({ orderBy: { order: "asc" } }),
    prisma.trustLogo.findMany({ orderBy: { order: "asc" } }),
    prisma.contentBlock.findMany({
      where: {
        key: { in: ["home_tech_stack", "home_grow_skill", "home_random_promo", "cta_banner_default", "home_review_badges"] },
      },
    }),
  ]);

  const blockMap = Object.fromEntries(blocks.map((b) => [b.key, b.dataJson]));

  return (
    <div>
      <PageHeader title="Homepage Content" subtitle="Edit every section of your homepage" />
      <HomepageEditor
        heroSlides={heroSlides.map((s) => ({
          title: s.title,
          subtitle: s.subtitle,
          ctaLabel: s.ctaLabel,
          ctaHref: s.ctaHref,
          imageDesktopUrl: s.imageDesktopUrl ?? "",
          imageMobileUrl: s.imageMobileUrl ?? "",
        }))}
        stats={stats.map((s) => ({ icon: s.icon, value: s.value, label: s.label }))}
        trustLogos={trustLogos.map((l) => ({ name: l.name, imageUrl: l.imageUrl ?? "" }))}
        techStack={safeJsonParse(blockMap["home_tech_stack"], { eyebrow: "", title: "", description: "", ctaLabel: "", imageUrl: "" })}
        growSkill={safeJsonParse(blockMap["home_grow_skill"], {
          title: "",
          description: "",
          checklist: [] as string[],
          ctaLabel: "",
          imageUrl: "",
        })}
        randomPromo={safeJsonParse(blockMap["home_random_promo"], { eyebrow: "", title: "", description: "", ctaLabel: "", imageUrl: "" })}
        ctaBanner={safeJsonParse(blockMap["cta_banner_default"], { title: "", description: "", ctaLabel: "", href: "", imageUrl: "" })}
        reviewBadges={safeJsonParse(blockMap["home_review_badges"], [
          { label: "Google", rating: "★★★★★ 4.6/5", imageUrl: "" },
          { label: "Capterra", rating: "★★★★★ 4.7/5", imageUrl: "" },
          { label: "G2", rating: "★★★★★ 4.3/5", imageUrl: "" },
        ])}
      />
    </div>
  );
}
