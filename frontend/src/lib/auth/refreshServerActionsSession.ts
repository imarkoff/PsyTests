"use server";

import { cookies } from "next/headers";
import TokenService from "@/lib/services/TokenService";
import { defaultApi } from "@/lib/api-client/createApiInstance";
import { headers } from "next/headers";

/**
 * Refreshes the access token for Server Actions.
 * Calling this function in middleware will throw an error.
 */
export default async function refreshServerActionsSession() {
    const cookieHeader = (await headers()).get("cookie") ?? "";
    const tokenService = new TokenService(defaultApi);
    const newToken = await tokenService.refreshToken(cookieHeader);

    const cookieStore = await cookies();
    cookieStore.set("accessToken", newToken, {
        httpOnly: true,
        maxAge: 60 * 15,
        path: "/",
        sameSite: "lax"
    });

    return newToken;
}