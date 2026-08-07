"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutGrid, Search, MonitorPlay, Award, TrendingUp, MessageSquare, Settings, LogOut, Menu, X } from "lucide-react";
import Logo from "@/components/layout/Logo";

const navItems = [
  { label: "Overview", href: "/dashboard", icon: LayoutGrid },
  { label: "Explore Courses", href: "/dashboard/explore", icon: Search },
  { label: "My Courses", href: "/dashboard/my-courses", icon: MonitorPlay },
  { label: "Messages", href: "/dashboard/messages", icon: MessageSquare },
  { label: "Certificates", href: "/dashboard/certificates", icon: Award },
  { label: "Growth", href: "/dashboard/growth", icon: TrendingUp },
];

function SidebarNav({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <nav className="flex-1 overflow-y-auto px-3 pb-4">
      {navItems.map((item) => {
        const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
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
  );
}

function SidebarFooter({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    onNavigate?.();
    router.push("/");
    router.refresh();
  }

  return (
    <div className="border-t border-brand-border p-3">
      <p className="px-3 pb-1 pt-2 text-[10px] font-bold uppercase tracking-wider text-brand-muted">Settings</p>
      <Link
        href="/dashboard/settings"
        onClick={onNavigate}
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
  );
}

export default function DashboardSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between border-b border-brand-border bg-white px-4 py-3 lg:hidden">
        <Logo />
        <button
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-brand-ink/15"
        >
          <Menu size={20} />
        </button>
      </div>

      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-brand-border bg-white lg:flex">
        <div className="flex items-center px-5 py-5">
          <Logo />
        </div>
        <SidebarNav pathname={pathname} />
        <SidebarFooter pathname={pathname} />
      </aside>

      {mobileOpen &&
        createPortal(
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
            <div className="absolute left-0 top-0 flex h-full w-[80%] max-w-xs flex-col bg-white shadow-xl">
              <div className="flex items-center justify-between px-5 py-5">
                <Logo />
                <button
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-brand-ink/15"
                >
                  <X size={18} />
                </button>
              </div>
              <SidebarNav pathname={pathname} onNavigate={() => setMobileOpen(false)} />
              <SidebarFooter pathname={pathname} onNavigate={() => setMobileOpen(false)} />
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
