"use client";

import { useEffect, useRef, useState } from "react";
import { ListTree, ChevronDown } from "lucide-react";

export type JumpGroup = { heading: string; items: { id: string; label: string }[] };

/** A sticky "jump to section" dropdown for long single-page admin forms, grouped by topic. */
export default function SectionJumpMenu({ groups }: { groups: JumpGroup[] }) {
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const ids = groups.flatMap((g) => g.items.map((i) => i.id));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-96px 0px -70% 0px" }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [groups]);

  function jumpTo(id: string) {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const activeLabel = groups.flatMap((g) => g.items).find((i) => i.id === activeId)?.label;

  return (
    <div ref={wrapperRef} className="sticky top-4 z-20 mb-6 flex justify-end">
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-2 rounded-full border border-brand-border bg-white px-4 py-2.5 text-sm font-semibold text-brand-ink shadow-sm hover:border-brand-pink hover:text-brand-pink"
        >
          <ListTree size={15} />
          {activeLabel ? `Section: ${activeLabel}` : "Jump to Section"}
          <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
        {open && (
          <div className="absolute right-0 top-full mt-2 w-72 overflow-hidden rounded-xl border border-brand-border bg-white p-1.5 shadow-lg">
            {groups.map((group) => (
              <div key={group.heading} className="mb-1 last:mb-0">
                <p className="px-2.5 pb-1 pt-2 text-[10px] font-bold uppercase tracking-wider text-brand-muted">
                  {group.heading}
                </p>
                {group.items.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => jumpTo(item.id)}
                    className={`block w-full rounded-lg px-2.5 py-2 text-left text-sm transition-colors ${
                      activeId === item.id ? "bg-brand-pink/10 font-semibold text-brand-pink" : "text-brand-ink hover:bg-brand-surface"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
