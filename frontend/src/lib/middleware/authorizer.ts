import { NextRequest, NextResponse } from "next/server";
import isTokenValid from "@/lib/auth/isTokenValid";
import getRefreshWithRedirectUrl from "@/lib/urls/getRefreshWithRedirectUrl";
import {getAccessTokenFromRequest} from "@/lib/auth/tokenManager";
import {checkIsProtectedRoute, checkIsPublicRoute} from "@/lib/middleware/routes";

/** Middleware to check if the user is authorized to access certain routes. */
export async function authorizerMiddleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    const { isAccessTokenValid, isRefreshTokenValid } = await areTokensValid(request);

    const isPublicRoute = checkIsPublicRoute(pathname);
    const isProtectedRoute = checkIsProtectedRoute(pathname);

    // Case 1: Already authenticated user trying to access public routes
    if (isPublicRoute && isRefreshTokenValid) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Case 2: Unauthenticated user trying to access protected routes
    if (isProtectedRoute && !isAccessTokenValid && !isRefreshTokenValid) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Case 3: User with refresh token but no access token (needs refresh)
    if (!isAccessTokenValid && isRefreshTokenValid) {
        return NextResponse.redirect(new URL(
            getRefreshWithRedirectUrl(pathname),
            request.url
        ));
    }

    // All other cases proceed normally
    return NextResponse.next();
}

const areTokensValid = async (request: NextRequest) => {
    const accessToken = getAccessTokenFromRequest(request);
    const refreshToken = request.cookies.get('refresh_token')?.value;

    return {
        isAccessTokenValid: accessToken ? await isTokenValid(accessToken) : false,
        isRefreshTokenValid: refreshToken ? await isTokenValid(refreshToken) : false
    }
}