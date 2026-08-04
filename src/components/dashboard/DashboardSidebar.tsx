"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutGrid, Search, MonitorPlay, Award, TrendingUp, Settings, LogOut } from "lucide-react";
import Logo from "@/components/layout/Logo";

const navItems = [
  { label: "Overview", href: "/dashboard", icon: LayoutGrid },
  { label: "Explore Courses", href: "/dashboard/explore", icon: Search },
  { label: "My Courses", href: "/dashboard/my-courses", icon: MonitorPlay },
  { label: "Certificates", href: "/dashboard/certificates", icon: Award },
  { label: "Growth", href: "/dashboard/growth", icon: TrendingUp },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col border-r border-brand-border bg-white">
      <div className="flex items-center px-5 py-5">
        <Logo />
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-4">
        {navItems.map((item) => {
          const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`mb-1 flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                active ? "bg-brand-pink text-white" : "text-brand-ink/80 hover:bg-brand-surface"
              }`}
            >
              <item.icon size={17} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-brand-border p-3">
        <p className="px-3 pb-1 pt-2 text-[10px] font-bold uppercase tracking-wider text-brand-muted">Settings</p>
        <Link
          href="/dashboard/settings"
          className={`mb-1 flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium ${
            pathname === "/dashboard/settings" ? "bg-brand-pink text-white" : "text-brand-ink/80 hover:bg-brand-surface"
          }`}
        >
          <Settings size={17} /> Settings
        </Link>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-brand-muted hover:bg-brand-surface hover:text-brand-ink"
        >
          <LogOut size={17} /> Logout
        </button>
      </div>
    </aside>
  );
}
