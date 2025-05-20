import {NextRequest, NextResponse} from "next/server";
import {authorizerMiddleware} from "@/lib/middleware/authorizer";
import { authenticatorMiddleware } from "./lib/middleware/authenticator";
import {checkIsProtectedRoute, checkIsPublicRoute} from "@/lib/middleware/routes";

export async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;
    const isPublicRoute = checkIsPublicRoute(pathname);
    const isProtectedRoute = checkIsProtectedRoute(pathname);

    // Skip authorizer middleware for non-public and non-protected routes
    if ((!isPublicRoute && !isProtectedRoute) || request.method !== "GET") {
        return NextResponse.next();
    }

    const authorizerResult = await authorizerMiddleware(request);

    if (authorizerResult.status !== 200) return authorizerResult;

    // Only run authenticator on protected routes (role-based access control)
    if (isProtectedRoute) return authenticatorMiddleware(request);

    // For all other paths, return the authorizer result
    return authorizerResult;
}

export const config = {
    matcher: [
        "/login",
        "/dashboard/:path*"
    ]
}