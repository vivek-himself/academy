import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PageHeader from "../../../components/PageHeader";
import GrowthPageEditor from "./GrowthPageEditor";

export const dynamic = "force-dynamic";

export default async function EditGrowthPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await prisma.growthPage.findUnique({ where: { slug } });
  if (!page) notFound();

  return (
    <div>
      <PageHeader title={`${page.title} ${page.titleHighlight}`} subtitle={`/growth/${page.slug}`} />
      <GrowthPageEditor
        page={{
          slug: page.slug,
          eyebrow: page.eyebrow ?? "",
          title: page.title,
          titleHighlight: page.titleHighlight,
          subtitle: page.subtitle,
          checklistJson: page.checklistJson,
          ctaLabel: page.ctaLabel,
          heroImageDesktopUrl: page.heroImageDesktopUrl ?? "",
          heroImageMobileUrl: page.heroImageMobileUrl ?? "",
          expectParagraph: page.expectParagraph,
          dayTabsJson: page.dayTabsJson,
          expectImageDesktopUrl: page.expectImageDesktopUrl ?? "",
          expectImageMobileUrl: page.expectImageMobileUrl ?? "",
          quickFactsJson: page.quickFactsJson,
          benefitsTitle: page.benefitsTitle,
          benefitsJson: page.benefitsJson,
          benefitsCta: page.benefitsCta,
          seoTitle: page.seoTitle ?? "",
          seoDescription: page.seoDescription ?? "",
        }}
      />
    </div>
  );
}
