import { NextResponse } from "next/server";
import {
  adminSessionCookie,
  adminSessionMaxAgeSeconds,
  createAdminSessionToken
} from "@/api/admin/auth";
import { verifyAdminCredentials } from "@/api/admin/store";

export async function POST(request) {
  try {
    const body = await request.json();
    const username = body?.username?.trim().toLowerCase();
    const password = body?.password?.trim();

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password are required." }, { status: 400 });
    }

    const isValid = await verifyAdminCredentials(username, password);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid username or password." }, { status: 401 });
    }

    const response = NextResponse.json({ ok: true });
    response.cookies.set({
      name: adminSessionCookie,
      value: createAdminSessionToken(username),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: adminSessionMaxAgeSeconds
    });

    return response;
  } catch (error) {
    console.error("[admin/login] failed", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
