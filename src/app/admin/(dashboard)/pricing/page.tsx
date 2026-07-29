import { prisma } from "@/lib/prisma";
import PageHeader from "../../components/PageHeader";
import PricingEditor from "./PricingEditor";

export const dynamic = "force-dynamic";

export default async function PricingPage() {
  const plans = await prisma.pricingPlan.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <PageHeader title="Pricing Plans" subtitle="Manage the 3-tier pricing table on the Packages page" />
      <PricingEditor
        initialPlans={plans.map((p) => ({
          name: p.name,
          tagline: p.tagline ?? "",
          price: p.price,
          recommended: p.recommended,
          featuresJson: p.featuresJson,
        }))}
      />
    </div>
  );
}
