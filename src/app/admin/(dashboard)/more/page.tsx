"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight, LogOut } from "lucide-react";
import PageHeader from "../../components/PageHeader";
import { navSections } from "../../nav-config";

// The 4 tab-bar destinations (Dashboard, Students, Courses, Batches) live in the mobile tab
// bar itself — everything else in nav-config surfaces here, grouped exactly like the desktop
// sidebar so the two navigation surfaces never drift apart.
const TAB_BAR_HREFS = new Set(["/admin", "/admin/students", "/admin/courses", "/admin/batches"]);

export default function MorePage() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  const sections = navSections
    .map((section) => ({ ...section, items: section.items.filter((item) => !TAB_BAR_HREFS.has(item.href)) }))
    .filter((section) => section.items.length > 0);

  return (
    <div>
      <PageHeader title="More" subtitle="Everything else in the admin backend" />
      <div className="flex flex-col gap-6">
        {sections.map((section, i) => (
          <div key={i}>
            {section.heading && (
              <p className="mb-2 px-1 text-xs font-bold uppercase tracking-wider text-brand-muted">{section.heading}</p>
            )}
            <div className="overflow-hidden rounded-2xl border border-brand-border bg-brand-card">
              {section.items.map((item, idx) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3.5 active:bg-brand-surface ${
                    idx > 0 ? "border-t border-brand-border" : ""
                  }`}
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-pink/10 text-brand-pink">
                    <item.icon size={16} />
                  </span>
                  <span className="flex-1 text-sm font-medium text-brand-ink">{item.label}</span>
                  <ChevronRight size={16} className="shrink-0 text-brand-muted" />
                </Link>
              ))}
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 rounded-2xl border border-brand-border bg-brand-card px-4 py-3.5 text-sm font-semibold text-red-500 active:bg-brand-surface"
        >
          <LogOut size={16} /> Log Out
        </button>
      </div>
    </div>
  );
}
