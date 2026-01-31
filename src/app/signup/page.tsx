import { redirect } from "next/navigation";
import { getSessionUserId } from "@/lib/session";
import SignupForm from "./signup-form";

export default async function SignupPage() {
  const userId = await getSessionUserId();

  // 🔒 If already logged in → dashboard
  if (userId) {
    redirect("/dashboard");
  }

  return <SignupForm />;
}
