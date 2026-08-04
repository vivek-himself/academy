import type { Metadata } from "next";
import LoginForm from "@/components/ui/LoginForm";

export const metadata: Metadata = {
  title: "Login",
  description: "Log in to your Academy account to continue learning.",
};

export default function LoginPage() {
  return <LoginForm />;
}
