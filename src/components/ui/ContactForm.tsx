"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function ContactForm() {
  const [values, setValues] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  function set(field: keyof typeof values, v: string) {
    setValues((prev) => ({ ...prev, [field]: v }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error();
      setStatus("sent");
      setValues({ name: "", email: "", subject: "", message: "" });
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="mx-auto mt-10 max-w-3xl rounded-xl border border-brand-border bg-brand-surface p-6 text-center">
        <p className="text-sm font-semibold text-brand-ink">Thanks — your message has been sent.</p>
        <p className="mt-1 text-sm text-brand-muted">We&apos;ll get back to you at the earliest.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto mt-10 max-w-3xl rounded-xl border border-brand-border p-6">
      <p className="text-sm font-semibold text-brand-ink">Send Us a Message</p>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <input
          required
          value={values.name}
          onChange={(e) => set("name", e.target.value)}
          placeholder="Your Name"
          className="rounded-lg border border-brand-border px-3 py-2.5 text-sm outline-none focus:border-brand-pink"
        />
        <input
          required
          type="email"
          value={values.email}
          onChange={(e) => set("email", e.target.value)}
          placeholder="Email Address"
          className="rounded-lg border border-brand-border px-3 py-2.5 text-sm outline-none focus:border-brand-pink"
        />
      </div>
      <input
        value={values.subject}
        onChange={(e) => set("subject", e.target.value)}
        placeholder="Subject"
        className="mt-4 w-full rounded-lg border border-brand-border px-3 py-2.5 text-sm outline-none focus:border-brand-pink"
      />
      <textarea
        required
        rows={4}
        value={values.message}
        onChange={(e) => set("message", e.target.value)}
        placeholder="Your Message"
        className="mt-4 w-full rounded-lg border border-brand-border px-3 py-2.5 text-sm outline-none focus:border-brand-pink"
      />
      {status === "error" && <p className="mt-2 text-xs font-medium text-red-500">Something went wrong. Please try again.</p>}
      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-4 flex items-center gap-2 rounded-full bg-brand-pink px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-pink-dark disabled:opacity-60"
      >
        {status === "sending" && <Loader2 size={14} className="animate-spin" />}
        {status === "sending" ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
