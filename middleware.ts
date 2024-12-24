import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  user_id: number;
  exp: number;
  role: string;
  mfa_verified?: boolean;
}

export function middleware(request: NextRequest) {
  // Get access_token from cookies
  const accessToken = request.cookies.get("access_token");
  console.log("Access Token in middleware:", accessToken?.value);

  // Define auth and public pages
  const isAuthPage =
    request.nextUrl.pathname.startsWith("/login") ||
    request.nextUrl.pathname.startsWith("/register");
  const isMFAPage = request.nextUrl.pathname.startsWith("/verify-mfa");

  // If no access token and trying to access protected route
  if (!accessToken && !isAuthPage && !isMFAPage) {
    console.log("No access token - redirecting to login");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If has access token
  if (accessToken?.value) {
    try {
      const decoded = jwtDecode<DecodedToken>(accessToken.value);
      console.log("Decoded token:", decoded);

      // Check token expiration
      if (decoded.exp * 1000 < Date.now()) {
        console.log("Token expired");
        return NextResponse.redirect(new URL("/login", request.url));
      }

      // If authenticated user tries to access auth pages
      if (isAuthPage) {
        console.log(
          "Authenticated user accessing auth page - redirecting to dashboard"
        );
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }

      // Check admin routes
      if (
        request.nextUrl.pathname.startsWith("/admin") &&
        decoded.role !== "admin"
      ) {
        console.log("Non-admin accessing admin route");
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    } catch (error) {
      console.error("Token decode error:", error);
      // Invalid token - clear it and redirect to login
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Allow the request to proceed
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/login",
    "/register",
    "/verify-mfa",
  ],
};
