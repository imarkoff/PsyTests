import TokenService from "@/lib/services/TokenService";
import {defaultApi} from "@/lib/api-client/createApiInstance";
import {NextResponse} from "next/server";
import {createAccessToken} from "@/lib/auth/tokenManager";

/**
 * Refreshes the access token for incoming requests (middleware).
 * @param headers
 * @param cookies
 */
export default async function refreshMiddlewareSession(headers: Headers, cookies: NextResponse["cookies"]) {
    const cookieHeader = headers.get("cookie") ?? "";
    const tokenService = new TokenService(defaultApi);
    const newToken = await tokenService.refreshToken(cookieHeader);

    cookies.set(createAccessToken(newToken));
}