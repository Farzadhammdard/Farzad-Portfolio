import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/api/admin/auth";
import { addAdminUser, listAdminUsernames } from "@/api/admin/store";

function unauthorizedResponse() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function GET() {
  if (!isAdminAuthenticated()) {
    return unauthorizedResponse();
  }

  try {
    const usernames = await listAdminUsernames();
    return NextResponse.json({ users: usernames });
  } catch (error) {
    console.error("[admin/users] get failed", error);
    return NextResponse.json({ error: "Failed to load users." }, { status: 500 });
  }
}

export async function POST(request) {
  if (!isAdminAuthenticated()) {
    return unauthorizedResponse();
  }

  try {
    const body = await request.json();
    const username = body?.username?.trim().toLowerCase();
    const password = body?.password?.trim();

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password are required." }, { status: 400 });
    }

    const users = await addAdminUser(username, password);
    return NextResponse.json({ users });
  } catch (error) {
    if (error && error.code === "EROFS") {
      return NextResponse.json(
        { error: "Cannot save admin users on Vercel read-only filesystem. Use external storage." },
        { status: 500 }
      );
    }
    const message = error instanceof Error ? error.message : "Failed to create admin user.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
