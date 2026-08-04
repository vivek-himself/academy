import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Student accounts are launching soon. Get in touch to be notified.",
};

export default function SignupPage() {
  return (
    <section className="container-page py-20 text-center">
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-pink/10 text-brand-pink">
        <Sparkles size={22} />
      </span>
      <h1 className="mt-4 text-2xl font-bold text-brand-ink sm:text-3xl">Accounts Are Launching Soon</h1>
      <p className="mx-auto mt-3 max-w-md text-sm text-brand-muted">
        We&apos;re putting the finishing touches on student sign-up. In the meantime, browse our courses or get in
        touch and we&apos;ll help you get enrolled directly.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/courses"
          className="rounded-full bg-brand-pink px-6 py-3 text-sm font-semibold text-white hover:bg-brand-pink-dark"
        >
          Explore Courses
        </Link>
        <Link
          href="/contact"
          className="rounded-full border border-brand-border px-6 py-3 text-sm font-semibold text-brand-ink hover:bg-brand-surface"
        >
          Get in Touch
        </Link>
      </div>
    </section>
  );
}
