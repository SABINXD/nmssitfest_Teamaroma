import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY);


export async function middleware(req) {
    const token = req.cookies.get("token")?.value;
    const { pathname } = req.nextUrl;

    // 1️⃣ If user is logged in, prevent access to register/login
    if (token && (pathname === "/register" || pathname === "/login")) {
        try {
            await jwtVerify(token, secret);
            return NextResponse.redirect(new URL("/", req.url));
        } catch {
            // Invalid token → allow access to login/register
            return NextResponse.next();
        }
    }

    // 2️⃣ Protect dashboard routes
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

    // 3️⃣ Other routes → allow
    return NextResponse.next();
}

export const config = {
    matcher: ["/register", "/login", "/dashboard/:path*"],
};
