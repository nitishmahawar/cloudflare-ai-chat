import { betterFetch } from "@better-fetch/fetch";
import type { Session } from "better-auth/types";
import { NextResponse, type NextRequest } from "next/server";

export default async function authMiddleware(request: NextRequest) {
  const { data: session } = await betterFetch<Session>(
    "/api/auth/get-session",
    {
      baseURL: process.env.NEXT_PUBLIC_API_URL!,
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
    }
  );

  const isAuthRoute = request.nextUrl.pathname.startsWith("/login");

  // Redirect logged in users away from auth routes
  if (session && isAuthRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Redirect non-logged in users to sign in
  if (!session && !isAuthRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all paths except static files
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
