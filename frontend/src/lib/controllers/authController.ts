"use server";

import UserLogin from "@/schemas/UserLogin";
import {fetchPublic} from "@/lib/fetchers";
import AuthService from "@/lib/services/AuthService";
import {deleteAccessTokenFromCookies, setAccessTokenCookie} from "@/lib/auth/tokenManager";
import setCookiesByHeader from "@/lib/utils/setCookiesByHeader";
import {cookies} from "next/headers";

export const logIn = async (data: UserLogin) => fetchPublic(
    AuthService,
    async service => {
        const { token, setCookieHeader } = await service.login(data);

        const cookieStore = await cookies();
        if (setCookieHeader) await setCookiesByHeader(cookieStore, setCookieHeader);
        await setAccessTokenCookie(token);

        return { redirectTo: "/dashboard" };
    },
)

export const logOut = async () => fetchPublic(
    AuthService,
    async service => {
        const { setCookieHeader } = await service.logout();

        const cookieStore = await cookies();
        if (setCookieHeader) await setCookiesByHeader(cookieStore, setCookieHeader);
        await deleteAccessTokenFromCookies(cookieStore);

       return { redirectTo: "/login" };
    },
)