import { headers, cookies } from "next/headers";
import { isMobileUserAgent } from "@/lib/device";
import { verifyDeviceTrust, DEVICE_TRUST_COOKIE } from "@/lib/mobileAdminAuth";
import { prisma } from "@/lib/prisma";
import DesktopLoginForm from "./DesktopLoginForm";
import MobileLoginForm from "./MobileLoginForm";

export default async function AdminLoginPage() {
  const [headersList, cookieStore] = await Promise.all([headers(), cookies()]);
  const mobile = isMobileUserAgent(headersList.get("user-agent"));

  let pinEmail: string | null = null;
  if (mobile) {
    const trust = await verifyDeviceTrust(cookieStore.get(DEVICE_TRUST_COOKIE)?.value);
    if (trust) {
      const user = await prisma.mobileAdminUser.findUnique({ where: { email: trust.email }, select: { pinHash: true } });
      if (user?.pinHash) pinEmail = trust.email;
    }
  }

  return mobile ? <MobileLoginForm initialPinEmail={pinEmail} /> : <DesktopLoginForm />;
}
