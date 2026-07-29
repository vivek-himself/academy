import { prisma } from "@/lib/prisma";
import PageHeader from "../../components/PageHeader";
import FooterEditor from "./FooterEditor";

export const dynamic = "force-dynamic";

export default async function FooterAdminPage() {
  const links = await prisma.footerLink.findMany({ orderBy: [{ column: "asc" }, { order: "asc" }] });

  const byColumn = (col: string) =>
    links.filter((l) => l.column === col).map((l) => ({ label: l.label, href: l.href }));

  return (
    <div>
      <PageHeader title="Footer Management" subtitle="Manage the three footer link columns" />
      <FooterEditor
        discover={byColumn("discover")}
        growth={byColumn("growth")}
        more={byColumn("more")}
      />
    </div>
  );
}
