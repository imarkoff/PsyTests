import {clearAccessToken} from "@/lib/auth/tokenManager";
import {NextResponse} from "next/server";
import fillCookies from "@/lib/utils/fillCookies";
import { defaultApi } from "@/lib/api-client/createApiInstance";
import AuthService from "@/lib/services/AuthService";

/** Logs out a user and clears cookies */
export async function POST() {
    const authService = new AuthService(defaultApi);
    const { setCookieHeader } = await authService.logout();
    const clearedCookie = clearAccessToken();

    const response = NextResponse.json({ success: true });
    fillCookies(response.headers, clearedCookie, setCookieHeader);
    return response;
}