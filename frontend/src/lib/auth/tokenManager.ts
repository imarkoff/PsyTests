import {cookies} from "next/headers";

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