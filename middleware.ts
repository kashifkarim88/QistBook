import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

// Encoded once at module initialization
const SECRET_KEY = new TextEncoder().encode(
    process.env.JWT_SECRET || "fallback-secret-key-change-this"
);

export async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname;
    const token = req.cookies.get("qistbook_session")?.value;

    // Fast-path: Check cookie presence first
    const hasToken = Boolean(token);

    // 1. Root route handling
    if (path === "/") {
        let isValid = false;
        if (hasToken) {
            try {
                await jwtVerify(token!, SECRET_KEY);
                isValid = true;
            } catch {
                isValid = false;
            }
        }
        return NextResponse.redirect(
            new URL(isValid ? "/dashboard" : "/login", req.url)
        );
    }

    // 2. Protect /dashboard routes
    if (path.startsWith("/dashboard")) {
        // Instant check: If no token cookie exists, reject immediately without CPU cryptography
        if (!hasToken) {
            return NextResponse.redirect(new URL("/login", req.url));
        }

        // Token exists — allow fast passage. 
        // Full signature validation happens on sensitive API/Server Action calls.
        return NextResponse.next();
    }

    // 3. Prevent logged-in users from accessing /login page
    if (path === "/login") {
        if (hasToken) {
            try {
                await jwtVerify(token!, SECRET_KEY);
                return NextResponse.redirect(new URL("/dashboard", req.url));
            } catch {
                // Invalid token, allow access to login
                return NextResponse.next();
            }
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match root, login, and dashboard routes.
         * Explicitly ignore Next.js internals, static assets, and images.
         */
        "/",
        "/login",
        "/dashboard/:path*",
    ],
};