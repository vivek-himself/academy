"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import Logo from "@/components/layout/Logo";
import { navSections } from "./nav-config";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-brand-border bg-brand-card lg:flex">
      <div className="flex items-center px-6 py-5">
        <Logo className="h-14 w-auto" />
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-4">
        {navSections.map((section, i) => (
          <div key={i} className="mb-2">
            {section.heading && (
              <p className="mb-1 mt-3 px-3 text-[10px] font-bold uppercase tracking-wider text-brand-muted">
                {section.heading}
              </p>
            )}
            {section.items.map((item) => {
              const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    active ? "bg-brand-pink text-white" : "text-brand-ink/80 hover:bg-brand-surface"
                  }`}
                >
                  <item.icon size={16} />
                  {item.label}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="border-t border-brand-border p-3">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-brand-muted hover:bg-brand-surface hover:text-brand-ink"
        >
          <LogOut size={16} /> Log Out
        </button>
      </div>
    </aside>
  );
}
