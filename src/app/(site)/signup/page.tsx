import type { Metadata } from "next";
import SignupForm from "@/components/ui/SignupForm";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create your free Academy account to start learning.",
};

export default function SignupPage() {
  return (
    <section className="container-page py-16 text-center">
      <h1 className="text-2xl font-bold text-brand-ink sm:text-3xl">Sign up for free to see our courses</h1>
      <div className="mt-8">
        <SignupForm />
      </div>
    </section>
  );
}
