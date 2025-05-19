"use server";

import {fetchPublic} from "@/lib/fetchers";
import TokenService from "@/lib/services/TokenService";
import {cookies, headers} from "next/headers";
import SafeError from "@/lib/api-client/SafeError";

export const refreshToken = async () => fetchPublic(
    TokenService,
    async (service) => {
        const cookieHeader = (await headers()).get("cookie") ?? "";

        const newToken = await service.refreshToken(cookieHeader);

        if (!newToken) throw new SafeError("Failed to refresh token");

        const cookieStore = await cookies();
        cookieStore.set("accessToken", newToken, {
            httpOnly: true,
            maxAge: 60 * 15,
            path: "/",
            sameSite: "lax"
        });

        return newToken;
    },
)