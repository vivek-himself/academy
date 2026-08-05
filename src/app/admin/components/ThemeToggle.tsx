"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

const STORAGE_KEY = "academy_admin_theme";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  // Reflects the attribute the no-flash inline script already set before hydration.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setIsDark(document.documentElement.getAttribute("data-theme") === "dark");
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  function toggle() {
    const next = !isDark;
    setIsDark(next);
    if (next) {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem(STORAGE_KEY, "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
      localStorage.setItem(STORAGE_KEY, "light");
    }
  }

  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-semibold text-brand-ink">Dark Mode</p>
        <p className="text-xs text-brand-muted">Switch the admin backend between light and dark appearance.</p>
      </div>
      <button
        type="button"
        onClick={toggle}
        role="switch"
        aria-checked={isDark}
        aria-label="Toggle dark mode"
        className={`relative flex h-8 w-14 shrink-0 items-center rounded-full px-1 transition-colors ${
          isDark ? "bg-brand-pink" : "bg-brand-border"
        }`}
      >
        <span
          className={`flex h-6 w-6 items-center justify-center rounded-full bg-brand-card text-brand-ink shadow transition-transform ${
            isDark ? "translate-x-6" : "translate-x-0"
          }`}
        >
          {isDark ? <Moon size={13} /> : <Sun size={13} />}
        </span>
      </button>
    </div>
  );
}
