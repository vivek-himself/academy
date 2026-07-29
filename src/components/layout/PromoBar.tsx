import { prisma } from "@/lib/prisma";

export default async function PromoBar() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: "default" } });
  const text = settings?.promoBarText || 'Use promo code "nqacademy" to avail 50%off';

  return (
    <div className="bg-brand-purple text-white text-center text-xs sm:text-sm py-2.5 px-4">
      {text}
    </div>
  );
}
