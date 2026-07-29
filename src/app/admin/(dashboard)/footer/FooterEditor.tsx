"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import RepeaterField from "../../components/RepeaterField";

type Link = { label: string; href: string };

export default function FooterEditor({
  discover: initDiscover,
  growth: initGrowth,
  more: initMore,
}: {
  discover: Link[];
  growth: Link[];
  more: Link[];
}) {
  const router = useRouter();
  const [discover, setDiscover] = useState(initDiscover);
  const [growth, setGrowth] = useState(initGrowth);
  const [more, setMore] = useState(initMore);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");

  async function handleSave() {
    setSaving(true);
    setStatus("");
    const links = [
      ...discover.map((l) => ({ ...l, column: "discover" })),
      ...growth.map((l) => ({ ...l, column: "growth" })),
      ...more.map((l) => ({ ...l, column: "more" })),
    ];
    const res = await fetch("/api/admin/footer-links", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ links }),
    });
    setSaving(false);
    if (!res.ok) {
      setStatus("Failed to save.");
      return;
    }
    setStatus("Saved!");
    router.refresh();
  }

  const fields = [
    { key: "label", label: "Link label" },
    { key: "href", label: "Link URL (e.g. /about)" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="rounded-2xl border border-brand-border bg-white p-5">
          <RepeaterField
            label='"Discover" column'
            items={discover as unknown as Record<string, string | boolean>[]}
            onChange={(items) => setDiscover(items as unknown as Link[])}
            fields={fields}
            emptyItem={{ label: "", href: "" }}
            addLabel="Add link"
          />
        </div>
        <div className="rounded-2xl border border-brand-border bg-white p-5">
          <RepeaterField
            label='"Growth" column'
            items={growth as unknown as Record<string, string | boolean>[]}
            onChange={(items) => setGrowth(items as unknown as Link[])}
            fields={fields}
            emptyItem={{ label: "", href: "" }}
            addLabel="Add link"
          />
        </div>
        <div className="rounded-2xl border border-brand-border bg-white p-5">
          <RepeaterField
            label='"More" column'
            items={more as unknown as Record<string, string | boolean>[]}
            onChange={(items) => setMore(items as unknown as Link[])}
            fields={fields}
            emptyItem={{ label: "", href: "" }}
            addLabel="Add link"
          />
        </div>
      </div>
      {status && <p className="text-sm font-medium text-brand-ink">{status}</p>}
      <div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-full bg-brand-pink px-6 py-3 text-sm font-semibold text-white hover:bg-brand-pink-dark disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Footer"}
        </button>
      </div>
    </div>
  );
}
