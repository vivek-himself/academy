import { headers } from "next/headers";
import { isMobileUserAgent } from "@/lib/device";
import DesktopLoginForm from "./DesktopLoginForm";
import MobileLoginForm from "./MobileLoginForm";

export default async function AdminLoginPage() {
  const headersList = await headers();
  const mobile = isMobileUserAgent(headersList.get("user-agent"));

  return mobile ? <MobileLoginForm /> : <DesktopLoginForm />;
}
