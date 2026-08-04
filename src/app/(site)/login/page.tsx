import type { Metadata } from "next";
import { LogIn } from "lucide-react";
import LoginForm from "@/components/ui/LoginForm";

export const metadata: Metadata = {
  title: "Login",
  description: "Log in to your Academy account to continue learning.",
};

export default function LoginPage() {
  return (
    <section className="container-page py-20 text-center">
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-pink/10 text-brand-pink">
        <LogIn size={22} />
      </span>
      <h1 className="mt-4 text-2xl font-bold text-brand-ink sm:text-3xl">Welcome Back</h1>
      <p className="mx-auto mt-3 max-w-md text-sm text-brand-muted">Log in to pick up where you left off.</p>
      <div className="mt-8">
        <LoginForm />
      </div>
    </section>
  );
}
