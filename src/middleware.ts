import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("auth")?.value;

  if (isNothing(accessToken)) {
    return redirectTo("/auth/login", request);
  }

  NextResponse.next();
}

export const config = {
  matcher: ["/", "/admin/:path*"],
};

const isNothing = (value: any) => {
  return value === undefined || value === "undefined" || value === "";
};

const redirectTo = (url: string, request: NextRequest) =>
  NextResponse.redirect(new URL(url, request.url));
