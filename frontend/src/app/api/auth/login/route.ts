import {NextRequest, NextResponse} from "next/server";
import UserLogin from "@/schemas/UserLogin";
import {serializeAccessToken} from "@/lib/auth/tokenManager";
import fillCookies from "@/lib/utils/fillCookies";
import {defaultApi} from "@/lib/api-client/createApiInstance";
import AuthService from "@/lib/services/AuthService";

/** Logs in a user and updates cookies */
export async function POST(req: NextRequest) {
    const data: UserLogin = await req.json();
    const authService = new AuthService(defaultApi);

    const { token, setCookieHeader } = await authService.login(data);
    const serializedToken = serializeAccessToken(token);

    const response = NextResponse.json({ success: true });
    fillCookies(response.headers, serializedToken, setCookieHeader);
    return response;
}