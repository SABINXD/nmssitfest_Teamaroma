

import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY);

export async function middleware(req) {
    const token = req.cookies.get("token")?.value;
    const { pathname } = req.nextUrl;


    const publicRoutes = ["/", "/login", "/register"];

    // 🔓 Public routes → only for non-logged-in users
    if (!token && pathname.startsWith("/admin")) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    if (publicRoutes.includes(pathname)) {
        if (token) {
            try {
                await jwtVerify(token, secret);
                return NextResponse.redirect(new URL("/dashboard", req.url));
            } catch {
                return NextResponse.next();
            }
        }
        return NextResponse.next();
    }

    // 🔒 Protected routes
    if (pathname.startsWith("/dashboard")) {
        if (!token) {
            return NextResponse.redirect(new URL("/login", req.url));
        }

        try {
            await jwtVerify(token, secret);
            return NextResponse.next();
        } catch {
            return NextResponse.redirect(new URL("/login", req.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/", "/login", "/register", "/admin/:path*", "/dashboard/:path*"],
};
