"use client";

import { usePathname } from "next/navigation";

const HIDDEN_ROUTES = ["/login", "/signup"];

export default function ConditionalFooter({ footer }: { footer: React.ReactNode }) {
  const pathname = usePathname();
  if (HIDDEN_ROUTES.includes(pathname)) return null;
  return <>{footer}</>;
}
