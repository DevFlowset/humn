import { NextResponse } from "next/server";

export const runtime = "nodejs";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(req: Request) {
  let email = "";
  try {
    const body = (await req.json()) as { email?: unknown };
    email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }
  if (!email || email.length > 254 || !EMAIL.test(email)) {
    return NextResponse.json({ ok: false, error: "Enter a valid email." }, { status: 400 });
  }

  const hook = process.env.WAITLIST_WEBHOOK_URL;
  if (hook) {
    try {
      const res = await fetch(hook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "humn-site", at: new Date().toISOString() }),
      });
      if (!res.ok) throw new Error(`webhook ${res.status}`);
    } catch (err) {
      console.error("[waitlist] webhook failed", err);
      return NextResponse.json({ ok: false, error: "Could not save. Try again." }, { status: 502 });
    }
  } else {
    // No provider configured yet: visible in Vercel runtime logs only.
    console.log("[waitlist] signup", email);
  }
  return NextResponse.json({ ok: true });
}
