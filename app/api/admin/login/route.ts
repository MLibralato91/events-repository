import { NextRequest, NextResponse } from "next/server";
import { createSessionToken, safeCompare } from "@/lib/admin-auth";

export async function POST(req: NextRequest) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return NextResponse.json(
      { error: "ADMIN_PASSWORD non configurata sul server" },
      { status: 500 }
    );
  }

  const { password } = await req.json().catch(() => ({ password: "" }));

  const valid = await safeCompare(String(password ?? ""), adminPassword);
  if (!valid) {
    return NextResponse.json({ error: "Password errata" }, { status: 401 });
  }

  const token = await createSessionToken(adminPassword);
  const res = NextResponse.json({ ok: true });
  res.cookies.set("admin_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
