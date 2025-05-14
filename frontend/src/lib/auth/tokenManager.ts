import {cookies} from "next/headers";
import {serialize} from "cookie";

export async function getAccessToken() {
    const cookieStore = await cookies();
    return cookieStore.get("accessToken")?.value;
}

export const serializeAccessToken = (token: string) => (
    serialize("accessToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 15,
        path: "/"
    })
);

export const clearAccessToken = () => (
    serialize("accessToken", "", {
        httpOnly: true,
        expires: new Date(),
        path: "/"
    })
)