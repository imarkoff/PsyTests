import {cookies} from "next/headers";
import {ReadonlyRequestCookies} from "next/dist/server/web/spec-extension/adapters/request-cookies";

export async function getAccessToken() {
    const cookieStore = await cookies();
    return cookieStore.get("accessToken")?.value;
}

export const createAccessToken = (token: string) => ({
    name: "accessToken",
    value: token,
    httpOnly: true,
    expires: new Date(Date.now() + 60 * 15 * 1000),
    path: "/"
})

export const setAccessTokenCookie = async (token: string) => {
    "use server";

    const cookieStore = await cookies();
    cookieStore.set(createAccessToken(token));
}

export const deleteAccessTokenFromCookies = async (cookieStore: ReadonlyRequestCookies) => {
    "use server";

    cookieStore.delete("accessToken");
}