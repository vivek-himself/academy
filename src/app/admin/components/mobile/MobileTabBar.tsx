"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, BookOpen, Layers, MoreHorizontal } from "lucide-react";

const TABS = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard, exact: true },
  { label: "Students", href: "/admin/students", icon: Users, exact: false },
  { label: "Courses", href: "/admin/courses", icon: BookOpen, exact: false },
  { label: "Batches", href: "/admin/batches", icon: Layers, exact: false },
];

// iOS caps a native tab bar around 5 destinations — the 25 admin routes can't all fit, so the
// 4 highest-traffic sections get their own tab and everything else lives behind "More".
export default function MobileTabBar() {
  const pathname = usePathname();
  const activeTab = TABS.find((t) => (t.exact ? pathname === t.href : pathname.startsWith(t.href)));
  const moreActive = !activeTab;

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 flex items-stretch border-t border-brand-border bg-brand-card/85 backdrop-blur-xl lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {TABS.map((tab) => {
        const active = activeTab === tab;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex flex-1 flex-col items-center gap-1 py-2.5 text-[10px] font-medium ${
              active ? "text-brand-pink" : "text-brand-muted"
            }`}
          >
            <tab.icon size={22} strokeWidth={active ? 2.4 : 2} />
            {tab.label}
          </Link>
        );
      })}
      <Link
        href="/admin/more"
        className={`flex flex-1 flex-col items-center gap-1 py-2.5 text-[10px] font-medium ${
          moreActive ? "text-brand-pink" : "text-brand-muted"
        }`}
      >
        <MoreHorizontal size={22} strokeWidth={moreActive ? 2.4 : 2} />
        More
      </Link>
    </nav>
  );
}
