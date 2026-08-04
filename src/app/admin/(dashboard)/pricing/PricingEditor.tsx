"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TextField, CheckboxField } from "../../components/FormField";
import RepeaterField from "../../components/RepeaterField";
import SaveBar from "../../components/SaveBar";
import { safeJsonParse } from "@/lib/json";

type Plan = { name: string; tagline: string; price: string; recommended: boolean; featuresJson: string };

export default function PricingEditor({ initialPlans }: { initialPlans: Plan[] }) {
  const router = useRouter();
  const [plans, setPlans] = useState(initialPlans);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");

  function updatePlan(i: number, patch: Partial<Plan>) {
    setPlans((prev) => prev.map((p, idx) => (idx === i ? { ...p, ...patch } : p)));
  }

  async function handleSave() {
    setSaving(true);
    setStatus("");
    const res = await fetch("/api/admin/pricing-plans", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plans }),
    });
    setSaving(false);
    if (!res.ok) {
      setStatus("Failed to save.");
      return;
    }
    setStatus("Saved!");
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {plans.map((plan, i) => {
          const features = safeJsonParse<{ label: string; included: boolean }[]>(plan.featuresJson, []);
          return (
            <div key={i} className="rounded-2xl border border-brand-border bg-white p-5">
              <div className="flex flex-col gap-4">
                <TextField label="Plan Name" maxLength={30} value={plan.name} onChange={(v) => updatePlan(i, { name: v })} />
                <TextField label="Tagline (optional)" maxLength={40} value={plan.tagline} onChange={(v) => updatePlan(i, { tagline: v })} />
                <TextField label="Price (display text)" value={plan.price} onChange={(v) => updatePlan(i, { price: v })} />
                <CheckboxField
                  label="Recommended"
                  description="Highlights this plan with a badge and border."
                  checked={plan.recommended}
                  onChange={(v) => updatePlan(i, { recommended: v })}
                />
                <RepeaterField
                  label="Features"
                  items={features as unknown as Record<string, string | boolean>[]}
                  onChange={(items) => updatePlan(i, { featuresJson: JSON.stringify(items) })}
                  fields={[
                    { key: "label", label: "Feature label" },
                    { key: "included", label: "Included", type: "checkbox" },
                  ]}
                  emptyItem={{ label: "", included: true }}
                  addLabel="Add feature"
                />
              </div>
            </div>
          );
        })}
      </div>

      <SaveBar onSave={handleSave} saving={saving} status={status} label="Save Pricing Plans" />
    </div>
  );
}
