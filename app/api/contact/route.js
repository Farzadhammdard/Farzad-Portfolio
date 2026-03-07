import { NextResponse } from "next/server";
import { getContactEmailConfigStatus, sendContactEmail } from "@/api/contact/send-contact-email";

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request) {
  try {
    const body = await request.json();
    const name = body?.name?.trim();
    const email = body?.email?.trim();
    const message = body?.message?.trim();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    if (!validateEmail(email)) {
      return NextResponse.json({ error: "Invalid email." }, { status: 400 });
    }

    const result = await sendContactEmail({ name, email, message });

    if (!result.sent) {
      const config = getContactEmailConfigStatus();
      return NextResponse.json(
        {
          error: "Email service is not configured. Set RESEND_API_KEY in your environment variables.",
          config
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[contact] failed", error);
    return NextResponse.json({ error: "Failed to process contact request." }, { status: 500 });
  }
}
