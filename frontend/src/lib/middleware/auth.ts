import { NextRequest, NextResponse } from "next/server";
import refreshMiddlewareSession from "@/lib/auth/refreshMiddlewareSession";

const publicRoutes = ['/login', '/register', '/forgot-password'];
const protectedRoutes = ['/dashboard'];

export async function authMiddleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;
    const accessToken = request.cookies.get('accessToken')?.value;
    const refreshToken = request.cookies.get('refresh_token')?.value;

    const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

    // Case 1: Already authenticated user trying to access public routes
    if (isPublicRoute && refreshToken) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Case 2: Unauthenticated user trying to access protected routes
    if (isProtectedRoute && !accessToken && !refreshToken) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Case 3: User with refresh token but no access token (needs refresh)
    if (!accessToken && refreshToken) {
        const response = NextResponse.next();
        try {
            await refreshMiddlewareSession(request.headers, response.cookies);
            return response;
        } catch (error) {
            console.error("Failed to refresh token:", error);
            if (isProtectedRoute) {
                return NextResponse.redirect(new URL('/login', request.url));
            }
        }
    }

    // All other cases proceed normally
    return NextResponse.next();
}

export const authMatchers = [
    "/login",
    "/dashboard/:path*"
];