"use server";

import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth";
import { createSession } from "@/lib/session";
import { redirect } from "next/navigation";

export type LoginState = {
  error?: string;
};

export async function login(
  prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  // 1️⃣ Find user by email
  const user = await prisma.user.findUnique({
    where: { email },
  });

  // 2️⃣ User must exist
  if (!user) {
    return { error: "Invalid email or password" };
  }

  // 3️⃣ Verify password
  const isValidPassword = await verifyPassword(password, user.password);

  // 4️⃣ Password must match
  if (!isValidPassword) {
    return { error: "Invalid email or password" };
  }

  // 5️⃣ Create session ONLY after validation
  await createSession(user.id);

  // 6️⃣ Redirect on success
  redirect("/dashboard");
}
