import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { cookies } from "next/headers";
import { prisma } from "../lib/prisma";

const secretKey = new TextEncoder().encode(
  process.env.JWT_SECRET_KEY || 'dev_secret'
);

type UserRole = 'admin' | 'staff' | 'student';

type LoginState = {
  error?: string;
  redirectTo?: string;
};

export async function LoginAction(
  prevState: LoginState,
  formData: FormData
): Promise<LoginState> {

  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const role = String(formData.get("role") || "") as UserRole;

  if (!email || !password || !role) {
    return { error: "Please fill in all fields" };
  }

  // Fetch user
  const user = await prisma.user.findFirst({
    where: { email, role }
  });

  if (!user) {
    return { error: "Invalid credentials" };
  }

  // Check password
  const isValid = await bcrypt.compare(password, user.passwordHash);
  
  if (!isValid) {
    return { error: "Invalid credentials" };
  }

  // Create JWT
  const token = await new SignJWT({
    userId: user.id,
    role: user.role
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(secretKey);

  // Set cookie
  (await
    // Set cookie
    cookies()).set("auth-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  // Redirect based on role
  const redirectTo =
    user.role === "admin"
      ? "/admin"
      : user.role === "staff"
      ? "/faculty"
      : "/student";

  return { redirectTo };
}
