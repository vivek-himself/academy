import type { Metadata } from "next";
import SignupForm from "@/components/ui/SignupForm";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create your free Academy account to start learning.",
};

export default function SignupPage() {
  return <SignupForm />;
}
