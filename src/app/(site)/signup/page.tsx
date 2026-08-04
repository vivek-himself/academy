import type { Metadata } from "next";
import { Sparkles } from "lucide-react";
import SignupForm from "@/components/ui/SignupForm";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create your free Academy account to start learning.",
};

export default function SignupPage() {
  return (
    <section className="container-page py-20 text-center">
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-pink/10 text-brand-pink">
        <Sparkles size={22} />
      </span>
      <h1 className="mt-4 text-2xl font-bold text-brand-ink sm:text-3xl">Create Your Account</h1>
      <p className="mx-auto mt-3 max-w-md text-sm text-brand-muted">
        Sign up to track your progress and pick up any course, any time.
      </p>
      <div className="mt-8">
        <SignupForm />
      </div>
    </section>
  );
}
