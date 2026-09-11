import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/admin-auth";

export async function middleware(req: NextRequest) {
  if (req.nextUrl.pathname === "/admin/login") {
    return NextResponse.next();
  }

  const secret = process.env.ADMIN_PASSWORD;
  const token = req.cookies.get("admin_session")?.value;
  const valid = !!secret && (await verifySessionToken(token, secret));

  if (!valid) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/admin/login";
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
