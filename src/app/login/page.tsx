import { redirect } from "next/navigation";
import { getSessionUserId } from "@/lib/session";
import LoginForm from "./login-form";

export default async function LoginPage() {
  const userId = await getSessionUserId();

  // 🔒 If already logged in, never show login page
  if (userId) {
    redirect("/dashboard");
  }

  return <LoginForm />;
}
