import { Check, X } from "lucide-react";

type Plan = {
  name: string;
  tagline?: string;
  price: string;
  recommended: boolean;
  features: { label: string; included: boolean }[];
};

export default function PricingTable({ plans }: { plans: Plan[] }) {
  return (
    <section className="container-page py-10 sm:py-14">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative rounded-2xl border p-6 ${
              plan.recommended ? "border-brand-pink shadow-lg sm:-translate-y-3" : "border-brand-border"
            }`}
          >
            {plan.recommended && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-pink px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                Recommended
              </span>
            )}
            <h3 className="text-center text-lg font-bold uppercase tracking-wide text-brand-ink">{plan.name}</h3>
            {plan.tagline && <p className="text-center text-xs text-brand-muted">{plan.tagline}</p>}
            <p className="mt-3 text-center text-2xl font-bold text-brand-ink">{plan.price}</p>

            <ul className="mt-6 space-y-3">
              {plan.features.map((feature) => (
                <li key={feature.label} className="flex items-center gap-2 text-sm text-brand-ink/80">
                  {feature.included ? (
                    <Check size={16} className="shrink-0 text-emerald-500" />
                  ) : (
                    <X size={16} className="shrink-0 text-red-400" />
                  )}
                  {feature.label}
                </li>
              ))}
            </ul>

            <button
              className={`mt-6 w-full rounded-full py-3 text-sm font-semibold ${
                plan.recommended
                  ? "bg-brand-pink text-white hover:bg-brand-pink-dark"
                  : "border border-brand-ink/20 text-brand-ink hover:bg-brand-surface"
              }`}
            >
              Choose plan
            </button>
          </div>
        ))}
      </div>
      <p className="mt-8 text-center text-sm text-brand-muted">
        We accept all major payment methods, including Mastercard, Visa, Google Pay, and more.
      </p>
    </section>
  );
}
