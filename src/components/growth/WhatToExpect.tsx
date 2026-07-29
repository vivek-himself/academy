"use client";

import { useState } from "react";
import Image from "next/image";
import type { GrowthPageView } from "@/lib/mappers";

export default function WhatToExpect({ page }: { page: GrowthPageView }) {
  const [active, setActive] = useState(0);

  return (
    <section className="container-page grid grid-cols-1 gap-8 py-10 sm:py-14 lg:grid-cols-2 lg:items-center">
      <div>
        <h2 className="text-2xl font-bold text-brand-ink sm:text-3xl">What to expect</h2>
        <p className="mt-3 max-w-lg text-sm text-brand-muted">{page.expectParagraph}</p>
        <p className="mt-4 text-sm text-brand-muted">
          To know about what to expect for each day, click or tap the below:
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {page.dayTabs.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActive(i)}
              className={`rounded-full border px-4 py-2 text-xs font-medium ${
                active === i
                  ? "border-brand-pink bg-brand-pink/10 text-brand-pink"
                  : "border-brand-border text-brand-ink hover:border-brand-pink/40"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <button className="mt-6 rounded-full bg-brand-pink px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-white hover:bg-brand-pink-dark">
          {page.ctaLabel}
        </button>
      </div>
      <div className="relative mx-auto aspect-square w-full max-w-sm overflow-hidden rounded-2xl bg-brand-surface">
        <Image
          src={page.expectImageDesktopUrl || "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=700&q=80"}
          alt="What to expect"
          fill
          className="object-cover"
        />
      </div>
    </section>
  );
}
