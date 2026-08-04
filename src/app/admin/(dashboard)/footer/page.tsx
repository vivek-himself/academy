import { prisma } from "@/lib/prisma";
import { safeJsonParse } from "@/lib/json";
import PageHeader from "../../components/PageHeader";
import FooterEditor from "./FooterEditor";

export const dynamic = "force-dynamic";

export default async function FooterAdminPage() {
  const [links, paymentBlock] = await Promise.all([
    prisma.footerLink.findMany({ orderBy: [{ column: "asc" }, { order: "asc" }] }),
    prisma.contentBlock.findUnique({ where: { key: "footer_payment_methods" } }),
  ]);

  const byColumn = (col: string) =>
    links.filter((l) => l.column === col).map((l) => ({ label: l.label, href: l.href }));

  const paymentMethods = safeJsonParse<{ label: string; imageUrl: string }[]>(paymentBlock?.dataJson, []);

  return (
    <div>
      <PageHeader title="Footer Management" subtitle="Manage the three footer link columns" />
      <FooterEditor
        discover={byColumn("discover")}
        growth={byColumn("growth")}
        more={byColumn("more")}
        paymentMethods={paymentMethods}
      />
    </div>
  );
}
