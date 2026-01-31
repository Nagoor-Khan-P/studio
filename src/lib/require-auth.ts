import { redirect } from "next/navigation";
import { getSessionUserId } from "@/lib/session";

/**
 * Ensures the user is authenticated.
 * Redirects to /login if not logged in.
 */
export async function requireAuth(): Promise<string> {
  const userId = await getSessionUserId();

  if (!userId) {
    redirect("/login");
  }

  return userId;
}
