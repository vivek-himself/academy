"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import RepeaterField from "../../components/RepeaterField";
import ImageUploadField from "../../components/ImageUploadField";
import SaveBar from "../../components/SaveBar";

type Link = { label: string; href: string };
type PaymentMethod = { label: string; imageUrl: string };
const EMPTY_PAYMENT_METHOD: PaymentMethod = { label: "", imageUrl: "" };

export default function FooterEditor({
  discover: initDiscover,
  growth: initGrowth,
  more: initMore,
  paymentMethods: initPaymentMethods,
}: {
  discover: Link[];
  growth: Link[];
  more: Link[];
  paymentMethods: PaymentMethod[];
}) {
  const router = useRouter();
  const [discover, setDiscover] = useState(initDiscover);
  const [growth, setGrowth] = useState(initGrowth);
  const [more, setMore] = useState(initMore);
  const [paymentMethods, setPaymentMethods] = useState(initPaymentMethods);
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
      body: JSON.stringify({ links, paymentMethods }),
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
        <div className="rounded-2xl border border-brand-border bg-brand-card p-5">
          <RepeaterField
            label='"Discover" column'
            items={discover as unknown as Record<string, string | boolean>[]}
            onChange={(items) => setDiscover(items as unknown as Link[])}
            fields={fields}
            emptyItem={{ label: "", href: "" }}
            addLabel="Add link"
          />
        </div>
        <div className="rounded-2xl border border-brand-border bg-brand-card p-5">
          <RepeaterField
            label='"Growth" column'
            items={growth as unknown as Record<string, string | boolean>[]}
            onChange={(items) => setGrowth(items as unknown as Link[])}
            fields={fields}
            emptyItem={{ label: "", href: "" }}
            addLabel="Add link"
          />
        </div>
        <div className="rounded-2xl border border-brand-border bg-brand-card p-5">
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

      <div className="rounded-2xl border border-brand-border bg-brand-card p-5">
        <p className="mb-1.5 text-sm font-semibold text-brand-ink">Payment Methods</p>
        <p className="mb-4 text-xs text-brand-muted">
          The payment icon row shown under the logo in the footer. Upload a small logo image for each one (e.g. Visa,
          Mastercard, Amex, GPay, Paytm).
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {paymentMethods.map((pm, i) => (
            <div key={i} className="rounded-xl border border-brand-border p-3">
              <div className="mb-2 flex items-center justify-between">
                <input
                  value={pm.label}
                  onChange={(e) =>
                    setPaymentMethods(paymentMethods.map((p, idx) => (idx === i ? { ...p, label: e.target.value } : p)))
                  }
                  placeholder="Label (e.g. Visa)"
                  className="w-full rounded-lg border border-brand-border px-2.5 py-1.5 text-sm outline-none focus:border-brand-pink"
                />
                <button
                  type="button"
                  onClick={() => setPaymentMethods(paymentMethods.filter((_, idx) => idx !== i))}
                  aria-label="Remove"
                  className="ml-2 shrink-0 text-red-500 hover:text-red-600"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <ImageUploadField
                label=""
                desktopValue={pm.imageUrl}
                onDesktopChange={(v) =>
                  setPaymentMethods(paymentMethods.map((p, idx) => (idx === i ? { ...p, imageUrl: v } : p)))
                }
                desktopSize="120 × 76px"
              />
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setPaymentMethods([...paymentMethods, EMPTY_PAYMENT_METHOD])}
          className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-brand-pink hover:underline"
        >
          <Plus size={13} /> Add payment method
        </button>
      </div>

      <SaveBar onSave={handleSave} saving={saving} status={status} label="Save Footer" />
    </div>
  );
}
