import { prisma } from "@/lib/prisma";
import { safeJsonParse } from "@/lib/json";
import { normalizeSocialLinks } from "@/lib/socialLinks";
import PageHeader from "../../components/PageHeader";
import SettingsEditor from "./SettingsEditor";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: "default" } });
  const socialLinks = normalizeSocialLinks(safeJsonParse<object>(settings?.socialLinksJson, {}));

  return (
    <div>
      <PageHeader title="Platform Settings" subtitle="Site-wide settings, SEO defaults, and your admin account" />
      <SettingsEditor
        initial={{
          siteName: settings?.siteName ?? "Academy",
          tagline: settings?.tagline ?? "",
          promoBarText: settings?.promoBarText ?? "",
          defaultSeoTitle: settings?.defaultSeoTitle ?? "",
          defaultSeoDescription: settings?.defaultSeoDescription ?? "",
          socialLinks,
        }}
      />
    </div>
  );
}
