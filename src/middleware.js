// src/middleware.js
import { NextResponse } from "next/server";

export function middleware(req) {
     const role = req.cookies.get("role")?.value;
     const { pathname } = req.nextUrl;

     // Protect admin-only routes
     if (pathname.startsWith("/admin-dashboard")) {
          if (role !== "admin") {
               return NextResponse.redirect(new URL("/", req.url));
          }
     }

     return NextResponse.next();
}

// Configure which routes should trigger middleware
export const config = {
     matcher: [
          "/admin-dashboard/:path*", // protect admin dashboard
     ],
};
