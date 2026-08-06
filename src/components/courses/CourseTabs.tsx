"use client";

import { useState } from "react";
import { CheckCircle2, Download, Rocket, ClipboardList } from "lucide-react";
import StarRating from "@/components/ui/StarRating";

const tabs = ["About", "Tools", "Review"] as const;

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="mt-3 space-y-2.5">
      {items.map((point) => (
        <li key={point} className="flex items-start gap-2 text-sm text-brand-muted">
          <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-brand-pink" /> {point}
        </li>
      ))}
    </ul>
  );
}

export default function CourseTabs({
  description,
  includes,
  keyPoints,
  advantages,
  requirements,
  reviews,
  tools,
}: {
  description: string;
  includes: string[];
  keyPoints: string[];
  advantages: string[];
  requirements: string[];
  modules?: { title: string; duration: string }[];
  reviews: { name: string; rating: number; date: string; text: string }[];
  tools: { name: string; plan: string }[];
}) {
  const [active, setActive] = useState<(typeof tabs)[number]>("About");

  return (
    <div className="rounded-2xl border border-brand-border bg-white p-6">
      <div className="flex gap-6 border-b border-brand-border">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`relative pb-3 text-sm font-medium ${
              active === tab ? "text-brand-pink" : "text-brand-muted hover:text-brand-ink"
            }`}
          >
            {tab === "Tools" ? "Tools & Requirements" : tab}
            {active === tab && <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-brand-pink" />}
          </button>
        ))}
      </div>

      {active === "About" && (
        <div className="pt-6">
          <h3 className="text-lg font-bold text-brand-ink">Description</h3>
          <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-brand-muted">{description}</p>

          {includes.length > 0 && (
            <>
              <h3 className="mt-6 flex items-center gap-2 text-lg font-bold text-brand-ink">
                <ClipboardList size={18} className="text-brand-pink" /> This Course Includes
              </h3>
              <BulletList items={includes} />
            </>
          )}

          {keyPoints.length > 0 && (
            <>
              <h3 className="mt-6 text-lg font-bold text-brand-ink">What You&apos;ll Learn</h3>
              <BulletList items={keyPoints} />
            </>
          )}

          {advantages.length > 0 && (
            <>
              <h3 className="mt-6 flex items-center gap-2 text-lg font-bold text-brand-ink">
                <Rocket size={18} className="text-brand-pink" /> Course Advantages
              </h3>
              <BulletList items={advantages} />
            </>
          )}
        </div>
      )}

      {active === "Tools" && (
        <div className="pt-6">
          {requirements.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-bold text-brand-ink">Requirements</h3>
              <BulletList items={requirements} />
            </div>
          )}

          {tools.length > 0 && (
            <div>
              {requirements.length > 0 && <h3 className="mb-3 text-lg font-bold text-brand-ink">Tools</h3>}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {tools.map((tool) => (
                  <div
                    key={tool.name}
                    className="flex items-center justify-between rounded-xl border border-brand-border p-4"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-surface text-sm font-bold text-brand-ink">
                        {tool.name.charAt(0)}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-brand-ink">{tool.name}</p>
                        <p className="text-xs text-brand-muted">{tool.plan}</p>
                      </div>
                    </div>
                    <button className="flex items-center gap-1 text-xs font-semibold text-brand-pink">
                      <Download size={13} /> Download
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {requirements.length === 0 && tools.length === 0 && (
            <p className="text-sm text-brand-muted">No tools or requirements listed for this course yet.</p>
          )}
        </div>
      )}

      {active === "Review" && (
        <div className="divide-y divide-brand-border pt-2">
          {reviews.map((review, i) => (
            <div key={i} className="py-5 first:pt-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-brand-ink">{review.name}</p>
                <span className="text-xs text-brand-muted">{review.date}</span>
              </div>
              <div className="mt-1">
                <StarRating rating={review.rating} />
              </div>
              <p className="mt-2 text-sm text-brand-muted">{review.text}</p>
            </div>
          ))}
          <button className="mt-4 w-full rounded-full border border-brand-border py-3 text-sm font-medium text-brand-ink hover:bg-brand-surface">
            See more review
          </button>
        </div>
      )}
    </div>
  );
}
