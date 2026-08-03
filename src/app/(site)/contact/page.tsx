import type { Metadata } from "next";
import Link from "next/link";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Get in Touch — Academy",
};

const details = [
  { icon: Mail, label: "Email", value: "academy@nigelquadros.com", href: "mailto:academy@nigelquadros.com" },
  { icon: Phone, label: "Phone", value: "+91 96650 64435", href: "tel:+919665064435" },
  { icon: MapPin, label: "Address", value: "Worldwide" },
];

export default function ContactPage() {
  return (
    <section className="container-page py-12 sm:py-16">
      <SectionHeading
        title="Get in Touch"
        description="Have questions? We're here to help. Reach out to us, and we'll get back to you at the earliest."
      />

      <div className="mx-auto mt-12 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
        {details.map(({ icon: Icon, label, value, href }) => (
          <div key={label} className="rounded-xl border border-brand-border p-5 text-center">
            <span className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-brand-purple/10 text-brand-purple">
              <Icon size={18} />
            </span>
            <p className="mt-3 text-xs text-brand-muted">{label}</p>
            {href ? (
              <a href={href} className="mt-0.5 block text-sm font-semibold text-brand-ink hover:text-brand-pink">
                {value}
              </a>
            ) : (
              <p className="mt-0.5 text-sm font-semibold text-brand-ink">{value}</p>
            )}
          </div>
        ))}
      </div>

      <div className="mx-auto mt-10 max-w-3xl rounded-xl border border-brand-border p-5">
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-brand-purple" />
          <p className="text-sm font-semibold text-brand-ink">Business Hours</p>
        </div>
        <p className="mt-2 text-sm text-brand-muted">Monday to Friday: 8:30 AM - 6:00 PM IST</p>
        <p className="text-sm text-brand-muted">Saturday & Sunday: 8:30 AM - 5:00 PM IST</p>
      </div>

      <p className="mx-auto mt-10 max-w-3xl text-center text-sm text-brand-muted">
        Have a quick question first? Check our{" "}
        <Link href="/faq" className="font-semibold text-brand-pink hover:underline">
          FAQ&apos;s
        </Link>
        .
      </p>
    </section>
  );
}
