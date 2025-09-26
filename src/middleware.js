// src/middleware.js
import { NextResponse } from "next/server";

export function middleware(req) {
     const role = req.cookies.get("role")?.value;
     const { pathname } = req.nextUrl;

     // Protect admin-only routes
     if (pathname.startsWith("/admin")) {
          if (role !== "admin") {
               return NextResponse.redirect(new URL("/main", req.url));
          }
     }

     return NextResponse.next();
}

// Configure which routes should trigger middleware
export const config = {
     matcher: [
          "/admin/:path*", // protect admin dashboard
     ],
};
