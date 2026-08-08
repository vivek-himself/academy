import { prisma } from "@/lib/prisma";
import { safeJsonParse } from "@/lib/json";
import { normalizeSocialLinks } from "@/lib/socialLinks";
import PageHeader from "../../components/PageHeader";
import SettingsEditor, { type SiteStatus } from "./SettingsEditor";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const [settings, mobileAdmin] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: "default" } }),
    prisma.mobileAdminUser.findFirst({ select: { email: true } }),
  ]);
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
          siteStatus: (settings?.siteStatus as SiteStatus) ?? "live",
          hasSitePassword: Boolean(settings?.sitePasswordHash),
        }}
        initialMobileEmail={mobileAdmin?.email ?? null}
      />
    </div>
  );
}
