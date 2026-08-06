"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, Menu, X, LayoutGrid } from "lucide-react";
import Logo from "./Logo";
import CurrencyDropdown from "./CurrencyDropdown";
import { navLinks } from "@/lib/data";

function DesktopDropdown({
  label,
  items,
}: {
  label: string;
  items: { label: string; href: string }[];
}) {
  return (
    <div className="group relative">
      <button className="flex items-center gap-1 text-sm font-medium text-brand-ink/80 hover:text-brand-ink py-2">
        {label}
        <ChevronDown size={16} className="transition-transform group-hover:rotate-180" />
      </button>
      <div className="invisible absolute left-1/2 top-full z-40 w-64 -translate-x-1/2 rounded-xl border border-brand-border bg-white p-2 opacity-0 shadow-xl transition-all duration-150 group-hover:visible group-hover:opacity-100">
        {items.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="block rounded-lg px-3 py-2 text-sm text-brand-ink/80 hover:bg-brand-surface hover:text-brand-ink"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

function MobileAccordion({
  label,
  items,
}: {
  label: string;
  items: { label: string; href: string }[];
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-brand-border py-1">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between py-3 text-left text-sm font-medium text-brand-ink"
      >
        {label}
        <ChevronDown size={16} className={open ? "rotate-180 transition-transform" : "transition-transform"} />
      </button>
      {open && (
        <div className="pb-2 pl-3">
          {items.map((item) => (
            <Link key={item.label} href={item.href} className="block py-2 text-sm text-brand-muted">
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Header({ user }: { user: { name: string } | null }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setMobileOpen(false);
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 border-b border-brand-border bg-[#f7f6f9]/95 backdrop-blur">
      <div className="container-page flex h-[72px] items-center justify-between gap-6">
        <Logo />

        <nav className="hidden items-center gap-7 lg:flex">
          <Link href="/courses" className="text-sm font-medium text-brand-ink/80 hover:text-brand-ink">
            Explore Courses
          </Link>
          <DesktopDropdown label="Growth" items={navLinks.growth} />
          <DesktopDropdown label="Resources" items={navLinks.resources} />
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <CurrencyDropdown />
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="flex items-center gap-2 rounded-full border border-brand-ink/15 px-5 py-2 text-sm font-semibold text-brand-ink hover:border-brand-ink/30"
              >
                <LayoutGrid size={15} />
                {user.name.split(" ")[0]}
              </Link>
              <button
                onClick={handleLogout}
                className="rounded-full bg-brand-pink px-5 py-2 text-sm font-semibold text-white shadow-sm shadow-brand-pink/30 hover:bg-brand-pink-dark"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-full border border-brand-ink/15 px-5 py-2 text-sm font-semibold text-brand-ink hover:border-brand-ink/30"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="rounded-full bg-brand-pink px-5 py-2 text-sm font-semibold text-white shadow-sm shadow-brand-pink/30 hover:bg-brand-pink-dark"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        <button
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-brand-ink/15 lg:hidden"
        >
          <Menu size={20} />
        </button>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-[85%] max-w-sm overflow-y-auto bg-white p-5 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <Logo />
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-brand-ink/15"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mb-4 flex justify-end">
              <CurrencyDropdown />
            </div>

            <Link
              href="/courses"
              onClick={() => setMobileOpen(false)}
              className="block border-b border-brand-border py-3 text-sm font-medium text-brand-ink"
            >
              Explore Courses
            </Link>
            <MobileAccordion label="Growth" items={navLinks.growth} />
            <MobileAccordion label="Resources" items={navLinks.resources} />

            <div className="mt-6 flex flex-col gap-3">
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-full border border-brand-ink/15 px-5 py-2.5 text-center text-sm font-semibold text-brand-ink"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="rounded-full bg-brand-pink px-5 py-2.5 text-center text-sm font-semibold text-white"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-full border border-brand-ink/15 px-5 py-2.5 text-center text-sm font-semibold text-brand-ink"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-full bg-brand-pink px-5 py-2.5 text-center text-sm font-semibold text-white"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
